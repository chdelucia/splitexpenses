import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { StatsService } from './shared/stats.service';
import { CurrencyPlugin, User } from '@shared/models';
import { UsersService } from '@users/shared/users.service';
import { CommonModule } from '@angular/common';
import { SummarygraphComponent } from '@shared/components';
import { ExchangePipe } from '@shared/pipes/exchange.pipe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SummarygraphComponent,
    ExchangePipe,
    MatFormFieldModule,
    MatSelectModule,
  ],
})
export class StatsComponent {
  private statsService = inject(StatsService);
  private currencyService = inject(CurrencyService);
  private userService = inject(UsersService);

  usersHTML = toSignal(this.userService.getIterableUsers());

  selectedUserId = signal<string | undefined>(undefined);

  todayCost = computed(() =>
    this.statsService.getTotalCost(this.selectedUserId()),
  );
  meanCost = computed(() =>
    this.statsService.getAverageCostPerDay(this.selectedUserId()),
  );
  dailyData = computed(() =>
    this.statsService.gettotalCostEachDayPerType(this.selectedUserId()),
  );
  typeData = computed(() =>
    this.statsService.getExpensesByType(this.selectedUserId()),
  );

  currency = this.currencyService.currencySignal;

  change(id: string): void {
    this.selectedUserId.set(id !== '0' ? id : undefined);
  }
}
