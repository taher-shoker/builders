import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DelegationDialogComponent } from './export-dialog.component';

describe('UpdateProgressDialogComponent', () => {
  let component: DelegationDialogComponent;
  let fixture: ComponentFixture<DelegationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelegationDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DelegationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
