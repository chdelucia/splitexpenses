import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '@core/navbar/navbar.component';
import { ExpensesService } from '@expenses/shared/expenses.service';

@Component({
  standalone: true,
  imports: [RouterModule, NavbarComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected title = 'viajes-compartidos';
  private expensesService = inject(ExpensesService);

  ngOnInit(): void {
    this.expensesService.switchContext('shared');
  }
}
