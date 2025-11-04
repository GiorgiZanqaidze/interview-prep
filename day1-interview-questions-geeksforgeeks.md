# Angular Interview Questions - GeeksForGeeks Study Guide

Based on: [GeeksForGeeks Angular Interview Questions](https://www.geeksforgeeks.org/angular-js/angular-interview-questions-and-answers/)

**Purpose:** Quick-reference interview questions to test Day 1 concepts

---

## 📚 How to Use This Guide

1. **Self-Quiz Mode**: Cover the answers and try to answer each question
2. **Review Mode**: Read through all Q&A pairs
3. **Practice Mode**: Code the examples yourself

4. **Track Progress**: Check off questions you can confidently answer

---

## Section 1: Angular Basics (Beginner)

### Q1: Why was a client-side framework introduced?

**Answer:**
Client-side frameworks solve the complexity of modern web applications:

- **SPA Support** - Smooth, fast UX without full page reloads
- **Automatic UI Sync** - Two-way data binding (Angular) or virtual DOM (React)
- **Component Architecture** - Reusable, organized, maintainable code
- **Built-in Tools** - Routing, forms, state management out of the box
- **Developer Productivity** - Less boilerplate, more features

**Why it matters:** Shows understanding of why Angular exists vs vanilla JS

---

### Q2: How does an Angular application work?

**Answer:**

1. **Bootstrap** - `main.ts` bootstraps `AppModule` and `AppComponent`
2. **Modules** - Group related features
3. **Components** - Build UI with template + logic + styles
4. **Data Binding** - Links view and component data
5. **Directives** - Modify DOM behavior
6. **Services** - Share logic via Dependency Injection
7. **Router** - Handles navigation
8. **Change Detection** - Updates DOM when data changes
9. **Compiler** - Renders templates into JavaScript

**Flow:**

```
User Action → Event → Component Logic → Data Change →
Change Detection → Template Update → DOM Update
```

---

### Q3: How are Angular expressions different from JavaScript expressions?

| **Angular Expressions**   | **JavaScript Expressions** |
| ------------------------- | -------------------------- |
| Used in templates `{{ }}` | Used in .ts/.js files      |
| Component scope           | Global/function scope      |
| No loops, assignments     | Full logic support         |
| Auto-escaped (XSS safe)   | Needs manual security      |
| Supports data binding     | No binding support         |

**Examples:**

```typescript
// Angular expression (in template)
{
  {
    user.name | uppercase;
  }
}

// JavaScript expression (in component)
this.fullName = this.user.firstName + ' ' + this.user.lastName;
```

---

### Q4: What are Single Page Applications (SPA)?

**Answer:**
Web apps that load one HTML page and dynamically update content using JavaScript.

**Benefits:**

- ✅ Faster interactions (no full page reloads)
- ✅ Smoother UX (like native apps)
- ✅ Better performance after initial load
- ✅ Easier state management

**Challenges:**

- ❌ Larger initial bundle size
- ❌ SEO requires SSR (Server-Side Rendering)
- ❌ Browser history management

---

### Q5: What are templates in Angular?

**Answer:**
Templates are HTML views that tell Angular how to render a component.

**Two types:**

**Inline Template:**

```typescript
@Component({
  selector: 'app-inline',
  template: `
    <h1>{{ title }}</h1>
    <p>Inline template</p>
  `
})
```

**Linked Template:**

```typescript
@Component({
  selector: 'app-linked',
  templateUrl: './linked.component.html'
})
```

**When to use:**

- Inline: Short templates (< 5 lines)
- Linked: Complex templates, better for maintainability

---

### Q6: What is AOT Compiler?

**Answer:**
**Ahead-of-Time (AOT)** compiles Angular code into JavaScript **before** the browser downloads it.

**Benefits:**

- ✅ Faster rendering (no compilation in browser)
- ✅ Smaller bundle size (no compiler shipped)
- ✅ Catches errors at build time
- ✅ Better security (templates pre-compiled)

**vs JIT (Just-in-Time):**

- JIT compiles in browser at runtime
- Slower but faster dev builds

---

### Q7: How many types of compilation does Angular provide?

**Answer:** Two types

**1. JIT (Just-in-Time)**

```bash
ng serve  # Development mode
```

- Compiles at runtime in browser
- Faster builds, slower app startup
- Good for development

**2. AOT (Ahead-of-Time)**

```bash
ng build --prod  # Production mode
```

- Compiles during build
- Slower builds, faster app startup
- Recommended for production

---

### Q8: What is a component in Angular?

**Answer:**
A component is the fundamental building block that controls a UI section.

**Four parts:**

1. **Decorator** - `@Component()` metadata
2. **Class** - Logic and data
3. **Template** - HTML view
4. **Styles** - CSS (optional)

**Example:**

```typescript
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() title: string;
  @Input() links: { name: string; url: string }[];

  constructor() {}
}
```

---

### Q9: Explain the @Component decorator

**Answer:**
The `@Component` decorator defines metadata for a component:

```typescript
@Component({
  selector: 'app-user',           // HTML tag name
  templateUrl: './user.html',     // Template file
  styleUrls: ['./user.css'],      // Styles (encapsulated)
  providers: [UserService],       // DI providers
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

**Key properties:**

- `selector` - Custom HTML tag
- `template/templateUrl` - View definition
- `styles/styleUrls` - Scoped CSS
- `providers` - Service instances
- `changeDetection` - Performance strategy

---

### Q10: What is a module in Angular?

**Answer:**
A module groups related components, directives, pipes, and services.

**Example:**

```typescript
@NgModule({
  declarations: [AppComponent, HeaderComponent], // Components
  imports: [BrowserModule, HttpClientModule], // Other modules
  providers: [DataService], // Services
  bootstrap: [AppComponent], // Root component
})
export class AppModule {}
```

**Types:**

- **Root Module** - `AppModule` (bootstraps app)
- **Feature Module** - Groups related features
- **Shared Module** - Common components/pipes
- **Core Module** - Singleton services

---

## Section 2: Component Lifecycle

### Q11: List all Angular lifecycle hooks

**Answer:**

```typescript
1. ngOnChanges()          // Input changes
2. ngOnInit()             // Initialize (once)
3. ngDoCheck()            // Custom change detection
4. ngAfterContentInit()   // Content projected (once)
5. ngAfterContentChecked() // After content check
6. ngAfterViewInit()      // View initialized (once)
7. ngAfterViewChecked()   // After view check
8. ngOnDestroy()          // Cleanup
```

**Most Important:**

- `ngOnInit` - Initialization logic
- `ngOnDestroy` - Cleanup (unsubscribe)
- `ngOnChanges` - Track @Input changes

---

### Q12: When is ngOnChanges called?

**Answer:**
Called when any `@Input()` property changes.

```typescript
export class ChildComponent implements OnChanges {
  @Input() user: User;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      console.log('Old:', changes['user'].previousValue);
      console.log('New:', changes['user'].currentValue);
      console.log('First?', changes['user'].firstChange);
    }
  }
}
```

**Important:**

- ❌ Not called for internal property changes
- ❌ Not called for object mutations (only reference changes)
- ✅ Called before ngOnInit on first change

---

### Q13: Difference between Constructor and ngOnInit?

**Answer:**

| **Constructor**          | **ngOnInit**             |
| ------------------------ | ------------------------ |
| TypeScript feature       | Angular lifecycle hook   |
| Called first             | Called after constructor |
| @Input() not available   | @Input() available       |
| For dependency injection | For initialization logic |

```typescript
export class MyComponent implements OnInit {
  @Input() data: string;

  constructor(private service: MyService) {
    // ❌ this.data is undefined here
    // ✅ Only inject dependencies
  }

  ngOnInit() {
    // ✅ this.data is available
    // ✅ Make API calls, initialize
  }
}
```

---

## Section 3: Change Detection

### Q14: What is Change Detection in Angular?

**Answer:**
The mechanism that synchronizes component data with the DOM.

**How it works:**

1. Event occurs (click, HTTP, timer)
2. Zone.js intercepts the event
3. Angular checks component tree for changes
4. Updates DOM if data changed

**Triggers:**

- User events (click, input)
- setTimeout/setInterval
- HTTP requests
- Promises/Observables

---

### Q15: What is OnPush change detection?

**Answer:**
An optimization strategy that limits when Angular checks a component.

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OptimizedComponent {
  @Input() data: any;
}
```

**Checks component only when:**

1. `@Input()` reference changes
2. Event from component template
3. `async` pipe emits
4. Manual trigger (`markForCheck()`)

**Performance:** Skips unnecessary checks = faster app

---

### Q16: Default vs OnPush change detection?

| **Default**         | **OnPush**               |
| ------------------- | ------------------------ |
| Checks every time   | Checks selectively       |
| Detects mutations   | Requires new references  |
| Simpler to use      | Better performance       |
| Good for small apps | Essential for large apps |

**Example:**

```typescript
// ❌ Won't work with OnPush
this.user.name = 'New Name';

// ✅ Works with OnPush
this.user = { ...this.user, name: 'New Name' };
```

---

## Section 4: Dependency Injection

### Q17: What is Dependency Injection?

**Answer:**
Design pattern where dependencies are provided to a class rather than created by it.

**Without DI:**

```typescript
export class UserComponent {
  private service = new UserService(); // ❌ Tight coupling
}
```

**With DI:**

```typescript
export class UserComponent {
  constructor(private service: UserService) {} // ✅ Injected
}
```

**Benefits:**

- Easier testing (mock dependencies)
- Loose coupling
- Reusable code

---

### Q18: What are Injectable services?

**Answer:**
Classes marked with `@Injectable()` that can be injected.

```typescript
@Injectable({
  providedIn: 'root', // Singleton
})
export class AuthService {
  login(user: string) {}
  logout() {}
}
```

**Provider scopes:**

- `'root'` - App-wide singleton
- `'any'` - One instance per lazy module
- Module providers - Module-scoped
- Component providers - Component-scoped

---

### Q19: What are Injection Tokens?

**Answer:**
Used to provide non-class dependencies.

```typescript
// Create token
export const API_URL = new InjectionToken<string>('api.url');

// Provide value
providers: [
  { provide: API_URL, useValue: 'https://api.example.com' }
]

// Inject
constructor(@Inject(API_URL) private apiUrl: string) {}
```

---

## Section 5: Directives & Templates

### Q20: What are the types of directives?

**Answer:** Three types

**1. Component Directives**

```typescript
@Component({ selector: 'app-user' })
```

**2. Structural Directives** (change DOM structure)

```html
*ngIf, *ngFor, *ngSwitch
```

**3. Attribute Directives** (change appearance/behavior)

```html
[ngClass], [ngStyle], [disabled]
```

---

### Q21: How does \*ngFor work?

**Answer:**
Repeats a template for each item in a list.

```html
<div *ngFor="let user of users; let i = index; trackBy: trackById">{{ i }}: {{ user.name }}</div>
```

**Variables:**

- `index` - Current index
- `first` - Is first item
- `last` - Is last item
- `even/odd` - Even/odd index

**trackBy:** Performance optimization

```typescript
trackById(index: number, item: any) {
  return item.id; // Track by unique identifier
}
```

---

### Q22: What is the async pipe?

**Answer:**
Subscribes to Observables/Promises and automatically unsubscribes.

```typescript
@Component({
  template: `
    <div *ngIf="user$ | async as user">
      {{ user.name }}
    </div>
  `,
})
export class UserComponent {
  user$ = this.service.getUser();
}
```

**Benefits:**

- ✅ Auto subscribe/unsubscribe
- ✅ No memory leaks
- ✅ Cleaner code

---

## Section 6: Forms

### Q23: Template-driven vs Reactive Forms?

| **Template-Driven**     | **Reactive**             |
| ----------------------- | ------------------------ |
| Logic in template       | Logic in component       |
| ngModel directive       | FormControl/FormGroup    |
| Simpler for basic forms | Better for complex forms |
| Less testable           | Fully testable           |

**Template-Driven:**

```html
<input [(ngModel)]="username" name="username" />
```

**Reactive:**

```typescript
form = new FormGroup({
  username: new FormControl('', Validators.required),
});
```

---

## Section 7: Routing

### Q24: What are Route Guards?

**Answer:**
Interfaces that control navigation to/from routes.

**Types:**

- `CanActivate` - Can enter route?
- `CanDeactivate` - Can leave route?
- `CanLoad` - Can load lazy module?
- `Resolve` - Pre-fetch data

**Example:**

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    if (this.auth.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
```

---

### Q25: What is Lazy Loading?

**Answer:**
Loading feature modules only when needed.

```typescript
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then((m) => m.AdminModule),
  },
];
```

**Benefits:**

- Smaller initial bundle
- Faster app startup
- Better performance

---

## Section 8: RxJS & Observables

### Q26: What are Observables?

**Answer:**
Streams of data over time that can be observed.

```typescript
// Create
const data$ = new Observable((observer) => {
  observer.next(1);
  observer.next(2);
  observer.complete();
});

// Subscribe
data$.subscribe({
  next: (value) => console.log(value),
  error: (err) => console.error(err),
  complete: () => console.log('Done'),
});
```

---

### Q27: Observable vs Promise?

| **Observable**  | **Promise**     |
| --------------- | --------------- |
| Multiple values | Single value    |
| Lazy (cold)     | Eager (hot)     |
| Cancellable     | Not cancellable |
| RxJS operators  | then/catch      |

---

## Section 9: Scenario-Based Questions

### Q28: How to handle form validation with async validators?

**Answer:**

```typescript
emailForm = this.fb.group({
  email: ['',
    [Validators.required, Validators.email],
    [this.uniqueEmailValidator.bind(this)]
  ]
});

uniqueEmailValidator(control: AbstractControl) {
  return this.api.checkEmail(control.value).pipe(
    delay(500),
    map(exists => exists ? { emailTaken: true } : null)
  );
}
```

---

### Q29: How to debug change detection issues?

**Answer:**

```typescript
constructor(private cdr: ChangeDetectorRef) {}

// If OnPush not updating:
updateData() {
  // 1. Use immutable updates
  this.data = { ...this.data, newValue: 'updated' };

  // 2. Or manually trigger
  this.cdr.markForCheck();
}

// Debug mode
import { ApplicationRef } from '@angular/core';
constructor(private appRef: ApplicationRef) {
  // @ts-ignore
  window.ng.profiler.timeChangeDetection();
}
```

---

### Q30: How to implement authentication guard?

**Answer:**

```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}

// In routes
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [AuthGuard]
}
```

---

## ✅ Self-Assessment Checklist

Track which questions you can answer confidently:

**Basics:**

- [ ] Q1-10: Angular fundamentals

**Core Concepts:**

- [ ] Q11-13: Lifecycle hooks
- [ ] Q14-16: Change detection
- [ ] Q17-19: Dependency injection
- [ ] Q20-22: Directives & templates

**Advanced:**

- [ ] Q23: Forms
- [ ] Q24-25: Routing
- [ ] Q26-27: RxJS
- [ ] Q28-30: Scenarios

---

## 📊 Study Tips

1. **Active Recall**: Try answering before reading the answer
2. **Code It**: Type out examples, don't just read
3. **Teach Back**: Explain concepts out loud
4. **Connect**: Link questions to your Day 1 guide
5. **Time Yourself**: Practice answering in 2-3 minutes

---

## 🎯 Interview Prep Strategy

**Week Before:**

- Review all Q&A daily
- Code 2-3 examples per day
- Focus on weak areas

**Day Before:**

- Quick scan of all questions
- Review scenario questions
- Get good sleep!

**During Interview:**

- Start with definition
- Give example
- Mention pros/cons
- Show you've used it

---

## 📝 Practice Questions to Code

Make sure you can code these from scratch:

1. Component with all lifecycle hooks
2. Service with DI
3. OnPush component with immutable updates
4. Custom pipe (pure and impure)
5. Reactive form with validation
6. Route guard
7. Parent-child with @Input/@Output
8. \*ngFor with trackBy

Good luck! 🚀
