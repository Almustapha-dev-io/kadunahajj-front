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

@Component({
  selector: 'app-edit-pilgrim',
  templateUrl: './edit-pilgrim.component.html',
  styleUrls: ['./edit-pilgrim.component.scss']
})
export class EditPilgrimComponent implements OnInit {
  passportDetails;
  paymentHistory = [];
  attachedDocuments;

  banks = [];
  subscription = new Subscription();

  editPilgrimForm: FormGroup;
  passportTypes = ['normal', 'official', 'diplomatic'];

  uploadedDocuments = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService,
    public loader: ModalLoaderService,
		private fb: FormBuilder,
    private notifications: NotificationService,
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<EditPilgrimComponent>
  ) { }

  ngOnInit(): void {
		this.getBanks();
		
		this.passportDetails = { ...this.data.passportDetails };
    this.attachedDocuments = { ...this.data.attachedDocuments };
		this.paymentHistory = [...this.data.paymentHistory];
		
		this.initializeForm();
		console.log(this.editPilgrimForm);
  }

	getBanks() {
    this.paymentHistory = [...this.data.paymentHistory];

    this.loader.showLoader();
    const uri = environment.banks;
    const token = sessionStorage.getItem('token');

    this.subscription = this.dataService.get(uri, token, '').subscribe(response => {
      this.banks = [...response];
      this.loader.hideLoader();
    });
  }

	imageFile(name) {
    window.scroll(0,0);
    return `${environment.pilgrims}/image/${name}`;
  }

	initializeForm(): void {
		this.editPilgrimForm = this.fb.group({
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
			paymentHistory: this.fb.array([]),
			attachedDocuments: this.fb.group({
				guarantorFormUrl: [this.attachedDocuments.guarantorFormUrl, Validators.required],
				passportUrl: [this.attachedDocuments.passportUrl, Validators.required],
				mouUrl: [this.attachedDocuments.mouUrl, Validators.required]
			})
		});

		const paymentHistory = this.editPilgrimForm.get('paymentHistory') as FormArray;
		this.paymentHistory.forEach(payment => paymentHistory.push(this.getPaymentHistoryForm(payment)));
	}

	getPaymentHistoryForm(data?) {
		return this.fb.group({
			bank: [data && data.bank ? data.bank : '', Validators.required],
			tellerNumber: [data && data.tellerNumber ? data.tellerNumber : '', Validators.required],
			receiptNumber: [data && data.receiptNumber ? data.receiptNumber : '', Validators.required],
			paymentDate: [data && data.paymentDate ? moment(data.paymentDate).format('YYYY-MM-DD') : '', [Validators.required, YearValidators.greaterThanToday]],
			amount: [data && data.amount ? data.amount : '', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
		});
	}

  addPaymentForm() {
    const paymentHistory = this.editPilgrimForm.get('paymentHistory') as FormArray;
    paymentHistory.push(this.getPaymentHistoryForm());
  }

  removePaymentForm(index) {
    const paymentHistory = this.editPilgrimForm.get('paymentHistory') as FormArray;
    paymentHistory.removeAt(index);
  }

	get passportDetailsForm() {
		return this.editPilgrimForm.get('passportDetails') as FormGroup;
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

  get paymentHistoryForms() {
    return (this.editPilgrimForm.get('paymentHistory') as FormArray).controls as FormGroup[];
  }

  get attachDocumentsForm() {
    return this.editPilgrimForm.get('attachedDocuments') as FormGroup;
  }

  fileChanged(file, type) {
    const fileTypes = ['jpeg', 'jpg', 'png'];
    if (!fileTypes.includes(file.name.split('.').pop())) {
      this.notifications.errorToast('Please attach an image file');
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
        dataUrl: this.sanitizer.bypassSecurityTrustUrl(dataUrl)
      };
      this.notifications.successToast('File attached!');

      console.log(this.attachDocumentsForm);
      console.log(this.uploadedDocuments);
    }
  }

  submit() {
    const fd = new FormData();
    const files = this.attachDocumentsForm.value;
    
    for (let file in files) {
      if (file in this.uploadedDocuments) {
        fd.append('files', this.uploadedDocuments[file].file, files[file]);
      }
    }

    fd.forEach((c, e) => console.log(c, e));

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
              this.notifications.alert(`Pilgrim updated successfully. <br />Code: <b>${response.enrollmentDetails.code}</b>`).then(result => {
                this.loader.hideLoader();
                this.dialogRef.close(true);
              });
            })
          })
        } else {
          this.subscription = this.dataService.update(uri, this.data._id, body, token).subscribe(response => {
            this.notifications.alert(`Pilgrim updated successfully. <br />Code: <b>${response.enrollmentDetails.code}</b>`).then(result => {
              this.loader.hideLoader();
              this.dialogRef.close(true);
            });
          })
        }
      }
    })
    console.log(body)
  }

  get formsValid() {
    return this.passportDetailsForm.valid && this.paymentHistoryForms.every(f => f.valid);
  }
}
