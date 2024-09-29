import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultWeightCardComponent } from './result-weight-card.component';

describe('ResultWeightCardComponent', () => {
  let component: ResultWeightCardComponent;
  let fixture: ComponentFixture<ResultWeightCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultWeightCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultWeightCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
