'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import type { TrainerProfile } from '@clinch/shared';

interface TrainerCardProps {
  trainer: TrainerProfile & {
    user?: {
      firstName?: string;
      lastName?: string;
      imageUrl?: string;
    };
  };
}

export function TrainerCard({ trainer }: TrainerCardProps) {
  const fullName = trainer.user
    ? `${trainer.user.firstName || ''} ${trainer.user.lastName || ''}`.trim()
    : 'Unknown Trainer';

  return (
    <Link href={`/browse/trainers/${trainer.id}`}>
      <Card hover className="h-full">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {trainer.user?.imageUrl ? (
                <img
                  src={trainer.user.imageUrl}
                  alt={fullName}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {fullName.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {fullName}
              </h3>

              {/* Location */}
              {trainer.city && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  📍 {trainer.city}, {trainer.state || trainer.country}
                </p>
              )}

              {/* Specialties */}
              <div className="flex flex-wrap gap-1 mb-3">
                {trainer.specialties.slice(0, 3).map((specialty) => (
                  <span
                    key={specialty}
                    className="inline-block px-2 py-1 text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 rounded"
                  >
                    {specialty.replace('_', ' ')}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                {trainer.experienceYears && (
                  <span>🥊 {trainer.experienceYears} years</span>
                )}
                {trainer.averageRating && (
                  <span>⭐ {trainer.averageRating.toFixed(1)}</span>
                )}
                {trainer.hourlyRate && (
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    ${trainer.hourlyRate}/hr
                  </span>
                )}
              </div>

              {/* Online badge */}
              {trainer.availableForOnline && (
                <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                  💻 Online Available
                </span>
              )}
            </div>
          </div>

          {/* Bio preview */}
          {trainer.bio && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {trainer.bio}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
