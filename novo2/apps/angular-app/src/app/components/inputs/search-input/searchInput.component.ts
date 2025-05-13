import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  imports: [CommonModule, FormsModule],
  templateUrl: './searchInput.component.html',
  styleUrl: './searchInput.component.sass',
})
export class SearchInputComponent {
  protected searchInput: any
}
