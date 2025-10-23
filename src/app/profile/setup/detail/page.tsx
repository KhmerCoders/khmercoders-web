'use client';

import { Button } from '@/components/generated/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/generated/card';
import { Input } from '@/components/generated/input';
import { Textarea } from '@/components/generated/textarea';
import { useSession } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState, useCallback } from 'react';
import { updateUserProfileAction } from '@/server/actions/users';

export default function ProfileSetupDetailPage() {
  const { session, profile } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Form state using useState hooks
  const [name, setName] = useState(session?.user.name || '');
  const [title, setTitle] = useState(profile?.title || '');
  const [bio, setBio] = useState(profile?.bio || '');
  const [websiteUrl, setWebsiteUrl] = useState(profile?.websiteUrl || '');
  const [telegramUrl, setTelegramUrl] = useState(profile?.telegramUrl || '');
  const [githubUrl, setGithubUrl] = useState(profile?.githubUrl || '');
  const [facebookUrl, setFacebookUrl] = useState(profile?.facebookUrl || '');
  const [xUrl, setXUrl] = useState(profile?.xUrl || '');
  const [tiktokUrl, setTiktokUrl] = useState(profile?.tiktokUrl || '');
  const [instagramUrl, setInstagramUrl] = useState(profile?.instagramUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedinUrl || '');
  const [youtubeUrl, setYoutubeUrl] = useState(profile?.youtubeUrl || '');

  // Validation errors
  const [errors, setErrors] = useState({
    name: '',
    title: '',
    bio: '',
    websiteUrl: '',
    telegramUrl: '',
    githubUrl: '',
    facebookUrl: '',
    xUrl: '',
    tiktokUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    youtubeUrl: '',
  });
  // Validate form data using useCallback
  const validateForm = useCallback(() => {
    let valid = true;
    const newErrors = {
      name: '',
      title: '',
      bio: '',
      websiteUrl: '',
      telegramUrl: '',
      githubUrl: '',
      facebookUrl: '',
      xUrl: '',
      tiktokUrl: '',
      instagramUrl: '',
      linkedinUrl: '',
      youtubeUrl: '',
    };

    // Validate name
    if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      valid = false;
    } else if (name.trim().length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
      valid = false;
    }

    // Validate title
    if (title && title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
      valid = false;
    }

    // Validate bio
    if (bio && bio.trim().length > 500) {
      newErrors.bio = 'Bio must be less than 500 characters';
      valid = false;
    }

    // Simple URL validation for social media links
    const validateUrl = (url: string) => {
      if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
        return 'URL must start with http:// or https://';
      }
      return '';
    };

    // Validate social media URLs if provided
    if (websiteUrl) newErrors.websiteUrl = validateUrl(websiteUrl);
    if (telegramUrl) newErrors.telegramUrl = validateUrl(telegramUrl);
    if (githubUrl) newErrors.githubUrl = validateUrl(githubUrl);
    if (facebookUrl) newErrors.facebookUrl = validateUrl(facebookUrl);
    if (xUrl) newErrors.xUrl = validateUrl(xUrl);
    if (tiktokUrl) newErrors.tiktokUrl = validateUrl(tiktokUrl);
    if (instagramUrl) newErrors.instagramUrl = validateUrl(instagramUrl);
    if (linkedinUrl) newErrors.linkedinUrl = validateUrl(linkedinUrl);
    if (youtubeUrl) newErrors.youtubeUrl = validateUrl(youtubeUrl);

    // Check if any URL validation failed
    if (Object.values(newErrors).some(error => error !== '')) {
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }, [
    name,
    title,
    bio,
    websiteUrl,
    telegramUrl,
    githubUrl,
    facebookUrl,
    xUrl,
    tiktokUrl,
    instagramUrl,
    linkedinUrl,
    youtubeUrl,
  ]); // Dependencies - recompute when these values change
  const handleSubmit = useCallback(async () => {
    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateUserProfileAction({
        name: name.trim(),
        title: title.trim(),
        bio: bio.trim(),
        websiteUrl: websiteUrl.trim(),
        telegramUrl: telegramUrl.trim(),
        githubUrl: githubUrl.trim(),
        facebookUrl: facebookUrl.trim(),
        xUrl: xUrl.trim(),
        tiktokUrl: tiktokUrl.trim(),
        instagramUrl: instagramUrl.trim(),
        linkedinUrl: linkedinUrl.trim(),
        youtubeUrl: youtubeUrl.trim(),
      });

      if (result.success) {
        toast({
          title: 'Success',
          description: result.message,
        });

        // Redirect to the user's profile page using their alias
        if (profile?.alias) {
          router.push(`/@${profile.alias}`);
        } else {
          router.push('/profile');
        }
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    validateForm,
    name,
    title,
    bio,
    websiteUrl,
    telegramUrl,
    githubUrl,
    facebookUrl,
    xUrl,
    tiktokUrl,
    instagramUrl,
    linkedinUrl,
    youtubeUrl,
    profile,
    router,
    toast,
  ]); // Dependencies for handleSubmit

  if (!session) {
    return null; // or some loading state, or redirect to login
  }

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Tell us more about yourself. This information will be displayed on your public profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            <p className="text-sm text-muted-foreground">This is your public display name.</p>
          </div>
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Professional Title
            </label>
            <Input
              id="title"
              placeholder="e.g. Full Stack Developer at Company"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            <p className="text-sm text-muted-foreground">
              Your professional title or current position.
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium">
              Bio
            </label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself, your skills, experiences, and interests..."
              className="min-h-[120px]"
              value={bio}
              onChange={e => setBio(e.target.value)}
            />
            {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
            <p className="text-sm text-muted-foreground">
              A brief introduction about yourself. This will be displayed on your profile.
            </p>
          </div>
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">Social Media Links</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="websiteUrl" className="text-sm font-medium">
                    Website
                  </label>
                  <Input
                    id="websiteUrl"
                    placeholder="https://yourwebsite.com"
                    value={websiteUrl}
                    onChange={e => setWebsiteUrl(e.target.value)}
                  />
                  {errors.websiteUrl && <p className="text-sm text-red-500">{errors.websiteUrl}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="linkedinUrl" className="text-sm font-medium">
                    LinkedIn
                  </label>
                  <Input
                    id="linkedinUrl"
                    placeholder="https://linkedin.com/in/yourusername"
                    value={linkedinUrl}
                    onChange={e => setLinkedinUrl(e.target.value)}
                  />
                  {errors.linkedinUrl && (
                    <p className="text-sm text-red-500">{errors.linkedinUrl}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="githubUrl" className="text-sm font-medium">
                    GitHub
                  </label>
                  <Input
                    id="githubUrl"
                    placeholder="https://github.com/yourusername"
                    value={githubUrl}
                    onChange={e => setGithubUrl(e.target.value)}
                  />
                  {errors.githubUrl && <p className="text-sm text-red-500">{errors.githubUrl}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="telegramUrl" className="text-sm font-medium">
                    Telegram
                  </label>
                  <Input
                    id="telegramUrl"
                    placeholder="https://t.me/yourusername"
                    value={telegramUrl}
                    onChange={e => setTelegramUrl(e.target.value)}
                  />
                  {errors.telegramUrl && (
                    <p className="text-sm text-red-500">{errors.telegramUrl}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="xUrl" className="text-sm font-medium">
                    X (Twitter)
                  </label>
                  <Input
                    id="xUrl"
                    placeholder="https://x.com/yourusername"
                    value={xUrl}
                    onChange={e => setXUrl(e.target.value)}
                  />
                  {errors.xUrl && <p className="text-sm text-red-500">{errors.xUrl}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="facebookUrl" className="text-sm font-medium">
                    Facebook
                  </label>
                  <Input
                    id="facebookUrl"
                    placeholder="https://facebook.com/yourusername"
                    value={facebookUrl}
                    onChange={e => setFacebookUrl(e.target.value)}
                  />
                  {errors.facebookUrl && (
                    <p className="text-sm text-red-500">{errors.facebookUrl}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="instagramUrl" className="text-sm font-medium">
                    Instagram
                  </label>
                  <Input
                    id="instagramUrl"
                    placeholder="https://instagram.com/yourusername"
                    value={instagramUrl}
                    onChange={e => setInstagramUrl(e.target.value)}
                  />
                  {errors.instagramUrl && (
                    <p className="text-sm text-red-500">{errors.instagramUrl}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="youtubeUrl" className="text-sm font-medium">
                    YouTube
                  </label>
                  <Input
                    id="youtubeUrl"
                    placeholder="https://youtube.com/@yourchannel"
                    value={youtubeUrl}
                    onChange={e => setYoutubeUrl(e.target.value)}
                  />
                  {errors.youtubeUrl && <p className="text-sm text-red-500">{errors.youtubeUrl}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="tiktokUrl" className="text-sm font-medium">
                    TikTok
                  </label>
                  <Input
                    id="tiktokUrl"
                    placeholder="https://tiktok.com/@yourusername"
                    value={tiktokUrl}
                    onChange={e => setTiktokUrl(e.target.value)}
                  />
                  {errors.tiktokUrl && <p className="text-sm text-red-500">{errors.tiktokUrl}</p>}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="button" disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
