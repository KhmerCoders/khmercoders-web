import { cn } from "@/utils";
import type { ComponentProps } from "react";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/generated/sheet";
import Image from "next/image";
import { UserAvatar } from "./user-avatar";
import Link from "next/link";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

export const Navbar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex items-center flex-row">
      <div className="flex gap-4 items-center sm:hidden">
        <UserAvatar user={session?.user} />
        <NavbarContainer
          className="items-center flex-row"
          aria-label="Mobile Navigation"
        >
          <Sheet>
            <SheetTrigger asChild>
              <button type="button" className="p-2">
                <Menu className="h-6 w-6 text-amber-500" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[280px] border-0 border-amber-500/30 bg-black/95 backdrop-blur-md [&>button]:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6 pt-4">
                  <Image
                    src="/khmer-coder.svg"
                    alt="Khmer Coders"
                    width={100}
                    height={100}
                  />
                  <SheetTitle className="sr-only">Khmer Coders</SheetTitle>

                  <SheetClose className="rounded-full h-8 w-8 p-0 flex items-center justify-center hover:bg-amber-500/10 transition-colors">
                    <X className="size-6 text-amber-500" />
                    <span className="sr-only">Close</span>
                  </SheetClose>
                </div>

                <div className="flex flex-col gap-2 px-2">
                  <NavbarLink
                    href="/events"
                    className="w-full justify-start px-4 rounded-xl hover:bg-amber-500/10"
                  >
                    Events
                  </NavbarLink>
                  <NavbarLink
                    href="/teams"
                    className="w-full justify-start px-4 rounded-xl hover:bg-amber-500/10"
                  >
                    Teams
                  </NavbarLink>
                  <NavbarLink
                    href="/partners"
                    className="w-full justify-start px-4 rounded-xl hover:bg-amber-500/10"
                  >
                    Partners
                  </NavbarLink>
                  <NavbarLink
                    href="/donate"
                    className="w-full justify-start px-4 rounded-xl hover:bg-amber-500/10"
                  >
                    Donate
                  </NavbarLink>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </NavbarContainer>
      </div>
      <div className="hidden sm:flex gap-4 items-center">
        <NavbarContainer aria-label="Main Navigation">
          <NavbarLink href="/events">Events</NavbarLink>
          <NavbarLink href="/teams">Teams</NavbarLink>
          <NavbarLink href="/partners">Partners</NavbarLink>
          <NavbarLink href="/donate">Donate</NavbarLink>
        </NavbarContainer>
        <UserAvatar user={session?.user} />
      </div>
    </div>
  );
};

export default Navbar;

export const NavbarContainer = ({
  children,
  className,
  ...props
}: ComponentProps<"nav">) => {
  return (
    <nav
      className={cn(
        "flex w-fit backdrop-blur-md border border-amber-500/30 bg-amber-500/10  rounded-2xl shadow-xl shadow-black/5 p-px relative",
        className
      )}
      {...props}
    >
      <ul className="flex w-fit items-center justify-between">{children}</ul>
    </nav>
  );
};

export const NavbarLink = ({
  children,
  href,
  isHighlighted,
  className,
  ...props
}: {
  isHighlighted?: boolean;
  href: string;
} & Omit<ComponentProps<typeof Link>, "href">) => {
  return (
    <Link
      href={href}
      className={cn(
        "relative inline-flex text-sm h-11 tracking-tight items-center",
        isHighlighted
          ? "text-white bg-linear-to-b from-violet-500 to-violet-600 rounded-[14px] hover:from-violet-500/80 hover:to-violet-600/80 shadow-md transition-all hover:scale-105"
          : "text-amber-500 hover:text-amber-400 before:absolute before:inset-0 before:bg-neutral-500/20 hover:before:scale-100 before:scale-50 before:opacity-0 hover:before:opacity-100 before:transition before:rounded-[14px]",
        "sm:w-28 sm:justify-center",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};

