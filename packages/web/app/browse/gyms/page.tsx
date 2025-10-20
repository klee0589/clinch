import Link from 'next/link';

// Mock data for now
const mockGyms = [
  {
    id: '1',
    name: 'LA Muay Thai Academy',
    description: 'Premier training facility with authentic Thai equipment and professional coaching staff.',
    address: '123 Main St',
    city: 'Los Angeles',
    state: 'CA',
    amenities: ['Heavy Bags', 'Muay Thai Ring', 'Showers', 'Parking', 'Pro Shop'],
    membershipFee: 150,
    dropInFee: 25,
    averageRating: 4.8,
    photos: [],
  },
  {
    id: '2',
    name: 'Golden Tiger Gym',
    description: 'Traditional Muay Thai gym with experienced fighters and welcoming atmosphere for all levels.',
    address: '456 Oak Ave',
    city: 'Los Angeles',
    state: 'CA',
    amenities: ['Heavy Bags', 'Speed Bags', 'Boxing Ring', 'Changing Rooms', 'Locker Rentals'],
    membershipFee: 120,
    dropInFee: 20,
    averageRating: 4.9,
    photos: [],
  },
  {
    id: '3',
    name: 'Iron Fist Training Center',
    description: 'Modern facility combining Muay Thai with strength and conditioning programs.',
    address: '789 Fitness Blvd',
    city: 'Los Angeles',
    state: 'CA',
    amenities: ['Heavy Bags', 'Muay Thai Ring', 'Cardio Equipment', 'Strength Training', 'Sauna', 'Physical Therapy'],
    membershipFee: 180,
    dropInFee: 30,
    averageRating: 4.7,
    photos: [],
  },
];

export default function BrowseGymsPage() {
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
          <h1 className="text-4xl font-bold text-white mb-2">Find a Gym</h1>
          <p className="text-zinc-400">Discover Muay Thai gyms and training facilities near you</p>
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
              <label className="block text-sm font-medium text-zinc-300 mb-2">Amenities</label>
              <select className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600">
                <option>All Amenities</option>
                <option>Muay Thai Ring</option>
                <option>Heavy Bags</option>
                <option>Showers</option>
                <option>Parking</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Price Range</label>
              <select className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600">
                <option>Any Price</option>
                <option>Under $100/mo</option>
                <option>$100-150/mo</option>
                <option>$150-200/mo</option>
                <option>$200+/mo</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition font-medium">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Gym Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {mockGyms.map((gym) => (
            <Link
              key={gym.id}
              href={`/browse/gyms/${gym.id}`}
              className="bg-zinc-800/50 border border-zinc-700 rounded-xl overflow-hidden hover:border-red-600 transition-all group"
            >
              {/* Image Placeholder */}
              <div className="h-48 bg-gradient-to-br from-red-900 to-zinc-900 flex items-center justify-center">
                <span className="text-6xl">🏛️</span>
              </div>

              <div className="p-6">
                {/* Name & Location */}
                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-red-600 transition">
                  {gym.name}
                </h3>
                <p className="text-sm text-zinc-400 mb-3">
                  {gym.address}, {gym.city}, {gym.state}
                </p>

                {/* Description */}
                <p className="text-zinc-300 text-sm mb-4">{gym.description}</p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {gym.amenities.slice(0, 4).map((amenity) => (
                    <span
                      key={amenity}
                      className="px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-300"
                    >
                      {amenity}
                    </span>
                  ))}
                  {gym.amenities.length > 4 && (
                    <span className="px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-400">
                      +{gym.amenities.length - 4} more
                    </span>
                  )}
                </div>

                {/* Pricing & Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <span>⭐</span>
                    <span className="font-medium text-white">{gym.averageRating}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">${gym.membershipFee}/mo</div>
                    <div className="text-xs text-zinc-400">${gym.dropInFee} drop-in</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
