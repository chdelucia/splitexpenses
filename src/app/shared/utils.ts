import { MatSnackBar } from '@angular/material/snack-bar';

export function convertStringToMap<T>(data: Record<string, T>): Map<string, T> {
  const map = new Map(Object.entries(data));
  return map;
}

export function convertMaptoString<T>(map: Map<string, T>): Record<string, T> {
  const obj = Object.fromEntries(map);

  return obj;
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
