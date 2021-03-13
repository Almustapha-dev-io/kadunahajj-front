import { AbstractControl, ValidationErrors } from '@angular/forms';
export class CustomNameValidators {

  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    if ((control.value as string).indexOf(' ') >= 0)
      return { cannotContainSpace: true }

    return null;
  }

  static shouldBeUnique(control: AbstractControl): Promise<ValidationErrors | null> {
    // Perform call to db and check
    //  if provided username already exists

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('Ok');
        if (control.value === 'db value')
          resolve({ shouldBeUnique: true });
        else
          resolve(null);
      }, 2000);
    });
  }
}
