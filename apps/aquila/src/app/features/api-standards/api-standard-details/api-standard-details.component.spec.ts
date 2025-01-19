import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiStandardDetailsComponent } from './api-standard-details.component';

describe('ApiStandardDetailsComponent', () => {
  let component: ApiStandardDetailsComponent;
  let fixture: ComponentFixture<ApiStandardDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApiStandardDetailsComponent]
    });
    fixture = TestBed.createComponent(ApiStandardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
