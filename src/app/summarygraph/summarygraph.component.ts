import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild  } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-summarygraph',
  templateUrl: './summarygraph.component.html',
  styleUrls: ['./summarygraph.component.less']
})
export class SummarygraphComponent implements OnInit, OnChanges {
  @Input() bytype: string = 'false';
  @Input() data: { labels: Array<string>, data: Array<any>} = {'labels':[''], 'data': [] };

  filter: string = '';

  bgColors = [
    'rgba(255, 99, 132, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 205, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(201, 203, 207, 1)'
  ]
  
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if(this.bytype === 'ByType'){
      this.calcByType();
    } else if(this.bytype === 'weather'){
      this.weatherChart();
    }
    else {
      this.calcByDay();
    }
    this.chart?.update();
  }

  ngOnInit(): void {
    if(this.bytype === 'ByType'){
      this.calcByType();
    } else if(this.bytype === 'weather'){
      this.weatherChart();
    }
    else {
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
        stacked: true
      }
    },
    plugins: {
      tooltip:{
      },
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '',
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
  ];

  barChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      { data: [], 
        label: '',
        borderColor: 'yellow',
        backgroundColor: [
          'rgba(222,225,38,0.68)',
        ]
      },
    ]
  };

  // events
  chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    if(this.bytype === 'true'){
      let data: any = active?.pop();
      console.log(data);
      if(data){
        let label = environment.expensesTypes[data.index];
        this.filter = label;
      } else {
        this.filter = '';
      }
    }

  }

  chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    //console.log(event, active);
  }

  calcByType(userId?: string){
    this.barChartData.datasets[0].label = '';
    if(this.barChartOptions?.plugins?.title) {
      this.barChartOptions.plugins.title.text = $localize `Gasto acumulado por tipo`;
    }
    this.barChartData.datasets[0].backgroundColor = this.bgColors;

    this.barChartData.datasets[0].data = this.data.data;
    this.barChartData.labels = this.data.labels;
  }

  calcByDay(){
    if(this.barChartOptions?.plugins?.title){
      this.barChartOptions.plugins.title.text = $localize `Gasto diario`;
    } 

    this.barChartData.datasets = this.data.data;
    //this.barChartData.datasets[0].data = this.expensesService.getTotalCostEachDay().x;

    //change Y-axis to the lang
    this.barChartData.labels = this.data.labels.map( date => {
        let d = new Date(date);
        return d.toLocaleDateString('ES', { weekday: 'short', day: 'numeric' })
    })
  }

  weatherChart(){
    let labels = this.data.labels;
    let data = this.data.data;
    this.barChartData.labels = labels;
    this.barChartType = 'line';

    this.barChartData.datasets[0].data = data;
    this.barChartData.datasets[0].fill = true;
    if (this.barChartOptions?.scales && this.barChartOptions.scales['y']) {
      //this.barChartOptions.scales['y'].min = 10
      this.barChartOptions.scales['y'].max = 35
    }
    if(this.barChartOptions?.plugins?.title) {
      this.barChartOptions.plugins.title.text = $localize `Previsión`;
    }
  }

}
