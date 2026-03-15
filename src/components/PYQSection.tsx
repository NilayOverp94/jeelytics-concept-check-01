import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Lock, Crown, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { useAICommand } from '@/contexts/AICommandContext';
import { PDFViewer } from '@/components/PDFViewer';

interface PYQItem {
  label: string;
  pdfPath: string | null;
}

// JEE Advanced PYQ data (2007-2025)
const JEE_ADVANCED_YEARS: { year: number; items: PYQItem[] }[] = [];
for (let y = 2025; y >= 2007; y--) {
  // All years 2007-2025 have PDFs except 2017 Paper 2 (>10MB)
  const hasPdf = true;
  JEE_ADVANCED_YEARS.push({
    year: y,
    items: [
      { label: 'Paper 1', pdfPath: hasPdf ? `/pyq/jee-advanced/${y}-paper1.pdf` : null },
      { label: 'Paper 2', pdfPath: (y === 2017) ? null : (hasPdf ? `/pyq/jee-advanced/${y}-paper2.pdf` : null) },
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

// BITSAT with PDFs (2019-2024)
const BITSAT_YEARS: { year: number; items: PYQItem[] }[] = [
  { year: 2025, items: [{ label: 'Full Paper', pdfPath: null }] }, // GDrive failed
  { year: 2024, items: [{ label: 'Full Paper', pdfPath: '/pyq/bitsat/2024.pdf' }] },
  { year: 2023, items: [{ label: 'Full Paper', pdfPath: '/pyq/bitsat/2023.pdf' }] },
  { year: 2022, items: [{ label: 'Full Paper', pdfPath: '/pyq/bitsat/2022.pdf' }] },
  { year: 2021, items: [{ label: 'Full Paper', pdfPath: '/pyq/bitsat/2021.pdf' }] },
  { year: 2020, items: [{ label: 'Full Paper', pdfPath: '/pyq/bitsat/2020.pdf' }] },
  { year: 2019, items: [{ label: 'Full Paper', pdfPath: '/pyq/bitsat/2019.pdf' }] },
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
                  if (!isPremium) {
                    navigate('/pricing');
                    return;
                  }
                  if (item.pdfPath) {
                    setViewingPdf({ url: item.pdfPath, title: `${EXAM_LABELS[examType]} ${year} - ${item.label}` });
                  }
                }}
                disabled={!item.pdfPath && isPremium}
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
                {!isPremium ? (
                  <Lock className="h-4 w-4 text-amber-500" />
                ) : item.pdfPath ? (
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

  // No blur - show the section but with lock icons for free users
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-gradient-primary">Previous Year Questions</h2>
        <p className="text-muted-foreground">View year-wise question papers with solutions</p>
        {isPremium && (
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-400/10 border border-amber-500/20">
            <Crown className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Premium Access</span>
          </div>
        )}
        {!isPremium && !isLoading && (
          <div className="mt-3">
            <Button variant="gradient" size="sm" onClick={() => navigate('/pricing')}>
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to view papers
            </Button>
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

      {viewingPdf && (
        <PDFViewer url={viewingPdf.url} title={viewingPdf.title} onClose={() => setViewingPdf(null)} />
      )}
    </div>
  );
}
