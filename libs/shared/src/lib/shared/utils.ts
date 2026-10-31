import { MatSnackBar } from '@angular/material/snack-bar';

export function calcNextID(data: Record<string, unknown>): string {
  const lastId = Object.keys(data).pop() || '0';
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

export function getCategoryIcon(typeId: number): string {
  const icons: Record<number, string> = {
    0: 'sports_esports',
    1: 'restaurant',
    2: 'directions_car',
    3: 'local_bar',
    4: 'museum',
    5: 'hotel',
    6: 'card_giftcard',
    7: 'more_horiz',
  };
  return icons[typeId] || 'more_horiz';
}
