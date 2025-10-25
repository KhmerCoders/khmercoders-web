import { MainLayout } from '@/components/blocks/layout/MainLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How to Sponsor Us | Khmer Coders',
  description: 'Learn how to become a sponsor and support the Khmer Coders community.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/sponsors/howto`,
  },
};

export default function SponsorHowToPage() {
  return (
    <MainLayout>
      <div className="flex flex-col text-sm">
        <div className="flex flex-col gap-4 p-4 border-b">
          <h2 className="text-lg font-bold">How to Sponsor Us</h2>
          <p>
            {`Sponsoring our community is a great way to support the growth of the Khmer coding
            ecosystem. Here's how you can get involved:`}
          </p>

          <p className="mt-2 text-3xl">$200/month</p>
        </div>

        <div className="p-4 flex flex-col gap-4">
          <h3 className="text-lg font-bold">Benefits</h3>

          <p>To show our appreciation, we provide the following benefits to our sponsors:</p>

          <h4 className="font-bold">Monthly Sponsored Content</h4>
          <p>
            One sponsored post per month with enhanced visibility and reach across all our community
            channels including Telegram, Facebook, Discord, and our platform.
          </p>

          <h4 className="font-bold">Brand Recognition</h4>
          <p>Your organization will be prominently featured in:</p>
          <ul className="ml-6 space-y-2 list-disc">
            <li>
              Our sponsor page under <strong>Group Sponsor</strong> section
            </li>
            <li>Facebook group banner and cover image</li>
            <li>GitHub repository README and documentation</li>
          </ul>

          <h4 className="font-bold">Event Mention</h4>
          <p>
            Our sponsors will be mentioned in all of community events and meetups and will provide
            additional discount to include in the backdrop and booth
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
