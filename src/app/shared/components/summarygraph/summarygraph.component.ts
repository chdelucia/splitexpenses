import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';

@Component({
  selector: 'app-summarygraph',
  templateUrl: './summarygraph.component.html',
  styleUrls: ['./summarygraph.component.scss'],
})
export class SummarygraphComponent implements OnInit, OnChanges {
  @Input() bytype: string = 'false';
  @Input() data: { labels: Array<string>; data: Array<any> } = {
    labels: [''],
    data: [],
  };

  filter: string = '';
  settings;

  constructor(private storageService: LocalstorageService) {
    this.settings = this.storageService.getSettings();
  }

  ngOnChanges(): void {
    if (this.bytype === 'ByType') {
      this.calcByType();
    } else if (this.bytype === 'weather') {
      this.weatherChart();
    } else {
      this.calcByDay();
    }
    this.chart?.update();
  }

  ngOnInit(): void {
    if (this.bytype === 'ByType') {
      this.calcByType();
    } else if (this.bytype === 'weather') {
      this.weatherChart();
    } else {
      this.calcByDay();
    }
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
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
        display: true,
        text: '',
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [];

  barChartData: ChartData<'line'> = {
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
    this.barChartData.datasets[0].label = '';
    if (this.barChartOptions?.plugins?.title) {
      this.barChartOptions.plugins.title.text = $localize`Gasto acumulado por tipo`;
    }
    this.barChartData.datasets[0].backgroundColor =
      this.settings.graph.bgColors;

    this.barChartData.datasets[0].data = this.data.data;
    this.barChartData.labels = this.data.labels;
  }

  calcByDay() {
    if (this.barChartOptions?.plugins?.title) {
      this.barChartOptions.plugins.title.text = $localize`Gasto diario`;
    }

    this.barChartData.datasets = this.data.data;
    //this.barChartData.datasets[0].data = this.expensesService.getTotalCostEachDay().x;

    //change Y-axis to the lang
    this.barChartData.labels = this.data.labels.map((date) => {
      const d = new Date(date);
      return d.toLocaleDateString('ES', { weekday: 'short', day: 'numeric' });
    });
  }

  weatherChart() {
    this.barChartData.labels = this.data.labels;
    this.barChartType = 'line';

    this.barChartData.datasets[0].data = this.data.data;
    this.barChartData.datasets[0].fill = true;
    if (this.barChartOptions?.scales && this.barChartOptions.scales['y']) {
      //this.barChartOptions.scales['y'].min = 10
      this.barChartOptions.scales['y'].max = 35;
    }
    if (this.barChartOptions?.plugins?.title) {
      this.barChartOptions.plugins.title.text = $localize`Previsión`;
    }
  }
}
