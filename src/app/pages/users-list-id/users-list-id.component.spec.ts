import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListIdComponent } from './users-list-id.component';
import { GoRestAPIService } from '../../services/go-rest-api.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { User } from '../../models/user.model';
import { Post } from '../../models/post.model';
import { PostComment } from '../../models/postComment.model';

// Creazione di un mock per GoRestAPIService
class GoRestAPIServiceMock {
  getUserDetails(id: number) {
    return of({
      id: 1,
      name: 'Mario Rossi',
      email: 'mariorossi@gmail.com',
      gender: 'male',
      status: 'active'
    } as User);
  }

  getUserById(userId: number) {
    if (userId === 1) {
      return of([
        { id: 1, name: 'Mario Rossi', email: 'mariorossi@gmail.com', gender: 'male', status: 'active' }
      ] as User[]);
    }     
    return of([] as User[]); 
  }

  getUserPosts(id: number) {
    return of([
      { id: 1, title: 'Post 1', body: 'Body 1' },
      { id: 2, title: 'Post 2', body: 'Body 2' }
    ] as Post[]);
  }

  getPostComments(postId: number) {
    return of([
      { id: 1, post_id: postId, name: 'Mario Rossi', email: 'mariorossi@gmail.com', body: 'New comment.' },
      { id: 2, post_id: postId, name: 'Luca Bianchi', email: 'lucabianchi@gmail.com', body: 'Another comment.' }
    ] as PostComment[]);
  }
}

class ActivatedRouteMock {
  paramMap = of({ get: (key: string) => '1' }); 
}

describe('UsersListIdComponent', () => {

  let component: UsersListIdComponent;
  let fixture: ComponentFixture<UsersListIdComponent>;
  let apiServiceMock: GoRestAPIServiceMock;
  let routeMock: ActivatedRouteMock;

  beforeEach(() => {
    apiServiceMock = new GoRestAPIServiceMock();
    routeMock = new ActivatedRouteMock();

    TestBed.configureTestingModule({
      imports: [UsersListIdComponent],
      providers: [
        { provide: GoRestAPIService, useValue: apiServiceMock },
        { provide: ActivatedRoute, useValue: routeMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fetch user details and posts when component is initialized', () => {
    spyOn(apiServiceMock, 'getUserDetails').and.callThrough();
    spyOn(apiServiceMock, 'getUserPosts').and.callThrough();
    spyOn(apiServiceMock, 'getPostComments').and.callThrough();
    component.ngOnInit();
    expect(apiServiceMock.getUserDetails).toHaveBeenCalledWith(1);
    expect(apiServiceMock.getUserPosts).toHaveBeenCalledWith(1);
    expect(component.user).toBeTruthy();
    expect(component.user?.name).toBe('Mario Rossi');
    expect(component.posts.length).toBe(2); 
    expect(apiServiceMock.getPostComments).toHaveBeenCalledTimes(2); 
  });

  it('should handle error when fetching posts', () => {
    spyOn(apiServiceMock, 'getUserDetails').and.callThrough();
    spyOn(apiServiceMock, 'getUserPosts').and.returnValue(of([])); 
    component.ngOnInit();
    expect(component.user).toBeTruthy();
    expect(component.posts.length).toBe(0);
  });
  
});
