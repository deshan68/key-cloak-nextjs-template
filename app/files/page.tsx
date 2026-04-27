"use client";

export default function FilesPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-3xl font-bold">Files</h1>
        <p className="text-lg text-muted-foreground max-w-md">
          Manage and organize your files. Upload new files to get started.
        </p>
        <div className="mt-8 w-full max-w-md rounded-lg border border-dashed bg-muted p-8">
          <p className="text-muted-foreground">Files interface coming soon...</p>
        </div>
      </div>
    </div>
  );
}
