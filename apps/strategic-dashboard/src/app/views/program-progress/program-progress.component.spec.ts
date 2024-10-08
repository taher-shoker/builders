import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramProgressComponent } from './program-progress.component';

describe('ProgramProgressComponent', () => {
  let component: ProgramProgressComponent;
  let fixture: ComponentFixture<ProgramProgressComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgramProgressComponent]
    });
    fixture = TestBed.createComponent(ProgramProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
