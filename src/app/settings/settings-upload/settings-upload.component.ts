import { Component, inject, signal } from '@angular/core';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { Settings } from '@shared/models';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-upload',
  templateUrl: './settings-upload.component.html',
  styleUrls: ['./settings-upload.component.scss'],
  standalone: true,
  imports: [FormsModule],
})
export class SettingsUploadComponent {
  private localStorageService = inject(LocalstorageService);

  showAlert = signal(false);
  isError = signal(false);
  inputLoadData = signal('');
  settings: Settings;

  constructor() {
    this.settings = this.localStorageService.getSettings();
  }

  loadData(data: string) {
    const name = this.localStorageService.getActiveTravelName();
    localStorage.setItem(name, data);
    this.showAlert.set(true);
    location.reload();
  }

  deleteAll() {
    localStorage.clear();
    this.showAlert.set(true);
    location.reload();
  }

  close() {
    this.showAlert.set(false);
  }
}
