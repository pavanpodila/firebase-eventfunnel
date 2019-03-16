import { app } from './firebase';
import { action, IObservableArray, observable, reaction, runInAction } from 'mobx';
// @ts-ignore
import CollectionReference = firebase.firestore.CollectionReference;
import { Authentication } from './auth';

interface Interest {
  id: string;
  title: string;
}

export class InterestCollection {
  private ref: CollectionReference;

  items: IObservableArray<Interest> = observable.array([]);

  constructor(path: string) {
    this.ref = app.firestore().collection(path);

    this.ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        switch (change.type) {
          case 'added': {
            const item = change.doc.data();
            this.items.push({ id: change.doc.id, ...item } as Interest);
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

  async addNew(interest: string) {
    return this.ref.add({ title: interest });
  }
}

export class InterestStore {
  auth = new Authentication();
  private interestCollection = new InterestCollection('/interests');

  @observable
  isFormVisible = false;

  @observable
  editingInterest = '';

  @observable
  editingError?: string;

  @observable
  isAdding = false;

  get interests() {
    return this.interestCollection.items;
  }

  constructor() {
    reaction(
      () => this.editingInterest,
      value => {
        const categories = this.interests.map(x => x.title.toLowerCase());
        const exists = categories.includes(value);
        runInAction(() => (this.editingError = exists ? 'Category already exists' : undefined));
      },
    );
  }

  @action
  openForm = () => {
    this.editingInterest = '';
    this.isFormVisible = true;
  };

  @action
  closeForm = () => {
    this.isFormVisible = false;
  };

  @action
  saveInterest = async () => {
    try {
      this.isAdding = true;
      await this.interestCollection.addNew(this.editingInterest);
    } finally {
      runInAction(() => (this.isAdding = false));
    }
    this.closeForm();
  };

  @action
  setInterest(value: string) {
    this.editingInterest = value;
  }
}
