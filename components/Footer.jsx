import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-slate-900"
            >
              Biai<span className="text-blue-600">.ai</span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500">
              An open-source AI-powered business intelligence platform that
              turns business data into actionable insights.
            </p>

            <p className="mt-5 text-xs text-slate-400">
              Built with Next.js, FastAPI, Supabase & AI.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-slate-900">
              Product
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500">
              <Link
                href="/projects"
                className="transition hover:text-blue-600"
              >
                Projects
              </Link>

              <Link
                href="/projects/new"
                className="transition hover:text-blue-600"
              >
                Create Project
              </Link>

              <Link
                href="/about"
                className="transition hover:text-blue-600"
              >
                About
              </Link>
            </div>
          </div>

          {/* Open Source */}
          <div>
            <h3 className="font-semibold text-slate-900">
              Open Source
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500">
              <a
                href="https://github.com/hirdeshm/Biai"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-blue-600"
              >
                GitHub Repository ↗
              </a>

              <a
                href="https://github.com/hirdeshm/Biai/pulls"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-blue-600"
              >
                Contribute
              </a>

              <a
                href="https://github.com/hirdeshm/Biai/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-blue-600"
              >
                Report an Issue
              </a>
            </div>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold text-slate-900">
              Community
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-500">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-blue-600"
              >
                Discussions
              </a>

              {/* <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-blue-600"
              >
                Documentation
              </a> */}

              <a
                //href="mailto:hello@businessintelligence.ai"
                className="transition hover:text-blue-600"
              >
                hirdeshfiles4444@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-slate-200 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-slate-500 md:flex-row">

            <p>
              Free For All | Open to code
            </p>

            <div className="flex items-center gap-5">
              {/* <Link
                href="/privacy"
                className="transition hover:text-slate-900"
              >
                Privacy
              </Link>

              <Link
                href="/terms"
                className="transition hover:text-slate-900"
              >
                Terms
              </Link> */}

              <a
                href="https://github.com/hirdeshm/Biai"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-slate-700 transition hover:text-blue-600"
              >
                ⭐ Star on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}