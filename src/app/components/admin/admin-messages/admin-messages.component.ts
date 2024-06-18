import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../services/message.service';
import { Message } from '../../../models/message';
import { DeleteConfirmationModalComponent } from '../../modals/delete-confirmation-modal/delete-confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AdminMessageDetailsModelComponent } from '../admin-message-details-model/admin-message-details-model.component';
/*--------------------------------------------------------------------*/
@Component({
  selector: 'app-admin-messages',
  templateUrl: './admin-messages.component.html',
  styleUrl: './admin-messages.component.css',
})
/*--------------------------------------------------------------------*/
export class AdminMessagesComponent implements OnInit {
  messageLoading: boolean = false;
  messageIdToDelete: number;
  messages: (Message & { deleting?: boolean })[] = [];
  currentPage: number = 1;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  maxPagesToShow: number = 3;
  startEntry: number;
  endEntry: number;
  apiError: string | null = null;
  noMessages: boolean = false;
  /*-----------------------------------------------------------------*/
  // Ctor
  constructor(private _MessageService: MessageService, private modalService: NgbModal, private _ToastrService: ToastrService) {}
  /*-----------------------------------------------------------------*/
  ngOnInit(): void {
    this.messageLoading = true;
    this.fetchMessages(this.currentPage);
  }
  /*-----------------------------------------------------------------*/
  // Fetch Messages
  fetchMessages(page: number): void {
    this.messageLoading = true;
    this.apiError = null;
    this._MessageService.getAllMessagesWithPagination(page).subscribe({
      next: (response: any) => {
        this.messages = response.items.map((msg: Message) => ({ ...msg, deleting: false }));
        this.currentPage = response.currentPage;
        this.totalPages = response.totalPages;
        this.pageSize = response.pageSize;
        this.totalCount = response.totalCount;
        this.updateEntryRange();
        this.messageLoading = false;
        this.noMessages = this.messages.length === 0;
      },
      error: (err) => {
        this.apiError = 'Failed to load Messages, Please try again.';
        this._ToastrService.error('Failed to load Messages, Please try again.');
        this.messageLoading = false;
      },
    });
  }
  /*-----------------------------------------------------------------*/
  changePage(page: number): void {
    this.messageLoading = true;
    if (page >= 1 && page <= this.totalPages) {
      this.fetchMessages(page);
    }
  }
  /*-----------------------------------------------------------------*/
  updateEntryRange(): void {
    this.startEntry = (this.currentPage - 1) * this.pageSize + 1;
    this.endEntry = Math.min(this.startEntry + this.pageSize - 1, this.totalCount);
  }
  /*-----------------------------------------------------------------*/
  get pages(): number[] {
    const half = Math.floor(this.maxPagesToShow / 2);
    let start = Math.max(this.currentPage - half, 1);
    let end = start + this.maxPagesToShow - 1;

    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(end - this.maxPagesToShow + 1, 1);
    }
    /*-----------------------------------------------------------------*/
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
  /*-----------------------------------------------------------------*/
  openDeleteConfirmationModal(messageId: number): void {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent);
    this.messageIdToDelete = messageId;
    modalRef.componentInstance.message = `Are you sure you want to delete this message?`;
    modalRef.componentInstance.confirmDelete.subscribe(() => {
      this.deleteMessage(messageId);
    });
  }
  /*-----------------------------------------------------------------*/
  openMessageDetailsModal(message: Message): void {
    const modalRef = this.modalService.open(AdminMessageDetailsModelComponent, { size: 'lg' });
    modalRef.componentInstance.message = message;
  }
  /*-----------------------------------------------------------------*/
  deleteMessage(messageId: number): void {
    const message = this.messages.find((msg) => msg.id === messageId);
    if (message) {
      message.deleting = true;
      this._MessageService.deleteMessage(messageId).subscribe({
        next: () => {
          this.messages = this.messages.filter((msg) => msg.id !== messageId);
          this.totalCount--;

          if (this.messages.length === 0 && this.currentPage > 1) {
            this.currentPage--;
          }
          this.updateEntryRange();
          this.fetchMessages(this.currentPage);
          this._ToastrService.success('Message deleted successfully');
        },
        error: (err) => {
          console.log(err);
          this._ToastrService.error('Failed to delete message. Please try again');
          message.deleting = false;
        },
      });
    }
  }
  /*-----------------------------------------------------------------*/
}
