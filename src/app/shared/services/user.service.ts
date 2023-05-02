import { Injectable } from "@angular/core";
import { Database, DataSnapshot, get, ref, set, update } from '@angular/fire/database';
import { User } from "../models/user";
import { AuthService } from "./auth.service";
import { remove } from "firebase/database";

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private dbBasePath: string = '/users/';
    private dbPath: string = '';

    constructor(private db: Database, private auth: AuthService) { }

    setPath(url ?: string) {
        let uid = localStorage.getItem("sigma-uid");
        this.dbPath = this.dbBasePath + uid;
        if (url !== undefined) {
            this.dbPath = this.dbPath + url;
        } 
    }

    createUser() {
        let user: User = new User();
        user.uid = this.auth.currentUser?.uid ? this.auth.currentUser.uid : "";
        user.name = this.auth.currentUser?.displayName ? this.auth.currentUser.displayName : "";
        this.setPath();
        set(ref(this.db, this.dbPath), user);
    }

    getUser(): Promise<DataSnapshot> {
        this.setPath();
        const dbRef = ref(this.db, this.dbPath);
        return get(dbRef);
    }

    updateSigma(newSigma: number | null) {
        this.setPath();
        update(ref(this.db, this.dbPath), {
            sigma: newSigma
        });
    }
    
    addFriend(friend: User) {
        this.setPath("/friends/" + friend.uid);
        set(ref(this.db, this.dbPath), friend.name);
    }

    removeFriend(friend: User) {
        this.setPath("/friends/" + friend.uid);
        remove(ref(this.db, this.dbPath));
    }
}
