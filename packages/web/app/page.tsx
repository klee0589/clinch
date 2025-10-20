import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-700 bg-zinc-900/50 backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            Clinch
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/browse/trainers"
              className="text-zinc-300 hover:text-white transition"
            >
              Find Trainers
            </Link>
            <Link
              href="/browse/gyms"
              className="text-zinc-300 hover:text-white transition"
            >
              Find Gyms
            </Link>
            <Link
              href="/sign-in"
              className="text-zinc-300 hover:text-white transition"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
            Find Your Perfect
            <span className="text-red-600"> Muay Thai </span>
            Trainer
          </h1>
          <p className="text-xl text-zinc-300 mb-10 max-w-2xl mx-auto">
            Connect with experienced trainers and gyms in your area. Train smarter, fight stronger.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/browse/trainers"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition"
            >
              Find a Trainer
            </Link>
            <Link
              href="/browse/gyms"
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition border border-zinc-700"
            >
              Browse Gyms
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="bg-zinc-800/50 backdrop-blur border border-zinc-700 rounded-xl p-8">
            <div className="text-red-600 text-4xl mb-4">🥊</div>
            <h3 className="text-xl font-semibold text-white mb-2">For Trainees</h3>
            <p className="text-zinc-400">
              Find experienced trainers who match your style, budget, and schedule. Book sessions with ease.
            </p>
          </div>
          <div className="bg-zinc-800/50 backdrop-blur border border-zinc-700 rounded-xl p-8">
            <div className="text-red-600 text-4xl mb-4">👊</div>
            <h3 className="text-xl font-semibold text-white mb-2">For Trainers</h3>
            <p className="text-zinc-400">
              Grow your client base, manage your schedule, and get paid seamlessly through our platform.
            </p>
          </div>
          <div className="bg-zinc-800/50 backdrop-blur border border-zinc-700 rounded-xl p-8">
            <div className="text-red-600 text-4xl mb-4">🏛️</div>
            <h3 className="text-xl font-semibold text-white mb-2">For Gyms</h3>
            <p className="text-zinc-400">
              Promote your facility, attract new members, and connect with trainers looking for space.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
