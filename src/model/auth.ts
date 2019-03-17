import { action, computed, observable } from 'mobx';
import { app } from './firebase';

import * as firebase from 'firebase';
// @ts-ignore
import GoogleAuthProvider = firebase.auth.GoogleAuthProvider;

type User = firebase.User | null;

export class Authentication {
  @computed
  get isLoggedIn() {
    return !!this.user;
  }

  @observable
  isReady = false;

  @observable.ref
  user: User = null;

  constructor() {
    this.isReady = false;

    app.auth().onAuthStateChanged(
      user => {
        this.setUser(user);
        this.isReady = true;
      },
      error => {
        this.setUser(null);
        this.isReady = true;
      },
    );
  }

  @action
  loginWithGoogle = async () => {
    this.isReady = false;

    try {
      await app.auth().signInWithPopup(new GoogleAuthProvider());
      this.setUser(app.auth().currentUser);
    } catch (e) {
      this.setUser(null);
    } finally {
      this.isReady = true;
    }
  };

  logout = async () => {
    await app.auth().signOut();
  };

  @action
  setUser(user: User) {
    this.user = user;
  }
}
