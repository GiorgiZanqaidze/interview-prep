# Day 3 – Algorithms & Data Structures for Angular Developers

**Goal:** Master essential algorithms and data structures commonly asked in Angular/Frontend interviews.

---

## Table of Contents

1. [Time & Space Complexity](#time--space-complexity)
2. [Arrays & Strings](#arrays--strings)
3. [Hash Tables & Maps](#hash-tables--maps)
4. [Stacks & Queues](#stacks--queues)
5. [Linked Lists](#linked-lists)
6. [Trees & Graphs](#trees--graphs)
7. [Sorting Algorithms](#sorting-algorithms)
8. [Searching Algorithms](#searching-algorithms)
9. [Problem-Solving Patterns](#problem-solving-patterns)
10. [Angular-Specific Algorithm Applications](#angular-specific-algorithm-applications)
11. [Common Interview Problems](#common-interview-problems)
12. [Practice Exercises](#practice-exercises)

---

## Time & Space Complexity

### Big O Notation

Understanding algorithm efficiency is crucial for technical interviews:

```typescript
// O(1) - Constant Time
function getFirstElement<T>(arr: T[]): T | undefined {
  return arr[0]; // Always one operation
}

// O(n) - Linear Time
function findElement<T>(arr: T[], target: T): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// O(n²) - Quadratic Time
function hasDuplicates(arr: number[]): boolean {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}

// O(log n) - Logarithmic Time
function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}

// O(n log n) - Linearithmic Time
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0,
    j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}
```

### Complexity Cheat Sheet

| Complexity | Name         | Example                         |
| ---------- | ------------ | ------------------------------- |
| O(1)       | Constant     | Array access, hash table lookup |
| O(log n)   | Logarithmic  | Binary search                   |
| O(n)       | Linear       | Loop through array              |
| O(n log n) | Linearithmic | Merge sort, quick sort          |
| O(n²)      | Quadratic    | Nested loops                    |
| O(2ⁿ)      | Exponential  | Recursive fibonacci             |
| O(n!)      | Factorial    | Permutations                    |

**Space Complexity**: Consider auxiliary space used by algorithm (not including input).

---

## Arrays & Strings

### Common Array Operations

```typescript
// Two Pointers Technique
function reverseArray<T>(arr: T[]): T[] {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }

  return arr;
}

// Sliding Window
function maxSubarraySum(arr: number[], k: number): number {
  if (arr.length < k) return 0;

  let maxSum = 0;
  let windowSum = 0;

  // Calculate first window
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }
  maxSum = windowSum;

  // Slide the window
  for (let i = k; i < arr.length; i++) {
    windowSum = windowSum - arr[i - k] + arr[i];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}

// Remove Duplicates (in-place)
function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;

  let i = 0;
  for (let j = 1; j < nums.length; j++) {
    if (nums[j] !== nums[i]) {
      i++;
      nums[i] = nums[j];
    }
  }

  return i + 1;
}

// Rotate Array
function rotateArray(nums: number[], k: number): void {
  k = k % nums.length;
  reverse(nums, 0, nums.length - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, nums.length - 1);
}

function reverse(nums: number[], start: number, end: number): void {
  while (start < end) {
    [nums[start], nums[end]] = [nums[end], nums[start]];
    start++;
    end--;
  }
}
```

### String Manipulation

```typescript
// Check if Palindrome
function isPalindrome(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = cleaned.length - 1;

  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }

  return true;
}

// Find First Non-Repeating Character
function firstUniqueChar(s: string): number {
  const charCount = new Map<string, number>();

  // Count occurrences
  for (const char of s) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }

  // Find first with count 1
  for (let i = 0; i < s.length; i++) {
    if (charCount.get(s[i]) === 1) return i;
  }

  return -1;
}

// Anagram Check
function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const charCount = new Map<string, number>();

  for (const char of s) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }

  for (const char of t) {
    if (!charCount.has(char)) return false;
    charCount.set(char, charCount.get(char)! - 1);
    if (charCount.get(char)! < 0) return false;
  }

  return true;
}

// Longest Substring Without Repeating Characters
function lengthOfLongestSubstring(s: string): number {
  const seen = new Map<string, number>();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    if (seen.has(char) && seen.get(char)! >= left) {
      left = seen.get(char)! + 1;
    }

    seen.set(char, right);
    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}
```

---

## Hash Tables & Maps

### Map vs Set in TypeScript

```typescript
// Map - key-value pairs
const userMap = new Map<number, string>();
userMap.set(1, 'Alice');
userMap.set(2, 'Bob');

console.log(userMap.get(1)); // 'Alice'
console.log(userMap.has(2)); // true
console.log(userMap.size); // 2

userMap.delete(1);
userMap.clear();

// Set - unique values
const uniqueIds = new Set<number>();
uniqueIds.add(1);
uniqueIds.add(2);
uniqueIds.add(1); // Ignored (duplicate)

console.log(uniqueIds.has(1)); // true
console.log(uniqueIds.size); // 2

// Common Hash Table Problems
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }

    map.set(nums[i], i);
  }

  return [];
}

// Group Anagrams
function groupAnagrams(strs: string[]): string[][] {
  const map = new Map<string, string[]>();

  for (const str of strs) {
    const sorted = str.split('').sort().join('');

    if (!map.has(sorted)) {
      map.set(sorted, []);
    }

    map.get(sorted)!.push(str);
  }

  return Array.from(map.values());
}

// LRU Cache Implementation
class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, V>;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;

    // Move to end (most recently used)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  put(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }
}
```

---

## Stacks & Queues

### Stack Implementation

```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }
}

// Valid Parentheses
function isValidParentheses(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = {
    ')': '(',
    '}': '{',
    ']': '[',
  };

  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.length === 0 || stack.pop() !== pairs[char]) {
        return false;
      }
    }
  }

  return stack.length === 0;
}

// Evaluate Reverse Polish Notation
function evalRPN(tokens: string[]): number {
  const stack: number[] = [];
  const operators = new Set(['+', '-', '*', '/']);

  for (const token of tokens) {
    if (operators.has(token)) {
      const b = stack.pop()!;
      const a = stack.pop()!;

      switch (token) {
        case '+':
          stack.push(a + b);
          break;
        case '-':
          stack.push(a - b);
          break;
        case '*':
          stack.push(a * b);
          break;
        case '/':
          stack.push(Math.trunc(a / b));
          break;
      }
    } else {
      stack.push(parseInt(token));
    }
  }

  return stack[0];
}
```

### Queue Implementation

```typescript
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  clear(): void {
    this.items = [];
  }
}

// Circular Queue
class CircularQueue<T> {
  private items: (T | undefined)[];
  private front = 0;
  private rear = 0;
  private size = 0;

  constructor(private capacity: number) {
    this.items = new Array(capacity);
  }

  enqueue(item: T): boolean {
    if (this.isFull()) return false;

    this.items[this.rear] = item;
    this.rear = (this.rear + 1) % this.capacity;
    this.size++;

    return true;
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;

    const item = this.items[this.front];
    this.items[this.front] = undefined;
    this.front = (this.front + 1) % this.capacity;
    this.size--;

    return item;
  }

  isEmpty(): boolean {
    return this.size === 0;
  }

  isFull(): boolean {
    return this.size === this.capacity;
  }
}
```

---

## Linked Lists

### Singly Linked List

```typescript
class ListNode<T> {
  value: T;
  next: ListNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

class LinkedList<T> {
  head: ListNode<T> | null = null;
  tail: ListNode<T> | null = null;
  length = 0;

  append(value: T): void {
    const newNode = new ListNode(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }

    this.length++;
  }

  prepend(value: T): void {
    const newNode = new ListNode(value);
    newNode.next = this.head;
    this.head = newNode;

    if (!this.tail) {
      this.tail = newNode;
    }

    this.length++;
  }

  delete(value: T): boolean {
    if (!this.head) return false;

    if (this.head.value === value) {
      this.head = this.head.next;
      this.length--;
      return true;
    }

    let current = this.head;
    while (current.next) {
      if (current.next.value === value) {
        current.next = current.next.next;
        if (!current.next) {
          this.tail = current;
        }
        this.length--;
        return true;
      }
      current = current.next;
    }

    return false;
  }

  find(value: T): ListNode<T> | null {
    let current = this.head;

    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }

    return null;
  }

  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;

    while (current) {
      result.push(current.value);
      current = current.next;
    }

    return result;
  }
}

// Common Linked List Problems
function reverseLinkedList<T>(head: ListNode<T> | null): ListNode<T> | null {
  let prev: ListNode<T> | null = null;
  let current = head;

  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  return prev;
}

// Detect Cycle (Floyd's Cycle Detection)
function hasCycle<T>(head: ListNode<T> | null): boolean {
  if (!head) return false;

  let slow: ListNode<T> | null = head;
  let fast: ListNode<T> | null = head;

  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;

    if (slow === fast) return true;
  }

  return false;
}

// Find Middle Node
function findMiddle<T>(head: ListNode<T> | null): ListNode<T> | null {
  if (!head) return null;

  let slow: ListNode<T> | null = head;
  let fast: ListNode<T> | null = head;

  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
  }

  return slow;
}

// Merge Two Sorted Lists
function mergeTwoLists(
  l1: ListNode<number> | null,
  l2: ListNode<number> | null
): ListNode<number> | null {
  const dummy = new ListNode(0);
  let current = dummy;

  while (l1 && l2) {
    if (l1.value < l2.value) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }

  current.next = l1 || l2;

  return dummy.next;
}
```

---

## Trees & Graphs

### Binary Tree

```typescript
class TreeNode<T> {
  value: T;
  left: TreeNode<T> | null = null;
  right: TreeNode<T> | null = null;

  constructor(value: T) {
    this.value = value;
  }
}

// Tree Traversals
class BinaryTree<T> {
  root: TreeNode<T> | null = null;

  // Depth-First Search (DFS) - Inorder (Left, Root, Right)
  inorderTraversal(node: TreeNode<T> | null = this.root): T[] {
    if (!node) return [];

    return [...this.inorderTraversal(node.left), node.value, ...this.inorderTraversal(node.right)];
  }

  // DFS - Preorder (Root, Left, Right)
  preorderTraversal(node: TreeNode<T> | null = this.root): T[] {
    if (!node) return [];

    return [
      node.value,
      ...this.preorderTraversal(node.left),
      ...this.preorderTraversal(node.right),
    ];
  }

  // DFS - Postorder (Left, Right, Root)
  postorderTraversal(node: TreeNode<T> | null = this.root): T[] {
    if (!node) return [];

    return [
      ...this.postorderTraversal(node.left),
      ...this.postorderTraversal(node.right),
      node.value,
    ];
  }

  // Breadth-First Search (BFS) - Level Order
  levelOrderTraversal(): T[][] {
    if (!this.root) return [];

    const result: T[][] = [];
    const queue: TreeNode<T>[] = [this.root];

    while (queue.length > 0) {
      const levelSize = queue.length;
      const currentLevel: T[] = [];

      for (let i = 0; i < levelSize; i++) {
        const node = queue.shift()!;
        currentLevel.push(node.value);

        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }

      result.push(currentLevel);
    }

    return result;
  }

  // Max Depth
  maxDepth(node: TreeNode<T> | null = this.root): number {
    if (!node) return 0;
    return 1 + Math.max(this.maxDepth(node.left), this.maxDepth(node.right));
  }

  // Is Valid BST
  isValidBST(
    node: TreeNode<number> | null = this.root as TreeNode<number> | null,
    min = -Infinity,
    max = Infinity
  ): boolean {
    if (!node) return true;

    if (node.value <= min || node.value >= max) return false;

    return (
      this.isValidBST(node.left, min, node.value) && this.isValidBST(node.right, node.value, max)
    );
  }
}

// Common Tree Problems
function invertTree<T>(root: TreeNode<T> | null): TreeNode<T> | null {
  if (!root) return null;

  [root.left, root.right] = [root.right, root.left];

  invertTree(root.left);
  invertTree(root.right);

  return root;
}

function lowestCommonAncestor<T>(
  root: TreeNode<T> | null,
  p: TreeNode<T>,
  q: TreeNode<T>
): TreeNode<T> | null {
  if (!root || root === p || root === q) return root;

  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);

  if (left && right) return root;
  return left || right;
}
```

### Graph

```typescript
// Graph Representation (Adjacency List)
class Graph<T> {
  private adjacencyList: Map<T, T[]> = new Map();

  addVertex(vertex: T): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(vertex1: T, vertex2: T): void {
    this.addVertex(vertex1);
    this.addVertex(vertex2);

    this.adjacencyList.get(vertex1)!.push(vertex2);
    this.adjacencyList.get(vertex2)!.push(vertex1); // Undirected graph
  }

  // Depth-First Search
  dfs(start: T): T[] {
    const visited = new Set<T>();
    const result: T[] = [];

    const dfsHelper = (vertex: T) => {
      visited.add(vertex);
      result.push(vertex);

      for (const neighbor of this.adjacencyList.get(vertex) || []) {
        if (!visited.has(neighbor)) {
          dfsHelper(neighbor);
        }
      }
    };

    dfsHelper(start);
    return result;
  }

  // Breadth-First Search
  bfs(start: T): T[] {
    const visited = new Set<T>();
    const queue: T[] = [start];
    const result: T[] = [];

    visited.add(start);

    while (queue.length > 0) {
      const vertex = queue.shift()!;
      result.push(vertex);

      for (const neighbor of this.adjacencyList.get(vertex) || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    return result;
  }
}

// Common Graph Problems
function canFinish(numCourses: number, prerequisites: number[][]): boolean {
  const graph = new Map<number, number[]>();
  const inDegree = new Array(numCourses).fill(0);

  // Build graph
  for (const [course, prereq] of prerequisites) {
    if (!graph.has(prereq)) {
      graph.set(prereq, []);
    }
    graph.get(prereq)!.push(course);
    inDegree[course]++;
  }

  // Find courses with no prerequisites
  const queue: number[] = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) {
      queue.push(i);
    }
  }

  let completed = 0;

  while (queue.length > 0) {
    const course = queue.shift()!;
    completed++;

    for (const next of graph.get(course) || []) {
      inDegree[next]--;
      if (inDegree[next] === 0) {
        queue.push(next);
      }
    }
  }

  return completed === numCourses;
}
```

---

## Sorting Algorithms

```typescript
// Bubble Sort - O(n²)
function bubbleSort(arr: number[]): number[] {
  const result = [...arr];

  for (let i = 0; i < result.length; i++) {
    for (let j = 0; j < result.length - i - 1; j++) {
      if (result[j] > result[j + 1]) {
        [result[j], result[j + 1]] = [result[j + 1], result[j]];
      }
    }
  }

  return result;
}

// Selection Sort - O(n²)
function selectionSort(arr: number[]): number[] {
  const result = [...arr];

  for (let i = 0; i < result.length; i++) {
    let minIndex = i;

    for (let j = i + 1; j < result.length; j++) {
      if (result[j] < result[minIndex]) {
        minIndex = j;
      }
    }

    [result[i], result[minIndex]] = [result[minIndex], result[i]];
  }

  return result;
}

// Insertion Sort - O(n²), but efficient for small/nearly sorted arrays
function insertionSort(arr: number[]): number[] {
  const result = [...arr];

  for (let i = 1; i < result.length; i++) {
    const key = result[i];
    let j = i - 1;

    while (j >= 0 && result[j] > key) {
      result[j + 1] = result[j];
      j--;
    }

    result[j + 1] = key;
  }

  return result;
}

// Quick Sort - O(n log n) average, O(n²) worst
function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const pivot = arr[Math.floor(arr.length / 2)];
  const left = arr.filter((x) => x < pivot);
  const middle = arr.filter((x) => x === pivot);
  const right = arr.filter((x) => x > pivot);

  return [...quickSort(left), ...middle, ...quickSort(right)];
}

// Merge Sort - O(n log n) - Already shown above

// Comparison Table
/*
| Algorithm      | Best       | Average    | Worst      | Space      | Stable |
|----------------|------------|------------|------------|------------|--------|
| Bubble Sort    | O(n)       | O(n²)      | O(n²)      | O(1)       | Yes    |
| Selection Sort | O(n²)      | O(n²)      | O(n²)      | O(1)       | No     |
| Insertion Sort | O(n)       | O(n²)      | O(n²)      | O(1)       | Yes    |
| Merge Sort     | O(n log n) | O(n log n) | O(n log n) | O(n)       | Yes    |
| Quick Sort     | O(n log n) | O(n log n) | O(n²)      | O(log n)   | No     |
*/
```

---

## Searching Algorithms

```typescript
// Linear Search - O(n)
function linearSearch<T>(arr: T[], target: T): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

// Binary Search - O(log n) - requires sorted array
function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}

// Binary Search (Recursive)
function binarySearchRecursive(
  arr: number[],
  target: number,
  left = 0,
  right = arr.length - 1
): number {
  if (left > right) return -1;

  const mid = Math.floor((left + right) / 2);

  if (arr[mid] === target) return mid;
  if (arr[mid] < target) {
    return binarySearchRecursive(arr, target, mid + 1, right);
  }
  return binarySearchRecursive(arr, target, left, mid - 1);
}

// Find First and Last Position of Element
function searchRange(nums: number[], target: number): [number, number] {
  const findFirst = (): number => {
    let left = 0;
    let right = nums.length - 1;
    let result = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (nums[mid] === target) {
        result = mid;
        right = mid - 1; // Continue searching left
      } else if (nums[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return result;
  };

  const findLast = (): number => {
    let left = 0;
    let right = nums.length - 1;
    let result = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (nums[mid] === target) {
        result = mid;
        left = mid + 1; // Continue searching right
      } else if (nums[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return result;
  };

  return [findFirst(), findLast()];
}
```

---

## Problem-Solving Patterns

### 1. Two Pointers

```typescript
// Remove duplicates from sorted array
function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;

  let slow = 0;

  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }

  return slow + 1;
}

// Container with most water
function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let maxArea = 0;

  while (left < right) {
    const area = Math.min(height[left], height[right]) * (right - left);
    maxArea = Math.max(maxArea, area);

    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxArea;
}
```

### 2. Sliding Window

```typescript
// Longest substring with at most K distinct characters
function lengthOfLongestSubstringKDistinct(s: string, k: number): number {
  if (k === 0) return 0;

  const charCount = new Map<string, number>();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    charCount.set(char, (charCount.get(char) || 0) + 1);

    while (charCount.size > k) {
      const leftChar = s[left];
      charCount.set(leftChar, charCount.get(leftChar)! - 1);

      if (charCount.get(leftChar) === 0) {
        charCount.delete(leftChar);
      }

      left++;
    }

    maxLength = Math.max(maxLength, right - left + 1);
  }

  return maxLength;
}
```

### 3. Fast & Slow Pointers

```typescript
// Find cycle start in linked list
function detectCycleStart<T>(head: ListNode<T> | null): ListNode<T> | null {
  let slow: ListNode<T> | null = head;
  let fast: ListNode<T> | null = head;

  // Find if cycle exists
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;

    if (slow === fast) break;
  }

  if (!fast || !fast.next) return null;

  // Find cycle start
  slow = head;
  while (slow !== fast) {
    slow = slow!.next;
    fast = fast!.next;
  }

  return slow;
}
```

### 4. Dynamic Programming

```typescript
// Fibonacci with Memoization
function fibonacci(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 1) return n;

  if (memo.has(n)) return memo.get(n)!;

  const result = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  memo.set(n, result);

  return result;
}

// Climbing Stairs
function climbStairs(n: number): number {
  if (n <= 2) return n;

  let prev = 1;
  let curr = 2;

  for (let i = 3; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }

  return curr;
}

// Coin Change
function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}
```

---

## Angular-Specific Algorithm Applications

### 1. Virtual Scrolling Algorithm

```typescript
interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  items: any[];
}

class VirtualScroller {
  private config: VirtualScrollConfig;

  constructor(config: VirtualScrollConfig) {
    this.config = config;
  }

  getVisibleRange(scrollTop: number): { start: number; end: number; offsetY: number } {
    const { itemHeight, containerHeight, items } = this.config;

    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(start + visibleCount + 1, items.length);

    return {
      start,
      end,
      offsetY: start * itemHeight,
    };
  }

  getTotalHeight(): number {
    return this.config.items.length * this.config.itemHeight;
  }
}
```

### 2. Debounce & Throttle

```typescript
// Debounce - waits for silence
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Throttle - limits execution rate
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```

### 3. Memoization for Expensive Computations

```typescript
function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);

    return result;
  }) as T;
}

// Usage in Angular
const expensiveCalculation = memoize((data: number[]) => {
  return data.reduce((sum, val) => sum + val ** 2, 0);
});
```

### 4. Tree Flattening (for Nested Menus)

```typescript
interface MenuItem {
  id: string;
  label: string;
  children?: MenuItem[];
}

function flattenTree(items: MenuItem[]): MenuItem[] {
  const result: MenuItem[] = [];

  function traverse(items: MenuItem[], depth = 0) {
    for (const item of items) {
      result.push({ ...item, depth } as any);

      if (item.children) {
        traverse(item.children, depth + 1);
      }
    }
  }

  traverse(items);
  return result;
}
```

---

## Common Interview Problems

### Easy Level

```typescript
// 1. Reverse Integer
function reverseInteger(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const reversed = parseInt(Math.abs(x).toString().split('').reverse().join(''));

  if (reversed > 2 ** 31 - 1) return 0;

  return sign * reversed;
}

// 2. Missing Number
function missingNumber(nums: number[]): number {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((sum, num) => sum + num, 0);

  return expectedSum - actualSum;
}

// 3. Move Zeroes
function moveZeroes(nums: number[]): void {
  let nonZeroIndex = 0;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      [nums[nonZeroIndex], nums[i]] = [nums[i], nums[nonZeroIndex]];
      nonZeroIndex++;
    }
  }
}

// 4. Best Time to Buy and Sell Stock
function maxProfit(prices: number[]): number {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    maxProfit = Math.max(maxProfit, price - minPrice);
  }

  return maxProfit;
}
```

### Medium Level

```typescript
// 1. Product of Array Except Self
function productExceptSelf(nums: number[]): number[] {
  const result = new Array(nums.length).fill(1);

  // Left products
  let leftProduct = 1;
  for (let i = 0; i < nums.length; i++) {
    result[i] = leftProduct;
    leftProduct *= nums[i];
  }

  // Right products
  let rightProduct = 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    result[i] *= rightProduct;
    rightProduct *= nums[i];
  }

  return result;
}

// 2. Longest Palindromic Substring
function longestPalindrome(s: string): string {
  if (s.length < 2) return s;

  let start = 0;
  let maxLength = 1;

  function expandAroundCenter(left: number, right: number): void {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      const currentLength = right - left + 1;

      if (currentLength > maxLength) {
        start = left;
        maxLength = currentLength;
      }

      left--;
      right++;
    }
  }

  for (let i = 0; i < s.length; i++) {
    expandAroundCenter(i, i); // Odd length
    expandAroundCenter(i, i + 1); // Even length
  }

  return s.substring(start, start + maxLength);
}

// 3. Spiral Matrix
function spiralOrder(matrix: number[][]): number[] {
  if (matrix.length === 0) return [];

  const result: number[] = [];
  let top = 0;
  let bottom = matrix.length - 1;
  let left = 0;
  let right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    // Right
    for (let i = left; i <= right; i++) {
      result.push(matrix[top][i]);
    }
    top++;

    // Down
    for (let i = top; i <= bottom; i++) {
      result.push(matrix[i][right]);
    }
    right--;

    // Left
    if (top <= bottom) {
      for (let i = right; i >= left; i--) {
        result.push(matrix[bottom][i]);
      }
      bottom--;
    }

    // Up
    if (left <= right) {
      for (let i = bottom; i >= top; i--) {
        result.push(matrix[i][left]);
      }
      left++;
    }
  }

  return result;
}
```

---

## Practice Exercises

### Exercise 1: Implement a Simple Cache

```typescript
// Create a cache with TTL (Time To Live)
class CacheWithTTL<K, V> {
  private cache: Map<K, { value: V; expiry: number }> = new Map();

  set(key: K, value: V, ttl: number): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  get(key: K): V | undefined {
    const item = this.cache.get(key);

    if (!item) return undefined;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }

    return item.value;
  }

  clear(): void {
    this.cache.clear();
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now();

    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}
```

### Exercise 2: Deep Clone Object

```typescript
function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as any;
  }

  if (obj instanceof Object) {
    const cloned: any = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }

    return cloned;
  }

  throw new Error('Unable to clone object');
}
```

### Exercise 3: Rate Limiter

```typescript
class RateLimiter {
  private requests: number[] = [];

  constructor(private maxRequests: number, private windowMs: number) {}

  isAllowed(): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Remove old requests
    this.requests = this.requests.filter((time) => time > windowStart);

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }

    return false;
  }

  reset(): void {
    this.requests = [];
  }
}

// Usage
const limiter = new RateLimiter(5, 60000); // 5 requests per minute

function makeRequest() {
  if (limiter.isAllowed()) {
    console.log('Request allowed');
    // Make API call
  } else {
    console.log('Rate limit exceeded');
  }
}
```

---

## Interview Tips

### 1. Problem-Solving Approach (UPER)

- **Understand**: Clarify the problem, ask questions
- **Plan**: Think about approach, discuss trade-offs
- **Execute**: Write clean, working code
- **Review**: Test with examples, optimize

### 2. Common Mistakes to Avoid

- Not clarifying edge cases
- Jumping to code without planning
- Not testing with examples
- Ignoring time/space complexity
- Writing messy, uncommented code

### 3. Communication During Interview

- Think out loud
- Explain your approach before coding
- Discuss trade-offs
- Ask clarifying questions
- Test your solution

### 4. Time Complexity Questions to Expect

**Interviewer**: "What's the time complexity?"

**You**: "The solution is O(n) time because we iterate through the array once, and O(1) space because we only use a few variables."

---

## Summary

### Must-Know Algorithms

✅ Two pointers technique  
✅ Sliding window  
✅ Binary search  
✅ DFS & BFS  
✅ Basic sorting algorithms  
✅ Hash table usage

### Must-Know Data Structures

✅ Arrays & Strings  
✅ Hash Map / Set  
✅ Stack & Queue  
✅ Linked List  
✅ Binary Tree  
✅ Graph basics

### Key Patterns

1. **Two Pointers**: Sorted arrays, palindromes
2. **Sliding Window**: Substrings, subarrays
3. **Fast & Slow**: Cycle detection
4. **DFS/BFS**: Tree/graph traversal
5. **Dynamic Programming**: Optimization problems

### Angular Applications

- Virtual scrolling (binary search, windowing)
- Debounce/throttle (event handling)
- Memoization (performance optimization)
- Tree operations (nested components, routing)
- State management (graph algorithms)

---

**Practice Resources:**

- LeetCode (Easy & Medium problems)
- HackerRank
- CodeSignal
- Interview prep sites

**Next Steps:**

1. Solve 2-3 problems daily
2. Review failed solutions
3. Practice explaining your approach
4. Time yourself (45 min per problem)

Good luck with your Angular interview! 🚀
