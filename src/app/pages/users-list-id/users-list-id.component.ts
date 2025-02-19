import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { GoRestAPIService } from '../../services/go-rest-api.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';
import { PostComment } from '../../models/postComment.model';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { PostComponent } from "../../components/post/post.component";

@Component({
  selector: 'app-users-list-id',
  imports: [
    CommonModule,
    PostComponent
],
  templateUrl: './users-list-id.component.html',
  styleUrl: './users-list-id.component.css',
  standalone: true
})
export class UsersListIdComponent implements OnInit{
  
  ID: number = 0;  // Holds the user ID passed in the route
  user: User | null = null;  // Stores the user details
  posts: Post[] = [];  // Stores the user's posts

  constructor(private apiService: GoRestAPIService,
              private route: ActivatedRoute
  ) {}

  // Get user details by user ID
  getUserDetails(ID: number): void {
    this.apiService.getUserDetails(ID).subscribe(
      (response: User) => {
        this.user = response;
      },
      (error) => {
        console.error('Error getting user details from GoRest', error);
      }
    );
  }

  // Get posts by user ID and their comments
  getUserPosts(ID: number): void {
    this.apiService.getUserPosts(ID).subscribe(
      (response: Post[]) => {
        this.posts = response;
        for (let i = 0; i < this.posts.length; i++) {
          this.getPostComments(this.posts[i].id).subscribe(
            (response: PostComment[]) => {
              this.posts[i].comments = response.reverse();
            },
            (error) => {
              console.error('Error getting post comments from GoRest', error);
            }
          );
        }
      },
      (error) => {
        console.error('Error getting user posts from GoRest', error);
      }
    );
  }

  // Get post comments for a given post ID
  getPostComments(ID: number): Observable<PostComment[]> {
    return this.apiService.getPostComments(ID);
  }

  // Retrieve the user ID from route parameters
  // Get user details using the ID
  // Get posts and comments for the user
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userId = Number(params.get('id'));
      this.getUserDetails(userId);
      this.getUserPosts(userId);
    });
  }

}
