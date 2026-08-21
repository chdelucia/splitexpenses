import { Component, inject, signal } from '@angular/core';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { Settings } from '@shared/models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-upload',
  templateUrl: './settings-upload.component.html',
  styleUrls: ['./settings-upload.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class SettingsUploadComponent {
  private localStorageService = inject(LocalstorageService);

  showAlert = false;
  isError = false;
  inputLoadData = signal('');
  settings: Settings = this.localStorageService.getSettings();

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
