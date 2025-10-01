import {
  Component,
  computed,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { KPI } from '../../models/kpi.model';


@Component({
  selector: 'stc-apps-kpi-list',
  templateUrl: './kpi-list.component.html',
  styleUrls: ['./kpi-list.component.scss'],
})
export class KpiListComponent {
  kpis = input<KPI[]>(this.getDummyKpis());
  selectedKpi = input<KPI | null>(null);

  @Output() kpiSelected = new EventEmitter<KPI>();

  filteredKpis = computed(() => this.kpis());
  isEmpty = computed(() => this.filteredKpis().length === 0);

  private getDummyKpis(): KPI[] {
    return [
      {
        id: '1',
        name: 'Revenue Growth',
        description: 'Quarterly revenue growth compared to previous year',
        currentValue: 4.2,
        targetValue: 5.0,
        progress: 84,
        unit: 'Million USD',
        status: 'on-track',
        lastUpdated: new Date('2024-01-15'),
        owner: 'Sales Department',
        category: 'Financial'
      },
      {
        id: '2',
        name: 'Customer Satisfaction',
        description: 'Net Promoter Score from customer surveys',
        currentValue: 72,
        targetValue: 80,
        progress: 90,
        unit: 'NPS Score',
        status: 'on-track',
        lastUpdated: new Date('2024-01-14'),
        owner: 'Customer Success',
        category: 'Customer'
      },
      {
        id: '3',
        name: 'Employee Engagement',
        description: 'Employee satisfaction and engagement score',
        currentValue: 65,
        targetValue: 75,
        progress: 86,
        unit: 'Score',
        status: 'at-risk',
        lastUpdated: new Date('2024-01-10'),
        owner: 'HR Department',
        category: 'People'
      },
      {
        id: '4',
        name: 'Project Completion Rate',
        description: 'Percentage of projects completed on time',
        currentValue: 45,
        targetValue: 70,
        progress: 64,
        unit: 'Percentage',
        status: 'delayed',
        lastUpdated: new Date('2024-01-12'),
        owner: 'Project Management',
        category: 'Operational'
      },
      {
        id: '5',
        name: 'Website Traffic',
        description: 'Monthly unique visitors to company website',
        currentValue: 125000,
        targetValue: 150000,
        progress: 83,
        unit: 'Visitors',
        status: 'on-track',
        lastUpdated: new Date('2024-01-13'),
        owner: 'Marketing Team',
        category: 'Marketing'
      },
      {
        id: '6',
        name: 'Product Defect Rate',
        description: 'Percentage of products with quality issues',
        currentValue: 2.5,
        targetValue: 1.5,
        progress: 60,
        unit: 'Percentage',
        status: 'at-risk',
        lastUpdated: new Date('2024-01-11'),
        owner: 'Quality Assurance',
        category: 'Quality'
      },
      {
        id: '7',
        name: 'Social Media Engagement',
        description: 'Average engagement rate across social platforms',
        currentValue: 3.2,
        targetValue: 4.0,
        progress: 80,
        unit: 'Percentage',
        status: 'on-track',
        lastUpdated: new Date('2024-01-09'),
        owner: 'Social Media Team',
        category: 'Marketing'
      },
      {
        id: '8',
        name: 'Training Completion',
        description: 'Percentage of employees completing required training',
        currentValue: 85,
        targetValue: 95,
        progress: 89,
        unit: 'Percentage',
        status: 'on-track',
        lastUpdated: new Date('2024-01-08'),
        owner: 'Learning & Development',
        category: 'People'
      }
    ];
  }

  onKpiSelect(kpi: KPI): void {
    this.kpiSelected.emit(kpi);
  }

}
