import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-graph',
  templateUrl: './settings-graph.component.html',
  styleUrls: ['./settings-graph.component.less']
})
export class SettingsGraphComponent implements OnInit {
  showAlert = false;
  isError = false;
  constructor() { }

  ngOnInit(): void {
  }
  
  close(){
    this.showAlert = false;
  }

}
