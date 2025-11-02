# Day 2 – TypeScript & RxJS Interview Prep

**Goal:** Strengthen logic and reactive programming skills for Angular interviews.

---

## Table of Contents

1. [TypeScript Fundamentals](#typescript-fundamentals)
2. [Advanced TypeScript](#advanced-typescript)
3. [RxJS Core Concepts](#rxjs-core-concepts)
4. [RxJS Operators Deep Dive](#rxjs-operators-deep-dive)
5. [Real-World Angular + RxJS Patterns](#real-world-angular--rxjs-patterns)
6. [Practical Exercises](#practical-exercises)
7. [Interview Questions](#interview-questions)

---

## TypeScript Fundamentals

### Interfaces vs Types

Both define object shapes, but have key differences:

```typescript
// Interface - can be extended and merged
interface User {
  id: number;
  name: string;
  email: string;
}

// Declaration merging (only interfaces)
interface User {
  role: string; // Merged with above
}

// Type alias - more flexible
type Admin = {
  id: number;
  name: string;
  permissions: string[];
};

// Types can use unions and intersections
type UserOrAdmin = User | Admin;
type SuperAdmin = User & Admin;

// Types can alias primitives
type ID = string | number;
type Callback = (data: string) => void;
```

**When to use which:**

- **Interface**: For object shapes, especially public APIs that might be extended
- **Type**: For unions, intersections, primitives, tuples, or complex types

### Generics

Generics allow you to write reusable, type-safe code:

```typescript
// Basic generic function
function identity<T>(arg: T): T {
  return arg;
}

const num = identity<number>(42);
const str = identity('hello'); // Type inference works

// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

const userResponse: ApiResponse<User> = {
  data: { id: 1, name: 'John', email: 'john@example.com', role: 'admin' },
  status: 200,
  message: 'Success',
};

// Generic class
class DataStore<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  getAll(): T[] {
    return this.items;
  }
}

const userStore = new DataStore<User>();
userStore.add({ id: 1, name: 'Alice', email: 'alice@test.com', role: 'user' });

// Generic constraints
interface HasId {
  id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find((item) => item.id === id);
}

// Multiple type parameters
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = merge({ name: 'John' }, { age: 30 });
// merged: { name: string } & { age: number }
```

### Enums

```typescript
// Numeric enum
enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  ServerError = 500,
}

const status: HttpStatus = HttpStatus.OK;
console.log(status); // 200
console.log(HttpStatus[200]); // "OK" - reverse mapping

// String enum (recommended for better debugging)
enum UserRole {
  Admin = 'ADMIN',
  Editor = 'EDITOR',
  Viewer = 'VIEWER',
}

function checkPermission(role: UserRole): boolean {
  return role === UserRole.Admin;
}

// Const enum (inlined at compile time, no reverse mapping)
const enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

// Better alternative: const object with 'as const'
const UserRoleConst = {
  Admin: 'ADMIN',
  Editor: 'EDITOR',
  Viewer: 'VIEWER',
} as const;

type UserRoleType = (typeof UserRoleConst)[keyof typeof UserRoleConst];
// 'ADMIN' | 'EDITOR' | 'VIEWER'
```

---

## Advanced TypeScript

### Utility Types

TypeScript provides built-in utility types for common transformations:

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  inStock: boolean;
}

// Partial<T> - makes all properties optional
type PartialProduct = Partial<Product>;
// { id?: number; name?: string; price?: number; ... }

function updateProduct(id: number, updates: Partial<Product>): void {
  // Can pass any subset of Product properties
}

updateProduct(1, { price: 99.99 }); // Valid

// Required<T> - makes all properties required
type RequiredProduct = Required<PartialProduct>;

// Readonly<T> - makes all properties readonly
type ReadonlyProduct = Readonly<Product>;
const product: ReadonlyProduct = {
  id: 1,
  name: 'Laptop',
  price: 999,
  description: 'Fast',
  inStock: true,
};
// product.price = 899; // Error!

// Pick<T, K> - creates type with subset of properties
type ProductPreview = Pick<Product, 'id' | 'name' | 'price'>;
// { id: number; name: string; price: number }

// Omit<T, K> - creates type excluding properties
type ProductWithoutId = Omit<Product, 'id'>;
// { name: string; price: number; description: string; inStock: boolean }

// Record<K, T> - creates object type with keys K and values T
type ProductMap = Record<string, Product>;
// { [key: string]: Product }

type UserPermissions = Record<UserRole, boolean>;
// { ADMIN: boolean; EDITOR: boolean; VIEWER: boolean }

// Exclude<T, U> - excludes types from union
type Status = 'pending' | 'approved' | 'rejected' | 'cancelled';
type ActiveStatus = Exclude<Status, 'cancelled'>;
// 'pending' | 'approved' | 'rejected'

// Extract<T, U> - extracts types from union
type SuccessStatus = Extract<Status, 'approved'>;
// 'approved'

// NonNullable<T> - removes null and undefined
type NullableString = string | null | undefined;
type NonNullString = NonNullable<NullableString>;
// string

// ReturnType<T> - gets return type of function
function createUser(name: string, email: string) {
  return { id: Math.random(), name, email, createdAt: new Date() };
}

type UserFromFunction = ReturnType<typeof createUser>;
// { id: number; name: string; email: string; createdAt: Date }

// Parameters<T> - gets parameter types as tuple
type CreateUserParams = Parameters<typeof createUser>;
// [name: string, email: string]
```

### Type Narrowing

```typescript
// Type guards
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function processValue(value: string | number) {
  if (isString(value)) {
    console.log(value.toUpperCase()); // TypeScript knows it's string
  } else {
    console.log(value.toFixed(2)); // TypeScript knows it's number
  }
}

// typeof narrowing
function padLeft(value: string, padding: string | number) {
  if (typeof padding === 'number') {
    return ' '.repeat(padding) + value;
  }
  return padding + value;
}

// instanceof narrowing
class Cat {
  meow() {
    console.log('Meow!');
  }
}

class Dog {
  bark() {
    console.log('Woof!');
  }
}

function makeSound(animal: Cat | Dog) {
  if (animal instanceof Cat) {
    animal.meow();
  } else {
    animal.bark();
  }
}

// 'in' operator narrowing
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}

// Discriminated unions
type Success = { status: 'success'; data: User };
type Error = { status: 'error'; message: string };
type Loading = { status: 'loading' };

type ApiState = Success | Error | Loading;

function handleState(state: ApiState) {
  switch (state.status) {
    case 'success':
      console.log(state.data); // TypeScript knows data exists
      break;
    case 'error':
      console.log(state.message); // TypeScript knows message exists
      break;
    case 'loading':
      console.log('Loading...'); // No extra properties
      break;
  }
}
```

### Union and Intersection Types

```typescript
// Union types (OR)
type PaymentMethod = 'credit-card' | 'paypal' | 'crypto';
type Status = 'active' | 'inactive' | 'pending';

function processPayment(method: PaymentMethod): void {
  // method can only be one of the three values
}

// Intersection types (AND)
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type Auditable = {
  createdBy: string;
  updatedBy: string;
};

type AuditedEntity = Timestamped & Auditable;
// Must have all properties from both types

const entity: AuditedEntity = {
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'admin',
  updatedBy: 'admin',
};

// Combining unions and intersections
type Employee = {
  id: number;
  name: string;
  department: string;
};

type Manager = Employee & {
  teamSize: number;
  reports: Employee[];
};

type Developer = Employee & {
  languages: string[];
  level: 'junior' | 'mid' | 'senior';
};

type TeamMember = Manager | Developer;

function printInfo(member: TeamMember) {
  console.log(member.name); // Common property

  if ('teamSize' in member) {
    console.log(`Manages ${member.teamSize} people`);
  } else {
    console.log(`Knows ${member.languages.join(', ')}`);
  }
}
```

---

## RxJS Core Concepts

### Observables vs Promises

```typescript
import { Observable, from, of } from 'rxjs';

// Promise - single value, eager
const promise = new Promise<number>((resolve) => {
  console.log('Promise executed immediately');
  setTimeout(() => resolve(42), 1000);
});

// Observable - stream of values, lazy
const observable = new Observable<number>((subscriber) => {
  console.log('Observable only executes when subscribed');
  setTimeout(() => {
    subscriber.next(42);
    subscriber.complete();
  }, 1000);
});

// Promise executes immediately
promise.then((value) => console.log('Promise:', value));

// Observable only executes when subscribed
setTimeout(() => {
  observable.subscribe((value) => console.log('Observable:', value));
}, 2000);

// Convert Promise to Observable
const fromPromise$ = from(promise);

// Create Observable from values
const values$ = of(1, 2, 3, 4, 5);
```

**Key Differences:**

| Feature      | Promise               | Observable              |
| ------------ | --------------------- | ----------------------- |
| Values       | Single                | Multiple (stream)       |
| Execution    | Eager                 | Lazy (cold)             |
| Cancellation | No                    | Yes (unsubscribe)       |
| Operators    | Limited (then, catch) | Rich ecosystem          |
| Usage        | One-time operations   | Ongoing events, streams |

### Subjects

Subjects are both Observable and Observer:

```typescript
import { Subject, BehaviorSubject, ReplaySubject, AsyncSubject } from 'rxjs';

// 1. Subject - no initial value, no replay
const subject$ = new Subject<number>();

subject$.subscribe((val) => console.log('A:', val));
subject$.next(1); // A: 1

subject$.subscribe((val) => console.log('B:', val));
subject$.next(2); // A: 2, B: 2

// 2. BehaviorSubject - requires initial value, replays last value
const behavior$ = new BehaviorSubject<number>(0);

behavior$.subscribe((val) => console.log('A:', val)); // A: 0 (initial)
behavior$.next(1); // A: 1

behavior$.subscribe((val) => console.log('B:', val)); // B: 1 (last value)
behavior$.next(2); // A: 2, B: 2

console.log(behavior$.getValue()); // 2 (can get current value)

// 3. ReplaySubject - replays N values to new subscribers
const replay$ = new ReplaySubject<number>(2); // Buffer 2 values

replay$.next(1);
replay$.next(2);
replay$.next(3);

replay$.subscribe((val) => console.log('A:', val));
// A: 2, A: 3 (last 2 values)

// 4. AsyncSubject - emits only last value on complete
const async$ = new AsyncSubject<number>();

async$.subscribe((val) => console.log('A:', val));
async$.next(1);
async$.next(2);
async$.next(3);
async$.complete(); // A: 3 (only on complete)
```

**When to use which:**

- **Subject**: Event bus, multicasting
- **BehaviorSubject**: State management (always has current value)
- **ReplaySubject**: Caching multiple values
- **AsyncSubject**: Single async result (similar to Promise)

### Hot vs Cold Observables

```typescript
import { Observable, interval, share } from 'rxjs';

// Cold Observable - creates new execution for each subscriber
const cold$ = new Observable<number>((subscriber) => {
  console.log('Cold: New execution');
  const id = setInterval(() => subscriber.next(Math.random()), 1000);
  return () => clearInterval(id);
});

cold$.subscribe((val) => console.log('Sub1:', val)); // New execution
cold$.subscribe((val) => console.log('Sub2:', val)); // New execution
// Each gets different random numbers

// Hot Observable - shared execution
const hot$ = interval(1000).pipe(
  share() // Makes it hot
);

hot$.subscribe((val) => console.log('Sub1:', val));
setTimeout(() => {
  hot$.subscribe((val) => console.log('Sub2:', val)); // Joins existing execution
}, 2500);
// Both get same values once Sub2 joins
```

---

## RxJS Operators Deep Dive

### Transformation Operators

#### map

Transforms each value:

```typescript
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

const numbers$ = of(1, 2, 3, 4, 5);

numbers$.pipe(map((x) => x * 2)).subscribe((val) => console.log(val));
// Output: 2, 4, 6, 8, 10

// Real-world example
interface RawUser {
  first_name: string;
  last_name: string;
}

interface User {
  fullName: string;
}

const rawUsers$ = of(
  { first_name: 'John', last_name: 'Doe' },
  { first_name: 'Jane', last_name: 'Smith' }
);

rawUsers$
  .pipe(map((raw) => ({ fullName: `${raw.first_name} ${raw.last_name}` })))
  .subscribe((user) => console.log(user.fullName));
```

### Flattening Operators

The most confusing but most important operators:

#### mergeMap (flatMap)

Subscribes to all inner observables concurrently:

```typescript
import { of, interval } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

// Example 1: Concurrent requests
const users$ = of(1, 2, 3);

users$
  .pipe(
    mergeMap((id) =>
      // Simulates HTTP call
      of(`User ${id}`).pipe(delay(Math.random() * 1000))
    )
  )
  .subscribe(console.log);
// Output order unpredictable: User 2, User 1, User 3

// Real-world: Search with multiple results
function searchUsers(query: string): Observable<User[]> {
  return http.get<User[]>(`/api/users?q=${query}`);
}

searchInput$
  .pipe(
    debounceTime(300),
    distinctUntilChanged(),
    mergeMap((query) => searchUsers(query)) // All searches execute
  )
  .subscribe((results) => console.log(results));
```

**Use mergeMap when:**

- Order doesn't matter
- You want concurrent execution
- Example: Loading multiple independent resources

#### switchMap

Cancels previous inner observable when new value arrives:

```typescript
import { fromEvent } from 'rxjs';
import { switchMap, debounceTime } from 'rxjs/operators';

// Search input
const searchBox = document.getElementById('search');
const search$ = fromEvent(searchBox, 'input');

search$
  .pipe(
    debounceTime(300),
    switchMap((event) => {
      const query = (event.target as HTMLInputElement).value;
      return http.get(`/api/search?q=${query}`);
    })
  )
  .subscribe((results) => displayResults(results));

// If user types fast:
// "a" -> request1 starts
// "ab" -> request1 CANCELLED, request2 starts
// "abc" -> request2 CANCELLED, request3 starts
// Only request3 completes
```

**Use switchMap when:**

- Only the latest value matters
- Want to cancel previous operations
- Example: Typeahead search, navigation

#### concatMap

Queues inner observables, waits for each to complete:

```typescript
import { of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';

const numbers$ = of(1, 2, 3);

numbers$.pipe(concatMap((num) => of(`Request ${num}`).pipe(delay(1000)))).subscribe(console.log);

// Output (one per second in order):
// Request 1 (after 1s)
// Request 2 (after 2s)
// Request 3 (after 3s)

// Real-world: Sequential API calls
function updateUserProfile(updates: Partial<User>[]): Observable<User> {
  return of(...updates).pipe(concatMap((update) => http.patch<User>('/api/user', update)));
}
```

**Use concatMap when:**

- Order matters
- Operations must be sequential
- Example: Sequential API calls, animations

#### exhaustMap

Ignores new values while inner observable is active:

```typescript
import { fromEvent } from 'rxjs';
import { exhaustMap } from 'rxjs/operators';

const saveButton = document.getElementById('save');
const clicks$ = fromEvent(saveButton, 'click');

clicks$
  .pipe(exhaustMap(() => http.post('/api/save', data)))
  .subscribe((response) => console.log('Saved'));

// User clicks 5 times rapidly:
// Click 1 -> request starts
// Click 2 -> IGNORED (request still pending)
// Click 3 -> IGNORED
// Click 4 -> IGNORED
// Click 5 -> IGNORED
// Request completes
```

**Use exhaustMap when:**

- Want to ignore new values during operation
- Prevent duplicate operations
- Example: Save button, login button

### Comparison Table

| Operator       | New Value Arrives              | Use Case                           |
| -------------- | ------------------------------ | ---------------------------------- |
| **mergeMap**   | Subscribe to new, keep old     | Multiple concurrent operations     |
| **switchMap**  | Subscribe to new, cancel old   | Latest value only (search)         |
| **concatMap**  | Queue new, wait for old        | Sequential operations              |
| **exhaustMap** | Ignore new until old completes | Prevent duplicates (button clicks) |

### Combination Operators

#### forkJoin

Waits for all observables to complete, emits last values:

```typescript
import { forkJoin, of } from 'rxjs';
import { delay } from 'rxjs/operators';

// Like Promise.all()
const user$ = http.get('/api/user/1');
const posts$ = http.get('/api/posts');
const comments$ = http.get('/api/comments');

forkJoin({
  user: user$,
  posts: posts$,
  comments: comments$,
}).subscribe(({ user, posts, comments }) => {
  console.log('All loaded:', user, posts, comments);
});

// ⚠️ If any observable errors, forkJoin errors
// ⚠️ If any observable doesn't complete, forkJoin never emits
```

#### combineLatest

Emits whenever ANY observable emits, using latest value from each:

```typescript
import { combineLatest, of } from 'rxjs';

const firstName$ = of('John');
const lastName$ = of('Doe');
const age$ = of(30);

combineLatest([firstName$, lastName$, age$])
  .pipe(map(([first, last, age]) => ({ fullName: `${first} ${last}`, age })))
  .subscribe(console.log);

// Real-world: Reactive form
const filters$ = combineLatest({
  category: categorySelect$,
  priceRange: priceSlider$,
  sortBy: sortDropdown$,
}).pipe(
  debounceTime(300),
  switchMap((filters) => http.get('/api/products', { params: filters }))
);
```

#### withLatestFrom

Emits when source emits, includes latest from other observables:

```typescript
import { fromEvent } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

const clicks$ = fromEvent(button, 'click');
const currentUser$ = userService.currentUser$;

clicks$
  .pipe(
    withLatestFrom(currentUser$),
    map(([clickEvent, user]) => ({ event: clickEvent, user }))
  )
  .subscribe(({ event, user }) => {
    console.log(`User ${user.name} clicked at`, event.clientX, event.clientY);
  });
```

### Error Handling

```typescript
import { of, throwError } from 'rxjs';
import { catchError, retry, retryWhen, delay, tap } from 'rxjs/operators';

// catchError - handle errors and return fallback
http
  .get('/api/user')
  .pipe(
    catchError((error) => {
      console.error('Error:', error);
      return of({ id: 0, name: 'Guest' }); // Fallback value
    })
  )
  .subscribe((user) => console.log(user));

// retry - retry N times on error
http
  .get('/api/data')
  .pipe(
    retry(3), // Retry up to 3 times
    catchError((error) => {
      console.error('Failed after 3 retries:', error);
      return throwError(() => error);
    })
  )
  .subscribe();

// retryWhen - custom retry logic
http
  .get('/api/data')
  .pipe(
    retryWhen((errors) =>
      errors.pipe(
        tap((err) => console.log('Retrying after error:', err)),
        delay(1000), // Wait 1 second before retry
        take(3) // Max 3 retries
      )
    )
  )
  .subscribe();

// Error recovery strategies
function fetchUserWithFallback(id: number): Observable<User> {
  return http.get<User>(`/api/user/${id}`).pipe(
    retry(2),
    catchError((error) => {
      if (error.status === 404) {
        // User not found, return default
        return of({ id, name: 'Unknown User', email: '' });
      }
      // Other errors, try cache
      return cacheService.getUser(id).pipe(catchError(() => throwError(() => error)));
    })
  );
}
```

---

## Real-World Angular + RxJS Patterns

### API Service with Observables

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of, timer } from 'rxjs';
import { catchError, retry, shareReplay, map, switchMap } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly API_URL = 'https://jsonplaceholder.typicode.com';

  // Cache users for 5 minutes
  private usersCache$: Observable<User[]> | null = null;

  constructor(private http: HttpClient) {}

  // Get all users with caching
  getUsers(): Observable<User[]> {
    if (!this.usersCache$) {
      this.usersCache$ = this.http
        .get<User[]>(`${this.API_URL}/users`)
        .pipe(
          retry(2),
          shareReplay({ bufferSize: 1, refCount: true }),
          catchError(this.handleError)
        );

      // Clear cache after 5 minutes
      timer(300000).subscribe(() => (this.usersCache$ = null));
    }

    return this.usersCache$;
  }

  // Get single user
  getUser(id: number): Observable<User> {
    return this.http
      .get<User>(`${this.API_URL}/users/${id}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Get user with their posts
  getUserWithPosts(userId: number): Observable<{ user: User; posts: Post[] }> {
    return this.getUser(userId).pipe(
      switchMap((user) => this.getUserPosts(userId).pipe(map((posts) => ({ user, posts })))),
      catchError(this.handleError)
    );
  }

  // Get user posts
  getUserPosts(userId: number): Observable<Post[]> {
    return this.http
      .get<Post[]>(`${this.API_URL}/posts?userId=${userId}`)
      .pipe(retry(2), catchError(this.handleError));
  }

  // Create post
  createPost(post: Omit<Post, 'id'>): Observable<Post> {
    return this.http.post<Post>(`${this.API_URL}/posts`, post).pipe(catchError(this.handleError));
  }

  // Update post
  updatePost(id: number, post: Partial<Post>): Observable<Post> {
    return this.http
      .patch<Post>(`${this.API_URL}/posts/${id}`, post)
      .pipe(catchError(this.handleError));
  }

  // Delete post
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/posts/${id}`).pipe(catchError(this.handleError));
  }

  // Search posts
  searchPosts(query: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.API_URL}/posts`).pipe(
      map((posts) =>
        posts.filter(
          (post) =>
            post.title.toLowerCase().includes(query.toLowerCase()) ||
            post.body.toLowerCase().includes(query.toLowerCase())
        )
      ),
      catchError(this.handleError)
    );
  }

  // Error handling
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server Error: ${error.status} - ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Clear cache manually
  clearCache(): void {
    this.usersCache$ = null;
  }
}
```

### State Management Service

```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

interface AppState {
  users: User[];
  selectedUserId: number | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private state$ = new BehaviorSubject<AppState>({
    users: [],
    selectedUserId: null,
    loading: false,
    error: null,
  });

  // Selectors
  readonly users$ = this.select((state) => state.users);
  readonly selectedUserId$ = this.select((state) => state.selectedUserId);
  readonly loading$ = this.select((state) => state.loading);
  readonly error$ = this.select((state) => state.error);

  // Computed selector
  readonly selectedUser$ = combineLatest([this.users$, this.selectedUserId$]).pipe(
    map(([users, selectedId]) => (selectedId ? users.find((u) => u.id === selectedId) : null))
  );

  constructor(private apiService: ApiService) {
    this.loadUsers();
  }

  // Actions
  loadUsers(): void {
    this.updateState({ loading: true, error: null });

    this.apiService.getUsers().subscribe({
      next: (users) => this.updateState({ users, loading: false }),
      error: (error) =>
        this.updateState({
          loading: false,
          error: error.message,
        }),
    });
  }

  selectUser(userId: number | null): void {
    this.updateState({ selectedUserId: userId });
  }

  addUser(user: User): void {
    const users = [...this.state$.value.users, user];
    this.updateState({ users });
  }

  updateUser(updatedUser: User): void {
    const users = this.state$.value.users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    this.updateState({ users });
  }

  deleteUser(userId: number): void {
    const users = this.state$.value.users.filter((u) => u.id !== userId);
    this.updateState({ users, selectedUserId: null });
  }

  // Helper methods
  private select<T>(selector: (state: AppState) => T): Observable<T> {
    return this.state$.pipe(map(selector), distinctUntilChanged());
  }

  private updateState(partial: Partial<AppState>): void {
    this.state$.next({ ...this.state$.value, ...partial });
  }

  getState(): AppState {
    return this.state$.value;
  }
}
```

### Component with RxJS

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, merge } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
  startWith,
  catchError,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'app-user-search',
  template: `
    <div class="search-container">
      <input [formControl]="searchControl" placeholder="Search users..." type="text" />

      <div *ngIf="loading$ | async" class="loading">Loading...</div>
      <div *ngIf="error$ | async as error" class="error">{{ error }}</div>

      <div class="results">
        <div *ngFor="let user of users$ | async" class="user-card">
          <h3>{{ user.name }}</h3>
          <p>{{ user.email }}</p>
        </div>
      </div>
    </div>
  `,
})
export class UserSearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');

  private destroy$ = new Subject<void>();
  private loading$ = new BehaviorSubject<boolean>(false);
  private error$ = new BehaviorSubject<string | null>(null);

  users$ = this.searchControl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => {
      this.loading$.next(true);
      this.error$.next(null);
    }),
    switchMap((query) =>
      this.apiService.searchUsers(query).pipe(
        tap(() => this.loading$.next(false)),
        catchError((error) => {
          this.loading$.next(false);
          this.error$.next(error.message);
          return of([]);
        })
      )
    ),
    takeUntil(this.destroy$)
  );

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    // Component initialized
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## Practical Exercises

### Exercise 1: Build a Fake API Service

```typescript
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

@Injectable({
  providedIn: 'root',
})
export class FakeTodoService {
  private todos: Todo[] = [
    { id: 1, title: 'Learn TypeScript', completed: true, userId: 1 },
    { id: 2, title: 'Master RxJS', completed: false, userId: 1 },
    { id: 3, title: 'Build Angular App', completed: false, userId: 1 },
  ];

  // TODO: Implement these methods
  getTodos(): Observable<Todo[]> {
    // Return todos after 500ms delay
    return of(this.todos).pipe(delay(500));
  }

  getTodo(id: number): Observable<Todo> {
    // Return single todo or error if not found
    const todo = this.todos.find((t) => t.id === id);
    return todo ? of(todo).pipe(delay(300)) : throwError(() => new Error('Todo not found'));
  }

  createTodo(todo: Omit<Todo, 'id'>): Observable<Todo> {
    // Create new todo with generated ID
    const newTodo = { ...todo, id: Date.now() };
    this.todos.push(newTodo);
    return of(newTodo).pipe(delay(300));
  }

  updateTodo(id: number, updates: Partial<Todo>): Observable<Todo> {
    // Update existing todo
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) {
      return throwError(() => new Error('Todo not found'));
    }
    this.todos[index] = { ...this.todos[index], ...updates };
    return of(this.todos[index]).pipe(delay(300));
  }

  deleteTodo(id: number): Observable<void> {
    // Delete todo
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) {
      return throwError(() => new Error('Todo not found'));
    }
    this.todos.splice(index, 1);
    return of(void 0).pipe(delay(300));
  }
}
```

### Exercise 2: Chain Operators

Debug and fix this code:

```typescript
// PROBLEM: This code has issues. Find and fix them!

searchInput$
  .pipe(
    // Add debounce
    switchMap((query) => this.apiService.search(query))
    // Handle errors
    // Cache results
    // Prevent duplicate searches
  )
  .subscribe((results) => {
    this.displayResults(results);
  });

// SOLUTION:
searchInput$
  .pipe(
    debounceTime(300), // Wait for user to stop typing
    distinctUntilChanged(), // Prevent duplicate searches
    filter((query) => query.length >= 3), // Min 3 characters
    switchMap((query) =>
      this.apiService.search(query).pipe(
        catchError((error) => {
          console.error('Search error:', error);
          return of([]); // Return empty array on error
        })
      )
    ),
    shareReplay({ bufferSize: 1, refCount: true }) // Cache last result
  )
  .subscribe((results) => {
    this.displayResults(results);
  });
```

### Exercise 3: Implement Polling

```typescript
// Poll API every 5 seconds
function pollData(): Observable<Data> {
  return interval(5000).pipe(
    startWith(0), // Start immediately
    switchMap(() => http.get<Data>('/api/data')),
    retry(2),
    catchError((error) => {
      console.error('Poll error:', error);
      return of(null); // Continue polling on error
    }),
    filter((data) => data !== null), // Filter out errors
    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
  );
}
```

---

## Interview Questions

### TypeScript Questions

1. **What's the difference between `interface` and `type`?**

   - Interfaces can be extended and merged, types are more flexible with unions/intersections
   - Use interface for object shapes, type for complex types

2. **Explain generics and give an example.**

   - Allow type-safe reusable code
   - Example: `Array<T>`, `Promise<T>`, generic functions

3. **What are utility types? Name 5.**

   - `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`

4. **What is type narrowing?**

   - Refining union types using type guards, typeof, instanceof, discriminated unions

5. **When to use `enum` vs `const` object?**
   - Const object with `as const` is often better (tree-shakable, better errors)

### RxJS Questions

1. **Explain the difference between `mergeMap`, `switchMap`, `concatMap`, and `exhaustMap`.**

   - See comparison table above

2. **What's the difference between Subject and BehaviorSubject?**

   - BehaviorSubject requires initial value and always has current value
   - Subject has no initial value, new subscribers get nothing until next emission

3. **Hot vs Cold observables?**

   - Cold: New execution per subscriber (HTTP requests)
   - Hot: Shared execution (DOM events, subjects)

4. **How do you handle errors in RxJS?**

   - `catchError`, `retry`, `retryWhen`
   - Always return an Observable from catchError

5. **When to use `forkJoin` vs `combineLatest`?**

   - forkJoin: Like Promise.all, waits for all to complete
   - combineLatest: Emits on any change, ongoing streams

6. **How to prevent memory leaks with subscriptions?**

   - Unsubscribe in ngOnDestroy
   - Use `takeUntil(destroy$)`
   - Use `async` pipe in templates (auto-unsubscribe)

7. **What is `shareReplay` and when to use it?**
   - Multicasts observable and replays values to new subscribers
   - Use for caching API calls

### Practical Questions

1. **Implement typeahead search with debouncing**

   ```typescript
   searchInput$.pipe(
     debounceTime(300),
     distinctUntilChanged(),
     filter((query) => query.length >= 3),
     switchMap((query) => this.search(query))
   );
   ```

2. **How to load data from multiple APIs in parallel?**

   ```typescript
   forkJoin({
     users: this.getUsers(),
     posts: this.getPosts(),
     comments: this.getComments(),
   });
   ```

3. **Implement a button that prevents double-clicks**
   ```typescript
   button.clicks$.pipe(exhaustMap(() => this.saveData()));
   ```

---

## Summary

### TypeScript Key Takeaways

- Use interfaces for object shapes, types for complex types
- Leverage generics for type-safe reusable code
- Master utility types: Partial, Pick, Omit, Record
- Use type narrowing with guards and discriminated unions
- Prefer const objects over enums

### RxJS Key Takeaways

- Understand the flattening operators deeply
- Use switchMap for latest value (search)
- Use concatMap for sequential operations
- Use mergeMap for concurrent operations
- Use exhaustMap to ignore while busy
- BehaviorSubject for state, Subject for events
- Always handle errors with catchError
- Prevent memory leaks with takeUntil or async pipe
- Use shareReplay for caching

### Best Practices

- Keep observables cold when possible
- Unsubscribe to prevent memory leaks
- Use async pipe in templates
- Handle errors at appropriate levels
- Use type guards for better type safety
- Leverage TypeScript strict mode

---

**Next Steps:**

- Build a complete CRUD app with TypeScript + RxJS
- Practice operator chaining
- Study real Angular codebases
- Review common patterns (state management, caching, error handling)

Good luck with your interview! 🚀
