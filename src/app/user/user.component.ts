import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  signal,
} from '@angular/core';
import { catchError, delay, of, tap } from 'rxjs';

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
export class UserComponent {
  user: User = { name: 'John Doe' };
  counter = 0;
  apiData = 'No data';
  loading = signal(false);

  private cdr = inject(ChangeDetectorRef);

  //   ngOnInit(): void {
  //     setInterval(() => {
  //       this.user.name = 'New Name' + Math.random(); // mutation
  //       console.log('After mutation:', this.user);
  //       console.log('Same reference?', true);
  //       //   this.cdr.markForCheck();
  //     }, 5000);
  //   }

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

  // ❌ API call without markForCheck - won't update view
  fetchDataBad() {
    console.log('🔴 Fetching data (BAD - no markForCheck)...');
    this.loading.set(true);

    new Promise((resolve) => {
      setTimeout(resolve, 1500);
    }).then(() => {
      this.apiData = `Data fetched at ${new Date().toLocaleTimeString()}`;
      //   this.loading.set(false);
      console.log('🔴 Data received (BAD):', this.apiData);
      console.log('🔴 View will NOT update automatically!');
      //   this.cdr.markForCheck();
    });
  }

  fetchDataWithObservable() {
    console.log('🟡 Fetching with Observable + Signals...');
    this.loading.set(true);

    // Create observable that simulates API call
    of({ data: 'API Response', timestamp: new Date().toLocaleTimeString() })
      .pipe(
        delay(1500),
        tap((response) => {
          this.apiData = `Data: ${response.data} at ${response.timestamp}`;
          this.loading.set(false);
          console.log('🟡 Observable completed:', response);
        }),
        catchError((error) => {
          console.error('Error:', error);
          this.loading.set(false);
          return of(null);
        })
      )
      .subscribe(); // Subscribe to trigger
  }
}
