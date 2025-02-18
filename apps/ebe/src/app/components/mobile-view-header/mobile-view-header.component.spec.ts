import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MobileViewHeaderComponent } from './mobile-view-header.component';

describe('MobileViewHeaderComponent', () => {
  let component: MobileViewHeaderComponent;
  let fixture: ComponentFixture<MobileViewHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileViewHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MobileViewHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
