import { computed, inject, Injectable, Signal } from '@angular/core';
import { calcNextID } from '@shared/utils';
import { UserStore } from '@state/user/user.store';
import { LocalstorageService } from '@shared/services/localstorage/localstorage.service';
import { User } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private storageService = inject(LocalstorageService);
  private userStore = inject(UserStore);

  users = this.userStore.users;
  iterableUsers = this.userStore.iterableUsers;

  constructor() {
    const users = this.loadUsersFromLocalStorage();
    this.userStore.addUsers(users);
  }

  getUsers(): Signal<Record<string, User>> {
    return this.userStore.users;
  }

  getUserByID(id: string): Signal<User | undefined> {
    return computed(() => this.userStore.users()[id]);
  }

  getIterableUsers(): Signal<Array<User>> {
    return this.userStore.iterableUsers;
  }

  getNumberOfUser(): Signal<number> {
    return this.userStore.userCount;
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

  async saveUsersIntoLocalStorage(): Promise<void> {
    const users = this.users();
    this.storageService.saveDataToLocalStorage(users);
  }

  checkIfNameExist(name: string): boolean {
    return this.userStore.iterableUsers().some((user: User) => user.name === name);
  }
}