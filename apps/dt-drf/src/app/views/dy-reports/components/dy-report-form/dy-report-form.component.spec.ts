import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DyReportFormComponent } from './dy-report-form.component';

describe('DyReportFormComponent', () => {
  let component: DyReportFormComponent;
  let fixture: ComponentFixture<DyReportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DyReportFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DyReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
