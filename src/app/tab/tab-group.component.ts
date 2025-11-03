import { Component, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabComponent } from './tab.component';

@Component({
  selector: 'app-tab-group',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tab-group">
      <div class="tab-headers">
        <button
          *ngFor="let tab of tabs; let i = index"
          class="tab-header"
          [class.active]="tab.active"
          (click)="selectTab(i)"
        >
          {{ tab.title }}
        </button>
      </div>
      <div class="tabs">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .tab-group {
        margin: 20px 0;
      }

      .tab-headers {
        display: flex;
        gap: 5px;
        border-bottom: 2px solid #ddd;
      }

      .tab-header {
        padding: 10px 20px;
        background: #f5f5f5;
        border: 1px solid #ddd;
        border-bottom: none;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
        font-weight: 500;
      }

      .tab-header:hover {
        background: #e9e9e9;
      }

      .tab-header.active {
        background: white;
        border-bottom: 2px solid white;
        margin-bottom: -2px;
        color: #007bff;
      }

      .tabs {
        background: white;
      }
    `,
  ],
})
export class TabGroupComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;

  ngAfterContentInit() {
    // Activate first tab
    console.log('TabGroupComponent ngAfterContentInit');
    console.log(this.tabs.toArray());
    if (this.tabs.length > 0) {
      this.tabs.first.activate();
    }
  }

  selectTab(index: number) {
    // Deactivate all tabs
    this.tabs.forEach((tab) => tab.deactivate());

    // Activate selected tab
    const tabsArray = this.tabs.toArray();
    if (tabsArray[index]) {
      tabsArray[index].activate();
    }
  }
}
