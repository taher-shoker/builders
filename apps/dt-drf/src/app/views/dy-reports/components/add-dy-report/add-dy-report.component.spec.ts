import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddDyReportComponent } from './add-dy-report.component';

describe('AddDyReportComponent', () => {
  let component: AddDyReportComponent;
  let fixture: ComponentFixture<AddDyReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddDyReportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddDyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
