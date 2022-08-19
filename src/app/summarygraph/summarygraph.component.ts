import { Component, Input, OnInit, ViewChild  } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { environment } from 'src/environments/environment';
import { ExpensesService } from '../shared/expenses.service';
import { Expense } from '../shared/models';
import { UsersService } from '../shared/users.service';

//import DataLabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-summarygraph',
  templateUrl: './summarygraph.component.html',
  styleUrls: ['./summarygraph.component.less']
})
export class SummarygraphComponent implements OnInit {
  expenses: Map<string, Expense>
  meanCost: number = 0;
  @Input() bytype: boolean = false;

  constructor(private expensesService: ExpensesService, private userService: UsersService) {
    this.expenses = expensesService.getExpenses();
   }

  ngOnInit(): void {
    if(this.bytype){
      this.calcByType();
    } else {
      this.calcByDay();
    }
  }

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0
      }
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    //DataLabelsPlugin
  ];

  barChartData: ChartData<'bar'> = {
    labels: environment.expensesTypes,
    datasets: [
      { data: [  ], 
        label: 'Gasto diario',
        backgroundColor: [
          'rgba(75, 192, 192, 1)',
        ], 
      },
    ]
  };

  // events
  chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    console.log(event, active);
  }

  chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
    //console.log(event, active);
  }

  randomize(): void {
    // Only Change 3 values
    this.barChartData.datasets[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.round(Math.random() * 100),
      56,
      Math.round(Math.random() * 100),
      40 ];

    this.chart?.update();
  }

  calcByType(){
    this.barChartData.datasets[0].label = '';

    if(this.barChartOptions?.plugins?.legend?.display) {
      this.barChartOptions.plugins.legend.display = false;
    }
    
    this.barChartData.datasets[0].backgroundColor = [
      'rgba(255, 99, 132, 1)',
      'rgba(255, 159, 64, 1)',
      'rgba(255, 205, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(201, 203, 207, 1)'
    ]
    let data: Array<number> = [0,0,0,0,0,0,0,0];

    this.expenses.forEach( item => {
      let index = environment.expensesTypes.indexOf(item.type);
      data[index] =  data[index] + item.originalCost;
    })

    this.barChartData.datasets[0].data = data;
  }


  calcByDay(){
    let xAxis: Array<number> = [];
    let a: Array<Expense> = []
    
    // Create Yaxis
    this.expenses.forEach( item => {
      a.push(item);
    })
    let result = a.reduce(function (r, a) {
        r[a.date] = r[a.date] || [];
        r[a.date].push(a);
        return r;
    }, Object.create(null));
    let yAxis = Object.keys(result);
    this.barChartData.labels = yAxis;


    // Create xAxis
    for(let i = 0; i < yAxis.length; i++) {
      xAxis[i] = 0;
      let name = yAxis[i];
      let obj: Array<Expense> = result[name];
      for ( const k in obj) {
        xAxis[i] += obj[k].originalCost
      }
    }
    this.barChartData.datasets[0].data = xAxis;

    this.getMeanCostPerPersonDay();
  }

  getMeanCostPerPersonDay(){
    const totalCost = this.barChartData.datasets[0].data.reduce((partialSum, value) => partialSum + value, 0);
    const totalDays = this.barChartData.labels?.length || 1;

    const meanCostPerDay = totalCost / totalDays
    const users = this.userService.getUsers().length;

    this.meanCost = meanCostPerDay / users
  }

}
