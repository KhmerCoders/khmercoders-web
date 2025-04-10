export interface IPartner {
  name: string;
  description: string;
  logo: string;
  website: string;
  tags: {
    type: "Gold Sponsor" | "Silver Sponsor" | "Co-organizer" | "Venue";
    badge?: number;
  }[];
}

export const partners: IPartner[] = [
  {
    name: "Bill24",
    description:
      "Bill24 streamlines bill payments, connecting businesses and customers through multiple channels.",
    logo: "/assets/images/partners/bill24.png?height=200&width=400",
    website: "https://bill24.io/kh/",
    tags: [{ type: "Silver Sponsor", badge: 3 }],
  },
  {
    name: "Binance Academy",
    description:
      "Binance Academy offers free, comprehensive education on blockchain and cryptocurrency topics.",
    logo: "/assets/images/partners/academy-h.png?height=200&width=400",
    website: "https://academy.binance.com",
    tags: [{ type: "Gold Sponsor", badge: 1 }],
  },
  {
    name: "Plasgate",
    description:
      "PlasGate is Cambodia's largest authorized SMS gateway, connecting businesses to all major networks.",
    logo: "/assets/images/partners/plusgate.webp?height=200&width=400",
    website: "https://plasgate.com/",
    tags: [
      { type: "Gold Sponsor", badge: 2 },
      { type: "Silver Sponsor", badge: 2 },
    ],
  },
  {
    name: "Techbodia",
    description:
      "Techbodia is a leading Cambodian IT company offering customer-satisfaction-driven services.",
    logo: "/assets/images/partners/techbodia.png?height=200&width=400",
    website: "https://www.techbodia.com/",
    tags: [{ type: "Silver Sponsor", badge: 3 }],
  },
  {
    name: "Jobify",
    description:
      "Jobify is Cambodia's leading IT job matching service, offering recruitment and staffing solutions to connect companies with skilled tech professionals.",
    logo: "/assets/images/partners/jobify.jpg",
    website: "https://jobify.works",
    tags: [{ type: "Co-organizer", badge: 5 }],
  },
  {
    name: "DataU",
    description:
      "DataU Academy offers live, interactive data science and AI training programs in Cambodia.",
    logo: "/assets/images/partners/datau.png?height=200&width=400",
    website: "https://wedatau.org",
    tags: [{ type: "Co-organizer", badge: 5 }],
  },
  {
    name: "Daun Penh Data Center",
    description:
      "DP CLOUD offers VPS, dedicated servers, web hosting, and other cloud services located in Cambodia.",
    logo: "/assets/images/partners/dpcloud_logo.png?height=200&width=400",
    website: "https://dpdatacenter.com/en",
    tags: [{ type: "Silver Sponsor", badge: 3 }],
  },
  {
    name: "Cambodian Network Exchange",
    description:
      "Cambodian Network Exchange (CNX) is an open, neutral internet exchange in Cambodia.",
    logo: "/assets/images/partners/cnx.png?height=200&width=400",
    website: "https://cnx.net.kh/",
    tags: [{ type: "Silver Sponsor", badge: 1 }],
  },
  {
    name: "Sabay TeKh",
    description:
      "Sabay Cloud offers cloud-based video streaming, storage, and transcoding services in Cambodia.",
    logo: "/assets/images/partners/sabay-tekh.png?height=200&width=400",
    website: "https://cloud.sabay.com/",
    tags: [{ type: "Silver Sponsor", badge: 1 }],
  },
  {
    name: "AI Farm",
    description:
      "AI Farm Robotic Factory, a subsidiary of Khamsa Group of Businesses (KGB), is a technology-driven company based in Phnom Penh, Cambodia.",
    logo: "/assets/images/partners/aifarm.png?height=200&width=400",
    website: "https://aifarm.dev/",
    tags: [{ type: "Silver Sponsor", badge: 2 }],
  },
  {
    name: "Dreamlab",
    description:
      "DreamsLAB is a Cambodian software solutions company specializing in custom software, mobile apps, cloud services, AI, and blockchain integration.",
    logo: "/assets/images/partners/dreamslab.svg?height=200&width=400",
    website: "https://www.dreamslab.dev/",
    tags: [
      { type: "Silver Sponsor", badge: 3 },
      { type: "Venue", badge: 1 },
    ],
  },
  {
    name: "Connexion",
    description:
      "Connexion is a 'work & lifestyle' sustainable hub in the center of Koh Pich, Phnom Penh.",
    logo: "/assets/images/partners/connexion2.png",
    website: "https://www.facebook.com/connexionkohpich",
    tags: [{ type: "Venue", badge: 1 }],
  },
  {
    name: "Raintree",
    description:
      "Raintree is Cambodia's first creative office development, offering flexible workspaces and event venues in Phnom Penh's central business district",
    logo: "/assets/images/partners/raintree.png",
    website: "https://www.raintreecambodia.com/",
    tags: [{ type: "Venue", badge: 1 }],
  },
  {
    name: "Peanex",
    description:
      "Versatile event venue with catering, decor, and ample parking.",
    logo: "/assets/images/partners/peanex.png",
    website: "https://www.facebook.com/people/Peanex-Venue/61568431050449",
    tags: [{ type: "Venue", badge: 1 }],
  },
];

