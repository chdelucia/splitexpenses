import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from 'src/app/shared/localstorage.service';
import { Settings } from 'src/app/shared/models';

@Component({
  selector: 'app-settings-graph',
  templateUrl: './settings-graph.component.html',
  styleUrls: ['./settings-graph.component.less']
})
export class SettingsGraphComponent implements OnInit {
  showAlert = false;
  isError = false;
  settings: Settings;
  constructor(private localStorageService: LocalstorageService) {
    this.settings = this.localStorageService.getSettings();
  }

  ngOnInit(): void {
  }

  trackByIdx(index: number, obj: any): any {
    return index;
  }
  
  onSubmit() {
    this.localStorageService.saveSettings(this.settings);
  }
  close(){
    this.showAlert = false;
  }

}
