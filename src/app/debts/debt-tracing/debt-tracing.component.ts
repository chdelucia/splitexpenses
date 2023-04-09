import { Input } from '@angular/core';
import { Component } from '@angular/core';
import { CurrencyService } from 'src/app/shared/currency.service';
import { CurrencyPlugin, TraceAutoSettle } from 'src/app/shared/models';

@Component({
  selector: 'app-debt-tracing',
  templateUrl: './debt-tracing.component.html',
  styleUrls: ['./debt-tracing.component.scss']
})
export class DebtTracingComponent {
  @Input() debtTracing: TraceAutoSettle[] = [];
  currency: CurrencyPlugin;

  constructor(
    private currencyService: CurrencyService
  ) {
    this.currency = this.currencyService.getCurrencySettings();
  }

}
