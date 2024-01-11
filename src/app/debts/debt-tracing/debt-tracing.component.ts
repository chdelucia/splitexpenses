import { Input } from '@angular/core';
import { Component } from '@angular/core';
import { CurrencyService } from '../../shared/currency.service';
import { CurrencyPlugin, TraceAutoSettle } from '../../shared/models';

@Component({
  selector: 'app-debt-tracing',
  templateUrl: './debt-tracing.component.html',
  styleUrls: ['./debt-tracing.component.scss'],
})
export class DebtTracingComponent {
  @Input() debtTracing: TraceAutoSettle[] = [];
  currency: CurrencyPlugin;

  constructor(private currencyService: CurrencyService) {
    this.currency = this.currencyService.getCurrencySettings();
  }
}
