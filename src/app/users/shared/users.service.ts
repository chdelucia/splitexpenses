import { Injectable } from '@angular/core';
import { calcNextID, convertStringToMap } from 'src/app/shared/utils';
import { Store } from '@ngrx/store';
import { selectUsers, selectUserByID, selectIterableUsers, checkIfNameExist, selectUserCount } from 'src/app/state/user/user.selectors';
import { firstValueFrom, Observable } from 'rxjs';
import { addUser, addUsers, removeUser, updateUser } from 'src/app/state/user/user.actions';
import { LocalstorageService } from 'src/app/shared/localstorage.service';
import { User } from 'src/app/shared/models';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users$: Observable<Map<string, User>> = this.store.select(selectUsers);
  iterableUsers$: Observable<Array<User>> = this.store.select(selectIterableUsers);

  constructor(
    private storageService: LocalstorageService,
    private store: Store
    ) {
    const users = this.loadUsersFromLocalStorage();
    this.store.dispatch(addUsers({ users: users }))
  }

  getUsers(): Observable<Map<string, User>> {
    return this.store.select(selectUsers);
  }

  getUserByID(id: string):Observable<User | undefined> {
    return this.store.select(selectUserByID(id));
  }

  getIterableUsers(): Observable<Array<User>> {
    return this.store.select(selectIterableUsers);
  }

  getNumberOfUser(): Observable<number>{
    return this.store.select(selectUserCount);
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

  //TODO import module to auto sync store and localstore
  async saveUsersIntoLocalStorage(): Promise<void> {
    let users = await firstValueFrom(this.users$)
    this.storageService.saveDataToLocalStorage(users)
  }

  checkIfNameExist(name: string): Observable<boolean>{
    return this.store.select(checkIfNameExist(name));
  }


}
