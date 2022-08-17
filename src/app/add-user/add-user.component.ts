import { Component, OnInit } from '@angular/core';
import { UsersService } from '../shared/users.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.less']
})
export class AddUserComponent implements OnInit {
  inputValue = '';
  users: Array<string>;
  showAlert = false;
  isError = false;

  constructor(private userService: UsersService) {
    this.users = this.userService.getUsers();
   }

  ngOnInit(): void {
  }

  clearInput():void {
    this.inputValue = '';
  }
  add(name: string) {
    if(this.userService.checkIfNameExist(name)){
      this.isError = true;
    } else {
      this.isError = false;
      this.userService.addUser(name);
      this.updateUsers();
    }
    this.showAlert = true;
  }

  delete(name: string) {
    this.userService.removeUser(name);
    this.updateUsers();
  }

  updateUsers(){
    this.users = this.userService.getUsers();
  }

  close(){
    this.showAlert = false;
  }

}
