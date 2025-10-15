export type SponsorType =
  | 'Gold Sponsor'
  | 'Silver Sponsor'
  | 'Co-organizer'
  | 'Venue'
  | 'Media Partner'
  | 'Ticket Partner';

export interface IPartner {
  id: PartnerIds;
  name: string;
  description: string;
  logo: string;
  website: string;
}

export interface IPartnerWithTags extends IPartner {
  tags: Record<SponsorType, number>;
}

export type PartnerIds =
  | 'bill24'
  | 'binance-academy'
  | 'plasgate'
  | 'techbodia'
  | 'jobify'
  | 'datau'
  | 'daun-penh-data-center'
  | 'cambodian-network-exchange'
  | 'sabay-tekh'
  | 'ai-farm'
  | 'dreamlab'
  | 'connexion'
  | 'raintree'
  | 'peanex'
  | 'mylekha'
  | 'horpao'
  | 'khmer-enterprise'
  | 'bookme+'
  | 'cadt'
  | 'techo-startup'
  | 'federation-of-cambodia-startup'
  | 'nicc'
  | 'skai-tech';

export const partners: IPartner[] = [
  {
    id: 'bill24',
    name: 'Bill24',
    description:
      'Bill24 streamlines bill payments, connecting businesses and customers through multiple channels.',
    logo: '/assets/images/partners/bill24.png?height=200&width=400',
    website: 'https://bill24.io/kh/',
  },
  {
    id: 'binance-academy',
    name: 'Binance Academy',
    description:
      'Binance Academy offers free, comprehensive education on blockchain and cryptocurrency topics.',
    logo: '/assets/images/partners/academy-h.png?height=200&width=400',
    website: 'https://academy.binance.com',
  },
  {
    id: 'plasgate',
    name: 'Plasgate',
    description:
      "PlasGate is Cambodia's largest authorized SMS gateway, connecting businesses to all major networks.",
    logo: '/assets/images/partners/plusgate.webp?height=200&width=400',
    website: 'https://plasgate.com/',
  },
  {
    id: 'techbodia',
    name: 'Techbodia',
    description:
      'Techbodia is a leading Cambodian IT company offering customer-satisfaction-driven services.',
    logo: '/assets/images/partners/techbodia.png?height=200&width=400',
    website: 'https://www.techbodia.com/',
  },
  {
    id: 'jobify',
    name: 'Jobify',
    description:
      "Jobify is Cambodia's leading IT job matching service, offering recruitment and staffing solutions to connect companies with skilled tech professionals.",
    logo: '/assets/images/partners/jobify.jpg',
    website: 'https://jobify.works',
  },
  {
    id: 'datau',
    name: 'DataU',
    description:
      'DataU Academy offers live, interactive data science and AI training programs in Cambodia.',
    logo: '/assets/images/partners/datau.png?height=200&width=400',
    website: 'https://wedatau.org',
  },
  {
    id: 'daun-penh-data-center',
    name: 'Daun Penh Data Center',
    description:
      'DP CLOUD offers VPS, dedicated servers, web hosting, and other cloud services located in Cambodia.',
    logo: '/assets/images/partners/dpcloud_logo.png?height=200&width=400',
    website: 'https://dpdatacenter.com/en',
  },
  {
    id: 'cambodian-network-exchange',
    name: 'Cambodian Network Exchange',
    description:
      'Cambodian Network Exchange (CNX) is an open, neutral internet exchange in Cambodia.',
    logo: '/assets/images/partners/cnx.png?height=200&width=400',
    website: 'https://cnx.net.kh/',
  },
  {
    id: 'sabay-tekh',
    name: 'Sabay TeKh',
    description:
      'Sabay Cloud offers cloud-based video streaming, storage, and transcoding services in Cambodia.',
    logo: '/assets/images/partners/sabay-tekh.png?height=200&width=400',
    website: 'https://cloud.sabay.com/',
  },
  {
    id: 'ai-farm',
    name: 'AI Farm',
    description:
      'AI Farm Robotic Factory, a subsidiary of Khamsa Group of Businesses (KGB), is a technology-driven company based in Phnom Penh, Cambodia.',
    logo: '/assets/images/partners/aifarm.png?height=200&width=400',
    website: 'https://aifarm.dev/',
  },
  {
    id: 'dreamlab',
    name: 'Dreamlab',
    description:
      'DreamsLAB is a Cambodian software solutions company specializing in custom software, mobile apps, cloud services, AI, and blockchain integration.',
    logo: '/assets/images/partners/dreamslab.svg?height=200&width=400',
    website: 'https://www.dreamslab.dev/',
  },
  {
    id: 'connexion',
    name: 'Connexion',
    description:
      "Connexion is a 'work & lifestyle' sustainable hub in the center of Koh Pich, Phnom Penh.",
    logo: '/assets/images/partners/connexion2.png',
    website: 'https://www.facebook.com/connexionkohpich',
  },
  {
    id: 'raintree',
    name: 'Raintree',
    description:
      "Raintree is Cambodia's first creative office development, offering flexible workspaces and event venues in Phnom Penh's central business district",
    logo: '/assets/images/partners/raintree.png',
    website: 'https://www.raintreecambodia.com/',
  },
  {
    id: 'peanex',
    name: 'Peanex',
    description: 'Versatile event venue with catering, decor, and ample parking.',
    logo: '/assets/images/partners/peanex.png',
    website: 'https://www.facebook.com/people/Peanex-Venue/61568431050449',
  },
  {
    id: 'mylekha',
    name: 'MyLekha',
    description:
      'MyLekha is a free, all-in-one POS system from Cambodia, helping businesses manage sales, inventory, and finances efficiently.',
    logo: '/assets/images/partners/mylekha.png?height=200&width=400',
    website: 'https://mylekha.net',
  },
  {
    id: 'horpao',
    name: 'Horpao',
    description:
      'Hor Pao is a Cambodian POS and loyalty app helping small businesses manage sales, finances, and customer rewards efficiently.',
    logo: '/assets/images/partners/horpao.png?height=200&width=400',
    website: 'https://horpao.com',
  },
  {
    id: 'khmer-enterprise',
    name: 'Khmer Enterprise',
    description:
      'Khmer Enterprise is a government-backed initiative fostering entrepreneurship in Cambodia through financial support, training, and ecosystem development',
    logo: '/assets/images/partners/ke.png?height=200&width=400',
    website: 'https://khmerenterprise.info',
  },
  {
    id: 'bookme+',
    name: 'BookMe+',
    description:
      'BookMe+ is a Cambodian app offering seamless booking for transport, accommodations, events, and activities across Southeast Asia.',
    logo: '/assets/images/partners/bookme.svg?height=200&width=400',
    website: 'https://www.bookme.plus',
  },
  {
    id: 'cadt',
    name: 'Cambodia Academy of Digital Technology',
    description:
      'Cambodia Academy of Digital Technology (CADT) is a government-backed institution advancing digital education, research, and innovation in Cambodia.',
    logo: '/assets/images/partners/cadt.png?height=200&width=400',
    website: 'https://cadt.edu.kh',
  },
  {
    id: 'techo-startup',
    name: 'Techo Startup Center',
    description:
      'Techo Startup Center accelerates Cambodian startups via innovation, digital platforms, research, and enterprise digitization initiatives.',
    logo: '/assets/images/partners/techo-startup.png?height=200&width=400',
    website: 'https://techostartup.center',
  },
  {
    id: 'federation-of-cambodia-startup',
    name: 'Federation of Cambodia Startup',
    description:
      'Empowering Innovation, Uniting Startups, Connecting Cambodian Startups to the Global Market.',
    logo: '/assets/images/partners/fed-startup-cambodia.png?height=200&width=400',
    website: 'https://www.facebook.com/camstartup/',
  },
  {
    id: 'nicc',
    name: 'National Incubation Center of Cambodia ',
    description:
      'The National Incubation Center of Cambodia (NICC) at RUPP supports startups through training, mentorship, and innovation-driven programs.',
    logo: '/assets/images/partners/nicc.png?height=200&width=400',
    website: 'https://nicc.rupp.edu.kh',
  },
  {
    id: 'skai-tech',
    name: 'Skai Tech',
    description:
      'SKAI Technology offers software development, outsourcing, AI solutions, and training in Cambodia, led by experienced local and international experts.',
    logo: '/assets/images/partners/skai_tech_white_tr.png?height=200&width=400',
    website: 'https://www.skaitechnology.com',
  },
];
