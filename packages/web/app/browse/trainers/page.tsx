import Link from 'next/link';

// Mock data for now - will be replaced with real database queries
const mockTrainers = [
  {
    id: '1',
    name: 'John "The Clincher" Smith',
    bio: 'Former professional fighter with 15 years of experience. Specializing in traditional Muay Thai techniques.',
    specialties: ['Traditional', 'Golden Age'],
    experienceYears: 15,
    hourlyRate: 80,
    city: 'Los Angeles',
    state: 'CA',
    averageRating: 4.9,
    totalSessions: 342,
    imageUrl: null,
  },
  {
    id: '2',
    name: 'Sarah "Lightning" Chen',
    bio: 'Dutch style specialist. Train like a champion with proven competition techniques.',
    specialties: ['Dutch', 'Modern'],
    experienceYears: 10,
    hourlyRate: 100,
    city: 'Los Angeles',
    state: 'CA',
    averageRating: 5.0,
    totalSessions: 156,
    imageUrl: null,
  },
  {
    id: '3',
    name: 'Mike "Iron Fist" Rodriguez',
    bio: 'High-intensity training focused on fitness and technique. All levels welcome.',
    specialties: ['Fitness', 'Modern'],
    experienceYears: 8,
    hourlyRate: 60,
    city: 'Los Angeles',
    state: 'CA',
    averageRating: 4.8,
    totalSessions: 289,
    imageUrl: null,
  },
];

export default function BrowseTrainersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-700 bg-zinc-900/50 backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            Clinch
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/browse/trainers" className="text-zinc-300 hover:text-white transition">
              Find Trainers
            </Link>
            <Link href="/browse/gyms" className="text-zinc-300 hover:text-white transition">
              Find Gyms
            </Link>
            <Link href="/sign-in" className="text-zinc-300 hover:text-white transition">
              Sign In
            </Link>
            <Link href="/sign-up" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Find Your Trainer</h1>
          <p className="text-zinc-400">Browse experienced Muay Thai trainers in your area</p>
        </div>

        {/* Filters */}
        <div className="mb-8 p-6 bg-zinc-800/50 border border-zinc-700 rounded-lg">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Location</label>
              <input
                type="text"
                placeholder="City or ZIP code"
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Style</label>
              <select className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600">
                <option>All Styles</option>
                <option>Traditional</option>
                <option>Dutch</option>
                <option>Golden Age</option>
                <option>Modern</option>
                <option>Fitness</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Max Rate</label>
              <select className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600">
                <option>Any Price</option>
                <option>Under $50</option>
                <option>Under $75</option>
                <option>Under $100</option>
                <option>$100+</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition font-medium">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Trainer Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTrainers.map((trainer) => (
            <Link
              key={trainer.id}
              href={`/browse/trainers/${trainer.id}`}
              className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 hover:border-red-600 transition-all group"
            >
              {/* Avatar */}
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full mb-4 flex items-center justify-center text-white text-2xl font-bold">
                {trainer.name.charAt(0)}
              </div>

              {/* Name & Location */}
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-red-600 transition">
                {trainer.name}
              </h3>
              <p className="text-sm text-zinc-400 mb-3">
                {trainer.city}, {trainer.state}
              </p>

              {/* Bio */}
              <p className="text-zinc-300 text-sm mb-4 line-clamp-2">{trainer.bio}</p>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2 mb-4">
                {trainer.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-300"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-yellow-500">
                  <span>⭐</span>
                  <span className="font-medium">{trainer.averageRating}</span>
                  <span className="text-zinc-500">({trainer.totalSessions})</span>
                </div>
                <div className="text-white font-bold">${trainer.hourlyRate}/hr</div>
              </div>

              {/* Experience */}
              <div className="mt-3 text-xs text-zinc-400">
                {trainer.experienceYears} years experience
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State (hidden when there are results) */}
        {mockTrainers.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🥊</div>
            <h2 className="text-2xl font-bold text-white mb-2">No trainers found</h2>
            <p className="text-zinc-400">Try adjusting your search filters</p>
          </div>
        )}
      </main>
    </div>
  );
}
