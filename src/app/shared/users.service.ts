import { Injectable, ɵpublishDefaultGlobalUtils } from '@angular/core';
import { LocalstorageService } from './localstorage.service';
import { User } from './models';
import { calcNextID, convertStringToMap } from './utils';
import { Store } from '@ngrx/store';
import { addUser, removeUser, updateUser, resetUsers, addUsers } from '../state/user/user.actions';
import { selectUsers, selectUserByID, selectIterableUsers } from '../state/user/user.selectors';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users: Map<string, User>

  constructor(
    private storageService: LocalstorageService,
    private store: Store
    ) {
    this.users = this.loadUsersFromLocalStorage();
    this.store.dispatch(addUsers({ users: this.users }))
  }

  getUsers(): Map<string, User> {
    return this.users;
  }

  getUserByID(key: string): User | undefined {
    return this.users.get(key);
  }

  getIterableUsers(): Array<User> {
    return Array.from(this.users.values());
  }

  editUser(user: User): void {
    this.users.set(user.id, user);
    this.store.dispatch(updateUser({ user }));
    this.saveUsersIntoLocalStorage();
  }

  addUser(user: User): void {
    user.id = calcNextID(this.users);
    this.users.set(user.id, user);
    this.store.dispatch(addUser({ user }));
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
    let users = Array.from(this.users.values());
    return users.find((user:User) => user.name === name) ? true : false;
  }

  reset(){
    this.users = this.loadUsersFromLocalStorage();
  }

}
