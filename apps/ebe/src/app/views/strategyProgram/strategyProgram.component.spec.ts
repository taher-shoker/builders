import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StrategyProgramComponent } from './strategyProgram.component';

describe('StrategyProgramComponent', () => {
  let component: StrategyProgramComponent;
  let fixture: ComponentFixture<StrategyProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategyProgramComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StrategyProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
