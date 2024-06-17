import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-img-modal',
  templateUrl: './img-modal.component.html',
  styleUrl: './img-modal.component.css',
})
/*--------------------------------------------------------------------*/
export class ImgModalComponent {
  @Input() model: any;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(public activeModal: NgbActiveModal) {}
  /*------------------------------------------------------------------*/
  close() {
    this.activeModal.close();
  }
  /*------------------------------------------------------------------*/
}
