import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Download, Lock } from 'lucide-react';
import { useState } from 'react';

// PYQ data structure - PDFs will be added later
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

export function PYQSection() {
  const [activeExam, setActiveExam] = useState<'mains' | 'advanced'>('mains');

  const PYQCard = ({ 
    year, 
    items, 
    type 
  }: { 
    year: number; 
    items: string[]; 
    type: 'session' | 'paper' 
  }) => (
    <Card className="card-jee hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gradient-primary">{year}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            activeExam === 'mains' 
              ? 'bg-primary/20 text-primary' 
              : 'bg-accent/20 text-accent'
          }`}>
            {activeExam === 'mains' ? 'JEE Main' : 'JEE Advanced'}
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 text-gradient-primary">Previous Year Questions</h2>
        <p className="text-muted-foreground">Download year-wise JEE Main & Advanced question papers with solutions</p>
      </div>

      {/* Exam Type Tabs */}
      <Tabs defaultValue="mains" value={activeExam} onValueChange={(value) => setActiveExam(value as 'mains' | 'advanced')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 h-14">
          <TabsTrigger 
            value="mains" 
            className="text-lg h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-glow data-[state=active]:text-white"
          >
            JEE Main
          </TabsTrigger>
          <TabsTrigger 
            value="advanced"
            className="text-lg h-12 data-[state=active]:bg-gradient-to-r data-[state=active]:from-accent data-[state=active]:to-accent-glow data-[state=active]:text-white"
          >
            JEE Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="mains">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {JEE_MAIN_YEARS.map((item) => (
              <PYQCard 
                key={item.year} 
                year={item.year} 
                items={item.sessions} 
                type="session" 
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="advanced">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {JEE_ADVANCED_YEARS.map((item) => (
              <PYQCard 
                key={item.year} 
                year={item.year} 
                items={item.papers} 
                type="paper" 
              />
            ))}
          </div>
        </TabsContent>
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
