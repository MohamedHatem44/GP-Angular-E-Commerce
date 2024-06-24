import { Component, Input } from '@angular/core';
import { Blog } from '../../../models/blog';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-blog-details-modal',
  templateUrl: './admin-blog-details-modal.component.html',
  styleUrl: './admin-blog-details-modal.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminBlogDetailsModalComponent {
  @Input() blog: Blog;
  /*------------------------------------------------------------------*/
  // Ctor
  constructor(public _ActiveModal: NgbActiveModal) {}
  /*------------------------------------------------------------------*/
  close() {
    this._ActiveModal.close();
  }
  /*------------------------------------------------------------------*/
}
