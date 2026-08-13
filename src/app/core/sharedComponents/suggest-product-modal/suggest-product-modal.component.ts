import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SuggestProductService} from '../../services/suggestProductService/suggest-product.service';
import {ToastService} from '../../services/toastService/toast.service';

@Component({
  selector: 'app-suggest-product-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './suggest-product-modal.component.html'
})
export class SuggestProductModalComponent {

  @Output() close = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  suggestion = {
    name: '',
    companyName: '',
    description: ''
  };


  constructor(
    private suggestProductService: SuggestProductService,
    private toastService: ToastService
  ) {}


  submit() {

    this.suggestProductService
      .createSuggestion(this.suggestion)
      .subscribe({

        next: () => {
          this.submitted.emit();
          this.toastService.show("Suggestion sent!");
          this.close.emit();

        }

      });

  }

}
