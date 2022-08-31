export interface User {
    id: string;
    name: string;
    phone?: string;
}

export interface Expense {
    id: string;
    title: string;
    date: string;
    cost: number;
    originalCost: number;
    paidBy: string;
    typeId: string;
    name: string;
    sharedBy: Array<string>;
    settleBy: Array<string>;

}

export interface IndividualDebt {
    newDebt?: number;
    individualTotalDebts: number,
    RefDebtsIds: Array<Expense>,
}

export interface Debt {
    totalDebts: number,
    debts: Map<string, IndividualDebt>
}

export interface StorageData {
    users: string
    expenses: string,
    name: string,
    currency: CurrencyPlugin
}

export interface Travel {
    names: Array<string>
    active: string
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
    weather: WeatherPlugin,
    travels: Travel,
    graph: GraphPlugin
}

export interface GraphPlugin {
    types: Map<string, ExpenseTypes>;
    bgColors: Array<string>;
}

export interface ExpenseTypes {
    id: string;
    name: string;
    active: boolean
}

export interface CurrencyPlugin {
    currencySymbol: string,
    currencyExchangeSymbol?: string,
    exchangeValue: number,
    active: boolean
}

export interface WeatherPlugin {
    city: string;
    active: boolean;
    key: string
}

export interface Datagraph {
    title: '',
    icon: '',
    data: [],
    min: '',
    max: '',
    description: [],
    icons: [],
    wind: [],
    humidity: [],
    labels: []
}