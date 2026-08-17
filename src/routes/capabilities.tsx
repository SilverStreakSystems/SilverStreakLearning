import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Layout route for the Capability Command View. Child routes render the
 * command view itself and the per-capability detail pages.
 */
export const Route = createFileRoute("/capabilities")({
  component: () => <Outlet />,
});
