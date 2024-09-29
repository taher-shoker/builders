import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileComponent } from './data-upload.component';

describe('UploadFileComponent', () => {
  let component: UploadFileComponent;
  let fixture: ComponentFixture<UploadFileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadFileComponent],
    });
    fixture = TestBed.createComponent(UploadFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
