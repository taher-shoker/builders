import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DyDashboardComponent } from './dy-dashboard.component';

describe('HomeComponent', () => {
  let component: DyDashboardComponent;
  let fixture: ComponentFixture<DyDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DyDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
