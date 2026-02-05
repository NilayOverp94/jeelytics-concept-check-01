import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Lock } from 'lucide-react';
import { useState } from 'react';

// JEE Main PYQ data
const JEE_MAIN_YEARS = [
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

// JEE Advanced PYQ data
const JEE_ADVANCED_YEARS = [
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
  const [activeExam, setActiveExam] = useState<ExamType>('jee-main');

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

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-gradient-primary">Previous Year Questions</h2>
        <p className="text-muted-foreground">Download year-wise question papers with solutions</p>
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
