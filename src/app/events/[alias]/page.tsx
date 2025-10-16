import { eventsDatabase } from '@/data/events';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { IPartner, IPartnerWithTags, partners } from '@/data/partners';
import { PartnerCard } from '@/components/atoms/partner-card';
import { Clock, Pin } from 'lucide-react';
import { Metadata } from 'next';
import { MainLayout } from '@/components/blocks/layout/MainLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/generated/table';
import { StackNavigation } from '@/components/blocks/layout/StackNavigation';
import { title } from 'process';
import { time } from 'console';

export async function generateMetadata({
  params,
}: {
  params: { alias: string };
}): Promise<Metadata> {
  const awaitedParams = await params;
  const event = eventsDatabase.find(event => event.id === awaitedParams.alias);

  if (!event) {
    return {
      title: 'Event Not Found | Khmer Coders',
      description: 'The requested event could not be found.',
    };
  }

  return {
    title: `${event.title} | Khmer Coders`,
    description: event.description,
    agenda: event.agenda,
    openGraph: {
      images: [event.image],
      title: event.title,
      description: event.description,
      siteName: 'Khmer Coders',
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.description,
      images: [event.image],
    },
  };
}

export default async function EventDetailPage({ params }: { params: { alias: string } }) {
  const awaitedParams = await params;
  const { alias } = awaitedParams;
  const event = eventsDatabase.find(event => event.id === alias);

  if (!event) {
    notFound();
  }

  const sponsors = event.sponsors
    .map(sponsor => {
      const partner = partners.find(p => p.id === sponsor.id);
      if (!partner) return null;
      return {
        ...partner,
        tags: { [sponsor.type]: 1 },
      };
    })
    .filter(Boolean) as IPartnerWithTags[];

  return (
    <MainLayout>
      <StackNavigation defaultBackURL="/events" />

      <Image
        src={event.image}
        alt={event.title}
        width={1000}
        height={400}
        className="select-none object-cover w-full h-[400px]"
      />

      <div className="p-4 flex flex-col">
        <h1 className="text-xl font-bold">{event.title}</h1>
        <p className="flex gap-2 my-1 items-center">
          <Clock className="w-5 h-5" />
          {event.date}
        </p>
        {event.location && (
          <p className="flex my-1 gap-2 items-center">
            <Pin className="w-5 h-5" />
            {event.location}
          </p>
        )}

        <p className="mt-4">{event.description}</p>
      </div>
      <div className="p-4 border-t">
        <h1 className="font-bold mb-4">Agenda</h1>
        <div className="rounded overflow-hidden border">
        <Table>
          <TableHeader className='bg-secondary'>
            <TableRow>
              <TableHead>Activity</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {event.agenda.map((section) =>
                section.data.map((item, i) => (
                  <TableRow key={`${section.title}-${i}`}>
                    <TableCell>{item.time}</TableCell>
                    <TableCell>{item.topic}</TableCell>
                  </TableRow>
                ))
              )}
          </TableBody>
        </Table>
        </div>
        <br></br>
        <p>Moderated by {event.by}</p>
      </div>
      <div className="p-4 border-t">
        <h1 className="font-bold mb-4">Sponsors</h1>

        <div className="rounded overflow-hidden border">
          <Table>
            <TableHeader className="bg-secondary">
              <TableRow>
                <TableHead style={{ width: 50 }}></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sponsors.map(sponsor => {
                return (
                  <TableRow key={sponsor.id}>
                    <TableCell>
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-black-secondary flex items-center justify-center">
                        <img src={sponsor.logo}></img>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold">{sponsor.name}</TableCell>
                    <TableCell>{Object.keys(sponsor.tags).join(', ')}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </MainLayout>
  );
}
