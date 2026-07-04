import {Component, OnInit} from '@angular/core';
import {SharedService} from '../../../../core/services/sharedService/shared.service';
import {UserService} from '../../../user/services/userService/user.service';
import {UserResponse} from '../../../user/models/userDTO/userResponse.model';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-profile-card',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css'
})
export class ProfileCardComponent implements OnInit{

  user: UserResponse | null = null;

  editing = false;

  editModel: any = {};

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

  startEdit(user: any) {
    this.editModel = { ...user }; // clone
    this.editing = true;
  }

  cancelEdit() {
    this.editing = false;
  }

  save() {
    this.userService.updateMyProfile(this.editModel).subscribe({
      next: (res) => {
        this.user = res;
        this.editing = false;
      }
    });
  }



}
