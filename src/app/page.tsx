import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-orange-200 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-amber-900">
          Bread Distribution System
        </h1>
        <p className="text-xl text-amber-800 max-w-md">
          Eman Bakery's production-ready distribution logistics platform
        </p>
        <div className="space-y-3">
          <Link
            href="/auth/login"
            className="inline-block px-8 py-3 bg-amber-900 text-white rounded-lg hover:bg-amber-950 font-semibold transition"
          >
            Login
          </Link>
          <p className="text-sm text-amber-700">
            Contact admin for credentials
          </p>
        </div>
      </div>
    </div>
  );
}
