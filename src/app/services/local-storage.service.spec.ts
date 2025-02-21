import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';
import { User } from '../models/user.model';

describe('LocalStorageService', () => {

  let service: LocalStorageService;
  let user: User;

  beforeEach(() => {

    user = {
      id: 1,
      name: 'Mario Rossi',
      email: 'mariorossi@example.com',
      gender: 'male',
      status: 'active'
    };

    TestBed.configureTestingModule({
      providers: [
        LocalStorageService
    ]
    });

    service = TestBed.inject(LocalStorageService);
    localStorage.clear();

  });

  afterEach(() => {
    
    localStorage.clear();

  });

  it('should save and retrieve data from local storage', () => {
    
    let key = '123456';
    service.saveToLocalStorage(key, user);
    let storedData = service.getFromLocalStorage(key);
    expect(storedData).toEqual(user);

  });

  it('should get the authorized token from local storage', () => {

    let token = 'fakeToken';
    localStorage.setItem('authToken', `"${token}"`); 
    let result = service.getAuthorizedToken();
    expect(result).toBe(token);  

  });

  it('should remove data from local storage', () => {

    let key = '123456';
    service.saveToLocalStorage(key, user);
    service.removeFromLocalStorage(key);
    let storedData = service.getFromLocalStorage(key);
    expect(storedData).toEqual({});

  });

  it('should update data in local storage', () => {

    let key = '123456';
    let updatedUser: User = { 
      id: 1, 
      name: 'Luca Bianchi', 
      email: 'lucabianchi@example.com', 
      gender: 'male', 
      status: 'inactive' 
    };
    service.saveToLocalStorage(key, user);
    service.updateLocalStorage(key, updatedUser);
    let storedData = service.getFromLocalStorage(key);
    expect(storedData).toEqual(updatedUser);
    
  });
});
