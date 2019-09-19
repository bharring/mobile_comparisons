import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditLocationComponent } from './edit-location/edit-location.component';



@NgModule({
  declarations: [EditLocationComponent],
  entryComponents: [EditLocationComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class SharedModule { }
