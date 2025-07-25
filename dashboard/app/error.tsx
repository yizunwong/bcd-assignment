'use client';

export default function GlobalError({ error }: { error: Error }) {
  return (
    <html>
      <body className="flex h-screen items-center justify-center">
        <div>Something went wrong: {error.message}</div>
      </body>
    </html>
  );
}
