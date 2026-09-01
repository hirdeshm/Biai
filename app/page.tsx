import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-white text-black">

      {/* Hero Section */}
      <section className="mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl items-center px-6 py-20">
        <div className="grid w-full items-center gap-12 md:grid-cols-2">

          {/* Left Content */}
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-gray-500">
              Welcome to Bussiness Intelligence
            </p>

            <h1 className="text-5xl font-bold leading-tight md:text-6xl">
              Build Something
              <span className="block">Amazing With Us.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              We create modern digital solutions that help businesses
              grow, connect with customers, and achieve their goals.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="/projects/new"
                className="rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
              >
                Build Your Project
              </Link>

              <Link
                href="/about"
                className="rounded-lg border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-100"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative flex justify-center">
            <div className="relative h-[400px] w-full max-w-[550px] overflow-hidden rounded-2xl">
              <Image
                src="/bussiness.gif"
                alt="Business"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="eager"
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">

          <div className="text-center">
            <h2 className="text-4xl font-bold">
              Why Choose Us?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Everything you need to build and grow your digital
              presence.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold">
                Modern Design
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Clean and modern interfaces designed to provide
                an excellent user experience.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold">
                Fast Performance
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Optimized applications that are fast, responsive,
                and reliable.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold">
                Scalable Solutions
              </h3>

              <p className="mt-3 leading-7 text-gray-600">
                Solutions built to scale with your business and
                future requirements.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl rounded-3xl bg-black px-8 py-16 text-center text-white">

          <h2 className="text-4xl font-bold">
            Ready to Get Started?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-gray-400">
            Let's work together and turn your ideas into reality.
          </p>

          <Link
            href="/projects/new"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-medium text-black hover:bg-gray-200"
          >
            Get Started
          </Link>

        </div>
      </section>

    </main>
  );
}