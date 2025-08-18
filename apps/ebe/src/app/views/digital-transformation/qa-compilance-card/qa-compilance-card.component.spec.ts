import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QaCompilanceCardComponent } from './qa-compilance-card.component';

describe('QaCompilanceCardComponent', () => {
  let component: QaCompilanceCardComponent;
  let fixture: ComponentFixture<QaCompilanceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QaCompilanceCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QaCompilanceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
