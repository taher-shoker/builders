import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KriCardComponent } from './kri-card.component';

describe('KriCardComponent', () => {
  let component: KriCardComponent;
  let fixture: ComponentFixture<KriCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KriCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KriCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
