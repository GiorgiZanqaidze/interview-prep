# Day 1 – Core Angular Concepts

**Goal:** Refresh all the fundamentals and identify weak areas.

---

## 📚 Study Plan

1. ✅ Skim Angular docs → Components, Templates, DI
2. ✅ Write a small app from scratch — no copy-paste
3. ✅ Take short quizzes (GeeksForGeeks, InterviewBit, Angular University)

---

## 1. Component Lifecycle Hooks

### Lifecycle Hook Order

```typescript
ngOnChanges(); // Called when input properties change (before ngOnInit)
ngOnInit(); // Called once after first ngOnChanges
ngDoCheck(); // Custom change detection
ngAfterContentInit(); // After content projection initialized
ngAfterContentChecked(); // After every content check
ngAfterViewInit(); // After component views initialized
ngAfterViewChecked(); // After every view check
ngOnDestroy(); // Cleanup before component destruction
```

### `ngOnInit` vs Constructor

```typescript
export class MyComponent implements OnInit {
  @Input() data: string;

  constructor(private service: MyService) {
    // ❌ DON'T: @Input properties are NOT available yet
    // console.log(this.data); // undefined
  }

  ngOnInit() {
    // ✅ DO: @Input properties ARE available here
    console.log(this.data); // accessible
    // Best place for initialization logic
  }
}
```

### `ngOnChanges` - Tracking Input Changes

```typescript
export class ChildComponent implements OnChanges {
  @Input() user: User;
  @Input() age: number;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      console.log('Previous:', changes['user'].previousValue);
      console.log('Current:', changes['user'].currentValue);
      console.log('First change?', changes['user'].firstChange);
    }

    if (changes['age'] && !changes['age'].firstChange) {
      console.log('Age updated:', changes['age'].currentValue);
    }
  }
}
```

### `ngOnDestroy` - Cleanup

```typescript
export class MyComponent implements OnInit, OnDestroy {
  private subscription: Subscription;

  ngOnInit() {
    this.subscription = this.service.getData().subscribe((data) => console.log(data));
  }

  ngOnDestroy() {
    // ✅ Always unsubscribe to prevent memory leaks
    this.subscription.unsubscribe();
  }
}
```

**Interview Tips:**

- `ngOnChanges` only fires when `@Input()` properties change
- Constructor should only be used for DI, not initialization
- Always cleanup subscriptions, timers, and event listeners in `ngOnDestroy`

---

## 2. Change Detection

### Default Change Detection Strategy

```typescript
@Component({
  selector: 'app-default',
  template: `
    <div>{{ counter }}</div>
    <button (click)="increment()">+</button>
  `,
  changeDetection: ChangeDetectionStrategy.Default, // default
})
export class DefaultComponent {
  counter = 0;

  increment() {
    this.counter++;
    // ✅ View updates automatically
  }
}
```

**How it works:**

- Angular checks EVERY component in the tree
- Triggered by: events, timers, HTTP requests, async operations
- Uses Zone.js to intercept async operations

### OnPush Change Detection Strategy

```typescript
@Component({
  selector: 'app-optimized',
  template: `
    <div>{{ user.name }}</div>
    <div>{{ counter }}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptimizedComponent {
  @Input() user: User;
  counter = 0;

  // ❌ Won't trigger change detection
  mutateUser() {
    this.user.name = 'New Name'; // mutation
  }

  // ✅ Will trigger change detection
  replaceUser() {
    this.user = { ...this.user, name: 'New Name' }; // new reference
  }

  // ❌ Won't trigger change detection (internal state change)
  incrementBad() {
    this.counter++;
  }

  // ✅ Will trigger change detection (with manual trigger)
  incrementGood(cdr: ChangeDetectorRef) {
    this.counter++;
    cdr.markForCheck(); // or cdr.detectChanges()
  }
}
```

**OnPush triggers change detection when:**

1. `@Input()` reference changes (not mutation)
2. Event originates from component (click, etc.)
3. `async` pipe emits new value
4. Manual trigger via `ChangeDetectorRef`

### Manual Change Detection

```typescript
export class ManualComponent {
  constructor(private cdr: ChangeDetectorRef) {}

  // Mark component and ancestors to be checked
  markForCheck() {
    this.cdr.markForCheck();
  }

  // Run change detection immediately for this component and children
  detectChanges() {
    this.cdr.detectChanges();
  }

  // Detach from change detection tree
  detach() {
    this.cdr.detach();
  }

  // Reattach to change detection tree
  reattach() {
    this.cdr.reattach();
  }
}
```

**Interview Tips:**

- OnPush = better performance, immutable data patterns required
- Use OnPush with RxJS observables and async pipe
- `markForCheck()` vs `detectChanges()`: mark schedules check, detect runs immediately

---

## 3. Dependency Injection & Services

### Service Creation

```typescript
// Injectable service
@Injectable({
  providedIn: 'root', // Singleton across entire app
})
export class DataService {
  private data$ = new BehaviorSubject<string[]>([]);

  getData() {
    return this.data$.asObservable();
  }

  updateData(data: string[]) {
    this.data$.next(data);
  }
}
```

### Provider Scopes

```typescript
// 1. Root level (singleton)
@Injectable({ providedIn: 'root' })

// 2. Module level
@NgModule({
  providers: [DataService] // New instance per lazy-loaded module
})

// 3. Component level
@Component({
  selector: 'app-example',
  providers: [DataService] // New instance per component instance
})
```

### Injection Tokens

```typescript
// Creating injection token
export const API_URL = new InjectionToken<string>('api.url');

// Providing value
@NgModule({
  providers: [{ provide: API_URL, useValue: 'https://api.example.com' }],
})

// Injecting
export class ApiService {
  constructor(@Inject(API_URL) private apiUrl: string) {}
}
```

### Provider Types

```typescript
// useClass
{ provide: LoggerService, useClass: AdvancedLogger }

// useValue
{ provide: 'API_KEY', useValue: '12345' }

// useFactory
{
  provide: DataService,
  useFactory: (http: HttpClient) => new DataService(http),
  deps: [HttpClient]
}

// useExisting (alias)
{ provide: NewLogger, useExisting: LoggerService }
```

### Constructor Injection

```typescript
export class MyComponent {
  // Standard injection
  constructor(
    private service: DataService,
    private http: HttpClient,
    @Optional() private optional: OptionalService, // May be null
    @Self() private selfService: SelfService, // Only from this injector
    @SkipSelf() private parentService: ParentService, // Skip current injector
    @Host() private hostService: HostService // From host component
  ) {}
}
```

**Interview Tips:**

- `providedIn: 'root'` is tree-shakeable (removed if unused)
- Component-level providers create new instances per component
- Use `@Optional()` to prevent errors if service isn't provided

---

## 4. Modules vs Standalone Components

### Traditional NgModule Approach

```typescript
@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule],
  providers: [DataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### Standalone Components (Angular 14+)

```typescript
// Standalone component
@Component({
  selector: 'app-user',
  standalone: true, // ✅ No NgModule needed
  imports: [CommonModule, FormsModule, AsyncPipe, OtherStandaloneComponent],
  template: `<div>{{ user.name }}</div>`,
})
export class UserComponent {}
```

### Bootstrapping Standalone App

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(HttpClientModule), provideRouter(routes), DataService],
});
```

### Mixing Standalone with Modules

```typescript
// Import standalone into module
@NgModule({
  imports: [StandaloneComponent]
})

// Import module into standalone
@Component({
  standalone: true,
  imports: [MaterialModule]
})
```

**Interview Tips:**

- Standalone components reduce boilerplate
- Each standalone component explicitly declares dependencies
- Better for lazy loading and code splitting
- Can gradually migrate from modules to standalone

---

## 5. ViewChild & ContentChild

### ViewChild - Query Component's Own Template

```typescript
@Component({
  selector: 'app-parent',
  template: `
    <input #nameInput type="text" />
    <app-child #childComp></app-child>
  `,
})
export class ParentComponent implements AfterViewInit {
  // Query by template reference
  @ViewChild('nameInput') nameInput: ElementRef<HTMLInputElement>;

  // Query by component type
  @ViewChild(ChildComponent) childComponent: ChildComponent;

  // Query with read option
  @ViewChild('nameInput', { read: ElementRef }) input: ElementRef;

  // static: true = available in ngOnInit, false = available in ngAfterViewInit
  @ViewChild('nameInput', { static: false }) inputRef: ElementRef;

  ngAfterViewInit() {
    // ✅ ViewChild available here
    this.nameInput.nativeElement.focus();
    this.childComponent.someMethod();
  }
}
```

### ViewChildren - Query Multiple Elements

```typescript
@Component({
  template: ` <app-item *ngFor="let item of items"></app-item> `,
})
export class ListComponent implements AfterViewInit {
  @ViewChildren(ItemComponent) itemComponents: QueryList<ItemComponent>;

  ngAfterViewInit() {
    // QueryList is like an array
    console.log(this.itemComponents.length);

    this.itemComponents.forEach((item) => {
      // Do something with each item
    });

    // Subscribe to changes
    this.itemComponents.changes.subscribe((items) => {
      console.log('Items changed:', items.length);
    });
  }
}
```

### ContentChild - Query Projected Content

```typescript
// Parent component projecting content
@Component({
  selector: 'app-parent',
  template: `
    <app-card>
      <h2 #cardTitle>My Title</h2>
      <p>Some content</p>
    </app-card>
  `,
})
// Card component receiving projected content
@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <ng-content></ng-content>
    </div>
  `,
})
export class CardComponent implements AfterContentInit {
  @ContentChild('cardTitle') title: ElementRef;

  ngAfterContentInit() {
    // ✅ ContentChild available here
    console.log(this.title.nativeElement.textContent);
  }
}
```

### ContentChildren - Query Multiple Projected Items

```typescript
@Component({
  selector: 'app-tab-group',
  template: `
    <div class="tabs">
      <ng-content></ng-content>
    </div>
  `,
})
export class TabGroupComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

  ngAfterContentInit() {
    // Activate first tab
    if (this.tabs.length > 0) {
      this.tabs.first.activate();
    }
  }
}
```

**Interview Tips:**

- `@ViewChild` = query own template (available in `ngAfterViewInit`)
- `@ContentChild` = query projected content (available in `ngAfterContentInit`)
- `QueryList.changes` observable tracks dynamic changes
- Use `{ static: true }` only if element is NOT in `*ngIf` or `*ngFor`

---

## 6. Template Syntax

### Structural Directives

#### ngIf

```typescript
<!-- Basic ngIf -->
<div *ngIf="isVisible">Content</div>

<!-- With else -->
<div *ngIf="user; else loading">
  {{ user.name }}
</div>
<ng-template #loading>
  <div>Loading...</div>
</ng-template>

<!-- With then/else -->
<div *ngIf="loggedIn; then dashboard else login"></div>
<ng-template #dashboard>Welcome!</ng-template>
<ng-template #login>Please log in</ng-template>

<!-- Store value -->
<div *ngIf="user$ | async as user">
  {{ user.name }}
</div>
```

#### ngFor

```typescript
<!-- Basic ngFor -->
<div *ngFor="let item of items">
  {{ item }}
</div>

<!-- With index and other variables -->
<div *ngFor="let item of items; let i = index; let first = first; let last = last; let even = even; let odd = odd">
  {{ i }}: {{ item }}
  <span *ngIf="first">First!</span>
  <span *ngIf="last">Last!</span>
</div>

<!-- With trackBy for performance -->
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>

// Component
trackByFn(index: number, item: any) {
  return item.id; // Track by unique id instead of object reference
}
```

#### ngSwitch

```typescript
<div [ngSwitch]="status">
  <div *ngSwitchCase="'loading'">Loading...</div>
  <div *ngSwitchCase="'success'">Success!</div>
  <div *ngSwitchCase="'error'">Error occurred</div>
  <div *ngSwitchDefault>Unknown status</div>
</div>
```

### Built-in Pipes

```typescript
<!-- Date pipe -->
{{ today | date:'short' }}              // 1/1/25, 12:00 PM
{{ today | date:'fullDate' }}           // Saturday, January 1, 2025
{{ today | date:'yyyy-MM-dd' }}         // 2025-01-01

<!-- Currency pipe -->
{{ price | currency:'USD' }}            // $100.00
{{ price | currency:'EUR':'symbol':'1.2-2' }}  // €100.00

<!-- Decimal pipe -->
{{ 3.14159 | number:'1.2-4' }}         // 3.1416

<!-- Percent pipe -->
{{ 0.75 | percent }}                   // 75%

<!-- Uppercase/Lowercase -->
{{ 'hello' | uppercase }}              // HELLO
{{ 'WORLD' | lowercase }}              // world

<!-- Slice pipe -->
{{ [1,2,3,4,5] | slice:1:3 }}         // [2,3]

<!-- JSON pipe (debugging) -->
{{ user | json }}                      // {"name":"John","age":30}

<!-- Async pipe (automatic subscription) -->
{{ user$ | async }}
```

### Async Pipe

```typescript
@Component({
  template: `
    <!-- ✅ Best practice: async pipe auto-subscribes/unsubscribes -->
    <div *ngIf="user$ | async as user">
      {{ user.name }}
    </div>

    <!-- Multiple async pipes on same observable -->
    <div>
      <span>{{ user$ | async | json }}</span>
      <span>{{ user$ | async }}</span>
      <!-- ❌ Subscribes twice! -->
    </div>

    <!-- ✅ Better: use *ngIf to store -->
    <div *ngIf="user$ | async as user">
      <span>{{ user | json }}</span>
      <span>{{ user.name }}</span>
    </div>
  `,
})
export class UserComponent {
  user$ = this.service.getUser();

  constructor(private service: UserService) {}
}
```

### Custom Pipes

```typescript
// reverse.pipe.ts
@Pipe({
  name: 'reverse',
  standalone: true,
})
export class ReversePipe implements PipeTransform {
  transform(value: string): string {
    return value.split('').reverse().join('');
  }
}

// Usage
{
  {
    'hello' | reverse;
  }
} // olleh
```

```typescript
// filter.pipe.ts
@Pipe({
  name: 'filter',
  standalone: true,
  pure: false  // ⚠️ Impure pipe - runs on every change detection
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, field: string): any[] {
    if (!items || !searchText) {
      return items;
    }

    return items.filter(item =>
      item[field].toLowerCase().includes(searchText.toLowerCase())
    );
  }
}

// Usage
<div *ngFor="let user of users | filter:searchTerm:'name'">
  {{ user.name }}
</div>
```

**Pure vs Impure Pipes:**

```typescript
// Pure pipe (default): only runs when input reference changes
@Pipe({ name: 'pure', pure: true })

// Impure pipe: runs on every change detection cycle
@Pipe({ name: 'impure', pure: false })  // ⚠️ Performance impact
```

**Interview Tips:**

- Always use `trackBy` with `*ngFor` for performance
- Async pipe automatically handles subscription lifecycle
- Pure pipes are cached and performant
- Impure pipes run frequently, avoid if possible
- Use `*ngIf="obs$ | async as value"` to avoid multiple subscriptions

---

## 🎯 Practice Exercises

### Exercise 1: Component Lifecycle

Create a component that:

- Accepts `@Input() userId`
- Fetches user data in `ngOnInit`
- Tracks input changes with `ngOnChanges`
- Cleans up subscriptions in `ngOnDestroy`

### Exercise 2: OnPush Change Detection

Build a component with:

- OnPush change detection
- Immutable data updates
- Async pipe usage
- Manual change detection trigger

### Exercise 3: Custom Pipe

Create a pipe that:

- Formats file sizes (bytes → KB, MB, GB)
- Is pure and performant
- Handles edge cases

### Exercise 4: ViewChild/ContentChild

Build a tabs component using:

- `<ng-content>` for projection
- `@ContentChildren` to query tabs
- Activation/deactivation logic

---

## 🔗 Resources

**Official Angular Docs:**

- [Components](https://angular.dev/guide/components)
- [Templates](https://angular.dev/guide/templates)
- [Dependency Injection](https://angular.dev/guide/di)
- [Change Detection](https://angular.dev/best-practices/runtime-performance)

**Practice Quizzes:**

- [GeeksForGeeks Angular Quiz](https://www.geeksforgeeks.org/angular-quiz/)
- [InterviewBit Angular Questions](https://www.interviewbit.com/angular-interview-questions/)
- [Angular University](https://angular-university.io/)

---

## ✅ Day 1 Checklist

- [ ] Reviewed all lifecycle hooks
- [ ] Understood Default vs OnPush change detection
- [ ] Practiced dependency injection patterns
- [ ] Compared Modules vs Standalone components
- [ ] Used ViewChild and ContentChild
- [ ] Implemented custom pipes
- [ ] Built a small app from scratch
- [ ] Took practice quizzes
- [ ] Identified weak areas for deeper study

---

## 📝 Notes & Weak Areas

Use this section to track what you need to review further:

```
Weak areas:
-
-

Questions to research:
-
-

Key takeaways:
-
-
```
