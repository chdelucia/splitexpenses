export interface User {
    id: number;
    name: string;
}

export interface Expense {
    title: string;
    date: string;
    cost: number;
    originalCost: number;
    paidBy: string;
    id: string;
    type: string;
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
    travels?: string
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

export interface WeatherPlugin {
    city: string;
    active: boolean;
    key?: string
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