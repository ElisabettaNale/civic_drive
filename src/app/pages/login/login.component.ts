import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GoRestAPIService } from '../../services/go-rest-api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent {

  token: string = '';
  errorMessage: string = '';

  constructor(private router: Router,
              private apiService: GoRestAPIService,
              private storageService: LocalStorageService
  ) {}

  // Login process
  login() {
    
    this.errorMessage = '';

    if (!this.token.trim()) { 
      this.errorMessage = 'Token non può essere una stringa vuota!'; 
    } else {

    this.apiService.authorizeUser(this.token).subscribe(
      (response) => {
        if (response && response.length > 0) {
          this.storageService.saveToLocalStorage('authToken', this.token);
          if (!this.storageService.getFromLocalStorage(this.token)) {
            let userDetails =  {}
            this.storageService.saveToLocalStorage(this.token, userDetails);
          }
          this.router.navigate(['/users-list']);
        } else {
          this.errorMessage = 'Token non valido!';
        }
      },
      () => {
        this.errorMessage = 'Errore durante il login! Verifica che il tuo token sia valido.';
      }
    );
  }}
}
