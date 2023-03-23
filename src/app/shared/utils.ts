import { MatSnackBar } from "@angular/material/snack-bar";

export function convertStringToMap(data:string): Map<any, any> {
  let obj = JSON.parse(data);
  let map = new Map(Object.entries(obj));
  return map;
}

export function convertMaptoString(map: Map<string, any>): string{
  let obj = Object.fromEntries(map);
  let jsonString = JSON.stringify(obj);
  return jsonString;
}

export function calcNextID(data: Map<any, any>): string{
    let lastId = Array.from(data.keys()).pop() || '0';
    let nextId = parseInt(lastId) + 1;
    return nextId.toString();
  }

export function round2decimals(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function diffinDays(date1: string, date2: string): number {
  const d1: any = new Date(date1);
  const d2: any = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays
}

export function openSnackBar(snackbar: MatSnackBar, style:string, msg: string) {
  snackbar.open(msg, 'Ok', {
    duration: 4000,
    panelClass: [`${style}-snackbar`]
  });
}


export enum globalToast {
  OK = 'OK',
  KO = 'KO',
  EXIST = 'EXIST'
}
