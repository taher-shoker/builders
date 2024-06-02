import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditDyReportComponent } from './edit-dy-report.component';

describe('EditDyReportComponent', () => {
  let component: EditDyReportComponent;
  let fixture: ComponentFixture<EditDyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDyReportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditDyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
