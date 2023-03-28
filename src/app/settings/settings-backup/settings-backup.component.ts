import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { LocalstorageService } from 'src/app/shared/localstorage.service';
import { Settings } from 'src/app/shared/models';
import { convertStringToMap } from 'src/app/shared/utils';

@Component({
  selector: 'app-settings-backup',
  templateUrl: './settings-backup.component.html',
  styleUrls: ['./settings-backup.component.less']
})
export class SettingsBackupComponent implements OnInit {
  showAlert = false;
  isError = false;
  settings: Settings;
  travels: string[] = [];

  constructor(
    private localStorageService: LocalstorageService,
    ) { 
    this.settings = this.localStorageService.getSettings();
    this.travels = this.settings.travels.names;

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


  downloadExcel(text: string) {
    let name = text;
    let textFile;
    let obj: any = localStorage.getItem(name) || '';
    obj = JSON.parse(obj)
    var arrData = Array.from(convertStringToMap(obj.expenses).values())
    
    let CSV = 'sep=,' + '\r\n\n';

    let row = "";
    for (let index in arrData[0]) {  
      row += index + ',';
    }
    row = row.slice(0, -1);
        
    //append Label row with line break
    CSV += row + '\r\n';
   
    //1st loop is to extract each row
    for (let i = 0; i < arrData.length; i++) {
        let row = "";
        
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }
        row.slice(0, row.length - 1);
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {        
        alert("Invalid data");
        return;
    }   
    
    var fileName = name.replace(/ /g,"_");   
    
    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
    var link = document.getElementById('downloadlinkExcel') as HTMLAnchorElement;
    link.href = uri;
    link.download = fileName + ".csv";
    link.click();
  
}

  close(){
    this.showAlert = false;
  }

}
