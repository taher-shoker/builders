import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitButtonComponent } from './split-button.component';

describe('SplitButtonComponent', () => {
  let component: SplitButtonComponent;
  let fixture: ComponentFixture<SplitButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SplitButtonComponent]
    });
    fixture = TestBed.createComponent(SplitButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
