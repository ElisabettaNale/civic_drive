import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostComponent } from './post.component';
import { GoRestAPIService } from '../../services/go-rest-api.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('PostComponent', () => {

  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;
  let apiServiceSpy: jasmine.SpyObj<GoRestAPIService>;
  let storageServiceSpy: jasmine.SpyObj<LocalStorageService>;

  beforeEach(async () => {
    
    const apiSpy = jasmine.createSpyObj('GoRestAPIService', [
        'getUserById', 
        'addComment', 
        'addUser']);
    const storageSpy = jasmine.createSpyObj('LocalStorageService', [
        'getAuthorizedToken', 
        'getFromLocalStorage',
        'saveToLocalStorage']);

    await TestBed.configureTestingModule({
      imports: [
        PostComponent, 
        FormsModule
    ],
      providers: [
        { provide: GoRestAPIService, useValue: apiSpy },
        { provide: LocalStorageService, useValue: storageSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    apiServiceSpy = TestBed.inject(GoRestAPIService) as jasmine.SpyObj<GoRestAPIService>;
    storageServiceSpy = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;

    fixture.detectChanges();
  });

  it('should convert user ID to user name', () => {
    apiServiceSpy.getUserById.and.returnValue(
        of({ id: 1, name: 'Mario Rossi'})
    );
    component.getUserNameByUserId(1);
    expect(apiServiceSpy.getUserById).toHaveBeenCalledWith(1);
    expect(component.userName).toBe('Mario Rossi');
  })

  it('should show the modal if the user is not registered', () => {
    storageServiceSpy.getAuthorizedToken.and.returnValue('fakeToken');
    storageServiceSpy.getFromLocalStorage.and.returnValue({}); 
    let fakeCommentInput = document.createElement('input') as HTMLInputElement;
    fakeCommentInput.value = 'Test comment';
    component.addComment(1, fakeCommentInput);
    expect(component.showUserDetailsModal).toBeTrue(); 
  });

  it('should submitComment if the user is registered', () => {
    storageServiceSpy.getAuthorizedToken.and.returnValue('fakeToken');
    storageServiceSpy.getFromLocalStorage.and.returnValue(
        { id: 123456, name: 'Mario Rossi', email: 'mariorossi@example.com', gender: 'male', status: 'active' }
    );
    spyOn(component, 'submitComment');
    let fakeCommentInput = document.createElement('input') as HTMLInputElement;
    fakeCommentInput.value = 'Test comment';
    component.addComment(1, fakeCommentInput);
    expect(component.submitComment).toHaveBeenCalledWith(
        1, 
        fakeCommentInput, 
        { id: 123456, name: 'Mario Rossi', email: 'mariorossi@example.com', gender: 'male', status: 'active' }
    );
  });

  it('should save user details in localStorage and close modal', () => {
    let fakeUserData = { 
        name: 'Mario Rossi', email: 'mariorossi@email.com', gender: 'male' 
    };
    let fakeResponse = { id: 1, ...fakeUserData, status: 'active' };
    apiServiceSpy.addUser.and.returnValue(of(fakeResponse));
    component.saveUserDetails(fakeUserData);
    expect(apiServiceSpy.addUser).toHaveBeenCalledWith(jasmine.objectContaining(fakeUserData));
    expect(storageServiceSpy.saveToLocalStorage).toHaveBeenCalled();
    expect(component.showUserDetailsModal).toBeFalse(); 
  });

});
