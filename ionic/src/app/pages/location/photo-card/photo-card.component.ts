import { Component, OnInit, Input } from '@angular/core';
import { Asset } from 'src/app/models';

@Component({
  selector: 'app-photo-card',
  templateUrl: './photo-card.component.html',
  styleUrls: ['./photo-card.component.scss'],
})
export class PhotoCardComponent implements OnInit {
  @Input() photo: Asset;

  constructor() { }

  ngOnInit() {}

}
