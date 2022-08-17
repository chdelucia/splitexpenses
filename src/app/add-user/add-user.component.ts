import { Component, OnInit } from '@angular/core';
import { UsersService } from '../shared/users.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.less']
})
export class AddUserComponent implements OnInit {
  inputValue = '';
  users: Array<string>
  constructor(private userService: UsersService) {
    this.users = this.userService.getUsers();
   }

  ngOnInit(): void {
  }

  clearInput():void {
    this.inputValue = '';
  }
  add(name: string) {
    this.userService.addUser(name);
    this.updateUsers();
  }

  delete(name: string) {
    this.userService.removeUser(name);
    this.updateUsers();
  }

  updateUsers(){
    this.users = this.userService.getUsers();
  }

}
