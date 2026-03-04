import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LMS | Learning Management System",
  description: "A minimalist platform for structured learning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="fixed top-0 w-full z-50 glass border-b border-border">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity">
              LMS<span className="text-accent text-sm ml-1">●</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-sm font-medium hover:text-accent transition-colors">Courses</Link>
              <Link href="/auth/login" className="text-sm font-bold bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
                Sign In
              </Link>
            </nav>
          </div>
        </header>
        <main className="pt-24 min-h-screen">
          {children}
        </main>
        <footer className="border-t border-border py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-xl font-bold">LMS</div>
            <div className="text-sm text-secondary">© 2024 Learning Management System. Built for excellence.</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
