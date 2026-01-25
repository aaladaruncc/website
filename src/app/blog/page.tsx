export default function BlogPage() {
  return (
    <main className="container-minimal">
      <section className="space-y-6 text-base text-neutral-800">
        <p className="text-sm text-neutral-700">
          <a
            className="underline underline-offset-4 decoration-neutral-300 transition hover:text-neutral-900 hover:decoration-neutral-700"
            href="/"
          >
            Home
          </a>
          {" / "}Blog
        </p>
        <p className="text-lg font-medium">Blog</p>
        <p>Coming soon.</p>
      </section>

    </main>
  )
}
