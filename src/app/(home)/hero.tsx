import { KV_TELERAM_MEMBER_COUNT } from '@/constants';
import { KCLinks } from '@/data/link';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import Link from 'next/link';

export async function HomeHeroBanner() {
  const { env } = getCloudflareContext();

  const counter = await env.KV.get([
    'telegram_member_count',
    'discord_member_count',
    'facebook_member_count',
  ]);

  const telegramMemberCount = Number(counter.get(KV_TELERAM_MEMBER_COUNT) || 0);
  const discordMemberCount = Number(counter.get('discord_member_count') || 0);
  const facebookMemberCount = Number(counter.get('facebook_member_count') || 0);

  return (
    <section className="container mx-auto my-12 text-lg tracking-tight">
      <h1 className="font-retro text-5xl md:text-6xl lg:text-7xl text-yellow-500 leading-[1.1]">
        {"Cambodia's Largest"}
        <br />
        Coding Community
      </h1>

      <div className="font-mono my-6 max-w-2xl">
        {`Founded in 2018, Khmer Coders has grown to become Cambodia's largest coding community. We
        bring together developers, designers, and tech enthusiasts to learn, share, and grow
        together.`}
      </div>

      <div className="flex gap-4 flex-wrap">
        <div className="border border-4 border-gray-400 border-double p-4 font-mono w-full md:w-auto">
          <div className="font-bold">Facebook Group</div>
          <div>
            {facebookMemberCount.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </div>
          <Link
            target="_blank"
            href={KCLinks.facebookGroupLink}
            className="text-yellow-500 hover:underline hover:decoration-double"
          >
            Join here
          </Link>
        </div>

        <div className="border border-4 border-gray-400 border-double p-4 font-mono w-full md:w-auto">
          <div className="font-bold">Telegram Group</div>
          <div>
            {telegramMemberCount.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </div>
          <Link
            target="_blank"
            href={KCLinks.telegramLink}
            className="text-yellow-500 hover:underline hover:decoration-double"
          >
            Join here
          </Link>
        </div>

        <div className="border border-4 border-gray-400 border-double p-4 font-mono w-full md:w-auto">
          <div className="font-bold">Discord Group</div>
          <div>
            {discordMemberCount.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </div>
          <Link
            target="_blank"
            href={KCLinks.discordLink}
            className="text-yellow-500 hover:underline hover:decoration-double"
          >
            Join here
          </Link>
        </div>
      </div>
    </section>
  );
}
