import { MainLayout } from '@/components/blocks/layout/MainLayout';
import { StackNavigation } from '@/components/blocks/layout/StackNavigation';
import { UserCard } from '@/components/user-card';
import { USER_LEVEL_DESCRIPTION } from '@/constants';
import { getUserFromLevels } from '@/libs/users';
import { UserLevel } from '@/types';
import { Github, Globe, Linkedin, Twitter } from 'lucide-react';
import { Metadata } from 'next';

export const revalidate = 0; // This disables static generation and makes the page dynamic

export const metadata: Metadata = {
  title: 'Our Teams | Khmer Coders',
  description:
    "Meet the founding members, volunteers, and community moderators of Khmer Coders, Cambodia's largest coding community.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/teams`,
  },
};

export default async function TeamsPage() {
  const members = await getUserFromLevels([
    UserLevel.Contributor,
    UserLevel.Moderator,
    UserLevel.SuperAdmin,
    UserLevel.Premium,
  ]);

  const userPerGroup = Object.entries(USER_LEVEL_DESCRIPTION)
    .map(([level, info]) => {
      const userLevel = Number(level) as UserLevel;

      return {
        level: userLevel,
        info,
        users: members.filter(member => member.user.level === userLevel),
      };
    })
    .filter(group => group.users.length > 0)
    .sort((a, b) => b.level - a.level);

  return (
    <MainLayout>
      <StackNavigation title="About us" />
      <div className="p-4 text-sm">
        <p>
          Our community thrives thanks to the dedication and passion of many individuals who
          contribute their time, skills, and knowledge. Everyone in the Khmer Coders community plays
          a vital role in our collective growth and success.
        </p>
        <p className="mt-2">
          We are deeply grateful for their continuous support and commitment to advancing the tech
          landscape in Cambodia. Below are some of the outstanding members who help drive our
          mission forward and foster a collaborative environment for learning and innovation.
        </p>
      </div>

      {userPerGroup.map(group => (
        <section key={group.level} className="p-4">
          <div className="my-4">
            <h2 className="text-lg font-bold">{group.info.name}</h2>
            <p className="text-muted-foreground text-sm">{group.info.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {group.users.map(member => {
              return (
                <UserCard key={member.user.id} user={member.user} profile={member.member_profile} />
              );
            })}
          </div>
        </section>
      ))}

      <p className="text-sm p-4">
        and other <strong>12,000+ members</strong> who are actively participating in our community.
      </p>
    </MainLayout>
  );
}
