import Link from 'next/link';

// Mock trainer data
const mockTrainer = {
  id: '1',
  name: 'John "The Clincher" Smith',
  bio: 'Former professional fighter with 15 years of experience. I specialize in traditional Muay Thai techniques passed down from my time training in Thailand. My approach focuses on building strong fundamentals while respecting the art and culture of Muay Thai.',
  specialties: ['Traditional', 'Golden Age'],
  experienceYears: 15,
  hourlyRate: 80,
  city: 'Los Angeles',
  state: 'CA',
  country: 'USA',
  averageRating: 4.9,
  totalSessions: 342,
  availableForOnline: true,
  certifications: [
    'WMO Certified Trainer',
    'Kru Muay Thai (Thailand)',
    'First Aid & CPR Certified',
  ],
  gyms: [
    { name: 'LA Muay Thai Academy', city: 'Los Angeles' },
    { name: 'Golden Tiger Gym', city: 'Los Angeles' },
  ],
};

const mockReviews = [
  {
    id: '1',
    rating: 5,
    comment: 'John is an amazing trainer! His knowledge of traditional techniques is incredible and he really takes time to perfect your form.',
    traineeName: 'Mike T.',
    date: '2 weeks ago',
  },
  {
    id: '2',
    rating: 5,
    comment: 'Best trainer I\'ve had. Very patient and encouraging, even for beginners like me.',
    traineeName: 'Sarah L.',
    date: '1 month ago',
  },
  {
    id: '3',
    rating: 4,
    comment: 'Great sessions, learned a lot. Only minor issue is scheduling can be tricky sometimes.',
    traineeName: 'David K.',
    date: '2 months ago',
  },
];

export default function TrainerDetailPage() {
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
        {/* Back Button */}
        <Link
          href="/browse/trainers"
          className="inline-flex items-center text-zinc-400 hover:text-white transition mb-6"
        >
          ← Back to trainers
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-8">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                  {mockTrainer.name.charAt(0)}
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">{mockTrainer.name}</h1>
                  <p className="text-zinc-400 mb-3">
                    {mockTrainer.city}, {mockTrainer.state}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <span>⭐</span>
                      <span className="font-medium text-white">{mockTrainer.averageRating}</span>
                      <span className="text-zinc-500 text-sm">({mockTrainer.totalSessions} sessions)</span>
                    </div>
                    <div className="text-zinc-400 text-sm">
                      {mockTrainer.experienceYears} years experience
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-2">
                    {mockTrainer.specialties.map((specialty) => (
                      <span
                        key={specialty}
                        className="px-3 py-1 bg-zinc-900 border border-zinc-700 rounded-full text-sm text-zinc-300"
                      >
                        {specialty}
                      </span>
                    ))}
                    {mockTrainer.availableForOnline && (
                      <span className="px-3 py-1 bg-green-900/30 border border-green-700 rounded-full text-sm text-green-400">
                        Online Sessions
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">About</h2>
              <p className="text-zinc-300 leading-relaxed">{mockTrainer.bio}</p>
            </div>

            {/* Certifications */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Certifications</h2>
              <ul className="space-y-2">
                {mockTrainer.certifications.map((cert) => (
                  <li key={cert} className="flex items-center gap-2 text-zinc-300">
                    <span className="text-green-500">✓</span>
                    {cert}
                  </li>
                ))}
              </ul>
            </div>

            {/* Training Locations */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Training Locations</h2>
              <div className="space-y-3">
                {mockTrainer.gyms.map((gym) => (
                  <div key={gym.name} className="flex items-center gap-3">
                    <span className="text-2xl">🏛️</span>
                    <div>
                      <div className="text-white font-medium">{gym.name}</div>
                      <div className="text-zinc-400 text-sm">{gym.city}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Reviews</h2>
              <div className="space-y-6">
                {mockReviews.map((review) => (
                  <div key={review.id} className="border-b border-zinc-700 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex text-yellow-500">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i}>⭐</span>
                        ))}
                      </div>
                      <span className="text-zinc-400 text-sm">
                        by {review.traineeName} · {review.date}
                      </span>
                    </div>
                    <p className="text-zinc-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-white mb-1">
                  ${mockTrainer.hourlyRate}
                  <span className="text-xl text-zinc-400">/hr</span>
                </div>
                <div className="text-sm text-zinc-400">per session</div>
              </div>

              <button className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition mb-3">
                Book a Session
              </button>

              <button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white px-6 py-3 rounded-lg font-semibold transition border border-zinc-700">
                Send Message
              </button>

              <div className="mt-6 pt-6 border-t border-zinc-700 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Response time</span>
                  <span className="text-white">Within 2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Languages</span>
                  <span className="text-white">English, Thai</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
