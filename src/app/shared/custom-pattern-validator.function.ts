import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function customPatternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    regex.lastIndex = 0;
    const valid = regex.test(control.value);

    return valid ? null : error;
  };
}
