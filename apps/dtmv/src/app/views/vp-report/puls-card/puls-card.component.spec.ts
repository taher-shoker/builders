import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PulsCardComponent } from './puls-card.component';

describe('PulsCardComponent', () => {
  let component: PulsCardComponent;
  let fixture: ComponentFixture<PulsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PulsCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PulsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
