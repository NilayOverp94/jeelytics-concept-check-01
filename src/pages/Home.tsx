import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Brain, BookOpen, Calculator, Zap, LogOut, User, GraduationCap, ClipboardList, Play, FileText, Sparkles } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { ThemeToggle } from '@/components/ThemeToggle';
import { StreakDisplay } from '@/components/StreakDisplay';
import { SUBJECTS, Subject } from '@/types/jee';
import { UserStats } from '@/types/jee';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AIAssistant } from '@/components/AIAssistant';
import useSEO from '@/hooks/useSEO';
import logo from '@/assets/logo.png';
import { ClassesSection } from '@/components/ClassesSection';

const SUBJECT_ICONS: Record<Subject, any> = {
  Physics: Zap,
  Chemistry: BookOpen,
  Mathematics: Calculator
};

const SUBJECT_COLORS: Record<Subject, string> = {
  Physics: 'from-primary to-primary-glow',
  Chemistry: 'from-secondary to-secondary-glow',
  Mathematics: 'from-accent to-accent-glow'
};

export default function Home() {
  useSEO({
    title: "Dashboard | JEElytics - Your JEE Practice Hub",
    description: "Start your AI-powered JEE practice test. Choose from Physics, Chemistry, and Mathematics topics at your preferred difficulty level.",
    canonical: "https://jeelytics-concept-check-01.lovable.app/home"
  });

  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    signOut
  } = useAuth();
  const {
    toast
  } = useToast();
  const [selectedSubject, setSelectedSubject] = useState<Subject | ''>('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [questionCount, setQuestionCount] = useState<3 | 5 | 25>(5);
  const [difficulty, setDifficulty] = useState<'cbse' | 'jee-mains' | 'jee-advanced'>('jee-mains');
  // Removed useAIQuestions state - all questions are now AI-generated
  const [userStats, setUserStats] = useState<UserStats>({
    streak: 0,
    lastTestDate: null,
    testHistory: [],
    totalTests: 0,
    totalScore: 0
  });

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  // Refresh stats when returning from test or when location state changes
  useEffect(() => {
    if (user && location.state?.refresh) {
      console.log('🔄 Refresh triggered by navigation state, fetching stats...');
      fetchUserStats();
    }
  }, [location.state, user]);

  // Refresh stats when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        console.log('🔄 Page became visible, refreshing stats...');
        fetchUserStats();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;
    console.log('🏠 Fetching user stats for user:', user.id);
    try {
      const {
        data,
        error
      } = await supabase.from('user_stats').select('*').eq('user_id', user.id).maybeSingle();
      if (error) {
        console.error('❌ Error fetching user stats:', error);
        return;
      }
      console.log('📊 Fetched user stats:', data);
      if (data) {
        setUserStats({
          streak: data.streak,
          lastTestDate: data.last_test_date ? new Date(data.last_test_date) : null,
          testHistory: [],
          totalTests: data.total_tests,
          totalScore: data.total_score
        });
        console.log('✅ User stats updated in state');
      } else {
        console.log('ℹ️ No user stats found, using defaults');
      }
    } catch (error) {
      console.error('💥 Unexpected error fetching user stats:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleStartTest = () => {
    if (selectedSubject && selectedTopic) {
      navigate('/quiz', {
        state: {
          subject: selectedSubject,
          topic: selectedTopic,
          useAI: true, // Always use AI-generated questions
          questionCount,
          difficulty
        }
      });
    }
  };

  const isStartDisabled = !selectedSubject || !selectedTopic;

  return (
    <div className="min-h-screen bg-background pt-safe">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 pt-safe">
        <div className="container mx-auto px-3 sm:px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src={logo}
                alt="JEElytics logo"
                className="h-8 w-8 rounded"
                loading="eager"
              />
              <h1 className="text-xl sm:text-2xl font-bold text-gradient-primary">
                JEElytics
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <StreakDisplay streak={userStats.streak} />
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full touch-target">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border border-border">
                  <DropdownMenuItem disabled className="font-medium text-sm">
                    {user?.user_metadata?.name || user?.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive touch-target">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 pb-safe">
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <Tabs defaultValue="tests" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8 h-12 sm:h-14">
              <TabsTrigger value="tests" className="text-sm sm:text-lg h-10 sm:h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-glow data-[state=active]:text-white">
                <ClipboardList className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Tests
              </TabsTrigger>
              <TabsTrigger value="classes" className="text-sm sm:text-lg h-10 sm:h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary data-[state=active]:to-secondary-glow data-[state=active]:text-white">
                <GraduationCap className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Classes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tests">
              {/* New Features Announcement */}
              <div className="mb-8 p-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 rounded-xl animate-fade-in">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-primary">New Features Available!</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <Play className="h-8 w-8 text-secondary" />
                    <div>
                      <p className="font-medium text-sm">Recorded Lectures</p>
                      <p className="text-xs text-muted-foreground">Video lessons from experts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <FileText className="h-8 w-8 text-accent" />
                    <div>
                      <p className="font-medium text-sm">Notes & Resources</p>
                      <p className="text-xs text-muted-foreground">Study materials coming soon</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                    <Sparkles className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium text-sm">More Coming Soon</p>
                      <p className="text-xs text-muted-foreground">Stay tuned for updates!</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Check out the <span className="font-semibold text-secondary">Classes</span> tab to access recorded lectures!
                </p>
              </div>

              {/* Hero Section */}
              <div className="text-center mb-8 sm:mb-12 animate-fade-in">
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gradient-primary leading-tight">
                  Your Concept Strength Checker
                </h2>
                <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 px-2">Master JEE concepts with AI-powered assessments!</p>
                
                {/* Stats */}
                {userStats.totalTests > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <Card className="card-jee">
                      <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-primary">{userStats.totalTests}</div>
                        <div className="text-sm text-muted-foreground">Tests Taken</div>
                      </CardContent>
                    </Card>
                    <Card className="card-jee">
                      <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-secondary">
                          {userStats.totalTests > 0 ? Math.round(userStats.totalScore / (userStats.totalTests * 5) * 100) : 0}%
                        </div>
                        <div className="text-sm text-muted-foreground">Average Score</div>
                      </CardContent>
                    </Card>
                    <Card className="card-jee">
                      <CardContent className="pt-6">
                        <div className="text-3xl font-bold text-accent">{userStats.streak}</div>
                        <div className="text-sm text-muted-foreground">Day Streak</div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

          {/* Test Configuration */}
          <Card className="card-jee animate-scale-in">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Start Your Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Subject Selection */}
              <div className="space-y-4">
                <label className="text-sm font-medium">Select Subject</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.keys(SUBJECTS).map(subject => {
                    const SubjectIcon = SUBJECT_ICONS[subject as Subject];
                    const isSelected = selectedSubject === subject;
                    return (
                      <Button
                        key={subject}
                        variant={isSelected ? "default" : "outline"}
                        className={`h-20 flex-col gap-2 ${
                          isSelected 
                            ? `bg-gradient-to-r ${SUBJECT_COLORS[subject as Subject]} text-white shadow-glow` 
                            : 'hover:shadow-card'
                        }`}
                        onClick={() => {
                          setSelectedSubject(subject as Subject);
                          setSelectedTopic('');
                        }}
                      >
                        <SubjectIcon className="h-8 w-8" />
                        <span className="font-semibold">{subject}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Topic Selection */}
              {selectedSubject && (
                <div className="space-y-4 animate-fade-in">
                  <label className="text-sm font-medium">Select Topic</label>
                  <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                    <SelectTrigger className="w-full h-12">
                      <SelectValue placeholder="Choose a topic to practice" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border border-border">
                      {SUBJECTS[selectedSubject].map(topic => (
                        <SelectItem key={topic} value={topic} className="hover:bg-muted">
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Question Count Selection */}
              {selectedSubject && selectedTopic && (
                <div className="space-y-4 animate-fade-in">
                  <label className="text-sm font-medium">Number of Questions</label>
                  <div className="grid grid-cols-3 gap-3">
                    {([3, 5, 25] as const).map((count) => (
                      <Button
                        key={count}
                        variant={questionCount === count ? "default" : "outline"}
                        className={`h-12 ${
                          questionCount === count
                            ? 'bg-gradient-to-r from-primary to-primary-glow text-white shadow-glow'
                            : 'hover:shadow-card'
                        }`}
                        onClick={() => setQuestionCount(count)}
                      >
                        {count} Questions
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Difficulty Level Selection */}
              {selectedSubject && selectedTopic && (
                <div className="space-y-4 animate-fade-in">
                  <label className="text-sm font-medium">Difficulty Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant={difficulty === 'cbse' ? "default" : "outline"}
                      className={`h-12 ${
                        difficulty === 'cbse'
                          ? 'bg-gradient-to-r from-secondary to-secondary-glow text-white shadow-glow'
                          : 'hover:shadow-card'
                      }`}
                      onClick={() => setDifficulty('cbse')}
                    >
                      CBSE
                    </Button>
                    <Button
                      variant={difficulty === 'jee-mains' ? "default" : "outline"}
                      className={`h-12 ${
                        difficulty === 'jee-mains'
                          ? 'bg-gradient-to-r from-accent to-accent-glow text-white shadow-glow'
                          : 'hover:shadow-card'
                      }`}
                      onClick={() => setDifficulty('jee-mains')}
                    >
                      JEE Mains
                    </Button>
                    <Button
                      variant={difficulty === 'jee-advanced' ? "default" : "outline"}
                      className={`h-12 ${
                        difficulty === 'jee-advanced'
                          ? 'bg-gradient-to-r from-primary to-primary-glow text-white shadow-glow'
                          : 'hover:shadow-card'
                      }`}
                      onClick={() => setDifficulty('jee-advanced')}
                    >
                      JEE Advanced
                    </Button>
                  </div>
                </div>
              )}

              {/* AI Questions Info */}
              {selectedSubject && selectedTopic && (
                <div className="space-y-3 animate-fade-in">
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      <label className="text-sm font-medium text-primary">AI Generated Questions</label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      All questions are freshly generated by AI for each test
                    </p>
                  </div>
                  
                  {/* Question Type Info for 25 questions */}
                  {questionCount === 25 && (difficulty === 'jee-mains' || difficulty === 'jee-advanced') && (
                    <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-accent">Note:</span> This test will include <span className="font-medium">20 MCQ questions</span> + <span className="font-medium">5 Integer type questions</span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-4">
                <Button
                  variant={isStartDisabled ? "outline" : "gradient"}
                  className={`w-full h-12 sm:h-14 text-base sm:text-lg font-semibold btn-mobile ${
                    isStartDisabled 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:scale-105 transform transition-all active:scale-[0.98]'
                  }`}
                  onClick={handleStartTest}
                  disabled={isStartDisabled}
                >
                  {isStartDisabled ? 'Select Subject & Topic' : 'Start Test 🚀'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <Card className="card-jee hover:scale-105 transition-transform">
              <CardContent className="pt-6 text-center">
                <Brain className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">AI-Powered</h3>
                <p className="text-sm text-muted-foreground">Smart question generation and analysis</p>
              </CardContent>
            </Card>
            <Card className="card-jee hover:scale-105 transition-transform">
              <CardContent className="pt-6 text-center">
                <Zap className="h-12 w-12 text-secondary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Instant Results</h3>
                <p className="text-sm text-muted-foreground">Get immediate feedback and tips</p>
              </CardContent>
            </Card>
            <Card className="card-jee hover:scale-105 transition-transform">
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-12 w-12 text-accent mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Track Progress</h3>
                <p className="text-sm text-muted-foreground">Monitor your improvement over time</p>
              </CardContent>
            </Card>
            <Card className="card-jee hover:scale-105 transition-transform">
              <CardContent className="pt-6 text-center">
                <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">JEE Focused</h3>
                <p className="text-sm text-muted-foreground">Questions aligned with JEE patterns</p>
              </CardContent>
            </Card>
          </div>
            </TabsContent>

            <TabsContent value="classes">
              <ClassesSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* AI Assistant - Floating */}
      <AIAssistant />
    </div>
  );
}