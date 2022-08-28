import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from 'src/app/shared/localstorage.service';
import { Settings } from 'src/app/shared/models';

@Component({
  selector: 'app-settings-upload',
  templateUrl: './settings-upload.component.html',
  styleUrls: ['./settings-upload.component.less']
})
export class SettingsUploadComponent implements OnInit {

  showAlert = false;
  isError = false;
  inputLoadData = '';
  settings: Settings;

  constructor(
    private localStorageService: LocalstorageService,
    ) { 
    this.settings = this.localStorageService.getSettings();
  }

  ngOnInit(): void {
  }

  loadData(data: string) {
    let name = this.localStorageService.getActiveTravelName();
    localStorage.setItem(name, data);
    this.showAlert = true;
  }

  close(){
    this.showAlert = false;
  }
}
