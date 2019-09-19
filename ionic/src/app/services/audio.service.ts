import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  get cordova() {
    return this.platform.is('cordova');
  }

  constructor(private platform: Platform) {}

  async startRecording(ondataavailable) {
    if (this.cordova) {
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      mediaRecorder.ondataavailable = ondataavailable;
      mediaRecorder.onerror = event => console.error(event.error.message);
      return mediaRecorder;
    }
  }

  stopRecording(mediaRecorder: MediaRecorder) {
    if (this.cordova) {
    } else {
      mediaRecorder.stop();
    }
  }
  async saveRecording(data: Blob) {
    if (this.cordova) {
    } else {
    }
  }
}
