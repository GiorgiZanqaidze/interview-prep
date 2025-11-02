import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  SimpleChanges,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnChanges {
  name = signal('John Doe');

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
