import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersPostsComponent } from './users-posts.component';
import { GoRestAPIService } from '../../services/go-rest-api.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { of } from 'rxjs';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';
import { PostComment } from '../../models/postComment.model';
import { PaginatorComponent } from '../../components/paginator/paginator.component';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { FormAddUserDetailsComponent } from '../../components/form-add-user-details/form-add-user-details.component';

class GoRestAPIServiceMock {
  getUsers(page: number, size: number) {
    return of([
      { id: 1, name: 'Mario Rossi', email: 'mariorossi@gmail.com', gender: 'male', status: 'active' }
    ] as User[]);
  }

  getUserById(userId: number) {
    if (userId === 1) {
      return of([
        { id: 1, name: 'Mario Rossi', email: 'mariorossi@gmail.com', gender: 'male', status: 'active' }
      ] as User[]);
    }     
    return of([] as User[]); 
  }

  getUserPosts(userId: number) {
    return of([
      { id: 1, title: 'Post 1', body: 'Post body 1' }
    ] as Post[]);
  }

  getPostComments(postId: number) {
    return of([
      { id: 1, post_id: postId, name: 'Mario Rossi', email: 'mariorossi@gmail.com', body: 'New post.' }
    ] as PostComment[]);
  }

  addPost(title: string, body: string) {
    return of({ id: 1, title, body } as Post);
  }

  addUser(user: User) {
    return of(user);
  }
}

class LocalStorageServiceMock {
  getAuthorizedToken() {
    return 'authToken';
  }

  getFromLocalStorage(token: string) {
    return { id: 1, name: 'Mario Rossi', email: 'mariorossi@gmail.com', gender: 'male', status: 'active' };
  }

  saveToLocalStorage(token: string, user: User) {
  }
}

describe('UsersPostsComponent', () => {
  let component: UsersPostsComponent;
  let fixture: ComponentFixture<UsersPostsComponent>;
  let apiServiceMock: GoRestAPIServiceMock;
  let storageServiceMock: LocalStorageServiceMock;

  beforeEach(() => {
    apiServiceMock = new GoRestAPIServiceMock();
    storageServiceMock = new LocalStorageServiceMock();

    TestBed.configureTestingModule({
      imports: [
        UsersPostsComponent, 
        PaginatorComponent, 
        SearchBarComponent, 
        FormAddUserDetailsComponent,
        FormsModule],
      providers: [
        { provide: GoRestAPIService, useValue: apiServiceMock },
        { provide: LocalStorageService, useValue: storageServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load users and their posts on initialization', () => {
    spyOn(apiServiceMock, 'getUsers').and.callThrough();
    spyOn(apiServiceMock, 'getUserPosts').and.callThrough();
    spyOn(apiServiceMock, 'getPostComments').and.callThrough();
    component.ngOnInit();
    expect(apiServiceMock.getUsers).toHaveBeenCalled();
    expect(apiServiceMock.getUserPosts).toHaveBeenCalledWith(1);
    expect(apiServiceMock.getPostComments).toHaveBeenCalledWith(1);
    expect(component.users.length).toBe(1);
    expect(component.posts.length).toBe(1);
  });

  it('should filter posts based on search term', () => {
    component.posts = [
      { id: 1, user_id: 1, title: 'Post 1', body: 'Body 1' },
      { id: 2, user_id: 1, title: 'Post 2', body: 'Body 2' }
    ];
    component.searchTerm = 'Post 1';
    component.searchPosts();
    expect(component.posts.length).toBe(1);
    expect(component.posts[0].title).toBe('Post 1');
  });

  it('should add a post when user is authorized', () => {
    component.posts = [];
    spyOn(storageServiceMock, 'getAuthorizedToken').and.returnValue('authToken');
    spyOn(storageServiceMock, 'getFromLocalStorage').and.returnValue({ 
      id: 1, 
      name: 'Mario Rossi',
      email: 'mariorossi@gmail.com',
      gender: 'male', 
      status: 'active'
    } as User);
    spyOn(apiServiceMock, 'addPost').and.callThrough();
    component.publishPost('New Post', 'This is a new post');
    expect(apiServiceMock.addPost).toHaveBeenCalledWith('New Post', 'This is a new post');
    expect(component.posts.length).toBe(1);
  });

});
