'use client';

import { useSession } from '@/components/auth-provider';
import { StackNavigation } from '@/components/blocks/layout/StackNavigation';
import { Button } from '@/components/generated/button';
import { Input } from '@/components/generated/input';
import { updateUserAliasAction } from '@/server/actions/users';
import { useState } from 'react';

export default function ProfileSetupPage() {
  const { profile } = useSession();
  const [alias, setAlias] = useState(profile?.alias || '');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to check if the user is within the 7-day cooldown period
  const isInCooldownPeriod = () => {
    if (!profile?.aliasUpdatedAt) return false;
    const cooldownPeriod = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    return new Date(profile.aliasUpdatedAt).getTime() > new Date().getTime() - cooldownPeriod;
  };

  // Get the next available update date
  const getNextUpdateDate = () => {
    if (!profile?.aliasUpdatedAt) return null;
    const cooldownPeriod = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    return new Date(
      new Date(profile.aliasUpdatedAt).getTime() + cooldownPeriod
    ).toLocaleDateString();
  };

  const handleUpdateClick = async () => {
    console.log('Submitting alias:', alias);
    setError('');
    setMessage('');

    setIsSubmitting(true);
    try {
      // Call the server action directly with the alias value
      const result = await updateUserAliasAction(alias);
      console.log(result);

      // Process the result
      if (result && result.success) {
        setMessage(result.message || 'Alias updated successfully!');
        // You could add a window.location.reload() here after a short delay if needed
      } else {
        setError((result && result.message) || 'Failed to update alias.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen max-w-md mx-auto px-4">
      <StackNavigation defaultBackURL="/profile/setup/" />
      <h1 className="text-2xl font-bold mb-4">Profile Setup</h1>
      <p className="text-muted-foreground mb-6">Please complete your profile setup to continue.</p>

      <div className="w-full space-y-4">
        <div>
          <label htmlFor="alias" className="block text-sm font-medium mb-1">
            Username / Alias{' '}
            {profile?.alias && (
              <span className="text-muted-foreground text-xs">(Current: {profile.alias})</span>
            )}
          </label>
          <Input
            id="alias"
            type="text"
            value={alias}
            onChange={e => setAlias(e.target.value)}
            placeholder="Enter your unique username"
            className="w-full"
            disabled={isSubmitting}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          {message && <p className="text-green-500 text-sm mt-1">{message}</p>}
          <p className="text-xs text-muted-foreground mt-2">
            Your alias must be at least 5 characters, start with a letter, and contain only letters,
            numbers, underscores, or hyphens. This will be your unique identifier on the platform.
            {profile?.aliasUpdatedAt && (
              <span className="block mt-1">
                <strong>Note:</strong> You can only update your alias once every 7 days.
                {isInCooldownPeriod() && (
                  <span className="text-amber-600">
                    {' '}
                    Your next update will be available after {getNextUpdateDate()}.
                  </span>
                )}
              </span>
            )}
          </p>
        </div>

        <Button onClick={handleUpdateClick} className="w-full">
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </Button>

        {profile?.alias && message && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Your profile has been updated successfully! Continue exploring the platform with your
            new alias.
          </p>
        )}
      </div>
    </div>
  );
}
