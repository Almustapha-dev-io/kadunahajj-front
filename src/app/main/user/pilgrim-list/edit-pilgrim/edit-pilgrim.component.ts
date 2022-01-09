import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { v4 as uuid } from 'uuid';

import { ModalLoaderService } from '../../../../services/modal-loader.service';
import { DataService } from '../../../../services/data.service';
import { environment } from '@environment';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { YearValidators } from 'src/app/common/Validators/year.vaalidators';

import { NotificationService } from 'src/app/services/notification.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsService } from 'src/app/services/forms.service';

@Component({
  selector: 'app-edit-pilgrim',
  templateUrl: './edit-pilgrim.component.html',
  styleUrls: ['./edit-pilgrim.component.scss']
})
export class EditPilgrimComponent implements OnInit {
  personalDetails;
  officeDetails;
  passportDetails;
  nextOfKinDetails;
  attachedDocuments;

  banks = [];
  states = [];
  lgas = [];
  lgLoader = false;
  showLga = false;
  subscription = new Subscription();

  editPilgrimForm: FormGroup;
  passportTypes = ['normal', 'official', 'diplomatic'];
  token = sessionStorage.getItem('token');
  uploadedDocuments = {};
  relationships = ['mother', 'father', 'sibling', 'grand parent', 'uncle',
    'aunt', 'cousin', 'niece', 'nephew', 'child', 'spouse'];
  maritalStatuses = ['single', 'married', 'divorced', 'widow', 'widower'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService,
    private formsService: FormsService,
    public loader: ModalLoaderService,
    private fb: FormBuilder,
    private notifications: NotificationService,
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<EditPilgrimComponent>
  ) { }

  ngOnInit(): void {
    this.personalDetails = { ...this.data.personalDetails };
    this.officeDetails = { ...this.data.officeDetails };
    this.passportDetails = { ...this.data.passportDetails };
    this.attachedDocuments = { ...this.data.attachedDocuments };
    this.nextOfKinDetails = { ...this.data.nextOfKinDetails };
    this.initializeForm();

    this.getStates();
  }


  imageFile(name) {
    window.scroll(0, 0);
    return `${environment.pilgrims}/image/${name}`;
  }

  initializeForm(): void {
    this.editPilgrimForm = this.fb.group({
      // enrollmentDetails: this.fb.group({
      //   hajjExperience: [null, [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      //   lastHajjYear: [null, [Validators.required, YearValidators.greaterThanCurrentYear, Validators.minLength(4), Validators.maxLength(4)]]
      // }),
      personalDetails: this.fb.group({
        surname: [this.personalDetails.surname, [Validators.required, Validators.minLength(2), Validators.maxLength(24)]],
        otherNames: [this.personalDetails.otherNames, [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
        sex: [this.personalDetails.sex, Validators.required],
        maritalStatus: [this.personalDetails.maritalStatus, Validators.required],
        homeAddress: [this.personalDetails.homeAddress, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
        stateOfOrigin: [this.personalDetails.stateOfOrigin._id, Validators.required],
        localGovOfOrigin: [this.personalDetails.localGovOfOrigin._id, Validators.required],
        dateOfBirth: [moment(new Date(this.personalDetails.dateOfBirth)).format('YYYY-MM-DD'), [Validators.required, YearValidators.greaterThanToday]],
        phone: [this.personalDetails.phone, [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern(/^[0-9]{11}$/)]],
        alternatePhone: [this.personalDetails.alternatePhone, Validators.pattern(/^[0-9]{11}$/)],
        email: [this.personalDetails.email, Validators.email]
      }),
      officeDetails: this.fb.group({
        occupation: [this.officeDetails.occupation, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        placeOfWork: [this.officeDetails.placeOfWork, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        officeAddress: [this.officeDetails.officeAddress, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        profession: [this.officeDetails.profession, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      }),
      nextOfKinDetails: this.fb.group({
        fullName: [this.nextOfKinDetails.fullName, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
        address: [this.nextOfKinDetails.address, [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
        phone: [this.nextOfKinDetails.phone, [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern(/^[0-9]{11}/)]],
        relationship: [this.nextOfKinDetails.relationship, Validators.required]
      }),
      passportDetails: this.fb.group({
        passportType: [this.passportDetails.passportType, Validators.required],
        passportNumber: [this.passportDetails.passportNumber, Validators.required],
        placeOfIssue: [this.passportDetails.placeOfIssue, Validators.required],
        dateOfIssue: [moment(new Date(this.passportDetails.dateOfIssue)).format('YYYY-MM-DD'), [
          Validators.required,
          YearValidators.greaterThanToday
        ]],
        expiryDate: [moment(new Date(this.passportDetails.expiryDate)).format('YYYY-MM-DD'), [Validators.required, YearValidators.lessThanToday]]
      }),
      attachedDocuments: this.fb.group({
        guarantorFormUrl: [this.attachedDocuments.guarantorFormUrl, Validators.required],
        passportUrl: [this.attachedDocuments.passportUrl, Validators.required],
        mouUrl: [this.attachedDocuments.mouUrl, Validators.required],
        otherDocuments: this.fb.array([])
      })
    });

    const otherDocsForm = this.editPilgrimForm.get('attachedDocuments').get('otherDocuments') as FormArray;
    this.attachedDocuments.otherDocuments.forEach(doc => {
        const form = this.formsService.docForm;
        form.patchValue({
            documentName: doc.documentName,
            docUrl: doc.docUrl
        });
        otherDocsForm.push(form);
    });

    // const paymentHistory = this.editPilgrimForm.get('paymentHistory') as FormArray;
    // this.paymentHistory.forEach(payment => paymentHistory.push(this.getPaymentHistoryForm(payment)));

    // console.log(this.editPilgrimForm.value)
  }

  get personalDetailsForm() {
    return this.editPilgrimForm.get('personalDetails') as FormGroup;
  }
  get officeDetailsForm() {
    return this.editPilgrimForm.get('officeDetails') as FormGroup;
  }
  get passportDetailsForm() {
    return this.editPilgrimForm.get('passportDetails') as FormGroup;
  }
  get nextOfKinDetailsForm() {
    return this.editPilgrimForm.get('nextOfKinDetails') as FormGroup;
  }

  get surname(): FormControl {
    return this.personalDetailsForm.get('surname') as FormControl;
  }
  get otherNames(): FormControl {
    return this.personalDetailsForm.get('otherNames') as FormControl;
  }
  get sex(): FormControl {
    return this.personalDetailsForm.get('sex') as FormControl;
  }
  get maritalStatus(): FormControl {
    return this.personalDetailsForm.get('maritalStatus') as FormControl;
  }
  get homeAddress(): FormControl {
    return this.personalDetailsForm.get('homeAddress') as FormControl;
  }
  get stateOfOrigin(): FormControl {
    return this.personalDetailsForm.get('stateOfOrigin') as FormControl;
  }
  get localGovOfOrigin(): FormControl {
    return this.personalDetailsForm.get('localGovOfOrigin') as FormControl;
  }
  get dateOfBirth(): FormControl {
    return this.personalDetailsForm.get('dateOfBirth') as FormControl;
  }
  get phone(): FormControl {
    return this.personalDetailsForm.get('phone') as FormControl;
  }
  get alternatePhone(): FormControl {
    return this.personalDetailsForm.get('alternatePhone') as FormControl;
  }
  get email(): FormControl {
    return this.personalDetailsForm.get('email') as FormControl;
  }
  get occupation(): FormControl {
    return this.officeDetailsForm.get('occupation') as FormControl;
  }
  get placeOfWork(): FormControl {
    return this.officeDetailsForm.get('placeOfWork') as FormControl;
  }
  get officeAddress(): FormControl {
    return this.officeDetailsForm.get('officeAddress') as FormControl;
  }
  get profession(): FormControl {
    return this.officeDetailsForm.get('profession') as FormControl;
  }

  get passportType(): FormControl {
    return this.passportDetailsForm.get('passportType') as FormControl;
  }

  get passportNumber(): FormControl {
    return this.passportDetailsForm.get('passportNumber') as FormControl;
  }

  get dateOfIssue(): FormControl {
    return this.passportDetailsForm.get('dateOfIssue') as FormControl;
  }

  get expiryDate(): FormControl {
    return this.passportDetailsForm.get('expiryDate') as FormControl;
  }
  get nextOfKinFullName(): FormControl {
    return this.nextOfKinDetailsForm.get('fullName') as FormControl;
  }

  get nextOfKinAddress(): FormControl {
    return this.nextOfKinDetailsForm.get('address') as FormControl;
  }

  get nextOfKinPhone(): FormControl {
    return this.nextOfKinDetailsForm.get('phone') as FormControl;
  }

  get nextOfKinRelationship(): FormControl {
    return this.nextOfKinDetailsForm.get('relationship') as FormControl;
  }

  get attachDocumentsForm() {
    return this.editPilgrimForm.get('attachedDocuments') as FormGroup;
  }



  fileChanged(file, type) {
    const fileTypes = ['jpeg', 'jpg', 'png', '.pdf'];
    if (!fileTypes.includes(file.name.split('.').pop())) {
      this.notifications.errorToast('Please attach an image or pdf file');
      return;
    }
    const fr = new FileReader();
    fr.readAsDataURL(file);

    fr.onload = () => {
      const dataUrl = fr.result.toString();
      const id = uuid();
      const fileName = id + '.' + file.name.split('.').pop();
      this.attachDocumentsForm.get(type).patchValue(fileName);
      this.uploadedDocuments[type] = {
        file,
        dataUrl: this.sanitizer.bypassSecurityTrustUrl(dataUrl),
        fileName
      };
      this.notifications.successToast('File attached!');
    }
  }

  otherFilesChanged(index, file) {
    const fileTypes = ['jpeg', 'jpg', 'png', '.pdf'];
    if (!fileTypes.includes(file.name.split('.').pop())) {
      this.notifications.errorToast('Please attach an image or pdf file');
      return;
    }

    const fr = new FileReader();
    fr.readAsDataURL(file);
    fr.onload = () => {
        const dataUrl = fr.result.toString();
        const id = uuid();
        const fileName = id + '.' + file.name.split('.').pop();
        const otherDocs = this.attachDocumentsForm.get('otherDocuments') as FormArray;
        const form = otherDocs.controls[index];
        form.patchValue({ docUrl: fileName })
        
        this.uploadedDocuments[form.get('documentName').value] = {
          file,
          dataUrl: this.sanitizer.bypassSecurityTrustUrl(dataUrl),
          fileName
        };

        this.notifications.successToast('File attached!');
    }
  }

  submit() {
    const fd = new FormData();

    for (let f in this.uploadedDocuments) {
        fd.append('files', this.uploadedDocuments[f].file, this.uploadedDocuments[f].fileName)
    }
    const body = this.editPilgrimForm.value;

    this.notifications.prompt('Are you sure you want to submit?').then(res => {
      if (res.isConfirmed) {
        this.loader.showLoader();
        const token = sessionStorage.getItem('token');
        const imageUri = `${environment.pilgrims}/image`;
        const uri = environment.pilgrims;

        if (Object.keys(this.uploadedDocuments).length > 0) {
          this.subscription = this.dataService.post(imageUri, fd, token).subscribe(fileRes => {
            this.notifications.successToast(`${fileRes.message} Sending user data...`);

            this.subscription = this.dataService.update(uri, this.data._id, body, token).subscribe(response => {
              this.notifications.alert(`Pilgrim updated successfully.`).then(result => {
                this.loader.hideLoader();
                this.dialogRef.close(true);
              });
            })
          })
        } else {
          this.subscription = this.dataService.update(uri, this.data._id, body, token).subscribe(response => {
            this.notifications.alert(`Pilgrim updated successfully.`).then(result => {
              this.loader.hideLoader();
              this.dialogRef.close(true);
            });
          })
        }
      }
    });
  }

  get formsValid() {
    return this.passportDetailsForm.valid;
  }

  getStates() {
    this.loader.showLoader();
    const uri = environment.states;

    this.subscription = this.dataService.get(uri, this.token, '').subscribe(response => {
      this.states = response.filter(s => s.name !== 'default');
      this.loader.hideLoader();
      this.getLocalGovs(this.stateOfOrigin.value);
    });
  }

  getLocalGovs(stateId) {
    this.lgLoader = true;
    const uri = `${environment.lgas}/by-state`;
    this.subscription = this.dataService.get(uri, this.token, stateId).subscribe(response => {
      this.lgas = [...response];
      sessionStorage.setItem('formLg', JSON.stringify(this.lgas));
      this.lgLoader = false;
      this.showLga = true;
    });
  }

  get isReviewer() {
    return this.data.isReviewer;
  }
}
