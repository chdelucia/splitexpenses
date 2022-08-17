import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users: Array<string>
  
  constructor() { 
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
    const ans = localStorage.getItem(environment.localStorageUsers) || '';
    let users = JSON.parse(ans);
    return users;
 
  }

  saveUsersIntoLocalStorage():void {
    localStorage.setItem(environment.localStorageUsers, JSON.stringify(this.users) );
  }

}
