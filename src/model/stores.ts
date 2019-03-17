import { app } from './firebase';
import { action, computed, IObservableArray, observable, reaction, runInAction } from 'mobx';
// @ts-ignore
import CollectionReference = firebase.firestore.CollectionReference;
import { Authentication } from './auth';

class Interest {
  id: string;
  title: string;
  imageUrl?: string;

  constructor(id: string, title: string, imageUrl?: string) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
  }
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

  async addNew(interest: string, file?: File) {
    const result = await this.ref.add({ title: interest });

    if (file) {
      const fileUrl = await this.uploadImage(result.id, file);
      if (fileUrl) {
        await this.ref.doc(result.id).update({ imageUrl: fileUrl });
      }
    }
  }

  async update(interestId: string, title: string, file?: File) {
    const docRef = this.ref.doc(interestId);
    const doc = await docRef.get();

    const currentImageUrl = (doc.data() as Interest).imageUrl;
    if (currentImageUrl) {
      await app
        .storage()
        .ref(doc.id)
        .delete();

      const fileUrl = await this.uploadImage(doc.id, file);
      if (fileUrl) {
        await this.ref.doc(interestId).update({ imageUrl: fileUrl });
      }

      return docRef.update({
        title,
      });
    } else {
      const fileUrl = await this.uploadImage(doc.id, file);
      if (fileUrl) {
        return this.ref.doc(interestId).update({ title, imageUrl: fileUrl });
      }

      return docRef.update({
        title,
      });
    }
  }

  private async uploadImage(docId: string, file?: File) {
    if (file) {
      const fileRef = app.storage().ref(docId);
      await fileRef.put(file);
      return fileRef.getDownloadURL();
    }

    return null;
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

  @observable
  imageUrl?: string;

  @computed
  get fileUrl() {
    return this.file ? URL.createObjectURL(this.file) : this.imageUrl;
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
  open(title: string = '', imageUrl?: string) {
    this.title = title || '';
    this.imageUrl = imageUrl;
    this.file = undefined;

    this.inProgress = false;
    this.error = undefined;

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
  editForm = new InterestFormStore(this.interests);

  @observable
  editingInterest?: Interest;

  get interests() {
    return this.interestCollection.items;
  }

  @action.bound
  async addInterest() {
    try {
      this.form.inProgress = true;
      await this.interestCollection.addNew(this.form.title, this.form.file);
    } finally {
      runInAction(() => (this.form.inProgress = false));
    }
    this.form.close();
  }

  @action.bound
  async saveInterest() {
    const interest = this.editingInterest!;
    try {
      this.editForm.inProgress = true;
      await this.interestCollection.update(interest.id, this.editForm.title, this.editForm.file);
    } finally {
      runInAction(() => {
        this.editForm.inProgress = false;
        this.editForm.close();
        this.editingInterest = undefined;
      });
    }
  }

  @action.bound
  openInterestEditor(interest: Interest) {
    this.editingInterest = interest;

    this.editForm.open(interest.title, interest.imageUrl);
  }
}
