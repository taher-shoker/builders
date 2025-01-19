import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiStandardFormComponent } from './api-standard-form.component';

describe('ApiStandardFormComponent', () => {
  let component: ApiStandardFormComponent;
  let fixture: ComponentFixture<ApiStandardFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApiStandardFormComponent]
    });
    fixture = TestBed.createComponent(ApiStandardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
