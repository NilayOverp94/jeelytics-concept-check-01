import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Lock, Crown, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { PremiumGate } from '@/components/PremiumGate';
import { useAICommand } from '@/contexts/AICommandContext';
import { PDFViewer } from '@/components/PDFViewer';

// PDF path helper for JEE Advanced
const getAdvancedPdfPath = (year: number, paper: number): string | null => {
  // 2017 Paper 2 was too large to store locally
  if (year === 2017 && paper === 2) return null;
  return `/pyq/jee-advanced/${year}-paper${paper}.pdf`;
};

interface PYQItem {
  label: string;
  pdfPath: string | null;
}

// JEE Advanced PYQ data with PDF paths (2007-2020 have PDFs)
const JEE_ADVANCED_YEARS: { year: number; items: PYQItem[] }[] = [];
for (let y = 2025; y >= 2007; y--) {
  JEE_ADVANCED_YEARS.push({
    year: y,
    items: [
      { label: 'Paper 1', pdfPath: y <= 2020 ? getAdvancedPdfPath(y, 1) : null },
      { label: 'Paper 2', pdfPath: y <= 2020 ? getAdvancedPdfPath(y, 2) : null },
    ]
  });
}

// JEE Main PYQ data (no PDFs yet)
const JEE_MAIN_YEARS: { year: number; items: PYQItem[] }[] = [
  { year: 2025, items: [{ label: 'January', pdfPath: null }, { label: 'April', pdfPath: null }] },
  { year: 2024, items: [{ label: 'January', pdfPath: null }, { label: 'April', pdfPath: null }] },
  { year: 2023, items: [{ label: 'January', pdfPath: null }, { label: 'April', pdfPath: null }] },
  { year: 2022, items: [{ label: 'June', pdfPath: null }, { label: 'July', pdfPath: null }] },
  { year: 2021, items: [{ label: 'February', pdfPath: null }, { label: 'March', pdfPath: null }, { label: 'July', pdfPath: null }, { label: 'August', pdfPath: null }] },
  { year: 2020, items: [{ label: 'January', pdfPath: null }, { label: 'September', pdfPath: null }] },
  { year: 2019, items: [{ label: 'January', pdfPath: null }, { label: 'April', pdfPath: null }] },
  { year: 2018, items: [{ label: 'April', pdfPath: null }] },
  { year: 2017, items: [{ label: 'April', pdfPath: null }] },
  { year: 2016, items: [{ label: 'April', pdfPath: null }] },
  { year: 2015, items: [{ label: 'April', pdfPath: null }] },
];

// Other exams (no PDFs yet)
const makePlainItems = (labels: string[]): PYQItem[] => labels.map(l => ({ label: l, pdfPath: null }));

const CUET_YEARS = [
  { year: 2024, items: makePlainItems(['Physics', 'Chemistry', 'Mathematics']) },
  { year: 2023, items: makePlainItems(['Physics', 'Chemistry', 'Mathematics']) },
  { year: 2022, items: makePlainItems(['Physics', 'Chemistry', 'Mathematics']) },
];

const MHTCET_YEARS = [
  { year: 2024, items: makePlainItems(['PCM Combined']) },
  { year: 2023, items: makePlainItems(['PCM Combined']) },
  { year: 2022, items: makePlainItems(['PCM Combined']) },
  { year: 2021, items: makePlainItems(['PCM Combined']) },
  { year: 2020, items: makePlainItems(['PCM Combined']) },
  { year: 2019, items: makePlainItems(['PCM Combined']) },
];

const BITSAT_YEARS = [
  { year: 2024, items: makePlainItems(['Full Paper']) },
  { year: 2023, items: makePlainItems(['Full Paper']) },
  { year: 2022, items: makePlainItems(['Full Paper']) },
  { year: 2021, items: makePlainItems(['Full Paper']) },
  { year: 2020, items: makePlainItems(['Full Paper']) },
  { year: 2019, items: makePlainItems(['Full Paper']) },
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
  const { pendingPyqExam, clearPendingPyqExam } = useAICommand();
  const [activeExam, setActiveExam] = useState<ExamType>('jee-main');
  const [showPremiumGate, setShowPremiumGate] = useState(false);
  const [viewingPdf, setViewingPdf] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    if (pendingPyqExam) {
      const examMap: Record<string, ExamType> = {
        'jee-main': 'jee-main', 'jee main': 'jee-main', 'jee-mains': 'jee-main', 'jee mains': 'jee-main',
        'jee-advanced': 'jee-advanced', 'jee advanced': 'jee-advanced', 'jee-adv': 'jee-advanced',
        'cuet': 'cuet', 'mhtcet': 'mhtcet', 'bitsat': 'bitsat',
      };
      setActiveExam(examMap[pendingPyqExam.toLowerCase()] || 'jee-main');
      clearPendingPyqExam();
    }
  }, [pendingPyqExam, clearPendingPyqExam]);

  const PYQCard = ({ year, items, examType }: { year: number; items: PYQItem[]; examType: ExamType }) => {
    const hasAnyPdf = items.some(i => i.pdfPath);

    return (
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
              <button
                key={index}
                onClick={() => {
                  if (item.pdfPath) {
                    setViewingPdf({ url: item.pdfPath, title: `JEE Advanced ${year} - ${item.label}` });
                  }
                }}
                disabled={!item.pdfPath}
                className={`flex items-center justify-between p-3 rounded-lg border border-border text-left transition-colors ${
                  item.pdfPath
                    ? 'bg-primary/5 hover:bg-primary/10 cursor-pointer'
                    : 'bg-muted/50 cursor-not-allowed opacity-70'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className={`h-4 w-4 ${item.pdfPath ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.pdfPath ? (
                  <Eye className="h-4 w-4 text-primary" />
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            ))}
          </div>
          {!hasAnyPdf && (
            <p className="text-xs text-muted-foreground text-center mt-3">PDFs coming soon</p>
          )}
        </CardContent>
      </Card>
    );
  };

  const getExamData = (exam: ExamType) => {
    switch (exam) {
      case 'jee-main': return JEE_MAIN_YEARS;
      case 'jee-advanced': return JEE_ADVANCED_YEARS;
      case 'cuet': return CUET_YEARS;
      case 'mhtcet': return MHTCET_YEARS;
      case 'bitsat': return BITSAT_YEARS;
      default: return [];
    }
  };

  if (!isLoading && !isPremium) {
    return (
      <div className="relative">
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
                <Button variant="gradient" className="w-full" onClick={() => navigate('/pricing')}>
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Premium
                </Button>
                <p className="text-xs text-muted-foreground">Starting at just ₹29/month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <PremiumGate open={showPremiumGate} onOpenChange={setShowPremiumGate} title="PYQ Access Locked" description="Get access to 19 years of JEE Advanced papers and more with Premium." feature="PYQ papers" />
      </div>
    );
  }

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

      <Tabs defaultValue="jee-main" value={activeExam} onValueChange={(v) => setActiveExam(v as ExamType)} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6 h-auto p-1">
          <TabsTrigger value="jee-main" className="text-xs sm:text-sm py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-glow data-[state=active]:text-white">JEE Main</TabsTrigger>
          <TabsTrigger value="jee-advanced" className="text-xs sm:text-sm py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-accent-glow data-[state=active]:text-white">JEE Adv</TabsTrigger>
          <TabsTrigger value="cuet" className="text-xs sm:text-sm py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary data-[state=active]:to-secondary-glow data-[state=active]:text-white">CUET</TabsTrigger>
          <TabsTrigger value="mhtcet" className="text-xs sm:text-sm py-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">MHTCET</TabsTrigger>
          <TabsTrigger value="bitsat" className="text-xs sm:text-sm py-2 data-[state=active]:bg-violet-500 data-[state=active]:text-white">BITSAT</TabsTrigger>
        </TabsList>

        {(['jee-main', 'jee-advanced', 'cuet', 'mhtcet', 'bitsat'] as ExamType[]).map((exam) => (
          <TabsContent key={exam} value={exam}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getExamData(exam).map((item) => (
                <PYQCard key={item.year} year={item.year} items={item.items} examType={exam} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="card-jee bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-primary/20">
        <CardContent className="py-6 text-center">
          <Download className="h-10 w-10 text-primary mx-auto mb-3" />
          <h3 className="font-semibold mb-2">More PDFs Coming Soon!</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            JEE Advanced 2007-2020 papers are now viewable! More exams coming soon.
          </p>
        </CardContent>
      </Card>

      {viewingPdf && (
        <PDFViewer url={viewingPdf.url} title={viewingPdf.title} onClose={() => setViewingPdf(null)} />
      )}
    </div>
  );
}
