export default function Loading() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <div
        className="w-10 h-10 border-2 border-[#ffbd45] border-t-transparent rounded-full animate-spin"
        aria-hidden
      />
      <p className="mt-4 text-sm text-[var(--hm-muted)]">Ładowanie…</p>
    </main>
  );
}
