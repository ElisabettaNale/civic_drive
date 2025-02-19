import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true
})
export class HeaderComponent {

  title = 'CivicDrive';

  isLoginPage: boolean = false;

  constructor(private router: Router,
              private storageService: LocalStorageService
  ) {
    // Update isLoginPage whenever the route changes
    this.router.events.subscribe(() => {
      this.isLoginPage = this.router.url === '/'; 
    });
  }

  // User logout
  onExit(): void {
    this.storageService.removeFromLocalStorage('authToken');
    this.router.navigate(['/']);
  }

}
