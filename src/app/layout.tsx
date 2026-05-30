import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClaimRadar - Find Settlements You Can Claim",
  description:
    "Discover class action settlements, data breach claims, and consumer refunds you may be eligible for. AI-powered claim matching and scoring.",
  keywords: [
    "class action",
    "settlement",
    "claim",
    "data breach",
    "refund",
    "compensation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <a href="/" className="flex items-center gap-2">
                <span className="text-2xl">📡</span>
                <span className="text-xl font-bold text-gray-900">
                  Claim<span className="text-blue-600">Radar</span>
                </span>
              </a>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-8">
                <a
                  href="/us"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  🇺🇸 USA
                </a>
                <a
                  href="/ca"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  🇨🇦 Canada
                </a>
                <a
                  href="/au"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  🇦🇺 Australia
                </a>
                <a
                  href="/data-breach"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Data Breach
                </a>
                <a
                  href="/class-action"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Class Action
                </a>
              </nav>

              {/* CTA */}
              <div className="flex items-center gap-4">
                <a
                  href="/no-receipt-claims"
                  className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  No Receipt Claims
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* About */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  About ClaimRadar
                </h3>
                <p className="mt-4 text-base text-gray-500">
                  AI-powered settlement discovery. Find claims you can actually
                  get paid for.
                </p>
              </div>

              {/* Countries */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  By Country
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a
                      href="/us"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      🇺🇸 United States
                    </a>
                  </li>
                  <li>
                    <a
                      href="/ca"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      🇨🇦 Canada
                    </a>
                  </li>
                  <li>
                    <a
                      href="/au"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      🇦🇺 Australia
                    </a>
                  </li>
                </ul>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Categories
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a
                      href="/data-breach"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Data Breach
                    </a>
                  </li>
                  <li>
                    <a
                      href="/class-action"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Class Action
                    </a>
                  </li>
                  <li>
                    <a
                      href="/consumer-settlement"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Consumer Settlement
                    </a>
                  </li>
                </ul>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  Quick Links
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <a
                      href="/no-receipt-claims"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      No Receipt Required
                    </a>
                  </li>
                  <li>
                    <a
                      href="/paypal-settlements"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      PayPal Payments
                    </a>
                  </li>
                  <li>
                    <a
                      href="/expiring-soon"
                      className="text-base text-gray-500 hover:text-gray-900"
                    >
                      Expiring Soon
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-8">
              <p className="text-base text-gray-400 text-center">
                © {new Date().getFullYear()} ClaimRadar. Not legal advice.
                Always verify information with official settlement websites.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
