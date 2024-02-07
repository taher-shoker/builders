import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CassesSettingComponent } from './casses-setting.component';

describe('CassesSettingComponent', () => {
  let component: CassesSettingComponent;
  let fixture: ComponentFixture<CassesSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CassesSettingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CassesSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
