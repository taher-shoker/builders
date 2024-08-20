import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PsrDetailsPageComponent } from './psr-details-page.component';

describe('PsrDetailsPageComponent', () => {
  let component: PsrDetailsPageComponent;
  let fixture: ComponentFixture<PsrDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsrDetailsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PsrDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
