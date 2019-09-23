import { Component, OnInit, Input } from '@angular/core';
import { Asset } from 'src/app/models';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss'],
})
export class NoteCardComponent implements OnInit {
  @Input() note: Asset;

  constructor() { }

  ngOnInit() {}

}
