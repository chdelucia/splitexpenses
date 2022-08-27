import { Injectable, ɵpublishDefaultGlobalUtils } from '@angular/core';
import { LocalstorageService } from './localstorage.service';
import { User } from './models';
import { calcNextID, convertStringToMap } from './utils';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users: Map<string, User>
  
  constructor(private storageService: LocalstorageService) { 
    this.users = this.loadUsersFromLocalStorage();
  }

  getUsers(): Map<string, User> {
    return this.users;
  }

  getUserByID(key: string): User | undefined {
    return this.users.get(key);
  }

  getIterableUsers(): Array<User> {
    let users: Array<User> = [];
    this.users.forEach( (user: User) => {
     users.push(user);
    });
    return users;
  }

  editUser(user: User): void {
    this.users.set(user.id, user);
    this.saveUsersIntoLocalStorage();
  }

  addUser(user: User): void {
    user.id = calcNextID(this.users);
    this.users.set(user.id, user);
    this.saveUsersIntoLocalStorage();
  }

  removeUser(key: string): void {
    this.users.delete(key);
    this.saveUsersIntoLocalStorage();
  }

  loadUsersFromLocalStorage(): Map<string, User> {
    const ans = this.storageService.getData().users;
    let users = ans ? convertStringToMap(ans) :  new Map();
    return users;
  }

  saveUsersIntoLocalStorage():void {
    this.storageService.saveDataToLocalStorage(this.users)
  }

  checkIfNameExist(name: string): boolean{
    let result = false;
    this.users.forEach( user => {
      if(user.name === name){
        result = true;
      }
    })

    return result;
  }

  reset(){
    this.users = this.loadUsersFromLocalStorage();
  }

}
