import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentionsEditorComponent } from './mentions-editor.component';

describe('MentionsEditorComponent', () => {
  let component: MentionsEditorComponent;
  let fixture: ComponentFixture<MentionsEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MentionsEditorComponent]
    });
    fixture = TestBed.createComponent(MentionsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
