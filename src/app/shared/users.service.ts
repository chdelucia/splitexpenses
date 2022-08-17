import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users: Array<string> = ['Vane', 'Jess', 'Chris'];
  
  constructor() { }

  getUsers(): Array<string> {
    return this.users;
  }

  setUsers(user: string) {
    this.users.push(user);
  }

}
