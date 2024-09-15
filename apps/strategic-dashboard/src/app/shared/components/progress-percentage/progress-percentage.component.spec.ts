import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressPercentageComponent } from './progress-percentage.component';

describe('ProgressPercentageComponent', () => {
  let component: ProgressPercentageComponent;
  let fixture: ComponentFixture<ProgressPercentageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressPercentageComponent]
    });
    fixture = TestBed.createComponent(ProgressPercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
