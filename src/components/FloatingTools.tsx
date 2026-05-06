import { useState, useMemo, useEffect, useRef } from 'react';
import { Calculator as CalcIcon, Ruler, LineChart as LineIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

type ToolKey = 'calc' | 'unit' | 'graph' | null;

declare global {
  interface Window {
    Desmos?: any;
  }
}

// Cached Desmos script loader
let desmosLoadPromise: Promise<void> | null = null;
async function loadDesmos(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (window.Desmos) return;
  if (desmosLoadPromise) return desmosLoadPromise;
  desmosLoadPromise = (async () => {
    const { data, error } = await supabase.functions.invoke('desmos-key');
    if (error || !data?.apiKey) throw new Error('Failed to load Desmos key');
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement('script');
      s.src = `https://www.desmos.com/api/v1.12/calculator.js?apiKey=${data.apiKey}`;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Desmos script failed'));
      document.head.appendChild(s);
    });
  })();
  return desmosLoadPromise;
}

function DesmosScientific() {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let calc: any;
    loadDesmos().then(() => {
      if (ref.current && window.Desmos?.ScientificCalculator) {
        calc = window.Desmos.ScientificCalculator(ref.current);
      }
    }).catch(e => setError(e.message));
    return () => { try { calc?.destroy?.(); } catch {} };
  }, []);
  return (
    <div>
      {error && <p className="text-sm text-destructive mb-2">{error}</p>}
      <div ref={ref} style={{ width: '100%', height: '60vh', minHeight: 380 }} />
    </div>
  );
}

function DesmosGraph() {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let calc: any;
    loadDesmos().then(() => {
      if (ref.current && window.Desmos?.GraphingCalculator) {
        calc = window.Desmos.GraphingCalculator(ref.current, { expressions: true, settingsMenu: true, zoomButtons: true });
      }
    }).catch(e => setError(e.message));
    return () => { try { calc?.destroy?.(); } catch {} };
  }, []);
  return (
    <div>
      {error && <p className="text-sm text-destructive mb-2">{error}</p>}
      <div ref={ref} style={{ width: '100%', height: '70vh', minHeight: 420 }} />
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
    return ((n * UNITS[cat][from]) / UNITS[cat][to]).toPrecision(8);
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

// ---------- Floating launcher (mirror of AI button) ----------
export function FloatingTools() {
  const [open, setOpen] = useState(false);
  const [tool, setTool] = useState<ToolKey>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-floating-tools]')) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const items: { key: ToolKey; label: string; Icon: any }[] = [
    { key: 'graph', label: 'Graph', Icon: LineIcon },
    { key: 'unit', label: 'Units', Icon: Ruler },
    { key: 'calc', label: 'Calculator', Icon: CalcIcon },
  ];

  return (
    <>
      {/* Mirror of AI button (which is bottom-16 right-4). Sits just above Report a Problem button. */}
      <div data-floating-tools data-tour="tools" className="fixed bottom-16 left-4 z-[60] flex flex-col-reverse items-start gap-2">
        <Button
          variant="gradient"
          size="icon"
          className="h-12 w-12 rounded-full shadow-glow"
          onClick={() => setOpen(o => !o)}
          aria-label="Study Tools"
        >
          {open ? <X className="h-5 w-5" /> : <CalcIcon className="h-5 w-5" />}
        </Button>
        {open && items.map((it, i) => (
          <Button
            key={it.key}
            variant="default"
            className="h-10 rounded-full pl-3 pr-4 shadow-elegant animate-fade-in"
            style={{ animationDelay: `${i * 40}ms` }}
            onClick={() => { setTool(it.key); setOpen(false); }}
          >
            <it.Icon className="h-4 w-4 mr-2" />
            <span className="text-sm">{it.label}</span>
          </Button>
        ))}
      </div>

      <Dialog open={tool !== null} onOpenChange={(o) => !o && setTool(null)}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] overflow-y-auto p-3 sm:p-6">
          <DialogHeader>
            <DialogTitle>
              {tool === 'calc' && 'Scientific Calculator (Desmos)'}
              {tool === 'unit' && 'Unit Converter'}
              {tool === 'graph' && 'Graphing Calculator (Desmos)'}
            </DialogTitle>
          </DialogHeader>
          {tool === 'calc' && <DesmosScientific />}
          {tool === 'unit' && <UnitConverter />}
          {tool === 'graph' && <DesmosGraph />}
        </DialogContent>
      </Dialog>
    </>
  );
}
