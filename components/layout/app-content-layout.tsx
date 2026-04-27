"use client";

export function AppContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-dvh bg-sidebar w-dvw">
      {/* Content wrapper */}
      <div className="flex flex-1 flex-col overflow-hidden px-2 py-4">
        <div className="flex h-full w-full flex-col rounded-md bg-background overflow-hidden">
          {/* Main content */}
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </main>
  );
}
