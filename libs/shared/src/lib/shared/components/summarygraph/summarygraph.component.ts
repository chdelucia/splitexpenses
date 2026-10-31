import {
  Component,
  effect,
  inject,
  input,
  ViewChild,
  computed,
} from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summarygraph',
  templateUrl: './summarygraph.component.html',
  styleUrls: ['./summarygraph.component.scss'],
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
})
export class SummarygraphComponent {
  private storageService = inject(LocalstorageService);
  private currencyService = inject(CurrencyService);

  bytype = input<string>('false');
  data = input<{
    labels: Array<string>;
    data: Array<unknown>;
  }>({
    labels: [''],
    data: [],
  });

  filter: string = '';
  settings;

  currencySymbol = computed(
    () => this.currencyService.currencySignal().currencySymbol,
  );

  constructor() {
    this.settings = this.storageService.getSettings();

    effect(() => {
      if (this.bytype() === 'ByType') {
        this.calcByType();
      } else {
        this.calcByDay();
      }
      this.chart?.update();
    });
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        min: 0,
        stacked: true,
      },
    },
    plugins: {
      tooltip: {},
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [];

  barChartData: ChartData<any> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: '',
        borderColor: 'yellow',
        backgroundColor: ['rgba(222,225,38,0.68)'],
      },
    ],
  };

  calcByType() {
    this.barChartType = 'doughnut';

    const rawData = (this.data().data as number[]) || [];
    const rawLabels = this.data().labels || [];
    const bgColors = this.settings.graph.bgColors || [];

    // Filter out zero-value categories for clean doughnut breakdown
    const filteredItems = rawData
      .map((val, idx) => ({
        val,
        label: rawLabels[idx],
        color: bgColors[idx] || '#cbd5e1',
      }))
      .filter((item) => item.val > 0);

    const filteredData = filteredItems.map((i) => i.val);
    const filteredLabels = filteredItems.map((i) => i.label);
    const filteredColors = filteredItems.map((i) => i.color);

    this.barChartData = {
      labels: filteredLabels,
      datasets: [
        {
          data: filteredData,
          backgroundColor: filteredColors,
          borderWidth: 1.5,
          borderColor: '#0f172a', // deep navy border between doughnut segments
          hoverOffset: 8,
        },
      ],
    };

    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#cbd5e1',
            font: {
              family: 'Inter, sans-serif',
              size: 12,
            },
            padding: 16,
          },
        },
        title: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          bodyFont: {
            family: 'Inter, sans-serif',
          },
          callbacks: {
            label: (context: any) => {
              const label = context.label || '';
              const value = (context.raw as number) || 0;
              const total = context.dataset.data.reduce(
                (acc: number, val: any) => acc + val,
                0,
              );
              const percentage =
                total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
              return ` ${label}: ${value.toFixed(2)}${this.currencySymbol()} (${percentage}%)`;
            },
          },
        },
      },
    } as any;
  }

  calcByDay() {
    this.barChartType = 'bar';

    const datasets = (this.data().data as any[]) || [];
    // Style stacked bar datasets with roundness and thickness limits
    const styledDatasets = datasets.map((ds) => ({
      ...ds,
      borderRadius: 6,
      maxBarThickness: 28,
    }));

    this.barChartData = {
      labels: this.data().labels.map((date) => {
        const d = new Date(date);
        return d.toLocaleDateString('ES', { weekday: 'short', day: 'numeric' });
      }),
      datasets: styledDatasets,
    };

    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          },
          ticks: {
            color: '#94a3b8',
            font: {
              family: 'Inter, sans-serif',
              size: 11,
            },
          },
          border: {
            color: 'rgba(255, 255, 255, 0.1)',
          },
        },
        y: {
          stacked: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
          },
          ticks: {
            color: '#94a3b8',
            font: {
              family: 'Inter, sans-serif',
              size: 11,
            },
            callback: (value: any) => `${value}${this.currencySymbol()}`,
          },
          border: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#cbd5e1',
            font: {
              family: 'Inter, sans-serif',
              size: 11,
            },
            padding: 16,
          },
        },
        title: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          padding: 12,
          bodyFont: {
            family: 'Inter, sans-serif',
          },
          callbacks: {
            label: (context: any) => {
              const datasetLabel = context.dataset.label || '';
              const value = (context.raw as number) || 0;
              if (value === 0) return '';
              return ` ${datasetLabel}: ${value.toFixed(2)}${this.currencySymbol()}`;
            },
          },
        },
      },
    } as any;
  }
}
