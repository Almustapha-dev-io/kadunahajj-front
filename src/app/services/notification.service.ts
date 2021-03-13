import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() {}

  get Toast() {
    return Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });
  }

  successToast(message?) {
    this.Toast.fire({
      icon: 'success',
      title: ' ',
      text: message? message : 'Success'
    });
  }

  errorToast(message?) {
    this.Toast.fire({
      icon: 'error',
      title: ' ',
      text: message? message : 'Error'
    });
  }

  prompt(message) {
    return Swal.fire({
      icon: 'question',
      text: message,
      showCancelButton: true
    })
  }

  alert(message) {
    return Swal.fire({
      icon: 'info',
      text: message,
      allowOutsideClick: false
    });
  }
}
