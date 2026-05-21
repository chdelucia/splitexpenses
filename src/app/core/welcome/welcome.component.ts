import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent {
  private router = inject(Router);

  selectMode(mode: 'shared' | 'personal') {
    localStorage.setItem('splity_preferred_mode', mode);
    if (mode === 'shared') {
      this.router.navigate(['/expense']);
    } else {
      this.router.navigate(['/personal']);
    }
  }
}
