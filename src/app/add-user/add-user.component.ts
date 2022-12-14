import { Component, OnInit } from '@angular/core';
import { DebtsService } from '../shared/debts.service';
import { User } from '../shared/models';
import { UsersService } from '../shared/users.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.less']
})
export class AddUserComponent implements OnInit {
  inputValue = '';
  inputPhone = '';
  users: Array<User>;
  showAlert = false;
  isError = false;

  constructor(
    private userService: UsersService,
    private debtsService: DebtsService
    ) {
    this.users = this.userService.getIterableUsers();
   }

  ngOnInit(): void {
  }

  clearInput():void {
    this.inputValue = '';
    this.inputPhone = '';
  }

  add(name: string, phone?: string) {
    if(this.userService.checkIfNameExist(name)){
      this.isError = true;
    } else {
      const user: User = {
        id: '',
        name: name,
        phone: phone || ''
      }
      this.isError = false;
      this.userService.addUser(user);
      this.updateUsers();
      this.clearInput();
    }
    this.debtsService.reset();
    this.showAlert = true;
  }

  edit(data: HTMLTableCellElement, key: string, fieldToEdit: string) {
    let newValue = data.innerText.trim();
    let user: any = this.userService.getUserByID(key);
    if(user && user.hasOwnProperty(fieldToEdit) && newValue){
        if(user[fieldToEdit] != newValue) {
          user[fieldToEdit] = newValue;
          this.userService.editUser(user);
          this.isError = false;
          this.showAlert = true;
        }
    } else {
      data.innerText = user[fieldToEdit] || '';
    }
  }

  delete(name: string) {
    this.userService.removeUser(name);
    this.updateUsers();
  }

  updateUsers(){
    this.users = this.userService.getIterableUsers();
  }

  close(){
    this.showAlert = false;
  }

}
