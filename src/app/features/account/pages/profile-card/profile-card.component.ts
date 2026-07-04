import {Component, OnInit} from '@angular/core';
import {SharedService} from '../../../../core/services/sharedService/shared.service';
import {UserService} from '../../../user/services/userService/user.service';
import {UserResponse} from '../../../user/models/userDTO/userResponse.model';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-profile-card',
  imports: [CommonModule],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css'
})
export class ProfileCardComponent implements OnInit{

  user: UserResponse | null = null;

  constructor(
    private userService: UserService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.userService.getMyProfile().subscribe({
      next: (res) => {
        this.user = res;
        console.log("this is the user response; ",res);
      }
    });
  }



}
