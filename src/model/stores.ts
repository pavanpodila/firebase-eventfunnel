import { app } from './firebase';
import { action, computed, IObservableArray, observable, reaction, runInAction } from 'mobx';
// @ts-ignore
import CollectionReference = firebase.firestore.CollectionReference;
import { Authentication } from './auth';

interface Interest {
  id: string;
  title: string;
  imageUrl: string;
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

export class InterestFormStore {
  @observable
  isVisible = false;

  @observable
  title = '';

  @observable
  error?: string;

  @observable
  file?: File;

  @observable
  inProgress = false;

  @computed
  get fileUrl() {
    return this.file ? URL.createObjectURL(this.file) : undefined;
  }

  constructor(interests: IObservableArray<Interest>) {
    reaction(
      () => this.title,
      value => {
        const categories = interests.map(x => x.title.toLowerCase());
        const exists = categories.includes(value);
        runInAction(() => (this.error = exists ? 'Category already exists' : undefined));
      },
    );
  }

  @action.bound
  open() {
    this.title = '';
    this.isVisible = true;
  }

  @action.bound
  close() {
    if (this.inProgress) return;

    this.isVisible = false;
  }

  @action.bound
  setTitle(value: string) {
    this.title = value;
  }

  @action.bound
  setFile(file?: File) {
    this.file = file;
  }
}

export class InterestStore {
  auth = new Authentication();
  private interestCollection = new InterestCollection('/interests');

  form = new InterestFormStore(this.interests);

  get interests() {
    return this.interestCollection.items;
  }

  @action
  saveInterest = async () => {
    try {
      this.form.inProgress = true;
      await this.interestCollection.addNew(this.form.title);
    } finally {
      runInAction(() => (this.form.inProgress = false));
    }
    this.form.close();
  };
}
