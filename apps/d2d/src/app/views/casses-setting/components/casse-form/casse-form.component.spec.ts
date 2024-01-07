import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CasseFormComponent } from './casse-form.component';

describe('CasseFormComponent', () => {
  let component: CasseFormComponent;
  let fixture: ComponentFixture<CasseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CasseFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CasseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
