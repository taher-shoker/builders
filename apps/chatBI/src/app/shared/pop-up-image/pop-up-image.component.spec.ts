import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopUpImageComponent } from './pop-up-image.component';

describe('PopUpImageComponent', () => {
  let component: PopUpImageComponent;
  let fixture: ComponentFixture<PopUpImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PopUpImageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PopUpImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
