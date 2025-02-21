import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { FormAddUserDetailsComponent } from '../../components/form-add-user-details/form-add-user-details.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { GoRestAPIService } from '../../services/go-rest-api.service';

@Component({
  selector: 'app-users',
  imports: [ 
    RouterLink,
    CommonModule,
    FormsModule,
    PaginatorComponent,
    SearchBarComponent,
    FormAddUserDetailsComponent
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css',
  standalone: true
})
export class UsersListComponent implements OnInit {

  users: User[] = [];  // Users data
  searchTerm: string = '';  // Search bar input
  placeholderText: string = 'Cerca un utente per nome o email ...';  // Searchbar placeholder
  isModalOpen: boolean = false;  // Toggle modal to add new user
  modalDescription: string = `Per aggiungere un nuovo utente è necessario avere un token di accesso.<br>
                              Ottienilo su
                              <a href="https://gorest.co.in/my-account/access-tokens" target="_blank"
                              >GoRest!</a>`  // Description of the modal
  currentPage: number = 1;  // Current page number for pagination
  pageSize: number = 10;  // Current number of items per page

  constructor(private apiService: GoRestAPIService,
              private storageService: LocalStorageService
  ) {}

  // Get users from the API
  getUsers(): void {
    this.apiService.getUsers(this.currentPage, this.pageSize).subscribe(
      (response: User[]) => {
        this.users = response;
      },
      (error) => {
        console.error('Error getting data from GoRest', error)
      }
    )
  }

  // Triggered on search input change
  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.searchUsers();
  }

  // Trigger search when "Enter" is pressed
  searchUsersOnKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {  
      event.preventDefault();  
      this.searchUsers();
    }
  }
  
  // Filter users based on the search term
  searchUsers(): void {
    if (typeof this.searchTerm === 'string') {
      if (this.searchTerm === '' || this.searchTerm.trim() === '') {
        this.getUsers()
      } else {
        this.users = this.users.filter(user =>
          user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }
    }
  }

   // Delete a user by ID
  deleteUser(userID: number): User[] {
    this.users = this.users.filter((user) => user.id !== userID);
    this.apiService.deleteUser(userID).subscribe(
      (response) => {
        console.log('User deleted successfully', response);
      },
      (error) => {
        console.error('Error getting data from GoRest', error)
      }
    )
    return this.users
  }

  // Handle pagination changes
  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.getUsers();
  }

  updateCurrentPage(newPage: number): void {
    this.currentPage = newPage;
    this.getUsers();
  }

  updatePageSize(newSize: number): void {
    this.pageSize = newSize;
    this.getUsers();  
  }

  // Open the modal to add a new user
  openModal(): void {
    this.isModalOpen = true;
  }

  // Close modal
  closeModal(): void {
    this.isModalOpen = false;
  }

  // Add new user
  addUser(userData: {name: string, email: string, gender: string, token: string}): void {
    
    let newUser: User = { 
      id: 0, 
      name: userData.name, 
      email: userData.email,
      gender: userData.gender,
      status: 'active' 
    };
    this.apiService.addUser(newUser).subscribe(
      (response: User) => {
        console.log(response);
        this.storageService.saveToLocalStorage(userData.token, response);
        this.closeModal();
        this.getUsers();
      },
      (error) => {
       console.error('Error adding data to GoRest', error);
      }
    );
  }

  ngOnInit(): void {
    this.getUsers();
  }

}
