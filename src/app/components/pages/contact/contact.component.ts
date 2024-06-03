import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from '../../../services/message.service';
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
  constructor(private _MessageService: MessageService) {}
  /*--------------------------------------------------------------------*/
  messageForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    messageDetails: new FormControl(null, [Validators.required, Validators.minLength(50), Validators.maxLength(1000)]),
  });
  /*--------------------------------------------------------------------*/
  sendMessage(messageForm: FormGroup) {
    this.isLoading = true;
    this.apiError = '';

    if (this.messageForm.valid) {
      this._MessageService.createMessage(messageForm.value).subscribe({
        next: (response) => {
          if (response) {
            this.isLoading = false;
            this.messageForm.reset();
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.apiError = 'An error occurred while sending the message. Please try again later';
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
