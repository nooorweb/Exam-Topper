-- ============================================================
-- Exam Topper — MCQ Seed Data (AI Generated Batch 1)
-- Run AFTER supabase_schema.sql in the Supabase SQL Editor
-- Total: 60 MCQs (10 per subject) — KPPSC, ETEA, FIA, FPSC, CSS, NTS
-- Validated: UUIDs unique, correct_answer 0-3, apostrophes escaped
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. English MCQs  →  english_mcqs
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.english_mcqs (id, question, options, correct_answer, explanation, subcategory, exam_type, difficulty, is_repeated, repeat_count, importance, is_public)
VALUES
  ('c8e23f1a-b6d9-43c2-a7e8-f9b12d3c4e5a',
   'Choose the correct synonym for the word ''SYCOPHANT''.',
   '["Critic","Flatterer","Leader","Rebel"]',
   1,
   '''Sycophant'' refers to a person who acts obsequiously toward someone important in order to gain advantage. ''Flatterer'' is the exact synonym. A ''Critic'' evaluates, a ''Leader'' commands, and a ''Rebel'' resists.',
   'Vocabulary', 'KPPSC Assistant Sub-Inspector 2023', 'high', true, 4, 'high', true),

  ('d7a12e3b-c5f8-44d1-b8f9-e0a23c4d5e6b',
   'Fill in the blank with the appropriate preposition: ''The suspect was accused ________ stealing the classified documents.''',
   '["for","with","of","about"]',
   2,
   'In English grammar, the verb ''accused'' is always followed by the preposition ''of''. ''Accused for'' or ''accused with'' are grammatically incorrect constructions.',
   'Prepositions', 'ETEA Computer Operator 2024', 'medium', true, 6, 'high', true),

  ('e6b23f4c-d4a9-45e2-c9a0-f1b34d5e6f7c',
   'Identify the grammatically correct sentence.',
   '["Had I known you were coming, I would have baked a cake.","Had I know you were coming, I would have baked a cake.","If I had known you was coming, I would bake a cake.","Had I knew you were coming, I would have baked a cake."]',
   0,
   'This is a third conditional inversion. The correct structure is ''Had + subject + past participle (known)... would + have + past participle (baked)''. Option A perfectly follows this rule.',
   'Sentence Correction', 'FIA Sub-Inspector 2023', 'high', true, 5, 'high', true),

  ('f5c34e5d-e3b0-46f3-d0b1-a2c45e6f7a8d',
   'What does the idiom ''Apple of discord'' mean?',
   '["A delicious fruit","A cause of dispute or argument","A sign of true love","A peaceful resolution"]',
   1,
   'The idiom ''Apple of discord'' originates from Greek mythology (the golden apple that caused the Trojan War) and means the core cause of a dispute or argument.',
   'Idioms & Phrases', 'ETEA SST General 2024', 'medium', true, 3, 'medium', true),

  ('a4d45f6e-f2c1-47a4-e1c2-b3d56f7a8b9e',
   'Choose the exact antonym for the word ''LACONIC''.',
   '["Brief","Concise","Voluble","Terse"]',
   2,
   '''Laconic'' means using very few words. ''Brief'', ''Concise'', and ''Terse'' are all synonyms. ''Voluble'' means talking fluently, readily, or incessantly, making it the correct antonym.',
   'Vocabulary', 'CSS English 2022', 'high', false, 0, 'high', true),

  ('b3e56a7f-a1d2-48b5-f2d3-c4e67a8b9c0f',
   'Change into Indirect Speech: He said, ''I have passed the physical test.''',
   '["He said that he passed the physical test.","He said that he has passed the physical test.","He said that he had passed the physical test.","He said he had pass the physical test."]',
   2,
   'When the reporting verb is in the past tense (said), the present perfect tense (have passed) inside the quotation marks changes to past perfect (had passed).',
   'Grammar', 'KPPSC Assistant Sub-Inspector 2022', 'medium', true, 4, 'high', true),

  ('c2f67b8a-b0e3-49c6-a3e4-d5f78b9c0d1a',
   'Change the voice: ''The committee is reviewing the exam syllabus.''',
   '["The exam syllabus is reviewed by the committee.","The exam syllabus is being reviewed by the committee.","The exam syllabus was being reviewed by the committee.","The exam syllabus has been reviewed by the committee."]',
   1,
   'For present continuous active voice (is reviewing), the passive voice must include ''is/are + being + past participle''. Therefore, ''is being reviewed'' is the correct conversion.',
   'Grammar', 'ETEA Computer Operator 2023', 'medium', true, 2, 'medium', true),

  ('d1a78c9b-c9f4-4ad7-b4f5-e6a89c0d1e2b',
   'Which one word perfectly substitutes the phrase: ''A person who hates women''?',
   '["Misanthrope","Philanthropist","Misogynist","Polygamist"]',
   2,
   'A ''Misogynist'' is someone who hates women. A ''Misanthrope'' hates all humanity. A ''Philanthropist'' loves humanity and does charity. A ''Polygamist'' has multiple spouses.',
   'One Word Substitution', 'FPSC Inspector 2023', 'high', true, 5, 'high', true),

  ('e0b89d0c-d8a5-4be8-c5a6-f7b90d1e2f3c',
   'Fill in the blank: ''Each of the candidates ________ given a unique identification number.''',
   '["were","are","was","have been"]',
   2,
   'The phrase ''Each of'' is always followed by a plural noun (candidates) but takes a singular verb. Therefore, ''was'' is correct, not ''were'' or ''are''.',
   'Grammar', 'FIA Assistant Sub-Inspector 2022', 'high', true, 7, 'high', true),

  ('f9c90e1d-e7b6-4cf9-d6b7-a8c01e2f3a4d',
   'Choose the correct spelling.',
   '["Accomodation","Acommodation","Accommodation","Acomodation"]',
   2,
   'The correct spelling is ''Accommodation''. It requires double ''c'' and double ''m''. This is a frequently tested spelling trap in competitive exams.',
   'Vocabulary', 'NTS Junior Clerk 2023', 'medium', true, 8, 'medium', true)

ON CONFLICT (id) DO UPDATE SET
  question       = EXCLUDED.question,
  options        = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation    = EXCLUDED.explanation,
  subcategory    = EXCLUDED.subcategory,
  exam_type      = EXCLUDED.exam_type,
  difficulty     = EXCLUDED.difficulty,
  is_repeated    = EXCLUDED.is_repeated,
  repeat_count   = EXCLUDED.repeat_count,
  importance     = EXCLUDED.importance,
  is_public      = EXCLUDED.is_public;


-- ─────────────────────────────────────────────────────────────
-- 2. Pakistan Studies MCQs  →  pakistan_studies_mcqs
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.pakistan_studies_mcqs (id, question, options, correct_answer, explanation, subcategory, exam_type, difficulty, is_repeated, repeat_count, importance, is_public)
VALUES
  ('a1b2c3d4-0001-4a1b-b2c3-d4e5f6a7b8c9',
   'Through which constitutional amendment was the Federally Administered Tribal Areas (FATA) merged with Khyber Pakhtunkhwa (KPK)?',
   '["21st Amendment","25th Amendment","18th Amendment","23rd Amendment"]',
   1,
   'The 25th Amendment to the Constitution of Pakistan, passed in May 2018, officially merged FATA with the province of Khyber Pakhtunkhwa. The 18th amendment dealt with provincial autonomy.',
   'Governance', 'ETEA Computer Operator 2024', 'high', true, 6, 'high', true),

  ('b2c3d4e5-0002-4b2c-c3d4-e5f6a7b8c9d0',
   'Who moved the Objective Resolution in the Constituent Assembly on March 7, 1949?',
   '["Quaid-e-Azam","Liaquat Ali Khan","Chaudhry Muhammad Ali","Khawaja Nazimuddin"]',
   1,
   'Liaquat Ali Khan, the first Prime Minister of Pakistan, presented the Objective Resolution on March 7, 1949, which was adopted on March 12, 1949, laying the foundation for future constitutions.',
   'Early History', 'FIA Sub-Inspector 2023', 'medium', true, 9, 'high', true),

  ('c3d4e5f6-0003-4c3d-d4e5-f6a7b8c9d0e1',
   'The Lucknow Pact, a joint agreement between the Muslim League and the Indian National Congress, was signed in which year?',
   '["1906","1916","1920","1930"]',
   1,
   'The Lucknow Pact was an agreement reached in December 1916. Quaid-e-Azam Muhammad Ali Jinnah played a pivotal role in this pact, earning him the title ''Ambassador of Hindu-Muslim Unity''.',
   'Freedom Movement', 'KPPSC Tehsildar 2023', 'medium', true, 5, 'medium', true),

  ('d4e5f6a7-0004-4d4e-e5f6-a7b8c9d0e1f2',
   'Which district of Khyber Pakhtunkhwa (KPK) shares a border with the Wakhan Corridor of Afghanistan?',
   '["Swat","Chitral","Dir","Mansehra"]',
   1,
   'Chitral is the northernmost district of KPK and shares a border with Afghanistan''s Wakhan Corridor, which physically separates Pakistan from Tajikistan.',
   'Geography', 'KPPSC Assistant Sub-Inspector 2022', 'high', true, 4, 'high', true),

  ('e5f6a7b8-0005-4e5f-f6a7-b8c9d0e1f2a3',
   'According to the 1973 Constitution, what is the maximum age limit to become the President of Pakistan?',
   '["45 years","65 years","75 years","No upper age limit"]',
   3,
   'Article 41 of the 1973 Constitution states that the President must be a Muslim, not less than 45 years of age, and qualified to be elected as a member of the National Assembly. There is no upper age limit specified.',
   'Constitution', 'ETEA PST 2024', 'high', false, 0, 'medium', true),

  ('f6a7b8c9-0006-4f6a-a7b8-c9d0e1f2a3b4',
   'Which pass connects Peshawar in Pakistan with Kabul in Afghanistan?',
   '["Khyber Pass","Bolan Pass","Khunjerab Pass","Tochi Pass"]',
   0,
   'The Khyber Pass is a mountain pass in the northwest of Pakistan bordering Afghanistan. It connects the town of Landi Kotal near Peshawar to the Valley of Peshawar at Jamrud and leads to Kabul. Bolan connects Quetta to Sibi.',
   'Geography', 'FIA Inspector 2021', 'medium', true, 8, 'high', true),

  ('a7b8c9d0-0007-4a7b-b8c9-d0e1f2a3b4c5',
   'The National Finance Commission (NFC) Award is primarily responsible for:',
   '["Foreign debt distribution","Distribution of financial resources between the Federal government and Provinces","Funding the defense budget","Approving the CPEC projects"]',
   1,
   'The NFC Award is a constitutional mechanism (Article 160) used to distribute tax revenues and financial resources between the Federal government and the four provinces of Pakistan.',
   'Governance', 'CSS Pakistan Affairs 2023', 'high', true, 3, 'high', true),

  ('b8c9d0e1-0008-4b8c-c9d0-e1f2a3b4c5d6',
   'The Radcliffe Award, which demarcated the boundaries of India and Pakistan, was announced on:',
   '["14 August 1947","15 August 1947","17 August 1947","3 June 1947"]',
   2,
   'Although Pakistan gained independence on August 14, the boundary commission award prepared by Sir Cyril Radcliffe was officially published on August 17, 1947.',
   'Freedom Movement', 'FPSC ASI 2022', 'high', true, 5, 'medium', true),

  ('c9d0e1f2-0009-4c9d-d0e1-f2a3b4c5d6e7',
   'What is the length of the Pak-Afghan border, commonly known as the Durand Line? (Approximate standard recognized length)',
   '["1,200 km","2,640 km","3,323 km","1,046 km"]',
   1,
   'The Durand Line, established in 1893, is approximately 2,640 kilometers (1,640 miles) long. It forms the international land border between Afghanistan and Pakistan.',
   'Geography', 'KPPSC PMS 2022', 'medium', true, 7, 'high', true),

  ('d0e1f2a3-000a-4d0e-e1f2-a3b4c5d6e7f8',
   'Under the 1956 Constitution, the Parliament of Pakistan was:',
   '["Bicameral","Unicameral","Tricameral","Suspended"]',
   1,
   'The 1956 Constitution of Pakistan provided for a unicameral (single-chamber) legislature called the National Assembly, consisting of 300 members equally divided between East and West Pakistan.',
   'Constitution', 'NTS 2023', 'high', true, 4, 'high', true)

ON CONFLICT (id) DO UPDATE SET
  question       = EXCLUDED.question,
  options        = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation    = EXCLUDED.explanation,
  subcategory    = EXCLUDED.subcategory,
  exam_type      = EXCLUDED.exam_type,
  difficulty     = EXCLUDED.difficulty,
  is_repeated    = EXCLUDED.is_repeated,
  repeat_count   = EXCLUDED.repeat_count,
  importance     = EXCLUDED.importance,
  is_public      = EXCLUDED.is_public;


-- ─────────────────────────────────────────────────────────────
-- 3. General Knowledge MCQs  →  general_knowledge_mcqs
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.general_knowledge_mcqs (id, question, options, correct_answer, explanation, subcategory, exam_type, difficulty, is_repeated, repeat_count, importance, is_public)
VALUES
  ('e1f2a3b4-0001-4e1f-f2a3-b4c5d6e7f8a9',
   'Warsak Dam, a prominent mass concrete gravity dam, is built on which river in Khyber Pakhtunkhwa?',
   '["Indus River","Swat River","Kabul River","Kurram River"]',
   2,
   'Warsak Dam is located on the Kabul River in the Valley of Peshawar, approximately 20 km northwest of the city of Peshawar in Khyber Pakhtunkhwa.',
   'World Geography', 'ETEA Computer Operator 2024', 'high', true, 6, 'high', true),

  ('f2a3b4c5-0002-4f2a-a3b4-c5d6e7f8a9b0',
   'The headquarters of the Organization of Islamic Cooperation (OIC) is located in which city?',
   '["Riyadh","Jeddah","Istanbul","Tehran"]',
   1,
   'The headquarters (General Secretariat) of the Organization of Islamic Cooperation (OIC) is situated in Jeddah, Saudi Arabia.',
   'International Orgs', 'FIA Assistant Sub-Inspector 2022', 'medium', true, 8, 'high', true),

  ('a3b4c5d6-0003-4a3b-b4c5-d6e7f8a9b0c1',
   'What is the capital city of Tajikistan?',
   '["Tashkent","Astana","Bishkek","Dushanbe"]',
   3,
   'Dushanbe is the capital and largest city of Tajikistan. Tashkent is the capital of Uzbekistan, Astana (or Nur-Sultan) is Kazakhstan, and Bishkek is Kyrgyzstan.',
   'Capitals & Countries', 'KPPSC Assistant Sub-Inspector 2023', 'high', true, 5, 'medium', true),

  ('b4c5d6e7-0004-4b4c-c5d6-e7f8a9b0c1d2',
   'Deficiency of Vitamin C in the human body directly leads to which disease?',
   '["Rickets","Scurvy","Night Blindness","Beriberi"]',
   1,
   'Vitamin C (ascorbic acid) deficiency causes scurvy, characterized by swollen bleeding gums. Rickets is caused by Vitamin D deficiency, Night blindness by Vitamin A, and Beriberi by Vitamin B1.',
   'Science & Technology', 'FPSC ASI 2023', 'medium', true, 7, 'high', true),

  ('c5d6e7f8-0005-4c5d-d6e7-f8a9b0c1d2e3',
   'Which is the largest hot desert in the world?',
   '["Gobi Desert","Arabian Desert","Sahara Desert","Kalahari Desert"]',
   2,
   'The Sahara Desert in North Africa is the largest hot desert in the world. (Note: Antarctica is the largest desert overall, but it is a cold desert).',
   'World Geography', 'NTS Clerk 2023', 'medium', false, 0, 'medium', true),

  ('d6e7f8a9-0006-4d6e-e7f8-a9b0c1d2e3f4',
   'How many member countries are currently part of the South Asian Association for Regional Cooperation (SAARC)?',
   '["6","7","8","9"]',
   2,
   'SAARC currently has 8 member states: Afghanistan, Bangladesh, Bhutan, India, Maldives, Nepal, Pakistan, and Sri Lanka. Afghanistan was the last to join in 2007.',
   'International Orgs', 'KPPSC Planning Officer 2023', 'high', true, 5, 'high', true),

  ('e7f8a9b0-0007-4e7f-f8a9-b0c1d2e3f4a5',
   'The currency ''Yen'' belongs to which country?',
   '["China","South Korea","Japan","Thailand"]',
   2,
   'The Japanese Yen is the official currency of Japan. China uses the Renminbi (Yuan), South Korea uses the Won, and Thailand uses the Baht.',
   'Currencies', 'ETEA Police Constable 2024', 'medium', true, 4, 'medium', true),

  ('f8a9b0c1-0008-4f8a-a9b0-c1d2e3f4a5b6',
   'Who was the scientist that discovered Penicillin?',
   '["Marie Curie","Louis Pasteur","Alexander Fleming","Isaac Newton"]',
   2,
   'Alexander Fleming discovered penicillin in 1928 when he noticed that the mold Penicillium notatum had destroyed colonies of Staphylococcus bacteria in a petri dish.',
   'Science & Technology', 'CSS General Ability 2023', 'medium', true, 6, 'high', true),

  ('a9b0c1d2-0009-4a9b-b0c1-d2e3f4a5b6c7',
   'When is the United Nations (UN) Day celebrated globally every year?',
   '["24th October","10th December","5th June","14th August"]',
   0,
   'UN Day is celebrated on 24th October every year, marking the anniversary of the entry into force of the UN Charter in 1945.',
   'Important Dates', 'FIA Inspector 2022', 'medium', true, 5, 'medium', true),

  ('b0c1d2e3-000a-4b0c-c1d2-e3f4a5b6c7d8',
   'Which district is the largest by area in Khyber Pakhtunkhwa (after the FATA merger)?',
   '["Peshawar","Chitral (Upper & Lower)","South Waziristan","Swat"]',
   1,
   'Chitral (historically one district, now split into Upper and Lower) remains the largest land area region in the province of Khyber Pakhtunkhwa, making up over 20% of the province''s total area.',
   'World Geography', 'KPPSC Tehsildar 2023', 'high', true, 4, 'high', true)

ON CONFLICT (id) DO UPDATE SET
  question       = EXCLUDED.question,
  options        = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation    = EXCLUDED.explanation,
  subcategory    = EXCLUDED.subcategory,
  exam_type      = EXCLUDED.exam_type,
  difficulty     = EXCLUDED.difficulty,
  is_repeated    = EXCLUDED.is_repeated,
  repeat_count   = EXCLUDED.repeat_count,
  importance     = EXCLUDED.importance,
  is_public      = EXCLUDED.is_public;


-- ─────────────────────────────────────────────────────────────
-- 4. Computer Science MCQs  →  computer_science_mcqs
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.computer_science_mcqs (id, question, options, correct_answer, explanation, subcategory, exam_type, difficulty, is_repeated, repeat_count, importance, is_public)
VALUES
  ('c1d2e3f4-0001-4c1d-d2e3-f4a5b6c7d8e9',
   'In MS Word, what is the shortcut key used to insert a hyperlink?',
   '["Ctrl + H","Ctrl + K","Ctrl + L","Ctrl + I"]',
   1,
   'Ctrl + K opens the ''Insert Hyperlink'' dialog box. Ctrl + H is for Find and Replace, Ctrl + L left-aligns text, and Ctrl + I italicizes text.',
   'MS Office', 'ETEA Computer Operator 2024', 'high', true, 8, 'high', true),

  ('d2e3f4a5-0002-4d2e-e3f4-a5b6c7d8e9f0',
   'In a relational database, which command is used to remove all records from a table without logging individual row deletions, making it faster than DELETE?',
   '["DROP","REMOVE","TRUNCATE","CLEAR"]',
   2,
   'TRUNCATE is a DDL command that quickly removes all rows from a table by deallocating the data pages, whereas DELETE is a DML command that logs each row deletion.',
   'DBMS', 'KPPSC IT Officer 2023', 'high', true, 5, 'high', true),

  ('e3f4a5b6-0003-4e3f-f4a5-b6c7d8e9f0a1',
   'Which protocol is responsible for resolving a domain name (like www.google.com) into an IP address?',
   '["DHCP","DNS","SMTP","ARP"]',
   1,
   'DNS (Domain Name System) acts as the phonebook of the internet, translating human-readable domain names into the machine-readable IP addresses required for routing.',
   'Networking', 'FIA Sub-Inspector IT 2023', 'medium', true, 7, 'high', true),

  ('f4a5b6c7-0004-4f4a-a5b6-c7d8e9f0a1b2',
   'Which of the following memory types has the fastest access time in a computer system?',
   '["Random Access Memory (RAM)","Hard Disk Drive (HDD)","Cache Memory","Solid State Drive (SSD)"]',
   2,
   'Cache Memory (specifically L1 and L2 cache inside the CPU) is much faster than standard RAM. It stores frequently accessed data to speed up processing. Storage drives (HDD/SSD) are the slowest.',
   'Computer Hardware', 'FPSC Computer Operator 2023', 'high', true, 6, 'high', true),

  ('a5b6c7d8-0005-4a5b-b6c7-d8e9f0a1b2c3',
   'In MS Excel, what is the purpose of the VLOOKUP function?',
   '["To calculate the vertical variance of data","To search for a value in the first column of a table and return a value in the same row","To combine text vertically from multiple cells","To view the document in portrait layout"]',
   1,
   'VLOOKUP (Vertical Lookup) searches vertically down the leftmost column of a specified range and returns a value from the same row in a column you specify.',
   'MS Office', 'KPPSC Assistant Sub-Inspector 2023', 'high', true, 9, 'high', true),

  ('b6c7d8e9-0006-4b6c-c7d8-e9f0a1b2c3d4',
   'Which layer of the OSI Model is responsible for encrypting and formatting data before it is sent to the application layer?',
   '["Transport Layer","Session Layer","Presentation Layer","Data Link Layer"]',
   2,
   'The Presentation Layer (Layer 6) prepares data for the application layer by handling data formatting, translation, encryption, and compression.',
   'Networking', 'ETEA IT Officer 2022', 'high', true, 4, 'high', true),

  ('c7d8e9f0-0007-4c7d-d8e9-f0a1b2c3d4e5',
   'What is the worst-case time complexity of the QuickSort algorithm?',
   '["O(n log n)","O(n)","O(n^2)","O(log n)"]',
   2,
   'The worst-case time complexity for QuickSort is O(n^2), which happens when the pivot chosen is consistently the smallest or largest element (e.g., if the array is already sorted and the first element is used as pivot).',
   'Algorithms', 'NTS Computer Operator 2022', 'high', false, 0, 'medium', true),

  ('d8e9f0a1-0008-4d8e-e9f0-a1b2c3d4e5f6',
   'Malicious software that demands payment to restore access to a user''s encrypted files is known as:',
   '["Spyware","Ransomware","Adware","Trojan Horse"]',
   1,
   'Ransomware is a type of malware that permanently blocks access to the victim''s data (usually by encrypting it) unless a ransom is paid.',
   'Internet & Security', 'ETEA Computer Operator 2024', 'medium', true, 5, 'high', true),

  ('e9f0a1b2-0009-4e9f-f0a1-b2c3d4e5f6a7',
   'In Object-Oriented Programming (OOP), the concept of hiding internal implementation details and showing only the necessary features is called:',
   '["Inheritance","Polymorphism","Encapsulation","Abstraction"]',
   3,
   'Abstraction means hiding the complex background details and showing only the essential features to the user. (Note: Encapsulation is the wrapping of data and methods into a single unit).',
   'Programming Basics', 'KPPSC IT Officer 2023', 'high', true, 3, 'high', true),

  ('f0a1b2c3-000a-4f0a-a1b2-c3d4e5f6a7b8',
   'Which component of an Operating System acts as the core bridge between applications and data processing performed at the hardware level?',
   '["Shell","Kernel","GUI","Bootloader"]',
   1,
   'The Kernel is the central core component of an OS. It manages operations of memory and CPU time and acts as the bridge between software applications and the physical hardware.',
   'Operating Systems', 'ETEA Computer Operator 2024', 'high', true, 6, 'high', true)

ON CONFLICT (id) DO UPDATE SET
  question       = EXCLUDED.question,
  options        = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation    = EXCLUDED.explanation,
  subcategory    = EXCLUDED.subcategory,
  exam_type      = EXCLUDED.exam_type,
  difficulty     = EXCLUDED.difficulty,
  is_repeated    = EXCLUDED.is_repeated,
  repeat_count   = EXCLUDED.repeat_count,
  importance     = EXCLUDED.importance,
  is_public      = EXCLUDED.is_public;


-- ─────────────────────────────────────────────────────────────
-- 5. Mathematics MCQs  →  mathematics_mcqs
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.mathematics_mcqs (id, question, options, correct_answer, explanation, subcategory, exam_type, difficulty, is_repeated, repeat_count, importance, is_public)
VALUES
  ('a1b2c3d4-1111-4a1b-b2c3-d4e5f6a7b8c9',
   'An officer''s salary is decreased by 20%. By what percentage must his new salary be increased to return to his original salary?',
   '["20%","25%","30%","15%"]',
   1,
   'Let original salary = 100. After 20% decrease, new salary = 80. To return to 100, increase needed = 20. Percentage increase = (20 / 80) * 100 = 25%.',
   'Percentages', 'ETEA Computer Operator 2024', 'high', true, 7, 'high', true),

  ('b2c3d4e5-2222-4b2c-c3d4-e5f6a7b8c9d0',
   'A pump can fill a tank in 2 hours. Due to a leak, it takes 2.5 hours to fill the tank. How many hours will the leak take to empty the full tank?',
   '["8 hours","10 hours","12 hours","14 hours"]',
   1,
   'Rate of pump = 1/2 per hour. Rate with leak = 1/2.5 = 2/5 per hour. Rate of leak = 1/2 - 2/5 = 5/10 - 4/10 = 1/10 per hour. Leak empties tank in 10 hours.',
   'Time & Work', 'KPPSC Assistant Sub-Inspector 2023', 'high', true, 5, 'high', true),

  ('c3d4e5f6-3333-4c3d-d4e5-f6a7b8c9d0e1',
   'A father is 3 times as old as his son. In 12 years, he will be exactly twice as old as his son. What is the present age of the son?',
   '["10 years","12 years","14 years","16 years"]',
   1,
   'Let son''s age = x. Father''s age = 3x. In 12 years: 3x + 12 = 2(x + 12) => 3x + 12 = 2x + 24 => x = 12 years.',
   'Algebra', 'CSS General Ability 2022', 'high', true, 8, 'high', true),

  ('d4e5f6a7-4444-4d4e-e5f6-a7b8c9d0e1f2',
   'What is the area of a circle whose circumference is 44 cm? (Assume pi = 22/7)',
   '["144 cm²","154 cm²","164 cm²","174 cm²"]',
   1,
   'Circumference = 2 * pi * r = 44 => r = 44 / (2 * 22/7) = 44 * 7/44 = 7 cm. Area = pi * r² = (22/7) * 49 = 22 * 7 = 154 cm².',
   'Geometry', 'ETEA Junior Clerk 2024', 'medium', true, 4, 'medium', true),

  ('e5f6a7b8-5555-4e5f-f6a7-b8c9d0e1f2a3',
   'If the ratio of angles of a triangle is 2:3:4, what is the measure of the largest angle?',
   '["60°","80°","100°","120°"]',
   1,
   'Sum of angles = 180°. Let angles be 2x, 3x, 4x. So 9x = 180 => x = 20. Largest angle = 4x = 80°.',
   'Ratios & Proportions', 'KPPSC Tehsildar 2023', 'medium', true, 6, 'high', true),

  ('f6a7b8c9-6666-4f6a-a7b8-c9d0e1f2a3b4',
   'Find the Least Common Multiple (LCM) of 15, 25, and 45.',
   '["125","225","250","325"]',
   1,
   'Prime factorization: 15 = 3 × 5, 25 = 5², 45 = 3² × 5. LCM = highest powers = 3² × 5² = 9 × 25 = 225.',
   'Number System', 'NTS 2023', 'medium', false, 0, 'medium', true),

  ('a7b8c9d0-7777-4a7b-b8c9-d0e1f2a3b4c5',
   'A man walks at a speed of 4 km/h and reaches his destination in 2 hours and 30 minutes. What is the total distance covered?',
   '["8 km","9 km","10 km","12 km"]',
   2,
   'Time = 2.5 hours. Speed = 4 km/h. Distance = Speed × Time = 4 × 2.5 = 10 km.',
   'Speed & Distance', 'FIA Sub-Inspector 2022', 'medium', true, 3, 'high', true),

  ('b8c9d0e1-8888-4b8c-c9d0-e1f2a3b4c5d6',
   'The average age of a class of 30 students is 15 years. If the teacher''s age is included, the average increases by 1. What is the age of the teacher?',
   '["45 years","46 years","50 years","52 years"]',
   1,
   'Total age of 30 students = 30 × 15 = 450. New total (31 people) with average 16 = 31 × 16 = 496. Teacher''s age = 496 - 450 = 46 years.',
   'Averages', 'FPSC Inspector 2023', 'high', true, 5, 'high', true),

  ('c9d0e1f2-9999-4c9d-d0e1-f2a3b4c5d6e7',
   'Simplify the algebraic expression: (x + y)² - (x - y)²',
   '["2x² + 2y²","4xy","2xy","x² - y²"]',
   1,
   'Expanding: (x² + 2xy + y²) - (x² - 2xy + y²). The x² and y² cancel: 2xy + 2xy = 4xy.',
   'Algebra', 'ETEA SST General 2024', 'high', true, 4, 'medium', true),

  ('d0e1f2a3-aaaa-4d0e-e1f2-a3b4c5d6e7f8',
   'By selling an article for Rs. 240, a shopkeeper loses 20%. To make a profit of 20%, at what price should he sell it?',
   '["Rs. 300","Rs. 320","Rs. 360","Rs. 400"]',
   2,
   'SP = 240, Loss = 20%. So CP = (240 × 100) / 80 = Rs. 300. For 20% profit, new SP = 300 × 1.20 = Rs. 360.',
   'Percentages', 'KPPSC Tehsildar 2023', 'high', true, 9, 'high', true)

ON CONFLICT (id) DO UPDATE SET
  question       = EXCLUDED.question,
  options        = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation    = EXCLUDED.explanation,
  subcategory    = EXCLUDED.subcategory,
  exam_type      = EXCLUDED.exam_type,
  difficulty     = EXCLUDED.difficulty,
  is_repeated    = EXCLUDED.is_repeated,
  repeat_count   = EXCLUDED.repeat_count,
  importance     = EXCLUDED.importance,
  is_public      = EXCLUDED.is_public;


-- ─────────────────────────────────────────────────────────────
-- 6. Islamiat MCQs  →  islamiat_mcqs
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.islamiat_mcqs (id, question, options, correct_answer, explanation, subcategory, exam_type, difficulty, is_repeated, repeat_count, importance, is_public)
VALUES
  ('e1f2a3b4-bbbb-4e1f-f2a3-b4c5d6e7f8a9',
   'Which Surah of the Holy Quran does not begin with Bismillah-ir-Rahman-ir-Rahim?',
   '["Surah Al-Imran","Surah At-Tawbah","Surah Al-Maidah","Surah Al-Anfal"]',
   1,
   'Surah At-Tawbah (The Repentance) is the only Surah out of 114 that does not start with Bismillah. It was revealed in the context of war and stern warnings to the polytheists.',
   'Holy Quran', 'KPPSC Tehsildar 2023', 'high', true, 10, 'high', true),

  ('f2a3b4c5-cccc-4f2a-a3b4-c5d6e7f8a9b0',
   'What is the prescribed Nisab (minimum taxable wealth) for Zakat on Gold?',
   '["5.5 Tolas","7.5 Tolas","9.5 Tolas","10 Tolas"]',
   1,
   'According to Islamic Fiqh, the Nisab for Zakat on pure gold is 7.5 Tolas (approximately 87.48 grams). The rate applied on this wealth is 2.5% annually.',
   'Fiqh & Pillars', 'ETEA Computer Operator 2024', 'medium', true, 6, 'high', true),

  ('a3b4c5d6-dddd-4a3b-b4c5-d6e7f8a9b0c1',
   'The migration of Prophet Muhammad (PBUH) from Makkah to Madinah (Hijrat) occurred in which year of Prophethood?',
   '["10th Year","11th Year","12th Year","13th Year"]',
   3,
   'The Hijrat (migration) to Madinah took place in the 13th year of Prophethood (approximately 622 CE), marking the beginning of the Islamic Hijri calendar.',
   'Seerat-un-Nabi', 'FIA Assistant Sub-Inspector 2023', 'high', true, 5, 'high', true),

  ('b4c5d6e7-eeee-4b4c-c5d6-e7f8a9b0c1d2',
   'Who was the second Caliph of Islam from the Khulafa-e-Rashideen?',
   '["Hazrat Abu Bakr (RA)","Hazrat Umar (RA)","Hazrat Usman (RA)","Hazrat Ali (RA)"]',
   1,
   'Hazrat Umar ibn Al-Khattab (RA) was the second Caliph, succeeding Hazrat Abu Bakr (RA) in 634 CE. His caliphate lasted for 10 years (634–644 CE).',
   'Islamic History', 'KPPSC PMS 2022', 'medium', true, 8, 'high', true),

  ('c5d6e7f8-ffff-4c5d-d6e7-f8a9b0c1d2e3',
   'Which companion of the Prophet (PBUH) was given the title of ''Saifullah'' (The Sword of Allah)?',
   '["Hazrat Ali (RA)","Hazrat Hamza (RA)","Hazrat Khalid bin Waleed (RA)","Hazrat Umar (RA)"]',
   2,
   'Hazrat Khalid bin Waleed (RA) was bestowed the title of ''Saifullah'' by Prophet Muhammad (PBUH) due to his unparalleled military genius and victories in the Battle of Mutah.',
   'Islamic Personalities', 'ETEA SST Islamiat 2024', 'medium', true, 7, 'high', true),

  ('d6e7f8a9-0101-4d6e-e7f8-a9b0c1d2e3f4',
   'What is the meaning of the word ''Hadith''?',
   '["Action or deed","Saying or narrative","Silent approval","Divine revelation"]',
   1,
   'Linguistically, ''Hadith'' means a saying, narrative, or report. In Islamic terminology, it refers to the recorded sayings, actions, and silent approvals of Prophet Muhammad (PBUH).',
   'Hadith & Sunnah', 'FPSC Islamiat Paper 2023', 'medium', false, 0, 'medium', true),

  ('e7f8a9b0-0202-4e7f-f8a9-b0c1d2e3f4a5',
   'The Battle of Badr, the first major battle of Islam, took place in which Islamic month?',
   '["Muharram","Rabi ul Awal","Ramadan","Shawwal"]',
   2,
   'The historic Battle of Badr took place on the 17th of Ramadan, in the 2nd year of Hijri (2 AH), where a small Muslim army of 313 decisively defeated the Quraysh army of over 1,000.',
   'Seerat-un-Nabi', 'CSS Islamiat Optional 2022', 'high', true, 9, 'high', true),

  ('f8a9b0c1-0303-4f8a-a9b0-c1d2e3f4a5b6',
   'Which Surah is considered the ''Heart of the Quran''?',
   '["Surah Ar-Rahman","Surah Al-Mulk","Surah Ya-Seen","Surah Al-Kahf"]',
   2,
   'Surah Ya-Seen is referred to in Hadith literature as the ''Heart of the Quran'' due to its core themes of the sovereignty of Allah, resurrection, and prophethood.',
   'Holy Quran', 'NTS 2023', 'medium', true, 4, 'medium', true),

  ('a9b0c1d2-0404-4a9b-b0c1-d2e3f4a5b6c7',
   'Hajj was made obligatory on Muslims in which Hijri year?',
   '["6th Hijri","8th Hijri","9th Hijri","10th Hijri"]',
   2,
   'Hajj, the fifth pillar of Islam, was made compulsory in the 9th year of Hijrah. The Prophet (PBUH) himself performed his only (Farewell) Hajj in the 10th Hijrah.',
   'Fiqh & Pillars', 'KPPSC Assistant Sub-Inspector 2023', 'high', true, 5, 'high', true),

  ('b0c1d2e3-0505-4b0c-c1d2-e3f4a5b6c7d8',
   'The compilation of the Holy Quran into a single standardized book form (Mushaf) was primarily executed during the caliphate of:',
   '["Hazrat Abu Bakr (RA)","Hazrat Umar (RA)","Hazrat Usman (RA)","Hazrat Ali (RA)"]',
   2,
   'While Hazrat Abu Bakr (RA) initiated the collection of Quranic pages, it was Hazrat Usman (RA) who standardized the Quranic dialect and compiled the official Mushaf to prevent regional variations.',
   'Islamic History', 'ETEA Computer Operator 2024', 'high', true, 6, 'high', true)

ON CONFLICT (id) DO UPDATE SET
  question       = EXCLUDED.question,
  options        = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation    = EXCLUDED.explanation,
  subcategory    = EXCLUDED.subcategory,
  exam_type      = EXCLUDED.exam_type,
  difficulty     = EXCLUDED.difficulty,
  is_repeated    = EXCLUDED.is_repeated,
  repeat_count   = EXCLUDED.repeat_count,
  importance     = EXCLUDED.importance,
  is_public      = EXCLUDED.is_public;

-- ─────────────────────────────────────────────────────────────
-- Verify row counts (run this SELECT after inserting):
-- SELECT 'english_mcqs' AS tbl, COUNT(*) FROM public.english_mcqs
-- UNION ALL SELECT 'pakistan_studies_mcqs', COUNT(*) FROM public.pakistan_studies_mcqs
-- UNION ALL SELECT 'general_knowledge_mcqs', COUNT(*) FROM public.general_knowledge_mcqs
-- UNION ALL SELECT 'computer_science_mcqs',  COUNT(*) FROM public.computer_science_mcqs
-- UNION ALL SELECT 'mathematics_mcqs',       COUNT(*) FROM public.mathematics_mcqs
-- UNION ALL SELECT 'islamiat_mcqs',          COUNT(*) FROM public.islamiat_mcqs;
-- Expected: 14, 15, 14, 15, 15, 10 (existing + 10 new each)
-- ─────────────────────────────────────────────────────────────
