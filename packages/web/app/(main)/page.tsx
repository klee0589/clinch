import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
          Find Your Perfect
          <span className="text-red-600"> Muay Thai </span>
          Trainer
        </h1>
        <p className="text-xl text-zinc-300 mb-10 max-w-2xl mx-auto">
          Connect with experienced trainers and gyms in your area. Train
          smarter, fight stronger.
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
          <h3 className="text-xl font-semibold text-white mb-2">
            For Trainees
          </h3>
          <p className="text-zinc-400">
            Find experienced trainers who match your style, budget, and
            schedule. Book sessions with ease.
          </p>
        </div>
        <div className="bg-zinc-800/50 backdrop-blur border border-zinc-700 rounded-xl p-8">
          <div className="text-red-600 text-4xl mb-4">👊</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            For Trainers
          </h3>
          <p className="text-zinc-400">
            Grow your client base, manage your schedule, and get paid seamlessly
            through our platform.
          </p>
        </div>
        <div className="bg-zinc-800/50 backdrop-blur border border-zinc-700 rounded-xl p-8">
          <div className="text-red-600 text-4xl mb-4">🏛️</div>
          <h3 className="text-xl font-semibold text-white mb-2">For Gyms</h3>
          <p className="text-zinc-400">
            Promote your facility, attract new members, and connect with
            trainers looking for space.
          </p>
        </div>
      </div>
    </main>
  );
}
