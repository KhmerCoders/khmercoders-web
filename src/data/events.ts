import { SponsorType, type PartnerIds } from './partners';

interface EventAgendaGroup {
  title?: string;
  data: EventAgendaData[];
}

interface EventAgendaData {
  time: string;
  topic?: string;
  by?: string;
}

export interface EventData {
  id: string;
  title: string;
  date: string;
  description: string;
  location?: string;
  time?: string;
  image: string;
  badge?: string;
  agenda?: EventAgendaGroup[];
  by?: string;
  sponsors: {
    type: SponsorType;
    id: PartnerIds;
  }[];
}

export const eventsDatabase: EventData[] = [
  {
    id: 'khmer-coders-party-v1',
    title: 'Khmer Coders Party v1',
    date: 'February 16, 2024',
    description:
      'Khmer Coder Gathering is regular gathering for developer community. The purpose is to strengthen the community relationship',
    location: 'The RANA',
    time: '5:45PM - 9:00 PM',
    image: '/assets/images/events/1.jpg?height=400&width=600',
    badge: 'Meetup',
    sponsors: [
      { type: 'Gold Sponsor', id: 'plasgate' },
      { type: 'Co-organizer', id: 'datau' },
      { type: 'Co-organizer', id: 'jobify' },
    ],
  },
  {
    id: 'khmer-coders-party-v2',
    title: 'Khmer Coders Party v2',
    date: 'June, 7th 2024',
    description:
      'Khmer Coder Gathering is regular gathering for developer community. The purpose is to strengthen the community relationship',
    location: 'Raintree',
    time: '5:45PM - 9:00 PM',
    image: '/assets/images/events/2.jpg?height=400&width=600',
    badge: 'Meetup',
    sponsors: [
      { type: 'Gold Sponsor', id: 'plasgate' },
      { type: 'Silver Sponsor', id: 'bill24' },
      { type: 'Silver Sponsor', id: 'ai-farm' },
      { type: 'Silver Sponsor', id: 'dreamlab' },
      { type: 'Venue', id: 'raintree' },
      { type: 'Co-organizer', id: 'datau' },
      { type: 'Co-organizer', id: 'jobify' },
    ],
  },
  {
    id: 'khmer-coders-party-v3',
    title: 'Khmer Coders Party v3',
    date: 'August, 9th 2024',
    description:
      'Khmer Coder Gathering is regular gathering for developer community. The purpose is to strengthen the community relationship',
    location: 'Raintree',
    time: '5:45PM - 9:00 PM',
    image: '/assets/images/events/3.jpg?height=400&width=600',
    badge: 'Meetup',
    sponsors: [
      { type: 'Silver Sponsor', id: 'bill24' },
      { type: 'Silver Sponsor', id: 'techbodia' },
      { type: 'Silver Sponsor', id: 'ai-farm' },
      { type: 'Silver Sponsor', id: 'dreamlab' },
      { type: 'Silver Sponsor', id: 'daun-penh-data-center' },
      { type: 'Venue', id: 'connexion' },
      { type: 'Co-organizer', id: 'datau' },
      { type: 'Co-organizer', id: 'jobify' },
    ],
  },
  {
    id: 'khmer-coders-party-v4',
    title: 'Khmer Coders Party v4',
    date: 'November, 7th 2024',
    description:
      'Khmer Coder Gathering is regular gathering for developer community. The purpose is to strengthen the community relationship',
    location: 'DreamsLab, Connexion',
    time: '5:45PM - 9:00 PM',
    image: '/assets/images/events/4.jpg?height=400&width=600',
    badge: 'Meetup',
    sponsors: [
      { type: 'Gold Sponsor', id: 'binance-academy' },
      { type: 'Silver Sponsor', id: 'techbodia' },
      { type: 'Silver Sponsor', id: 'plasgate' },
      { type: 'Silver Sponsor', id: 'daun-penh-data-center' },
      { type: 'Venue', id: 'dreamlab' },
      { type: 'Co-organizer', id: 'datau' },
      { type: 'Co-organizer', id: 'jobify' },
    ],
  },
  {
    id: 'khmer-coders-party-v5',
    title: 'Khmer Coders Party v5',
    date: 'March, 7th 2025',
    description:
      'Khmer Coder Gathering is regular gathering for developer community. The purpose is to strengthen the community relationship.',
    location: 'Peanex, Connexion',
    time: '5:45PM - 9:00 PM',
    image: '/assets/images/events/5.jpg?height=400&width=600',
    badge: 'Meetup',
    sponsors: [
      { type: 'Silver Sponsor', id: 'plasgate' },
      { type: 'Silver Sponsor', id: 'techbodia' },
      { type: 'Silver Sponsor', id: 'daun-penh-data-center' },
      { type: 'Silver Sponsor', id: 'cambodian-network-exchange' },
      { type: 'Silver Sponsor', id: 'sabay-tekh' },
      { type: 'Silver Sponsor', id: 'bill24' },
      { type: 'Venue', id: 'peanex' },
      { type: 'Co-organizer', id: 'datau' },
      { type: 'Co-organizer', id: 'jobify' },
    ],
  },
  {
    id: 'khmer-coders-party-siem-reap-v1',
    title: 'Khmer Coders Party Siem Reap v1',
    date: 'May, 17th 2025',
    description:
      'Khmer Coders Gathering is a regular event for the developer community. This marks our first event in Siem Reap as we begin building a strong and connected tech community in the region.',
    location: 'Siem Reap House',
    time: '5:45PM - 9:00 PM',
    image: '/assets/images/events/sr-1.jpg?height=400&width=600',
    badge: 'Meetup',
    sponsors: [
      { type: 'Gold Sponsor', id: 'binance-academy' },
      { type: 'Gold Sponsor', id: 'khmer-enterprise' },
      { type: 'Silver Sponsor', id: 'plasgate' },
      { type: 'Silver Sponsor', id: 'horpao' },
      { type: 'Ticket Partner', id: 'bookme+' },
      { type: 'Media Partner', id: 'techo-startup' },
      { type: 'Media Partner', id: 'nicc' },
      { type: 'Media Partner', id: 'federation-of-cambodia-startup' },
      { type: 'Media Partner', id: 'cadt' },
      { type: 'Co-organizer', id: 'mylekha' },
      { type: 'Co-organizer', id: 'datau' },
      { type: 'Co-organizer', id: 'jobify' },
      { type: 'Silver Sponsor', id: 'skai-tech' },
    ],
  },
  {
    id: 'khmer-coders-gathering-v6',
    title: 'Khmer Coders Gathering v6',
    date: 'September 22, 2025',
    description:
      'Khmer Coder Gathering is regular gathering for developer community. The purpose is to strengthen the community relationship',
    location: 'Connexion',
    time: '2:00 PM - 9:00 PM',
    image: '/assets/images/events/4.jpg?height=400&width=600',
    badge: 'Meetup',
    agenda: [
      {
        title: 'Tentative Agenda',
        data: [
          {
            time: '2:00 – 2:30 PM',
            topic: 'Registration & Welcome Coffee',
            by: 'Sopha Sum',
          },
        ],
      },

      {
        data: [
          {
            time: '2:30 – 2:45 PM',
            topic: 'Opening Remarks • Representatives from Founder of Khmer Coders Community',
            by: 'Sopha Sum',
          },
        ],
      },

      {
        data: [
          {
            time: '2:45 – 4:30 PM',
            topic: 'Trends in AI Agent Development',
            by: 'Daisuke Komatsubara',
          },
        ],
      },

      {
        data: [
          {
            time: "",
            topic: 'AI and Future of Work',
            by: 'Takeshi Izuka',
          },
        ],
      },

      {
        data: [
          {
            time: "",
            topic: 'AI Applications in Cambodia’s Enterprises',
            by: 'Vor Sokhna',
          },
        ],
      },

      {
        data: [
          {
            time: "",
            topic: 'Coding Culture and Developer Ecosystem in Cambodia',
            by: 'In Visal',
          },
        ],
      },

      {
        data: [
          {
            time: "",
            topic: 'Building Human-Centered AI',
            by: 'Buoy Rina',
          },
        ],
      },

      {
        data: [
          {
            time: "",
            topic: 'Bridging AI Research and Real-World Applications',
            by: 'Sreang Rantanak',
          },
        ],
      },

      {
        data: [
          {
            time: '4:30 – 5:15 PM',
            topic:
              'Panel Discussion: “AI Agents & Coding for the Next Decade” Moderated by Sum Sopha',
            by: 'Sopha Sum',
          },
        ],
      },

      {
        data: [
          {
            time: '5:15 – 5:30 PM',
            topic: 'Coffee Break & Group Photo & Networking',
            by: 'Sopha Sum',
          },
        ],
      },

      {
        data: [
          {
            time: '5:30 – 7:00 PM',
            topic: 'Showcase Session • Startup demos, AI agent showcases, and coding projects ',
            by: 'Sopha Sum',
          },
        ],
      },

      {
        data: [
          {
            time: '7:00 – 7:30 PM',
            topic: 'Sponsors Speech and Closing Remarks',
            by: 'Sopha Sum',
          },
        ],
      },

      {
        data: [
          {
            time: '7:39 – 9:00 PM',
            topic: 'Evening Party & Networking • Informal gathering with music, food, and drinks ',
            by: 'Sopha Sum',
          },
        ],
      },
    ],
    by: 'Sopha Sum',
    sponsors: [
      { type: 'Co-organizer', id: 'datau' },
      { type: 'Co-organizer', id: 'jobify' },
    ],
  },
];
