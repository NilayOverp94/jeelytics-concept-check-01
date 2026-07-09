import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Lock, Crown, Eye } from 'lucide-react';
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
  JEE_ADVANCED_YEARS.push({
    year: y,
    items: [
      { label: 'Paper 1', pdfPath: `/pyq/jee-advanced/${y}-paper1.pdf` },
      { label: 'Paper 2', pdfPath: `/pyq/jee-advanced/${y}-paper2.pdf` },
    ]
  });
}

// JEE Main PYQ data with external links
const JEE_MAIN_YEARS: { year: number; items: PYQItem[] }[] = [
  { year: 2025, items: [
    { label: 'Jan 22 Shift 1', pdfPath: 'https://jeemain.nta.ac.in/previous-year-papers/2025/jan/shift1.pdf' },
    { label: 'Jan 22 Shift 2', pdfPath: 'https://jeemain.nta.ac.in/previous-year-papers/2025/jan/shift2.pdf' },
    { label: 'Jan 23 Shift 1', pdfPath: null },
    { label: 'Jan 23 Shift 2', pdfPath: null },
    { label: 'Jan 24 Shift 1', pdfPath: null },
    { label: 'Jan 24 Shift 2', pdfPath: null },
    { label: 'April (Coming)', pdfPath: null },
  ]},
  { year: 2024, items: [
    { label: 'Jan 27 Shift 1', pdfPath: 'https://jeemain.nta.ac.in/previous-year-papers/2024/jan27-s1.pdf' },
    { label: 'Jan 27 Shift 2', pdfPath: 'https://jeemain.nta.ac.in/previous-year-papers/2024/jan27-s2.pdf' },
    { label: 'Jan 29 Shift 1', pdfPath: null },
    { label: 'Jan 29 Shift 2', pdfPath: null },
    { label: 'Jan 30 Shift 1', pdfPath: null },
    { label: 'Jan 30 Shift 2', pdfPath: null },
    { label: 'Jan 31 Shift 1', pdfPath: null },
    { label: 'Jan 31 Shift 2', pdfPath: null },
    { label: 'Apr 4 Shift 1', pdfPath: null },
    { label: 'Apr 4 Shift 2', pdfPath: null },
    { label: 'Apr 5 Shift 1', pdfPath: null },
    { label: 'Apr 5 Shift 2', pdfPath: null },
    { label: 'Apr 8 Shift 1', pdfPath: null },
    { label: 'Apr 8 Shift 2', pdfPath: null },
    { label: 'Apr 9 Shift 1', pdfPath: null },
    { label: 'Apr 9 Shift 2', pdfPath: null },
  ]},
  { year: 2023, items: [
    { label: 'Jan 24 Shift 1', pdfPath: null },
    { label: 'Jan 24 Shift 2', pdfPath: null },
    { label: 'Jan 25 Shift 1', pdfPath: null },
    { label: 'Jan 25 Shift 2', pdfPath: null },
    { label: 'Jan 29 Shift 1', pdfPath: null },
    { label: 'Jan 29 Shift 2', pdfPath: null },
    { label: 'Jan 30 Shift 1', pdfPath: null },
    { label: 'Jan 30 Shift 2', pdfPath: null },
    { label: 'Jan 31 Shift 1', pdfPath: null },
    { label: 'Jan 31 Shift 2', pdfPath: null },
    { label: 'Apr 6 Shift 1', pdfPath: null },
    { label: 'Apr 6 Shift 2', pdfPath: null },
    { label: 'Apr 8 Shift 1', pdfPath: null },
    { label: 'Apr 8 Shift 2', pdfPath: null },
    { label: 'Apr 10 Shift 1', pdfPath: null },
    { label: 'Apr 10 Shift 2', pdfPath: null },
    { label: 'Apr 11 Shift 1', pdfPath: null },
    { label: 'Apr 11 Shift 2', pdfPath: null },
    { label: 'Apr 12 Shift 1', pdfPath: null },
    { label: 'Apr 12 Shift 2', pdfPath: null },
    { label: 'Apr 13 Shift 1', pdfPath: null },
    { label: 'Apr 13 Shift 2', pdfPath: null },
  ]},
  { year: 2022, items: [
    { label: 'June 24 Shift 1', pdfPath: null },
    { label: 'June 24 Shift 2', pdfPath: null },
    { label: 'June 25 Shift 1', pdfPath: null },
    { label: 'June 25 Shift 2', pdfPath: null },
    { label: 'June 26 Shift 1', pdfPath: null },
    { label: 'June 26 Shift 2', pdfPath: null },
    { label: 'June 27 Shift 1', pdfPath: null },
    { label: 'June 27 Shift 2', pdfPath: null },
    { label: 'June 28 Shift 1', pdfPath: null },
    { label: 'June 28 Shift 2', pdfPath: null },
    { label: 'June 29 Shift 1', pdfPath: null },
    { label: 'June 29 Shift 2', pdfPath: null },
    { label: 'July 25 Shift 1', pdfPath: null },
    { label: 'July 25 Shift 2', pdfPath: null },
    { label: 'July 26 Shift 1', pdfPath: null },
    { label: 'July 26 Shift 2', pdfPath: null },
    { label: 'July 27 Shift 1', pdfPath: null },
    { label: 'July 27 Shift 2', pdfPath: null },
    { label: 'July 28 Shift 1', pdfPath: null },
    { label: 'July 28 Shift 2', pdfPath: null },
    { label: 'July 29 Shift 1', pdfPath: null },
    { label: 'July 29 Shift 2', pdfPath: null },
  ]},
  { year: 2021, items: [
    { label: 'Feb 24 Shift 1', pdfPath: null },
    { label: 'Feb 24 Shift 2', pdfPath: null },
    { label: 'Feb 25 Shift 1', pdfPath: null },
    { label: 'Feb 25 Shift 2', pdfPath: null },
    { label: 'Feb 26 Shift 1', pdfPath: null },
    { label: 'Feb 26 Shift 2', pdfPath: null },
    { label: 'Mar 16 Shift 1', pdfPath: null },
    { label: 'Mar 16 Shift 2', pdfPath: null },
    { label: 'Mar 17 Shift 1', pdfPath: null },
    { label: 'Mar 17 Shift 2', pdfPath: null },
    { label: 'Mar 18 Shift 1', pdfPath: null },
    { label: 'Mar 18 Shift 2', pdfPath: null },
    { label: 'July 20 Shift 1', pdfPath: null },
    { label: 'July 20 Shift 2', pdfPath: null },
    { label: 'July 22 Shift 1', pdfPath: null },
    { label: 'July 22 Shift 2', pdfPath: null },
    { label: 'July 25 Shift 1', pdfPath: null },
    { label: 'July 25 Shift 2', pdfPath: null },
    { label: 'July 27 Shift 1', pdfPath: null },
    { label: 'July 27 Shift 2', pdfPath: null },
    { label: 'Aug 26 Shift 1', pdfPath: null },
    { label: 'Aug 26 Shift 2', pdfPath: null },
    { label: 'Aug 27 Shift 1', pdfPath: null },
    { label: 'Aug 27 Shift 2', pdfPath: null },
    { label: 'Aug 31 Shift 1', pdfPath: null },
    { label: 'Aug 31 Shift 2', pdfPath: null },
    { label: 'Sep 1 Shift 1', pdfPath: null },
    { label: 'Sep 1 Shift 2', pdfPath: null },
  ]},
  { year: 2020, items: [
    { label: 'Jan 7 Shift 1', pdfPath: null },
    { label: 'Jan 7 Shift 2', pdfPath: null },
    { label: 'Jan 8 Shift 1', pdfPath: null },
    { label: 'Jan 8 Shift 2', pdfPath: null },
    { label: 'Jan 9 Shift 1', pdfPath: null },
    { label: 'Jan 9 Shift 2', pdfPath: null },
    { label: 'Sep 1 Shift 1', pdfPath: null },
    { label: 'Sep 1 Shift 2', pdfPath: null },
    { label: 'Sep 2 Shift 1', pdfPath: null },
    { label: 'Sep 2 Shift 2', pdfPath: null },
    { label: 'Sep 3 Shift 1', pdfPath: null },
    { label: 'Sep 3 Shift 2', pdfPath: null },
    { label: 'Sep 4 Shift 1', pdfPath: null },
    { label: 'Sep 4 Shift 2', pdfPath: null },
    { label: 'Sep 5 Shift 1', pdfPath: null },
    { label: 'Sep 5 Shift 2', pdfPath: null },
    { label: 'Sep 6 Shift 1', pdfPath: null },
    { label: 'Sep 6 Shift 2', pdfPath: null },
  ]},
  { year: 2019, items: [
    { label: 'Jan 9 Shift 1', pdfPath: null },
    { label: 'Jan 9 Shift 2', pdfPath: null },
    { label: 'Jan 10 Shift 1', pdfPath: null },
    { label: 'Jan 10 Shift 2', pdfPath: null },
    { label: 'Jan 11 Shift 1', pdfPath: null },
    { label: 'Jan 11 Shift 2', pdfPath: null },
    { label: 'Jan 12 Shift 1', pdfPath: null },
    { label: 'Jan 12 Shift 2', pdfPath: null },
    { label: 'Apr 8 Shift 1', pdfPath: null },
    { label: 'Apr 8 Shift 2', pdfPath: null },
    { label: 'Apr 9 Shift 1', pdfPath: null },
    { label: 'Apr 9 Shift 2', pdfPath: null },
    { label: 'Apr 10 Shift 1', pdfPath: null },
    { label: 'Apr 10 Shift 2', pdfPath: null },
    { label: 'Apr 12 Shift 1', pdfPath: null },
    { label: 'Apr 12 Shift 2', pdfPath: null },
  ]},
];

const makePlainItems = (labels: string[]): PYQItem[] => labels.map(l => ({ label: l, pdfPath: null }));

const CUET_YEARS: { year: number; items: PYQItem[] }[] = [
  { year: 2025, items: [
    { label: 'Physics', pdfPath: 'https://image-static.collegedunia.com/public/image/CUET_2025_PHYSICS_QUESTION_PAPER_519464873cfe3b4e6a4cc1bf91d11aa0.pdf' },
    { label: 'Chemistry', pdfPath: 'https://image-static.collegedunia.com/public/image/CUET_2025_CHEMISTRY_QUESTION_PAPER_207ffbde9e4cb62514dc92e5857c6a06.pdf' },
    { label: 'Mathematics', pdfPath: 'https://image-static.collegedunia.com/public/image/CUET_2025_MATHEMATICS_QUESTION_PAPER_3146e4fad345fc76e08807f699cd84ed.pdf' },
  ]},
  { year: 2024, items: [
    { label: 'Physics', pdfPath: 'https://assets.collegedunia.com/public/image/CUET_UG_2024_Physics_Question_Paper_322_E_SET_A_7f30afd4be997af037a1f43f649f7fc9.pdf' },
    { label: 'Chemistry', pdfPath: 'https://assets.collegedunia.com/public/image/CUET_Chemistry_Question_Paper_2024_306_E_MSS_Set_A_1be150837f3b05a9e67d51c5d7d4a44f.pdf' },
    { label: 'Mathematics', pdfPath: 'https://assets.collegedunia.com/public/image/CUET_UG_2024_Mathematics_Question_Paper_319_E_SET_A_6e59be7905c783387abd163fd894e5d4.pdf' },
  ]},
  { year: 2023, items: [
    { label: 'Physics', pdfPath: 'https://assets.collegedunia.com/public/image/CUET_Physics_fefef6119f0024b3c9de602e1882865b.pdf' },
    { label: 'Chemistry', pdfPath: 'https://assets.collegedunia.com/public/image/Paper_20240420121718_b5e9150c2aa02a868c1baf40ca1b0b9b.pdf' },
    { label: 'Mathematics', pdfPath: 'https://assets.collegedunia.com/public/image/Paper_20240419141051_98f50fae72dacd08caf2b5a0392ab609.pdf' },
  ]},
  { year: 2022, items: [
    { label: 'Physics', pdfPath: 'https://assets.collegedunia.com/public/image/CUET_2022_Physics_Question_Paper_cf29f1c7f290881715fbe5f93798c6e2.pdf' },
    { label: 'Chemistry', pdfPath: 'https://assets.collegedunia.com/public/image/CUET_2022_Chemistry_Question_Paper_750ad74c52e18a0f08e1e0cacc03fb43.pdf' },
    { label: 'Mathematics', pdfPath: 'https://assets.collegedunia.com/public/image/CUET_2022_Mathematics_Applied_Mathematics_Question_Paper_d4d3027c70947d0c3e81abacac482397.pdf' },
  ]},
];


// BITSAT with PDFs (2019-2024)
const BITSAT_YEARS: { year: number; items: PYQItem[] }[] = [
  { year: 2025, items: [{ label: 'Full Paper', pdfPath: null }] },
  { year: 2024, items: [{ label: 'Full Paper', pdfPath: '/pyq/bitsat/2024.pdf' }] },
  { year: 2023, items: [{ label: 'Full Paper', pdfPath: '/pyq/bitsat/2023.pdf' }] },
  { year: 2022, items: [{ label: 'Full Paper', pdfPath: '/pyq/bitsat/2022.pdf' }] },
  { year: 2021, items: [{ label: 'Full Paper', pdfPath: '/pyq/bitsat/2021.pdf' }] },
  { year: 2020, items: [{ label: 'Full Paper', pdfPath: '/pyq/bitsat/2020.pdf' }] },
  { year: 2019, items: [{ label: 'Full Paper', pdfPath: '/pyq/bitsat/2019.pdf' }] },
];

// NDA PYQ data (2021-2026)
const NDA_YEARS: { year: number; items: PYQItem[] }[] = [
  { year: 2026, items: [
    { label: 'GAT (I)', pdfPath: 'https://www.upsc.gov.in/sites/default/files/QP-NDA-NA-I-26-GENERAL-ABILITY-TEST-130426.pdf' },
    { label: 'Math (I)', pdfPath: 'https://www.upsc.gov.in/sites/default/files/QP-NDA-NA-I-26-MATHEMATICS-130426.pdf' },
  ]},
  { year: 2025, items: [
    { label: 'GAT (I)', pdfPath: 'https://www.upsc.gov.in/sites/default/files/QP-NDA-NA-I-25-GENERAL-ABILITY-TEST-150425.pdf' },
    { label: 'Math (I)', pdfPath: 'http://upsc.gov.in/sites/default/files/QP-NDA-NA-I-25-MATHEMATICS-150425.pdf' },
    { label: 'GAT (II)', pdfPath: 'https://www.upsc.gov.in/sites/default/files/QP-NDANA-II-25-GENERAL-ABILITY-TEST-150925.pdf' },
    { label: 'Math (II)', pdfPath: 'https://www.upsc.gov.in/sites/default/files/QP-NDANA-II-25-MATHEMATICS-150925.pdf' },
  ]},
  { year: 2024, items: [
    { label: 'GAT (I)', pdfPath: 'https://www.upsc.gov.in/sites/default/files/QP_NDANAI2024_GENERAL-ABILITY-TEST_22042024.pdf' },
    { label: 'Math (I)', pdfPath: 'https://www.upsc.gov.in/sites/default/files/QP_NDANAI2024_MATHEMATICS_22042024.pdf' },
    { label: 'GAT (II)', pdfPath: 'https://www.upsc.gov.in/sites/default/files/QP-NDA-NA-II-24-GENERAL-ABILITY-TEST-020924.pdf' },
    { label: 'Math (II)', pdfPath: 'https://www.upsc.gov.in/sites/default/files/QP-NDA-NA-II-24-MATHEMATICS-020924.pdf' },
  ]},
  { year: 2023, items: [
    { label: 'GAT (I)', pdfPath: 'https://www.upsc.gov.in/sites/default/files/QP-NDA-I-23-GENERAL-ABILITY-TEST-170423.pdf' },
    { label: 'Math (I)', pdfPath: 'https://www.upsc.gov.in/sites/default/files/QP-NDA-I-23-MATHEMATICS-170423.pdf' },
    { label: 'GAT (II)', pdfPath: 'https://www.upsc.gov.in/sites/default/files/QP-NDANA-II-2023-GAT-04092023.pdf' },
    { label: 'Math (II)', pdfPath: 'https://www.upsc.gov.in/sites/default/files/QP-NDANA-II-2023-Maths-04092023.pdf' },
  ]},
  { year: 2022, items: [
    { label: 'GAT (I)', pdfPath: 'https://www.upsc.gov.in/sites/default/files/QP-NDA-I-22-GENERAL-ABILITY-TEST-120422.pdf' },
    { label: 'Math (I)', pdfPath: 'https://www.upsc.gov.in/sites/default/files/QP-NDA-I-22-GENERAL-ABILITY-TEST-120422.pdf' },
    { label: 'GAT (II)', pdfPath: 'https://www.upsc.gov.in/sites/default/files/QP-NDA-II-22-GENERAL-ABILITY-TEST-050922.pdf' },
    { label: 'Math (II)', pdfPath: 'https://www.upsc.gov.in/sites/default/files/QP-NDA-II-MATHEMATICS-050922.pdf' },
  ]},
  { year: 2021, items: [
    { label: 'GAT (I)', pdfPath: 'https://www.upsc.gov.in/sites/default/files/QP-NDA-I-21-GENERAL_ABILITY_TEST.pdf' },
    { label: 'Math (I)', pdfPath: 'https://www.upsc.gov.in/sites/default/files/QP-NDA-I-21-MATHEMATICS.pdf' },
    { label: 'GAT (II)', pdfPath: 'https://www.upsc.gov.in/sites/default/files/QP-GAT-NDANA-EXAM-II-2021-161121.pdf' },
    { label: 'Math (II)', pdfPath: 'https://www.upsc.gov.in/sites/default/files/QP-MATH-NDANA-EXAM-II-2021-161121.pdf' },
  ]},
];

type ExamType = 'jee-main' | 'jee-advanced' | 'cuet' | 'bitsat' | 'nda';

const EXAM_COLORS: Record<ExamType, string> = {
  'jee-main': 'bg-primary/20 text-primary',
  'jee-advanced': 'bg-accent/20 text-accent',
  'cuet': 'bg-secondary/20 text-secondary',
  'bitsat': 'bg-violet-500/20 text-violet-500',
  'nda': 'bg-rose-500/20 text-rose-500',
};

const EXAM_LABELS: Record<ExamType, string> = {
  'jee-main': 'JEE Main',
  'jee-advanced': 'JEE Advanced',
  'cuet': 'CUET',
  'bitsat': 'BITSAT',
  'nda': 'NDA',
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
        'cuet': 'cuet', 'mhtcet': 'mhtcet', 'bitsat': 'bitsat', 'nda': 'nda',
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
                    if (item.pdfPath.startsWith('http')) {
                      window.open(item.pdfPath, '_blank');
                    } else {
                      setViewingPdf({ url: item.pdfPath, title: `${EXAM_LABELS[examType]} ${year} - ${item.label}` });
                    }
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
      case 'nda': return NDA_YEARS;
      default: return [];
    }
  };

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
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-6 mb-6 h-auto p-1">
          <TabsTrigger value="jee-main" className="text-xs sm:text-sm py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-glow data-[state=active]:text-white">JEE Main</TabsTrigger>
          <TabsTrigger value="jee-advanced" className="text-xs sm:text-sm py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-accent-glow data-[state=active]:text-white">JEE Adv</TabsTrigger>
          <TabsTrigger value="cuet" className="text-xs sm:text-sm py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary data-[state=active]:to-secondary-glow data-[state=active]:text-white">CUET</TabsTrigger>
          <TabsTrigger value="mhtcet" className="text-xs sm:text-sm py-2 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">MHTCET</TabsTrigger>
          <TabsTrigger value="bitsat" className="text-xs sm:text-sm py-2 data-[state=active]:bg-violet-500 data-[state=active]:text-white">BITSAT</TabsTrigger>
          <TabsTrigger value="nda" className="text-xs sm:text-sm py-2 data-[state=active]:bg-rose-500 data-[state=active]:text-white">NDA</TabsTrigger>
        </TabsList>

        {(['jee-main', 'jee-advanced', 'cuet', 'mhtcet', 'bitsat', 'nda'] as ExamType[]).map((exam) => (
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
