import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, FileText, ClipboardList, Search, Video } from 'lucide-react';

interface Lecture {
  id: string;
  title: string;
  subject: 'Physics' | 'Chemistry' | 'Mathematics';
  topic: string;
  youtubeId: string;
  notesLink?: string;
}

const LECTURES: Lecture[] = [
  {
    id: '1',
    title: 'Vectors - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Vectors',
    youtubeId: 'cS64-wAFDuI',
    notesLink: ''
  },
  {
    id: '2',
    title: 'Matrices - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Matrices and Determinants',
    youtubeId: 'ZtTDs2FZ2Qw',
    notesLink: ''
  },
  {
    id: '3',
    title: 'Basic Math - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Algebra',
    youtubeId: 'UCdxT4d8k5c',
    notesLink: ''
  },
  {
    id: '4',
    title: 'Determinants - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Matrices and Determinants',
    youtubeId: 'hEFge5SsIz0',
    notesLink: ''
  },
  {
    id: '5',
    title: 'Quadratic Equations - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Algebra',
    youtubeId: 'yejWh3kni-o',
    notesLink: ''
  },
  {
    id: '6',
    title: 'Sequence and Series - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Sequences and Series',
    youtubeId: 'zOdUhsMydtM',
    notesLink: ''
  },
  {
    id: '7',
    title: '3D Geometry - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Coordinate Geometry',
    youtubeId: '7v2vYv6Pl7g',
    notesLink: ''
  },
  {
    id: '8',
    title: 'Binomial Theorem - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Binomial Theorem',
    youtubeId: 'YiY0Z5sQ47U',
    notesLink: ''
  },
  {
    id: '9',
    title: 'Relations & Functions - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Functions',
    youtubeId: 'NKth1h8pr7s',
    notesLink: ''
  },
  {
    id: '10',
    title: 'Permutation & Combination - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Permutations and Combinations',
    youtubeId: 'VQ3vHpJzcu0',
    notesLink: ''
  },
  {
    id: '11',
    title: 'Inverse Trigonometric Functions - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Trigonometry',
    youtubeId: 'II05jy4LZ4I',
    notesLink: ''
  },
  {
    id: '12',
    title: 'Trigonometric Functions & Equations - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Trigonometry',
    youtubeId: '-uZzrzAkHn0',
    notesLink: ''
  },
  {
    id: '13',
    title: 'Straight Lines - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Coordinate Geometry',
    youtubeId: 'gZ735nqr9FI',
    notesLink: ''
  },
  {
    id: '14',
    title: 'Definite Integration - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Calculus',
    youtubeId: 'ISth4dTVbWY',
    notesLink: ''
  },
  {
    id: '15',
    title: 'Circles - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Coordinate Geometry',
    youtubeId: 'J1Wv5VLvtXk',
    notesLink: ''
  },
  {
    id: '16',
    title: 'Limits, Continuity & Differentiability - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Calculus',
    youtubeId: '81v0t4OG6Wc',
    notesLink: ''
  },
  {
    id: '17',
    title: 'Parabola - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Coordinate Geometry',
    youtubeId: 'hIeh8YyqgO0',
    notesLink: ''
  },
  {
    id: '18',
    title: 'Application of Derivatives - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Calculus',
    youtubeId: 'ayePGxbHjus',
    notesLink: ''
  },
  {
    id: '19',
    title: 'Hyperbola - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Coordinate Geometry',
    youtubeId: '7ddTpufoqNc',
    notesLink: ''
  },
  {
    id: '20',
    title: 'Complex Numbers - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Complex Numbers',
    youtubeId: 'bOcosA28Ix4',
    notesLink: ''
  },
  {
    id: '21',
    title: 'Statistics - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Statistics',
    youtubeId: '4vI8K3qy3O0',
    notesLink: ''
  },
  {
    id: '22',
    title: 'Differential Equations - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Calculus',
    youtubeId: 'Kqmq47WOvdU',
    notesLink: ''
  },
  {
    id: '23',
    title: 'Probability - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Probability',
    youtubeId: 'xwBmzrCh4S0',
    notesLink: ''
  },
  {
    id: '24',
    title: 'Methods of Differentiation - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Calculus',
    youtubeId: 'e7bnfHnl6PE',
    notesLink: ''
  },
  {
    id: '25',
    title: 'Indefinite Integration - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Calculus',
    youtubeId: '925SY-xvuj8',
    notesLink: ''
  },
  {
    id: '26',
    title: 'Ellipse - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Coordinate Geometry',
    youtubeId: 'vZ_NN3fBhUc',
    notesLink: ''
  },
  {
    id: '27',
    title: 'Area Under Curves - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Calculus',
    youtubeId: 'doc6zf-pddw',
    notesLink: ''
  },
  {
    id: '28',
    title: 'Sets - Complete Lecture',
    subject: 'Mathematics',
    topic: 'Algebra',
    youtubeId: 'ikj6hK55UIM',
    notesLink: ''
  }
];

type Subject = 'Physics' | 'Chemistry' | 'Mathematics';

export function ClassesSection() {
  const navigate = useNavigate();
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

  const LectureCard = ({ lecture }: { lecture: Lecture }) => (
    <Card className="card-jee overflow-hidden">
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

        <TabsContent value="Physics">
          <ComingSoonCard />
        </TabsContent>

        <TabsContent value="Chemistry">
          <ComingSoonCard />
        </TabsContent>

        <TabsContent value="Mathematics">
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
      </Tabs>
    </div>
  );
}
