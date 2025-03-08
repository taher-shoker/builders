import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomepageMobileComponent } from './homepage-mobile.component';

describe('HomepageMobileComponent', () => {
  let component: HomepageMobileComponent;
  let fixture: ComponentFixture<HomepageMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageMobileComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomepageMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
