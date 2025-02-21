import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersListComponent } from './users-list.component';
import { GoRestAPIService } from '../../services/go-rest-api.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

describe('UsersListComponent', () => {

  let component: UsersListComponent;
  let fixture: ComponentFixture<UsersListComponent>;
  let apiServiceSpy: jasmine.SpyObj<GoRestAPIService>;
  let storageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    
    apiServiceSpy = jasmine.createSpyObj('GoRestAPIService', ['getUsers', 'deleteUser', 'addUser']);
    storageServiceSpy = jasmine.createSpyObj('LocalStorageService', ['saveToLocalStorage']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    
    apiServiceSpy.getUsers.and.returnValue(of([])); 
    apiServiceSpy.addUser.and.returnValue(of({ id: 1, name: 'New User', email: 'newuser@example.com', gender: 'male', status: 'active' }));
    apiServiceSpy.deleteUser.and.returnValue(of(new HttpResponse({ status: 200, body: null })));

    TestBed.configureTestingModule({
      imports: [
        UsersListComponent
      ],
      providers: [
        { provide: GoRestAPIService, useValue: apiServiceSpy },
        { provide: LocalStorageService, useValue: storageServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getUsers on ngOnInit and load users', () => {
    const mockUsers = [{ id: 1, name: 'Mario Rossi', email: 'mariorossi@gmail.com', gender: 'male', status: 'active' }];
    apiServiceSpy.getUsers.and.returnValue(of(mockUsers));
    component.ngOnInit();
    fixture.detectChanges();
    expect(apiServiceSpy.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
  });

  it('should search users correctly', () => {
    const mockUsers = [
      { id: 1, name: 'Mario Rossi', email: 'mariorossi@gmail.com', gender: 'male', status: 'active' },
      { id: 2, name: 'Luca Bianchi', email: 'lucabianchi@gmail.com', gender: 'female', status: 'active' }
    ];
    component.users = mockUsers;  
    component.searchTerm = 'Mario';
    component.searchUsers();
    expect(component.users).toEqual([mockUsers[0]]);  
  });

  it('should handle page changes correctly', () => {
    const pageEvent: PageEvent = { pageIndex: 1, pageSize: 10, length: 10 };
    spyOn(component, 'getUsers');  
    component.onPageChange(pageEvent);
    expect(component.getUsers).toHaveBeenCalled();
    expect(component.currentPage).toBe(2);
  });

  it('should add a new user', () => {
    const newUser = { name: 'New User', email: 'newuser@example.com', gender: 'male', token: 'fakeToken' };
    component.addUser(newUser);
    expect(apiServiceSpy.addUser).toHaveBeenCalledWith({
      id: 0,
      name: 'New User',
      email: 'newuser@example.com',
      gender: 'male',
      status: 'active'
    });
    expect(storageServiceSpy.saveToLocalStorage).toHaveBeenCalledWith('fakeToken', { id: 1, name: 'New User', email: 'newuser@example.com', gender: 'male', status: 'active' });

});

  it('should delete a user', () => {
    const mockUsers = [{ id: 1, name: 'Mario Rossi', email: 'mariorossi@gmail.com', gender: 'male', status: 'active' }];
    component.users = mockUsers;  
    const updatedUsers = component.deleteUser(1);
    expect(apiServiceSpy.deleteUser).toHaveBeenCalledWith(1);
    expect(updatedUsers.length).toBe(0);  
  });

  it('should open and close the modal', () => {
    component.openModal();
    expect(component.isModalOpen).toBe(true);
    component.closeModal();
    expect(component.isModalOpen).toBe(false);
  });

});
