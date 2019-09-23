import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

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

  upload(path: string, data: any): Observable<number> {
    const task = this.storage.upload(path, data);
    task.snapshotChanges().subscribe();
    return task.percentageChanges();
  }

  delete(path: string) {
    this.storage.ref(path).delete().subscribe();
  }
}
