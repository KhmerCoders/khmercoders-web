import Link from "next/link";
import Image from "next/image";
import { Code, Users, Calendar, Map, Facebook } from "lucide-react";

import { Button, buttonVariants } from "@/components/generated/button";
import { AspectRatio } from "@/components/generated/aspect-ratio";
import { eventsDatabase } from "@/data/events";
import { KCLinks } from "@/data/link";
import { cn } from "@/utils";
import { DiscordIcon } from "@/components/atoms/icons";

export default async function LandingPage() {
  const events = [...eventsDatabase].reverse().slice(0, 3);

  return (
    <main className="relative">
      {/* Hero Section */}
      <section className="container mx-auto md:py-20 px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm text-amber-500">
              <span className="font-medium">Cambodia's Tech Hub</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Cambodia&apos;s Largest{" "}
              <span className="text-yellow-500">Coding Community</span>
            </h1>
            <p className="text-lg text-gray-400 max-w-xl">
              Connecting developers, sharing knowledge, and building the future
              of tech in Cambodia.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link
                href={KCLinks.facebookGroupLink}
                target="_blank"
                className={cn(
                  buttonVariants(),
                  "text-black bg-yellow-500 hover:bg-yellow-500/90"
                )}
              >
                <Facebook className="h-4 w-4" />
                Join Facebook
              </Link>

              <Link
                href={KCLinks.facebookGroupLink}
                target="_blank"
                className={cn(
                  buttonVariants(),
                  "text-black bg-yellow-500 hover:bg-yellow-500/90"
                )}
              >
                <DiscordIcon className="w-16 h-16" />
                Join Discord
              </Link>
            </div>
          </div>
          <div className="flex-1 relative w-full md:w-auto">
            <AspectRatio
              ratio={16 / 9}
              className="relative rounded-lg overflow-hidden border-2 border-gray-800"
            >
              <Image
                src="/hero-banner.jpg"
                alt="Khmer Coders Community"
                fill
                className="object-cover"
                priority
              />
            </AspectRatio>
            <div className="absolute bottom-2 md:-bottom-6 left-2 md:-left-6 bg-yellow-500/10 backdrop-blur-lg rounded-xl p-4 border border-yellow-500/20 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/20 rounded-lg">
                  <Users className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-500">10,000+</p>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400/80 font-medium">
                    Active Members
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto py-20 px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-yellow-500 text-3xl md:text-4xl font-bold mb-6">
            About Khmer Coders
          </h2>
          <p className="text-gray-400 text-lg">
            Founded in 2018, Khmer Coders has grown to become Cambodia&apos;s
            largest coding community. We bring together developers, designers,
            and tech enthusiasts to learn, share, and grow together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
            <div className="h-12 w-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-6">
              <Users className="h-6 w-6 text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Inclusive Community</h3>
            <p className="text-gray-400">
              We welcome developers of all skill levels, from beginners to
              experts, creating a supportive environment for everyone.
            </p>
          </div>

          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
            <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
              <Code className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Skill Development</h3>
            <p className="text-gray-400">
              Regular workshops, hackathons, and coding sessions to help members
              improve their technical skills.
            </p>
          </div>

          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
            <div className="h-12 w-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-6">
              <Calendar className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="text-xl font-bold mb-3">Networking</h3>
            <p className="text-gray-400">
              Connect with industry professionals, find mentors, and discover
              job opportunities in Cambodia&apos;s tech sector.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 py-20 px-4 justify-center items-center">
        <img
          src="/assets/images/kol-program-md.png"
          className="border-gray-800 border-b-8 w-full"
        />
        <div>
          <div className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm text-amber-500 mb-4">
            <span className="font-medium">Creator Program</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Empowering{" "}
            <span className="text-yellow-500">Technical Creators</span>
          </h2>
          <p className="text-gray-400 mb-6">
            Our creator program supports technical content creators who share
            knowledge, provide entertainment, and inspire the next generation to
            pursue careers in STEM.
          </p>
          <p className="text-gray-400 mb-8">
            We provide resources, mentorship, and a platform for creators to
            reach wider audiences, while building a community of passionate
            educators who make technical concepts accessible and engaging for
            everyone.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-yellow-500/20 backdrop-blur-lg rounded-xl p-4 border border-yellow-500/80 shadow-lg">
              <div className="text-2xl font-bold">10,000+</div>
              <div className="text-sm">Subscribers</div>
            </div>

            <div className="bg-yellow-500/20 backdrop-blur-lg rounded-xl p-4 border border-yellow-500/80 shadow-lg">
              <div className="text-2xl font-bold">1,000,000+</div>
              <div className="text-sm">Views</div>
            </div>

            <div className="bg-yellow-500/20 backdrop-blur-lg rounded-xl p-4 border border-yellow-500/80 shadow-lg">
              <div className="text-2xl font-bold">200,000+</div>
              <div className="text-sm">Engagement</div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="bg-gray-900 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Events</h2>
            <p className="text-gray-400 text-lg">
              Join us for our regular meetups, workshops, and special events
              throughout the year.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              return (
                <div
                  key={event.title}
                  className="bg-black rounded-lg overflow-hidden border border-gray-800"
                >
                  <div className="w-full relative">
                    <AspectRatio ratio={16 / 9}>
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </AspectRatio>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-yellow-500">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        {event.date} - {event.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Map className="h-4 w-4" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="community" className="container mx-auto py-20 px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Community Voices
          </h2>
          <p className="text-gray-400 text-lg">
            Hear from our members about their experiences with Khmer Coders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
            <p className="text-gray-300 mb-6">
              "Joining Khmer Coders was a turning point in my career. The
              community helped me learn new skills and find my current job as a
              frontend developer."
            </p>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full overflow-hidden relative">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Testimonial"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium">Sokha Chea</p>
                <p className="text-sm text-gray-400">Frontend Developer</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 p-8 rounded-lg border border-gray-800">
            <p className="text-gray-300 mb-6">
              "The workshops and mentorship I received through Khmer Coders
              helped me transition from a student to a professional software
              engineer."
            </p>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full overflow-hidden relative">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Testimonial"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium">Dara Kim</p>
                <p className="text-sm text-gray-400">Software Engineer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-yellow-900/40 to-gray-900/40 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Cambodia&apos;s Largest Coding Community
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Connect with fellow developers, learn new skills, and be part of the
            growing tech ecosystem in Cambodia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={KCLinks.facebookGroupLink}
              target="_blank"
              className={cn(
                buttonVariants(),
                "text-black bg-yellow-500 hover:bg-yellow-500/90"
              )}
            >
              <Facebook className="h-4 w-4" />
              Join Facebook
            </Link>

            <Link
              href={KCLinks.facebookGroupLink}
              target="_blank"
              className={cn(
                buttonVariants(),
                "text-black bg-yellow-500 hover:bg-yellow-500/90"
              )}
            >
              <DiscordIcon className="w-16 h-16" />
              Join Discord
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

