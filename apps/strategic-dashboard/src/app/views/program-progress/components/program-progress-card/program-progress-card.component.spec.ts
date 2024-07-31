import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgramProgressCardComponent } from './program-progress-card.component';

describe('ProgramProgressCardComponent', () => {
  let component: ProgramProgressCardComponent;
  let fixture: ComponentFixture<ProgramProgressCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProgramProgressCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramProgressCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
