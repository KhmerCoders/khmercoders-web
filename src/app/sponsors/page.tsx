import { MainLayout } from '@/components/blocks/layout/MainLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/generated/table';
import { DonorDatabase, IDonor } from '@/data/donors';
import { partners, IPartnerWithTags, SponsorType } from '@/data/partners';
import { eventsDatabase } from '@/data/events';
import Link from 'next/link';
import { StackNavigation } from '@/components/blocks/layout/StackNavigation';
import { Package } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sponsors | Khmer Coders',
  description: 'Our generous sponsors and partners who support the Khmer Coders community.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/sponsors`,
  },
};

export default function SponsorPage() {
  return (
    <MainLayout>
      <StackNavigation title="Sponsor" icon={Package} />
      <div className="flex flex-col text-sm">
        <div className="p-4 flex flex-col gap-4 border-b">
          <h2 className="text-lg font-bold">Group Sponsors</h2>
          <p>
            {`Group sponsors provide monthly contributions that support our community's growth. Funds
            help maintain platform moderation, infrastructure, and development. We're grateful for
            their commitment to the Khmer coding community.`}{' '}
            <Link href="/sponsors/howto" className="text-blue-600 hover:underline">
              Learn how to sponsor us
            </Link>
          </p>

          <div>
            <div className="bg-gray-700 rounded p-2 inline-block">
              <Link href={'https://www.skaitechnology.com/'} target="_blank">
                <img src="/assets/images/partners/skai_tech_white_tr.png" className="h-16" />
              </Link>
            </div>
          </div>
        </div>

        <EventSponsorSection />

        <div className="p-4 flex flex-col gap-4">
          <h2 className="text-lg font-bold">Individual Sponsors</h2>
          <p>
            Individual sponsors play a crucial role in supporting our community. Their
            contributions, whether financial or in-kind, help us maintain and grow our initiatives.
            We appreciate their commitment and involvement.
          </p>

          <div className="border rounded shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Contribution</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {DonorDatabase.sort((a, b) => {
                  const totalA = a.trx.reduce((acc, trx) => acc + trx.amount, 0);
                  const totalB = b.trx.reduce((acc, trx) => acc + trx.amount, 0);
                  return totalB - totalA; // Sort in descending order
                }).map((donor: IDonor) => (
                  <TableRow key={donor.name}>
                    <TableCell>{donor.name}</TableCell>
                    <TableCell className="text-right">
                      ${donor.trx.reduce((acc, trx) => acc + trx.amount, 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function EventSponsorSection() {
  // Calculate partner tags and scores (same logic as partners page)
  const partnersWithTags = partners
    .map(partner => {
      return {
        ...partner,
        tags: eventsDatabase.reduce(
          (acc, event) => {
            const tag = event.sponsors.find(sponsor => sponsor.id === partner.id);
            if (tag) {
              acc[tag.type] = (acc[tag.type] ?? 0) + 1;
            }
            return acc;
          },
          {} as Record<SponsorType, number>
        ),
      } as IPartnerWithTags;
    })
    .sort((a, b) => {
      // Same scoring logic as partners page
      const calculateScore = (partner: IPartnerWithTags) =>
        (partner.tags['Gold Sponsor'] ?? 0) * 700 +
        (partner.tags['Silver Sponsor'] ?? 0) * 300 +
        (partner.tags['Co-organizer'] ?? 0) * 150 +
        (partner.tags['Venue'] ?? 0) * 150 +
        (partner.tags['Media Partner'] ?? 0) * 100 +
        (partner.tags['Ticket Partner'] ?? 0) * 100;

      const aScore = calculateScore(a);
      const bScore = calculateScore(b);
      if (aScore === bScore) {
        return a.name.localeCompare(b.name);
      }
      return bScore - aScore;
    });

  return (
    <div className="p-4 flex flex-col gap-4 border-b">
      <h2 className="text-lg font-bold">Event Sponsors</h2>
      <p>
        Event sponsors contribute to specific events, helping to cover costs and enhance the
        experience for all participants. Their support is vital for the success of our community
        gatherings.
      </p>

      <div className="border rounded shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary">
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Partner Name</TableHead>
              <TableHead>Gold</TableHead>
              <TableHead>Silver</TableHead>
              <TableHead>Other</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partnersWithTags.map(partner => {
              const goldCount = partner.tags['Gold Sponsor'] || 0;
              const silverCount = partner.tags['Silver Sponsor'] || 0;
              const otherCount =
                (partner.tags['Co-organizer'] || 0) +
                (partner.tags['Venue'] || 0) +
                (partner.tags['Media Partner'] || 0) +
                (partner.tags['Ticket Partner'] || 0);

              return (
                <TableRow key={partner.id}>
                  <TableCell>
                    <div className="w-[64px] h-[64px] bg-black-700 rounded flex items-center justify-center">
                      <img src={partner.logo}></img>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link href={partner.website} target="_blank">
                      {partner.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">{goldCount > 0 ? goldCount : '_'}</TableCell>
                  <TableCell className="text-center">
                    {silverCount > 0 ? silverCount : '-'}
                  </TableCell>
                  <TableCell className="text-center">{otherCount > 0 ? otherCount : '-'}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
