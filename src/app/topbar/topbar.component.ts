import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {

  @Output()
  menuButtonClicked: EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor() { }

  ngOnInit(): void {
  }
}
