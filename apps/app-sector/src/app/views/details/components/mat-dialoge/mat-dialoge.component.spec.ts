import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogeComponent } from './mat-dialoge.component';

describe('MatDialogeComponent', () => {
  let component: MatDialogeComponent;
  let fixture: ComponentFixture<MatDialogeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatDialogeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MatDialogeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
