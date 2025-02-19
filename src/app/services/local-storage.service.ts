import { Injectable } from '@angular/core';
import { User } from '../models/user.model'

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // Saves data to local storage under the specified key
  // authToken is used for the authorized user
  // 'token sequence' is used for the user details
  saveToLocalStorage(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data)); 
  }

  // Retrieves data from local storage
  getFromLocalStorage(key: string) {
    let storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : {}; 
  }

  // Gets the authorized token from local storage
  getAuthorizedToken(): string {
    let token = localStorage.getItem('authToken') ?? '';
    return token.replace(/"/g, '');
  }

  // Remove data from local storage
  removeFromLocalStorage(key: string): void {
    localStorage.removeItem(key);
  }

  // Update data in local storage
  updateLocalStorage(key: string, userDetails:User) {
    localStorage.setItem(key, JSON.stringify(userDetails));
  }
}