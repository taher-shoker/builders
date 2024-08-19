import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RepliesSectionComponent } from './replies-section.component';

describe('RepliesSectionComponent', () => {
  let component: RepliesSectionComponent;
  let fixture: ComponentFixture<RepliesSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RepliesSectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RepliesSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
