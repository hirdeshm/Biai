import Link from "next/link";

export default function Footer() {
    return (
        <footer id="footer" className="border-t  text-black bg-blue-100">
            <div className="mx-auto max-w-7xl px-6 py-12 ">
                <div className="grid gap-10 md:grid-cols-4">

                    {/* Logo / About */}
                    <div>
                        <Link href="/" className="text-2xl font-bold">
                            MyApp
                        </Link>

                        <p className="mt-4 text-sm text-gray-400">
                            Building simple and powerful digital experiences.
                        </p>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-semibold">Company</h3>

                        <div className="mt-4 flex flex-col gap-3 text-sm text-gray-400">
                            <Link href="/about" className="hover:text-black">
                                About
                            </Link>
                            <Link href="/services" className="hover:text-black">
                                Services
                            </Link>
                            <a
                                href="#footer"
                                className="text-gray-600 hover:text-black"
                            >
                                Contact
                            </a>
                        </div>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-semibold">Resources</h3>

                        <div className="mt-4 flex flex-col gap-3 text-sm text-gray-400">
                            <Link href="/blog" className="hover:text-black">
                                Blog
                            </Link>
                            <Link href="/faq" className="hover:text-black">
                                FAQ
                            </Link>
                            <Link href="/help" className="hover:text-black">
                                Help Center
                            </Link>
                        </div>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-semibold">Follow Us</h3>

                        <div className="mt-4 flex gap-4 text-sm text-gray-400">
                            <a href="#" className="hover:text-black">
                                Instagram
                            </a>
                            <a href="#" className="hover:text-black">
                                LinkedIn
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom */}
                <div className="mt-12 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
                    © 2026 MyApp. All rights reserved.
                </div>
            </div>
        </footer>
    );
}