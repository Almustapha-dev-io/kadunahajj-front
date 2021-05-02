import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { v4 as uuid } from 'uuid';

import { FormsService } from '../../../../services/forms.service';
import { StepModel } from '../../../../common/models/step.model'
import { FileModel } from '../../../../common/models/file.model';
import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'app-document-upload',
  templateUrl: './document-upload.component.html',
  styleUrls: ['./document-upload.component.scss']
})
export class DocumentUploadComponent implements OnInit {
  @ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;

  @Input('step') step: StepModel;

  acceptedFileType = ['.jpg', '.jpeg', '.jpe','.png'];

  attachedDocumentsForm: FormGroup;
  selectedDocumentType = '';
  documentDisplay = '';

  files: FileModel[] = [];

  constructor(private formsService: FormsService, private notifications: NotificationService) { }

  ngOnInit(): void {
    this.attachedDocumentsForm = this.formsService.attachedDocuments;
    this.files = this.formsService.files;
  }

  valueChange() {
    this.formsService.attachedDocuments$.next(this.attachedDocumentsForm);
    this.attachedDocumentsForm = this.formsService.attachedDocuments;

    this.formsService.files$.next(this.files);
    this.files = this.formsService.files;

    this.step.isComplete = (this.attachedDocumentsForm.valid) && (this.files.length === 3);
  }

  docChange($event) {
    this.selectedDocumentType = $event;
  }

  // FormGetters
  get mouUrl() {
    return this.attachedDocumentsForm.get('mouUrl');
  }

  get passportUrl() {
    return this.attachedDocumentsForm.get('passportUrl');
  }

  get guarantorFormUrl() {
    return this.attachedDocumentsForm.get('guarantorFormUrl');
  }


  fileDropped($event) {
    //  Check if user Selected a document
    if (this.selectedDocumentType === '') return this.notifications.errorToast('Select a document type.');

    if (!$event || !$event[0]) return this.notifications.errorToast('Please select a file.');

    //  Show error messsage if user selects
    //  more than one file for upload
    if ($event.length > 1) return this.notifications.errorToast('Please select a single file.');

    //  Validate that user uploaded a valid file type
    //  Jpg/Png Image or PDF document, show error message
    //  if file type is invalid
    const fileValid = this.acceptedFileType.includes(this.getFileType($event[0]));
    if (!fileValid) return this.notifications.errorToast('Please upload an image file.');

    //  Validate that user uploaded a file that is
    //  <= 500kb, show error message if not
    const maxFileSize = 10000000;
    const fileSize = $event[0].size;
    if (fileSize > maxFileSize) return this.notifications.errorToast('File too large. (Max size is 5MB)');

    //  In the case that user uploads a document that has been
    //  uploaded, remove the existing file from list of files
    //  and upload currently selected file
    const index = this.findDocumentIndex(this.selectedDocumentType);
    if (index >= 0) this.removeDocument(this.selectedDocumentType);

    //  Prepare list of selected files
    this.prepareFilesList($event);
  }

  prepareFilesList(files: Array<File>) {
    const file = files[0];
    const nameArray =  file.name.split('.');
    const fileName = uuid() + '_.' + nameArray[nameArray.length - 1];
    const fileObject ={ documentType: this.selectedDocumentType, file, fileName, progress: 0 };

    this.files.push(fileObject);

    this.setDocumentValue(this.selectedDocumentType, fileName);

    this.valueChange();

    this.fileDropEl.nativeElement.value = "";
    this.uploadFilesSimulator(this.findDocumentIndex(fileObject.documentType));
  }

  setDocumentValue(documentType, fileName) {
    if (documentType === 'ePass') {
      this.attachedDocumentsForm.patchValue({
        passportUrl: fileName
      });
    }

    if (documentType === 'mou') {
      this.attachedDocumentsForm.patchValue({
        mouUrl: fileName
      });
    }

    if (documentType === 'guarantor') {
      this.attachedDocumentsForm.patchValue({
        guarantorFormUrl: fileName
      });
    }
  }

  getFileType(file): string {
    const fileExtension = '.' + file.name.split('.').pop();
    return fileExtension.toLowerCase();
  }

  findDocumentIndex(documentType): number {
    return this.files.findIndex(c => c.documentType === documentType);
  }

  removeDocument(documentType) {
    const index = this.findDocumentIndex(documentType);
    if (index >= 0) this.files.splice(index, 1);

    this.valueChange();
  }

  removeUploadedDocument(documentType) {
    this.removeDocument(documentType);

    if (documentType === 'ePass') {
      this.attachedDocumentsForm.patchValue({
        passportUrl: null
      });
    }

    if (documentType === 'mou') {
      this.attachedDocumentsForm.patchValue({
        mouUrl: null
      });
    }

    if (documentType === 'guarantor') {
      this.attachedDocumentsForm.patchValue({
        guarantorFormUrl: null
      });
    }

    this.notifications.successToast('Document removed successfully.');
    this.valueChange();
  }

  getFile(type) {
    console.log(type);
    if (type === 'epass') this.documentDisplay = 'E-Passport';
    if (type === 'mou') this.documentDisplay = 'MOU Form';
    if (type === 'guarantor') this.documentDisplay = 'Guarantor Form';
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.files.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.files[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.files[index].progress += 5;
          }
        }, 200);

      }
    }, 1000);
  }
}
