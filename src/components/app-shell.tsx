import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { SSLSMonogram } from "@/components/brand";

import { NAV_GROUPS, ROUTE_REGISTRY } from "@/lib/route-registry";
import { cn } from "@/lib/utils";

/**
 * Application shell.
 *
 * Accessibility contract (ULW-AS-001 v1.3 as applied here):
 * - skip link is the first focusable element
 * - semantic landmarks: banner, navigation, main, contentinfo
 * - navigation is fully keyboard operable using native links
 * - the small-screen navigation is a real dialog: Escape closes it, focus stays
 *   inside it while it is open, focus returns to the button that opened it, and
 *   the page behind it does not scroll
 * - controls are sized to the TTR-001 acceptance rule
 *
 * This is an implementation of that rule, not a measurement of it. No global
 * touch-target audit has been run and FND-024 remains open.
 */
function BoundaryBanner() {
  return (
    <p
      data-boundary-banner="true"
      className="border-b-2 border-border-strong bg-muted px-4 py-2 text-center text-xs font-semibold text-foreground sm:text-sm"
    >
      PUBLIC SYNTHETIC PROTOTYPE. Not released. No personal data. Anyone with the link can reach
      this published surface; it is not access-controlled. All records shown are synthetic examples.
    </p>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      {NAV_GROUPS.map((group) => {
        const routes = ROUTE_REGISTRY.filter((route) => route.group === group.id);
        if (routes.length === 0) return null;
        return (
          <div key={group.id} data-nav-group={group.id}>
            <p className="px-3 pb-1 text-xs font-bold tracking-wide text-sidebar-foreground/85 uppercase">
              {group.label}
            </p>
            <ul className="flex flex-col gap-1">
              {routes.map((route) => (
                <li key={route.path}>
                  <Link
                    to={route.path}
                    onClick={onNavigate}
                    activeOptions={{ exact: route.path === "/" }}
                    activeProps={{
                      className:
                        "bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-sidebar-primary font-semibold",
                    }}
                    inactiveProps={{ className: "border-l-4 border-transparent" }}
                    className="flex min-h-11 items-center rounded-sm px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
                  >
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The small-screen navigation drawer.
 *
 * It is modal on purpose: on a phone it covers the page, so leaving the page
 * behind it reachable by keyboard would put focus somewhere the person cannot
 * see. The product group is rendered first and the governance group after it,
 * because the primary thing to reach on a small screen is the learning loop.
 */
function MobileNavDrawer({
  onClose,
  returnFocusTo,
}: {
  onClose: () => void;
  returnFocusTo: HTMLElement | null;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();
    const body = window.document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previousOverflow;
      returnFocusTo?.focus();
    };
  }, [returnFocusTo]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
      if (nodes.length === 0) return;
      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      const active = window.document.activeElement;
      if (event.shiftKey && (active === first || !panelRef.current?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Primary navigation"
        onKeyDown={onKeyDown}
        className="absolute inset-y-0 start-0 flex w-80 max-w-[90vw] flex-col overflow-y-auto bg-sidebar p-3 shadow-lg"
      >
        <div className="flex items-center justify-between gap-3 pb-3">
          <p className="px-2 font-display text-sm font-bold text-sidebar-foreground">Go to</p>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 min-w-11 rounded-sm border border-sidebar-border px-3 text-sm font-semibold text-sidebar-foreground"
          >
            Close menu
          </button>
        </div>
        <nav aria-label="Primary">
          <NavList onNavigate={onClose} />
        </nav>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only rounded-sm bg-primary px-4 py-3 font-semibold text-primary-foreground focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50"
      >
        Skip to main content
      </a>

      <header className="border-b border-border bg-sidebar">
        <BoundaryBanner />
        <div className="px-4 py-3 lg:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <SSLSMonogram size={36} className="shrink-0 text-ssls-silver-blue" />
              <div className="min-w-0">
                <p className="font-display text-base font-bold text-sidebar-foreground">
                  Silver Streak Learning Systems
                </p>
                <p className="text-xs text-sidebar-foreground/85">
                  Integrated Foundation and Authority Shell
                </p>
              </div>
            </div>

            <button
              ref={triggerRef}
              type="button"
              aria-expanded={mobileNavOpen}
              aria-haspopup="dialog"
              onClick={() => setMobileNavOpen(true)}
              className="min-h-11 min-w-11 rounded-sm border border-sidebar-border px-3 text-sm font-semibold text-sidebar-foreground lg:hidden"
            >
              Menu
            </button>
          </div>
        </div>
      </header>

      {mobileNavOpen ? (
        <MobileNavDrawer
          onClose={() => setMobileNavOpen(false)}
          returnFocusTo={triggerRef.current}
        />
      ) : null}

      <div className="lg:flex">
        <nav
          aria-label="Sections"
          className={cn("hidden w-72 shrink-0 border-r border-border bg-sidebar p-3 lg:block")}
        >
          <NavList />
        </nav>

        <main id="main-content" className="w-full flex-1 px-4 py-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>

      <footer className="border-t border-border bg-surface px-4 py-4 text-xs text-muted-foreground lg:px-8">
        <p>
          Implemented foundation shell, governed proof scope. Not production ready, not district
          validated, not independently accessibility validated, not security certified.
        </p>
      </footer>
    </div>
  );
}
