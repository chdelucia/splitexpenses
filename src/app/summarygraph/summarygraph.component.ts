import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild  } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { environment } from 'src/environments/environment';
import { CurrencyService } from '../shared/currency.service';
import { ExpensesService } from '../shared/expenses.service';
import { CurrencyPlugin, Expense } from '../shared/models';
import { UsersService } from '../shared/users.service';

@Component({
  selector: 'app-summarygraph',
  templateUrl: './summarygraph.component.html',
  styleUrls: ['./summarygraph.component.less']
})
export class SummarygraphComponent implements OnInit, OnChanges {
  @Input() bytype: string = 'false';
  @Input() data?: any = [];

  currency: CurrencyPlugin;
  filter: string = '';
  expenses: Map<string, Expense>
  meanCost: number = 0;
  todayCost: number = 0;
  bgColors = [
    'rgba(255, 99, 132, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 205, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(201, 203, 207, 1)'
  ]
  

  constructor(
    private expensesService: ExpensesService, 
    private userService: UsersService,
    private currencyService: CurrencyService
    ) {
    this.expenses = expensesService.getExpenses();
    this.currency = this.currencyService.getCurrencySettings();
   }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.bytype === 'weather'){
      this.weatherChart();
      this.chart?.update();
    }
  }

  ngOnInit(): void {
    if(this.bytype === 'true'){
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
    labels: environment.expensesTypes,
    datasets: [
      { data: [  ], 
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

  calcByType(){
    this.barChartData.datasets[0].label = '';

    if(this.barChartOptions?.plugins?.title) {
      this.barChartOptions.plugins.title.text = $localize `Gasto acumulado por tipo`;
    }
    
    this.barChartData.datasets[0].backgroundColor = this.bgColors;
    let data: Array<number> = [0,0,0,0,0,0,0,0];

    this.expenses.forEach( item => {
      let index = environment.expensesTypes.indexOf(item.type);
      data[index] =  data[index] + item.originalCost;
    })

    this.barChartData.datasets[0].data = data;
  }


  calcByDay(){
    if(this.barChartOptions?.plugins?.title){
      this.barChartOptions.plugins.title.text = $localize `Gasto diario`;
    } 

    let a: Array<Expense> = []
    // Create Yaxis
    this.expenses.forEach( item => {
      a.push(item);
    })

    // Dia numemo : { Expense }
    // group by Day
    let result = a.reduce(function (r, a) {
        r[a.date] = r[a.date] || [];
        r[a.date].push(a);
        return r;
    }, Object.create(null));

    let yAxis = Object.keys(result);
    this.barChartData.labels = yAxis;


    // Create simple xAxis
    let xAxis: Array<number> = [];
    for(let i = 0; i < yAxis.length; i++) {
      xAxis[i] = 0;
      let name = yAxis[i];
      let obj: Array<Expense> = result[name];
      for ( const k in obj) {
        xAxis[i] += obj[k].originalCost
      }
    }

    // Create stacked xAxis
    let stackedxAxis: Array<{label:string,data:Array<number>,backgroundColor:string}> = []
    for(let i = 0; i < environment.expensesTypes.length; i++) {
      stackedxAxis[i] = {
        label: environment.expensesTypes[i],
        data: [],
        backgroundColor: this.bgColors[i]
     }
    }

    for(let i = 0; i < yAxis.length; i++) {
      let name = yAxis[i];
      let obj: Array<Expense> = result[name];
      for ( const k in obj) {
        const typeIndex = environment.expensesTypes.indexOf(obj[k].type);

        if(stackedxAxis[typeIndex].data[i] ) {
          stackedxAxis[typeIndex].data[i] += obj[k].originalCost
        } else{
          stackedxAxis[typeIndex].data[i] = obj[k].originalCost
        }
        
      }
    }

    this.barChartData.datasets = stackedxAxis;

    this.getMeanCostPerPersonDay(xAxis);
  }

  getMeanCostPerPersonDay(data: Array<number>){
    const todayCost = data[data.length -1];
    const totalCost = data.reduce((partialSum, value) => partialSum + value, 0);
    const totalDays = this.barChartData.labels?.length || 1;

    const meanCostPerDay = totalCost / totalDays
    const users = this.userService.getUsers().size;

    this.todayCost = todayCost / users;
    this.meanCost = meanCostPerDay / users
  }

  weatherChart(){

    let labels = this.data.labels;
    let data = this.data.data;
    this.barChartData.labels = labels;
    this.barChartType = 'line';

    this.barChartData.datasets[0].data = data;
    this.barChartData.datasets[0].fill = true;
    if (this.barChartOptions?.scales && this.barChartOptions.scales['y']) {
      this.barChartOptions.scales['y'].min = 10
      this.barChartOptions.scales['y'].max = 35
    }
    if(this.barChartOptions?.plugins?.title) {
      this.barChartOptions.plugins.title.text = $localize `Previsión`;
    }
  }

}
