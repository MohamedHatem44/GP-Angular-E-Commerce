import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../../../services/message.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
/*--------------------------------------------------------------------*/
export class ContactComponent {
  isLoading: boolean = false;
  apiError: string = '';
  /*--------------------------------------------------------------------*/
  constructor(private _MessageService: MessageService, private _AuthService: AuthService, private _Router: Router, private _ToastrService: ToastrService) {}
  /*--------------------------------------------------------------------*/
  messageForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    messageDetails: new FormControl(null, [Validators.required, Validators.minLength(50), Validators.maxLength(1000)]),
  });
  /*--------------------------------------------------------------------*/
  sendMessage(messageForm: FormGroup) {
    this.isLoading = true;
    const isAuthenticated = this._AuthService.isAuthenticated();
    if (!isAuthenticated) {
      this._ToastrService.error('To Have Access, Please login');
      this.isLoading = false;
      this._Router.navigate(['users/login']);
      return;
    }
    this.apiError = '';
    if (this.messageForm.valid) {
      this._MessageService.createMessage(messageForm.value).subscribe({
        next: (response) => {
          if (response) {
            this._ToastrService.success('Message Submited successfully');
            this.isLoading = false;
            this.messageForm.reset();
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.apiError = 'An error occurred while sending the message. Please try again later';
          this._ToastrService.error('An error occurred while sending the message. Please try again later');
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    } else {
      this.apiError = 'Please fill all the required fields correctly';
      this.isLoading = false;
    }
  }
  /*--------------------------------------------------------------------*/
}
