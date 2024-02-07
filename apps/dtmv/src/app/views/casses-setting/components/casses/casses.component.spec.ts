import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CassesComponent } from './casses.component';

describe('CassesComponent', () => {
  let component: CassesComponent;
  let fixture: ComponentFixture<CassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CassesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
