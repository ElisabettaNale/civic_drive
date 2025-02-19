import { Component, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-add-user-details',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './form-add-user-details.component.html',
  styleUrl: './form-add-user-details.component.css'
})
export class FormAddUserDetailsComponent {

  @Input() modalTitle: string = '';  // Title of the 'User details' modal
  @Input() modalDescription: string = '';  // Description of the 'User details' modal
  @Input() showTokenField: boolean = false;  // Show/Hide token field 
  tempUserName: string = '';  // Temporary variable to store user name
  tempUserEmail: string = '';  // Temporary variable to store user email
  tempUserGender: string = '';  // Temporary variable to store user gender
  tempUserToken: string = '';  // Temporary variable to store user token
  @Output() userDetails: EventEmitter<{name: string, email: string, gender: string, token: string}> = new EventEmitter();  // Event emitters for user details submission
  @Output() cancel: EventEmitter<void> = new EventEmitter<void>();  //  Event emitters for modal closing

  // Submit the form and emit the user details
  onSubmit(): void {
    this.userDetails.emit({
      name: this.tempUserName,
      email: this.tempUserEmail,
      gender: this.tempUserGender,
      token: this.tempUserToken
    });
  }

  // Close the modal without saving
  closeModal(): void {
    this.cancel.emit();
  }

}
