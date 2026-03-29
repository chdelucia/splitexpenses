import { Injectable } from '@angular/core';
import { calcNextID } from '@shared/utils';
import { Store } from '@ngrx/store';
import {
  selectUsers,
  selectUserByID,
  selectIterableUsers,
  selectUserByName,
  selectUserCount,
} from '@state/user/user.selectors';
import { firstValueFrom, Observable } from 'rxjs';
import {
  addUser,
  addUsers,
  removeUser,
  updateUser,
} from '@state/user/user.actions';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { User } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  users$: Observable<Record<string, User>> = this.store.select(selectUsers);
  iterableUsers$: Observable<Array<User>> =
    this.store.select(selectIterableUsers);

  constructor(
    private storageService: LocalstorageService,
    private store: Store,
  ) {
    const users = this.loadUsersFromLocalStorage();
    this.store.dispatch(addUsers({ users: users }));
  }

  getUsers(): Observable<Record<string, User>> {
    return this.store.select(selectUsers);
  }

  getUserByID(id: string): Observable<User | undefined> {
    return this.store.select(selectUserByID(id));
  }

  getIterableUsers(): Observable<Array<User>> {
    return this.store.select(selectIterableUsers);
  }

  getNumberOfUser(): Observable<number> {
    return this.store.select(selectUserCount);
  }

  editUser(user: User): void {
    this.store.dispatch(updateUser({ user }));
    this.saveUsersIntoLocalStorage();
  }

  async addUser(user: User): Promise<void> {
    const users = await firstValueFrom(this.users$);
    user.id = calcNextID(users);
    this.store.dispatch(addUser({ user }));
    this.saveUsersIntoLocalStorage();
  }

  removeUser(id: string): void {
    this.store.dispatch(removeUser({ id }));
    this.saveUsersIntoLocalStorage();
  }

  loadUsersFromLocalStorage(): Record<string, User> {
    const ans = this.storageService.getData().users;
    return ans || {};
  }

  //TODO import module to auto sync store and localstore
  async saveUsersIntoLocalStorage(): Promise<void> {
    const users = await firstValueFrom(this.users$);
    this.storageService.saveDataToLocalStorage(users);
  }

  checkIfNameExist(name: string): Observable<boolean> {
    return this.store.select(selectUserByName(name));
  }
}
