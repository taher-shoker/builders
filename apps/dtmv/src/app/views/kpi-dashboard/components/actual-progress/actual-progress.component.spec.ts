import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualProgressComponent } from './actual-progress.component';

describe('ActualProgressComponent', () => {
  let component: ActualProgressComponent;
  let fixture: ComponentFixture<ActualProgressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualProgressComponent]
    });
    fixture = TestBed.createComponent(ActualProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
