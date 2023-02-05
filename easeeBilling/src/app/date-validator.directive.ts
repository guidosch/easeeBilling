import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function validateDateNotInFuture(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        let entered = new Date(control.value);
        if (entered > new Date()){
          return { "dateInFuture": "todo message" };
        }
      return null;
    };
  }
