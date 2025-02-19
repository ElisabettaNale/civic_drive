import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';
import { PostComment } from '../../models/postComment.model';
import { PostComponent } from '../../components/post/post.component';
import { GoRestAPIService } from '../../services/go-rest-api.service';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../services/local-storage.service';
import { FormAddUserDetailsComponent } from "../../components/form-add-user-details/form-add-user-details.component";

@Component({
  selector: 'app-users-posts',
  imports: [
    CommonModule,
    PostComponent,
    PaginatorComponent,
    FormsModule,
    SearchBarComponent,
    FormAddUserDetailsComponent
],
  standalone: true,
  templateUrl: './users-posts.component.html',
  styleUrl: './users-posts.component.css'
})
export class UsersPostsComponent implements OnInit{

  users: User[] = [];  // Stores users
  posts: Post[] = [];  // Stores posts
  searchTerm: string = '';  // Search term for filtering posts
  placeholderText: string = 'Cerca un post per titolo o contenuto ...';  // Search bar default text
  currentPage: number = 1;  // Current page for pagination
  pageSize: number = 10;  // Current number of users per page for pagination
  isModalUserDetailsOpen: boolean = false;  // Flag to control 'Add user Details' modal
  modalDescription: string = `Sembra che tu non sia registrato a GoRest. 
                              È necessario registrarsi per poter pubblicare 
                              un post.`;  // Description of the 'Add user Details' modal
  isModalPublishPostOpen: boolean = false;  // Flag to control 'Publish a post' modal
  

  constructor(private apiService: GoRestAPIService,
              private storageService: LocalStorageService
  ) {}

  // Load posts
  loadPosts(): void {
    this.apiService.getUsers(this.currentPage, this.pageSize).subscribe(
      (users: User[]) => {
        this.users = users;
        this.posts = [];
        this.users.forEach(user => {
          this.apiService.getUserPosts(user.id).subscribe(
            (userPosts: Post[]) => {
              userPosts.forEach(post => {
                this.apiService.getPostComments(post.id).subscribe(
                  (comments: PostComment[]) => {
                    post.comments = comments;
                  },
                  (error) => console.error(`Errore nel recuperare i commenti del post ${post.id}`, error)
                );
              });
              this.posts.push(...userPosts);
            },
            (error) => console.error(`Errore nel recuperare i post dell'utente ${user.id}`, error)
          );
        });
      },
      (error) => console.error('Errore nel recuperare gli utenti', error)
    );
  }

  // Get users for the current page with pagination
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

  // Get posts for a specific user by user ID
  getUserPosts(ID: number): void {
    this.apiService.getUserPosts(ID).subscribe(
      (response: Post[]) => {
        this.posts.push(...response);
        this.posts.forEach((post, index) => {
          this.getPostComments(post.id).subscribe(
            (comments: PostComment[]) => {
              if (this.posts[index]) {
                this.posts[index].comments = comments;
              }
            },
            (error) => {
              console.error('Error getting post comments from GoRest', error);
            }
          );
        });
      },
      (error) => {
        console.error('Error getting user posts from GoRest', error);
      }
    );
  }

  // Get comments for a specific post by post ID
  getPostComments(ID: number): Observable<PostComment[]> {
    return this.apiService.getPostComments(ID);
  }

  // Handle the search term input and trigger post search
  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm;
    this.searchPosts();
  }

  // Handle "Enter" key press to trigger post search
  searchPostsOnKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {  
      event.preventDefault();  
      this.searchPosts();
    }
  }
  
  // Filter posts based on the search term (title or content)
  searchPosts(): void {
    if (typeof this.searchTerm === 'string') {
      if (this.searchTerm.trim() === '') {
        this.loadPosts();   
      } else {
        this.posts = this.posts.filter(post =>
          post.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          post.body.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }
    }
  }

  // Update current page and reload page
  updateCurrentPage(newPage: number): void {
    this.currentPage = newPage;
    this.posts = [];
    this.loadPosts();
  }

  // Update number of items per page and reload page
  updatePageSize(newSize: number): void {
    this.pageSize = newSize;
    this.posts = [];
    this.loadPosts();
  }

  // Handle post submission (check if the user is authorized)
  addPost(): void {

    let token = this.storageService.getAuthorizedToken();
    let authorizedUser = this.storageService.getFromLocalStorage(token);

    if (!authorizedUser.id) {
      this.openModalUserDetails();
    } else {
      this.openModalPublishPost();
    }

  }

  // Open modal for user details if not registered
  openModalUserDetails(): void {
    this.isModalUserDetailsOpen = true;
  }

  // Close modal for user details if not registered
  closeModalUserDetails(): void {
    this.isModalUserDetailsOpen = false;
  }

  // Handle user details form submission
  addUserDetails(userData: { name: string, email: string, gender: string }): void {
    
    let newUser: User = { 
      id: 0, 
      name: userData.name, 
      email: userData.email,
      gender: userData.gender,
      status: 'active'
    };
    this.apiService.addUser(newUser).subscribe(
      (response: User) => {
        let token: string = this.storageService.getFromLocalStorage('authToken'); 
        this.storageService.saveToLocalStorage(token, response);
        this.users.push(response);
        this.closeModalUserDetails();
        this.openModalPublishPost();
      },
      (error) => {
        console.error('Error adding data to GoRest', error);
      }
    ); 
  }

  // Open modal to publish a post
  openModalPublishPost(): void {
    this.isModalPublishPostOpen = true;
  }

  // Close modal to publish a post
  closeModalPublishPost(): void {
    this.isModalPublishPostOpen = false;
  }
  
  // Publish a new post
  publishPost(newPostTitle: string, newPostBody: string): void { 
    this.apiService.addPost(newPostTitle, newPostBody).subscribe(
      (response: Post) => {
        this.posts = [response, ...this.posts];
        this.closeModalPublishPost();
      },
      (error) => {
       console.error('Error adding data to GoRest', error);
      }
    );
  }
  
  // Get users and their posts on component initialization
  ngOnInit(): void {
    this.loadPosts();
  }
  
}
