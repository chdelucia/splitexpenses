export interface CurrencyPlugin {
  currencySymbol: string;
  currencyExchangeSymbol?: string;
  exchangeValue: number;
  active: boolean;
}
