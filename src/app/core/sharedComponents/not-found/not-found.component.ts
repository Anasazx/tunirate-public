import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {SearchBarComponent} from '../../layout/search-bar/search-bar.component';

@Component({
  selector: 'app-not-found',
  imports: [
    SearchBarComponent,
    RouterLink
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/']);
  }
}
