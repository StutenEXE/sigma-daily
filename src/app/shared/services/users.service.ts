import { Injectable } from "@angular/core";
import { Database, DataSnapshot, get, ref } from '@angular/fire/database';

@Injectable({
    providedIn: 'root',
})
export class UsersService {
  private dbBasePath: string = '/users/';
  private dbPath: string = '';

  constructor(private db: Database) { }

  setPath(url?: string) {
    this.dbPath = this.dbBasePath;
    if (url !== undefined) {
      this.dbPath = this.dbPath + url;
    }
  }

  getAllUsers(): Promise<DataSnapshot> {
    this.setPath();
    const dbRef = ref(this.db, this.dbPath);
    return get(dbRef);
  }
}
