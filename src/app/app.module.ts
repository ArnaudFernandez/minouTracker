import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {TopbarComponent} from './topbar/topbar.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireDatabaseModule} from "@angular/fire/compat/database";
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatTreeModule} from '@angular/material/tree';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {HistoryModule} from './history/history.module';
import {TrackerModule} from './tracker/tracker.module';
import {AuthenticationComponent} from './authentication/authentication.component';
import {AuthService} from './authentication/auth-service.service';
import { SnackbarComponent } from './shared/snackbar/snackbar.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import { BarcodeScannerComponent } from './barcode-scanner/barcode-scanner.component';
import { BarcodeScannerLivestreamModule } from "ngx-barcode-scanner";


const routes = [
  {path: 'authentication', component: AuthenticationComponent},
  {path: 'scanner', component: BarcodeScannerComponent},
  {path: '', redirectTo: 'tracker', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    TopbarComponent,
    PageNotFoundComponent,
    AuthenticationComponent,
    SnackbarComponent,
    BarcodeScannerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyDwY0ustgrbdUrkt0FXwseq89vcH_zirJo",
      authDomain: "personnaltrack.firebaseapp.com",
      projectId: "personnaltrack",
      storageBucket: "personnaltrack.appspot.com",
      messagingSenderId: "588509586658",
      appId: "1:588509586658:web:334cb1ed45319ff2592abb",
      measurementId: "G-G9PZNFDF99"
    }),
    AngularFireDatabaseModule,
    MatSidenavModule,
    MatTreeModule,
    RouterModule.forRoot(routes),
    HistoryModule,
    TrackerModule,
    MatSnackBarModule,
    BarcodeScannerLivestreamModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
