import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/generated/button";
import { type IPartner, partners as PartnerDatabase } from "@/data/partners";
import { useMemo } from "react";
import { cn } from "@/utils";

function calculateScore(partner: IPartner) {
  return partner.tags.reduce((acc, tag) => {
    if (tag.type === "Gold Sponsor") return acc + (tag.badge ?? 0) * 10;
    if (tag.type === "Silver Sponsor") return acc + (tag.badge ?? 0) * 3;
    if (tag.type === "Co-organizer") return acc + (tag.badge ?? 0) * 1;
    if (tag.type === "Venue") return acc + (tag.badge ?? 0) * 3;
    return acc + (tag.badge ?? 0);
  }, 0);
}

export default async function PartnersPage() {
  const partners = PartnerDatabase.sort((a, b) => {
    const aScore = calculateScore(a);
    const bScore = calculateScore(b);

    if (aScore === bScore) {
      // Sort by name if scores are equal
      return a.name.localeCompare(b.name);
    }

    return bScore - aScore;
  });

  return (
    <main className="container mx-auto px-4 pb-20">
      <section className="mb-20" aria-labelledby="partners-heading">
        <div className="flex items-center justify-center mb-12">
          <div className="h-px bg-gray-800 flex-grow" />
          <h2
            id="partners-heading"
            className="text-2xl md:text-3xl font-bold px-6"
          >
            Partners
          </h2>
          <div className="h-px bg-gray-800 flex-grow" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <PartnerCard key={partner.website} partner={partner} />
          ))}
        </div>
      </section>

      <section
        className="mt-24 bg-gray-900 rounded-lg p-8 md:p-12"
        aria-labelledby="become-a-partner-heading"
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2
              id="become-a-partner-heading"
              className="text-2xl md:text-3xl font-bold mb-4"
            >
              Become a Partner
            </h2>
            <p className="text-gray-400 mb-6">
              Partner with Khmer Coders to support Cambodia's tech community and
              gain visibility for your organization. We offer various
              partnership tiers with different benefits.
            </p>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
              Partnership Opportunities
            </Button>
          </div>
          <div className="flex-1 flex justify-center">
            <figure className="relative h-64 w-full max-w-md rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Become a partner"
                fill
                className="object-cover"
              />
            </figure>
          </div>
        </div>
      </section>
    </main>
  );
}

// Partner Card Component
function PartnerCard({ partner }: { partner: IPartner }) {
  const cardClasses =
    "bg-gray-900 rounded-lg overflow-hidden border border-gray-800 flex flex-col h-full";

  const TAG_STYLES = {
    Venue: "bg-green-700",
    "Gold Sponsor": "bg-yellow-700",
    "Co-organizer": "bg-blue-700",
    "Silver Sponsor": "bg-gray-600",
    default: "bg-gray-600",
  } as const;

  const tagElements = useMemo(
    () => (
      <div className="text-sm flex gap-2 mb-4">
        {partner.tags.map((tag) => (
          <div
            className={cn(
              TAG_STYLES[tag.type as keyof typeof TAG_STYLES] ||
                TAG_STYLES.default,
              "px-2 py-1 rounded flex gap-2"
            )}
            key={tag.type}
          >
            <span>
              {tag.type}
              {tag.badge && ` • ${tag.badge}`}
            </span>
          </div>
        ))}
      </div>
    ),
    [partner.tags, TAG_STYLES]
  );

  return (
    <article className={cardClasses}>
      <div className="relative aspect-[2/1] w-full bg-gray-800 flex items-center justify-center p-6">
        <figure className="relative w-full h-full max-w-[240px] max-h-[120px]">
          <Image
            src={partner.logo || "/placeholder.svg"}
            alt={partner.name}
            fill
            className="object-contain"
          />
        </figure>
      </div>

      <section className="p-6 flex-grow" aria-labelledby="partner-name">
        {tagElements}
        <h3 id="partner-name" className="text-xl font-bold mb-2">
          {partner.name}
        </h3>
        <p className="text-gray-400 mb-4">{partner.description}</p>
        <Link
          href={partner.website}
          className="inline-flex items-center text-yellow-500 hover:text-yellow-400"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit Website <ExternalLink className="ml-1 h-3 w-3" />
        </Link>
      </section>
    </article>
  );
}

