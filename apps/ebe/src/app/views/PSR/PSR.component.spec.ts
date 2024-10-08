import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PSRComponent } from './PSR.component';

describe('PSRComponent', () => {
  let component: PSRComponent;
  let fixture: ComponentFixture<PSRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PSRComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PSRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
