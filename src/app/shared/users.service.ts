import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users: Array<string>
  
  constructor(private storageService: LocalstorageService) { 
    this.users = this.loadUsersFromLocalStorage();
  }

  getUsers(): Array<string> {
    return this.users;
  }

  addUser(user: string): void {
    this.users.push(user);
    this.saveUsersIntoLocalStorage();
  }

  removeUser(user: string): void {
    let index = this.users.indexOf(user);
    this.users.splice(index, 1);
    this.saveUsersIntoLocalStorage();
  }

  loadUsersFromLocalStorage():Array<string> {
    const ans = this.storageService.getData().users || '';
    let users = ans ? JSON.parse(ans) : [];
    return users;
  }

  saveUsersIntoLocalStorage():void {
    this.storageService.saveDataToLocalStorage(this.users)
  }

  checkIfNameExist(name: string): boolean{
    let index = this.users.indexOf(name);
    let result = false;
    if(index >= 0) {
      result = true;
    }
    return result;
  }

}
