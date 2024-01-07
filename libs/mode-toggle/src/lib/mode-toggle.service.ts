import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModeStorage, MODE_STORAGE_SERVICE } from './mode-storage.service';
import { Mode } from './mode-toggle.model';

@Injectable()
export class ModeToggleService {
  lightMode = true;
  private currentMode: Mode = Mode.LIGHT;
  private modeChangedSubject = new BehaviorSubject(this.currentMode);

  modeChanged$: Observable<Mode>;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(MODE_STORAGE_SERVICE) public modeStorage: ModeStorage
  ) {
    this.modeChanged$ = this.modeChangedSubject.asObservable();
    this.init();
  }

  private updateCurrentMode(mode: Mode) {
    this.currentMode = mode;
    this.lightMode = mode === Mode.DARK ? false : true;
    this.modeChangedSubject.next(this.currentMode);
    this.modeStorage.save(this.currentMode);
  }

  private init() {
    const deviceMode = window.matchMedia('(prefers-color-scheme: dark)');
    let initMode = this.modeStorage.get();
    if (!initMode) {
      deviceMode.matches ? (initMode = Mode.LIGHT) : (initMode = Mode.DARK);
    }
    this.updateCurrentMode(initMode);
    this.document.body.classList.add(this.currentMode);
  }

  toggleMode() {
    this.document.body.classList.toggle(Mode.LIGHT);
    this.document.body.classList.toggle(Mode.DARK);
    if (this.currentMode === Mode.LIGHT) {
      this.updateCurrentMode(Mode.DARK);
      this.lightMode = false;
    } else {
      this.updateCurrentMode(Mode.LIGHT);
      this.lightMode = true;
    }
  }
}
