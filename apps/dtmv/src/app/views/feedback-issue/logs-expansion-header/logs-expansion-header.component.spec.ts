import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogsExpansionHeaderComponent } from './logs-expansion-header.component';

describe('LogsExpansionHeaderComponent', () => {
  let component: LogsExpansionHeaderComponent;
  let fixture: ComponentFixture<LogsExpansionHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogsExpansionHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogsExpansionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
