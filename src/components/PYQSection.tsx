import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Lock, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { PremiumGate } from '@/components/PremiumGate';

// JEE Main PYQ data
const JEE_MAIN_YEARS = [
  { year: 2025, sessions: ['January', 'April'] },
  { year: 2024, sessions: ['January', 'April'] },
  { year: 2023, sessions: ['January', 'April'] },
  { year: 2022, sessions: ['June', 'July'] },
  { year: 2021, sessions: ['February', 'March', 'July', 'August'] },
  { year: 2020, sessions: ['January', 'September'] },
  { year: 2019, sessions: ['January', 'April'] },
  { year: 2018, sessions: ['April'] },
  { year: 2017, sessions: ['April'] },
  { year: 2016, sessions: ['April'] },
  { year: 2015, sessions: ['April'] },
];

// JEE Advanced PYQ data - Extended from 2007 to 2025
const JEE_ADVANCED_YEARS = [
  { year: 2025, papers: ['Paper 1', 'Paper 2'] },
  { year: 2024, papers: ['Paper 1', 'Paper 2'] },
  { year: 2023, papers: ['Paper 1', 'Paper 2'] },
  { year: 2022, papers: ['Paper 1', 'Paper 2'] },
  { year: 2021, papers: ['Paper 1', 'Paper 2'] },
  { year: 2020, papers: ['Paper 1', 'Paper 2'] },
  { year: 2019, papers: ['Paper 1', 'Paper 2'] },
  { year: 2018, papers: ['Paper 1', 'Paper 2'] },
  { year: 2017, papers: ['Paper 1', 'Paper 2'] },
  { year: 2016, papers: ['Paper 1', 'Paper 2'] },
  { year: 2015, papers: ['Paper 1', 'Paper 2'] },
  { year: 2014, papers: ['Paper 1', 'Paper 2'] },
  { year: 2013, papers: ['Paper 1', 'Paper 2'] },
  { year: 2012, papers: ['Paper 1', 'Paper 2'] },
  { year: 2011, papers: ['Paper 1', 'Paper 2'] },
  { year: 2010, papers: ['Paper 1', 'Paper 2'] },
  { year: 2009, papers: ['Paper 1', 'Paper 2'] },
  { year: 2008, papers: ['Paper 1', 'Paper 2'] },
  { year: 2007, papers: ['Paper 1', 'Paper 2'] },
];

// CUET PYQ data
const CUET_YEARS = [
  { year: 2024, papers: ['Physics', 'Chemistry', 'Mathematics'] },
  { year: 2023, papers: ['Physics', 'Chemistry', 'Mathematics'] },
  { year: 2022, papers: ['Physics', 'Chemistry', 'Mathematics'] },
];

// MHTCET PYQ data
const MHTCET_YEARS = [
  { year: 2024, papers: ['PCM Combined'] },
  { year: 2023, papers: ['PCM Combined'] },
  { year: 2022, papers: ['PCM Combined'] },
  { year: 2021, papers: ['PCM Combined'] },
  { year: 2020, papers: ['PCM Combined'] },
  { year: 2019, papers: ['PCM Combined'] },
];

// BITSAT PYQ data
const BITSAT_YEARS = [
  { year: 2024, papers: ['Full Paper'] },
  { year: 2023, papers: ['Full Paper'] },
  { year: 2022, papers: ['Full Paper'] },
  { year: 2021, papers: ['Full Paper'] },
  { year: 2020, papers: ['Full Paper'] },
  { year: 2019, papers: ['Full Paper'] },
];

type ExamType = 'jee-main' | 'jee-advanced' | 'cuet' | 'mhtcet' | 'bitsat';

const EXAM_COLORS: Record<ExamType, string> = {
  'jee-main': 'bg-primary/20 text-primary',
  'jee-advanced': 'bg-accent/20 text-accent',
  'cuet': 'bg-secondary/20 text-secondary',
  'mhtcet': 'bg-emerald-500/20 text-emerald-500',
  'bitsat': 'bg-violet-500/20 text-violet-500',
};

const EXAM_LABELS: Record<ExamType, string> = {
  'jee-main': 'JEE Main',
  'jee-advanced': 'JEE Advanced',
  'cuet': 'CUET',
  'mhtcet': 'MHTCET',
  'bitsat': 'BITSAT',
};

export function PYQSection() {
  const navigate = useNavigate();
  const { isPremium, isLoading } = useSubscription();
  const [activeExam, setActiveExam] = useState<ExamType>('jee-main');
  const [showPremiumGate, setShowPremiumGate] = useState(false);

  const PYQCard = ({ 
    year, 
    items, 
    examType
  }: { 
    year: number; 
    items: string[]; 
    examType: ExamType;
  }) => (
    <Card className="card-jee hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gradient-primary">{year}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${EXAM_COLORS[examType]}`}>
            {EXAM_LABELS[examType]}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border cursor-not-allowed opacity-70"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{item}</span>
              </div>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-3">
          PDFs coming soon
        </p>
      </CardContent>
    </Card>
  );

  const getExamData = (exam: ExamType) => {
    switch (exam) {
      case 'jee-main':
        return JEE_MAIN_YEARS.map(item => ({ year: item.year, items: item.sessions }));
      case 'jee-advanced':
        return JEE_ADVANCED_YEARS.map(item => ({ year: item.year, items: item.papers }));
      case 'cuet':
        return CUET_YEARS.map(item => ({ year: item.year, items: item.papers }));
      case 'mhtcet':
        return MHTCET_YEARS.map(item => ({ year: item.year, items: item.papers }));
      case 'bitsat':
        return BITSAT_YEARS.map(item => ({ year: item.year, items: item.papers }));
      default:
        return [];
    }
  };

  // Show blurred content with premium gate for free users
  if (!isLoading && !isPremium) {
    return (
      <div className="relative">
        {/* Blurred background content */}
        <div className="blur-sm pointer-events-none select-none">
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2 text-gradient-primary">Previous Year Questions</h2>
              <p className="text-muted-foreground">Download year-wise question papers with solutions</p>
            </div>

            <Tabs defaultValue="jee-main" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-6 h-auto p-1">
                <TabsTrigger value="jee-main" className="text-xs sm:text-sm py-2">JEE Main</TabsTrigger>
                <TabsTrigger value="jee-advanced" className="text-xs sm:text-sm py-2">JEE Adv</TabsTrigger>
                <TabsTrigger value="cuet" className="text-xs sm:text-sm py-2">CUET</TabsTrigger>
                <TabsTrigger value="mhtcet" className="text-xs sm:text-sm py-2">MHTCET</TabsTrigger>
                <TabsTrigger value="bitsat" className="text-xs sm:text-sm py-2">BITSAT</TabsTrigger>
              </TabsList>

              <TabsContent value="jee-main">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {getExamData('jee-main').slice(0, 4).map((item) => (
                    <PYQCard key={item.year} year={item.year} items={item.items} examType="jee-main" />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Premium lock overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
          <Card className="card-jee max-w-md mx-4 shadow-2xl">
            <CardContent className="pt-8 pb-6 text-center">
              <div className="mx-auto mb-4 p-4 rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-400/20 w-fit">
                <Lock className="h-10 w-10 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Feature</h3>
              <p className="text-muted-foreground mb-6">
                Access to all PYQ papers from 2007-2025 is available for premium subscribers.
              </p>
              <div className="space-y-3">
                <Button 
                  variant="gradient" 
                  className="w-full"
                  onClick={() => navigate('/pricing')}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
                <p className="text-xs text-muted-foreground">
                  Starting at just ₹29/month
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <PremiumGate 
          open={showPremiumGate} 
          onOpenChange={setShowPremiumGate}
          title="PYQ Access Locked"
          description="Get access to 19 years of JEE Advanced papers and more with Premium."
          feature="PYQ papers"
        />
      </div>
    );
  }

  // Premium users see full content
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-gradient-primary">Previous Year Questions</h2>
        <p className="text-muted-foreground">Download year-wise question papers with solutions</p>
        {isPremium && (
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-400/10 border border-amber-500/20">
            <Crown className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Premium Access</span>
          </div>
        )}
      </div>

      {/* Exam Type Tabs */}
      <Tabs defaultValue="jee-main" value={activeExam} onValueChange={(value) => setActiveExam(value as ExamType)} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6 h-auto p-1">
          <TabsTrigger 
            value="jee-main" 
            className="text-xs sm:text-sm py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-glow data-[state=active]:text-white"
          >
            JEE Main
          </TabsTrigger>
          <TabsTrigger 
            value="jee-advanced"
            className="text-xs sm:text-sm py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-accent-glow data-[state=active]:text-white"
          >
            JEE Adv
          </TabsTrigger>
          <TabsTrigger 
            value="cuet"
            className="text-xs sm:text-sm py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary data-[state=active]:to-secondary-glow data-[state=active]:text-white"
          >
            CUET
          </TabsTrigger>
          <TabsTrigger 
            value="mhtcet"
            className="text-xs sm:text-sm py-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
          >
            MHTCET
          </TabsTrigger>
          <TabsTrigger 
            value="bitsat"
            className="text-xs sm:text-sm py-2 data-[state=active]:bg-violet-500 data-[state=active]:text-white"
          >
            BITSAT
          </TabsTrigger>
        </TabsList>

        {(['jee-main', 'jee-advanced', 'cuet', 'mhtcet', 'bitsat'] as ExamType[]).map((exam) => (
          <TabsContent key={exam} value={exam}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getExamData(exam).map((item) => (
                <PYQCard 
                  key={item.year} 
                  year={item.year} 
                  items={item.items} 
                  examType={exam}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Info Card */}
      <Card className="card-jee bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-primary/20">
        <CardContent className="py-6 text-center">
          <Download className="h-10 w-10 text-primary mx-auto mb-3" />
          <h3 className="font-semibold mb-2">PDFs Will Be Available Soon!</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            We're preparing high-quality PYQ papers with detailed solutions. Check back soon for downloads!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
