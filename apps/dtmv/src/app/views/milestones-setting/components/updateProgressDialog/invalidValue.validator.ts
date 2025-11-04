import { AbstractControl, ValidatorFn } from '@angular/forms';

// Custom validator function with a dynamic threshold value
export function customValidator(
  threshold: number,
  isPlannedStatus: boolean
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const numValue = Number(control.value);

    // if (isPlannedStatus && numValue === 100) {
    //   return { plannedStatusLimit: true };
    // }
    if (control.value && (control.value <= threshold || control.value > 100)) {
      return { invalidValue: true };
    }
    return null;
  };
}
