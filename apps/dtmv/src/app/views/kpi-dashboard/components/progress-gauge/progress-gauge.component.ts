import {
  Component,
  Input,
  ChangeDetectionStrategy,
  computed,
  signal,
} from '@angular/core';

type LegendItem = { label: string; key: 'ontrack' | 'atrisk' | 'delayed' };

@Component({
  selector: 'stc-apps-progress-gauge',
  // standalone: true,
  templateUrl: './progress-gauge.component.html',
  styleUrls: ['./progress-gauge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressGaugeComponent {
  /** Main value displayed in the center (0–100). */
  @Input({ required: true }) set progress(v: number) {
    this._progress.set(this.clamp(v));
  }
  @Input() baseline = 98;
  @Input() target = 98;

  /** Geometry / style */
  @Input() size = 360; // overall square size (px)
  @Input() size_width = 280; // overall square size (px)
  @Input() thickness = 22; // ring thickness (px)
  @Input() startAngle = -120; // degrees
  @Input() endAngle = 120; // degrees
  @Input() segmentCount = 10; // how many green segments
  @Input() gapRatio = 0.4; // gap vs dash (0..1) for segmentation
  @Input() dotSpacing = 8; // inner dotted arc spacing

  /** Colors (tweak to your palette) */
  @Input() colorActive = '#00C389';
  @Input() colorMuted = '#E6EAED';
  @Input() colorText = '#111827'; // near black
  @Input() colorDotted = '#FF6A3D'; // soft orange-red like screenshot

  /** Legend items; edit or localize as needed */
  legend: LegendItem[] = [
    { label: 'Ontrack', key: 'ontrack' },
    { label: 'At risk', key: 'atrisk' },
    { label: 'Delayed', key: 'delayed' },
  ];

  private _progress = signal(this.progress);
  progressSig = computed(() => this._progress());

  // ----- Geometry helpers -----
  private clamp(n: number) {
    return Math.max(0, Math.min(100, Math.round(n)));
  }
  get sweep() {
    return this.endAngle - this.startAngle;
  }
  get cx() {
    return this.size / 2;
  }
  get cy() {
    return this.size / 2;
  }
  get rOuter() {
    return this.size / 2 - this.thickness / 2 - 8;
  } // 8px padding
  get rInnerDots() {
    return this.rOuter - this.thickness - 18;
  } // inner dotted arc radius

  polarToCartesian(r: number, angleDeg: number) {
    const a = ((angleDeg - 90) * Math.PI) / 180;
    return { x: this.cx + r * Math.cos(a), y: this.cy + r * Math.sin(a) };
  }

  arcPath(r: number, startAngle: number, endAngle: number) {
    const start = this.polarToCartesian(r, endAngle);
    const end = this.polarToCartesian(r, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  }

  // Background (full sweep, muted)
  get bgPath() {
    return this.arcPath(this.rOuter, this.startAngle, this.endAngle);
  }

  // Active arc path (we’ll paint with stroke-dasharray to create segments)
  get activePath() {
    const end = this.startAngle + (this.sweep * this.progressSig()) / 100;
    return this.arcPath(this.rOuter, this.startAngle, end);
  }

  // Remaining (to show subtle grey continuation at right side)
  get remainingPath() {
    const end = this.startAngle + (this.sweep * this.progressSig()) / 100;
    return this.arcPath(this.rOuter, end, this.endAngle);
  }

  // Individual segment paths - this approach draws each segment separately
  get segmentPaths() {
    const arcLen = this.rOuter * ((this.sweep * Math.PI) / 180);
    const segmentLen = arcLen / this.segmentCount;
    const segmentAngle = this.sweep / this.segmentCount;
    const dash = segmentLen * (1 - this.gapRatio);
    const dashAngle = segmentAngle * (1 - this.gapRatio);

    const progressSegments = Math.floor((this.progressSig() / 100) * this.segmentCount);
    const progressRemainder = ((this.progressSig() / 100) * this.segmentCount) - progressSegments;

    const segments = [];

    // Draw complete segments
    for (let i = 0; i < progressSegments; i++) {
      const startAngle = this.startAngle + (i * segmentAngle);
      const endAngle = startAngle + dashAngle;
      segments.push({
        path: this.arcPath(this.rOuter, startAngle, endAngle),
        isComplete: true
      });
    }

    // Draw partial segment if needed
    if (progressRemainder > 0 && progressSegments < this.segmentCount) {
      const startAngle = this.startAngle + (progressSegments * segmentAngle);
      const partialDashAngle = dashAngle * progressRemainder;
      const endAngle = startAngle + partialDashAngle;
      segments.push({
        path: this.arcPath(this.rOuter, startAngle, endAngle),
        isComplete: false
      });
    }

    return segments;
  }

  // Dash pattern to simulate segmented green blocks (keeping for backward compatibility)
  get dashArray() {
    // approximate arc length = r * theta (in radians)
    const arcLen = this.rOuter * ((this.sweep * Math.PI) / 180);
    const segmentLen = arcLen / this.segmentCount;
    const dash = segmentLen * (1 - this.gapRatio);
    const gap = segmentLen * this.gapRatio;

    // Simple repeating pattern - we'll use dashOffset to position correctly
    return `${dash} ${gap}`;
  }

  // Dash offset to align segments properly (keeping for backward compatibility)
  get dashOffset() {
    return 0; // Not used with the new segmentPaths approach
  }

  // Dotted inner ring
  get dottedDashArray() {
    const arcLen = this.rInnerDots * ((this.sweep * Math.PI) / 180);
    const dot = 1; // 1px dot (smaller for more dotted appearance)
    const gap = this.dotSpacing;
    const repeats = Math.floor(arcLen / (dot + gap));
    return `${0.1} ${1} ${0} ${1}`; // SVG will repeat automatically
  }

  // Marker circle (at the active end)
  get markerCoord() {
    const end = this.startAngle + (this.sweep * this.progressSig()) / 100;
    return this.polarToCartesian(this.rOuter, end);
  }

  // Status drop shape orientation (just rotate a basic teardrop according to value)


get dropRotate() {
  // const progressAngle =
  //   this.startAngle + (this.sweep * this.progressSig()) / 100;

  // const dropRotation =
  //   this.calculateDropRotation(this.progressSig()) ; // 🔹 apply offset

  // console.log(
  //   'Progress:',
  //   this.progressSig(),
  //   'ProgressAngle:',
  //   progressAngle,
  //   'DropRotate (Adjusted):',
  //   dropRotation
  // );

  return  this.calculateLinearDropRotation(this.progressSig());

}
calculateLinearDropRotation(progress: number): number {
  // Clamp progress between 0–100
  progress = Math.max(0, Math.min(progress, 100));

  const minRotation = 85;  // rotation at 0%
  const maxRotation = 280; // rotation at 100%

  // Linear interpolation formula
  const rotation = minRotation + ((maxRotation - minRotation) * progress) / 100;

  return rotation;
}
calculateDropRotation(progress: number): number {
  const keyframes = [
    { p: 0, r: 210 },
    { p: 25, r: 130 },
    { p: 40, r: 100 },
    { p: 45, r: 85 },
    { p: 50, r: 90 },
    { p: 55, r: 105 },
    { p: 75, r: 170 },
    { p: 100, r: -30 },
  ];

  // Clamp progress between 0 and 100
  progress = Math.max(0, Math.min(progress, 100));

  // Find the two keyframes surrounding the current progress
  let lower = keyframes[0];
  let upper = keyframes[keyframes.length - 1];

  for (let i = 0; i < keyframes.length - 1; i++) {
    const k1 = keyframes[i];
    const k2 = keyframes[i + 1];
    if (progress >= k1.p && progress <= k2.p) {
      lower = k1;
      upper = k2;
      break;
    }
  }

  // Exact match
  if (progress === lower.p) return lower.r;
  if (progress === upper.p) return upper.r;

  // Compute normalized ratio (0–1)
  let ratio = (progress - lower.p) / (upper.p - lower.p);

  // Optional: smooth easing (ease-in-out cubic)
  ratio = ratio * ratio * (3 - 2 * ratio);

  // Interpolated rotation
  return lower.r + ratio * (upper.r - lower.r);
}

  //   @Input() good = 80;
  // @Input() warn = 60;
  // get activeColor() {
  //   const v = this.progressSig();
  //   return v >= this.good ? '#00C389' : v >= this.warn ? '#F4C430' : '#EF4444';
  // }
  @Input() dropScale = 1; // let you resize the drop if you want

  get dropPath(): string {
    // Asymmetric teardrop (points upward before rotation)
    const s = this.dropScale;
    return [
      `M ${0 * s},${-28 * s}`, // tip
      `C ${12 * s},${-20 * s} ${18 * s},${-8 * s} ${14 * s},${2 * s}`, // right sweep down (creates the "neck")
      `C ${10 * s},${12 * s} ${2 * s},${18 * s} ${-10 * s},${20 * s}`, // lower belly
      `C ${-22 * s},${22 * s} ${-30 * s},${10 * s} ${-26 * s},${0 * s}`, // left side up
      `C ${-22 * s},${-10 * s} ${-10 * s},${-18 * s} ${0 * s},${-28 * s}`, // back to tip
      'Z',
    ].join(' ');
  }

  get alternativeDropPath(): string {
    // Alternative drop shape - proper teardrop like the attached image
    const s = this.dropScale;
    return [
      'M 0 -30',
      'C -12 -30 -20 -22 -20 -10',
      'C -20 0 -15 8 -8 15',
      'C -4 20 0 25 0 25',
      'C 0 25 4 20 8 15',
      'C 15 8 20 0 20 -10',
      'C 20 -22 12 -30 0 -30',
      'Z',
    ]
      .map((segment) => {
        // Apply dropScale to all coordinates
        return segment.replace(/-?\d+/g, (match) => {
          return String(Math.round(parseFloat(match) * s));
        });
      })
      .join(' ');
  }

  get teardropPath(): string {
    // Teardrop shape based on the hardcoded path with scaling support
    const s = this.dropScale;
    const pathData = 'M0.891844 31.9411C-5.45415 52.7919 23.7393 65.9037 35.5828 47.5668C41.8401 37.8785 36.32 29.7397 36.586 19.3829C36.7582 12.6593 38.8273 6.34589 40.8719 -1.13207e-05C36.9051 4.46187 32.5284 9.50971 27.5175 12.854C17.6907 19.4103 4.89601 18.792 0.891844 31.9411Z';

    // Apply scaling to all numeric values in the path
    return pathData.replace(/-?\d+\.?\d*(?:[eE][+-]?\d+)?/g, (match) => {
      const num = parseFloat(match);
      return String(num * s);
    });
  }
}
