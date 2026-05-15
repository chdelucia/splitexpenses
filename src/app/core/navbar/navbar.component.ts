import { Component, computed, inject } from '@angular/core';
import { WeatherService } from '@forecast/shared/weather.service';
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
  private weatherService = inject(WeatherService);
  private storageService = inject(LocalstorageService);

  weatherActive = computed(() => this.weatherService.weatherSettings().active);
  isPersonal = computed(() => this.storageService.getActiveTravelName() === 'Personal');
}
