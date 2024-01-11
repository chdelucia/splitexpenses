import { Component } from '@angular/core';
import { LocalstorageService } from '../../shared/localstorage.service';
import { Settings } from '../../shared/models';

@Component({
  selector: 'app-settings-backup',
  templateUrl: './settings-backup.component.html',
  styleUrls: ['./settings-backup.component.scss'],
})
export class SettingsBackupComponent {
  showAlert = false;
  isError = false;
  settings: Settings;
  travels: string[] = [];

  constructor(private localStorageService: LocalstorageService) {
    this.settings = this.localStorageService.getSettings();
    this.travels = this.settings.travels.names;
  }

  copyData() {
    const name = this.localStorageService.getActiveTravelName();
    const data = localStorage.getItem(name) || '';
    navigator.clipboard.writeText(data);
    this.showAlert = true;
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
    this.showAlert = false;
  }
}
