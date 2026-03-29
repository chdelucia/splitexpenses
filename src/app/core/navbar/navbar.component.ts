import { Component, computed, inject } from '@angular/core';
import { WeatherService } from '@forecast/shared/weather.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule],
})
export class NavbarComponent {
  private weatherService = inject(WeatherService);
  weatherActive = computed(() => this.weatherService.weatherSettings().active);
}
