import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from 'src/app/shared/localstorage.service';
import { ExpenseTypes, Settings } from 'src/app/shared/models';
import { convertMaptoString } from 'src/app/shared/utils';

@Component({
  selector: 'app-settings-graph',
  templateUrl: './settings-graph.component.html',
  styleUrls: ['./settings-graph.component.less']
})
export class SettingsGraphComponent implements OnInit {
  showAlert = false;
  isError = false;
  settings: Settings;
  types: ExpenseTypes[]
  constructor(private localStorageService: LocalstorageService) {
    this.settings = this.localStorageService.getSettings();
    this.types = Array.from(this.settings.graph.types.values());
  }

  ngOnInit(): void {
  }

  trackByIdx(index: number, obj: any): any {
    return index;
  }

  onSubmit() {
    let types = new Map();
    this.types.forEach( (type,i) => {
      types.set(i, {'id': i, 'name': type, 'active': true})
    });

    let obj = {
      'graph': {
        'bgColors': this.settings.graph.bgColors,
        'active': true,
        'types': types
      }
    }

    this.localStorageService.saveSettings(obj);

    this.showAlert = true;
  }

  close(){
    this.showAlert = false;
  }

}
