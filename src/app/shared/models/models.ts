export interface ExpenseEntity {
  id: string;
  title: string;
  date: string;
  cost: number;
  originalCost: number;
  paidBy: string;
  typeId: string;
  sharedBy: Array<string>;
  settleBy: Array<string>;
}

export interface Travel {
  names: Array<string>;
  active: string;
}

export interface Coord {
  lon: number;
  lat: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Main {
  temp: number;
  pressure: number;
  humidity: number;
  temp_min: number;
  temp_max: number;
}

export interface Wind {
  speed: number;
  deg: number;
}

export interface Clouds {
  all: number;
}

export interface Sys {
  type: number;
  id: number;
  message: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface WeatherObject {
  coord: Coord;
  weather: Weather[];
  base: string;
  main: Main;
  visibility: number;
  wind: Wind;
  clouds: Clouds;
  dt: number;
  date: string;
  sys: Sys;
  id: number;
  name: string;
  cod: number;
  dt_txt: string;
}

export interface Settings {
  weather: WeatherPlugin;
  travels: Travel;
  graph: GraphPlugin;
}

export interface GraphPlugin {
  types: Map<string, ExpenseTypes>;
  bgColors: Array<string>;
}

export interface ExpenseTypes {
  id: string;
  name: string;
  active: boolean;
}

export interface WeatherPlugin {
  city: string;
  active: boolean;
  key: string;
}

export interface Datagraph {
  title: '';
  icon: '';
  data: [];
  min: '';
  max: '';
  description: [];
  icons: [];
  wind: [];
  humidity: [];
  labels: [];
}

export interface TraceAutoSettle {
  debtorId: string;
  lenderId: string;
  intermediaryId: string;
  debtorDebt: number;
  intermediaryDebtToDebtor: number;
  lenderDebtToIntermediary: number;
  amount: number;
  finalDebtorDebt?: number;
  finalLenderDebt?: number;
  finalIntermediaryDebt?: number;
}

export enum globalRoutes {
  welcome = 'welcome',
  debts = 'debts',
  users = 'users',
  forecast = 'forecast',
  stats = 'stats',
  settings = 'settings',
  expense = 'expense',
}
