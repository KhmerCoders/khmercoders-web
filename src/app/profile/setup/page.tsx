'use client';

import Link from 'next/link';
import { ChevronRight, AtSign, User, Briefcase, Image, LinkIcon } from 'lucide-react';
import { Card } from '@/components/generated/card';

export default function ProfileSetupPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Profile Setup</h1>

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
        </div>
      </div>
    </div>
  );
}
