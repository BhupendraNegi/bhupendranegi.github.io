---
layout: post
title: React Context vs Redux vs Zustand
---

-------
Choosing the right state management tool in React depends on the complexity of your app and your specific needs. In this post, we’ll compare React Context, Redux, and Zustand using code examples and discussing their pros and cons.

##### React Context
React Context is a simple, built-in solution for passing state across components without prop drilling.

```js
// AppContext.js
import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  return (
    <AppContext.Provider value=({ themes, setTheme })>
      {children}
    </AppContext.Provider>
  );
};

// Component.js
import React from 'react';
import { useAppContext } from './AppContext';

const ThemeToggle = () => {
  const { theme, setTheme } = useAppContext();
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Switch to {theme === 'light' ? 'dark' : 'light'} theme
    </button>
  );
};

// App.js
import React from 'react';
import { AppProvider } from './AppContext';
import ThemeToggle from './Component';

const App = () => (
  <AppProvider>
    <ThemeToggle />
  </AppProvider>
);

export default App;
```
##### When to Use:
1. Simple state management.
2. Small to medium-sized apps.
3. Global state like themes, authentication, etc.

##### Pros:
1. Built into React, no external dependencies.
2. Simple to set up and use.
3. No extra boilerplate code.
##### Cons:
1. Not optimized for large apps with frequent state changes (could lead to re-renders).
2. Doesn’t support side effects, middleware, or advanced features.
3. Limited scalability for more complex state management needs.


##### Redux
Redux is a powerful state management library, especially useful for large applications that require predictable state, complex logic, and handling side effects.

```js
// actions.js
export const setUser = (user) => ({
  type: 'SET_USER',
  payload: user
});

// reducer.js
const initialState = { user: null };

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

// store.js
import { createStore } from 'redux';
import { userReducer } from './reducer';
const store = createStore(userReducer);

// Component.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from './actions';

const UserComponent = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  
  const handleLogin = () => {
    dispatch(setUser({ name: 'John Doe' }));
  };

  return (
    <div>
      <p>{user ? `Hello, ${user.name}` : 'Please log in'}</p>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
};

// App.js
import React from 'react';
import { Provider } from 'react-redux';
import UserComponent from './Component';
import store from './store';

const App = () => (
  <Provider store={store}>
    <UserComponent />
  </Provider>
);

export default App;
```
##### When to Use:
1. Large-scale apps with complex state.
2. Need for centralized state management.
3. Handling async operations (like API calls).

##### Pros:
1. Scalable and predictable state management.
2. Powerful tools (e.g., Redux DevTools) for debugging.
3. Good for handling side effects, async actions, and middleware (e.g., Redux Thunk).

##### Cons:
1. Boilerplate-heavy (requires actions, reducers, and types).
2. Steeper learning curve.
3. Overkill for small to medium apps with simple state needs.

##### Zustand
Zustand is a minimalistic state management library that provides a simple API with hooks, ideal for medium to large apps.

```js
// store.js
import create from 'zustand';

const useStore = create((set) => ({
  theme: 'light',
  setTheme: (newTheme) => set({ theme: newTheme })
}));

// Component.js
import React from 'react';
import { useStore } from './store';

const ThemeToggle = () => {
  const { theme, setTheme } = useStore();
  
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Switch to {theme === 'light' ? 'dark' : 'light'} theme
    </button>
  );
};

// App.js
import React from 'react';
import ThemeToggle from './Component';

const App = () => (
  <div>
    <ThemeToggle />
  </div>
);

export default App;
```
##### When to Use:
1. Medium to large apps that need flexibility without boilerplate.
2. Projects requiring a simple, hook-based API for state management.

##### Pros:
1. Lightweight and minimalistic.
2. No boilerplate code (no actions, reducers).
3. Built with hooks and easy to use.
4. Supports React’s modern API with flexibility.

##### Cons:
1. Lacks advanced features (like middleware) compared to Redux.
2. Less mature than Redux, so it may not have the same robust ecosystem.
3. No built-in support for handling side effects (although this can be added).

##### Comparison Summary

| Feature             | React Context                           | Redux                                | Zustand                                       |
|---------------------|-----------------------------------------|--------------------------------------|-----------------------------------------------|
| Boilerplate         | Minimal (only context and provider)     | High (actions, reducers, store setup)| Minimal (only store setup)                    |
| Learning Curve      | Very low                                | High (due to actions, reducers, etc.)| Low (simple and hook-based)                   |
| Async Handling      | No built-in support	                    | Supports via middleware (e.g., Thunk)| No built-in support (customizable)            |
| Performance         |	Can lead to re-renders in large apps    | Optimized for large apps	           | Good performance for medium-large apps        |
| State Sharing	      | Simple, but not suited for complex apps | Powerful, great for complex apps	   | Simple, flexible, ideal for medium-large apps |
| Best For	          | Small apps, simple global state	        | Large apps with complex state	       | Medium to large apps with simple setup        |






<!-- 
|Feature	| React Context |	Redux	| Zustand |
|----------|----------|----------|
|Boilerplate	|Minimal (only context and provider)	|High (actions, reducers, store setup)|	Minimal (only store setup)|

Learning Curve	Very low	High (due to actions, reducers, etc.)	Low (simple and hook-based)
Async Handling	No built-in support	Supports via middleware (e.g., Thunk)	No built-in support (customizable)
Performance	Can lead to re-renders in large apps	Optimized for large apps	Good performance for medium-large apps
State Sharing	Simple, but not suited for complex apps	Powerful, great for complex apps	Simple, flexible, ideal for medium-large apps
Best For	Small apps, simple global state	Large apps with complex state	Medium to large apps with simple setup -->
##### Conclusion
`React Context:` Great for small-to-medium apps with simple global state management. Best for lightweight use cases like themes or authentication.

`Redux:` Ideal for large apps with complex state, asynchronous actions, and side effects. Offers great debugging tools and scalability.

`Zustand:` A great middle ground for medium-to-large apps that need simplicity without the boilerplate of Redux. Perfect for apps with flexible state needs.

Choose the right tool based on your project’s complexity, your team’s familiarity with the library, and your state management needs!
