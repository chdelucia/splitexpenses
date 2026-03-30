import { Component, inject } from '@angular/core';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-settings-upload',
  templateUrl: './settings-upload.component.html',
  styleUrls: ['./settings-upload.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
})
export class SettingsUploadComponent {
  private localStorageService = inject(LocalstorageService);
  showAlert = false;
  isError = false;
  inputLoadData = '';
  settings = this.localStorageService.getSettings();

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
