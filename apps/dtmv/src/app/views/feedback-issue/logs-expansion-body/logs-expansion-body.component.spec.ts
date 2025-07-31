import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LogsExpansionBodyComponent } from './logs-expansion-body.component';

describe('LogsExpansionBodyComponent', () => {
  let component: LogsExpansionBodyComponent;
  let fixture: ComponentFixture<LogsExpansionBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LogsExpansionBodyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LogsExpansionBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
