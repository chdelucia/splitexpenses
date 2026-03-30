import { input, Component, inject } from '@angular/core';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { CurrencyPlugin, TraceAutoSettle } from '@shared/models';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-debt-tracing',
  templateUrl: './debt-tracing.component.html',
  styleUrls: ['./debt-tracing.component.scss'],
  standalone: true,
  imports: [CommonModule, DecimalPipe],
})
export class DebtTracingComponent {
  debtTracing = input.required<TraceAutoSettle[]>();

  private currencyService = inject(CurrencyService);
  currency: CurrencyPlugin = this.currencyService.getCurrencySettings();
}
