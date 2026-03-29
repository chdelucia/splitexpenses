import { Component, computed, inject, OnInit, Renderer2 } from '@angular/core';
import { WeatherService } from './forecast/shared/weather.service';
import { GoogleAnaliticsService, ScriptService } from '@shared/services';
import { WeatherComponent } from './weather/weather.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [WeatherComponent, NavbarComponent, RouterOutlet],
})
export class AppComponent implements OnInit {
  private renderer = inject(Renderer2);
  private weatherService = inject(WeatherService);
  private googleAnalitics = inject(GoogleAnaliticsService);
  private scriptService = inject(ScriptService);

  title = 'splity';
  weatherActive = computed(() => this.weatherService.weatherSettings().active);

  ngOnInit(): void {
    this.scriptService.loadScripts(this.renderer);
    this.googleAnalitics.initialize();
  }
}
