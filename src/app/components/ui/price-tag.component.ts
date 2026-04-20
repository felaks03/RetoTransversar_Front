import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-price-tag',
  standalone: true,
  imports: [CurrencyPipe],
  template: `<span class="price">{{ precio | currency:'EUR':'symbol':'1.2-2' }}</span>`,
  styles: [`
    .price {
      font-weight: 600;
      color: var(--color-primary, #1a365d);
    }
  `]
})
export class PriceTagComponent {
  @Input({ required: true }) precio!: number;
}
