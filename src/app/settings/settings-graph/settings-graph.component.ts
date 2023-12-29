import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../../shared/localstorage.service';
import { ExpenseTypes, Settings } from '../../shared/models';
import { convertMaptoString } from '../../shared/utils';

@Component({
  selector: 'app-settings-graph',
  templateUrl: './settings-graph.component.html',
  styleUrls: ['./settings-graph.component.scss']
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
      types.set(i, {'id': i, 'name': type.name, 'active': true})
    });

    //TODO ugly way to dont touch original object
    let obj = {
      'graph': {
        'bgColors': this.settings.graph.bgColors,
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
