import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LocationPage } from './location.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddAudioComponent } from './add-audio/add-audio.component';
import { EditNoteComponent } from './edit-note/edit-note.component';
import { AudioCardComponent } from './audio-card/audio-card.component';
import { NoteCardComponent } from './note-card/note-card.component';
import { PhotoCardComponent } from './photo-card/photo-card.component';

const routes: Routes = [
  {
    path: ':id',
    component: LocationPage,
  },
];

@NgModule({
  imports: [SharedModule, CommonModule, IonicModule, RouterModule.forChild(routes), FormsModule, ReactiveFormsModule],
  declarations: [
    LocationPage,
    AddAudioComponent,
    EditNoteComponent,
    AudioCardComponent,
    NoteCardComponent,
    PhotoCardComponent,
  ],
  entryComponents: [
    AddAudioComponent,
    EditNoteComponent,
    AudioCardComponent,
    NoteCardComponent,
    PhotoCardComponent,
  ],
})
export class LocationPageModule {}
