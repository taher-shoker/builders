import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataUploadTableComponent } from './data-upload-table.component';

describe('DataUploadTableComponent', () => {
  let component: DataUploadTableComponent;
  let fixture: ComponentFixture<DataUploadTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataUploadTableComponent]
    });
    fixture = TestBed.createComponent(DataUploadTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
