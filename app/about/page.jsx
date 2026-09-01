export default function About() {
  return (
    <main className="min-h-screen bg-white px-6 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-5xl font-bold text-black">
          About Us
        </h1>

        <p className="mt-6 text-lg leading-8 text-gray-600">
          Welcome to MyApp. We are building modern and simple web
          experiences using Next.js and Tailwind CSS.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border p-6">
            <h2 className="text-xl font-semibold text-black">
              Our Mission
            </h2>
            <p className="mt-3 text-gray-600">
              To create simple and powerful digital solutions.
            </p>
          </div>

          <div className="rounded-xl border p-6">
            <h2 className="text-xl font-semibold text-black">
              Our Vision
            </h2>
            <p className="mt-3 text-gray-600">
              To make technology accessible and easy to use.
            </p>
          </div>

          <div className="rounded-xl border p-6">
            <h2 className="text-xl font-semibold text-black">
              Our Values
            </h2>
            <p className="mt-3 text-gray-600">
              Simplicity, innovation, and user experience.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}