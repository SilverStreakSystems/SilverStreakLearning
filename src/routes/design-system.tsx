import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/design-system")({
  component: () => <Outlet />,
});
