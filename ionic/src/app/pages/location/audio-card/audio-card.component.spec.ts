import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioCardComponent } from './audio-card.component';

describe('AudioCardComponent', () => {
  let component: AudioCardComponent;
  let fixture: ComponentFixture<AudioCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioCardComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
