
import { AbstractControl, ValidationErrors } from '@angular/forms'
import * as moment from 'moment';

export class YearValidators {

  static lessThanCurrentYear(control: AbstractControl): ValidationErrors | null {
    const currentYear = new Date().getFullYear();
    const controlValue = parseInt(<string>control.value);

    if (controlValue < currentYear)
      return { lessThanCurrentYear: true }

    return null;
  }

  static greaterThanCurrentYear(control: AbstractControl): ValidationErrors | null {
    const currentYear = new Date().getFullYear();
    const controlValue = parseInt(<string>control.value);

    if (controlValue >= currentYear)
      return { greaterThanCurrentYear: true }

    return null;
  }

  static lessThanToday(control: AbstractControl): ValidationErrors | null {
    const todayWithoutTime = moment(new Date()).format('YYYY-MM-DD');
    const today = new Date(todayWithoutTime).getTime();
    const controlValue = new Date(<string>control.value).getTime();

    if (controlValue < today)
      return { lessThanToday: true };

    return null;
  }

  static greaterThanToday(control: AbstractControl): ValidationErrors | null {
    const todayWithoutTime = moment(new Date()).format('YYYY-MM-DD');
    const today = new Date(todayWithoutTime).getTime();
    const controlValue = new Date(<string>control.value).getTime();

    if (controlValue > today)
      return { greaterThanToday: true };

    return null;
  }
}
