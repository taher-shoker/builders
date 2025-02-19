import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiStandardListComponent } from './api-standard-list.component';

describe('ApiStandardComponent', () => {
  let component: ApiStandardListComponent;
  let fixture: ComponentFixture<ApiStandardListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApiStandardListComponent],
    });
    fixture = TestBed.createComponent(ApiStandardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
