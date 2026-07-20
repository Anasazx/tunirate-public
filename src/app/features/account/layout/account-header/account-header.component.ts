import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {SharedService} from '../../../../core/services/sharedService/shared.service';

@Component({
  selector: 'app-account-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './account-header.component.html',
  styleUrl: './account-header.component.css'
})
export class AccountHeaderComponent {

  @Output() menuToggle = new EventEmitter<void>();

  toggleMenu(){
    this.menuToggle.emit();
  }

  constructor(
    public sharedService: SharedService,
  ) {}


}
