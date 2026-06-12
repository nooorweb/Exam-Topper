const { Client } = require('pg');

const connectionString = 'postgresql://postgres:re4fn2FY0RZHXdCR@db.mirehrrlyedurrnrwvjn.supabase.co:5432/postgres';

// ─── 3 New Note Topics ────────────────────────────────────────────────────────
const notes = [
  {
    id: 'cpp-note-1',
    subject: 'Computer Science',
    title: 'C++ Object-Oriented Programming (OOP) Principles',
    overview: 'A deep dive into the four pillars of OOP in C++ — Encapsulation, Inheritance, Polymorphism, and Abstraction — with advanced concepts like virtual functions, smart pointers, and templates.',
    content: `C++ OOP revolves around four pillars:
1. ENCAPSULATION: Bundling data and methods; class members are private by default.
2. INHERITANCE: Use colon (:) syntax — "class Derived : public Base". Constructors are called Base-first, destructors Derived-first.
3. POLYMORPHISM: Compile-time (function/operator overloading) vs Runtime (virtual functions + base pointer).
4. ABSTRACTION: Pure virtual functions (= 0) create abstract classes that cannot be instantiated.

Key rules: Virtual destructors prevent memory leaks with base class pointers. Operators :: and . cannot be overloaded. "this" pointer gives the calling object's address. Templates enable generic programming.`,
    key_points: JSON.stringify([
      'Class members are PRIVATE by default; struct members are public by default.',
      'A class with even ONE pure virtual function (= 0) becomes abstract and cannot be instantiated.',
      'Virtual destructor is essential when deleting derived objects through a base class pointer.',
      'The Diamond Problem in multiple inheritance is resolved using virtual base classes.',
      'Compile-time polymorphism = overloading; Runtime polymorphism = virtual functions + base pointer.',
      'Operators that CANNOT be overloaded: :: (scope), . (member access), .* (pointer-to-member), ?: (ternary).'
    ]),
    formulas: null,
    tables_data: JSON.stringify([
      {
        headers: ['Concept', 'Mechanism', 'Key Rule'],
        rows: [
          ['Encapsulation', 'Access specifiers (private/public/protected)', 'Default class access is private'],
          ['Inheritance', 'class D : public B', 'Constructors: Base→Derived; Destructors: Derived→Base'],
          ['Compile Polymorphism', 'Function/Operator overloading', 'Resolved at compile time (early binding)'],
          ['Runtime Polymorphism', 'Virtual functions + base pointer', 'Resolved at runtime via vtable'],
          ['Abstraction', 'Pure virtual function (= 0)', 'Abstract class cannot be instantiated'],
          ['Friend Function', 'friend keyword', 'Breaks encapsulation; can access private members']
        ]
      }
    ]),
    exam_targets: JSON.stringify(['Computer Operator', 'ETEA', 'KPPSC', 'FPSC', 'NTS', 'Junior Clerk']),
    importance: 'critical',
    estimated_read_time: 10,
    is_public: true
  },
  {
    id: 'dsa-note-1',
    subject: 'Computer Science',
    title: 'Linear vs Non-Linear Data Structures',
    overview: 'Comprehensive comparison of linear (Array, Stack, Queue, Linked List) and non-linear (Tree, Graph, Heap, Hash Table) data structures with their Big-O time complexities.',
    content: `DATA STRUCTURES divide into two families:

LINEAR — elements arranged sequentially:
• Array: O(1) access by index, O(N) search/insert/delete
• Stack (LIFO): O(1) push/pop — used for function calls, undo
• Queue (FIFO): O(1) enqueue/dequeue — used for BFS, scheduling
• Linked List: O(1) insert/delete at known position, O(N) search

NON-LINEAR — hierarchical/networked:
• Binary Search Tree: O(log N) search/insert (balanced) → O(N) worst (skewed)
• Heap: O(1) get-min/max, O(log N) insert/extract → powers Priority Queue
• Hash Table: O(1) average search/insert — resolves collisions via chaining or open addressing
• Graph (V vertices, E edges): Adjacency Matrix O(V²) space; List O(V+E)

Traversals: BST In-order = sorted output. BFS = shortest path (unweighted). DFS = topology sort.`,
    key_points: JSON.stringify([
      'Stack = LIFO (Last In First Out). Queue = FIFO (First In First Out).',
      'BST In-order traversal gives elements in sorted ascending order.',
      'Heap is a Complete Binary Tree; used for Priority Queue and Heap Sort.',
      'Adjacency Matrix takes O(V²) space; Adjacency List takes O(V+E) space.',
      'AVL Tree: Balance Factor = |height(left) - height(right)| must be ≤ 1.',
      'Hash Table average O(1) operations degrade to O(N) worst case with many collisions.'
    ]),
    formulas: JSON.stringify([
      { name: 'BST Search (Balanced)', equation: 'O(log N)', application: 'Both AVL and Red-Black Trees maintain O(log N)' },
      { name: 'Heap Build', equation: 'O(N)', application: 'Bottom-up heapify; NOT O(N log N)' },
      { name: 'Binary Tree Max Nodes at Level L', equation: '2^L', application: 'Root is Level 0' },
      { name: 'Array Right Child', equation: 'index = 2i + 2', application: '0-indexed binary tree array representation' }
    ]),
    tables_data: JSON.stringify([
      {
        headers: ['Structure', 'Access', 'Search', 'Insert', 'Delete', 'Space'],
        rows: [
          ['Array', 'O(1)', 'O(N)', 'O(N)', 'O(N)', 'O(N)'],
          ['Linked List', 'O(N)', 'O(N)', 'O(1)*', 'O(1)*', 'O(N)'],
          ['Stack / Queue', 'O(N)', 'O(N)', 'O(1)', 'O(1)', 'O(N)'],
          ['Hash Table', 'N/A', 'O(1) avg', 'O(1) avg', 'O(1) avg', 'O(N)'],
          ['BST (balanced)', 'O(log N)', 'O(log N)', 'O(log N)', 'O(log N)', 'O(N)'],
          ['Heap', 'O(1) top', 'O(N)', 'O(log N)', 'O(log N)', 'O(N)']
        ]
      }
    ]),
    exam_targets: JSON.stringify(['Computer Operator', 'ETEA', 'KPPSC', 'FPSC', 'NTS', 'Junior Clerk']),
    importance: 'critical',
    estimated_read_time: 10,
    is_public: true
  },
  {
    id: 'algo-note-1',
    subject: 'Computer Science',
    title: 'Searching & Sorting Algorithms',
    overview: 'Complete reference for Binary Search, Bubble Sort, Merge Sort, Quick Sort, and Heap Sort with best/average/worst-case time complexities and stability classification.',
    content: `SORTING ALGORITHMS at a glance:

STABLE sorts (preserve equal element order): Merge Sort, Bubble Sort, Insertion Sort, Counting Sort
UNSTABLE sorts: Quick Sort, Heap Sort

Time Complexity Summary:
• Bubble Sort: Best O(N), Avg O(N²), Worst O(N²) — only efficient for nearly sorted data
• Merge Sort: Always O(N log N) — requires O(N) extra space — Divide & Conquer
• Quick Sort: Best/Avg O(N log N), Worst O(N²) on sorted data — Divide & Conquer
• Heap Sort: Always O(N log N) — O(1) space — but poor cache performance
• Radix Sort: O(d×N) — non-comparison sort, works on integers

BINARY SEARCH: O(log N) — requires sorted array. Recurrence: T(n) = T(n/2) + O(1)

ALGORITHM PARADIGMS:
• Greedy: Huffman Coding, Fractional Knapsack, Prim's/Kruskal's MST
• Dynamic Programming: 0/1 Knapsack, Floyd-Warshall, Fibonacci
• Backtracking: N-Queens, Sudoku Solver, Graph Coloring`,
    key_points: JSON.stringify([
      'Merge Sort is always O(N log N) and STABLE; uses O(N) extra space.',
      'Quick Sort average O(N log N) but WORST case O(N²) on sorted data with bad pivot choice.',
      'Heap Sort: O(N log N) always; O(1) space; UNSTABLE; builds heap in O(N) time.',
      'Dijkstra fails on negative edge weights — use Bellman-Ford instead.',
      'Greedy works for Fractional Knapsack; Dynamic Programming required for 0/1 Knapsack.',
      'Big-O = Upper bound (worst). Big-Ω = Lower bound (best). Theta (Θ) = Tight bound (both).'
    ]),
    formulas: JSON.stringify([
      { name: 'Binary Search Recurrence', equation: 'T(n) = T(n/2) + O(1)', application: 'Solves to O(log N) via Master Theorem' },
      { name: 'Merge Sort Recurrence', equation: 'T(n) = 2T(n/2) + O(n)', application: 'Solves to O(N log N)' },
      { name: 'Heap Build', equation: 'O(N) — not O(N log N)', application: 'Bottom-up heapify is a classic trick question' }
    ]),
    tables_data: JSON.stringify([
      {
        headers: ['Algorithm', 'Best', 'Average', 'Worst', 'Space', 'Stable'],
        rows: [
          ['Bubble Sort', 'O(N)', 'O(N²)', 'O(N²)', 'O(1)', 'Yes'],
          ['Insertion Sort', 'O(N)', 'O(N²)', 'O(N²)', 'O(1)', 'Yes'],
          ['Merge Sort', 'O(N log N)', 'O(N log N)', 'O(N log N)', 'O(N)', 'Yes'],
          ['Quick Sort', 'O(N log N)', 'O(N log N)', 'O(N²)', 'O(log N)', 'No'],
          ['Heap Sort', 'O(N log N)', 'O(N log N)', 'O(N log N)', 'O(1)', 'No'],
          ['Binary Search', 'O(1)', 'O(log N)', 'O(log N)', 'O(1)', 'N/A']
        ]
      }
    ]),
    exam_targets: JSON.stringify(['Computer Operator', 'ETEA', 'KPPSC', 'FPSC', 'NTS', 'Junior Clerk']),
    importance: 'critical',
    estimated_read_time: 10,
    is_public: true
  }
];

// ─── 90 MCQs (30 per topic) ───────────────────────────────────────────────────
const mcqs = [
  // ── C++ MCQs ──────────────────────────────────────────────────────────────
  { id: 'cpp-mcq-01', note_topic_id: 'cpp-note-1', question: 'What is the default access specifier for members of a class in C++?', options: '["public","private","protected","internal"]', correct_answer: 1, explanation: 'In C++, if no access specifier is mentioned, all members and functions of a class are private by default.', category: 'Computer Science', sort_order: 1 },
  { id: 'cpp-mcq-02', note_topic_id: 'cpp-note-1', question: 'Which of the following is the correct syntax to inherit a class publicly?', options: '["class Derived : public Base","class Derived -> public Base","class Derived inherits Base","class Derived(public Base)"]', correct_answer: 0, explanation: 'The colon (:) is used for inheritance in C++, followed by the access modifier and the base class name.', category: 'Computer Science', sort_order: 2 },
  { id: 'cpp-mcq-03', note_topic_id: 'cpp-note-1', question: 'What is the size of an empty class in C++?', options: '["0 bytes","1 byte","4 bytes","Depends on the compiler"]', correct_answer: 1, explanation: 'An empty class has a size of 1 byte to ensure that two different objects of the class have distinct memory addresses.', category: 'Computer Science', sort_order: 3 },
  { id: 'cpp-mcq-04', note_topic_id: 'cpp-note-1', question: 'Which concept is violated by using a friend function?', options: '["Polymorphism","Abstraction","Inheritance","Encapsulation"]', correct_answer: 3, explanation: 'Friend functions can access private and protected members of a class, which breaks the strict data hiding principle of encapsulation.', category: 'Computer Science', sort_order: 4 },
  { id: 'cpp-mcq-05', note_topic_id: 'cpp-note-1', question: 'What is the primary purpose of a virtual destructor in C++?', options: '["To initialize virtual functions","To prevent memory leaks in derived classes","To overload the delete operator","To create an abstract class"]', correct_answer: 1, explanation: 'A virtual base destructor ensures that when deleting a derived object through a base pointer, the derived destructor is called first, preventing memory leaks.', category: 'Computer Science', sort_order: 5 },
  { id: 'cpp-mcq-06', note_topic_id: 'cpp-note-1', question: 'Which of the following operators cannot be overloaded?', options: '["+","++","::","=="]', correct_answer: 2, explanation: 'The scope resolution operator (::), member access (.), and the ternary operator (?:) cannot be overloaded in C++.', category: 'Computer Science', sort_order: 6 },
  { id: 'cpp-mcq-07', note_topic_id: 'cpp-note-1', question: 'What does a pure virtual function make a class?', options: '["A final class","An abstract class","A static class","A base class only"]', correct_answer: 1, explanation: 'A class containing at least one pure virtual function (e.g., virtual void fun() = 0;) becomes an abstract class and cannot be instantiated.', category: 'Computer Science', sort_order: 7 },
  { id: 'cpp-mcq-08', note_topic_id: 'cpp-note-1', question: 'In C++, dynamic memory allocation is performed using which operator?', options: '["malloc","alloc","new","create"]', correct_answer: 2, explanation: 'While malloc() is from C, the `new` operator is the standard C++ way to dynamically allocate memory on the heap as it also calls constructors.', category: 'Computer Science', sort_order: 8 },
  { id: 'cpp-mcq-09', note_topic_id: 'cpp-note-1', question: 'What happens if a copy constructor is not passed by reference?', options: '["Compile error","Runtime error","Infinite recursion","Memory leak"]', correct_answer: 2, explanation: 'If passed by value, the copy constructor would call itself to copy the argument, leading to infinite recursion. It must be passed by reference (usually const reference).', category: 'Computer Science', sort_order: 9 },
  { id: 'cpp-mcq-10', note_topic_id: 'cpp-note-1', question: 'Which OOP concept is represented by function overloading?', options: '["Compile-time Polymorphism","Runtime Polymorphism","Encapsulation","Inheritance"]', correct_answer: 0, explanation: 'Function overloading and operator overloading are resolved by the compiler during compile-time (early binding).', category: 'Computer Science', sort_order: 10 },
  { id: 'cpp-mcq-11', note_topic_id: 'cpp-note-1', question: 'What does the `this` pointer point to?', options: '["The base class","The calling object","The global namespace","The derived class"]', correct_answer: 1, explanation: 'The `this` pointer is an implicit parameter to all non-static member functions, holding the memory address of the object invoking the function.', category: 'Computer Science', sort_order: 11 },
  { id: 'cpp-mcq-12', note_topic_id: 'cpp-note-1', question: 'Which type of inheritance can lead to the Diamond Problem?', options: '["Single Inheritance","Multilevel Inheritance","Multiple Inheritance","Hierarchical Inheritance"]', correct_answer: 2, explanation: 'Multiple inheritance creates the Diamond Problem when two base classes inherit from a common ancestor, causing ambiguity in the derived class.', category: 'Computer Science', sort_order: 12 },
  { id: 'cpp-mcq-13', note_topic_id: 'cpp-note-1', question: 'How is the Diamond Problem resolved in C++?', options: '["Using friend classes","Using static variables","Using virtual inheritance","Using abstract classes"]', correct_answer: 2, explanation: 'Virtual inheritance ensures only one copy of the common base class is inherited, resolving the ambiguity of the Diamond Problem.', category: 'Computer Science', sort_order: 13 },
  { id: 'cpp-mcq-14', note_topic_id: 'cpp-note-1', question: 'A static member function can access:', options: '["Only non-static members","Only static members","Both static and non-static members","Global variables only"]', correct_answer: 1, explanation: 'Static member functions do not have a `this` pointer and can only access static data members or other static member functions of the class.', category: 'Computer Science', sort_order: 14 },
  { id: 'cpp-mcq-15', note_topic_id: 'cpp-note-1', question: 'What is an inline function in C++?', options: '["A function compiled at runtime","A function that cannot return a value","A function expanded in line at the point of call","A function taking no arguments"]', correct_answer: 2, explanation: "Inline functions advise the compiler to insert the function's body where the function call is made, reducing function call overhead for small functions.", category: 'Computer Science', sort_order: 15 },
  { id: 'cpp-mcq-16', note_topic_id: 'cpp-note-1', question: 'Which keyword is used to handle exceptions in C++?', options: '["throw","catch","try","All of the above"]', correct_answer: 3, explanation: 'Exception handling in C++ utilizes a combination of `try` (to test code), `throw` (to signal an error), and `catch` (to handle the error).', category: 'Computer Science', sort_order: 16 },
  { id: 'cpp-mcq-17', note_topic_id: 'cpp-note-1', question: 'What will `catch(...)` do in a try-catch block?', options: '["Catch only pointer exceptions","Catch only standard exceptions","Catch all types of exceptions","Result in a compilation error"]', correct_answer: 2, explanation: 'The ellipsis (...) in a catch block acts as a default handler that catches any exception not caught by previous specific catch blocks.', category: 'Computer Science', sort_order: 17 },
  { id: 'cpp-mcq-18', note_topic_id: 'cpp-note-1', question: 'What is Object Slicing?', options: '["Deleting an object partially","Assigning a derived class object to a base class object","Casting a base pointer to a derived pointer","Dividing a class into multiple files"]', correct_answer: 1, explanation: 'Object slicing occurs when a derived class object is assigned to a base class object (by value), causing the derived-specific attributes to be sliced off or lost.', category: 'Computer Science', sort_order: 18 },
  { id: 'cpp-mcq-19', note_topic_id: 'cpp-note-1', question: 'Pointers to base classes can point to objects of derived classes. What is this concept central to?', options: '["Encapsulation","Compile-time polymorphism","Runtime polymorphism","Function overloading"]', correct_answer: 2, explanation: 'Base class pointers pointing to derived objects is the fundamental requirement for achieving dynamic dispatch and runtime polymorphism via virtual functions.', category: 'Computer Science', sort_order: 19 },
  { id: 'cpp-mcq-20', note_topic_id: 'cpp-note-1', question: 'Which statement about references in C++ is TRUE?', options: '["They can be NULL","They can be reassigned to another variable later","They must be initialized when declared","They consume distinct memory like pointers"]', correct_answer: 2, explanation: 'Unlike pointers, references must be initialized upon declaration, cannot be NULL, and cannot be reassigned to refer to a different variable later.', category: 'Computer Science', sort_order: 20 },
  { id: 'cpp-mcq-21', note_topic_id: 'cpp-note-1', question: 'What is a template in C++?', options: '["A preprocessor directive","A blueprint for creating generic functions or classes","A standard library","A specific data type"]', correct_answer: 1, explanation: 'Templates enable Generic Programming in C++, allowing functions and classes to operate with generic types without rewriting code for each type.', category: 'Computer Science', sort_order: 21 },
  { id: 'cpp-mcq-22', note_topic_id: 'cpp-note-1', question: 'If a constructor is placed in the private section of a class, what happens?', options: '["The program will not compile","The class cannot be instantiated normally","The class becomes abstract","It causes a memory leak"]', correct_answer: 1, explanation: 'A private constructor prevents normal instantiation of the class. It is often used in design patterns like Singleton to control object creation.', category: 'Computer Science', sort_order: 22 },
  { id: 'cpp-mcq-23', note_topic_id: 'cpp-note-1', question: 'In an inheritance hierarchy, in what order are constructors called?', options: '["Derived then Base","Base then Derived","Randomly","Simultaneously"]', correct_answer: 1, explanation: 'Constructors are invoked from the top of the inheritance hierarchy downwards (Base first, then Derived). Destructors are called in the exact reverse order.', category: 'Computer Science', sort_order: 23 },
  { id: 'cpp-mcq-24', note_topic_id: 'cpp-note-1', question: 'Which STL container uses a doubly-linked list internally?', options: '["std::vector","std::list","std::deque","std::set"]', correct_answer: 1, explanation: '`std::list` is implemented as a doubly-linked list, allowing O(1) insertions and deletions anywhere, but lacking random access.', category: 'Computer Science', sort_order: 24 },
  { id: 'cpp-mcq-25', note_topic_id: 'cpp-note-1', question: 'What does `std::vector` do when its capacity is exhausted?', options: '["Throws an exception","Stops accepting new elements","Allocates a larger memory block and copies elements over","Creates a linked list node"]', correct_answer: 2, explanation: 'When a vector is full, it allocates a new array (usually double the size), copies existing elements, and deletes the old array.', category: 'Computer Science', sort_order: 25 },
  { id: 'cpp-mcq-26', note_topic_id: 'cpp-note-1', question: 'What is the purpose of the `mutable` keyword?', options: '["Allows a constant pointer to change","Allows a member to be modified even in a const object","Makes a variable thread-safe","Declares a variable dynamically"]', correct_answer: 1, explanation: 'The `mutable` keyword bypasses const-ness, allowing a specific class member to be modified even if the object itself is declared const.', category: 'Computer Science', sort_order: 26 },
  { id: 'cpp-mcq-27', note_topic_id: 'cpp-note-1', question: 'Which cast should be used to cast away constness?', options: '["static_cast","dynamic_cast","reinterpret_cast","const_cast"]', correct_answer: 3, explanation: '`const_cast` is explicitly designed to add or remove the const or volatile qualifiers from a variable.', category: 'Computer Science', sort_order: 27 },
  { id: 'cpp-mcq-28', note_topic_id: 'cpp-note-1', question: 'Which smart pointer allows multiple pointers to share ownership of an object?', options: '["std::unique_ptr","std::shared_ptr","std::weak_ptr","std::auto_ptr"]', correct_answer: 1, explanation: '`std::shared_ptr` maintains a reference count. The managed object is destroyed only when the last shared_ptr pointing to it is destroyed.', category: 'Computer Science', sort_order: 28 },
  { id: 'cpp-mcq-29', note_topic_id: 'cpp-note-1', question: 'Can a constructor be declared as virtual in C++?', options: '["Yes, always","No, never","Only in abstract classes","Only if the base class is virtual"]', correct_answer: 1, explanation: 'Constructors cannot be virtual. When a constructor is executing, the virtual table (vtable) is not fully initialized for the derived class yet.', category: 'Computer Science', sort_order: 29 },
  { id: 'cpp-mcq-30', note_topic_id: 'cpp-note-1', question: 'What is the output of `cout << sizeof(void*);` on a 64-bit system?', options: '["2","4","8","16"]', correct_answer: 2, explanation: 'On a 64-bit architecture, pointers represent 64-bit memory addresses, which require 8 bytes of storage.', category: 'Computer Science', sort_order: 30 },

  // ── DSA MCQs ──────────────────────────────────────────────────────────────
  { id: 'dsa-mcq-01', note_topic_id: 'dsa-note-1', question: 'Which data structure follows the LIFO principle?', options: '["Queue","Stack","Tree","Graph"]', correct_answer: 1, explanation: 'LIFO stands for Last In First Out. A Stack operates on this principle (e.g., undo functionality in editors).', category: 'Computer Science', sort_order: 1 },
  { id: 'dsa-mcq-02', note_topic_id: 'dsa-note-1', question: 'Which of the following operations takes O(1) time in an Array?', options: '["Accessing an element by index","Inserting at the beginning","Deleting from the beginning","Searching for an element"]', correct_answer: 0, explanation: 'Arrays store elements in contiguous memory. Using an index allows direct memory calculation, making access strictly O(1).', category: 'Computer Science', sort_order: 2 },
  { id: 'dsa-mcq-03', note_topic_id: 'dsa-note-1', question: 'Which data structure is primarily used to evaluate postfix expressions?', options: '["Queue","Linked List","Stack","Tree"]', correct_answer: 2, explanation: 'Stacks naturally handle the hierarchical operator precedence required to evaluate postfix and prefix expressions.', category: 'Computer Science', sort_order: 3 },
  { id: 'dsa-mcq-04', note_topic_id: 'dsa-note-1', question: 'What is the time complexity of searching an element in a Balanced Binary Search Tree (BST)?', options: '["O(1)","O(log N)","O(N)","O(N log N)"]', correct_answer: 1, explanation: 'A balanced BST eliminates half of the remaining sub-tree at each step, making search, insertion, and deletion O(log N).', category: 'Computer Science', sort_order: 4 },
  { id: 'dsa-mcq-05', note_topic_id: 'dsa-note-1', question: 'In a Circular Queue, how do you determine if the queue is full?', options: '["front == -1","front == rear","(rear + 1) % size == front","rear == size - 1"]', correct_answer: 2, explanation: 'In a circular array implementation, the queue is full when the next position of the rear index circularly wraps around to meet the front index.', category: 'Computer Science', sort_order: 5 },
  { id: 'dsa-mcq-06', note_topic_id: 'dsa-note-1', question: 'Which tree traversal algorithm yields the elements in sorted (ascending) order for a BST?', options: '["Pre-order","In-order","Post-order","Level-order"]', correct_answer: 1, explanation: 'In-order traversal visits the Left child, then Root, then Right child. For a BST, this naturally processes elements in sorted ascending order.', category: 'Computer Science', sort_order: 6 },
  { id: 'dsa-mcq-07', note_topic_id: 'dsa-note-1', question: 'What defines a Complete Binary Tree?', options: '["Every node has 0 or 2 children","All leaves are at the same level","Levels are completely filled except possibly the last, filled left to right","The left subtree is always smaller than the right"]', correct_answer: 2, explanation: 'A complete binary tree fills nodes level by level from left to right. This property makes it perfect for array-based Heap implementations.', category: 'Computer Science', sort_order: 7 },
  { id: 'dsa-mcq-08', note_topic_id: 'dsa-note-1', question: 'Which data structure is ideal for implementing a Priority Queue?', options: '["Array","Linked List","Stack","Heap"]', correct_answer: 3, explanation: 'Heaps (Min-Heap or Max-Heap) allow O(1) access to the highest priority element and O(log N) insertion/extraction, making them ideal for Priority Queues.', category: 'Computer Science', sort_order: 8 },
  { id: 'dsa-mcq-09', note_topic_id: 'dsa-note-1', question: 'A Graph implemented using an Adjacency Matrix for V vertices requires how much space?', options: '["O(V)","O(E)","O(V + E)","O(V^2)"]', correct_answer: 3, explanation: 'An adjacency matrix represents connections in a V x V 2D array, consuming O(V^2) space regardless of the number of actual edges (E).', category: 'Computer Science', sort_order: 9 },
  { id: 'dsa-mcq-10', note_topic_id: 'dsa-note-1', question: 'To find the shortest path in an unweighted graph, which traversal should be used?', options: '["Depth First Search (DFS)","Breadth First Search (BFS)","In-order traversal","Post-order traversal"]', correct_answer: 1, explanation: 'BFS explores nodes outward level by level. In an unweighted graph, the first time a target node is reached guarantees the shortest path.', category: 'Computer Science', sort_order: 10 },
  { id: 'dsa-mcq-11', note_topic_id: 'dsa-note-1', question: 'What is the maximum number of nodes at level L of a binary tree? (root is level 0)', options: '["2^L","L^2","2^(L+1)","2^(L-1)"]', correct_answer: 0, explanation: 'The number of nodes doubles at each level of a binary tree. At level L, there can be up to 2^L nodes.', category: 'Computer Science', sort_order: 11 },
  { id: 'dsa-mcq-12', note_topic_id: 'dsa-note-1', question: 'In an AVL tree, what is the permitted balance factor of any node?', options: '["Only 0","-1, 0, or 1","-2, -1, 0, 1, 2","Depends on tree height"]', correct_answer: 1, explanation: 'An AVL tree is strictly balanced. The height difference (balance factor) between the left and right subtrees must be -1, 0, or 1.', category: 'Computer Science', sort_order: 12 },
  { id: 'dsa-mcq-13', note_topic_id: 'dsa-note-1', question: 'Which of the following correctly describes a collision in hashing?', options: '["Two tables trying to merge","Two keys hashing to the same index","A hash function returning a negative value","A key being deleted twice"]', correct_answer: 1, explanation: 'A collision occurs when the hash function maps two distinct keys to the exact same array index in the hash table.', category: 'Computer Science', sort_order: 13 },
  { id: 'dsa-mcq-14', note_topic_id: 'dsa-note-1', question: 'Linear Probing is a technique used for what?', options: '["Graph traversal","Sorting arrays","Resolving hash collisions","Balancing binary trees"]', correct_answer: 2, explanation: 'Linear probing is an open addressing technique to resolve hash collisions by checking the next sequential slot until an empty one is found.', category: 'Computer Science', sort_order: 14 },
  { id: 'dsa-mcq-15', note_topic_id: 'dsa-note-1', question: 'What is the worst-case search time in a Hash Table (with many collisions)?', options: '["O(1)","O(log N)","O(N)","O(N^2)"]', correct_answer: 2, explanation: 'If all keys hash to the same bucket (forming a long chain or probing sequence), searching degenerates to linear time O(N).', category: 'Computer Science', sort_order: 15 },
  { id: 'dsa-mcq-16', note_topic_id: 'dsa-note-1', question: 'A Doubly Linked List requires more memory per node than a Singly Linked List because:', options: '["It stores larger data types","It contains two pointers per node","It maintains an array internally","It uses dynamic typing"]', correct_answer: 1, explanation: "Every node in a Doubly Linked List must store both a 'next' pointer and a 'prev' pointer, increasing the memory footprint per node.", category: 'Computer Science', sort_order: 16 },
  { id: 'dsa-mcq-17', note_topic_id: 'dsa-note-1', question: 'Which structure allows insertion and deletion at both ends but not in the middle?', options: '["Queue","Stack","Deque","Priority Queue"]', correct_answer: 2, explanation: 'A Deque (Double-Ended Queue) allows enqueue and dequeue operations at both the front and rear ends.', category: 'Computer Science', sort_order: 17 },
  { id: 'dsa-mcq-18', note_topic_id: 'dsa-note-1', question: 'What is the prefix representation of the infix expression (A + B) * C?', options: '["*+ABC","+*ABC","AB+C*","ABC*+"]', correct_answer: 0, explanation: 'In prefix (Polish notation), the operator comes before its operands. (A+B) becomes +AB. Multiplying by C makes it *+ABC.', category: 'Computer Science', sort_order: 18 },
  { id: 'dsa-mcq-19', note_topic_id: 'dsa-note-1', question: 'If a binary tree is represented in an array (root at index 0), what is the index of the right child of a node at index i?', options: '["2i + 1","2i + 2","i / 2","2i - 1"]', correct_answer: 1, explanation: 'In 0-indexed array representation of trees, the left child is at 2i + 1 and the right child is at 2i + 2.', category: 'Computer Science', sort_order: 19 },
  { id: 'dsa-mcq-20', note_topic_id: 'dsa-note-1', question: 'Which traversal deletes a binary tree safely (freeing children before the parent)?', options: '["In-order","Pre-order","Post-order","Level-order"]', correct_answer: 2, explanation: 'Post-order processes Left, Right, then Root. By deleting children before the parent, it prevents orphaned/dangling memory references.', category: 'Computer Science', sort_order: 20 },
  { id: 'dsa-mcq-21', note_topic_id: 'dsa-note-1', question: 'What is the primary difference between a Tree and a Graph?', options: '["Trees contain nodes, Graphs do not","Trees cannot have cycles, Graphs can","Trees use edges, Graphs use pointers","Graphs must be directed, Trees are undirected"]', correct_answer: 1, explanation: 'A Tree is fundamentally a minimally connected, acyclic graph. Once a cycle is introduced, it is no longer a Tree.', category: 'Computer Science', sort_order: 21 },
  { id: 'dsa-mcq-22', note_topic_id: 'dsa-note-1', question: 'Topological Sorting is only possible on which type of graph?', options: '["Undirected graph","Cyclic graph","Directed Acyclic Graph (DAG)","Weighted graph"]', correct_answer: 2, explanation: 'Topological sorting orders vertices such that for every directed edge U->V, U comes before V. This strictly requires a DAG (no cycles).', category: 'Computer Science', sort_order: 22 },
  { id: 'dsa-mcq-23', note_topic_id: 'dsa-note-1', question: 'What is the worst-case insertion time for an unbalanced BST (e.g., inserting sorted data)?', options: '["O(1)","O(log N)","O(N)","O(N^2)"]', correct_answer: 2, explanation: 'If data is inserted in sorted order, the BST degrades into a linear Linked List (skewed tree), causing insertion/search to take O(N).', category: 'Computer Science', sort_order: 23 },
  { id: 'dsa-mcq-24', note_topic_id: 'dsa-note-1', question: 'What is a Threaded Binary Tree?', options: '["A tree optimized for multithreading","A tree where null pointers point to predecessor/successor nodes","A tree represented as an array","A tree used to construct threads"]', correct_answer: 1, explanation: 'Threaded Binary Trees utilize wasted null child pointers to point to in-order predecessors or successors, enabling faster traversals without recursion/stacks.', category: 'Computer Science', sort_order: 24 },
  { id: 'dsa-mcq-25', note_topic_id: 'dsa-note-1', question: 'In a B-Tree of order M, what is the maximum number of children a node can have?', options: '["M-1","M","2M","log M"]', correct_answer: 1, explanation: 'A B-Tree of order M allows each internal node to contain up to M-1 keys and have exactly M children.', category: 'Computer Science', sort_order: 25 },
  { id: 'dsa-mcq-26', note_topic_id: 'dsa-note-1', question: 'Which data structure forms the basis of Database indexing systems?', options: '["Red-Black Trees","Max Heaps","B+ Trees","Hash Maps"]', correct_answer: 2, explanation: 'B+ Trees store all data at the leaf level and link leaves sequentially, making them heavily optimized for disk-based database block reads and range queries.', category: 'Computer Science', sort_order: 26 },
  { id: 'dsa-mcq-27', note_topic_id: 'dsa-note-1', question: 'The Disjoint-Set (Union-Find) data structure is highly efficient for what task?', options: '["Finding shortest paths","Detecting cycles in an undirected graph","Sorting elements","Balancing trees"]', correct_answer: 1, explanation: 'Union-Find keeps track of elements partitioned into disjoint subsets. It efficiently detects if adding an edge connects two already connected vertices (a cycle).', category: 'Computer Science', sort_order: 27 },
  { id: 'dsa-mcq-28', note_topic_id: 'dsa-note-1', question: 'What does the Load Factor represent in a Hash Table?', options: '["Number of keys / Table size","Table size / Number of keys","Number of collisions","Size of hash function"]', correct_answer: 0, explanation: 'Load factor (alpha) is the ratio of stored entries to the table size. It determines when the hash table needs to be dynamically resized (rehashing).', category: 'Computer Science', sort_order: 28 },
  { id: 'dsa-mcq-29', note_topic_id: 'dsa-note-1', question: 'Which rotation is performed in an AVL tree when a node is inserted into the Left subtree of a Left child causing imbalance?', options: '["LL Rotation / Single Right Rotation","Right-Right (RR) Rotation","Left-Right (LR) Rotation","Right-Left (RL) Rotation"]', correct_answer: 0, explanation: 'An imbalance caused by Left-Left insertion is fixed using a single Right Rotation around the unbalanced node.', category: 'Computer Science', sort_order: 29 },
  { id: 'dsa-mcq-30', note_topic_id: 'dsa-note-1', question: 'Which linked list variant prevents a NULL pointer traversal at the end?', options: '["Singly Linked List","Doubly Linked List","Circular Linked List","Threaded List"]', correct_answer: 2, explanation: "In a Circular Linked List, the 'next' pointer of the last node points back to the head node instead of NULL, forming an infinite loop.", category: 'Computer Science', sort_order: 30 },

  // ── Algorithm MCQs ────────────────────────────────────────────────────────
  { id: 'algo-mcq-01', note_topic_id: 'algo-note-1', question: 'Which algorithmic paradigm does Merge Sort utilize?', options: '["Dynamic Programming","Greedy","Divide and Conquer","Backtracking"]', correct_answer: 2, explanation: 'Merge sort divides the array into halves, sorts them recursively, and merges the sorted halves, following the Divide and Conquer strategy.', category: 'Computer Science', sort_order: 1 },
  { id: 'algo-mcq-02', note_topic_id: 'algo-note-1', question: 'What is the Best Case time complexity of Bubble Sort?', options: '["O(1)","O(N)","O(N log N)","O(N^2)"]', correct_answer: 1, explanation: 'By using a boolean flag, if the array is already sorted, Bubble Sort makes one pass with zero swaps and terminates in O(N) time.', category: 'Computer Science', sort_order: 2 },
  { id: 'algo-mcq-03', note_topic_id: 'algo-note-1', question: 'Which of these sorting algorithms requires the most auxiliary space?', options: '["Quick Sort","Heap Sort","Merge Sort","Insertion Sort"]', correct_answer: 2, explanation: 'Merge sort requires O(N) auxiliary space to construct the temporary arrays during the merge phase, unlike in-place sorts like Heap or Quick sort.', category: 'Computer Science', sort_order: 3 },
  { id: 'algo-mcq-04', note_topic_id: 'algo-note-1', question: 'What is the worst-case time complexity of Quick Sort?', options: '["O(N log N)","O(N)","O(N^2)","O(log N)"]', correct_answer: 2, explanation: 'Quick Sort degrades to O(N^2) when the pivot chosen consistently results in highly unbalanced partitions (e.g., already sorted array with extreme pivot).', category: 'Computer Science', sort_order: 4 },
  { id: 'algo-mcq-05', note_topic_id: 'algo-note-1', question: 'Which algorithm is typically used for topological sorting of a graph?', options: '["BFS","DFS","Dijkstra","Kruskal"]', correct_answer: 1, explanation: 'A modified Depth First Search (DFS) using a stack to push nodes after their recursive calls finish efficiently produces a topological sort.', category: 'Computer Science', sort_order: 5 },
  { id: 'algo-mcq-06', note_topic_id: 'algo-note-1', question: "Dijkstra's Algorithm fails under which condition?", options: '["Dense graphs","Unweighted graphs","Graphs with negative edge weights","Disconnected graphs"]', correct_answer: 2, explanation: 'Dijkstra makes greedy, permanent choices. Negative weights invalidate these choices, requiring algorithms like Bellman-Ford instead.', category: 'Computer Science', sort_order: 6 },
  { id: 'algo-mcq-07', note_topic_id: 'algo-note-1', question: 'Which algorithmic approach does Huffman Coding use?', options: '["Greedy","Dynamic Programming","Divide and Conquer","Backtracking"]', correct_answer: 0, explanation: 'Huffman coding builds an optimal prefix tree by always greedily merging the two nodes with the lowest frequencies.', category: 'Computer Science', sort_order: 7 },
  { id: 'algo-mcq-08', note_topic_id: 'algo-note-1', question: 'Dynamic Programming differs from Divide and Conquer because it:', options: '["Uses less memory","Solves overlapping subproblems","Avoids recursion entirely","Only works on graphs"]', correct_answer: 1, explanation: 'Dynamic programming memoizes or tabulates results of subproblems. It is used specifically when subproblems overlap and repeat, unlike Merge Sort.', category: 'Computer Science', sort_order: 8 },
  { id: 'algo-mcq-09', note_topic_id: 'algo-note-1', question: 'The classic 0/1 Knapsack problem is optimally solved using:', options: '["Greedy Algorithm","Dynamic Programming","Dijkstra\'s Algorithm","Binary Search"]', correct_answer: 1, explanation: 'The Greedy approach fails on 0/1 Knapsack. Dynamic Programming considers all combinations to maximize value without exceeding weight limits.', category: 'Computer Science', sort_order: 9 },
  { id: 'algo-mcq-10', note_topic_id: 'algo-note-1', question: "Which algorithm is optimal for finding the Minimum Spanning Tree (MST)?", options: '["Prim\'s Algorithm","Dijkstra\'s Algorithm","Floyd-Warshall Algorithm","Bellman-Ford Algorithm"]', correct_answer: 0, explanation: "Prim's and Kruskal's algorithms are specifically designed to find the MST of a weighted undirected graph.", category: 'Computer Science', sort_order: 10 },
  { id: 'algo-mcq-11', note_topic_id: 'algo-note-1', question: 'What does Big-O notation strictly represent?', options: '["Best case execution time","Average case execution time","Upper bound execution time","Lower bound execution time"]', correct_answer: 2, explanation: 'Big-O denotes the asymptotic upper bound, representing the worst-case complexity or maximum time an algorithm could take.', category: 'Computer Science', sort_order: 11 },
  { id: 'algo-mcq-12', note_topic_id: 'algo-note-1', question: 'Which notation represents the tight bound (both upper and lower)?', options: '["Big-O","Big-Omega","Theta","Little-o"]', correct_answer: 2, explanation: "Theta (Θ) notation is used when an algorithm's worst-case and best-case bound to the same complexity class, providing a tight, exact bound.", category: 'Computer Science', sort_order: 12 },
  { id: 'algo-mcq-13', note_topic_id: 'algo-note-1', question: 'Linear Search on an array of size N. What is the average-case time complexity?', options: '["O(1)","O(log N)","O(N/2)","O(N)"]', correct_answer: 3, explanation: 'On average, the element is found halfway through (N/2 checks). In asymptotic notation, constants are dropped, making it O(N).', category: 'Computer Science', sort_order: 13 },
  { id: 'algo-mcq-14', note_topic_id: 'algo-note-1', question: 'What makes Radix Sort different from Quick Sort and Merge Sort?', options: '["It requires more memory","It is a comparison-free integer sort","It is unstable","It only works on strings"]', correct_answer: 1, explanation: 'Radix sort processes digits bucket by bucket instead of comparing entire elements against each other. It is a non-comparison sort.', category: 'Computer Science', sort_order: 14 },
  { id: 'algo-mcq-15', note_topic_id: 'algo-note-1', question: 'What is the recurrence relation for Binary Search?', options: '["T(n) = 2T(n/2) + O(1)","T(n) = T(n/2) + O(n)","T(n) = T(n/2) + O(1)","T(n) = T(n-1) + O(1)"]', correct_answer: 2, explanation: 'Binary search makes one recursive call on half the array and performs constant O(1) comparison work at each step.', category: 'Computer Science', sort_order: 15 },
  { id: 'algo-mcq-16', note_topic_id: 'algo-note-1', question: 'The Floyd-Warshall algorithm is used to find:', options: '["Single-source shortest path","All-pairs shortest paths","Minimum Spanning Tree","Maximum Flow"]', correct_answer: 1, explanation: 'Floyd-Warshall uses Dynamic Programming to compute the shortest paths between every single pair of vertices in O(V^3) time.', category: 'Computer Science', sort_order: 16 },
  { id: 'algo-mcq-17', note_topic_id: 'algo-note-1', question: 'In the context of algorithm design, what is Memoization?', options: '["Storing a graph in memory","Top-down approach caching solved subproblems","Bottom-up approach using arrays","Cleaning garbage memory"]', correct_answer: 1, explanation: 'Memoization is a Top-Down DP technique where recursive function call results are cached to prevent redundant calculations.', category: 'Computer Science', sort_order: 17 },
  { id: 'algo-mcq-18', note_topic_id: 'algo-note-1', question: 'Which sorting algorithm is heavily utilized internally by C++ std::sort?', options: '["Pure Quick Sort","Merge Sort","IntroSort","TimSort"]', correct_answer: 2, explanation: 'std::sort uses IntroSort, a hybrid algorithm that starts with Quick Sort but switches to Heap Sort if recursion depth gets too large to guarantee O(N log N).', category: 'Computer Science', sort_order: 18 },
  { id: 'algo-mcq-19', note_topic_id: 'algo-note-1', question: 'Which algorithm finds strongly connected components in a directed graph?', options: '["Kruskal\'s Algorithm","Tarjan\'s or Kosaraju\'s Algorithm","Prim\'s Algorithm","Bellman-Ford Algorithm"]', correct_answer: 1, explanation: "Kosaraju's and Tarjan's algorithms use DFS passes to identify Strongly Connected Components (SCCs) in linear time.", category: 'Computer Science', sort_order: 19 },
  { id: 'algo-mcq-20', note_topic_id: 'algo-note-1', question: 'The Fractional Knapsack problem is optimally solved using:', options: '["Dynamic Programming","Greedy Approach","Backtracking","Branch and Bound"]', correct_answer: 1, explanation: 'Unlike 0/1 Knapsack, the fractional variant allows breaking items. A Greedy approach taking the highest value-to-weight ratio yields the optimal solution.', category: 'Computer Science', sort_order: 20 },
  { id: 'algo-mcq-21', note_topic_id: 'algo-note-1', question: 'What is the time complexity to build a Heap from an unsorted array of N elements?', options: '["O(1)","O(log N)","O(N)","O(N log N)"]', correct_answer: 2, explanation: 'Using the bottom-up heapify approach, building a binary heap takes strict linear time O(N), not O(N log N).', category: 'Computer Science', sort_order: 21 },
  { id: 'algo-mcq-22', note_topic_id: 'algo-note-1', question: 'What characteristic defines the Backtracking algorithm paradigm?', options: '["Never reversing a decision","Solving subproblems bottom-up","Abandoning a search path as soon as it violates constraints","Always picking the local minimum"]', correct_answer: 2, explanation: 'Backtracking builds candidates incrementally and prunes (abandons) paths immediately if they cannot possibly lead to a valid solution (e.g., N-Queens).', category: 'Computer Science', sort_order: 22 },
  { id: 'algo-mcq-23', note_topic_id: 'algo-note-1', question: 'Which algorithm paradigm resolves the N-Queens Problem?', options: '["Divide and Conquer","Backtracking","Dynamic Programming","Greedy"]', correct_answer: 1, explanation: 'N-Queens requires exploring board configurations and backtracking immediately if a queen placement causes an attack.', category: 'Computer Science', sort_order: 23 },
  { id: 'algo-mcq-24', note_topic_id: 'algo-note-1', question: 'An algorithm is termed NP-Complete if:', options: '["It runs in Polynomial time","It is NP-hard and in NP","It is impossible to solve","It uses Non-Polynomial space"]', correct_answer: 1, explanation: 'An NP-Complete problem means any given solution can be verified in polynomial time (in NP), and every problem in NP can be reduced to it (NP-Hard).', category: 'Computer Science', sort_order: 24 },
  { id: 'algo-mcq-25', note_topic_id: 'algo-note-1', question: 'What does the Master Theorem solve?', options: '["Graph path lengths","Dynamic programming tables","Asymptotic bounds for Divide and Conquer recurrences","Matrix chain multiplications"]', correct_answer: 2, explanation: 'The Master Theorem provides direct mathematical formulas to find the Big-O time complexity of recurrence relations like T(n) = aT(n/b) + f(n).', category: 'Computer Science', sort_order: 25 },
  { id: 'algo-mcq-26', note_topic_id: 'algo-note-1', question: 'Which string matching algorithm utilizes a prefix-suffix (LPS) array to avoid redundant comparisons?', options: '["Brute Force","KMP (Knuth-Morris-Pratt)","Rabin-Karp","Boyer-Moore"]', correct_answer: 1, explanation: 'KMP algorithm pre-processes the pattern to create a Longest Prefix Suffix (LPS) array, allowing it to skip characters instead of backtracking in the main string.', category: 'Computer Science', sort_order: 26 },
  { id: 'algo-mcq-27', note_topic_id: 'algo-note-1', question: 'The Rabin-Karp string matching algorithm heavily relies on which mathematical concept?', options: '["Matrix multiplication","Hashing","Differentiation","Graph theory"]', correct_answer: 1, explanation: 'Rabin-Karp computes a rolling hash value for the pattern and text windows. It only compares actual characters if the hash values match.', category: 'Computer Science', sort_order: 27 },
  { id: 'algo-mcq-28', note_topic_id: 'algo-note-1', question: 'If an array is already fully sorted, which sorting algorithm is the worst choice?', options: '["Bubble Sort","Insertion Sort","Merge Sort","Standard Quick Sort (with first/last pivot)"]', correct_answer: 3, explanation: 'Standard Quick Sort without a randomized pivot hits its worst-case O(N^2) complexity on sorted data due to completely skewed partitioning.', category: 'Computer Science', sort_order: 28 },
  { id: 'algo-mcq-29', note_topic_id: 'algo-note-1', question: 'What is Amortized Analysis?', options: '["Calculating the absolute worst case of a single operation","Averaging the time taken per operation over a worst-case sequence of operations","Analyzing memory leak potential","Finding the best possible time complexity"]', correct_answer: 1, explanation: 'Amortized analysis guarantees an average performance over a sequence of operations. For example, dynamic array resizing is expensive but rare, making insertions O(1) amortized.', category: 'Computer Science', sort_order: 29 },
  { id: 'algo-mcq-30', note_topic_id: 'algo-note-1', question: 'Which of the following is an example of an In-Place algorithm?', options: '["Merge Sort","Counting Sort","Heap Sort","Radix Sort"]', correct_answer: 2, explanation: 'An in-place algorithm requires O(1) or O(log N) extra space. Heap sort operates directly on the input array, unlike Merge or Counting sort.', category: 'Computer Science', sort_order: 30 }
];

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to database. Seeding C++, DSA, and Algorithms...\n');

    // ── Seed Note Topics ───────────────────────────────────────────────────
    for (const note of notes) {
      process.stdout.write(`  Seeding note: ${note.title}... `);
      await client.query(`
        INSERT INTO public.note_topics 
          (id, subject, title, overview, content, key_points, formulas, tables_data, exam_targets, importance, estimated_read_time, is_public)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
        ON CONFLICT (id) DO UPDATE SET
          subject = EXCLUDED.subject, title = EXCLUDED.title,
          overview = EXCLUDED.overview, content = EXCLUDED.content,
          key_points = EXCLUDED.key_points, formulas = EXCLUDED.formulas,
          tables_data = EXCLUDED.tables_data, exam_targets = EXCLUDED.exam_targets,
          importance = EXCLUDED.importance, estimated_read_time = EXCLUDED.estimated_read_time,
          is_public = EXCLUDED.is_public;
      `, [note.id, note.subject, note.title, note.overview, note.content,
          note.key_points, note.formulas, note.tables_data, note.exam_targets,
          note.importance, note.estimated_read_time, note.is_public]);
      console.log('OK');
    }

    console.log(`\nSeeded ${notes.length} note topics.\n`);

    // ── Seed MCQs ──────────────────────────────────────────────────────────
    let count = 0;
    for (const mcq of mcqs) {
      process.stdout.write(`  MCQ ${String(++count).padStart(2,'0')}/90: [${mcq.note_topic_id}] ${mcq.question.substring(0,50)}... `);
      await client.query(`
        INSERT INTO public.note_topic_mcqs
          (id, note_topic_id, question, options, correct_answer, explanation, category, sort_order, is_public)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        ON CONFLICT (id) DO UPDATE SET
          note_topic_id = EXCLUDED.note_topic_id, question = EXCLUDED.question,
          options = EXCLUDED.options, correct_answer = EXCLUDED.correct_answer,
          explanation = EXCLUDED.explanation, category = EXCLUDED.category,
          sort_order = EXCLUDED.sort_order, is_public = EXCLUDED.is_public;
      `, [mcq.id, mcq.note_topic_id, mcq.question, mcq.options,
          mcq.correct_answer, mcq.explanation, mcq.category, mcq.sort_order, true]);
      console.log('OK');
    }

    console.log(`\n✅ Done! Seeded 3 note topics and ${mcqs.length} MCQs successfully.`);

    // ── Verification counts ────────────────────────────────────────────────
    console.log('\n── Verification ──────────────────────────────────');
    for (const note of notes) {
      const r = await client.query(`SELECT COUNT(*) FROM public.note_topic_mcqs WHERE note_topic_id = $1`, [note.id]);
      console.log(`  ${note.id}: ${r.rows[0].count} MCQs`);
    }

  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
