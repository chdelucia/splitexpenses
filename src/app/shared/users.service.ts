import { Injectable } from '@angular/core';
import { LocalstorageService } from './localstorage.service';
import { User } from './models';
import { calcNextID, convertStringToMap } from './utils';
import { Store } from '@ngrx/store';
import { addUser, removeUser, updateUser, addUsers } from '../state/user/user.actions';
import { selectUsers, selectUserByID, selectIterableUsers } from '../state/user/user.selectors';
import { firstValueFrom, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users: Map<string, User>
  users$: Observable<Map<string, User>> = this.store.select(selectUsers);
  iterableUsers$: Observable<Array<User>> = this.store.select(selectIterableUsers);

  constructor(
    private storageService: LocalstorageService,
    private store: Store
    ) {
    this.users = this.loadUsersFromLocalStorage();
    this.store.dispatch(addUsers({ users: this.users }))
  }

  getUsers(): Observable<Map<string, User>> {
    return this.users$;
  }

  getUserByID(id: string):Observable<User | undefined> {
    return this.store.select(selectUserByID(id));
  }

  getIterableUsers(): Observable<Array<User>> {
    return this.store.select(selectIterableUsers);
  }

  editUser(user: User): void {
    this.store.dispatch(updateUser({ user }));
    this.saveUsersIntoLocalStorage();
  }

  async addUser(user: User): Promise<void> {
    let users = await firstValueFrom(this.users$)
    user.id = calcNextID(users);
    this.store.dispatch(addUser({ user }));
    this.saveUsersIntoLocalStorage();
  }

  removeUser(id: string): void {
    this.store.dispatch(removeUser({ id }));
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
