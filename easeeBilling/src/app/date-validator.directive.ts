import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function validateDateNotInFuture(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        console.log(control.value);
        let now = new Date();
        let entered = new Date(control.value);
        if (entered > now){
          return { "dateInFuture": "guido" };
        }
      return null;
    };
  }
