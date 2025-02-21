import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { GoRestAPIService } from '../../services/go-rest-api.service';
import { Post } from '../../models/post.model';
import { PostComment } from '../../models/postComment.model';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { FormAddUserDetailsComponent } from '../form-add-user-details/form-add-user-details.component';

@Component({
  selector: 'app-post',
  imports: [
    CommonModule,
    FormsModule,
    FormAddUserDetailsComponent
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
  standalone: true
})
export class PostComponent {

  @Input() post: Post = {  // Passes the post data from the parent component
    id: 0, 
    user_id: 0,
    title: '',
    body: '',
    comments: []
  };
  userName: string = '';  // Stores user name of who wrote the post
  showUserDetailsModal: boolean = false;  // Flag to control the 'User Details' modal
  modalDescription: string = `Sembra che tu non sia registrato a GoRest. 
                              È necessario registrarsi per poter 
                              commentare il post.`  // Description of the 'User Details' modal

  constructor(private apiService: GoRestAPIService,
              private storageService: LocalStorageService
  ) {}

  // Retrieves the username by user ID from the API
  getUserNameByUserId(userId: number): void {
    this.apiService.getUserById(userId).subscribe(
      (user) => {
        this.userName = user.name; 
      },
      (error) => {
        console.error('Error getting user name.', error);
        this.userName = 'Utente sconosciuto';
      });
  }

  // Add a comment.
  // Checks if the user is registrered before allowing them to submit the comment.
  // If not registered,let them to add their details and make the registration
  addComment(ID: number, commentInput: HTMLInputElement): void {
    let token = this.storageService.getAuthorizedToken();
    let userDetails = this.storageService.getFromLocalStorage(token);
    if (!userDetails.id) {
      this.showUserDetailsModal = true;
    } else {
      this.submitComment(ID, commentInput, userDetails);
    }
  }
  
  // Submits a new comment to the API.
  submitComment(ID: number, commentInput: HTMLInputElement, userDetails: User): void {

    let commentText = commentInput.value.trim();

    if (commentText) { 
      let newComment = { 
        id: 0,
        post_id: ID,
        name: userDetails.name,
        email: userDetails.email,
        body: commentText
      };
      this.apiService.addComment(newComment).subscribe(
        (response: PostComment) => {
          if (!this.post.comments) {
            this.post.comments = [];
          }
          this.post.comments.push(response);
          commentInput.value = '';
        },
        (error) => {
          console.error('Error adding comment to GoRest', error);
        }
      )
    }
  }

  // Saves new user details and registers them via the API
  saveUserDetails(userData: { name: string, email: string, gender: string }): void {
    
    if (userData.name.trim() && userData.email.trim()) {
      
      let token = this.storageService.getAuthorizedToken();
      let userDetails = {
        id: 0,
        name: userData.name,
        email: userData.email,
        gender: userData.gender,
        status: 'active'
      };
      this.apiService.addUser(userDetails).subscribe(
        (response: User) => {
          userDetails.id = response.id;
          let userDetailsPlusToken = { ...userDetails, token: token};
          this.storageService.saveToLocalStorage(token, userDetailsPlusToken);
        },
        (error) => {
         console.error('Error adding data to GoRest', error);
        }
      );
      this.closeUserDetailsModal();
    }
  }

  // Opens the user registration modal
  openUserDetailsModal(): void {
    this.showUserDetailsModal = true;
  }

  // Closes the user registration modal
  closeUserDetailsModal(): void {
    this.showUserDetailsModal = false;
  }

  ngOnInit(): void {
    if (this.post && this.post.user_id != 0) {
      this.getUserNameByUserId(this.post.user_id);
    }
  }

}
