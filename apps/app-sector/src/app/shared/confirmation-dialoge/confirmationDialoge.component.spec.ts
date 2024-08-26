import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationDialogeComponent } from './confirmationDialoge.component';

describe('ConfirmationDialogeComponent', () => {
  let component: ConfirmationDialogeComponent;
  let fixture: ComponentFixture<ConfirmationDialogeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmationDialogeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
