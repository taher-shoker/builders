import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ZoomedCardChartComponent } from './zoomedCardChart.component';

describe('ZoomedCardChartComponent', () => {
  let component: ZoomedCardChartComponent;
  let fixture: ComponentFixture<ZoomedCardChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ZoomedCardChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ZoomedCardChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
