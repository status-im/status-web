import {
  createHashHistory,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from '../router.gen'
import { getQueryClient } from './query-client'

// Create a new router instance
const router = createRouter({
  routeTree,
  history: createHashHistory(),
  context: {
    queryClient: getQueryClient(),
  },
  // Since we're using React Query, we don't want loader calls to ever be stale
  defaultPreloadStaleTime: 0,
  defaultPreload: 'intent',
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function _RouterProvider() {
  return <RouterProvider router={router} />
}

export { _RouterProvider as RouterProvider }
