import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';

export type RadarBubble = {
  /** If you want "free placement" like the screenshot */
  dx?: number; // offset from center in viewBox units
  dy?: number;

  /** Or "data placement" on an axis (optional alternative) */
  axisIndex?: number; // 0..labels.length-1
  value?: number;     // 0..maxValue (default 4)

  r: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
};

@Component({
  selector: 'shared-radar-bubble-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radar-bubble-chart.component.html',
  styleUrls: ['./radar-bubble-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadarBubbleChartComponent implements AfterViewInit, OnChanges {
  @ViewChild('svgHost', { static: true }) svgHost!: ElementRef<SVGSVGElement>;
  @ViewChild('tooltipRef') tooltipRef!: ElementRef<HTMLDivElement>;

  // Tooltip state
  tooltipVisible = false;
  tooltipX = 0;
  tooltipY = 0;
  tooltipLabel = '';
  tooltipValue = '';

  /** Labels around the chart */
  @Input() labels: string[] = ['Strategy', 'Process', 'Technology', 'People', 'Structure'];

  /** ViewBox size (chart scales responsively) */
  @Input() size = 420;

  /** Outer radius in viewBox units */
  @Input() outerRadius = 170;

  /** Rings count */
  @Input() levels = 4;

  /** Start angle in degrees (top = -90) */
  @Input() startAngleDeg = -90;

  /** Label distance outside the outer circle */
  @Input() labelOffset = 16;

  /** Zones (outer + inner) */
  @Input() zoneOuterFill = '#ffff';
  @Input() zoneOuterOpacity = 1;

  @Input() zoneInnerFill = '#ffff';
  @Input() zoneInnerOpacity = 1;

  /** inner radius = outerRadius * innerZoneRatio */
  @Input() innerZoneRatio = 0.5;

  /** Ring styling */
  // @Input() ringStroke = '#CFE7E2';
  @Input() ringStroke = '#ffff';
  @Input() ringStrokeOpacity = 0.9;
  @Input() ringStrokeWidth = 1;

  /** Axis styling */
  // @Input() axisStroke = '#D9E3E1';
  @Input() axisStroke = '#ffff';
  @Input() axisStrokeOpacity = 1;
  @Input() axisStrokeWidth = 1;

  /** Label styling */
  @Input() labelColor = '#000000';
  @Input() labelFontSize = 13.5;
  @Input() labelFontFamily = 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial';
  // @Input() ringFillPalette: string[] = ['#59168b', '#8200db', '#ad46ff', '#fcd0ff'];
  @Input() ringFillPalette: string[] = ['#8200db', '#c27bff', '#e2a3ff', '#fcd0ff'];
  @Input() ringFillOpacity = 0.85;
  @Input() bubbleFillColor = '#ffffff';
  @Input() bubbleFillOpacity = 1;

  /** Scale max value */
  @Input() maxValue = 4;

  /** Bubbles */
  @Input() bubbles: RadarBubble[] = [
    { axisIndex: 0, value: 1, r: 14 },
    { axisIndex: 1, value: 2, r: 14 },
    { axisIndex: 2, value: 3, r: 14 },
    { axisIndex: 3, value: 1.5, r: 14 },
    { axisIndex: 4, value: 2.5, r: 14 },
  ];

  private readonly SVG_NS = 'http://www.w3.org/2000/svg';
  private built = false;

  constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.setupSvgRoot();
    this.draw();
    this.built = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Redraw when inputs change (after initial build)
    if (this.built && this.svgHost) {
      this.setupSvgRoot();
      this.draw();
    }
  }

  private setupSvgRoot(): void {
    const svg = this.svgHost.nativeElement;
    // Attributes for responsive svg
    this.setAttr(svg, 'viewBox', `0 0 ${this.size} ${this.size}`);
    this.setAttr(svg, 'width', '100%');
    this.setAttr(svg, 'height', '100%');
    this.setAttr(svg, 'preserveAspectRatio', 'xMidYMid meet');
    // Clear previous nodes
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    // Defs for Glow
    // const defs = this.renderer.createElement('defs', this.SVG_NS);
    // const filter = this.renderer.createElement('filter', this.SVG_NS);
    // this.setAttr(filter, 'id', 'zone-glow');
    // this.setAttr(filter, 'x', '-50%');
    // this.setAttr(filter, 'y', '-50%');
    // this.setAttr(filter, 'width', '200%');
    // this.setAttr(filter, 'height', '200%');

    // const blur = this.renderer.createElement('feGaussianBlur', this.SVG_NS);
    // this.setAttr(blur, 'stdDeviation', '8');
    // this.setAttr(blur, 'result', 'blur');

    // const merge = this.renderer.createElement('feMerge', this.SVG_NS);
    // const nodeBlur = this.renderer.createElement('feMergeNode', this.SVG_NS);
    // this.setAttr(nodeBlur, 'in', 'blur');
    // const nodeSource = this.renderer.createElement('feMergeNode', this.SVG_NS);
    // this.setAttr(nodeSource, 'in', 'SourceGraphic');

    // merge.appendChild(nodeBlur);
    // merge.appendChild(nodeSource);

    // filter.appendChild(blur);
    // filter.appendChild(merge);

    // defs.appendChild(filter);
    // svg.appendChild(defs);
  }

  private draw(): void {
    const svg = this.svgHost.nativeElement;

    const cx = this.size / 2;
    const cy = this.size / 2;
    const axisCount = Math.max(1, this.labels.length);
    const innerRadius = this.outerRadius * this.innerZoneRatio;

    // 1) Zones
    const outerZone = this.makeCircle(cx, cy, this.outerRadius, this.zoneOuterFill, this.zoneOuterOpacity);
    this.setAttr(outerZone, 'filter', 'url(#zone-glow)');
    svg.appendChild(outerZone);

    const innerZone = this.makeCircle(cx, cy, innerRadius, this.zoneInnerFill, this.zoneInnerOpacity);
    this.setAttr(innerZone, 'filter', 'url(#zone-glow)');
    svg.appendChild(innerZone);

    // 2) Ring fills (purple palette light -> dark)
    const ringFillsGroup = this.makeGroup();
    for (let i = this.levels; i >= 1; i--) {
      const r = (this.outerRadius / this.levels) * i;
      const t = (this.levels - i) / Math.max(1, this.levels - 1);
      const idx = Math.floor(t * (this.ringFillPalette.length - 1));
      const color = this.ringFillPalette[idx] || this.ringFillPalette[0];
      ringFillsGroup.appendChild(this.makeCircle(cx, cy, r, color, this.ringFillOpacity));
    }
    svg.appendChild(ringFillsGroup);

    // 3) Ring strokes
    const ringsGroup = this.makeGroup();
    this.setAttr(ringsGroup, 'stroke', this.ringStroke);
    this.setAttr(ringsGroup, 'opacity', String(this.ringStrokeOpacity));
    this.setAttr(ringsGroup, 'stroke-width', String(this.ringStrokeWidth));
    this.setAttr(ringsGroup, 'fill', 'none');

    for (let i = 1; i <= this.levels; i++) {
      const r = (this.outerRadius / this.levels) * i;
      ringsGroup.appendChild(this.makeCircle(cx, cy, r, 'none', 1, true));
    }
    svg.appendChild(ringsGroup);

    // 4) Axes
    const axesGroup = this.makeGroup();
    this.setAttr(axesGroup, 'stroke', this.axisStroke);
    this.setAttr(axesGroup, 'opacity', String(this.axisStrokeOpacity));
    this.setAttr(axesGroup, 'stroke-width', String(this.axisStrokeWidth));

    for (let i = 0; i < axisCount; i++) {
      const angle = this.angleForAxis(i, axisCount);
      const p = this.polarToXY(cx, cy, this.outerRadius, angle);
      axesGroup.appendChild(this.makeLine(cx, cy, p.x, p.y));
    }
    svg.appendChild(axesGroup);

    // 5) Labels
    const labelsGroup = this.makeGroup();
    this.setAttr(labelsGroup, 'fill', this.labelColor);
    this.setAttr(labelsGroup, 'font-size', String(this.labelFontSize));
    this.setAttr(labelsGroup, 'font-family', this.labelFontFamily);
    this.setAttr(labelsGroup, 'class', 'chart-labels');

    const labelRadius = this.outerRadius + this.labelOffset;
    const step = (Math.PI * 2) / axisCount;

    for (let i = 0; i < axisCount; i++) {
      const angle = this.angleForAxis(i, axisCount);
      // Shift label to be in the middle of the slice (between current axis and next axis)
      const labelAngle = angle + step / 2;
      const p = this.polarToXY(cx, cy, labelRadius, labelAngle);

      const text = this.makeText(p.x, p.y, this.labels[i] ?? '', 'middle');
      this.setAttr(text, 'dominant-baseline', 'middle');

      // Convert radians to degrees for rotation
      const angleDeg = (labelAngle * 180) / Math.PI;

      // Tangential rotation (perpendicular to radius)
      let rotation = angleDeg + 90;

      // Normalize rotation to 0-360
      let normalizedRot = rotation % 360;
      if (normalizedRot < 0) normalizedRot += 360;

      // Flip text for bottom half (90 to 270 degrees) so it's not upside down
      if (normalizedRot > 90 && normalizedRot < 270) {
        rotation += 180;
      }

      this.setAttr(text, 'transform', `rotate(${rotation}, ${p.x}, ${p.y})`);

      labelsGroup.appendChild(text);
    }
    svg.appendChild(labelsGroup);

    // 6) Bubbles
    const bubblesGroup = this.makeGroup();
    for (const b of this.bubbles ?? []) {
      const strokeWidth = b.strokeWidth ?? 2;

      // Determine colors based on value if not provided
      const val = b.value ?? 0;
      const fill = b.fill ?? this.bubbleFillColor;
      // const stroke = b.stroke ?? (val >= 2 ? '#00BC7D' : '#FF9F40');
      const stroke = b.stroke ?? (val >= 2 ? '#ff375e' : '#ff375e');

      let bx = cx;
      let by = cy;

      // Free placement (dx/dy) wins if provided
      if (typeof b.dx === 'number' || typeof b.dy === 'number') {
        bx = cx + (b.dx ?? 0);
        by = cy + (b.dy ?? 0);
      } else if (
        typeof b.axisIndex === 'number' &&
        typeof b.value === 'number' &&
        axisCount > 0
      ) {
        const idx = this.clampInt(b.axisIndex, 0, axisCount - 1);
        const v = this.clamp(b.value / this.maxValue, 0, 1);
        const angle = this.angleForAxis(idx, axisCount);
        // Shift to center of slice
        const bubbleAngle = angle + step / 2;
        const p = this.polarToXY(cx, cy, this.outerRadius * v, bubbleAngle);
        bx = p.x;
        by = p.y;
      }

      const c = this.makeCircle(bx, by, b.r, fill, this.bubbleFillOpacity);
      this.setAttr(c, 'stroke', stroke);
      this.setAttr(c, 'stroke-width', String(strokeWidth));

      // Add animation class
      this.renderer.addClass(c, 'chart-bubble');
      // Stagger animation based on index
      this.renderer.setStyle(c, 'animation-delay', `${0.1 * (this.bubbles.indexOf(b))}s`);

      // Tooltip events
      this.renderer.listen(c, 'mouseenter', (e: MouseEvent) => {
        const label = typeof b.axisIndex === 'number' ? this.labels[b.axisIndex] : '';
        const value = typeof b.value === 'number' ? String(b.value) : '';
        this.showTooltip(e, label, value);
      });

      this.renderer.listen(c, 'mousemove', (e: MouseEvent) => {
        this.moveTooltip(e);
      });

      this.renderer.listen(c, 'mouseleave', () => {
        this.hideTooltip();
      });

      bubblesGroup.appendChild(c);

      const numberText = typeof b.value === 'number' ? String(b.value) : '';
      if (numberText) {
        const t = this.makeText(bx, by, numberText, 'middle');
        this.setAttr(t, 'dominant-baseline', 'middle');
        this.setAttr(t, 'class', 'bubble-number');
        this.setAttr(t, 'font-size', String(Math.max(10, Math.floor(b.r * 0.9))));
        this.setAttr(t, 'fill', '#000000');
        this.setAttr(t, 'pointer-events', 'none');
        bubblesGroup.appendChild(t);
      }
    }
    svg.appendChild(bubblesGroup);
  }

  private showTooltip(e: MouseEvent, label: string, value: string): void {
    this.tooltipLabel = label;
    this.tooltipValue = value;
    this.tooltipVisible = true;
    this.moveTooltip(e);
    this.cdr.detectChanges();
  }

  private moveTooltip(e: MouseEvent): void {
    // Position tooltip relative to the viewport or container
    // Using simple offset from mouse cursor
    this.tooltipX = e.clientX + 10;
    this.tooltipY = e.clientY + 10;
    this.cdr.detectChanges(); // Update position immediately
  }

  private hideTooltip(): void {
    this.tooltipVisible = false;
    this.cdr.detectChanges();
  }

  // ---------- SVG helpers ----------

  private makeGroup(): SVGGElement {
    return this.renderer.createElement('g', this.SVG_NS);
  }

  private makeCircle(
    cx: number,
    cy: number,
    r: number,
    fill: string,
    opacity: number,
    forceNoFill = false
  ): SVGCircleElement {
    const el = this.renderer.createElement('circle', this.SVG_NS) as SVGCircleElement;
    this.setAttr(el, 'cx', String(cx));
    this.setAttr(el, 'cy', String(cy));
    this.setAttr(el, 'r', String(r));
    this.setAttr(el, 'fill', forceNoFill ? 'none' : fill);
    if (!forceNoFill) this.setAttr(el, 'fill-opacity', String(opacity));
    return el;
  }

  private makeLine(x1: number, y1: number, x2: number, y2: number): SVGLineElement {
    const el = this.renderer.createElement('line', this.SVG_NS) as SVGLineElement;
    this.setAttr(el, 'x1', String(x1));
    this.setAttr(el, 'y1', String(y1));
    this.setAttr(el, 'x2', String(x2));
    this.setAttr(el, 'y2', String(y2));
    return el;
  }

  private makeText(x: number, y: number, value: string, anchor: 'start' | 'middle' | 'end'): SVGTextElement {
    const el = this.renderer.createElement('text', this.SVG_NS) as SVGTextElement;
    this.setAttr(el, 'x', String(x));
    this.setAttr(el, 'y', String(y));
    this.setAttr(el, 'text-anchor', anchor);
    el.textContent = value;
    return el;
  }

  private setAttr(el: Element, name: string, value: string): void {
    this.renderer.setAttribute(el, name, value);
  }

  // ---------- Math helpers ----------

  private degToRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  private angleForAxis(i: number, axisCount: number): number {
    const start = this.degToRad(this.startAngleDeg);
    const step = (Math.PI * 2) / axisCount;
    return start + i * step;
  }

  private polarToXY(cx: number, cy: number, r: number, angleRad: number): { x: number; y: number } {
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  }

  private labelAnchorForAngle(angleRad: number): 'start' | 'middle' | 'end' {
    const c = Math.cos(angleRad);
    if (c > 0.35) return 'start';
    if (c < -0.35) return 'end';
    return 'middle';
  }

  private clamp(v: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, v));
  }

  private clampInt(v: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, Math.floor(v)));
  }
}
