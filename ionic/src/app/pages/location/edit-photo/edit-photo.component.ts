import { Component, OnInit, Input } from '@angular/core';
import { Asset } from 'src/app/models';
import { AlertController, ModalController } from '@ionic/angular';
import { AssetService } from 'src/app/services/asset/asset.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-edit-photo',
  templateUrl: './edit-photo.component.html',
  styleUrls: ['./edit-photo.component.scss'],
})
export class EditPhotoComponent implements OnInit {
  @Input() photo: Asset;

  constructor(
    private alert: AlertController,
    private assets: AssetService,
    private modal: ModalController,
    private storage: StorageService,
  ) {}

  ngOnInit() {}

  async delete() {
    const alert = await this.alert.create({
      message: 'Are you sure you want to delete this photo?',
      buttons: [
        {
          text: 'Yes',
          handler: async () => {
            await this.assets.delete(this.photo);
            await this.modal.dismiss();
          },
        },
        { text: 'Cancel', role: 'cancel' },
      ],
    });
    await alert.present();
  }

  async cancel() {
    await this.modal.dismiss();
  }
}
