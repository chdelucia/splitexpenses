import { Injectable, inject } from '@angular/core';
import { calcNextID } from '@shared/utils';
import { Store } from '@ngrx/store';
import {
  selectUsers,
  selectUserByID,
  selectIterableUsers,
  selectUserByName,
  selectUserCount,
} from '@state/user/user.selectors';
import { map, Observable, switchMap, take, of } from 'rxjs';
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
  private storageService = inject(LocalstorageService);
  private store = inject(Store);

  users$: Observable<Record<string, User>> = this.store.select(selectUsers);
  iterableUsers$: Observable<Array<User>> =
    this.store.select(selectIterableUsers);

  constructor() {
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

  addUser(userName: string): Observable<boolean> {
    return this.checkIfNameExist(userName).pipe(
        take(1),
        switchMap(exists => {
            if (exists) return of(false);

            return this.users$.pipe(
                take(1),
                map(users => {
                    const id = calcNextID(users);
                    const user: User = { id, name: userName };
                    this.store.dispatch(addUser({ user }));
                    this.saveUsersIntoLocalStorage();
                    return true;
                })
            );
        })
    );
  }

  deleteUser(id: string): void {
    this.store.dispatch(removeUser({ id }));
    this.saveUsersIntoLocalStorage();
  }

  loadUsersFromLocalStorage(): Record<string, User> {
    const ans = this.storageService.getData().users;
    return ans || {};
  }

  private saveUsersIntoLocalStorage(): void {
    this.users$.pipe(take(1)).subscribe(users => {
        this.storageService.saveDataToLocalStorage(users);
    });
  }

  checkIfNameExist(name: string): Observable<boolean> {
    return this.store.select(selectUserByName(name));
  }
}
