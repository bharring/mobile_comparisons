import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private storage: AngularFireStorage) {}

  getMetadata(path: string): Observable<any> {
    const ref = this.storage.ref(path);
    return ref.getMetadata();
  }

  getDownloadURL(path: string): Observable<string> {
    const ref = this.storage.ref(path);
    return ref.getDownloadURL();
  }

  upload(path: string, data: string): Observable<number> {
    const ref = this.storage.ref(path);
    const task = ref.putString(data, 'base64', { contentType: 'image/jpeg' });
    task.snapshotChanges().subscribe();
    return task.percentageChanges();
  }

  delete(path: string) {
    return this.storage
      .ref(path)
      .delete()
      .pipe(take(1))
      .toPromise();
  }
}
