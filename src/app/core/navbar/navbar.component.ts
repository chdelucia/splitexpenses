import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule, MatIconModule],
})
export class NavbarComponent {
  private storageService = inject(LocalstorageService);

  isPersonalMode = computed(() => {
    return this.storageService.activeTravelName() === 'Personal';
  });

  expenseDetailsLink = computed(() => {
    return this.isPersonalMode() ? '/personal/details' : '/expense/details';
  });
}
