import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Post } from '../models/post.model';
import { PostComment } from '../models/postComment.model';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class GoRestAPIService {

  private apiUrl:string = 'https://gorest.co.in/public/v2';

  constructor(private http: HttpClient,
              private storageService: LocalStorageService) {}

  // Authorizes user by using a Bearer token for authentication
  authorizeUser(token: string): Observable<User[]> {
    let headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers });
  }

  // Gets users with pagination (page index and page size)
  getUsers(pageIndex: number, pageSize: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/?page=${pageIndex}&per_page=${pageSize}`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.getAuthorizedToken()}`
      }
    });
  }

  // Gets a specific user by ID
  getUserById(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.getAuthorizedToken()}`
      }
    });
  }

  // Gets the details of a user by their ID
  getUserDetails(ID: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${ID}`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.getAuthorizedToken()}`
      }
    })
  }

  // Adds a new user by making a POST request to the API
  addUser(newUser: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, newUser, {
      headers: {
        'Authorization': `Bearer ${this.storageService.getAuthorizedToken()}`
      }
    })
  }

  // Deletes a user by ID
  deleteUser(userID: number): Observable<HttpResponse<void>> {
    return this.http.delete<HttpResponse<void>>(`${this.apiUrl}/users/${userID}`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.getAuthorizedToken()}`
      }
    })
    
  }

  // Gets all posts by a specific user using their ID
  getUserPosts(ID: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/users/${ID}/posts`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.getAuthorizedToken()}`
      }
    })
  }

  // Gets all comments for a specific post using the post ID
  getPostComments(ID: number): Observable<PostComment[]> {
    return this.http.get<PostComment[]>(`${this.apiUrl}/posts/${ID}/comments`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.getAuthorizedToken()}`
      }
    })
  }

  // Adds a new post by a user
  addPost(newPostTitle: string, newPostBody: string): Observable<Post> {
    let token = this.storageService.getAuthorizedToken();
    let newPost = {
      id: 0,
      user_id: this.storageService.getFromLocalStorage(token).id,
      title: newPostTitle,
      body: newPostBody
    }
    return this.http.post<Post>(`${this.apiUrl}/users/${newPost.user_id}/posts`, newPost, {
      headers: {
        'Authorization': `Bearer ${this.storageService.getAuthorizedToken()}`
      }
  })
  }

  // Adds a comment to a specific post
  addComment(newComment: PostComment): Observable<PostComment> {
    return this.http.post<PostComment>(`${this.apiUrl}/posts/${newComment.post_id}/comments`, newComment, {
      headers: {
        'Authorization': `Bearer ${this.storageService.getAuthorizedToken()}`
      }
    })
  }

}
