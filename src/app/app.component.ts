import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AuthService} from './features/auth/services/authService/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.initAuth();
  }

  title = 'tunirate';

}
