'use client';

import { MainLayout } from '@/components/blocks/layout/MainLayout';
import { StackNavigation } from '@/components/blocks/layout/StackNavigation';
import { Button } from '@/components/generated/button';
import { Input } from '@/components/generated/input';
import { Label } from '@/components/generated/label';
import { useState, useCallback, useRef } from 'react';
import { createShowcaseAction, checkAliasAvailabilityAction } from '@/server/actions/showcase';
import { useRouter } from 'next/navigation';
import { CheckIcon, XIcon, LoaderIcon } from 'lucide-react';

// Simple debounce implementation
function useDebounce<T extends (...args: any[]) => any>(callback: T, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

export default function ShowcaseCreatePage() {
  const [formData, setFormData] = useState({
    name: '',
    alias: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; alias?: string; general?: string }>({});
  const [aliasStatus, setAliasStatus] = useState<'checking' | 'available' | 'taken' | 'idle'>(
    'idle'
  );

  const router = useRouter();

  // Check alias availability
  const checkAliasAvailability = async (alias: string) => {
    if (!alias || alias.length < 1) {
      setAliasStatus('idle');
      return;
    }

    setAliasStatus('checking');
    try {
      const result = await checkAliasAvailabilityAction(alias);
      if (result.success) {
        setAliasStatus(result.available ? 'available' : 'taken');
        if (!result.available) {
          setErrors(prev => ({ ...prev, alias: result.message }));
        } else {
          setErrors(prev => ({ ...prev, alias: undefined }));
        }
      } else {
        setErrors(prev => ({ ...prev, alias: result.error }));
        setAliasStatus('idle');
      }
    } catch (error) {
      setAliasStatus('idle');
      setErrors(prev => ({ ...prev, alias: 'Failed to check availability' }));
    }
  };

  // Debounced alias availability checker
  const debouncedCheckAlias = useDebounce(checkAliasAvailability, 500);

  const handleInputChange = (field: 'name' | 'alias', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined, general: undefined }));

    if (field === 'alias') {
      // Convert to lowercase and replace spaces/invalid chars with hyphens
      const cleanedAlias = value
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      if (cleanedAlias !== value) {
        setFormData(prev => ({ ...prev, alias: cleanedAlias }));
      }

      debouncedCheckAlias(cleanedAlias);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || aliasStatus === 'taken' || aliasStatus === 'checking') {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await createShowcaseAction(formData);

      if (result.success && result.showcase) {
        // Redirect to the showcase page or edit page
        router.push(`/showcase/${result.showcase.alias}`);
      } else {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAliasStatusIcon = () => {
    switch (aliasStatus) {
      case 'checking':
        return <LoaderIcon className="w-4 h-4 animate-spin text-gray-500" />;
      case 'available':
        return <CheckIcon className="w-4 h-4 text-green-500" />;
      case 'taken':
        return <XIcon className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const isFormValid = formData.name.trim() && formData.alias.trim() && aliasStatus === 'available';

  return (
    <MainLayout>
      <StackNavigation title="Add Showcase" />

      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.general}
            </div>
          )}

          <div className="flex gap-2 flex-col">
            <Label htmlFor="name">Project name</Label>
            <Input
              id="name"
              placeholder="Enter your project name"
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              className={errors.name ? 'border-red-300 focus:border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="flex gap-2 flex-col">
            <Label htmlFor="alias">Project URL</Label>

            <div className="border rounded-lg overflow-hidden flex">
              <span className="flex items-center bg-muted px-3 font-mono text-sm text-gray-500">
                https://khmercoder.com/showcase/
              </span>
              <div className="relative flex-1 flex items-center">
                <input
                  id="alias"
                  placeholder="your-project-url"
                  value={formData.alias}
                  onChange={e => handleInputChange('alias', e.target.value)}
                  className={`outline-none rounded-none border-0 p-3 bg-inherit font-mono text-sm flex-1 pr-10 ${
                    errors.alias ? 'text-red-600' : ''
                  }`}
                />
                <div className="absolute right-3">{getAliasStatusIcon()}</div>
              </div>
            </div>

            {errors.alias && <p className="text-sm text-red-600">{errors.alias}</p>}

            {aliasStatus === 'available' && formData.alias && (
              <p className="text-sm text-green-600">✓ This URL is available</p>
            )}

            <p className="text-xs text-gray-500 mt-1">
              Only lowercase letters, numbers, and hyphens are allowed. Cannot start or end with a
              hyphen.
            </p>
          </div>

          <div>
            <Button type="submit" disabled={!isFormValid || isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <LoaderIcon className="w-4 h-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Showcase'
              )}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
