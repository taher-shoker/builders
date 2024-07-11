import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CostCardComponent } from './cost-card.component';

describe('CostCardComponent', () => {
  let component: CostCardComponent;
  let fixture: ComponentFixture<CostCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CostCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
