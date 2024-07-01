import { AbstractControl, ValidationErrors } from '@angular/forms';

export function quillContentValidator(control: AbstractControl): ValidationErrors | null {
  const content = control.value;
  const isEmpty = !content || content === '<p><br></p>' || content.trim() === '';
  return isEmpty ? { 'quillEmpty': true } : null;
}