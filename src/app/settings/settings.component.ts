import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  copyData(){
    let data = localStorage.getItem(environment.localStorageExpenses) || '';
    navigator.clipboard.writeText(data);
  }

  loadData(data: string) {
    let users = ['Vane', 'Jess']
    localStorage.setItem(environment.localStorageExpenses, data);
    localStorage.setItem(environment.localStorageUsers, JSON.stringify(users))
  }

}
