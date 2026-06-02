/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NoteTopic {
  id: string;
  title: string;
  overview: string;
  content: string;
  keyPoints: string[];
  formulas?: { name: string; equation: string; application: string }[];
  tables?: { headers: string[]; rows: string[][] }[];
  importance: 'high' | 'medium' | 'critical';
  estimatedReadTime: number; // in minutes
}

export interface SubjectNotebook {
  subject: 'English' | 'General Knowledge' | 'Pakistan Studies' | 'Computer Science' | 'Mathematics';
  iconName: string;
  description: string;
  topics: NoteTopic[];
}

export const SUBJECT_NOTEBOOKS: SubjectNotebook[] = [
  {
    subject: 'English',
    iconName: 'BookOpen',
    description: 'Master prepositions, conditional sentences, active-passive voice, and high-frequency idioms tested in competitive tests.',
    topics: [
      {
        id: 'eng-note-1',
        title: 'Conditional Sentences Mastery',
        importance: 'critical',
        estimatedReadTime: 6,
        overview: 'Conditional sentences represent scenarios depending on conditions. CSS, KPPSC, and ETEA frequently test correct tense coordination.',
        keyPoints: [
          'Zero Conditional: General truths. Structure: If + present, present. (e.g. If you heat water, it boils.)',
          'First Conditional: Likely future results. Structure: If + present simple, will + verb. (e.g. If he works hard, he will pass.)',
          'Second Conditional: Hypothetical present/future. Structure: If + past simple, would + verb. (e.g. If I won the lottery, I would buy a house.)',
          'Third Conditional: Unfulfilled past events. Structure: If + past perfect, would have + past participle. (e.g. If they had played well, they would have won.)'
        ],
        content: 'Correct tense agreement is the single most tested factor. Avoid the common error of mixing "would + worked" or using "would have" in both clauses.'
      },
      {
        id: 'eng-note-2',
        title: 'High-Yield Preposition list',
        importance: 'high',
        estimatedReadTime: 5,
        overview: 'Prepositions are the trickiest grammar questions. Memorize these specific verb-adjective pairings.',
        keyPoints: [
          'Proficient in: Correct: "He is proficient in English." (Incorrect: proficient at/with)',
          'Abstain from: Correct: "Candidates must abstain from electronic items." (Incorrect: abstain to/of)',
          'Aim at: Correct: "They aim at improving KPPSC selection." (Incorrect: aim of)',
          'Agree to (proposal) vs. Agree with (person): "I agree with you, but I cannot agree to this scheme."'
        ],
        content: 'Always read sentences aloud. Regular reading develops natural intuitive detection for incorrect structural prepositions.'
      }
    ]
  },
  {
    subject: 'Mathematics',
    iconName: 'Calculator',
    description: 'Quick formula lookup sheets and mental calculation methods for fast-paced competitive math screening.',
    topics: [
      {
        id: 'math-note-1',
        title: 'Percentages & Failure Calculations',
        importance: 'critical',
        estimatedReadTime: 7,
        overview: 'Questions about percentages, profit sharing, and exam failures are standard screening MCQs.',
        keyPoints: [
          'Always identify the total value as 100%.',
          'If a percentage of passes is given (e.g. 35%), the failures must be the remaining (65%).',
          'Establish the algebraic ratio quickly: (Fail % / 100) * X = Fail Count.'
        ],
        formulas: [
          { name: 'Percentage Growth', equation: '((New - Original) / Original) * 100', application: 'To find population growth rates or increase ratios' },
          { name: 'Percentage Value finder', equation: 'X = (Part / Percent) * 100', application: 'Use when the quantity of a partial percentage is known (e.g. 455 failed candidates)' }
        ],
        content: 'Solve first by approximating. If 65% is roughly 450, 100% must be around 700. This eliminates incorrect random choices fast without tedious calculation.'
      },
      {
        id: 'math-note-2',
        title: 'Proportions (Direct & Inverse)',
        importance: 'high',
        estimatedReadTime: 5,
        overview: 'Understand how changing one variable affects another, especially in worker/time relationship problems.',
        keyPoints: [
          'Direct Proportion: More leads to more. Weight of items directly corresponds to price.',
          'Inverse Proportion: More leads to less. Increasing the amount of workers decreases the days taken.',
          'Work constant formula: M1 * D1 * H1 = M2 * D2 * H2'
        ],
        formulas: [
          { name: 'Inverse Proportion constant', equation: 'M1 * D1 = M2 * D2', application: 'Calculating days needed when number of workers change' }
        ],
        content: 'If 15 men take 30 days, 10 men will take MORE days, not less. Always check if your answer is logical before picking a choice.'
      }
    ]
  },
  {
    subject: 'General Knowledge',
    iconName: 'Globe',
    description: 'Syllabus notes regarding International Organizations, world geography, straits, and standard sovereign currencies.',
    topics: [
      {
        id: 'gk-note-1',
        title: 'United Nations Orgs & Headquarters',
        importance: 'critical',
        estimatedReadTime: 6,
        overview: 'GK papers frequently inquire about international headquarters, establishment dates, and current chief names.',
        keyPoints: [
          'Geneva, Switzerland hosts key global watchdogs and health bodies because of Swiss neutrality.',
          'New York holds the primary UN General Assembly and Security Council divisions.',
          'The International Court of Justice (ICJ) is the only principal organ of the UN situated outside New York.'
        ],
        tables: [
          {
            headers: ['Organization', 'Headquarters City', 'Country', 'Establishment Year'],
            rows: [
              ['World Health Organization (WHO)', 'Geneva', 'Switzerland', '1948'],
              ['UNESCO', 'Paris', 'France', '1945'],
              ['International Court of Justice (ICJ)', 'The Hague', 'Netherlands', '1945'],
              ['International Monetary Fund (IMF)', 'Washington D.C.', 'United States', '1944'],
              ['UNICEF', 'New York', 'United States', '1946']
            ]
          }
        ],
        content: 'Pro Tip: If an organization begins with "World" and ends with "Organization" (WHO, WTO, WIPO, WMO), it is almost always headquartered in Geneva.'
      }
    ]
  },
  {
    subject: 'Pakistan Studies',
    iconName: 'Map',
    description: 'Chronological pre-partition freedom struggles, geographies, constitutional histories, and military/treaty timelines.',
    topics: [
      {
        id: 'ps-note-1',
        title: 'Pre-Partition Chronology (1905 - 1947)',
        importance: 'critical',
        estimatedReadTime: 10,
        overview: 'A definitive historical timeline of landmark events starting from the Partition of Bengal to Independence.',
        keyPoints: [
          '1905: Partition of Bengal by Lord Curzon (Annulled in 1911 by Lord Hardinge).',
          '1906: Formation of All India Muslim League at Dacca on Dec 30 (Nawab Salimullah founder).',
          '1916: Lucknow Pact - Joint Muslim-Hindu separate electorate consensus negotiated by Jinnah.',
          '1930: Allama Iqbal\'s historic Allahabad Address proposing a northwestern Muslim state.',
          '1933: Name "Pakistan" coined by Choudhry Rahmat Ali in his pamphlet "Now or Never".',
          '1940: Passage of the Lahore Resolution on March 23rd at Minto Park.',
          '1947: Lord Mountbatten\'s 3rd June Plan leading to partition and the Independence Act.'
        ],
        content: 'These milestone dates are heavily tested in ETEA & KPPSC screening exams. Master the chronological timeline to tackle historical MCQs with ease.'
      },
      {
        id: 'ps-note-2',
        title: 'Pakistan Identity, Geography & Critical Facts',
        importance: 'critical',
        estimatedReadTime: 7,
        overview: 'High-yield guide covering official national symbols, land boundaries, highest peaks, and major river basins.',
        keyPoints: [
          'National Symbols: Markhor (Official Animal), Jasmine (Flower), Chukar Partridge (Bird), Deodar (Tree), Mango (Fruit).',
          'Capital Transit: Islamabad was made Capital in 1967. Karachi was the first capital from 1947–1958.',
          'Active Frontiers: Borders include Afghanistan (Durand Line, 2430km), Iran (909km), China, India, and 1046km of Arabian Sea Coastline.',
          'K-2 (Mount Godwin-Austen): 8,611m (2nd highest globally) based in Gilgit-Baltistan within the Karakoram Range.',
          'Indus Water Treaty (1960): Brokered by World Bank - Western rivers (Indus, Jhelum, Chenab) to Pak; Eastern rivers (Ravi, Beas, Sutlej) to India.'
        ],
        tables: [
          {
            headers: ['Emblem Type', 'Designated Symbol', 'Scientific Name'],
            rows: [
              ['National Mammal', 'Markhor', 'Capra falconeri'],
              ['National Flora', 'Jasmine', 'Jasminum officinale'],
              ['National Tree', 'Deodar Cedar', 'Cedrus deodara'],
              ['National Avian', 'Chukar Partridge', 'Alectoris chukar']
            ]
          }
        ],
        content: 'FATA (Federally Administered Tribal Areas) was formally merged with Khyber Pakhtunkhwa province in May 2018 via the 25th Constitutional Amendment.'
      },
      {
        id: 'ps-note-3',
        title: 'Founders, Profiles & Political Leaders',
        importance: 'critical',
        estimatedReadTime: 8,
        overview: 'Key milestones in the leadership journeys of Jinnah, Liaquat Ali Khan, Fatima Jinnah, and Benazir Bhutto.',
        keyPoints: [
          'Muhammad Ali Jinnah: Born Dec 25, 1876 in Karachi; joined Muslim League in 1913; left Congress in 1920; served as 1st Governor-General.',
          'Liaquat Ali Khan: 1st Prime Minister (1947-1951); proposed the Objectives Resolution; assassinated in Rawalpindi (Liaquat Bagh) in October 1951.',
          'Fatima Jinnah: Famously designated "Madar-e-Millat" (Mother of the Nation); contested the 1965 presidential election against Ayub Khan.',
          'Benazir Bhutto: First female Prime Minister of a Muslim state (1s term: 1988-1990; 2nd term: 1993-1996); assassinated in December 2007.'
        ],
        content: 'The celebrated title "Ambassador of Hindu-Muslim Unity" was conferred upon Jinnah by Congress leader Sarojini Naidu in 1916.'
      },
      {
        id: 'ps-note-4',
        title: 'Constitutional History & Key Amendments',
        importance: 'critical',
        estimatedReadTime: 8,
        overview: 'A deep comparative study of the historical 1956, 1962, and active 1973 supreme constitutions.',
        keyPoints: [
          'Interim Charter: The Government of India Act 1935 was adapted to serve as the temporary constitution from 1947 to 1956.',
          '1956 Constitution: Implemented March 23, 1956; established Pakistan as an Islamic Republic with a parliamentary system.',
          '1962 Constitution: Promulgated under President Ayub Khan; set up a centralized presidential governing apparatus.',
          '1973 Constitution: Current governing document; drafted under Z.A. Bhutto; passed April 10 and enforced on August 14, 1973.',
          '18th Amendment (2010): Devolution of central ministry powers to provinces, abolished concurrently listed items, renamed NWFP to KPK.'
        ],
        content: 'Objectives Resolution (March 12, 1949): Under Liaquat Ali Khan, it defined sovereignty belonging to Allah. Integrated into the constitution via Article 2A.'
      },
      {
        id: 'ps-note-5',
        title: 'Heads of State & Government timelines',
        importance: 'medium',
        estimatedReadTime: 6,
        overview: 'Comprehensive tables listing the key historical figures dominating executive leadership since 1947.',
        keyPoints: [
          'The country was served by 4 consecutive Governors-General between 1947 and 1956 before the presidential model took hold.',
          'Iskander Mirza was both the final Governor-General and the inaugural President under the 1956 charter.',
          'Ayub Khan declared the first formal national Martial Law in October 1958, sending Iskander Mirza into exile.'
        ],
        tables: [
          {
            headers: ['Governor-General', 'Service Window', 'Key Focus'],
            rows: [
              ['Muhammad Ali Jinnah', '1947 - 1948', 'Pivotal independence settlement'],
              ['Khawaja Nazimuddin', '1948 - 1951', 'Stabilized state after Jinnah\'s demise'],
              ['Ghulam Muhammad', '1951 - 1955', 'Dissolved first constituent assembly'],
              ['Iskander Mirza', '1955 - 1956', 'Transitioned office to President role']
            ]
          }
        ],
        content: 'Benazir Bhutto represents the first female Prime Minister, while Shehbaz Sharif and Asif Ali Zardari currently lead the state apparatus.'
      },
      {
        id: 'ps-note-6',
        title: 'Economy, National Resources & CPEC',
        importance: 'high',
        estimatedReadTime: 7,
        overview: 'Analyzing high-yield industrial exports, agricultural contributions, Gwadar deep-sea port, and CPEC corridors.',
        keyPoints: [
          'GDP share: Agriculture contributes approx. 24% of national GDP; wheat (staple food) and cotton (primary cash crop).',
          'Sialkot: Global production powerhouse; crafts ~80% of world supply of high-grade hand-stitched soccer balls and surgical tools.',
          'CPEC: China-Pakistan Economic Corridor consisting of energy networks and transit roads terminating at Gwadar port in Balochistan.',
          'Export Lead: Textiles and ready-made garments make up over 60% of Pakistan’s gross export receipts.'
        ],
        content: 'Dr. Abdus Salam was Pakistan\'s first Nobel Laureate, winning the Nobel Prize in Physics in 1979 for Electroweak Unification Theory.'
      },
      {
        id: 'ps-note-7',
        title: 'Military Conflicts, Treaties & 1971 Crisis',
        importance: 'high',
        estimatedReadTime: 9,
        overview: 'Chronicle of major boundary demarcations, territorial defense actions, and Soviet/UN-mediated treaties.',
        keyPoints: [
          'Radcliffe Boundary: The border lines were laid in August 1947 by Sir Cyril Radcliffe (Radcliffe Award published Aug 17).',
          '1965 War: Initiated in September; resolved via the Soviet-mediated "Tashkent Agreement" signed in January 1966.',
          '1971 War: Ended on December 16, 1971 with the separation of East Pakistan, culminating in the birth of Bangladesh.',
          'Shimla Agreement (1972): Bilateral treaty between Z.A. Bhutto and Indira Gandhi; redesignated the Ceasefire Line into the Line of Control.',
          'Kargil war (1999): High-altitude border clash along the Kargil heights in Kashmir, ending under US-backed pressure.'
        ],
        content: 'Defence Day: Pakistan marks September 6 annually to pay tribute to military veterans who defended the country in the 1965 war.'
      },
      {
        id: 'ps-note-8',
        title: 'Nuclear deterrence & Chagai-I Milestones',
        importance: 'critical',
        estimatedReadTime: 6,
        overview: 'Chronicling the steps leading to independent nuclear capabilities in response to regional defense threats.',
        keyPoints: [
          'Pokhran Response: Detonated 5 underground nuclear tests on May 28, 1998 and 1 on May 30, 1998 in response to Indian efforts.',
          'Testing locations: Drills were operated within the remote Chagai Hills (Ras Koh Mountains) in Balochistan province.',
          'Dr. A.Q. Khan: Universally recognized as the father of Pakistan\'s atomic weapons and uranium gas centrifuge programs.',
          'Youm-e-Takbeer: Celeberated on May 28 annually to honor the achievement of becoming the 7th nuclear capable world power.'
        ],
        content: 'Nuclear status: To date, Pakistan remains the first and only Muslim-majority state possessing active, tested nuclear warheads.'
      },
      {
        id: 'ps-note-9',
        title: 'Foreign Relations & World Organizations',
        importance: 'medium',
        estimatedReadTime: 7,
        overview: 'Detailing Pakistan\'s alignments across international bodies, early security treaties, and diplomatic positions.',
        keyPoints: [
          'UN Enrollment: Enrolled as an official member of the United Nations on September 30, 1947.',
          'OIC (Organisation of Islamic Cooperation): Founding member in 1969; hosted the historic 2nd OIC Summit at Lahore in 1974.',
          'SCO (Shanghai Cooperation Organisation): Acquired full sovereign membership in June 2017.',
          'Cold War Alliances: Joined US-backed global defense pacts SEATO (1954) and CENTO (1955) to secure regional assistance.'
        ],
        tables: [
          {
            headers: ['Organization', 'Manner of Membership', 'Strategic Value'],
            rows: [
              ['United Nations (UN)', 'Admitted 30 Sep 1947', 'Sovereign representation and border lobbies'],
              ['OIC', 'Founding Member (1969)', 'Strong leadership among Islamic coalition states'],
              ['SAARC', 'Founding Member (1985)', 'Regional trading agreements and South Asia cooperation'],
              ['SCO', 'Full Member (2017)', 'Central Asia counter-terrorism and economic alignments'],
              ['ECO', 'Founding Member (1985)', 'Trilateral trade lanes with Turkey and Iran']
            ]
          }
        ],
        content: 'Despite several US collaborations, Pakistan is non-member to NATO, maintaining a non-NATO security ally status designation instead.'
      }
    ]
  },
  {
    subject: 'Computer Science',
    iconName: 'Cpu',
    description: 'Review core concepts in database management systems, data structures, and OSI networking models.',
    topics: [
      {
        id: 'cs-note-1',
        title: 'OSI 7-Layer Reference Model',
        importance: 'high',
        estimatedReadTime: 8,
        overview: 'Understand how packet headers and payloads are packaged from physical signals to interactive user applications.',
        keyPoints: [
          'Layer 7 (Application): HTTP, DNS, FTP. User-interaction interfaces.',
          'Layer 4 (Transport): TCP/UDP ports, flow control, segments.',
          'Layer 3 (Network): IPs, ICMP routing, virtual packets.',
          'Layer 2 (Data Link): Media Access Control (MAC) addresses, frames, switches.',
          'Layer 1 (Physical): Cables, hubs, bits, electronic signals.'
        ],
        content: 'Remember the classic acronym to order layers from bottom to top: "Please Do Not Throw Sausage Pizza Away" (Physical, Data Link, Network, Transport, Session, Presentation, Application).'
      }
    ]
  }
];
