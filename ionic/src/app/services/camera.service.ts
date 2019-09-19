import { Injectable } from '@angular/core';
import { Plugins, CameraResultType } from '@capacitor/core';

const { Camera } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  constructor() {}

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    const imageUrl = image.webPath;
    // Can be set to the src of an image now
    // imageElement.src = imageUrl;
    return imageUrl;
  }
}
