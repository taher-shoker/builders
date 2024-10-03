import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramDetailsCardComponent } from './program-details-card.component';

describe('ProgramDetailsCardComponent', () => {
  let component: ProgramDetailsCardComponent;
  let fixture: ComponentFixture<ProgramDetailsCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgramDetailsCardComponent]
    });
    fixture = TestBed.createComponent(ProgramDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
