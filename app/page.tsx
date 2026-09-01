import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Database,
  LineChart,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
   <main className="min-h-screen bg-white text-slate-900">

      {/* ========================================================= */}
      {/* NAV / HERO */}
      {/* ========================================================= */}

      <section className="relative overflow-hidden  text-white">

        {/* Background effects */}

        <div className="absolute inset-0">
          <div className="absolute left-1/4 top-[-200px] h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px]" />
          <div className="absolute right-[-100px] top-1/3 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">

          <div className="grid min-h-[calc(100vh-64px)] items-center gap-16 py-20 lg:grid-cols-2">

            {/* ================================================= */}
            {/* HERO CONTENT */}
            {/* ================================================= */}

            <div>

              <div className="mb-6 inline-flex text-black items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm  backdrop-blur">

                <Sparkles className="h-4 w-4 text-purple-400 " />

                AI-Powered Business Intelligence

              </div>

              <h1 className="max-w-3xl text-5xl text-black font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">

                Turn Business Data

                <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Into Decisions.
                </span>

              </h1>

              <p className="mt-7 max-w-xl text-lg leading-8 text-gray-400 sm:text-xl">

                BusinessIntelligence.ai connects your sales, customers,
                products, marketing, web analytics and inventory data —
                then uses AI to explain what changed, why it matters,
                and what you should do next.

              </p>

              {/* CTA */}

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">

                <Link
                  href="/projects/new"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-black transition hover:bg-gray-200"
                >
                  Build Your Project

                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />

                </Link>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3.5 font-semibold text-white transition hover:bg-white/[0.08]"
                >
                  Explore Platform
                </Link>

              </div>

              {/* Trust points */}

              <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-500">

                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-green-400" />
                  Evidence-driven
                </div>

                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-purple-400" />
                  AI-powered
                </div>

                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  Action-oriented
                </div>

              </div>

            </div>


            {/* ================================================= */}
            {/* AI DASHBOARD VISUAL */}
            {/* ================================================= */}

            <div className="relative">

              {/* Glow */}

              <div className="absolute inset-0 rounded-3xl bg-purple-500/10 blur-3xl" />

              <div className="relative rounded-3xl border border-white/10 bg p-4 shadow-2xl shadow-purple-900/20">

                {/* Dashboard header */}

                <div className="flex items-center justify-between border-b border-white/10 px-3 pb-4">

                  <div>

                    <p className="text-xs text-gray-500">
                      BUSINESS INTELLIGENCE
                    </p>

                    <p className="mt-1 font-semibold  text-black">
                      Executive Overview
                    </p>

                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">

                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />

                    AI Ready

                  </div>

                </div>


                {/* KPI cards */}

                <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-4">

                  <DashboardKPI
                    label="Revenue"
                    value="$2.95M"
                    change="+12.4%"
                    positive
                  />

                  <DashboardKPI
                    label="Customers"
                    value="8,421"
                    change="+8.7%"
                    positive
                  />

                  <DashboardKPI
                    label="Conversion"
                    value="4.82%"
                    change="-2.1%"
                    positive={false}
                  />

                  <DashboardKPI
                    label="Inventory"
                    value="91.4%"
                    change="+4.3%"
                    positive
                  />

                </div>


                {/* Chart */}

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm text-black font-medium">
                        Revenue Performance
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Cross-source KPI signal
                      </p>

                    </div>

                    <BarChart3 className="h-5 w-5 text-purple-400" />

                  </div>

                  <div className="mt-6 flex h-40 items-end gap-2">

                    {[35, 48, 42, 61, 55, 73, 68, 84, 76, 92, 87, 100].map(
                      (height, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t-md bg-gradient-to-t from-purple-600/30 to-purple-400 transition-all"
                          style={{
                            height: `${height}%`,
                          }}
                        />
                      )
                    )}

                  </div>

                </div>


                {/* AI insight */}

                <div className="mt-3 rounded-2xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-5">

                  <div className="flex items-start gap-3">

                    <div className="rounded-lg bg-purple-500/20 p-2">

                      <BrainCircuit className="h-5 w-5 text-purple-300" />

                    </div>

                    <div className="flex-1">

                      <div className="flex items-center justify-between">

                        <p className="text-sm font-semibold text-black">
                          AI Insight
                        </p>

                        <span className="text-xs text-purple-300">
                          87% confidence
                        </span>

                      </div>

                      <p className="mt-2 text-sm leading-6 text-gray-400">

                        Revenue growth is associated with stronger
                        performance in the North region and increased
                        conversion activity. Inventory constraints may
                        require further investigation.

                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* DATA → INTELLIGENCE → ACTION */}
      {/* ========================================================= */}

      <section className="border-b border-gray-100 bg-gray-50 px-6 py-24">

        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-widest text-purple-600">
              Intelligence Pipeline
            </p>

            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              From raw data to business action.
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              BusinessIntelligence.ai transforms fragmented business
              data into an understandable decision-making layer.
            </p>

          </div>


          <div className="mt-16 grid gap-6 md:grid-cols-3">

            <PipelineCard
              number="01"
              icon={<Database className="h-6 w-6" />}
              title="Connect Data"
              description="Bring together structured business data from multiple operational sources."
              items={[
                "Sales & Revenue",
                "Customers",
                "Products",
                "Marketing",
                "Web Analytics",
                "Inventory",
              ]}
            />

            <PipelineCard
              number="02"
              icon={<BrainCircuit className="h-6 w-6" />}
              title="Understand With AI"
              description="Detect meaningful KPI movements and connect signals across datasets."
              items={[
                "KPI analysis",
                "Cross-source relationships",
                "Root-cause hypotheses",
                "Evidence & confidence",
                "Uncertainty detection",
              ]}
            />

            <PipelineCard
              number="03"
              icon={<Zap className="h-6 w-6" />}
              title="Take Action"
              description="Turn insights into prioritized actions that business teams can execute."
              items={[
                "Recommended actions",
                "Priority levels",
                "Business impact",
                "Risks",
                "Data gaps",
              ]}
            />

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* DATA SOURCES */}
      {/* ========================================================= */}

      <section className="px-6 py-24">

        <div className="mx-auto max-w-7xl">

          <div className="grid items-center gap-14 lg:grid-cols-2">

            <div>

              <p className="text-sm font-semibold uppercase tracking-widest text-purple-600">
                One Intelligence Layer
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                Your business has more than one data source.
              </h2>

              <p className="mt-5 max-w-xl text-lg leading-8 text-gray-600">

                Revenue rarely changes for just one reason. Connect
                different parts of your business to give AI the context
                it needs to investigate meaningful relationships.

              </p>

              <Link
                href="/projects/new"
                className="group mt-8 inline-flex items-center gap-2 font-semibold text-purple-600"
              >
                Connect your data

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />

              </Link>

            </div>


            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">

              <SourceCard
                icon={<LineChart />}
                title="Sales"
                description="Revenue & orders"
              />

              <SourceCard
                icon={<Users />}
                title="Customers"
                description="Segments & retention"
              />

              <SourceCard
                icon={<BarChart3 />}
                title="Products"
                description="Pricing & inventory"
              />

              <SourceCard
                icon={<Zap />}
                title="Marketing"
                description="Campaign performance"
              />

              <SourceCard
                icon={<LineChart />}
                title="Web Analytics"
                description="Traffic & conversion"
              />

              <SourceCard
                icon={<Database />}
                title="Inventory"
                description="Stock & supply chain"
              />

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* AI STORY SECTION */}
      {/* ========================================================= */}

      <section className="bg-grey px-6 py-24 text-white">

        <div className="mx-auto max-w-7xl">

          <div className="grid items-center gap-14 lg:grid-cols-2">

            <div>

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-2 text-sm text-purple-300">

                <Sparkles className="h-4 w-4" />

                AI Business Storytelling

              </div>

              <h2 className="text-4xl text-black font-bold tracking-tight sm:text-5xl">

                Don't just see the number.

                <span className="block text-purple-400">
                  Understand the story.
                </span>

              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">

                Instead of dumping another dashboard on your team,
                BusinessIntelligence.ai explains the important signals,
                connects available evidence, and communicates what is
                known — and what is still uncertain.

              </p>

            </div>


            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">

              <div className="flex items-center gap-3 border-b border-white/10 pb-5">

                <div className="rounded-xl bg-purple-500/20 p-3">
                  <BrainCircuit className="h-6 w-6 text-purple-400" />
                </div>

                <div>

                  <p className="font-semibold">
                    Business Story
                  </p>

                  <p className="text-xs text-gray-500">
                    Generated from available evidence
                  </p>

                </div>

              </div>


              <div className="space-y-6 pt-6">

                <InsightRow
                  label="What changed?"
                  value="Revenue increased while conversion efficiency weakened."
                  icon={<TrendingUp />}
                />

                <InsightRow
                  label="What may explain it?"
                  value="Marketing and regional performance show related signals."
                  icon={<BrainCircuit />}
                />

                <InsightRow
                  label="What should we do?"
                  value="Investigate campaign efficiency and regional conversion."
                  icon={<Zap />}
                />

                <InsightRow
                  label="What don't we know?"
                  value="Available evidence does not establish causality."
                  icon={<ShieldCheck />}
                />

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================================= */}
      {/* CTA */}
      {/* ========================================================= */}

      <section className="px-6 py-24">

        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-blue-100 to-blue-100 px-8 py-16 text-center text-white shadow-2xl sm:px-16">

          <div className="absolute left-1/2 top-[-150px] h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">

            <Sparkles className="mx-auto h-8 w-8 text-purple-100" />

            <h2 className="mt-5 text-4xl font-bold sm:text-5xl text-black">
              Ready to understand your business?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-black">
              Connect your data and let AI turn business signals
              into insights and actions.
            </p>

            <Link
              href="/projects/new"
              className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-semibold text-black transition hover:bg-gray-100"
            >
              Start Building

              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />

            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}


/* =============================================================
   COMPONENTS
============================================================= */

function DashboardKPI({
  label,
  value,
  change,
  positive,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">

      <p className="text-[11px] text-gray-500">
        {label}
      </p>

      <p className="mt-2 text-lg font-bold text-black">
        {value}
      </p>

      <div
        className={`mt-1 flex items-center gap-1 text-[11px] ${
          positive
            ? "text-green-400"
            : "text-red-400"
        }`}
      >
        {positive ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}

        {change}

      </div>

    </div>
  );
}


function PipelineCard({
  number,
  icon,
  title,
  description,
  items,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl">

      <div className="flex items-center justify-between">

        <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
          {icon}
        </div>

        <span className="text-sm font-semibold text-gray-300">
          {number}
        </span>

      </div>

      <h3 className="mt-6 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-gray-600">
        {description}
      </p>

      <div className="mt-6 space-y-2">

        {items.map((item) => (
          <div
            key={item}
            className="flex items-center gap-2 text-sm text-gray-600"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            {item}
          </div>
        ))}

      </div>

    </div>
  );
}


function SourceCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg">

      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
        {icon}
      </div>

      <p className="font-semibold">
        {title}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>

    </div>
  );
}


function InsightRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">

      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-purple-400">
        {icon}
      </div>

      <div>

        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {label}
        </p>

        <p className="mt-1 text-sm leading-6 text-gray-300">
          {value}
        </p>

      </div>

    </div>
  );
}