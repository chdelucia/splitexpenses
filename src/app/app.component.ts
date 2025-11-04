import {
  AfterContentChecked,
  Component,
  OnInit,
  Renderer2,
} from '@angular/core';
import { WeatherService } from './forecast/shared/weather.service';
import { GoogleAnaliticsService, ScriptService } from '@shared/services';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit, AfterContentChecked {
  title = 'splity';
  weatherActive: boolean;

  constructor(
    private renderer: Renderer2,
    private weatherService: WeatherService,
    private googleAnalitics: GoogleAnaliticsService,
    private scriptService: ScriptService,
  ) {
    this.weatherActive = this.weatherService.getWeahterSettings().active;
  }

  ngOnInit(): void {
    this.scriptService.loadScripts(this.renderer);
    this.googleAnalitics.initialize();
  }

  ngAfterContentChecked(): void {
    //TODO change to behaviour emit
    this.weatherActive = this.weatherService.getWeahterSettings().active;
  }
}
