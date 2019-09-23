import { Component, OnInit, Input } from '@angular/core';
import { Asset } from 'src/app/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AssetService } from 'src/app/services/asset/asset.service';
import { ModalController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AssetsQuery } from 'src/app/services/asset/asset.query';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-edit-note',
  templateUrl: './edit-note.component.html',
  styleUrls: ['./edit-note.component.scss'],
})
export class EditNoteComponent implements OnInit {
  @Input() note: Asset;
  @Input() locationId: string;
  form: FormGroup;
  loading$: Observable<boolean>;

  constructor(
    private alert: AlertController,
    private service: AssetService,
    private query: AssetsQuery,
    private fb: FormBuilder,
    private modal: ModalController,
  ) {}

  ngOnInit() {
    this.loading$ = this.query.selectLoading();
    this.form = this.fb.group({
      subject: ['', [Validators.required]],
      text: ['', [Validators.required]],
    });
    if (this.note) {
      this.form.patchValue(this.note);
    }
  }

  async save() {
    const disabled = await this.disabled()
      .pipe(take(1))
      .toPromise();
    if (!disabled) {
      this.service.store.setLoading(true);
      const locationId = this.locationId;
      this.note
        ? await this.service.updateAsset({ ...this.note, ...this.form.value, locationId })
        : await this.service.addAsset({ ...this.form.value, locationId, type: 'note' });
      this.form.reset();
      this.service.store.setLoading(false);
      await this.modal.dismiss();
    }
  }

  async delete() {
    const alert = await this.alert.create({
      message: 'Are you sure you want to delete this note?',
      buttons: [
        {
          text: 'Yes',
          handler: async () => {
            this.service.store.setLoading(true);
            await this.service.remove(this.note.docId, {});
            this.form.reset();
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

  disabled() {
    return this.loading$.pipe(map(loading => !this.form.valid || loading));
  }
}
