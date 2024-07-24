import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateProgressDialogComponent } from './updateProgressDialog.component';

describe('UpdateProgressDialogComponent', () => {
  let component: UpdateProgressDialogComponent;
  let fixture: ComponentFixture<UpdateProgressDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProgressDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateProgressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
