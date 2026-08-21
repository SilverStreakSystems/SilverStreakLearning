import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/technology-decisions")({
  component: () => <Outlet />,
});
