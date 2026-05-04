import { useState, useMemo, useRef, useEffect } from 'react';
import { Calculator as CalcIcon, Ruler, LineChart as LineIcon, X, Plus, Trash2, ZoomIn, ZoomOut, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ToolKey = 'calc' | 'unit' | 'graph' | null;

// ---------- Calculator ----------
function ScientificCalculator() {
  const [expr, setExpr] = useState('');
  const [out, setOut] = useState<string>('');
  const press = (s: string) => setExpr(e => e + s);
  const evaluate = () => {
    try {
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
      <div className="text-right text-2xl font-mono min-h-[2rem] px-2">{out}</div>
      <div className="grid grid-cols-5 gap-2">
        {keys.map(k => (<Button key={k} variant="outline" onClick={() => press(k)} className="font-mono">{k}</Button>))}
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

// ---------- Desmos-style Graph Plotter ----------
const COLORS = ['hsl(220 90% 55%)', 'hsl(0 80% 55%)', 'hsl(140 70% 45%)', 'hsl(280 70% 55%)', 'hsl(35 90% 50%)'];

function compileFn(expr: string): ((x: number) => number) | null {
  if (!expr.trim()) return null;
  try {
    const safe = expr
      .replace(/sin\(/g, 'Math.sin(').replace(/cos\(/g, 'Math.cos(').replace(/tan\(/g, 'Math.tan(')
      .replace(/log\(/g, 'Math.log10(').replace(/ln\(/g, 'Math.log(').replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/abs\(/g, 'Math.abs(').replace(/exp\(/g, 'Math.exp(')
      .replace(/π/g, 'Math.PI').replace(/(?<![a-zA-Z])e(?![a-zA-Z])/g, 'Math.E')
      .replace(/\^/g, '**');
    // eslint-disable-next-line no-new-func
    return Function('x', `"use strict"; return (${safe})`) as (x: number) => number;
  } catch { return null; }
}

function GraphPlotter() {
  const [equations, setEquations] = useState<string[]>(['sin(x)', 'x^2 + 2*x - 9']);
  const [view, setView] = useState({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);

  const W = 600, H = 400;
  const xRange = view.xMax - view.xMin;
  const yRange = view.yMax - view.yMin;
  const sx = (x: number) => ((x - view.xMin) / xRange) * W;
  const sy = (y: number) => H - ((y - view.yMin) / yRange) * H;

  const paths = useMemo(() => equations.map(eq => {
    const f = compileFn(eq);
    if (!f) return '';
    const pts: string[] = [];
    let lastValid = false;
    const step = xRange / 800;
    for (let x = view.xMin; x <= view.xMax; x += step) {
      try {
        const y = f(x);
        if (typeof y === 'number' && isFinite(y) && y > view.yMin - yRange && y < view.yMax + yRange) {
          pts.push(`${lastValid ? 'L' : 'M'} ${sx(x).toFixed(2)} ${sy(y).toFixed(2)}`);
          lastValid = true;
        } else { lastValid = false; }
      } catch { lastValid = false; }
    }
    return pts.join(' ');
  }), [equations, view]);

  // Grid lines — choose nice step
  const niceStep = (range: number) => {
    const raw = range / 10;
    const pow = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / pow;
    const nice = norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10;
    return nice * pow;
  };
  const xStep = niceStep(xRange);
  const yStep = niceStep(yRange);
  const xTicks: number[] = [];
  for (let x = Math.ceil(view.xMin / xStep) * xStep; x <= view.xMax; x += xStep) xTicks.push(x);
  const yTicks: number[] = [];
  for (let y = Math.ceil(view.yMin / yStep) * yStep; y <= view.yMax; y += yStep) yTicks.push(y);

  const zoom = (factor: number) => {
    const cx = (view.xMin + view.xMax) / 2;
    const cy = (view.yMin + view.yMax) / 2;
    const nxr = (xRange * factor) / 2;
    const nyr = (yRange * factor) / 2;
    setView({ xMin: cx - nxr, xMax: cx + nxr, yMin: cy - nyr, yMax: cy + nyr });
  };
  const reset = () => setView({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });

  // Pan
  const onDown = (e: React.PointerEvent) => {
    setDrag({ x: e.clientX, y: e.clientY });
    (e.target as Element).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const dx = ((e.clientX - drag.x) / rect.width) * xRange;
    const dy = ((e.clientY - drag.y) / rect.height) * yRange;
    setView(v => ({ xMin: v.xMin - dx, xMax: v.xMax - dx, yMin: v.yMin + dy, yMax: v.yMax + dy }));
    setDrag({ x: e.clientX, y: e.clientY });
  };
  const onUp = () => setDrag(null);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    zoom(e.deltaY > 0 ? 1.1 : 0.9);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {equations.map((eq, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-6 w-6 rounded shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
            <Input value={eq} onChange={e => setEquations(eqs => eqs.map((v, idx) => idx === i ? e.target.value : v))} placeholder="f(x) = ..." className="font-mono" />
            <Button variant="ghost" size="icon" onClick={() => setEquations(eqs => eqs.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => setEquations(eqs => [...eqs, ''])}><Plus className="h-4 w-4 mr-1" />Add equation</Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => zoom(0.8)} aria-label="Zoom in"><ZoomIn className="h-4 w-4" /></Button>
        <Button variant="outline" size="icon" onClick={() => zoom(1.25)} aria-label="Zoom out"><ZoomOut className="h-4 w-4" /></Button>
        <Button variant="outline" size="sm" onClick={reset}>Reset</Button>
        <span className="text-xs text-muted-foreground flex items-center gap-1"><Move className="h-3 w-3" />Drag to pan • Scroll to zoom</span>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden touch-none">
        <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-auto cursor-move select-none"
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp} onWheel={onWheel}>
          {/* Minor grid */}
          {xTicks.map(x => (
            <line key={`vx${x}`} x1={sx(x)} y1={0} x2={sx(x)} y2={H} stroke="hsl(var(--border))" strokeWidth={x === 0 ? 0 : 0.5} />
          ))}
          {yTicks.map(y => (
            <line key={`hy${y}`} x1={0} y1={sy(y)} x2={W} y2={sy(y)} stroke="hsl(var(--border))" strokeWidth={y === 0 ? 0 : 0.5} />
          ))}
          {/* Axes */}
          {view.yMin <= 0 && view.yMax >= 0 && (
            <line x1={0} y1={sy(0)} x2={W} y2={sy(0)} stroke="hsl(var(--foreground))" strokeWidth={1.5} />
          )}
          {view.xMin <= 0 && view.xMax >= 0 && (
            <line x1={sx(0)} y1={0} x2={sx(0)} y2={H} stroke="hsl(var(--foreground))" strokeWidth={1.5} />
          )}
          {/* Tick labels */}
          {xTicks.map(x => x !== 0 && (
            <text key={`tx${x}`} x={sx(x)} y={Math.min(Math.max(sy(0) + 12, 12), H - 2)} fontSize="10" textAnchor="middle" fill="hsl(var(--muted-foreground))">{Number(x.toFixed(4))}</text>
          ))}
          {yTicks.map(y => y !== 0 && (
            <text key={`ty${y}`} x={Math.min(Math.max(sx(0) + 4, 4), W - 30)} y={sy(y) + 3} fontSize="10" fill="hsl(var(--muted-foreground))">{Number(y.toFixed(4))}</text>
          ))}
          {/* Plots */}
          {paths.map((d, i) => d && (
            <path key={i} d={d} fill="none" stroke={COLORS[i % COLORS.length]} strokeWidth={2} />
          ))}
        </svg>
      </div>
      <div className="grid grid-cols-4 gap-2 text-xs">
        <Input type="number" value={view.xMin} onChange={e => setView(v => ({ ...v, xMin: parseFloat(e.target.value) || v.xMin }))} placeholder="x min" />
        <Input type="number" value={view.xMax} onChange={e => setView(v => ({ ...v, xMax: parseFloat(e.target.value) || v.xMax }))} placeholder="x max" />
        <Input type="number" value={view.yMin} onChange={e => setView(v => ({ ...v, yMin: parseFloat(e.target.value) || v.yMin }))} placeholder="y min" />
        <Input type="number" value={view.yMax} onChange={e => setView(v => ({ ...v, yMax: parseFloat(e.target.value) || v.yMax }))} placeholder="y max" />
      </div>
    </div>
  );
}

// ---------- Floating launcher ----------
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
      <div data-floating-tools className="fixed bottom-16 left-4 z-50 flex flex-col-reverse items-start gap-2">
        <Button
          variant="gradient"
          size="icon"
          className="h-12 w-12 rounded-full shadow-glow"
          onClick={() => setOpen(o => !o)}
          aria-label="Study Tools"
          data-tour="tools"
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {tool === 'calc' && 'Scientific Calculator'}
              {tool === 'unit' && 'Unit Converter'}
              {tool === 'graph' && 'Graph Plotter'}
            </DialogTitle>
          </DialogHeader>
          {tool === 'calc' && <ScientificCalculator />}
          {tool === 'unit' && <UnitConverter />}
          {tool === 'graph' && <GraphPlotter />}
        </DialogContent>
      </Dialog>
    </>
  );
}
