import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator as CalcIcon, Ruler, LineChart as LineIcon, Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';

// ---------- Calculator ----------
function ScientificCalculator() {
  const [expr, setExpr] = useState('');
  const [out, setOut] = useState<string>('');

  const press = (s: string) => setExpr(e => e + s);
  const evaluate = () => {
    try {
      // Replace common math symbols
      const safe = expr
        .replace(/×/g, '*').replace(/÷/g, '/').replace(/π/g, 'Math.PI').replace(/e(?![a-zA-Z])/g, 'Math.E')
        .replace(/sin\(/g, 'Math.sin(').replace(/cos\(/g, 'Math.cos(').replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(').replace(/ln\(/g, 'Math.log(').replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/\^/g, '**');
      // eslint-disable-next-line no-new-func
      const r = Function(`"use strict"; return (${safe})`)();
      setOut(String(r));
    } catch { setOut('Error'); }
  };

  const keys = ['7','8','9','÷','sin(','4','5','6','×','cos(','1','2','3','-','tan(','0','.','(',')','+','π','e','^','sqrt(','log(','ln('];
  return (
    <div className="space-y-3">
      <Input value={expr} onChange={e => setExpr(e.target.value)} placeholder="e.g. sin(π/6)+sqrt(9)" className="font-mono text-lg" />
      <div className="text-right text-2xl font-mono min-h-[2rem]">{out}</div>
      <div className="grid grid-cols-5 gap-2">
        {keys.map(k => (
          <Button key={k} variant="outline" onClick={() => press(k)} className="font-mono">{k}</Button>
        ))}
      </div>
      <div className="flex gap-2">
        <Button onClick={evaluate} className="flex-1">=</Button>
        <Button variant="secondary" onClick={() => { setExpr(''); setOut(''); }} className="flex-1">Clear</Button>
      </div>
    </div>
  );
}

// ---------- Unit Converter ----------
const UNITS: Record<string, Record<string, number>> = {
  Length: { meter: 1, kilometer: 1000, centimeter: 0.01, millimeter: 0.001, mile: 1609.34, foot: 0.3048, inch: 0.0254 },
  Mass: { kilogram: 1, gram: 0.001, milligram: 0.000001, pound: 0.453592, ounce: 0.0283495 },
  Time: { second: 1, minute: 60, hour: 3600, day: 86400 },
  Energy: { joule: 1, kilojoule: 1000, calorie: 4.184, electronvolt: 1.602e-19 },
  Pressure: { pascal: 1, kilopascal: 1000, atmosphere: 101325, bar: 100000, torr: 133.322 },
};
function UnitConverter() {
  const [cat, setCat] = useState('Length');
  const units = Object.keys(UNITS[cat]);
  const [from, setFrom] = useState(units[0]);
  const [to, setTo] = useState(units[1]);
  const [val, setVal] = useState('1');
  const result = useMemo(() => {
    const n = parseFloat(val); if (isNaN(n)) return '';
    const base = n * UNITS[cat][from];
    return (base / UNITS[cat][to]).toPrecision(8);
  }, [cat, from, to, val]);

  return (
    <div className="space-y-3">
      <Select value={cat} onValueChange={(v) => { setCat(v); const u = Object.keys(UNITS[v]); setFrom(u[0]); setTo(u[1]); }}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>{Object.keys(UNITS).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
      </Select>
      <div className="grid grid-cols-2 gap-2">
        <Input type="number" value={val} onChange={e => setVal(e.target.value)} />
        <Input value={result} readOnly className="bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Select value={from} onValueChange={setFrom}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{units.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={to} onValueChange={setTo}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{units.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    </div>
  );
}

// ---------- Graph Plotter ----------
function GraphPlotter() {
  const [fn, setFn] = useState('sin(x)');
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const points = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    try {
      const safe = fn
        .replace(/sin\(/g, 'Math.sin(').replace(/cos\(/g, 'Math.cos(').replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(').replace(/ln\(/g, 'Math.log(').replace(/sqrt\(/g, 'Math.sqrt(')
        .replace(/π/g, 'Math.PI').replace(/\^/g, '**');
      // eslint-disable-next-line no-new-func
      const f = Function('x', `"use strict"; return (${safe})`);
      const step = (xMax - xMin) / 200;
      for (let x = xMin; x <= xMax; x += step) {
        const y = f(x);
        if (typeof y === 'number' && isFinite(y)) pts.push({ x, y });
      }
    } catch { /* ignore */ }
    return pts;
  }, [fn, xMin, xMax]);

  const W = 600, H = 300, pad = 30;
  const ys = points.map(p => p.y);
  const yMin = Math.min(...ys, -1), yMax = Math.max(...ys, 1);
  const sx = (x: number) => pad + ((x - xMin) / (xMax - xMin)) * (W - 2 * pad);
  const sy = (y: number) => H - pad - ((y - yMin) / (yMax - yMin || 1)) * (H - 2 * pad);
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${sx(p.x).toFixed(2)} ${sy(p.y).toFixed(2)}`).join(' ');

  return (
    <div className="space-y-3">
      <Input value={fn} onChange={e => setFn(e.target.value)} placeholder="f(x) = e.g. x^2 - 2*x + 1" className="font-mono" />
      <div className="grid grid-cols-2 gap-2">
        <Input type="number" value={xMin} onChange={e => setXMin(parseFloat(e.target.value) || -10)} placeholder="x min" />
        <Input type="number" value={xMax} onChange={e => setXMax(parseFloat(e.target.value) || 10)} placeholder="x max" />
      </div>
      <div className="bg-card border rounded-lg overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          <line x1={pad} y1={sy(0)} x2={W - pad} y2={sy(0)} stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
          <line x1={sx(0)} y1={pad} x2={sx(0)} y2={H - pad} stroke="hsl(var(--muted-foreground))" strokeWidth="1" />
          <path d={path} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}

// ---------- Step-by-step solver (AI) ----------
function StepSolver() {
  const [problem, setProblem] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const solve = async () => {
    if (!problem.trim()) return;
    setLoading(true); setAnswer('');
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: { messages: [
          { role: 'system', content: 'You are a JEE tutor. Solve the problem with clear numbered steps. Use LaTeX with $ delimiters for all math.' },
          { role: 'user', content: problem }
        ] }
      });
      if (error) throw error;
      const text = data?.message || data?.choices?.[0]?.message?.content || data?.response || JSON.stringify(data);
      setAnswer(text);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to solve', variant: 'destructive' });
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-3">
      <Textarea value={problem} onChange={e => setProblem(e.target.value)} rows={4} placeholder="Paste your physics/chemistry/maths problem here..." />
      <Button onClick={solve} disabled={loading || !problem.trim()} className="w-full">
        {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Solving...</> : <><Sparkles className="h-4 w-4 mr-2" /> Solve step-by-step</>}
      </Button>
      {answer && (
        <Card><CardContent className="p-4 whitespace-pre-wrap text-sm">{answer}</CardContent></Card>
      )}
    </div>
  );
}

export default function StudyTools() {
  useSEO({ title: 'Study Tools | JEElytics', description: 'Calculator, unit converter, graph plotter and AI step-by-step solver for JEE.' });
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-3 py-3 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/home')}><ArrowLeft className="h-5 w-5" /></Button>
          <h1 className="font-bold text-lg">Study Tools</h1>
        </div>
      </header>
      <main className="container mx-auto px-3 py-4 max-w-3xl">
        <Tabs defaultValue="calc">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="calc"><CalcIcon className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline">Calculator</span></TabsTrigger>
            <TabsTrigger value="unit"><Ruler className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline">Units</span></TabsTrigger>
            <TabsTrigger value="graph"><LineIcon className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline">Graph</span></TabsTrigger>
            <TabsTrigger value="solve"><Sparkles className="h-4 w-4 sm:mr-1" /><span className="hidden sm:inline">Solver</span></TabsTrigger>
          </TabsList>
          <TabsContent value="calc"><Card><CardHeader><CardTitle>Scientific Calculator</CardTitle></CardHeader><CardContent><ScientificCalculator /></CardContent></Card></TabsContent>
          <TabsContent value="unit"><Card><CardHeader><CardTitle>Unit Converter</CardTitle></CardHeader><CardContent><UnitConverter /></CardContent></Card></TabsContent>
          <TabsContent value="graph"><Card><CardHeader><CardTitle>Graph Plotter</CardTitle></CardHeader><CardContent><GraphPlotter /></CardContent></Card></TabsContent>
          <TabsContent value="solve"><Card><CardHeader><CardTitle>AI Step-by-Step Solver</CardTitle></CardHeader><CardContent><StepSolver /></CardContent></Card></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
