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
    const list = this.kpis() || [];
    if (!term) return list;
    return list.filter((k) => {
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
    const threshold = 250; // px from bottom
    const atBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - threshold;
    if (atBottom) {
      this.reachListEnd.emit();
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
}
