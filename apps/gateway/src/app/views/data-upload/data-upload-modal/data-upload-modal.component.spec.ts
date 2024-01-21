import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataUploadModalComponent } from './data-upload-modal.component';

describe('DataUploadModalComponent', () => {
  let component: DataUploadModalComponent;
  let fixture: ComponentFixture<DataUploadModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataUploadModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DataUploadModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
