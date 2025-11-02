import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  Input,
} from '@angular/core';

interface User {
  name: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit {
  user: User = { name: 'John Doe' };
  counter = 0;

  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    setInterval(() => {
      this.user.name = 'New Name' + Math.random(); // mutation
      console.log('After mutation:', this.user);
      console.log('Same reference?', true);
      //   this.cdr.markForCheck();
    }, 1000);
  }

  constructor() {
    // setInterval(() => {
    //   this.user.name = 'New Name' + Math.random(); // mutation
    //   console.log('After mutation:', this.user);
    //   console.log('Same reference?', true);
    //   this.cdr.markForCheck();
    // }, 1000);
  }

  // ❌ Won't trigger change detection
  mutateUser($event: Event) {
    $event.preventDefault();
    console.log('Before mutation:', this.user);

    this.user.name = 'New Name' + Math.random(); // mutation
    console.log('After mutation:', this.user);
    console.log('Same reference?', true);
    // setInterval(() => {
    //   this.user.name = 'New Name' + Math.random(); // mutation
    //   console.log('After mutation:', this.user);
    //   console.log('Same reference?', true);
    // }, 1000);
  }

  // ✅ Will trigger change detection
  replaceUser() {
    this.user = { ...this.user, name: 'New Name' }; // new reference
  }

  // ❌ Won't trigger change detection (internal state change)
  incrementBad() {
    console.log('Before increment:', this.counter);
    this.counter++;
    console.log('After increment:', this.counter);
    console.log('Same reference?', false);
  }

  // ✅ Will trigger change detection (with manual trigger)
  incrementGood() {
    this.counter++;
    // this.cdr.markForCheck(); // or cdr.detectChanges()
  }
}
