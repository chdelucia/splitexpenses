import { Component } from '@angular/core';
import { LocalstorageService } from '@shared/services/localstorage.service';
import { Settings } from '@shared/models';

@Component({
  selector: 'app-settings-upload',
  templateUrl: './settings-upload.component.html',
  styleUrls: ['./settings-upload.component.scss'],
})
export class SettingsUploadComponent {
  showAlert = false;
  isError = false;
  inputLoadData = '';
  settings: Settings;

  constructor(private localStorageService: LocalstorageService) {
    this.settings = this.localStorageService.getSettings();
  }

  loadData(data: string) {
    const name = this.localStorageService.getActiveTravelName();
    localStorage.setItem(name, data);
    this.showAlert = true;
    location.reload();
  }

  deleteAll() {
    localStorage.clear();
    this.showAlert = true;
    location.reload();
  }

  close() {
    this.showAlert = false;
  }
}
