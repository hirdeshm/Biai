export default function About() {
  return (
    <main className="min-h-screen bg-white text-slate-900 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            About BusinessIntelligence.ai
          </div>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
            Turn Business Data Into
            <span className="text-blue-600"> Clear Decisions.</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            BusinessIntelligence.ai is an AI-powered KPI intelligence platform
            designed to help businesses understand what changed, why it may
            have changed, and what actions they should consider next.
          </p>
        </div>

        {/* Mission / Vision / Values */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
              🎯
            </div>

            <h2 className="mt-6 text-xl font-semibold text-slate-900">
              Our Mission
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              To make business intelligence easier to understand by converting
              complex business data into meaningful insights and actionable
              recommendations.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
              💡
            </div>

            <h2 className="mt-6 text-xl font-semibold text-slate-900">
              Our Vision
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              To build an intelligent decision-support system that helps
              organizations move from simply viewing dashboards to
              understanding their business.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl">
              🚀
            </div>

            <h2 className="mt-6 text-xl font-semibold text-slate-900">
              Our Values
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Evidence over assumptions, clarity over complexity, and useful
              recommendations over information overload.
            </p>
          </div>
        </div>

        {/* What We Do */}
        <section className="mt-20 rounded-3xl bg-slate-50 px-8 py-14 md:px-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              What We Do
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
              From data to business intelligence
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Businesses often have data spread across sales, customers,
              products, marketing, web analytics, and inventory. Looking at
              each dataset separately can make it difficult to understand the
              bigger picture.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              BusinessIntelligence.ai brings these signals together and uses
              AI to identify important movements, connect supporting evidence,
              highlight possible causes, and suggest practical next steps.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Sales Intelligence",
              "Customer Insights",
              "Product Performance",
              "Marketing Analysis",
              "Web Analytics",
              "Inventory Intelligence",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-200 bg-white px-5 py-4 font-medium text-slate-800 shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* AI Approach */}
        <section className="mt-20 grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Our Approach
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Insights backed by evidence
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              Our goal is not to simply generate an AI response. The system
              first analyzes structured business data and then provides the AI
              with relevant evidence to build a business story.
            </p>

            <p className="mt-4 leading-8 text-slate-600">
              This helps separate observed facts from possible explanations and
              makes uncertainty explicit when the available data is not enough
              to support a conclusion.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">01</p>
                <p className="mt-1 font-semibold text-slate-900">
                  Detect meaningful KPI movements
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">02</p>
                <p className="mt-1 font-semibold text-slate-900">
                  Connect evidence across data sources
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">03</p>
                <p className="mt-1 font-semibold text-slate-900">
                  Generate business insights and actions
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-20 rounded-3xl bg-blue-600 px-8 py-14 text-center text-white md:px-16">
          <h2 className="text-3xl font-bold md:text-4xl">
            Ready to understand your business better?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-blue-100">
            Connect your business data and let BusinessIntelligence.ai turn
            your KPIs into a clear, evidence-based business story.
          </p>

          <a
            href="/projects/new"
            className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Create Your Project →
          </a>
        </section>
      </div>
    </main>
  );
}