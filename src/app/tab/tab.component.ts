import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tab-content" *ngIf="active">
      <ng-content></ng-content>
    </div>
  `,
  styles: [
    `
      .tab-content {
        padding: 20px;
        border: 1px solid #ddd;
        border-top: none;
        animation: fadeIn 0.3s ease-in;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class TabComponent {
  @Input() title = '';
  active = false;

  activate() {
    this.active = true;
  }

  deactivate() {
    this.active = false;
  }
}
