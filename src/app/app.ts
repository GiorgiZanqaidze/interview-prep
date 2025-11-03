import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserComponent } from './user/user.component';
import { TabGroupComponent } from './tab/tab-group.component';
import { TabComponent } from './tab/tab.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, UserComponent, TabGroupComponent, TabComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Interview Prep');
}
