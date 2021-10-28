import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '@environment';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';
import { LoaderService } from 'src/app/services/loader.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-pilgrim-delete',
  templateUrl: './pilgrim-delete.component.html',
  styleUrls: ['./pilgrim-delete.component.scss']
})
export class PilgrimDeleteComponent implements OnInit {

	pilgrimDeleteForm: FormGroup;
	deletionReasons = ['withdrawn', 'replacement'];
	withdrawnRefunds = ['refunded', 'not refunded'];
	replacementRefunds = ['refunded', 'swapped', 'others'];
	refunds = [];
	
  subscription = new Subscription();
  token = sessionStorage.getItem('token');


  constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef: MatDialogRef<PilgrimDeleteComponent>,
		private fb: FormBuilder,
		public loader: LoaderService,
		private dataService: DataService,
    private notifications: NotificationService
	) { }

  ngOnInit(): void {
		this.initializeForm();
		this.pilgrimDeleteForm.valueChanges.subscribe(console.log);
  }

	initializeForm() {
		this.pilgrimDeleteForm = this.fb.group({
			deletionReason: ['', Validators.required],
			refundDetails: ['', Validators.required],
			amountRefunded: ['', [Validators.required, Validators.min(0)]],
			otherRefunds: ''
		});
	}

	deletePilgrim() {
		const pilgrim = this.data;
    this.notifications.prompt(`Are you sure you <br /> want to delete <br />${pilgrim.enrollmentDetails.code} ?`).then(result => {
      if (result.isConfirmed) {
        this.loader.showLoader();
        const params = {
					deletionReason: this.deletionReason.value,
					amountRefunded: this.amountRefunded.value,
					fundRefunded: this.refundDetails.value === 'others' ? this.otherRefunds.value : this.refundDetails.value
				};

        const uri = environment.pilgrims;
        this.subscription = this.dataService.delete(uri, pilgrim._id, this.token, params).subscribe((response: any) => {
          this.notifications.successToast(`Pilgrim was deleted successfully.`);
					this.dialogRef.close(true);
        });
      }
    });
  }

	setRefunds() {
		if (this.deletionReason.value === 'withdrawn') {
			this.refunds = [...this.withdrawnRefunds];
		} else if (this.deletionReason.value === 'replacement') {
			this.refunds = [...this.replacementRefunds];
		} else {
			this.refunds = [];
		}
	}

	setOtherRefunds() {
		const refundDetails = this.refundDetails.value;
		console.log(refundDetails);

		if (refundDetails === 'others') {
			this.otherRefunds.setValidators([Validators.required]);
		} else {
			this.otherRefunds.reset('');
			this.otherRefunds.clearValidators();
		}

		this.otherRefunds.updateValueAndValidity();
	}

	get deletionReason() {
		return this.pilgrimDeleteForm.get('deletionReason') as FormControl;
	}

	get refundDetails() {
		return this.pilgrimDeleteForm.get('refundDetails') as FormControl;
	}

	get amountRefunded() {
		return this.pilgrimDeleteForm.get('amountRefunded') as FormControl;
	}

	get otherRefunds() {
		return this.pilgrimDeleteForm.get('otherRefunds') as FormControl;
	}

}
