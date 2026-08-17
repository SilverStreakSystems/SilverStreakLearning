import { expect } from "vitest";
import { QueryClient } from "@tanstack/react-query";

import {
  RouterProvider,
  createMemoryHistory,
  createRouter,
} from "@tanstack/react-router";
import { render, screen, waitFor } from "@testing-library/react";
import { routeTree } from "@/routeTree.gen";

/**
 * Renders the real route tree at a given path so tests exercise the shell,
 * navigation, and route content exactly as the application composes them.
 */
export async function renderRoute(path: string) {
  const router = createRouter({
    routeTree,
    context: { queryClient: new QueryClient() },
    history: createMemoryHistory({ initialEntries: [path] }),
    defaultPendingMinMs: 0,
  });

  const result = render(<RouterProvider router={router as never} />);

  await waitFor(() => {
    expect(screen.getAllByRole("heading", { level: 1 }).length).toBeGreaterThan(0);
  });

  return { ...result, router };
}
