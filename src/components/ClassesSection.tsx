import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, ClipboardList, Search, Video, Play, Eye } from 'lucide-react';
import { LECTURES, Lecture } from '@/data/lectures';
import { useAICommand } from '@/contexts/AICommandContext';
import { PDFViewer } from '@/components/PDFViewer';

type Subject = 'Physics' | 'Chemistry' | 'Mathematics';

export function ClassesSection() {
  const navigate = useNavigate();
  const { selectedLectureId, setSelectedLectureId, pendingSubject, clearPendingSubject } = useAICommand();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubject, setActiveSubject] = useState<Subject>('Mathematics');
  const [viewingPdf, setViewingPdf] = useState<{ url: string; title: string } | null>(null);

  // Pick up pending subject from AI command (fires on mount or when pendingSubject changes)
  useEffect(() => {
    if (pendingSubject) {
      setActiveSubject(pendingSubject as Subject);
      clearPendingSubject();
    }
  }, [pendingSubject, clearPendingSubject]);

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
      const matchesSearch = searchQuery === '' || 
        lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lecture.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lecture.subject.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (searchQuery) {
        return matchesSearch;
      }
      
      return lecture.subject === activeSubject;
    });
  }, [activeSubject, searchQuery]);

  const isSearching = searchQuery.length > 0;

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
    const [isPlaying, setIsPlaying] = useState(false);
    
    const handlePlay = useCallback(() => {
      setIsPlaying(true);
    }, []);
    
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
          <div className="aspect-video rounded-lg overflow-hidden bg-muted relative">
            {isPlaying ? (
              <iframe
                src={`https://www.youtube.com/embed/${lecture.youtubeId}?autoplay=1`}
                title={lecture.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <button
                onClick={handlePlay}
                className="w-full h-full relative group cursor-pointer bg-black"
                aria-label={`Play ${lecture.title}`}
              >
                <img
                  src={`https://img.youtube.com/vi/${lecture.youtubeId}/hqdefault.jpg`}
                  alt={lecture.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-70 transition-opacity"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="h-7 w-7 text-white ml-1" fill="white" />
                  </div>
                </div>
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1 h-12"
              disabled={!lecture.notesLink}
              onClick={() => {
                if (lecture.notesLink) {
                  setViewingPdf({ url: lecture.notesLink, title: `${lecture.title} - Notes` });
                }
              }}
            >
              {lecture.notesLink ? (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  View Notes
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Notes Coming Soon
                </>
              )}
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

      {isSearching ? (
        <div className="grid gap-6">
          {filteredLectures.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground text-center">
                Found {filteredLectures.length} lecture{filteredLectures.length > 1 ? 's' : ''} matching "{searchQuery}"
              </p>
              {filteredLectures.map((lecture) => (
                <LectureCard key={lecture.id} lecture={lecture} />
              ))}
            </>
          ) : (
            <Card className="card-jee">
              <CardContent className="py-12 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                <p className="text-muted-foreground">
                  No lectures match "{searchQuery}". Try a different search term.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
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
                ) : (
                  <ComingSoonCard />
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* PDF Viewer Modal */}
      {viewingPdf && (
        <PDFViewer
          url={viewingPdf.url}
          title={viewingPdf.title}
          onClose={() => setViewingPdf(null)}
        />
      )}
    </div>
  );
}
