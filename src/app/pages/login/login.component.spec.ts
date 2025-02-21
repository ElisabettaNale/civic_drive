import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { GoRestAPIService } from '../../services/go-rest-api.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';

describe('LoginComponent', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let apiServiceSpy: jasmine.SpyObj<GoRestAPIService>;
  let storageServiceSpy: jasmine.SpyObj<LocalStorageService>;

  beforeEach(() => {
    
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    apiServiceSpy = jasmine.createSpyObj('GoRestAPIService', ['authorizeUser']);
    storageServiceSpy = jasmine.createSpyObj('LocalStorageService', 
        [
            'saveToLocalStorage', 
            'getFromLocalStorage'
        ]
    );

    TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        FormsModule, 
        CommonModule, 
        HttpClientTestingModule
    ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: GoRestAPIService, useValue: apiServiceSpy },
        { provide: LocalStorageService, useValue: storageServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should show error message if token is empty', () => {

    component.token = ''; 
    component.login();
    expect(component.errorMessage).toBe('Token non può essere una stringa vuota!');

  });

  it('should call authorizeUser and navigate to users-list on successful login', () => {

    const mockResponse: User[] = [{
        id: 1,
        name: 'Mario Rossi',
        email: 'mariorossi@example.com',
        gender: 'male',
        status: 'active'
    }];
    apiServiceSpy.authorizeUser.and.returnValue(of(mockResponse));
    storageServiceSpy.saveToLocalStorage.and.callFake(() => {}); 
    storageServiceSpy.getFromLocalStorage.and.returnValue({});
    component.token = 'validToken';
    component.login();
    expect(apiServiceSpy.authorizeUser).toHaveBeenCalledWith('validToken');
    expect(storageServiceSpy.saveToLocalStorage).toHaveBeenCalledWith('authToken', 'validToken');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/users-list']);
    expect(component.errorMessage).toBe('');

  });

  it('should show error message if the token is invalid', () => {

    apiServiceSpy.authorizeUser.and.returnValue(of([])); 
    component.token = 'invalidToken';
    component.login();
    expect(component.errorMessage).toBe('Token non valido!');

  });

  it('should show error message if login fails', () => {

    apiServiceSpy.authorizeUser.and.returnValue(throwError(() => new Error('Login failed')));
    component.token = 'someToken';
    component.login();
    expect(component.errorMessage).toBe('Errore durante il login! Verifica che il tuo token sia valido.');

  });
});
