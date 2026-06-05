-- ============================================================
-- Smart Prep MCQs — MCQ Seed Data (Per Subject Tables)
-- Run AFTER supabase_schema.sql in the Supabase SQL Editor
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- 1. English MCQs  →  english_mcqs
-- ─────────────────────────────────────────────────────────────
INSERT INTO public.english_mcqs (id, question, options, correct_answer, explanation, subcategory, exam_type, difficulty, is_repeated, repeat_count, importance, is_public)
VALUES
  ('87317e3f-67ee-4bdf-87f5-ee1f3918a2bc',
   'Fill in the blank with the correct preposition: ''He is proficient ________ several programming languages.''',
   '["at","in","with","of"]',
   1,
   'The adjective ''proficient'' is idiomatically followed by ''in'' (proficient in speaking English, proficient in coding).',
   'Prepositions', 'ETEA SST General 2024', 'high', true, 3, 'high', true),

  ('e99a1cb0-c533-4f9b-bd5e-6345ec41b0fc',
   'Identify the antonym of the word ''EPHEMERAL''.',
   '["Transient","Short-lived","Permanent","Fleeting"]',
   2,
   'Ephemeral means lasting for a very short time. Therefore, its direct antonym is ''Permanent''. ''Transient'' and ''Fleeting'' are synonyms.',
   'Vocabulary', 'KPPSC ASST Director 2022', 'high', true, 5, 'high', true),

  ('7636e05d-cc45-42a9-b425-b072f8de38a3',
   'Choose the correct sentence structure:',
   '["If he would have worked hard, he would pass the exam.","If he had worked hard, he would have passed the exam.","If he worked hard, he would have pass the exam.","If he has worked hard, he will passed the exam."]',
   1,
   'This is a Third Conditional sentence. The structure requires: ''If + past perfect, would + have + past participle''. Option B fits this perfectly.',
   'Grammar', 'FIA Inspector 2022', 'high', true, 4, 'high', true),

  ('5ab70b8a-b9c2-4db1-8636-6e415ef48a3e',
   'What is the meaning of the idiom ''To burn the midnight oil''?',
   '["To cause an accidental fire","To work or study late into the night","To waste precious fuels","To express deep operational anger"]',
   1,
   'The idiom ''To burn the midnight oil'' means to stay up late working or studying, commonly used for hardworking students during examination preparation.',
   'Idioms', 'ETEA Senior Clerk 2021', 'medium', false, 0, 'medium', true)

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
  ('40cc8c0e-d1b4-4b53-b09e-05e80931505c',
   'Who was the first President of the Constituent Assembly of Pakistan?',
   '["Quaid-e-Azam Muhammad Ali Jinnah","Liaquat Ali Khan","Maulvi Tamizuddin","Iskander Mirza"]',
   0,
   'Quaid-e-Azam Muhammad Ali Jinnah was elected as the first President of the Constituent Assembly of Pakistan on August 11, 1947, and Liaquat Ali Khan was the first Prime Minister.',
   'Early History', 'KPPSC Tehsildar 2021', 'high', true, 5, 'high', true),

  ('299d2572-c2cb-46a4-8ef8-cc5ec93dfc57',
   'The highest mountain peak of Pakistan, K2, is located in which mountain range?',
   '["Himalayas","Karakoram Range","Hindu Kush","Sulaiman Range"]',
   1,
   'K2 (Godwin-Austen), the second highest peak in the world (8,611m), is located in the Karakoram Mountain Range in Gilgit-Baltistan.',
   'Geography', 'ETEA Junior Clerk 2023', 'high', true, 8, 'high', true),

  ('d58f3319-3db6-47b2-9d32-d1d789069a30',
   'In which year was the famous Lahore Resolution (Pakistan Resolution) passed?',
   '["1930","1937","1940","1947"]',
   2,
   'The Lahore Resolution was passed on March 23, 1940, at Minto Park (now Iqbal Park), Lahore, presenting the formal demand for a separate homeland for Muslims.',
   'Freedom Movement', 'FIA Inspector Legal 2020', 'high', true, 7, 'high', true),

  ('c0993092-23c8-47fb-b472-7634f19b2a65',
   'Who authored the famous book ''The Making of Pakistan''?',
   '["K.K. Aziz","I.H. Qureshi","Chaudhry Muhammad Ali","Ayesha Jalal"]',
   0,
   'K.K. Aziz (Khursheed Kamal Aziz) wrote ''The Making of Pakistan: A Study in Nationalism'', which deals extensively with the historical elements of the subcontinental split.',
   'Literature', 'KPPSC PMS 2019', 'medium', false, 0, 'medium', true),

  ('f72365bb-d18e-4a67-9b27-5d07010a01cc',
   'Which is the longest river in Pakistan?',
   '["Jhelum River","Chenab River","Ravi River","Indus River"]',
   3,
   'The Indus River is the longest river in Pakistan, stretching roughly 3,180 km from its source in Tibet down to its delta in the Arabian Sea.',
   'Geography', 'ETEA PST 2023', 'high', true, 4, 'high', true)

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
  ('a1bb4021-d7fe-41dc-accd-b4ec3c2ea8ef',
   'Which of the following international organizations has its headquarters in Geneva, Switzerland?',
   '["UNESCO","International Court of Justice (ICJ)","World Health Organization (WHO)","International Monetary Fund (IMF)"]',
   2,
   'The World Health Organization (WHO) is headquartered in Geneva, Switzerland. UNESCO is in Paris, ICJ is in The Hague, and IMF is in Washington, D.C.',
   'International Orgs', 'KPPSC Planning Officer 2021', 'high', true, 7, 'high', true),

  ('c3bf68a4-0ef6-4f40-8b42-d1c9ef005efc',
   'Which is the largest ocean in the world?',
   '["Atlantic Ocean","Indian Ocean","Arctic Ocean","Pacific Ocean"]',
   3,
   'The Pacific Ocean is the largest and deepest of Earth''s oceanic divisions, covering more than 30% of the Earth''s surface.',
   'Geography', 'ETEA Police Constable 2023', 'high', true, 9, 'high', true),

  ('9aee9bc7-6ecb-439f-bd96-3ef1a196ecf9',
   'The currency of Turkey is named ________.',
   '["Dinar","Euro","Lira","Riyal"]',
   2,
   'The official currency of the Republic of Turkey is the Turkish Lira.',
   'Currencies', 'FIA Assistant Sub-Inspector 2023', 'high', true, 5, 'high', true),

  ('bdab728e-5b12-4217-bfde-e16e09ebef5a',
   'Which country is called the ''Land of the Midnight Sun''?',
   '["Japan","Norway","Finland","Iceland"]',
   1,
   'Norway is famously known as the Land of the Midnight Sun because parts of the country lie north of the Arctic Circle, where the sun remains visible for 24 hours in midsummer.',
   'Geography', 'KPPSC Tehsildar 2022', 'medium', true, 4, 'medium', true)

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
  ('9a6e1106-cf4c-47bc-ad74-884814d48d56',
   'Which of the following is the fastest protocol used to transfer files over local or wide area networks?',
   '["FTP (File Transfer Protocol)","HTTP (Hypertext Transfer Protocol)","TFTP (Trivial File Transfer Protocol)","SFTP (Secure File Transfer Protocol)"]',
   3,
   'SFTP (Secure File Transfer Protocol) or FTP are dedicated transfer protocols, but in modern networks, SFTP provides the highest security along with optimized packet pipelines. TFTP is simpler but slower due to tiny block buffers.',
   'Networking', 'ETEA IT Officer 2023', 'high', true, 4, 'high', true),

  ('a4f21db5-eb07-4a0d-85ad-2900ea903960',
   'What is the size of an IPv6 address?',
   '["32 bits","64 bits","128 bits","256 bits"]',
   2,
   'An IPv6 address consists of 128 bits (16 octets), written in hexadecimal and separated by colons, which provides a massive address space compared to IPv4''s 32-bit ceiling.',
   'Networking', 'KPPSC Lecturer CS 2022', 'high', true, 6, 'high', true),

  ('fce46eb9-cdde-45c1-8408-bd974d6c4d7e',
   'Which data structure works on the LIFO (Last In First Out) principle?',
   '["Queue","Stack","Linked List","Binary Tree"]',
   1,
   'A Stack operates on the LIFO (Last In First Out) principle, where the last element inserted is the first to be retrieved (using push and pop operations). Queues operate on FIFO.',
   'Data Structures', 'FIA Sub-Inspector 2021', 'medium', false, 0, 'medium', true),

  ('85beeb5c-5fb2-4752-9ea8-654dbdb189c4',
   'In database management systems, which key is used to establish relationship between two tables?',
   '["Primary Key","Foreign Key","Candidate Key","Super Key"]',
   1,
   'A Foreign Key is a field (or collection of fields) in one table that uniquely identifies a row of another table, forming a standard relational link between them.',
   'DBMS', 'ETEA Computer Operator 2022', 'high', true, 3, 'high', true),

  ('5101037f-ec73-455b-b9d9-5f214690e80a',
   'Which layer of the OSI model is responsible for routing packets across different networks?',
   '["Data Link Layer","Transport Layer","Network Layer","Physical Layer"]',
   2,
   'The Network Layer (Layer 3) is responsible for packet routing, logical addressing (IP addresses), and path determination.',
   'Networking', 'KPPSC Subject Specialist 2024', 'high', true, 5, 'high', true)

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
  ('df6b04ec-24e0-4ad7-8db1-4e78a69bf2cc',
   'In a screening test, 35% of the candidates passed and 455 candidates failed. What was the total number of candidates who appeared in the exam?',
   '["650","700","750","800"]',
   1,
   'If 35% passed, then 65% failed (100% - 35%). Let the total candidates be X. So, 65% of X = 455 => 0.65 * X = 455 => X = 455 / 0.65 = 700.',
   'Percentages', 'ETEA SST General 2023', 'high', true, 5, 'high', true),

  ('7a52bbcd-20fa-40ea-9b88-cb94d75d658c',
   'A train 120 meters long passes a telegraph post in 6 seconds. What is the speed of the train in km/h?',
   '["54 km/h","72 km/h","80 km/h","90 km/h"]',
   1,
   'Speed = Distance / Time = 120m / 6s = 20 m/s. To convert m/s to km/h, multiply by 18/5: 20 * (18/5) = 72 km/h.',
   'Speed & Distance', 'KPPSC Tehsildar 2022', 'high', true, 3, 'high', true),

  ('8e9c614b-2f3b-4886-ac15-d227c8ff6a99',
   'The average of five consecutive odd numbers is 61. What is the highest of these five numbers?',
   '["61","63","65","67"]',
   2,
   'Let the consecutive odd numbers be: x-4, x-2, x, x+2, x+4. Their average is x = 61. The highest number is x+4 = 61+4 = 65. (Numbers are 57, 59, 61, 63, 65).',
   'Averages & Algebra', 'CSS General Ability 2021', 'medium', false, 0, 'medium', true),

  ('844cc9ee-a83a-4aeb-a029-41718bf7ee2a',
   'If 15 men can perform a task in 30 days, how many days will 10 men take to complete the exact same task?',
   '["20 days","40 days","45 days","50 days"]',
   2,
   'This is a case of inverse proportion (men * days = total work constant). M1 * D1 = M2 * D2 => 15 * 30 = 10 * D2 => 450 = 10 * D2 => D2 = 45 days.',
   'Proportions & Ratios', 'ETEA Junior Clerk 2024', 'high', true, 6, 'high', true),

  ('3df71fb2-b7ce-4bb0-b74c-47b2ff9222c5',
   'If a right-angled triangle has bases of 6cm and 8cm, what is its hypotenuse length, and what is its area?',
   '["Hypotenuse 10cm, Area 24 cm²","Hypotenuse 12cm, Area 48 cm²","Hypotenuse 10cm, Area 48 cm²","Hypotenuse 14cm, Area 24 cm²"]',
   0,
   'By Pythagoras Theorem, Hypotenuse² = Base² + Altitude² = 6² + 8² = 36 + 64 = 100 => Hypotenuse = 10cm. Area = 0.5 * base * height = 0.5 * 6 * 8 = 24 cm².',
   'Geometry', 'KPPSC Subject Specialist 2023', 'high', true, 4, 'high', true)

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
-- (Placeholder — add your Islamiat questions here)
-- ─────────────────────────────────────────────────────────────
-- INSERT INTO public.islamiat_mcqs (...) VALUES (...);


-- ─────────────────────────────────────────────────────────────
-- Verify row counts per subject table:
-- SELECT 'english_mcqs' AS tbl, COUNT(*) FROM public.english_mcqs
-- UNION ALL SELECT 'pakistan_studies_mcqs', COUNT(*) FROM public.pakistan_studies_mcqs
-- UNION ALL SELECT 'general_knowledge_mcqs', COUNT(*) FROM public.general_knowledge_mcqs
-- UNION ALL SELECT 'computer_science_mcqs',  COUNT(*) FROM public.computer_science_mcqs
-- UNION ALL SELECT 'mathematics_mcqs',       COUNT(*) FROM public.mathematics_mcqs
-- UNION ALL SELECT 'islamiat_mcqs',          COUNT(*) FROM public.islamiat_mcqs;
-- ─────────────────────────────────────────────────────────────
