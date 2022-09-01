import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from 'src/app/shared/localstorage.service';
import { Settings } from 'src/app/shared/models';

@Component({
  selector: 'app-settings-backup',
  templateUrl: './settings-backup.component.html',
  styleUrls: ['./settings-backup.component.less']
})
export class SettingsBackupComponent implements OnInit {
  showAlert = false;
  isError = false;
  settings: Settings;

  constructor(
    private localStorageService: LocalstorageService,
    ) { 
    this.settings = this.localStorageService.getSettings();
  }

  ngOnInit(): void {
  }

  copyData(){
    let name = this.localStorageService.getActiveTravelName();
    let data = localStorage.getItem(name) || '';
    navigator.clipboard.writeText(data);
    this.showAlert = true;
  }

  download(text:string) {
    let name = this.localStorageService.getActiveTravelName();
    let textFile;
    let expenses = localStorage.getItem(name) || '';
    var data = new Blob([expenses], {type: 'text/plain'});
    textFile = window.URL.createObjectURL(data);

    var link = document.getElementById('downloadlink') as HTMLAnchorElement;
    link.href = textFile;
    link.download = text;
    link.click();

    return textFile;
  };

  close(){
    this.showAlert = false;
  }

}
