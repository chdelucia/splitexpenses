import { computed, inject, Injectable, Injector } from '@angular/core';
import { calcNextID } from '@shared/utils';
import { UserStore } from '@state/user/user.store';
import { Observable } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { User } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private storageService = inject(LocalstorageService);
  private userStore = inject(UserStore);
  private injector = inject(Injector);

  users = this.userStore.users;
  iterableUsers = this.userStore.iterableUsers;

  constructor() {
    const users = this.loadUsersFromLocalStorage();
    this.userStore.addUsers(users);
  }

  getUsers(): Observable<Record<string, User>> {
    return toObservable(this.userStore.users, { injector: this.injector });
  }

  getUserByID(id: string): Observable<User | undefined> {
    return toObservable(computed(() => this.userStore.users()[id]), {
      injector: this.injector,
    });
  }

  getIterableUsers(): Observable<Array<User>> {
    return toObservable(this.userStore.iterableUsers, {
      injector: this.injector,
    });
  }

  getNumberOfUser(): Observable<number> {
    return toObservable(this.userStore.userCount, { injector: this.injector });
  }

  editUser(user: User): void {
    this.userStore.updateUser(user);
    this.saveUsersIntoLocalStorage();
  }

  async addUser(user: User): Promise<void> {
    const users = this.users();
    user.id = calcNextID(users);
    this.userStore.addUser(user);
    this.saveUsersIntoLocalStorage();
  }

  removeUser(id: string): void {
    this.userStore.removeUser(id);
    this.saveUsersIntoLocalStorage();
  }

  init(): void {
    const users = this.loadUsersFromLocalStorage();
    this.userStore.addUsers(users);
  }

  loadUsersFromLocalStorage(): Record<string, User> {
    const ans = this.storageService.getData().users;
    return ans || {};
  }

  //TODO import module to auto sync store and localstore
  async saveUsersIntoLocalStorage(): Promise<void> {
    const users = this.users();
    this.storageService.saveDataToLocalStorage(users);
  }

  checkIfNameExist(name: string): Observable<boolean> {
    return toObservable(
      computed(() =>
        this.userStore.iterableUsers().some((user: User) => user.name === name),
      ),
      { injector: this.injector },
    );
  }
}
