---
layout: post
title: Efficient Data Fetching with React Query
---

-------
React Query is a powerful library for managing server-state in React applications. It simplifies data fetching, caching, and synchronization, making your app faster and easier to maintain. In this blog, we’ll explore how to use React Query to fetch and cache data with a practical example.

##### Why Use React Query?

`Automatic Caching:` React Query caches data automatically and updates it when necessary.

`Out-of-the-Box Features:` It provides features like retries, background refetching, and stale data handling.

`Simplifies State Management:` Avoids the need for global state management for server data.

`Customizable and Flexible:` You can fine-tune how data is fetched, cached, and synchronized.

##### Setting Up React Query

First, install the necessary package:
```bash
npm install @tanstack/react-query
```

You’ll also need React Query Devtools for debugging:
```bash
npm install @tanstack/react-query-devtools
```

##### Configure QueryClient

Set up a QueryClient to manage your queries. Wrap your app with the QueryClientProvider:
```js
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <h1>React Query Example</h1>
        <MyComponent />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
```

##### Fetching and Caching Data

Let’s fetch and display a list of users from a public API.

Create a function to fetch data from the API:
```js
const fetchUsers = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
```

##### Use useQuery to Fetch Data

In your component, use the useQuery hook to fetch and cache the data:
```js
import React from 'react';
import { useQuery } from '@tanstack/react-query';

function MyComponent() {
  const { data, error, isLoading } = useQuery(['users'], fetchUsers);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default MyComponent;
```

##### Configure Query Options

React Query offers several options to fine-tune behavior:
```js
const { data, error, isLoading } = useQuery(['users'], fetchUsers, {
  staleTime: 60000, // Data is considered fresh for 60 seconds
  cacheTime: 300000, // Cache data for 5 minutes
  retry: 2, // Retry failed requests up to 2 times
  refetchOnWindowFocus: false, // Disable refetching on window focus
});
```

##### Pagination and Infinite Queries

React Query supports pagination and infinite scrolling with the useInfiniteQuery hook. For example:
```js
import { useInfiniteQuery } from '@tanstack/react-query';

const fetchUsersPage = async ({ pageParam = 1 }) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users?_page=${pageParam}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

function PaginatedComponent() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(['users'], fetchUsersPage, {
    getNextPageParam: (lastPage, allPages) => (lastPage.length ? allPages.length + 1 : undefined),
  });

  return (
    <div>
      {data?.pages.map((page, i) => (
        <ul key={i}>
          {page.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      ))}
      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? 'Loading...' : hasNextPage ? 'Load More' : 'No More Users'}
      </button>
    </div>
  );
}
```

##### Mutations

Mutations are used to create, update, or delete data. For example:
```js
import { useMutation, useQueryClient } from '@tanstack/react-query';

const addUser = async (newUser) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

function AddUserComponent() {
  const queryClient = useQueryClient();
  const mutation = useMutation(addUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['users']); // Refetch users after adding
    },
  });

  return (
    <button
      onClick={() => mutation.mutate({ name: 'New User', email: 'newuser@example.com' })}
    >
      Add User
    </button>
  );
}
```

##### Conclusion

React Query is a game-changer for managing server-state in React applications. Its features like automatic caching, background refetching, and retry logic reduce boilerplate and improve performance. Start using React Query today to streamline your data-fetching logic and enhance your app’s user experience!

