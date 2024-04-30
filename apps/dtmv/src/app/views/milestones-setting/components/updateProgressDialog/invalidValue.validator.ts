import { AbstractControl, ValidatorFn } from '@angular/forms';

// Custom validator function with a dynamic threshold value
export function customValidator(threshold: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && (control.value <= threshold || control.value > 100)) {
        console.log("VAL:", control.value)
        console.log("threshold:", threshold)
      return { 'invalidValue': true };
    }
    return null;
  };
}