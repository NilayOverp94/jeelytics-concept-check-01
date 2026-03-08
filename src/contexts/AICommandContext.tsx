import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { findLecture } from '@/data/lectures';
import { SUBJECTS, Subject } from '@/types/jee';
import { useToast } from '@/hooks/use-toast';

export interface AICommand {
  type: 'open_lecture' | 'start_test' | 'open_pyq' | 'none';
  lectureSearch?: string;
  lectureId?: string;
  subject?: string;
  topic?: string;
  difficulty?: 'cbse' | 'jee-mains' | 'jee-advanced';
  questionCount?: number;
  exam?: string;
  year?: number;
}

interface AICommandContextType {
  executeCommand: (command: AICommand) => void;
  setActiveTab: (tab: string) => void;
  setSelectedLectureId: (id: string | null) => void;
  selectedLectureId: string | null;
  activeTab: string;
  pendingSubject: string | null;
  clearPendingSubject: () => void;
  pendingPyqExam: string | null;
  clearPendingPyqExam: () => void;
}

const AICommandContext = createContext<AICommandContextType | undefined>(undefined);

export function AICommandProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('tests');
  const [selectedLectureId, setSelectedLectureId] = useState<string | null>(null);
  const [pendingSubject, setPendingSubject] = useState<string | null>(null);
  const [pendingPyqExam, setPendingPyqExam] = useState<string | null>(null);

  const clearPendingSubject = useCallback(() => setPendingSubject(null), []);
  const clearPendingPyqExam = useCallback(() => setPendingPyqExam(null), []);

  const executeCommand = useCallback((command: AICommand) => {
    console.log('🤖 Executing AI command:', command);

    if (command.type === 'open_lecture') {
      const searchTerm = command.lectureSearch || '';
      const subjectHint = command.subject || '';
      const lecture = findLecture(searchTerm, subjectHint || undefined);
      
      if (lecture) {
        console.log('🤖 Found lecture:', lecture.title, 'Subject:', lecture.subject);
        
        // First switch to classes tab
        setActiveTab('classes');
        
        // Then set the subject and lecture with a small delay to ensure tab switch renders first
        setTimeout(() => {
          setPendingSubject(lecture.subject);
          setSelectedLectureId(lecture.id);
          
          toast({
            title: "Opening Lecture",
            description: `Opening "${lecture.title}" in ${lecture.subject}...`
          });
          
          // Scroll to the lecture after subject tab switch
          setTimeout(() => {
            const element = document.getElementById(`lecture-${lecture.id}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              element.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
              setTimeout(() => {
                element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
              }, 3000);
            }
          }, 300);
        }, 100);
      } else {
        toast({
          title: "Lecture Not Found",
          description: `Could not find a lecture matching "${searchTerm}". Try a different search term.`,
          variant: "destructive"
        });
      }
    } else if (command.type === 'open_pyq') {
      const exam = command.exam || 'jee-main';
      setPendingPyqExam(exam);
      setActiveTab('pyq');
      
      toast({
        title: "Opening PYQs",
        description: `Switching to ${exam.toUpperCase()} PYQ section...`
      });
    } else if (command.type === 'start_test') {
      let subject = command.subject || '';
      let topic = command.topic || '';
      const difficulty = command.difficulty || 'jee-mains';
      const questionCount = command.questionCount || 5;

      const subjectMap: Record<string, Subject> = {
        'physics': 'Physics',
        'chemistry': 'Chemistry',
        'mathematics': 'Mathematics',
        'maths': 'Mathematics',
        'math': 'Mathematics',
      };

      const normalizedSubject = subjectMap[subject.toLowerCase()] || subject as Subject;
      
      if (!SUBJECTS[normalizedSubject as Subject]) {
        toast({
          title: "Invalid Subject",
          description: `"${subject}" is not a valid subject. Choose Physics, Chemistry, or Mathematics.`,
          variant: "destructive"
        });
        return;
      }

      const topics = SUBJECTS[normalizedSubject as Subject];
      let matchedTopic = topics.find(t => 
        t.toLowerCase().includes(topic.toLowerCase()) || 
        topic.toLowerCase().includes(t.toLowerCase())
      );

      if (!matchedTopic) {
        matchedTopic = topics.find(t => {
          const words = topic.toLowerCase().split(' ');
          return words.some(word => t.toLowerCase().includes(word));
        });
      }

      const finalTopic = matchedTopic || topic;

      if (!matchedTopic) {
        toast({
          title: "Topic Not Found",
          description: `Could not find exact match for "${topic}" in ${normalizedSubject}. Using your search term...`,
        });
      }

      toast({
        title: "Starting Test",
        description: `Generating ${questionCount} ${difficulty.toUpperCase()} questions on ${finalTopic}...`
      });

      navigate('/quiz', {
        state: {
          subject: normalizedSubject,
          topic: finalTopic,
          useAI: true,
          questionCount: Math.min(Math.max(questionCount, 3), 25),
          difficulty: difficulty
        }
      });
    }
  }, [navigate, toast]);

  return (
    <AICommandContext.Provider value={{ 
      executeCommand, 
      setActiveTab, 
      setSelectedLectureId,
      selectedLectureId,
      activeTab,
      pendingSubject,
      clearPendingSubject,
      pendingPyqExam,
      clearPendingPyqExam,
    }}>
      {children}
    </AICommandContext.Provider>
  );
}

export function useAICommand() {
  const context = useContext(AICommandContext);
  if (!context) {
    throw new Error('useAICommand must be used within AICommandProvider');
  }
  return context;
}
