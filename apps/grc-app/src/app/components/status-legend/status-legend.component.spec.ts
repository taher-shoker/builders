import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusLegendComponent } from './status-legend.component';

describe('StatusLegendComponent', () => {
  let component: StatusLegendComponent;
  let fixture: ComponentFixture<StatusLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusLegendComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
