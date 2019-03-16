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
    app.auth().onAuthStateChanged(
      user => {
        this.setUser(user);
      },
      error => {
        this.setUser(null);
      },
    );
  }

  loginWithGoogle = async () => {
    try {
      await app.auth().signInWithPopup(new GoogleAuthProvider());
      this.setUser(app.auth().currentUser);
    } catch (e) {
      this.setUser(null);
    }
  };

  @action
  setUser(user: User) {
    this.user = user;
    this.isReady = !!user;
  }
}
