import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QACompilanceComponent } from './qa-compilance.component';

describe('QACompilanceComponent', () => {
  let component: QACompilanceComponent;
  let fixture: ComponentFixture<QACompilanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QACompilanceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QACompilanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
