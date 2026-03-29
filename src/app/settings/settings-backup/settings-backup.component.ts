import { Component, inject, signal } from '@angular/core';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { Settings } from '@shared/models';

@Component({
  selector: 'app-settings-backup',
  templateUrl: './settings-backup.component.html',
  styleUrls: ['./settings-backup.component.scss'],
  standalone: true,
})
export class SettingsBackupComponent {
  private localStorageService = inject(LocalstorageService);

  showAlert = signal(false);
  isError = signal(false);
  settings: Settings;
  travels: string[] = [];

  constructor() {
    this.settings = this.localStorageService.getSettings();
    this.travels = this.settings.travels.names;
  }

  copyData() {
    const name = this.localStorageService.getActiveTravelName();
    const data = localStorage.getItem(name) || '';
    navigator.clipboard.writeText(data);
    this.showAlert.set(true);
  }

  download(text: string) {
    const name = this.localStorageService.getActiveTravelName();
    const expenses = localStorage.getItem(name) || '';
    const data = new Blob([expenses], { type: 'text/plain' });
    const textFile = window.URL.createObjectURL(data);

    const link = document.getElementById('downloadlink') as HTMLAnchorElement;
    link.href = textFile;
    link.download = text;
    link.click();

    return textFile;
  }

  close() {
    this.showAlert.set(false);
  }
}
