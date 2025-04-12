import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditModeViewComponent } from './edit-mode-view.component';

describe('EditModeViewComponent', () => {
  let component: EditModeViewComponent;
  let fixture: ComponentFixture<EditModeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditModeViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EditModeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
