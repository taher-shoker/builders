import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiStandardFiltersComponent } from './api-standard-filters.component';

describe('ApiStandardFiltersComponent', () => {
  let component: ApiStandardFiltersComponent;
  let fixture: ComponentFixture<ApiStandardFiltersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApiStandardFiltersComponent]
    });
    fixture = TestBed.createComponent(ApiStandardFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
