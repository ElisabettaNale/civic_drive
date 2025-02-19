import { Component, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-paginator',
  imports: [
    CommonModule
  ],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.css',
  standalone: true
})
export class PaginatorComponent {

  currentPage: number = 1;  // Current page number
  pageSize: number = 10;  // Default number of users per page
  pageSizeOptions: number[] = [10, 25, 50];  // Available page size options
  @Output() currentPageChange = new EventEmitter<number>();  // Emit an event when the current page changes
  @Output() pageSizeChange = new EventEmitter<number>();  // Emit an event when the page size changes

  // Move to the next page and emit the updated page number
  goToNextPage(): void {
    this.currentPage += 1;
    this.currentPageChange.emit(this.currentPage);
  }

  // Move to the previous page if not already on the first page
  // and emit the updated page number 
  goToPreviousPage(): void {
    if (this.currentPage !== 1)  {
      this.currentPage -= 1;
      this.currentPageChange.emit(this.currentPage);
    }
  }

  // Set the page size and emit the updated value
  setPageSize(size: number): void {
    this.pageSize = size;
    this.pageSizeChange.emit(this.pageSize);
  }

}
