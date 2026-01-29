import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export type Dimension = {
  key: string;
  label: string;
  icon?: string; // optional: use your icon system (svg class, prime icon class, etc.)
  iconSize?: number;
  iconWidth?: number;
  iconHeight?: number;
};

export type Squad = {
  id: string;
  name: string;
  // scores by dimension key
  scores: Record<string, number | null | undefined>;
};

export type ScaleBand = {
  key: 'fly' | 'run' | 'walk' | 'crawl';
  label: string;
  min: number;
  max: number;
  color: string;
};

type CellStyle = {
  background: string;
  color: string;
  border?: string;
};

@Component({
  selector: 'app-heatmap-performance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './heatmap-performance.component.html',
  styleUrls: ['./heatmap-performance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeatmapPerformanceComponent implements OnChanges {
  @Input() dimensions: Dimension[] = [
    { key: 'strategy', label: 'Strategy' },
    { key: 'structure', label: 'Structure' },
    { key: 'processes', label: 'Processes' },
    { key: 'people', label: 'People' },
    { key: 'technology', label: 'Technology' },
  ];

  // Infinite number of squads => this array can be huge (scroll horizontally)
  @Input() squads: Squad[] = [];

  // Performance scale (editable)
  @Input() scale: ScaleBand[] = [
    { key: 'fly', label: 'Fly', min: 3.5, max: 4.0, color: 'rgba(89, 22, 139, 1)' },
    { key: 'run', label: 'Run', min: 2.5, max: 3.49, color: 'rgba(130, 0, 219, 1)' },
    { key: 'walk', label: 'Walk', min: 1.5, max: 2.49, color: 'rgba(173, 70, 255, 1)' },
    { key: 'crawl', label: 'Crawl', min: 0, max: 1.49, color: 'rgba(218, 178, 255, 1)' },
  ];

  // Optional: use different palette for Total Tribe column (like screenshot pink/red)
  @Input() totalTribePalette = { from: '#FFD5E1', to: '#E11D48' };

  // Cell sizing
  @Input() leftColWidth = 210;
  @Input() squadColWidth = 92;
  @Input() totalColWidth = 160;
  @Input() iconSize = 16;

  // Derived data
  tribeTotalsByDimension: Record<string, number> = {};
  squadTotals: Record<string, number> = {};
  overallTotal = 0;
  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.recompute();
  }

  private recompute() {
    this.tribeTotalsByDimension = {};
    this.squadTotals = {};
    this.overallTotal = 0;

    if (!this.squads?.length || !this.dimensions?.length) return;

    // Total by dimension (avg across squads)
    for (const d of this.dimensions) {
      const values: number[] = [];
      for (const s of this.squads) {
        const v = s.scores?.[d.key];
        if (typeof v === 'number' && !Number.isNaN(v)) values.push(v);
      }
      this.tribeTotalsByDimension[d.key] = this.avg(values);
    }

    // Total average by squad (avg across dimensions)
    for (const s of this.squads) {
      const values: number[] = [];
      for (const d of this.dimensions) {
        const v = s.scores?.[d.key];
        if (typeof v === 'number' && !Number.isNaN(v)) values.push(v);
      }
      this.squadTotals[s.id] = this.avg(values);
    }

    // Overall total (avg of tribe totals across dimensions)
    const tribeValues = this.dimensions.map(d => this.tribeTotalsByDimension[d.key]).filter(v => typeof v === 'number');
    this.overallTotal = this.avg(tribeValues);
  }

  // ---------- Rendering helpers ----------

  trackByDim = (_: number, d: Dimension) => d.key;
  trackBySquad = (_: number, s: Squad) => s.id;

  gridTemplateColumns(): string {
    // left label column + N squad columns + total tribe column
    return `${this.leftColWidth}px repeat(${this.squads.length}, ${this.squadColWidth}px) ${this.totalColWidth}px`;
  }

  format(v: number | null | undefined): string {
    if (typeof v !== 'number' || Number.isNaN(v)) return '—';
    return v.toFixed(2);
  }

  // ---------- Color logic ----------

  cellStyle(value: number | null | undefined, kind: 'normal' | 'tribe' | 'footer' = 'normal'): CellStyle {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return {
        background: '#F8FAFC',
        color: '#64748B',
        border: '1px solid #E2E8F0',
      };
    }

    // totals column uses separate palette similar to screenshot
    if (kind === 'tribe' || kind === 'footer') {
      const bg = this.lerpHex(this.totalTribePalette.from, this.totalTribePalette.to, this.scale01(value, 0, 4));
      const color = this.getReadableTextColor(bg);
      return { background: bg, color };
    }

    const band = this.findBand(value);
    if (!band) {
      // fallback
      const bg = '#EEF2FF';
      return { background: bg, color: this.getReadableTextColor(bg) };
    }

    // Solid color
    const bg = band.color;
    return { background: bg, color: this.getReadableTextColor(bg) };
  }

  private findBand(v: number): ScaleBand | undefined {
    // ensure correct ordering if scale input changes
    const sorted = [...this.scale].sort((a, b) => b.min - a.min);
    return sorted.find(b => v >= b.min && v <= b.max);
  }

  private avg(values: number[]): number {
    if (!values.length) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return sum / values.length;
  }

  private scale01(v: number, min: number, max: number): number {
    if (max <= min) return 0;
    return this.clamp((v - min) / (max - min), 0, 1);
  }

  private clamp(v: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, v));
  }

  // ---------- Color utils (hex lerp) ----------

  private lerpHex(a: string, b: string, t: number): string {
    const A = this.hexToRgb(a);
    const B = this.hexToRgb(b);
    const r = Math.round(A.r + (B.r - A.r) * t);
    const g = Math.round(A.g + (B.g - A.g) * t);
    const bl = Math.round(A.b + (B.b - A.b) * t);
    return this.rgbToHex(r, g, bl);
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const h = hex.replace('#', '').trim();
    const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
    const n = parseInt(full, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return (
      '#' +
      [r, g, b]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('')
    );
  }

  private getReadableTextColor(bg: string): string {
    const { r, g, b } = this.parseColor(bg);
    // relative luminance
    const L = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return L > 0.62 ? '#0F172A' : '#FFFFFF';
  }

  private parseColor(color: string): { r: number; g: number; b: number } {
    if (color.startsWith('#')) {
      return this.hexToRgb(color);
    }
    // simple rgba parsing
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return { r: +match[1], g: +match[2], b: +match[3] };
    }
    return { r: 0, g: 0, b: 0 };
  }
  sanitizeSvg(svg: string | undefined): SafeHtml | null {
    if (!svg) return null;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
}
