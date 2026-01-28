import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KriItemComponent } from './kri-item.component';

describe('KriItemComponent', () => {
  let component: KriItemComponent;
  let fixture: ComponentFixture<KriItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KriItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KriItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
