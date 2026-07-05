import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../core/services/sharedService/shared.service';
import { UserService } from '../../../user/services/userService/user.service';
import { UserResponse } from '../../../user/models/userDTO/userResponse.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Country } from '../../../../core/model/enums/country.enum.model';

@Component({
  selector: 'app-profile-card',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.css'
})
export class ProfileCardComponent implements OnInit {

  user: UserResponse | null = null;

  countries = Object.values(Country);

  constructor(
    private userService: UserService,
    public sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.userService.getMyProfile().subscribe({
      next: (res) => this.user = res
    });
  }



  editingMode = false;
  editingField: 'phone' | 'country' | null = null;
  editModel = {
    phoneNumber: '',
    country: ''
  };
  enableEditMode() {
    this.editingMode = true;
  }
  cancelEdit() {
    this.editingMode = false;
    this.editingField = null;
  }
  startEdit(field: 'phone' | 'country') {
    this.editingField = field;
    this.editModel = {
      phoneNumber: this.user?.phoneNumber || '',
      country: this.user?.country || ''
    };
  }
  save() {
    if (!this.user) return;
    this.userService.updateMyProfile(this.editModel).subscribe({
      next: (res) => {
        this.user = res;
        this.editingMode = false;
        this.editingField = null;
      }
    });
  }

  onAvatarSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file || !this.user) return;
    this.userService.uploadAvatar(file).subscribe({
      next: (updatedUser: UserResponse) => {
        this.user = updatedUser; // instant UI update
      },
      error: (err) => {
        console.error('Avatar upload failed', err);
      }
    });
  }

}
