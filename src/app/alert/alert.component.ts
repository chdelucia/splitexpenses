import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.less']
})
export class AlertComponent implements OnInit {
  @Input() show: boolean = false;
  @Input() alert: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
