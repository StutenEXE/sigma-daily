import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  authState,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';
import { updateProfile, User } from 'firebase/auth';
import { from, Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  currentUser: User | null = null;

  constructor(private auth: Auth) { }

  login(email: string, password: string): Observable<any> {
    this.updateCurrentUser();
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  register(username: string, email: string, password: string) {
    this.updateCurrentUser();
    return from(createUserWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap(({ user }) => updateProfile(user, { displayName: username }))
    );
  }

  updateCurrentUser() {
    authState(this.auth).subscribe({
      next: (currUser) => {
        this.currentUser = currUser;
        localStorage.setItem("uid", this.currentUser?.uid ? this.currentUser.uid : "");
        console.log(`Current user : \n - ${this.currentUser?.displayName}\n - ${this.currentUser?.uid} `)
      }
    });
  }

  logout(): Observable<any> {
    this.currentUser = null;
    localStorage.clear();
    return from(this.auth.signOut());
  }
}