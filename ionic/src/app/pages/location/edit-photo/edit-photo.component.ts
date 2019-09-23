import { Component, OnInit, Input } from '@angular/core';
import { Asset } from 'src/app/models';
import { take, map } from 'rxjs/operators';
import { AlertController, ModalController } from '@ionic/angular';
import { AssetService } from 'src/app/services/asset/asset.service';
import { AssetsQuery } from 'src/app/services/asset/asset.query';
import { FormBuilder } from '@angular/forms';
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
    private service: AssetService,
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
            this.service.store.setLoading(true);
            await Promise.all([this.storage.delete(this.photo.path), this.service.remove(this.photo.docId, {})]);
            this.service.store.setLoading(false);
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
