import { Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FileModel } from '../common/models/file.model';
import * as moment from 'moment';

const MAX_YEAR = parseInt(moment(new Date()).format('YYYY')) - 1;

const ENROLLMENT_AND_PASSPORT: FormGroup = new FormGroup({
  enrollmentDetails: new FormGroup({
    hajjExperience: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
    lastHajjYear: new FormControl(null, [Validators.required, Validators.min(1901), Validators.max(MAX_YEAR), Validators.pattern(/^[0-9]{4}$/)]),
    enrollmentZone: new FormControl(null, Validators.required)
  }),
  passportDetails: new FormGroup({
    passportType: new FormControl(null, Validators.required),
    passportNumber: new FormControl(null, Validators.required),
    placeOfIssue: new FormControl(null, Validators.required),
    dateOfIssue: new FormControl(null, Validators.required),
    expiryDate: new FormControl(null, Validators.required),
  })
});

const PERSONAL_AND_OFFICE: FormGroup = new FormGroup({
  personalDetails: new FormGroup({
    surname: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(24)]),
    otherNames: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(150)]),
    sex: new FormControl(null, Validators.required),
    maritalStatus: new FormControl(null, Validators.required),
    homeAddress: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
    stateOfOrigin: new FormControl(null, Validators.required),
    localGovOfOrigin: new FormControl(null, Validators.required),
    dateOfBirth: new FormControl(null, Validators.required),
    phone: new FormControl(null, [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern(/^[0-9]{11}$/)]),
    alternatePhone: new FormControl('', Validators.pattern(/^[0-9]{11}$/))
  }),
  officeDetails: new FormGroup({
    occupation: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    placeOfWork: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    officeAddress: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
    profession: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
  })
});

const NEXT_OF_KIN_DETAILS: FormGroup = new FormGroup({
  fullName: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
  address: new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]),
  phone: new FormControl(null, [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern(/^[0-9]{11}/)]),
  relationship: new FormControl(null, Validators.required)
});

const ATTACHED_DOCUMENTS: FormGroup = new FormGroup({
  guarantorFormUrl: new FormControl(null, Validators.required),
  passportUrl: new FormControl(null, Validators.required),
  mouUrl: new FormControl(null, Validators.required)
});

const PAYMENT_HISTORY: FormArray = new FormArray([new FormGroup({
  bank: new FormControl(null, Validators.required),
  tellerNumber: new FormControl(null, Validators.required),
  receiptNumber: new FormControl(null, Validators.required),
  paymentDate: new FormControl(null, Validators.required),
  amount: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+$/)])
})]);

const FILES: FileModel[] = [];

const FORMS = {
  enrollmentAndPassport: ENROLLMENT_AND_PASSPORT,
  personalAndOffice: PERSONAL_AND_OFFICE,
  nextOfKinDetails: NEXT_OF_KIN_DETAILS,
  attachedDocuments: ATTACHED_DOCUMENTS,
  paymentHistory: PAYMENT_HISTORY
};

@Injectable({
  providedIn: 'root'
})
export class FormsService {

  enrollmentAndPassport$: BehaviorSubject<FormGroup> = new BehaviorSubject<FormGroup>(null);
  personalAndOffice$: BehaviorSubject<FormGroup> = new BehaviorSubject<FormGroup>(null);
  nextOfKinDetails$: BehaviorSubject<FormGroup> = new BehaviorSubject<FormGroup>(null);
  attachedDocuments$: BehaviorSubject<FormGroup> = new BehaviorSubject<FormGroup>(null);
  paymentHistory$: BehaviorSubject<FormArray> = new BehaviorSubject<FormArray>(null);
  files$: BehaviorSubject<FileModel[]> = new BehaviorSubject<FileModel[]>(FILES);

  constructor() {
    this.init();
  }

  init(): void {
    this.enrollmentAndPassport$.next(FORMS.enrollmentAndPassport);
    this.personalAndOffice$.next(FORMS.personalAndOffice);
    this.nextOfKinDetails$.next(FORMS.nextOfKinDetails);
    this.attachedDocuments$.next(FORMS.attachedDocuments);
    this.paymentHistory$.next(FORMS.paymentHistory);
  }

  get enrollmentAndPassport(): FormGroup {
    return this.enrollmentAndPassport$.value;
  }

  get personalAndOffice(): FormGroup {
    return this.personalAndOffice$.value;
  }

  get nextOfKinDetails(): FormGroup {
    return this.nextOfKinDetails$.value;
  }

  get attachedDocuments(): FormGroup {
    return this.attachedDocuments$.value;
  }

  get paymentHistory(): FormArray {
    return this.paymentHistory$.value;
  }

  get files(): FileModel[] {
    return this.files$.value;
  }

  reset() {
    FORMS.enrollmentAndPassport.reset();
    FORMS.personalAndOffice.reset();
    FORMS.nextOfKinDetails.reset();
    FORMS.attachedDocuments.reset();
    FORMS.paymentHistory.reset();

    FILES.splice(0, FILES.length);

    this.init();
  }

  get paymentArray(): any[] {
    const payments = [];

    for (let control of this.paymentHistory.controls) {
      payments.push(control.value);
    }

    return payments;
  }

  get formValue() {
    return {
      enrollmentDetails: this.enrollmentAndPassport.get('enrollmentDetails').value,
      passportDetails: this.enrollmentAndPassport.get('passportDetails').value,
      personalDetails: this.personalAndOffice.get('personalDetails').value,
      officeDetails: this.personalAndOffice.get('officeDetails').value,
      nextOfKinDetails: this.nextOfKinDetails.value,
      attachedDocuments: this.attachedDocuments.value,
      paymentHistory: [...this.paymentArray]
    };
  }

  get formData(): FormData {
    const formData = new FormData();
    this.files.forEach(f => formData.append('files', f.file, f.fileName));

    return formData;
  }
}
