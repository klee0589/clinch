'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { UserRole } from '@clinch/shared';

export default function OnboardingPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const handleRoleSelect = async () => {
    if (!selectedRole || !user) return;

    setLoading(true);
    try {
      // Update user metadata with role
      await user.update({
        unsafeMetadata: {
          role: selectedRole,
        },
      });

      // Create user in database
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          firstName: user.firstName,
          lastName: user.lastName,
          role: selectedRole,
          imageUrl: user.imageUrl,
        }),
      });

      // Redirect to profile setup based on role
      if (selectedRole === UserRole.TRAINER) {
        router.push('/profile/trainer/setup');
      } else if (selectedRole === UserRole.GYM_OWNER) {
        router.push('/profile/gym/setup');
      } else if (selectedRole === UserRole.TRAINEE) {
        router.push('/profile/trainee/setup');
      }
    } catch (error) {
      console.error('Error setting up account:', error);
      setLoading(false);
    }
  };

  const roles = [
    {
      value: UserRole.TRAINEE,
      title: 'I want to train',
      description: 'Find experienced trainers and book sessions',
      icon: '🥊',
    },
    {
      value: UserRole.TRAINER,
      title: "I'm a trainer",
      description: 'Connect with students and grow your business',
      icon: '👊',
    },
    {
      value: UserRole.GYM_OWNER,
      title: 'I own a gym',
      description: 'Promote your facility and attract members',
      icon: '🏛️',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to Clinch!</h1>
          <p className="text-xl text-zinc-400">How would you like to use Clinch?</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => (
            <button
              key={role.value}
              onClick={() => setSelectedRole(role.value)}
              className={`p-8 rounded-xl border-2 transition-all text-left ${
                selectedRole === role.value
                  ? 'border-red-600 bg-red-600/10'
                  : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
              }`}
            >
              <div className="text-5xl mb-4">{role.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{role.title}</h3>
              <p className="text-zinc-400">{role.description}</p>
            </button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={handleRoleSelect}
            disabled={!selectedRole || loading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg text-lg font-semibold transition"
          >
            {loading ? 'Setting up...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
