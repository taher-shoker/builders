import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateValueDialogComponent } from './update-value-dialog.component';

describe('UpdateValueDialogComponent', () => {
  let component: UpdateValueDialogComponent;
  let fixture: ComponentFixture<UpdateValueDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateValueDialogComponent]
    });
    fixture = TestBed.createComponent(UpdateValueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
