import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartControllerComponent } from './chartController.component';

describe('ChartControllerComponent', () => {
  let component: ChartControllerComponent;
  let fixture: ComponentFixture<ChartControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartControllerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
