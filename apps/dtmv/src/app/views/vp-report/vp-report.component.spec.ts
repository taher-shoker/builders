import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VpReportComponent } from './vp-report.component';

describe('HomeComponent', () => {
  let component: VpReportComponent;
  let fixture: ComponentFixture<VpReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VpReportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VpReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
