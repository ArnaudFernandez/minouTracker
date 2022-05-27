import { Component, OnInit } from '@angular/core';
import {AuthService} from './auth-service.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  connectWithGoogle(): void {
    this.authService.signInWithGoogle();
  }


}
