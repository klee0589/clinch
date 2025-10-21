import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-zinc-900 to-zinc-950"></div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            {/* Main Heading */}
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
              Find Your Perfect
              <span className="block mt-2 bg-gradient-to-r from-red-500 via-red-600 to-orange-500 bg-clip-text text-transparent">
                Muay Thai Trainer
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-zinc-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Connect with world-class trainers and gyms. Train anywhere,
              anytime.
              <span className="block mt-2 text-zinc-400">
                Book your first session today.
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/browse/trainers"
                className="group relative w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-4 rounded-xl text-lg font-bold transition-all duration-200 shadow-lg shadow-red-900/50 hover:shadow-xl hover:shadow-red-900/60 hover:scale-105"
              >
                <span className="relative z-10">Find a Trainer →</span>
              </Link>
              <Link
                href="/browse/gyms"
                className="group w-full sm:w-auto bg-zinc-800/80 hover:bg-zinc-700/80 backdrop-blur-sm text-white px-10 py-4 rounded-xl text-lg font-bold transition-all duration-200 border-2 border-zinc-700 hover:border-zinc-600 hover:scale-105"
              >
                Browse Gyms
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Built for the Community
          </h2>
          <p className="text-xl text-zinc-400">
            Whether you're training or teaching, we've got you covered
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Trainee Card */}
          <div className="group relative bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur border border-zinc-700/50 rounded-2xl p-8 hover:border-red-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-900/20">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-600/10 rounded-full blur-2xl group-hover:bg-red-600/20 transition-all duration-300"></div>
            <div className="relative">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                🥊
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                For Trainees
              </h3>
              <p className="text-zinc-300 leading-relaxed">
                Find experienced trainers who match your style, budget, and
                schedule. Book sessions with just a few taps.
              </p>
            </div>
          </div>

          {/* Trainer Card */}
          <div className="group relative bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur border border-zinc-700/50 rounded-2xl p-8 hover:border-red-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-900/20">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-600/10 rounded-full blur-2xl group-hover:bg-red-600/20 transition-all duration-300"></div>
            <div className="relative">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                💪
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                For Trainers
              </h3>
              <p className="text-zinc-300 leading-relaxed">
                Grow your client base, manage your schedule effortlessly, and
                get paid seamlessly through our platform.
              </p>
            </div>
          </div>

          {/* Gym Card */}
          <div className="group relative bg-gradient-to-br from-zinc-800/90 to-zinc-900/90 backdrop-blur border border-zinc-700/50 rounded-2xl p-8 hover:border-red-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-900/20">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-600/10 rounded-full blur-2xl group-hover:bg-red-600/20 transition-all duration-300"></div>
            <div className="relative">
              <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                🏛️
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">For Gyms</h3>
              <p className="text-zinc-300 leading-relaxed">
                Promote your facility, attract new members, and connect with
                talented trainers looking for space.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
