import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../shared/localstorage.service';
import { Settings } from '../shared/models';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {
 
  constructor() { }

  ngOnInit(): void {
  }



}
