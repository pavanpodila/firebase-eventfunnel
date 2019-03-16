import { app } from './firebase';
import { IObservableArray, observable } from 'mobx';
// @ts-ignore
import CollectionReference = firebase.firestore.CollectionReference;

export interface FirestoreDocument {
  id: string;
}

export class FirestoreCollection<T extends FirestoreDocument> {
  private ref: CollectionReference;

  items: IObservableArray<T> = observable.array([]);

  constructor(path: string) {
    this.ref = app.firestore().collection(path);

    this.ref.onSnapshot(snapshot => {
      console.log(snapshot);
      snapshot.docChanges().forEach(change => {
        switch (change.type) {
          case 'added': {
            const item = change.doc.data();
            this.items.push({ id: change.doc.id, ...item } as T);
            break;
          }
          case 'removed':
            const item = this.items.find(item => item.id == change.doc.id);
            this.items.remove(item!);
            break;
          case 'modified':
            const index = this.items.findIndex(item => item.id == change.doc.id);
            Object.assign(this.items[index], change.doc.data());
        }
      });
    });
  }
}
