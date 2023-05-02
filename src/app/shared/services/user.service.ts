import { Injectable } from "@angular/core";
import { Database, DataSnapshot, get, ref, set, update } from '@angular/fire/database';
import { User } from "../models/user";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private dbBasePath: string = '/users/';
    private dbPath: string = '';

    constructor(private db: Database, private auth: AuthService) { }

    setPath() {
        let uid = localStorage.getItem("uid");
        this.dbPath = this.dbBasePath + uid;
    }

    createUser() {
        let user: User = new User();
        user.uid = this.auth.currentUser?.uid ? this.auth.currentUser.uid : "";
        user.name = this.auth.currentUser?.displayName ? this.auth.currentUser.displayName : "";
        user.sigma = null;
        this.setPath();
        console.log(this.dbPath);
        set(ref(this.db, this.dbPath), user);
    }

    getUser(): Promise<DataSnapshot> {
        this.setPath();
        const dbRef = ref(this.db, this.dbPath);
        return get(dbRef);
    }

    // Takes in the new number of coins
    updateSigma(newSigma: number) {
        update(ref(this.db, this.dbPath), {
            sigma: newSigma
        });
    }
}
