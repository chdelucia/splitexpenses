import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForecastRoutingModule } from './forecast-routing.module';
import { ForecastComponent } from './forecast.component';
import { WeatherService } from './shared/weather.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ForecastComponent],
  imports: [CommonModule, ForecastRoutingModule, SharedModule],
  providers: [WeatherService],
})
export class ForecastModule {}
