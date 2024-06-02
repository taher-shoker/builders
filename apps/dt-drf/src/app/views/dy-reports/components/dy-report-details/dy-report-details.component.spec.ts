import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DyReportDetailsComponent } from './dy-report-details.component';

describe('DyReportDetailsComponent', () => {
  let component: DyReportDetailsComponent;
  let fixture: ComponentFixture<DyReportDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DyReportDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DyReportDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
