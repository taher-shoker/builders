import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KpisHolderComponent } from './kpis-holder.component';

describe('KpisHolderComponent', () => {
  let component: KpisHolderComponent;
  let fixture: ComponentFixture<KpisHolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KpisHolderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KpisHolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
