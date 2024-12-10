import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiStandardComponent } from './api-standard-list.component';

describe('ApiStandardComponent', () => {
  let component: ApiStandardComponent;
  let fixture: ComponentFixture<ApiStandardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApiStandardComponent],
    });
    fixture = TestBed.createComponent(ApiStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
