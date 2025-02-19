import { Component } from '@angular/core';
import { Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [
    FormsModule
  ],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  @Input() placeholderText: string = 'Cerca ...'  // Placeholder text for the search input
  searchTerm: string = '';  // Search term of the search bar
  @Output() search: EventEmitter<string> = new EventEmitter<string>(); //  Emits the search term when the user submits the search
  
  // Emits the search event with the current search term
  onSearch(): void {
    this.search.emit(this.searchTerm);
  }

  // Trigger search when "Enter" is pressed
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {  
      event.preventDefault();  
      this.onSearch();
    }
  }

}
