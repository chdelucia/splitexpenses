import { Component, computed, inject } from '@angular/core';
import { WeatherService } from '@forecast/shared/weather.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule, MatIconModule],
})
export class NavbarComponent {
  private weatherService = inject(WeatherService);
  weatherActive = computed(() => this.weatherService.weatherSettings().active);
}
