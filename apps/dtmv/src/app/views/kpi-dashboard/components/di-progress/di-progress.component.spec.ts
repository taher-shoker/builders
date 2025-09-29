import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiProgressComponent } from './di-progress.component';

describe('DiProgressComponent', () => {
  let component: DiProgressComponent;
  let fixture: ComponentFixture<DiProgressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiProgressComponent]
    });
    fixture = TestBed.createComponent(DiProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
