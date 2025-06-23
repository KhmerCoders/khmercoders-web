'use client';

import Link from 'next/link';
import { ChevronRight, AtSign, User, Briefcase, Image, Link as LinkIcon } from 'lucide-react';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/generated/card';
import { useSession } from '@/components/auth-provider';
import { formatSize } from '@/utils/format';

export default function ProfileSetupPage() {
  const { session } = useSession();

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Profile Setup</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>{formatSize(session?.user?.storageUsed ?? 0)} / 1GB</CardTitle>
              <CardDescription>Storage Usage</CardDescription>
            </CardHeader>
            <CardFooter>
              <progress
                className="w-full h-2 bg-gray-200 rounded"
                value={(session?.user?.storageUsed ?? 0) / 1073741824}
                max={1}
              ></progress>
            </CardFooter>
          </Card>
        </div>

        <p className="text-muted-foreground mb-8">
          Complete your profile information to get the most out of KhmerCoders platform.
        </p>

        <div className="space-y-4">
          {/* Setup Alias Option */}
          <Link href="/profile/setup/alias" className="block">
            <Card className="p-6 hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <AtSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Setup Alias</h3>
                    <p className="text-muted-foreground">Choose your unique username alias</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
          </Link>

          {/* Setup Profile Detail Option */}
          <Link href="/profile/setup/detail" className="block">
            <Card className="p-6 hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Profile Details</h3>
                    <p className="text-muted-foreground">Update your personal information</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
          </Link>

          {/* Setup Working Experience Option */}
          <Link href="/profile/setup/experience" className="block">
            <Card className="p-6 hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Working Experience</h3>
                    <p className="text-muted-foreground">Add your work history and skills</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
          </Link>

          {/* Setup Profile Picture Option */}
          <Link href="/profile/setup/picture" className="block">
            <Card className="p-6 hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Image className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Profile Picture</h3>
                    <p className="text-muted-foreground">Upload or update your profile photo</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
          </Link>

          {/* Setup Shortened Links Option */}
          <Link href="/profile/setup/links" className="block">
            <Card className="p-6 hover:bg-accent/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <LinkIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Shortened Links</h3>
                    <p className="text-muted-foreground">Create and manage your shortened URLs</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
