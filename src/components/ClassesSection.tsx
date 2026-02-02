import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, ClipboardList, Search, Video } from 'lucide-react';
import { LECTURES, Lecture } from '@/data/lectures';
import { useAICommand } from '@/contexts/AICommandContext';

type Subject = 'Physics' | 'Chemistry' | 'Mathematics';

export function ClassesSection() {
  const navigate = useNavigate();
  const { selectedLectureId, setSelectedLectureId } = useAICommand();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubject, setActiveSubject] = useState<Subject>('Mathematics');

  const handleStartTest = (subject: string, topic: string) => {
    navigate('/quiz', {
      state: {
        subject,
        topic,
        useAI: true,
        questionCount: 5,
        difficulty: 'jee-mains'
      }
    });
  };

  const filteredLectures = useMemo(() => {
    return LECTURES.filter(lecture => {
      const matchesSubject = lecture.subject === activeSubject;
      const matchesSearch = searchQuery === '' || 
        lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lecture.topic.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSubject && matchesSearch;
    });
  }, [activeSubject, searchQuery]);

  const ComingSoonCard = () => (
    <Card className="card-jee">
      <CardContent className="py-12 text-center">
        <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Videos Coming Soon</h3>
        <p className="text-muted-foreground">
          We're working on adding {activeSubject} lectures. Check back soon!
        </p>
      </CardContent>
    </Card>
  );

  const LectureCard = ({ lecture }: { lecture: Lecture }) => {
    const isHighlighted = selectedLectureId === lecture.id;
    
    return (
      <Card 
        id={`lecture-${lecture.id}`}
        className={`card-jee overflow-hidden transition-all duration-300 ${
          isHighlighted ? 'ring-2 ring-primary ring-offset-2 shadow-lg' : ''
        }`}
        onClick={() => {
          if (isHighlighted) {
            setSelectedLectureId(null);
          }
        }}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              lecture.subject === 'Physics' ? 'bg-primary/20 text-primary' :
              lecture.subject === 'Chemistry' ? 'bg-secondary/20 text-secondary' :
              'bg-accent/20 text-accent'
            }`}>
              {lecture.subject}
            </span>
            <span className="text-xs text-muted-foreground">{lecture.topic}</span>
          </div>
          <CardTitle className="text-xl mt-2">{lecture.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-video rounded-lg overflow-hidden bg-muted">
            <iframe
              src={`https://www.youtube.com/embed/${lecture.youtubeId}`}
              title={lecture.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1 h-12"
              disabled={!lecture.notesLink}
              onClick={() => lecture.notesLink && window.open(lecture.notesLink, '_blank')}
            >
              <FileText className="mr-2 h-4 w-4" />
              {lecture.notesLink ? 'View Notes' : 'Notes Coming Soon'}
            </Button>
            <Button
              variant="gradient"
              className="flex-1 h-12"
              onClick={() => handleStartTest(lecture.subject, lecture.topic)}
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              Practice Test (5 Qs)
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-gradient-primary">Video Lectures</h2>
        <p className="text-muted-foreground">Watch recorded lectures and practice with related tests</p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search lectures..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Subject Tabs */}
      <Tabs defaultValue="Mathematics" value={activeSubject} onValueChange={(value) => setActiveSubject(value as Subject)} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="Physics">Physics</TabsTrigger>
          <TabsTrigger value="Chemistry">Chemistry</TabsTrigger>
          <TabsTrigger value="Mathematics">Maths</TabsTrigger>
        </TabsList>

        {['Physics', 'Chemistry', 'Mathematics'].map((subject) => (
          <TabsContent key={subject} value={subject}>
            <div className="grid gap-6">
              {filteredLectures.length > 0 ? (
                filteredLectures.map((lecture) => (
                  <LectureCard key={lecture.id} lecture={lecture} />
                ))
              ) : searchQuery ? (
                <Card className="card-jee">
                  <CardContent className="py-12 text-center">
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                    <p className="text-muted-foreground">
                      No lectures match "{searchQuery}". Try a different search term.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <ComingSoonCard />
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
