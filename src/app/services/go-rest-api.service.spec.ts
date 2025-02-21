import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';
import { GoRestAPIService } from './go-rest-api.service';
import { LocalStorageService } from './local-storage.service';
import { User } from '../models/user.model';
import { Post } from '../models/post.model';

describe('GoRestAPIService', () => {

  let service: GoRestAPIService;
  let httpMock: HttpTestingController;
  let storageServiceMock: jasmine.SpyObj<LocalStorageService>;

  let mockUsers: User[] = [
    { 
        id: 1, 
        name: 'Mario Rossi', 
        email: 'mariorossi@example.com', 
        gender: 'male', 
        status: 'active' 
    },
    { 
        id: 2, 
        name: 'Giulia Verdi', 
        email: 'giuliaverdi@example.com',
        gender: 'female',
        status: 'active' 
    }
  ];

  let mockSingleUser: User = { 
    id: 3, 
    name: 'Luca Neri', 
    email: 'lucaneri@example.com',
    gender: 'male',
    status: 'active'
  };

  let mockPosts: Post[] = [
    { id: 1, user_id: 1, title: 'Post 1', body: 'Body 1' },
    { id: 2, user_id: 1, title: 'Post 2', body: 'Body 2' }
  ];

  beforeEach(() => {

    storageServiceMock = jasmine.createSpyObj('LocalStorageService', [
        'getAuthorizedToken', 
        'getFromLocalStorage',
        'saveToLocalStorage'
    ]);
    storageServiceMock.getAuthorizedToken.and.returnValue('fakeToken');
    storageServiceMock.getFromLocalStorage.and.returnValue({ 
        id: 1, 
        name: 'Mario Rossi', 
        email: 'mariorossi@example.com', 
        gender: 'male', 
        status: 'active' 
    });

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        GoRestAPIService,
        { provide: LocalStorageService, useValue: storageServiceMock }
        ]
    });
    service = TestBed.inject(GoRestAPIService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should authorize user and return user data', () => {
    let token = 'fakeToken';
    service.authorizeUser(token).subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });
    let req = httpMock.expectOne('https://gorest.co.in/public/v2/users');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer fakeToken');
    req.flush(mockUsers);
  });

  it('should fetch users with pagination', () => {
    service.getUsers(1, 10).subscribe((users) => {
      expect(users).toEqual(mockUsers);
    });
    let req = httpMock.expectOne(
      'https://gorest.co.in/public/v2/users/?page=1&per_page=10'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should fetch a specific user by ID', () => {
    let userId = 3;
    service.getUserById(userId).subscribe((user) => {
      expect(user).toEqual(mockSingleUser);
    });
    let req = httpMock.expectOne(`https://gorest.co.in/public/v2/users/${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSingleUser);
  });

  it('should add a new user', () => {
    let newUser: User = { 
        id: 4, 
        name: 'Maria Rosa', 
        email: 'mariarosa@example.com',
        gender: 'female',
        status: 'active'
    };
    service.addUser(newUser).subscribe((user) => {
      expect(user).toEqual(newUser);
    });
    let req = httpMock.expectOne('https://gorest.co.in/public/v2/users');
    expect(req.request.method).toBe('POST');
    req.flush(newUser);
  });

  it('should delete a user', () => {
    let userId = 1;
    service.deleteUser(userId).subscribe((response) => {
      expect(response.status).toBe(200);
    });
    let req = httpMock.expectOne(`https://gorest.co.in/public/v2/users/${userId}`);
    expect(req.request.method).toBe('DELETE');
    const mockResponse = new HttpResponse({ status: 200 });
    req.flush(mockResponse);
  });

  it('should fetch posts by user ID', () => {
    let userId = 1;
    service.getUserPosts(userId).subscribe((posts) => {
      expect(posts).toEqual(mockPosts);
    });
    let req = httpMock.expectOne(`https://gorest.co.in/public/v2/users/${userId}/posts`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should add a new post', () => {
    let userId = 1;
    let newPost = { 
        id: 1, 
        user_id: userId, 
        title: 'New Post', 
        body: 'New Post Body' 
    };
    service.addPost(newPost.title, newPost.body).subscribe((post) => {
      expect(post).toEqual(newPost);
    });
    let req = httpMock.expectOne(`https://gorest.co.in/public/v2/users/${userId}/posts`);
    expect(req.request.method).toBe('POST');
    req.flush(newPost);
  });

  it('should add a comment to a post', () => {
    let newComment = { 
        id: 1,
        post_id: 1, 
        name: 'Commenter', 
        email: 'commenter@example.com', 
        body: 'This is a comment' 
    };
    service.addComment(newComment).subscribe((comment) => {
      expect(comment).toEqual(newComment);
    });
    let req = httpMock.expectOne(`https://gorest.co.in/public/v2/posts/1/comments`);
    expect(req.request.method).toBe('POST');
    req.flush(newComment);
  });
});