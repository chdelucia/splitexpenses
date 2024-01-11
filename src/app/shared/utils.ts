import { MatSnackBar } from '@angular/material/snack-bar';

export function convertStringToMap(data: string): Map<string, any> {
  const obj = JSON.parse(data);
  const map = new Map(Object.entries(obj));
  return map;
}

export function convertMaptoString(map: Map<string, unknown>): string {
  const obj = Object.fromEntries(map);
  const jsonString = JSON.stringify(obj);

  return jsonString;
}

export function calcNextID(data: Map<string, unknown>): string {
  const lastId = Array.from(data.keys()).pop() || '0';
  const nextId = parseInt(lastId) + 1;
  return nextId.toString();
}

export function diffinDays(date1: string, date2: string): number {
  const d1 = new Date(date1).getTime();
  const d2 = new Date(date2).getTime();
  const diffTime = d2 - d1;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

export function openSnackBar(
  snackbar: MatSnackBar,
  style: string,
  msg: string,
) {
  snackbar.open(msg, 'Ok', {
    duration: 4000,
    panelClass: [`${style}-snackbar`],
  });
}

export enum globalToast {
  OK = 'OK',
  KO = 'KO',
  EXIST = 'EXIST',
}
