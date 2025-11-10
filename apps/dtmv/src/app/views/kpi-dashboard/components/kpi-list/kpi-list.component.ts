import {
  Component,
  computed,
  EventEmitter,
  input,
  Output,
  AfterViewInit,
  ElementRef,
  ViewChild,
  HostListener,
  effect,
} from '@angular/core';
import { KPI } from '../../models/kpi.model';


@Component({
  selector: 'stc-apps-kpi-list',
  templateUrl: './kpi-list.component.html',
  styleUrls: ['./kpi-list.component.scss'],
})
export class KpiListComponent implements AfterViewInit {
  kpis = input<KPI[]>([]);
  selectedKpi = input<KPI | null>(null);
  searchTerm = input<string>('');
  // Selected dimensions for client-side filtering
  dimensionsFilter = input<string[]>([]);
  // Parent-driven guard: when false, suppress reachListEnd emissions
  canLoadMore = input<boolean>(true);
  hasScroll = false;

  @Output() kpiSelected = new EventEmitter<KPI>();
  @Output() reachListEnd = new EventEmitter<void>();
  @ViewChild('contentEl') contentEl?: ElementRef<HTMLElement>;

  constructor() {
    // Re-evaluate scroll presence whenever the rendered list changes
    effect(() => {
      // Depend on filteredKpis and selectedKpi so the effect runs when list or selection updates
      const list = this.filteredKpis();
      const selected = this.selectedKpi();

      // Auto-select the first item by default when nothing is selected
      // or when the current selection is no longer in the filtered list
      if (list.length > 0 && (!selected || !list.some((k) => k.id === selected.id))) {
        // Defer emit to avoid change detection cycles
        setTimeout(() => this.kpiSelected.emit(list[0]), 0);
      }

      // Measure after DOM updates
      setTimeout(() => this.updateHasScroll(), 0);
    });
  }

  filteredKpis = computed(() => {
    const term = (this.searchTerm() || '').trim().toLowerCase();
    const dims = (this.dimensionsFilter() || []).map((d) => String(d).trim());
    const list = this.kpis() || [];

    // When no dimensions are selected, clear the visible list entirely
    if (!dims || dims.length === 0) {
      return [] as KPI[];
    }

    // Apply dimensions filter first (if any)
    const byDims = list.filter((k) => dims.includes(String(k.description || '').trim()));

    // Apply search term filter
    if (!term) return byDims;
    return byDims.filter((k) => {
      const name = (k.name || '').toLowerCase();
      const desc = (k.description || '').toLowerCase();
      return name.includes(term) || desc.includes(term);
    });
  });
  isEmpty = computed(() => this.filteredKpis().length === 0);


  onKpiSelect(kpi: KPI): void {
    const selected = this.selectedKpi();
    // Ignore clicks when the KPI is already selected
    if (selected && selected.id === kpi.id) {
      return;
    }
    this.kpiSelected.emit(kpi);
  }

  onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target) return;
    // Avoid triggering load-more when there are no KPIs
    if (this.filteredKpis().length === 0) {
      this.updateHasScroll();
      return;
    }
    // If parent indicates we cannot load more (loading or last page), stop here
    if (!this.canLoadMore()) {
      this.updateHasScroll();
      return;
    }
    const threshold = 250; // px from bottom
    const atBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - threshold;
    // Debounce reach-end emissions to avoid rapid repeated triggers
    if (atBottom) {
      this.emitReachEndDebounced();
    }
    // Update whether scrollbar is present
    this.updateHasScroll();
  }

  ngAfterViewInit(): void {
    // Initial check after view is ready
    setTimeout(() => this.updateHasScroll(), 0);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateHasScroll();
  }

  private updateHasScroll(): void {
    const el = this.contentEl?.nativeElement;
    if (!el) return;
    this.hasScroll = el.scrollHeight > el.clientHeight;
  }

  // --- Debounce helper to prevent repeated reach-end events ---
  private lastReachEmit = 0;
  private emitReachEndDebounced(): void {
    const now = Date.now();
    const minIntervalMs = 500;
    if (now - this.lastReachEmit < minIntervalMs) {
      return;
    }
    this.lastReachEmit = now;
    this.reachListEnd.emit();
  }
}
