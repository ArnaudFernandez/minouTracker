import { Component } from '@angular/core';
import {SwUpdate} from "@angular/service-worker";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'foodTrackingApp';

  constructor(updates: SwUpdate) {
    updates.available.subscribe(event => {
      updates.activateUpdate().then( _ => {document.location.reload()});
    })
  }
}
