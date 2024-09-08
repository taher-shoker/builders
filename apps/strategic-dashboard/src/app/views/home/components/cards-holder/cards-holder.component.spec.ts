import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsHolderComponent } from './cards-holder.component';

describe('CardsHolderComponent', () => {
  let component: CardsHolderComponent;
  let fixture: ComponentFixture<CardsHolderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardsHolderComponent]
    });
    fixture = TestBed.createComponent(CardsHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
