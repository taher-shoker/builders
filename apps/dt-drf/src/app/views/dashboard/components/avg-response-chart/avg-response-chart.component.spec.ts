/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AvgResponseChartComponent } from './avg-response-chart.component';

describe('AvgResponseChartComponent', () => {
  let component: AvgResponseChartComponent;
  let fixture: ComponentFixture<AvgResponseChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvgResponseChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvgResponseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
