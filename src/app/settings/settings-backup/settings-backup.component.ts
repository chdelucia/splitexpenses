import { Component, inject } from '@angular/core';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-settings-backup',
  templateUrl: './settings-backup.component.html',
  styleUrls: ['./settings-backup.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule],
})
export class SettingsBackupComponent {
  private localStorageService = inject(LocalstorageService);

  showAlert = false;
  isError = false;
  settings = this.localStorageService.getSettings();
  travels = this.settings.travels.names;

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
