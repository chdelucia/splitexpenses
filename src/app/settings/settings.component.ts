import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {
  inputValue = ''
  constructor() { }

  ngOnInit(): void {
  }

  copyData(){
    let data = localStorage.getItem(environment.localStorageExpenses) || '';
    navigator.clipboard.writeText(data);
  }

  loadData(data: string) {
    localStorage.setItem(environment.localStorageExpenses, data);
  }

  download(text:string) {
    console.log(text);
    let textFile;
    let expenses = localStorage.getItem(environment.localStorageExpenses) || '';
    var data = new Blob([expenses], {type: 'text/plain'});
    textFile = window.URL.createObjectURL(data);

    var link = document.getElementById('downloadlink') as HTMLAnchorElement;
    link.href = textFile;
    link.download = text;
    link.click();

    return textFile;
  };

}
