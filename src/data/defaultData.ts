/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MCQ, VocabWord } from '../types';

export const DEFAULT_MCQS: MCQ[] = [
  // --- Computer Science ---
  {
    id: "9a6e1106-cf4c-47bc-ad74-884814d48d56",
    question: "Which of the following is the fastest protocol used to transfer files over local or wide area networks?",
    options: ["FTP (File Transfer Protocol)", "HTTP (Hypertext Transfer Protocol)", "TFTP (Trivial File Transfer Protocol)", "SFTP (Secure File Transfer Protocol)"],
    correctAnswer: 3,
    explanation: "SFTP (Secure File Transfer Protocol) or FTP are dedicated transfer protocols, but in modern networks, SFTP provides the highest security along with optimized packet pipelines. TFTP is simpler but slower due to tiny block buffers.",
    category: "Computer Science",
    subcategory: "Networking",
    examType: "ETEA IT Officer 2023",
    isRepeated: true,
    repeatCount: 4,
    importance: "high"
  },
  {
    id: "a4f21db5-eb07-4a0d-85ad-2900ea903960",
    question: "What is the size of an IPv6 address?",
    options: ["32 bits", "64 bits", "128 bits", "256 bits"],
    correctAnswer: 2,
    explanation: "An IPv6 address consists of 128 bits (16 octets), written in hexadecimal and separated by colons, which provides a massive address space compared to IPv4's 32-bit ceiling.",
    category: "Computer Science",
    subcategory: "Networking",
    examType: "KPPSC Lecturer CS 2022",
    isRepeated: true,
    repeatCount: 6,
    importance: "high"
  },
  {
    id: "fce46eb9-cdde-45c1-8408-bd974d6c4d7e",
    question: "Which data structure works on the LIFO (Last In First Out) principle?",
    options: ["Queue", "Stack", "Linked List", "Binary Tree"],
    correctAnswer: 1,
    explanation: "A Stack operates on the LIFO (Last In First Out) principle, where the last element inserted is the first to be retrieved (using push and pop operations). Queues operate on FIFO.",
    category: "Computer Science",
    subcategory: "Data Structures",
    examType: "FIA Sub-Inspector 2021",
    isRepeated: false,
    importance: "medium"
  },
  {
    id: "85beeb5c-5fb2-4752-9ea8-654dbdb189c4",
    question: "In database management systems, which key is used to establish relationship between two tables?",
    options: ["Primary Key", "Foreign Key", "Candidate Key", "Super Key"],
    correctAnswer: 1,
    explanation: "A Foreign Key is a field (or collection of fields) in one table that uniquely identifies a row of another table, forming a standard relational link between them.",
    category: "Computer Science",
    subcategory: "DBMS",
    examType: "ETEA Computer Operator 2022",
    isRepeated: true,
    repeatCount: 3,
    importance: "high"
  },
  {
    id: "5101037f-ec73-455b-b9d9-5f214690e80a",
    question: "Which layer of the OSI model is responsible for routing packets across different networks?",
    options: ["Data Link Layer", "Transport Layer", "Network Layer", "Physical Layer"],
    correctAnswer: 2,
    explanation: "The Network Layer (Layer 3) is responsible for packet routing, logical addressing (IP addresses), and path determination.",
    category: "Computer Science",
    subcategory: "Networking",
    examType: "KPPSC Subject Specialist 2024",
    isRepeated: true,
    repeatCount: 5,
    importance: "high"
  },

  // --- Pakistan Studies ---
  {
    id: "40cc8c0e-d1b4-4b53-b09e-05e80931505c",
    question: "Who was the first President of the Constituent Assembly of Pakistan?",
    options: ["Quaid-e-Azam Muhammad Ali Jinnah", "Liaquat Ali Khan", "Maulvi Tamizuddin", "Iskander Mirza"],
    correctAnswer: 0,
    explanation: "Quaid-e-Azam Muhammad Ali Jinnah was elected as the first President of the Constituent Assembly of Pakistan on August 11, 1947, and Liaquat Ali Khan was the first Prime Minister.",
    category: "Pakistan Studies",
    subcategory: "Early History",
    examType: "KPPSC Tehsildar 2021",
    isRepeated: true,
    repeatCount: 5,
    importance: "high"
  },
  {
    id: "299d2572-c2cb-46a4-8ef8-cc5ec93dfc57",
    question: "The highest mountain peak of Pakistan, K2, is located in which mountain range?",
    options: ["Himalayas", "Karakoram Range", "Hindu Kush", "Sulaiman Range"],
    correctAnswer: 1,
    explanation: "K2 (Godwin-Austen), the second highest peak in the world (8,611m), is located in the Karakoram Mountain Range in Gilgit-Baltistan.",
    category: "Pakistan Studies",
    subcategory: "Geography",
    examType: "ETEA Junior Clerk 2023",
    isRepeated: true,
    repeatCount: 8,
    importance: "high"
  },
  {
    id: "d58f3319-3db6-47b2-9d32-d1d789069a30",
    question: "In which year was the famous Lahore Resolution (Pakistan Resolution) passed?",
    options: ["1930", "1937", "1940", "1947"],
    correctAnswer: 2,
    explanation: "The Lahore Resolution was passed on March 23, 1940, at Minto Park (now Iqbal Park), Lahore, presenting the formal demand for a separate homeland for Muslims.",
    category: "Pakistan Studies",
    subcategory: "Freedom Movement",
    examType: "FIA Inspector Legal 2020",
    isRepeated: true,
    repeatCount: 7,
    importance: "high"
  },
  {
    id: "c0993092-23c8-47fb-b472-7634f19b2a65",
    question: "Who authored the famous book 'The Making of Pakistan'?",
    options: ["K.K. Aziz", "I.H. Qureshi", "Chaudhry Muhammad Ali", "Ayesha Jalal"],
    correctAnswer: 0,
    explanation: "K.K. Aziz (Khursheed Kamal Aziz) wrote 'The Making of Pakistan: A Study in Nationalism', which deals extensively with the historical elements of the subcontinental split.",
    category: "Pakistan Studies",
    subcategory: "Literature",
    examType: "KPPSC PMS 2019",
    isRepeated: false,
    importance: "medium"
  },
  {
    id: "f72365bb-d18e-4a67-9b27-5d07010a01cc",
    question: "Which is the longest river in Pakistan?",
    options: ["Jhelum River", "Chenab River", "Ravi River", "Indus River"],
    correctAnswer: 3,
    explanation: "The Indus River is the longest river in Pakistan, stretching roughly 3,180 km from its source in Tibet down to its delta in the Arabian Sea.",
    category: "Pakistan Studies",
    subcategory: "Geography",
    examType: "ETEA PST 2023",
    isRepeated: true,
    repeatCount: 4,
    importance: "high"
  },

  // --- English ---
  {
    id: "87317e3f-67ee-4bdf-87f5-ee1f3918a2bc",
    question: "Fill in the blank with the correct preposition: 'He is proficient ________ several programming languages.'",
    options: ["at", "in", "with", "of"],
    correctAnswer: 1,
    explanation: "The adjective 'proficient' is idiomatically followed by 'in' (proficient in speaking English, proficient in coding).",
    category: "English",
    subcategory: "Prepositions",
    examType: "ETEA SST General 2024",
    isRepeated: true,
    repeatCount: 3,
    importance: "high"
  },
  {
    id: "e99a1cb0-c533-4f9b-bd5e-6345ec41b0fc",
    question: "Identify the antonym of the word 'EPHEMERAL'.",
    options: ["Transient", "Short-lived", "Permanent", "Fleeting"],
    correctAnswer: 2,
    explanation: "Ephemeral means lasting for a very short time. Therefore, its direct antonym is 'Permanent'. 'Transient' and 'Fleeting' are synonyms.",
    category: "English",
    subcategory: "Vocabulary",
    examType: "KPPSC ASST Director 2022",
    isRepeated: true,
    repeatCount: 5,
    importance: "high"
  },
  {
    id: "7636e05d-cc45-42a9-b425-b072f8de38a3",
    question: "Choose the correct sentence structure:",
    options: [
      "If he would have worked hard, he would pass the exam.",
      "If he had worked hard, he would have passed the exam.",
      "If he worked hard, he would have pass the exam.",
      "If he has worked hard, he will passed the exam."
    ],
    correctAnswer: 1,
    explanation: "This is a Third Conditional sentence. The structure requires: 'If + past perfect, would + have + past participle'. Option B fits this perfectly.",
    category: "English",
    subcategory: "Grammar",
    examType: "FIA Inspector 2022",
    isRepeated: true,
    repeatCount: 4,
    importance: "high"
  },
  {
    id: "5ab70b8a-b9c2-4db1-8636-6e415ef48a3e",
    question: "What is the meaning of the idiom 'To burn the midnight oil'?",
    options: ["To cause an accidental fire", "To work or study late into the night", "To waste precious fuels", "To express deep operational anger"],
    correctAnswer: 1,
    explanation: "The idiom 'To burn the midnight oil' means to stay up late working or studying, commonly used for hardworking students during examination preparation.",
    category: "English",
    subcategory: "Idioms",
    examType: "ETEA Senior Clerk 2021",
    isRepeated: false,
    importance: "medium"
  },

  // --- General Knowledge ---
  {
    id: "a1bb4021-d7fe-41dc-accd-b4ec3c2ea8ef",
    question: "Which of the following international organizations has its headquarters in Geneva, Switzerland?",
    options: ["UNESCO", "International Court of Justice (ICJ)", "World Health Organization (WHO)", "International Monetary Fund (IMF)"],
    correctAnswer: 2,
    explanation: "The World Health Organization (WHO) is headquartered in Geneva, Switzerland. UNESCO is in Paris, ICJ is in The Hague, and IMF is in Washington, D.C.",
    category: "General Knowledge",
    subcategory: "International Orgs",
    examType: "KPPSC Planning Officer 2021",
    isRepeated: true,
    repeatCount: 7,
    importance: "high"
  },
  {
    id: "c3bf68a4-0ef6-4f40-8b42-d1c9ef005efc",
    question: "Which is the largest ocean in the world?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3,
    explanation: "The Pacific Ocean is the largest and deepest of Earth's oceanic divisions, covering more than 30% of the Earth's surface.",
    category: "General Knowledge",
    subcategory: "Geography",
    examType: "ETEA Police Constable 2023",
    isRepeated: true,
    repeatCount: 9,
    importance: "high"
  },
  {
    id: "9aee9bc7-6ecb-439f-bd96-3ef1a196ecf9",
    question: "The currency of Turkey is named ________.",
    options: ["Dinar", "Euro", "Lira", "Riyal"],
    correctAnswer: 2,
    explanation: "The official currency of the Republic of Turkey is the Turkish Lira.",
    category: "General Knowledge",
    subcategory: "Currencies",
    examType: "FIA Assistant Sub-Inspector 2023",
    isRepeated: true,
    repeatCount: 5,
    importance: "high"
  },
  {
    id: "bdab728e-5b12-4217-bfde-e16e09ebef5a",
    question: "Which country is called the 'Land of the Midnight Sun'?",
    options: ["Japan", "Norway", "Finland", "Iceland"],
    correctAnswer: 1,
    explanation: "Norway is famously known as the Land of the Midnight Sun because parts of the country lie north of the Arctic Circle, where the sun remains visible for 24 hours in midsummer.",
    category: "General Knowledge",
    subcategory: "Geography",
    examType: "KPPSC Tehsildar 2022",
    isRepeated: true,
    repeatCount: 4,
    importance: "medium"
  },

  // --- Mathematics (Arithmetic, Percentages, Ratios, Speed & Algebra) ---
  {
    id: "df6b04ec-24e0-4ad7-8db1-4e78a69bf2cc",
    question: "In a screening test, 35% of the candidates passed and 455 candidates failed. What was the total number of candidates who appeared in the exam?",
    options: ["650", "700", "750", "800"],
    correctAnswer: 1,
    explanation: "If 35% passed, then 65% failed (100% - 35%). Let the total candidates be X. So, 65% of X = 455 => 0.65 * X = 455 => X = 455 / 0.65 = 700.",
    category: "Mathematics",
    subcategory: "Percentages",
    examType: "ETEA SST General 2023",
    isRepeated: true,
    repeatCount: 5,
    importance: "high"
  },
  {
    id: "7a52bbcd-20fa-40ea-9b88-cb94d75d658c",
    question: "A train 120 meters long passes a telegraph post in 6 seconds. What is the speed of the train in km/h?",
    options: ["54 km/h", "72 km/h", "80 km/h", "90 km/h"],
    correctAnswer: 1,
    explanation: "Speed = Distance / Time = 120m / 6s = 20 m/s. To convert m/s to km/h, multiply by 18/5: 20 * (18/5) = 72 km/h.",
    category: "Mathematics",
    subcategory: "Speed & Distance",
    examType: "KPPSC Tehsildar 2022",
    isRepeated: true,
    repeatCount: 3,
    importance: "high"
  },
  {
    id: "8e9c614b-2f3b-4886-ac15-d227c8ff6a99",
    question: "The average of five consecutive odd numbers is 61. What is the highest of these five numbers?",
    options: ["61", "63", "65", "67"],
    correctAnswer: 2,
    explanation: "Let the consecutive odd numbers be: x-4, x-2, x, x+2, x+4. Their average is x = 61. The highest number is x+4 = 61+4 = 65. (Numbers are 57, 59, 61, 63, 65).",
    category: "Mathematics",
    subcategory: "Averages & Algebra",
    examType: "CSS General Ability 2021",
    isRepeated: false,
    importance: "medium"
  },
  {
    id: "844cc9ee-a83a-4aeb-a029-41718bf7ee2a",
    question: "If 15 men can perform a task in 30 days, how many days will 10 men take to complete the exact same task?",
    options: ["20 days", "40 days", "45 days", "50 days"],
    correctAnswer: 2,
    explanation: "This is a case of inverse proportion (men * days = total work constant). M1 * D1 = M2 * D2 => 15 * 30 = 10 * D2 => 450 = 10 * D2 => D2 = 45 days.",
    category: "Mathematics",
    subcategory: "Proportions & Ratios",
    examType: "ETEA Junior Clerk 2024",
    isRepeated: true,
    repeatCount: 6,
    importance: "high"
  },
  {
    id: "3df71fb2-b7ce-4bb0-b74c-47b2ff9222c5",
    question: "If a right-angled triangle has bases of 6cm and 8cm, what is its hypotenuse length, and what is its area?",
    options: ["Hypotenuse 10cm, Area 24 cm²", "Hypotenuse 12cm, Area 48 cm²", "Hypotenuse 10cm, Area 48 cm²", "Hypotenuse 14cm, Area 24 cm²"],
    correctAnswer: 0,
    explanation: "By Pythagoras Theorem, Hypotenuse² = Base² + Altitude² = 6² + 8² = 36 + 64 = 100 => Hypotenuse = 10cm. Area = 0.5 * base * height = 0.5 * 6 * 8 = 24 cm².",
    category: "Mathematics",
    subcategory: "Geometry",
    examType: "KPPSC Subject Specialist 2023",
    isRepeated: true,
    repeatCount: 4,
    importance: "high"
  }
];

export const DEFAULT_VOCAB: VocabWord[] = [
  {
    id: "vocab-1",
    word: "Pragmatic",
    meaning: "Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.",
    urduMeaning: "عملی / حقیقت پسندانہ (Amli / Haqeeqat-pasandana)",
    synonyms: ["practical", "matter-of-fact", "realistic", "utilitarian"],
    antonyms: ["idealistic", "unrealistic", "impractical", "visionary"],
    example: "The tehsildar took a pragmatic approach to resolve the boundary dispute between the two groups, settling it with mutual concessions.",
    isBookmarked: false,
    category: "General Vocabulary"
  },
  {
    id: "vocab-2",
    word: "Anachronism",
    meaning: "A thing belonging or appropriate to a period other than that in which it exists, especially a thing that is conspicuously old-fashioned.",
    urduMeaning: "عہدی غلطی / بے وقت چیز (Zamana ghalati / Be-waqt chiz)",
    synonyms: ["misplacement", "prochronism", "parachronism", "solecism"],
    antonyms: ["contemporary", "modernity", "synchronism"],
    example: "Using a slide rule for calculations in a computer operator exam is a total anachronism in this modern era.",
    isBookmarked: false,
    category: "CSS Vocab"
  },
  {
    id: "vocab-3",
    word: "Ameliorate",
    meaning: "Make (something bad or unsatisfactory) better.",
    urduMeaning: "بہتر بنانا / سدھارنا (Behtar banana / Sudharna)",
    synonyms: ["improve", "better", "enhance", "upgrade", "ease"],
    antonyms: ["worsen", "deteriorate", "exacerbate", "damage"],
    example: "The new administration took serious initiatives to ameliorate the standard of kppsc selection standards.",
    isBookmarked: true,
    category: "CSS Vocab"
  },
  {
    id: "vocab-4",
    word: "Obfuscate",
    meaning: "Render obscure, unclear, or unintelligible.",
    urduMeaning: "گول مول کرنا / دھندلا دینا (Gool mool karna / Dhundla dena)",
    synonyms: ["confound", "muddle", "blur", "complicate", "darken"],
    antonyms: ["clarify", "lucidate", "explain", "simplify"],
    example: "The developer's explanation only served to obfuscate the real issues inside the network protocol.",
    isBookmarked: false,
    category: "Computer Science Vocab"
  },
  {
    id: "vocab-5",
    word: "Capricious",
    meaning: "Given to sudden and unaccountable changes of mood or behavior.",
    urduMeaning: "من موجی / غیر مستقل مزاج (Man-mauji / Ghayr-mustaqil)",
    synonyms: ["fickle", "inconstant", "volatile", "arbitrary", "unpredictable"],
    antonyms: ["stable", "consistent", "predictable", "constant"],
    example: "Due to the capricious weather in the Karakoram range, climbers were advised to freeze ascending plans immediately.",
    isBookmarked: false,
    category: "General Vocabulary"
  },
  {
    id: "vocab-6",
    word: "Fastidious",
    meaning: "Very attentive to and concerned about accuracy and detail.",
    urduMeaning: "نکتہ چیں / باریک بین / شکی مزاج (Bareek-been / Nuktah-cheen)",
    synonyms: ["scrupulous", "meticulous", "exacting", "finicky", "demanding"],
    antonyms: ["lax", "careless", "easygoing", "indifferent"],
    example: "He was fastidious about grammar rules in his CSS descriptive essays, securing top coordinates in English.",
    isBookmarked: false,
    category: "CSS Vocab"
  },
  {
    id: "vocab-7",
    word: "Ephemeral",
    meaning: "Lasting for a very short time.",
    urduMeaning: "عارضی / فانی / عجلت پسند (Aari-zee / Fani / Chand roza)",
    synonyms: ["transient", "fleeting", "momental", "evanescent", "passing"],
    antonyms: ["everlasting", "perpetual", "eternal", "permanent"],
    example: "The pleasure of cramming random GK papers is ephemeral; only daily pragmatic prep secures a regular seat.",
    isBookmarked: false,
    category: "General Vocabulary"
  },
  {
    id: "vocab-8",
    word: "Abstain",
    meaning: "Formally decline to vote either for or against a proposal, or restrain oneself from doing something.",
    urduMeaning: "پریز کرنا / دور رہنا / باز رہنا (Parhez karna / Baaz rehna)",
    synonyms: ["refrain", "desist", "forgo", "avoid", "shun"],
    antonyms: ["indulge", "partake", "participate", "embrace"],
    example: "Candidates should abstain from bringing any electronic calculators into the ETEA inspection facilities.",
    isBookmarked: false,
    category: "General Vocabulary"
  },
  {
    id: "acronym-1",
    word: "CPEC",
    meaning: "China-Pakistan Economic Corridor - A multi-billion dollar bilateral infrastructure, energy, and trade route development initiative linking Gwadar port to Xinjiang, China.",
    urduMeaning: "پاک چین اقتصادی راہداری (Pak-China Iqtisadi Rahdari)",
    synonyms: ["economic corridor", "strategic trade link", "bilateral gateway", "regional connectivity"],
    antonyms: ["isolationism", "trade barrier"],
    example: "CPEC remains a frequently tested topic in current affairs essays for both KPPSC and CSS examinations.",
    isBookmarked: false,
    category: "Exam Acronym"
  },
  {
    id: "acronym-2",
    word: "FATF",
    meaning: "Financial Action Task Force - An intergovernmental organisation founded to develop policies to combat money laundering and terrorism financing.",
    urduMeaning: "فنانشل ایکشن ٹاسک فورس (Financial Action Task Force)",
    synonyms: ["global financial monitor", "anti-money laundering body", "financial watchdog"],
    antonyms: [],
    example: "Questions about Pakistan's listing and progress in FATF are regular features in ETEA and FIA papers.",
    isBookmarked: false,
    category: "Exam Acronym"
  },
  {
    id: "acronym-3",
    word: "KPPSC",
    meaning: "Khyber Pakhtunkhwa Public Service Commission - The principal provincial agency responsible for conducting recruitment examinations for civil service positions.",
    urduMeaning: "خیبر پختونخوا پبلک سروس کمیشن (Khyber Pakhtunkhwa Public Service Commission)",
    synonyms: ["provincial commission", "selection agency", "provincial recruitment desk"],
    antonyms: [],
    example: "KPPSC candidates master descriptive essays and negative marking guidelines to secure gazetted appointments.",
    isBookmarked: false,
    category: "Exam Acronym"
  },
  {
    id: "acronym-4",
    word: "ETEA",
    meaning: "Educational Testing and Evaluation Agency - An autonomous testing authority in Khyber Pakhtunkhwa established to ensure transparency in academic admissions and public jobs.",
    urduMeaning: "ایجوکیشنل ٹیسٹنگ اینڈ ایویلیوایشن ایجنسی (Educational Testing and Evaluation Agency)",
    synonyms: ["provincial testing service", "evaluation agency", "testing authority"],
    antonyms: [],
    example: "Practicing repeated past MCQs is the golden secret to cracking ETEA competitive screening tests.",
    isBookmarked: false,
    category: "Exam Acronym"
  },
  {
    id: "acronym-5",
    word: "CSS",
    meaning: "Central Superior Services - The highly competitive federal elite civil service system of Pakistan, recruiting top personnel through intensive annual examinations.",
    urduMeaning: "سینٹرل سپیریئر سروسز / وفاقی سول سروس (Central Superior Services)",
    synonyms: ["federal bureaucracy", "elite civil service", "bureaucratic screening"],
    antonyms: [],
    example: "Securing a top rank in the CSS requires outstanding command over English composition and analytical current affairs.",
    isBookmarked: false,
    category: "Exam Acronym"
  }
];
