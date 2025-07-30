-- Article seed data for development and testing
-- Contains sample articles for Khmer Coders platform
-- Generated on July 15, 2025

INSERT INTO `article` (
  `id`, 
  `user_id`, 
  `title`, 
  `slug`, 
  `image`, 
  `summary`, 
  `content`, 
  `published`, 
  `approved_by_ai`, 
  `like_count`, 
  `comment_count`, 
  `view_count`, 
  `is_banned`, 
  `ban_reason`, 
  `ban_by_user_id`, 
  `created_at`, 
  `updated_at`
)
VALUES
  -- Article 1: Getting Started with JavaScript
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z1',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZB',
    'Getting Started with JavaScript: A Beginner''s Guide',
    'getting-started-javascript-beginners-guide',
    'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=600&fit=crop',
    'Learn the fundamentals of JavaScript programming language with practical examples and exercises.',
    '# Getting Started with JavaScript: A Beginner''s Guide

JavaScript is one of the most popular programming languages in the world, and for good reason. It''s versatile, powerful, and essential for web development.

## What is JavaScript?

JavaScript is a high-level, interpreted programming language that conforms to the ECMAScript specification. It''s primarily used for:

- Web development (frontend and backend)
- Mobile app development
- Desktop applications
- Game development

## Your First JavaScript Code

Let''s start with the classic "Hello, World!" example:

```javascript
console.log("Hello, World!");
```

## Variables and Data Types

JavaScript has several data types:

```javascript
// Numbers
let age = 25;
let price = 19.99;

// Strings
let name = "Khmer Coders";
let message = `Welcome to ${name}!`;

// Booleans
let isStudent = true;
let isCompleted = false;

// Arrays
let languages = ["JavaScript", "Python", "Java"];

// Objects
let person = {
  name: "Dara",
  age: 25,
  isStudent: true
};
```

## Functions

Functions are reusable blocks of code:

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

// Arrow function (ES6+)
const add = (a, b) => a + b;

console.log(greet("Khmer Coders")); // Hello, Khmer Coders!
console.log(add(5, 3)); // 8
```

## Next Steps

1. Practice with online coding platforms
2. Build simple projects
3. Join the Khmer Coders community
4. Read JavaScript documentation

Happy coding! 🚀',
    1,
    1,
    15,
    3,
    127,
    0,
    NULL,
    NULL,
    1736891622,
    1736891622
  ),

  -- Article 2: React Hooks Tutorial
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z2',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZC',
    'Mastering React Hooks: useState and useEffect',
    'mastering-react-hooks-usestate-useeffect',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
    'Deep dive into React Hooks with practical examples of useState and useEffect.',
    '# Mastering React Hooks: useState and useEffect

React Hooks revolutionized how we write React components. Let''s explore the most commonly used hooks.

## useState Hook

The `useState` hook allows you to add state to functional components:

```jsx
import React, { useState } from ''react'';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

### Multiple State Variables

```jsx
function UserProfile() {
  const [name, setName] = useState('''');
  const [email, setEmail] = useState('''');
  const [age, setAge] = useState(0);

  return (
    <form>
      <input 
        value={name} 
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <input 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input 
        type="number"
        value={age} 
        onChange={(e) => setAge(parseInt(e.target.value))}
        placeholder="Age"
      />
    </form>
  );
}
```

## useEffect Hook

The `useEffect` hook lets you perform side effects in functional components:

```jsx
import React, { useState, useEffect } from ''react'';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(''/api/users'');
        const userData = await response.json();
        setUsers(userData);
      } catch (error) {
        console.error(''Error fetching users:'', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []); // Empty dependency array means this runs once

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## Best Practices

1. **Use multiple state variables** instead of one complex object
2. **Optimize useEffect** with proper dependency arrays
3. **Custom hooks** for reusable logic
4. **Clean up effects** when necessary

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log(''Timer tick'');
  }, 1000);

  // Cleanup function
  return () => clearInterval(timer);
}, []);
```

React Hooks make your code more readable and reusable. Happy coding! ⚛️',
    1,
    1,
    28,
    7,
    245,
    0,
    NULL,
    NULL,
    1736805222,
    1736805222
  ),

  -- Article 3: Python Data Structures
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z3',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZD',
    'Python Data Structures: Lists, Dictionaries, and Sets',
    'python-data-structures-lists-dictionaries-sets',
    'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=600&fit=crop',
    'Comprehensive guide to Python''s built-in data structures with practical examples.',
    '# Python Data Structures: Lists, Dictionaries, and Sets

Python provides several built-in data structures that are powerful and easy to use. Let''s explore the most important ones.

## Lists

Lists are ordered, mutable collections:

```python
# Creating lists
fruits = [''apple'', ''banana'', ''orange'']
numbers = [1, 2, 3, 4, 5]
mixed = [''hello'', 42, True, 3.14]

# List operations
fruits.append(''grape'')          # Add to end
fruits.insert(0, ''mango'')       # Insert at index
fruits.remove(''banana'')         # Remove by value
popped = fruits.pop()            # Remove and return last item

# List comprehensions
squares = [x**2 for x in range(10)]
even_numbers = [x for x in range(20) if x % 2 == 0]
```

## Dictionaries

Dictionaries store key-value pairs:

```python
# Creating dictionaries
student = {
    ''name'': ''Sophea'',
    ''age'': 22,
    ''major'': ''Computer Science'',
    ''grades'': [85, 92, 78, 96]
}

# Dictionary operations
student[''email''] = ''sophea@example.com''  # Add new key-value pair
age = student.get(''age'', 0)               # Safe access with default
student.update({''year'': 3, ''gpa'': 3.7}) # Update multiple values

# Dictionary comprehensions
word_lengths = {word: len(word) for word in [''hello'', ''world'', ''python'']}
```

## Sets

Sets are unordered collections of unique elements:

```python
# Creating sets
languages = {''Python'', ''JavaScript'', ''Java'', ''C++''}
empty_set = set()  # Note: {} creates an empty dict, not set

# Set operations
languages.add(''Go'')           # Add element
languages.remove(''Java'')     # Remove element (raises error if not found)
languages.discard(''Ruby'')    # Remove element (no error if not found)

# Set operations
frontend = {''JavaScript'', ''TypeScript'', ''React''}
backend = {''Python'', ''Java'', ''Node.js'', ''JavaScript''}

# Union (all elements)
all_languages = frontend | backend

# Intersection (common elements)
common = frontend & backend

# Difference (in frontend but not backend)
frontend_only = frontend - backend
```

## Practical Examples

### Task Manager

```python
class TaskManager:
    def __init__(self):
        self.tasks = []
        self.completed = set()
        self.priorities = {}
    
    def add_task(self, task, priority=''medium''):
        if task not in [t[''name''] for t in self.tasks]:
            self.tasks.append({
                ''name'': task,
                ''id'': len(self.tasks) + 1
            })
            self.priorities[task] = priority
    
    def complete_task(self, task_name):
        self.completed.add(task_name)
    
    def get_pending_tasks(self):
        return [
            task for task in self.tasks 
            if task[''name''] not in self.completed
        ]

# Usage
tm = TaskManager()
tm.add_task(''Learn Python'', ''high'')
tm.add_task(''Build web app'', ''medium'')
tm.complete_task(''Learn Python'')
print(tm.get_pending_tasks())
```

## Performance Tips

1. **Lists**: Use for ordered data, frequent appends
2. **Dictionaries**: Use for key-based lookups (O(1) average)
3. **Sets**: Use for uniqueness, fast membership testing
4. **Tuples**: Use for immutable sequences

Choose the right data structure for your use case! 🐍',
    1,
    1,
    22,
    5,
    189,
    0,
    NULL,
    NULL,
    1736718822,
    1736718822
  ),

  -- Article 4: Web Development Best Practices
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z4',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZE',
    'Web Development Best Practices for 2025',
    'web-development-best-practices-2025',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    'Essential best practices every web developer should follow in 2025.',
    '# Web Development Best Practices for 2025

The web development landscape evolves rapidly. Here are the essential best practices to follow in 2025.

## Performance Optimization

### 1. Optimize Images

```html
<!-- Use modern image formats -->
<picture>
  <source srcset="image.avif" type="image/avif">
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>
```

### 2. Code Splitting

```javascript
// React lazy loading
import { lazy, Suspense } from ''react'';

const LazyComponent = lazy(() => import(''./LazyComponent''));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

## Security Best Practices

### 1. Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src ''self''; script-src ''self'' ''unsafe-inline''">
```

### 2. Input Validation

```javascript
// Client-side validation (never trust client-side only!)
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Server-side validation (essential!)
const validator = require(''validator'');

app.post(''/api/user'', (req, res) => {
  const { email, password } = req.body;
  
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: ''Invalid email'' });
  }
  
  if (!validator.isLength(password, { min: 8 })) {
    return res.status(400).json({ error: ''Password too short'' });
  }
  
  // Process valid data...
});
```

## Accessibility (a11y)

### 1. Semantic HTML

```html
<!-- Good -->
<main>
  <article>
    <header>
      <h1>Article Title</h1>
      <time datetime="2025-07-15">July 15, 2025</time>
    </header>
    <section>
      <p>Article content...</p>
    </section>
  </article>
</main>

<!-- Avoid -->
<div class="main">
  <div class="article">
    <div class="title">Article Title</div>
    <div class="content">Article content...</div>
  </div>
</div>
```

### 2. ARIA Labels

```html
<button aria-label="Close dialog" aria-expanded="false">
  <span aria-hidden="true">×</span>
</button>

<input type="search" aria-label="Search articles" placeholder="Search...">
```

## Modern CSS Practices

### 1. CSS Grid and Flexbox

```css
/* Grid for layout */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

/* Flexbox for components */
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
```

### 2. Custom Properties

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --spacing-unit: 0.5rem;
  --border-radius: 0.375rem;
}

.button {
  background-color: var(--primary-color);
  padding: calc(var(--spacing-unit) * 2) calc(var(--spacing-unit) * 4);
  border-radius: var(--border-radius);
}
```

## JavaScript Best Practices

### 1. Use Modern Syntax

```javascript
// Destructuring
const { name, email } = user;
const [first, second, ...rest] = array;

// Optional chaining
const city = user?.address?.city;

// Nullish coalescing
const name = user.name ?? ''Anonymous'';

// Template literals
const message = `Hello, ${name}! Welcome to ${siteName}.`;
```

### 2. Error Handling

```javascript
// Async/await with proper error handling
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error(''Failed to fetch user data:'', error);
    throw error; // Re-throw if caller needs to handle
  }
}
```

## Development Workflow

### 1. Version Control

```bash
# Conventional commit messages
git commit -m "feat: add user authentication"
git commit -m "fix: resolve memory leak in component"
git commit -m "docs: update API documentation"
```

### 2. Testing

```javascript
// Unit test example
import { render, screen, fireEvent } from ''@testing-library/react'';
import Button from ''./Button'';

test(''button handles click events'', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  
  fireEvent.click(screen.getByText(''Click me''));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

## Tools and Setup

1. **Linting**: ESLint, Prettier
2. **Testing**: Jest, Testing Library
3. **Bundling**: Vite, Webpack
4. **CI/CD**: GitHub Actions, Vercel
5. **Monitoring**: Sentry, LogRocket

Following these practices will help you build maintainable, performant, and accessible web applications! 🌐',
    1,
    1,
    35,
    12,
    298,
    0,
    NULL,
    NULL,
    1736632422,
    1736632422
  ),

  -- Article 5: Git Version Control
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z5',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZF',
    'Git Version Control: From Beginner to Advanced',
    'git-version-control-beginner-advanced',
    'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=600&fit=crop',
    'Complete guide to Git version control system with practical examples and workflows.',
    '# Git Version Control: From Beginner to Advanced

Git is the most popular version control system used by developers worldwide. Let''s master it step by step.

## Getting Started with Git

### Initial Setup

```bash
# Configure your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Create a new repository
git init my-project
cd my-project

# Or clone an existing repository
git clone https://github.com/username/repository.git
```

### Basic Commands

```bash
# Check status
git status

# Add files to staging area
git add file.txt
git add .  # Add all files

# Commit changes
git commit -m "Add initial files"

# View commit history
git log
git log --oneline  # Simplified view
```

## Branching and Merging

### Creating and Switching Branches

```bash
# Create and switch to a new branch
git checkout -b feature/user-auth

# Or using newer syntax
git switch -c feature/user-auth

# List all branches
git branch

# Switch between branches
git checkout main
git switch main
```

### Merging Strategies

```bash
# Merge feature branch into main
git checkout main
git merge feature/user-auth

# Rebase (alternative to merge)
git checkout feature/user-auth
git rebase main

# Interactive rebase (clean up commits)
git rebase -i HEAD~3
```

## Remote Repositories

### Working with Remotes

```bash
# Add remote repository
git remote add origin https://github.com/username/repo.git

# Push to remote
git push origin main
git push -u origin feature/new-feature  # Set upstream

# Pull from remote
git pull origin main

# Fetch without merging
git fetch origin
```

### Collaborative Workflow

```bash
# Before starting work
git pull origin main

# Create feature branch
git checkout -b feature/add-login

# Work on your feature...
git add .
git commit -m "Implement login functionality"

# Push to remote
git push origin feature/add-login

# Create pull request on GitHub/GitLab
```

## Advanced Git Techniques

### Stashing Changes

```bash
# Save current work temporarily
git stash

# Save with message
git stash push -m "Work in progress on login"

# List stashes
git stash list

# Apply stash
git stash pop       # Apply and remove
git stash apply     # Apply but keep stash
```

### Cherry-picking

```bash
# Apply specific commit to current branch
git cherry-pick <commit-hash>

# Cherry-pick multiple commits
git cherry-pick <commit1> <commit2>
```

### Undoing Changes

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert a commit (create new commit)
git revert <commit-hash>

# Unstage files
git reset file.txt
```

## Git Workflows

### Feature Branch Workflow

```bash
# 1. Start from main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/shopping-cart

# 3. Work and commit
git add .
git commit -m "Add shopping cart functionality"

# 4. Push and create PR
git push origin feature/shopping-cart
```

### Gitflow Workflow

```bash
# Main branches
# - main: production-ready code
# - develop: integration branch

# Supporting branches
# - feature/*: new features
# - release/*: prepare for release
# - hotfix/*: urgent fixes

# Example feature workflow
git checkout develop
git checkout -b feature/payment-integration
# ... work on feature ...
git checkout develop
git merge feature/payment-integration
git branch -d feature/payment-integration
```

## Best Practices

### Commit Messages

```bash
# Good commit messages
git commit -m "feat: add user authentication system"
git commit -m "fix: resolve memory leak in image processing"
git commit -m "docs: update API documentation"
git commit -m "refactor: optimize database queries"

# Bad commit messages (avoid these)
git commit -m "fix"
git commit -m "changes"
git commit -m "work in progress"
```

### .gitignore Examples

```gitignore
# Dependencies
node_modules/
vendor/

# Environment files
.env
.env.local
.env.production

# Build outputs
dist/
build/
*.min.js

# IDE files
.vscode/
.idea/
*.swp

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
logs/
```

## Useful Git Aliases

```bash
# Add these to your .gitconfig
[alias]
    st = status
    co = checkout
    br = branch
    cm = commit -m
    lg = log --oneline --graph --decorate
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = !gitk
```

## Troubleshooting Common Issues

### Merge Conflicts

```bash
# When conflicts occur
git status  # See conflicted files

# Edit files to resolve conflicts
# Look for conflict markers:
# <<<<<<< HEAD
# Your changes
# =======
# Their changes
# >>>>>>> branch-name

# After resolving
git add resolved-file.txt
git commit -m "Resolve merge conflict"
```

### Accidentally Committed to Wrong Branch

```bash
# Move commits to correct branch
git checkout correct-branch
git cherry-pick <commit-hash>

# Remove from wrong branch
git checkout wrong-branch
git reset --hard HEAD~1
```

## Git Hooks

```bash
# Pre-commit hook example
#!/bin/sh
# .git/hooks/pre-commit

# Run tests before commit
npm test
if [ $? -ne 0 ]; then
    echo "Tests failed. Commit aborted."
    exit 1
fi

# Check code formatting
npm run lint
if [ $? -ne 0 ]; then
    echo "Linting failed. Commit aborted."
    exit 1
fi
```

Master these Git concepts and you''ll be confident managing any codebase! 🚀',
    1,
    1,
    42,
    8,
    356,
    0,
    NULL,
    NULL,
    1736546022,
    1736546022
  ),

  -- Article 6: Database Design (Draft)
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z6',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZG',
    'Database Design Principles and Normalization',
    'database-design-principles-normalization',
    'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=600&fit=crop',
    'Learn database design principles, normalization, and best practices for building efficient databases.',
    '# Database Design Principles and Normalization

Good database design is crucial for building scalable and maintainable applications. Let''s explore the fundamental principles.

## Database Design Principles

### 1. Data Integrity

```sql
-- Primary key ensures uniqueness
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Foreign key maintains referential integrity
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Avoid Data Redundancy

```sql
-- Bad: Redundant user information
CREATE TABLE orders_bad (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    user_address TEXT,
    product_name VARCHAR(255),
    quantity INTEGER,
    price DECIMAL(10,2)
);

-- Good: Normalized design
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    address TEXT
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10,2)
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Normalization Forms

### First Normal Form (1NF)

- Each column contains atomic values
- No repeating groups

```sql
-- Violates 1NF
CREATE TABLE students_bad (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    subjects VARCHAR(255) -- "Math, Science, English"
);

-- Follows 1NF
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE student_subjects (
    student_id INTEGER REFERENCES students(id),
    subject_id INTEGER REFERENCES subjects(id),
    PRIMARY KEY (student_id, subject_id)
);
```

### Second Normal Form (2NF)

- Must be in 1NF
- No partial dependencies on composite primary key

```sql
-- Violates 2NF
CREATE TABLE order_details_bad (
    order_id INTEGER,
    product_id INTEGER,
    product_name VARCHAR(255), -- Depends only on product_id
    product_price DECIMAL(10,2), -- Depends only on product_id
    quantity INTEGER,
    PRIMARY KEY (order_id, product_id)
);

-- Follows 2NF
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    price DECIMAL(10,2)
);

CREATE TABLE order_details (
    order_id INTEGER,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER,
    PRIMARY KEY (order_id, product_id)
);
```

### Third Normal Form (3NF)

- Must be in 2NF
- No transitive dependencies

```sql
-- Violates 3NF
CREATE TABLE employees_bad (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    department_id INTEGER,
    department_name VARCHAR(255), -- Depends on department_id
    department_budget DECIMAL(15,2) -- Depends on department_id
);

-- Follows 3NF
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    budget DECIMAL(15,2)
);

CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    department_id INTEGER REFERENCES departments(id)
);
```

This is still a work in progress. More content coming soon...',
    0,
    0,
    0,
    0,
    12,
    0,
    NULL,
    NULL,
    1736891622,
    1736891622
  ),

  -- Article 7: CSS Flexbox Basics
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z7',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZB',
    'CSS Flexbox: Quick Start Guide',
    'css-flexbox-quick-start-guide',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    'Learn CSS Flexbox fundamentals with simple examples to build flexible layouts.',
    '# CSS Flexbox: Quick Start Guide

Flexbox is a powerful CSS layout method that makes it easy to create flexible and responsive designs.

## Basic Setup

```css
.container {
  display: flex;
}
```

## Main Properties

### For Container (Parent)

```css
.flex-container {
  display: flex;
  flex-direction: row; /* row | column */
  justify-content: center; /* start | end | center | space-between */
  align-items: center; /* start | end | center | stretch */
  gap: 1rem;
}
```

### For Items (Children)

```css
.flex-item {
  flex: 1; /* grow, shrink, basis */
  align-self: center; /* override parent align-items */
}
```

## Common Patterns

### Navigation Bar

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
}
```

### Card Layout

```css
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  flex: 1 1 300px; /* grow shrink basis */
  min-height: 200px;
}
```

### Centering

```css
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
```

## Tips

- Use `flex-wrap: wrap` for responsive layouts
- `gap` property is better than margins for spacing
- `flex: 1` makes items grow equally
- Use `align-self` to override individual item alignment

Flexbox makes layouts much easier! 🎨',
    1,
    1,
    18,
    2,
    142,
    0,
    NULL,
    NULL,
    1736459622,
    1736459622
  ),

  -- Article 8: Node.js Express Setup
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z8',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZC',
    'Setting Up Express.js API in 10 Minutes',
    'setting-up-expressjs-api-10-minutes',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
    'Quick tutorial to create a RESTful API with Express.js and basic middleware.',
    '# Setting Up Express.js API in 10 Minutes

Express.js makes it easy to build web APIs in Node.js. Let''s create one quickly!

## Installation

```bash
mkdir my-api
cd my-api
npm init -y
npm install express cors helmet morgan
```

## Basic Server

```javascript
// server.js
const express = require(''express'');
const cors = require(''cors'');
const helmet = require(''helmet'');
const morgan = require(''morgan'');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan(''combined''));
app.use(express.json());

// Routes
app.get(''/api/health'', (req, res) => {
  res.json({ status: ''OK'', timestamp: new Date().toISOString() });
});

// Sample data
const users = [
  { id: 1, name: ''John'', email: ''john@example.com'' },
  { id: 2, name: ''Jane'', email: ''jane@example.com'' }
];

// GET all users
app.get(''/api/users'', (req, res) => {
  res.json(users);
});

// GET user by ID
app.get(''/api/users/:id'', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: ''User not found'' });
  res.json(user);
});

// POST new user
app.post(''/api/users'', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: ''Name and email required'' });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Testing

```bash
# Start server
node server.js

# Test endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/users
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d ''{"name":"Bob","email":"bob@example.com"}''
```

That''s it! You have a working API with CRUD operations. 🚀',
    1,
    1,
    25,
    4,
    168,
    0,
    NULL,
    NULL,
    1736373222,
    1736373222
  ),

  -- Article 9: VS Code Tips
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z9',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZD',
    '10 VS Code Tips Every Developer Should Know',
    '10-vscode-tips-every-developer-should-know',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
    'Boost your productivity with these essential VS Code shortcuts and features.',
    '# 10 VS Code Tips Every Developer Should Know

VS Code is packed with features that can boost your productivity. Here are the most useful ones!

## 1. Multi-Cursor Editing

- `Ctrl + D` - Select next occurrence
- `Ctrl + Shift + L` - Select all occurrences
- `Alt + Click` - Add cursor at position

## 2. Command Palette

- `Ctrl + Shift + P` - Open command palette
- Type commands like "format", "git", "settings"

## 3. Quick File Navigation

- `Ctrl + P` - Quick open files
- `Ctrl + Shift + E` - Focus file explorer
- `Ctrl + Tab` - Switch between open files

## 4. Integrated Terminal

- `Ctrl + ` ` (backtick) - Toggle terminal
- `Ctrl + Shift + ` ` - Create new terminal
- `Ctrl + PageUp/PageDown` - Switch terminals

## 5. Code Folding

- `Ctrl + Shift + [` - Fold region
- `Ctrl + Shift + ]` - Unfold region
- `Ctrl + K, Ctrl + 0` - Fold all

## 6. Find and Replace

- `Ctrl + F` - Find
- `Ctrl + H` - Replace
- `Ctrl + Shift + F` - Find in files

## 7. Zen Mode

- `Ctrl + K, Z` - Enter zen mode (distraction-free)
- `Esc Esc` - Exit zen mode

## 8. Extensions

Essential extensions:
- **Prettier** - Code formatter
- **GitLens** - Git history
- **Live Server** - Local development server
- **Auto Rename Tag** - HTML/XML tag pairs

## 9. Debugging

- `F5` - Start debugging
- `F9` - Toggle breakpoint
- `F10` - Step over
- `F11` - Step into

## 10. Snippets

Create custom snippets in `Preferences > Configure User Snippets`

```json
{
  "Console Log": {
    "prefix": "cl",
    "body": ["console.log($1);"],
    "description": "Quick console log"
  }
}
```

These tips will make you much more efficient! ⚡',
    1,
    1,
    31,
    6,
    203,
    0,
    NULL,
    NULL,
    1736286822,
    1736286822
  ),

  -- Article 10: API Testing with Postman
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7ZA',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZE',
    'API Testing with Postman: Essential Guide',
    'api-testing-postman-essential-guide',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    'Learn how to test REST APIs effectively using Postman with practical examples.',
    '# API Testing with Postman: Essential Guide

Postman is the most popular tool for API testing. Let''s learn how to use it effectively!

## Getting Started

1. Download Postman from [postman.com](https://postman.com)
2. Create a free account
3. Start with a new collection

## Basic Request Types

### GET Request

```
GET https://jsonplaceholder.typicode.com/posts/1
```

Headers:
```
Content-Type: application/json
```

### POST Request

```
POST https://jsonplaceholder.typicode.com/posts
```

Body (JSON):
```json
{
  "title": "My New Post",
  "body": "This is the content",
  "userId": 1
}
```

### PUT Request

```
PUT https://jsonplaceholder.typicode.com/posts/1
```

### DELETE Request

```
DELETE https://jsonplaceholder.typicode.com/posts/1
```

## Environment Variables

Create environments for different stages:

**Development**
- `base_url`: `http://localhost:3000`
- `api_key`: `dev-key-123`

**Production**
- `base_url`: `https://api.example.com`
- `api_key`: `prod-key-456`

Use in requests: `{{base_url}}/api/users`

## Tests

Add tests to verify responses:

```javascript
// Status code test
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

// Response time test
pm.test("Response time is less than 200ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(200);
});

// JSON data test
pm.test("User has email", function () {
    const jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property(''email'');
});
```

## Pre-request Scripts

Set up data before requests:

```javascript
// Generate random email
const randomEmail = `user${Math.floor(Math.random() * 1000)}@example.com`;
pm.environment.set("random_email", randomEmail);

// Set timestamp
pm.environment.set("timestamp", new Date().toISOString());
```

## Collection Runner

1. Select your collection
2. Choose environment
3. Set iterations and delay
4. Run all requests automatically

## Best Practices

- Organize requests in folders
- Use descriptive names
- Add documentation
- Share collections with team
- Use environment variables for URLs
- Write comprehensive tests

Postman makes API testing much easier! 🧪',
    1,
    1,
    19,
    3,
    156,
    0,
    NULL,
    NULL,
    1736200422,
    1736200422
  ),

  -- Article 11: MongoDB Basics
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7ZB',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZF',
    'MongoDB Basics: Getting Started with NoSQL',
    'mongodb-basics-getting-started-nosql',
    'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=600&fit=crop',
    'Introduction to MongoDB NoSQL database with essential commands and concepts.',
    '# MongoDB Basics: Getting Started with NoSQL

MongoDB is a popular NoSQL database that stores data in flexible, JSON-like documents.

## Installation

```bash
# macOS with Homebrew
brew install mongodb-community

# Windows - Download from mongodb.com
# Ubuntu
sudo apt install mongodb

# Start MongoDB service
mongod
```

## Basic Concepts

- **Database** - Container for collections
- **Collection** - Group of documents (like a table)
- **Document** - JSON-like data record
- **Field** - Key-value pair in document

## Basic Commands

### Database Operations

```javascript
// Show databases
show dbs

// Create/switch database
use myapp

// Show current database
db

// Drop database
db.dropDatabase()
```

### Collection Operations

```javascript
// Show collections
show collections

// Create collection
db.createCollection("users")

// Drop collection
db.users.drop()
```

### CRUD Operations

#### Create (Insert)

```javascript
// Insert one document
db.users.insertOne({
  name: "John Doe",
  email: "john@example.com",
  age: 30,
  active: true
});

// Insert multiple documents
db.users.insertMany([
  { name: "Jane", email: "jane@example.com", age: 25 },
  { name: "Bob", email: "bob@example.com", age: 35 }
]);
```

#### Read (Find)

```javascript
// Find all documents
db.users.find()

// Find with condition
db.users.find({ age: { $gte: 30 } })

// Find one document
db.users.findOne({ email: "john@example.com" })

// Find with projection (select fields)
db.users.find({}, { name: 1, email: 1, _id: 0 })
```

#### Update

```javascript
// Update one document
db.users.updateOne(
  { email: "john@example.com" },
  { $set: { age: 31 } }
);

// Update multiple documents
db.users.updateMany(
  { active: { $ne: false } },
  { $set: { status: "verified" } }
);
```

#### Delete

```javascript
// Delete one document
db.users.deleteOne({ email: "john@example.com" });

// Delete multiple documents
db.users.deleteMany({ active: false });
```

## Query Operators

```javascript
// Comparison
db.users.find({ age: { $gt: 25, $lt: 40 } })
db.users.find({ name: { $in: ["John", "Jane"] } })

// Logical
db.users.find({
  $and: [
    { age: { $gte: 25 } },
    { active: true }
  ]
})

// Text search
db.users.find({ name: { $regex: /john/i } })
```

## Indexing

```javascript
// Create index
db.users.createIndex({ email: 1 })

// Compound index
db.users.createIndex({ name: 1, age: -1 })

// Show indexes
db.users.getIndexes()
```

MongoDB is perfect for flexible, scalable applications! 🍃',
    1,
    1,
    26,
    5,
    178,
    0,
    NULL,
    NULL,
    1736114022,
    1736114022
  ),

  -- Article 12: Docker Containers
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7ZC',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZG',
    'Docker Containers: Quick Start',
    'docker-containers-quick-start',
    'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&h=600&fit=crop',
    'Learn Docker basics for containerizing applications efficiently.',
    '# Docker Containers: Quick Start

Docker helps you package applications with their dependencies into containers.

## Basic Commands

```bash
# Pull image
docker pull nginx

# Run container
docker run -p 80:80 nginx

# List containers
docker ps

# Stop container
docker stop container_id
```

## Dockerfile Example

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Docker makes deployment consistent! 🐳',
    1,
    1,
    12,
    2,
    89,
    0,
    NULL,
    NULL,
    1736027622,
    1736027622
  ),

  -- Article 13: Tailwind CSS
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7ZD',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZB',
    'Tailwind CSS: Utility-First Styling',
    'tailwind-css-utility-first-styling',
    'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop',
    'Master Tailwind CSS utility classes for rapid UI development.',
    '# Tailwind CSS: Utility-First Styling

Tailwind CSS provides utility classes for building UIs quickly.

## Common Classes

```html
<!-- Flexbox -->
<div class="flex items-center justify-between">
  <h1 class="text-2xl font-bold">Title</h1>
  <button class="px-4 py-2 bg-blue-500 text-white rounded">Click</button>
</div>

<!-- Grid -->
<div class="grid grid-cols-3 gap-4">
  <div class="bg-gray-100 p-4 rounded">Card 1</div>
  <div class="bg-gray-100 p-4 rounded">Card 2</div>
  <div class="bg-gray-100 p-4 rounded">Card 3</div>
</div>
```

## Responsive Design

```html
<div class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
  Responsive width
</div>
```

Tailwind speeds up development! ⚡',
    1,
    1,
    16,
    1,
    95,
    0,
    NULL,
    NULL,
    1735941222,
    1735941222
  ),

  -- Article 14: TypeScript Basics
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7ZE',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZC',
    'TypeScript Fundamentals',
    'typescript-fundamentals',
    'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop',
    'Get started with TypeScript for better JavaScript development.',
    '# TypeScript Fundamentals

TypeScript adds static types to JavaScript for better development experience.

## Basic Types

```typescript
// Primitives
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;

// Arrays
let numbers: number[] = [1, 2, 3];
let fruits: Array<string> = ["apple", "banana"];

// Objects
interface User {
  id: number;
  name: string;
  email?: string; // Optional
}

const user: User = {
  id: 1,
  name: "John"
};
```

## Functions

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}

const add = (a: number, b: number): number => a + b;
```

TypeScript catches errors early! 🛡️',
    1,
    1,
    14,
    3,
    102,
    0,
    NULL,
    NULL,
    1735854822,
    1735854822
  ),

  -- Article 15: REST API Design
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7ZF',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZD',
    'REST API Design Best Practices',
    'rest-api-design-best-practices',
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=600&fit=crop',
    'Learn how to design clean and consistent REST APIs.',
    '# REST API Design Best Practices

Good API design makes integration easier for developers.

## HTTP Methods

```
GET    /api/users        # Get all users
GET    /api/users/123    # Get user by ID
POST   /api/users        # Create new user
PUT    /api/users/123    # Update user
DELETE /api/users/123    # Delete user
```

## Response Format

```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "John",
    "email": "john@example.com"
  },
  "message": "User retrieved successfully"
}
```

## Error Handling

```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with ID 123 not found"
  },
  "status": 404
}
```

Consistent APIs improve developer experience! 🔗',
    1,
    1,
    8,
    1,
    67,
    0,
    NULL,
    NULL,
    1735768422,
    1735768422
  ),

  -- Article 16: Webpack Configuration
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z10',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZE',
    'Webpack Configuration Guide',
    'webpack-configuration-guide',
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=600&fit=crop',
    'Essential Webpack setup for modern JavaScript projects.',
    '# Webpack Configuration Guide

Webpack bundles your JavaScript modules for production.

## Basic Config

```javascript
// webpack.config.js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
};
```

## Common Loaders

- `babel-loader` - JavaScript transpiling
- `css-loader` - CSS imports
- `file-loader` - Assets

Webpack optimizes your builds! 📦',
    1,
    1,
    9,
    2,
    78,
    0,
    NULL,
    NULL,
    1735682022,
    1735682022
  ),

  -- Article 17: PWA Basics
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z11',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZF',
    'Progressive Web Apps (PWA) Basics',
    'progressive-web-apps-pwa-basics',
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
    'Build web apps that work like native mobile apps.',
    '# Progressive Web Apps (PWA) Basics

PWAs combine the best of web and mobile apps.

## Manifest File

```json
{
  "name": "My PWA",
  "short_name": "PWA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## Service Worker

```javascript
// sw.js
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("v1").then(cache => {
      return cache.addAll(["/", "/style.css", "/app.js"]);
    })
  );
});
```

PWAs work offline and feel native! 📱',
    1,
    1,
    11,
    1,
    84,
    0,
    NULL,
    NULL,
    1735595622,
    1735595622
  ),

  -- Article 18: GraphQL Introduction
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z12',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZG',
    'GraphQL: Query Language Introduction',
    'graphql-query-language-introduction',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
    'Learn GraphQL for flexible API queries.',
    '# GraphQL: Query Language Introduction

GraphQL lets clients request exactly the data they need.

## Basic Query

```graphql
query GetUser {
  user(id: "123") {
    id
    name
    email
    posts {
      title
      createdAt
    }
  }
}
```

## Schema Definition

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
}
```

## Resolver Example

```javascript
const resolvers = {
  Query: {
    user: (parent, { id }) => {
      return users.find(user => user.id === id);
    }
  }
};
```

GraphQL reduces over-fetching! 🔍',
    1,
    1,
    13,
    2,
    92,
    0,
    NULL,
    NULL,
    1735509222,
    1735509222
  ),

  -- Article 19: Vue.js Basics
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z13',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZB',
    'Vue.js: Progressive Framework',
    'vuejs-progressive-framework',
    'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&h=600&fit=crop',
    'Get started with Vue.js for reactive web applications.',
    '# Vue.js: Progressive Framework

Vue.js is a progressive framework for building user interfaces.

## Vue Component

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <button @click="increment">Count: {{ count }}</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "Hello Vue!",
      count: 0
    };
  },
  methods: {
    increment() {
      this.count++;
    }
  }
};
</script>

<style scoped>
h1 {
  color: #42b883;
}
</style>
```

## Directives

```html
<!-- Conditional rendering -->
<p v-if="isVisible">This is visible</p>

<!-- List rendering -->
<ul>
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>
</ul>
```

Vue is approachable and powerful! 💚',
    1,
    1,
    10,
    1,
    73,
    0,
    NULL,
    NULL,
    1735422822,
    1735422822
  ),

  -- Article 20: Linux Commands
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z14',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZC',
    'Essential Linux Commands for Developers',
    'essential-linux-commands-developers',
    'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=600&fit=crop',
    'Master the most useful Linux commands for development.',
    '# Essential Linux Commands for Developers

These commands will make you productive on Linux systems.

## File Operations

```bash
# List files
ls -la

# Copy files
cp source.txt destination.txt

# Move/rename
mv oldname.txt newname.txt

# Remove files
rm file.txt
rm -rf directory/

# Find files
find . -name "*.js"
```

## Text Processing

```bash
# View file content
cat file.txt
less file.txt

# Search in files
grep "pattern" file.txt
grep -r "pattern" directory/

# Count lines
wc -l file.txt
```

## Process Management

```bash
# List processes
ps aux

# Kill process
kill PID
killall process_name

# Run in background
command &
```

Linux commands boost productivity! 🐧',
    1,
    1,
    7,
    1,
    58,
    0,
    NULL,
    NULL,
    1735336422,
    1735336422
  ),

  -- Article 21: Sass/SCSS
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z15',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZD',
    'Sass/SCSS: CSS with Superpowers',
    'sass-scss-css-superpowers',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    'Learn Sass/SCSS for more powerful CSS development.',
    '# Sass/SCSS: CSS with Superpowers

Sass extends CSS with variables, nesting, and mixins.

## Variables

```scss
$primary-color: #3498db;
$font-size-large: 1.5rem;
$border-radius: 4px;

.button {
  background-color: $primary-color;
  font-size: $font-size-large;
  border-radius: $border-radius;
}
```

## Nesting

```scss
.navbar {
  background: #333;
  
  ul {
    list-style: none;
    
    li {
      display: inline-block;
      
      a {
        color: white;
        text-decoration: none;
        
        &:hover {
          color: $primary-color;
        }
      }
    }
  }
}
```

## Mixins

```scss
@mixin button-style($bg-color: #333) {
  padding: 10px 20px;
  background-color: $bg-color;
  border: none;
  border-radius: $border-radius;
  cursor: pointer;
}

.primary-btn {
  @include button-style($primary-color);
}
```

Sass makes CSS more maintainable! 🎨',
    1,
    1,
    15,
    2,
    96,
    0,
    NULL,
    NULL,
    1735250022,
    1735250022
  ),

  -- Article 22: Testing with Jest
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z16',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZE',
    'JavaScript Testing with Jest',
    'javascript-testing-jest',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop',
    'Write reliable tests for JavaScript applications using Jest.',
    '# JavaScript Testing with Jest

Jest is a popular testing framework for JavaScript applications.

## Basic Test

```javascript
// math.js
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

module.exports = { add, multiply };
```

```javascript
// math.test.js
const { add, multiply } = require("./math");

test("adds 1 + 2 to equal 3", () => {
  expect(add(1, 2)).toBe(3);
});

test("multiplies 3 * 4 to equal 12", () => {
  expect(multiply(3, 4)).toBe(12);
});
```

## Async Testing

```javascript
test("async data fetch", async () => {
  const data = await fetchData();
  expect(data).toBe("data");
});
```

## Mocking

```javascript
jest.mock("./api");

test("mocked function", () => {
  const mockFn = jest.fn();
  mockFn("arg1", "arg2");
  expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
});
```

Testing ensures code quality! 🧪',
    1,
    1,
    12,
    1,
    81,
    0,
    NULL,
    NULL,
    1735163622,
    1735163622
  ),

  -- Article 23: Redux State Management
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z17',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZF',
    'Redux: Predictable State Management',
    'redux-predictable-state-management',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
    'Manage application state with Redux for React apps.',
    '# Redux: Predictable State Management

Redux helps manage application state in a predictable way.

## Store Setup

```javascript
import { createStore } from "redux";

const initialState = {
  count: 0,
  user: null
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "SET_USER":
      return { ...state, user: action.payload };
    default:
      return state;
  }
}

const store = createStore(rootReducer);
```

## Actions

```javascript
const increment = () => ({ type: "INCREMENT" });
const setUser = (user) => ({ type: "SET_USER", payload: user });

store.dispatch(increment());
store.dispatch(setUser({ name: "John" }));
```

## React Integration

```javascript
import { useSelector, useDispatch } from "react-redux";

function Counter() {
  const count = useSelector(state => state.count);
  const dispatch = useDispatch();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>+</button>
    </div>
  );
}
```

Redux makes state predictable! 🔄',
    1,
    1,
    9,
    1,
    76,
    0,
    NULL,
    NULL,
    1735077222,
    1735077222
  ),

  -- Article 24: WebSockets Real-time
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z18',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZG',
    'WebSockets for Real-time Communication',
    'websockets-real-time-communication',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
    'Build real-time features with WebSocket connections.',
    '# WebSockets for Real-time Communication

WebSockets enable real-time, bidirectional communication.

## Client Side

```javascript
const socket = new WebSocket("ws://localhost:8080");

socket.onopen = () => {
  console.log("Connected to WebSocket");
  socket.send("Hello Server!");
};

socket.onmessage = (event) => {
  console.log("Message from server:", event.data);
};

socket.onclose = () => {
  console.log("Connection closed");
};
```

## Server Side (Node.js)

```javascript
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    console.log("Received:", message);
    // Broadcast to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Broadcast: ${message}`);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
```

WebSockets power real-time apps! ⚡',
    1,
    1,
    8,
    1,
    62,
    0,
    NULL,
    NULL,
    1734990822,
    1734990822
  ),

  -- Article 25: Regular Expressions
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z19',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZB',
    'Regular Expressions: Pattern Matching',
    'regular-expressions-pattern-matching',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
    'Master regex patterns for text processing and validation.',
    '# Regular Expressions: Pattern Matching

Regex helps you find and manipulate text patterns efficiently.

## Basic Patterns

```javascript
// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
console.log(emailRegex.test("user@example.com")); // true

// Phone number (US format)
const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
console.log(phoneRegex.test("(123) 456-7890")); // true

// Extract numbers
const text = "Price: $25.99";
const priceRegex = /\$(\d+\.\d{2})/;
const match = text.match(priceRegex);
console.log(match[1]); // "25.99"
```

## Common Patterns

```javascript
// Alphanumeric only
/^[a-zA-Z0-9]+$/

// URL validation
/^https?:\/\/.+/

// Password (8+ chars, letter + number)
/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
```

## Replace and Split

```javascript
const text = "Hello World 123";
const cleaned = text.replace(/\d+/g, ""); // Remove numbers
const words = text.split(/\s+/); // Split by whitespace
```

Regex is powerful for text processing! 🔍',
    1,
    1,
    6,
    1,
    54,
    0,
    NULL,
    NULL,
    1734904422,
    1734904422
  ),

  -- Article 26: Next.js Basics
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z20',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZC',
    'Next.js: React Framework',
    'nextjs-react-framework',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop',
    'Build production-ready React apps with Next.js.',
    '# Next.js: React Framework

Next.js provides everything you need for production React apps.

## Getting Started

```bash
npx create-next-app@latest my-app
cd my-app
npm run dev
```

## Pages and Routing

```javascript
// pages/index.js
export default function Home() {
  return <h1>Welcome to Next.js!</h1>;
}

// pages/about.js
export default function About() {
  return <h1>About Page</h1>;
}

// pages/blog/[slug].js
export default function BlogPost({ params }) {
  return <h1>Post: {params.slug}</h1>;
}
```

## API Routes

```javascript
// pages/api/users.js
export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json({ users: [] });
  }
}
```

## Data Fetching

```javascript
// Static generation
export async function getStaticProps() {
  const data = await fetch("https://api.example.com/data");
  return { props: { data } };
}

// Server-side rendering
export async function getServerSideProps() {
  const data = await fetch("https://api.example.com/data");
  return { props: { data } };
}
```

Next.js makes React production-ready! ⚛️',
    1,
    1,
    11,
    2,
    79,
    0,
    NULL,
    NULL,
    1734818022,
    1734818022
  ),

  -- Article 27: Package Managers
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z21',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZD',
    'Package Managers: npm, yarn, pnpm',
    'package-managers-npm-yarn-pnpm',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=600&fit=crop',
    'Compare and master different JavaScript package managers.',
    '# Package Managers: npm, yarn, pnpm

Choose the right package manager for your JavaScript projects.

## npm (Node Package Manager)

```bash
# Initialize project
npm init -y

# Install dependencies
npm install express
npm install -D nodemon

# Run scripts
npm run start
npm run build
```

## Yarn

```bash
# Initialize project
yarn init -y

# Install dependencies
yarn add express
yarn add -D nodemon

# Run scripts
yarn start
yarn build
```

## pnpm (Fast, disk efficient)

```bash
# Initialize project
pnpm init

# Install dependencies
pnpm add express
pnpm add -D nodemon

# Run scripts
pnpm start
pnpm build
```

## Lockfiles

- npm: `package-lock.json`
- yarn: `yarn.lock`
- pnpm: `pnpm-lock.yaml`

## Performance Comparison

- **pnpm**: Fastest, saves disk space
- **yarn**: Fast, good caching
- **npm**: Standard, widely supported

Choose based on your project needs! 📦',
    1,
    1,
    5,
    1,
    49,
    0,
    NULL,
    NULL,
    1734731622,
    1734731622
  ),

  -- Article 28: Async JavaScript
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z22',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZE',
    'Async JavaScript: Promises and Async/Await',
    'async-javascript-promises-async-await',
    'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&h=600&fit=crop',
    'Master asynchronous JavaScript with Promises and async/await.',
    '# Async JavaScript: Promises and Async/Await

Handle asynchronous operations effectively in JavaScript.

## Promises

```javascript
// Creating a Promise
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      if (success) {
        resolve("Data fetched successfully");
      } else {
        reject("Failed to fetch data");
      }
    }, 1000);
  });
};

// Using Promises
fetchData()
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

## Async/Await

```javascript
async function getData() {
  try {
    const response = await fetch("/api/users");
    const users = await response.json();
    return users;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Using async function
async function main() {
  const users = await getData();
  console.log(users);
}
```

## Promise Methods

```javascript
// Promise.all (parallel execution)
const [users, posts] = await Promise.all([
  fetch("/api/users"),
  fetch("/api/posts")
]);

// Promise.race (first to complete)
const result = await Promise.race([
  fetch("/api/fast"),
  fetch("/api/slow")
]);
```

Async/await makes code more readable! ⏱️',
    1,
    1,
    7,
    1,
    65,
    0,
    NULL,
    NULL,
    1734645222,
    1734645222
  ),

  -- Article 29: Browser DevTools
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z23',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZF',
    'Browser DevTools: Debug Like a Pro',
    'browser-devtools-debug-like-pro',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop',
    'Master browser DevTools for efficient web debugging.',
    '# Browser DevTools: Debug Like a Pro

DevTools are essential for web development debugging.

## Console Tips

```javascript
// Different log levels
console.log("Info message");
console.warn("Warning message");
console.error("Error message");

// Styled console output
console.log("%cStyled text", "color: blue; font-size: 16px;");

// Table view for objects
console.table([{name: "John", age: 30}, {name: "Jane", age: 25}]);

// Grouping logs
console.group("User Info");
console.log("Name: John");
console.log("Age: 30");
console.groupEnd();
```

## Elements Panel

- Inspect HTML structure
- Edit styles in real-time
- View computed styles
- Check accessibility properties

## Network Panel

- Monitor HTTP requests
- Check response times
- Analyze payload sizes
- Test different network conditions

## Sources Panel

- Set breakpoints
- Step through code
- Watch variable values
- Edit and save changes

## Performance Panel

- Record runtime performance
- Identify bottlenecks
- Analyze frame rates
- Memory usage profiling

DevTools boost debugging efficiency! 🔧',
    1,
    1,
    4,
    1,
    43,
    0,
    NULL,
    NULL,
    1734558822,
    1734558822
  ),

  -- Article 30: Code Review Best Practices
  (
    'art_01HQTG5BBRX3XY1JJVNN6CZ7Z24',
    'usr_01HQTG5BBRX3XY1JJVNN6CZ7ZG',
    'Code Review Best Practices',
    'code-review-best-practices',
    'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=600&fit=crop',
    'Improve code quality through effective code review processes.',
    '# Code Review Best Practices

Good code reviews improve code quality and team collaboration.

## What to Look For

### Code Quality
- Readability and clarity
- Proper naming conventions
- Code organization
- Performance considerations

### Functionality
- Logic correctness
- Edge case handling
- Error handling
- Test coverage

### Security
- Input validation
- Authentication checks
- Data sanitization
- Secure coding practices

## Review Guidelines

### For Authors
```markdown
- Keep changes small and focused
- Write clear commit messages
- Add tests for new features
- Update documentation
- Self-review before submitting
```

### For Reviewers
```markdown
- Be constructive and respectful
- Focus on the code, not the person
- Provide specific feedback
- Suggest improvements
- Approve when satisfied
```

## Common Issues

- **Nitpicking**: Focus on important issues
- **Delayed reviews**: Review promptly
- **Unclear feedback**: Be specific
- **Missing context**: Add explanations

## Tools

- GitHub Pull Requests
- GitLab Merge Requests
- Bitbucket Code Reviews
- Azure DevOps

Good reviews make better code! ✅',
    1,
    1,
    3,
    0,
    41,
    0,
    NULL,
    NULL,
    1734472422,
    1734472422
  );

INSERT INTO posts(id, user_id, content, like_count, comment_count, resource_type, resource_id, created_at, updated_at)
SELECT id, user_id, content, like_count, comment_count, 'article_post', id, created_at, updated_at FROM article;