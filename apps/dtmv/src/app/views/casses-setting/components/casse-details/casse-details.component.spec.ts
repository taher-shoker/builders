import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CasseDetailsComponent } from './casse-details.component';

describe('CasseDetailsComponent', () => {
  let component: CasseDetailsComponent;
  let fixture: ComponentFixture<CasseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CasseDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CasseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
