-- ============================================================
-- Exam Topper — Note Topic MCQs Seed Data
-- Run AFTER supabase_schema_note_mcqs.sql
-- Total: 168 MCQs (6 per topic × 28 topics)
-- Covers: Pakistan Studies, GK, English, Mathematics, CS, Islamiat
-- ============================================================

INSERT INTO public.note_topic_mcqs
  (id, note_topic_id, question, options, correct_answer, explanation, category, sort_order, is_public)
VALUES

-- ─────────────────────────────────────────────────────────────
-- Pakistan Studies — ps-note-1 (Pakistan Movement History)
-- ─────────────────────────────────────────────────────────────
('psn1-q1','ps-note-1','In which year was the All India Muslim League (AIML) founded in Dhaka?','["1885","1906","1919","1930"]',1,'The All India Muslim League was founded on 30 December 1906 at Dhaka by Nawab Salimullah Khan.','Pakistan Studies',1,TRUE),
('psn1-q2','ps-note-1','Who moved the historic Pakistan Resolution (Lahore Resolution) on 23 March 1940?','["Allama Iqbal","Quaid-e-Azam","A.K. Fazlul Haq","Liaquat Ali Khan"]',2,'The Lahore Resolution was moved by A.K. Fazlul Haq (Prime Minister of Bengal) at Minto Park, Lahore.','Pakistan Studies',2,TRUE),
('psn1-q3','ps-note-1','In which year did Allama Iqbal first propose a separate Muslim homeland in the Allahabad Address?','["1919","1930","1940","1947"]',1,'Allama Iqbal delivered the Allahabad Address in 1930, first proposing a separate Muslim state in northwestern India.','Pakistan Studies',3,TRUE),
('psn1-q4','ps-note-1','Who became the first Prime Minister of Pakistan on 14 August 1947?','["Quaid-e-Azam","Khawaja Nazimuddin","Liaquat Ali Khan","Chaudhry Muhammad Ali"]',2,'Liaquat Ali Khan became Pakistan''s first Prime Minister on 14 August 1947, while Quaid-e-Azam became the first Governor-General.','Pakistan Studies',4,TRUE),
('psn1-q5','ps-note-1','What event in 1857 marked the beginning of British Crown rule in India?','["Formation of Muslim League","War of Independence (Sepoy Mutiny)","Lucknow Pact","Khilafat Movement"]',1,'The War of Independence of 1857 (also called the Sepoy Mutiny) ended the East India Company''s rule and established direct British Crown control.','Pakistan Studies',5,TRUE),
('psn1-q6','ps-note-1','The Khilafat Movement lasted from which years?','["1906–1913","1919–1924","1930–1935","1940–1945"]',1,'The Khilafat Movement ran from 1919 to 1924. It began after the Montagu-Chelmsford Reforms and aimed to preserve the Ottoman Caliphate.','Pakistan Studies',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- Pakistan Studies — ps-note-2 (Quaid-e-Azam)
-- ─────────────────────────────────────────────────────────────
('psn2-q1','ps-note-2','Which title was given to Quaid-e-Azam by Sarojini Naidu?','["Father of the Nation","Ambassador of Hindu-Muslim Unity","Quaid-e-Millat","Lion of Punjab"]',1,'Sarojini Naidu gave Muhammad Ali Jinnah the title "Ambassador of Hindu-Muslim Unity" after the 1916 Lucknow Pact.','Pakistan Studies',1,TRUE),
('psn2-q2','ps-note-2','In which year did Jinnah join the Muslim League?','["1906","1910","1913","1920"]',2,'Quaid-e-Azam joined the All India Muslim League in 1913, while remaining a member of the Indian National Congress until 1920.','Pakistan Studies',2,TRUE),
('psn2-q3','ps-note-2','Quaid-e-Azam''s 14 Points (1929) were presented in response to which report?','["Montagu-Chelmsford Report","Simon Commission Report","Nehru Report","Cripps Mission Report"]',2,'The 14 Points were Jinnah''s counter-proposal to the Nehru Report (1928), which had rejected Muslim political safeguards.','Pakistan Studies',3,TRUE),
('psn2-q4','ps-note-2','On what date did Quaid-e-Azam Muhammad Ali Jinnah pass away?','["14 August 1948","11 September 1948","23 March 1949","25 December 1948"]',1,'Quaid-e-Azam passed away on 11 September 1948 in Karachi, having served as Pakistan''s first Governor-General for just over a year.','Pakistan Studies',4,TRUE),
('psn2-q5','ps-note-2','The title "Quaid-e-Azam" was formally conferred on Jinnah by whom?','["Liaquat Ali Khan","Maulana Mazharuddin Shaheed","Allama Iqbal","A.K. Fazlul Haq"]',1,'The title Quaid-e-Azam (Great Leader) was conferred on Muhammad Ali Jinnah by Maulana Mazharuddin Shaheed in 1938.','Pakistan Studies',5,TRUE),
('psn2-q6','ps-note-2','Quaid-e-Azam was born on 25 December 1876 in which city?','["Lahore","Delhi","Karachi","Mumbai"]',2,'Muhammad Ali Jinnah was born on 25 December 1876 in Wazir Mansion, Karachi (then part of Sindh province).','Pakistan Studies',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- Pakistan Studies — ps-note-3 (Constitutions of Pakistan)
-- ─────────────────────────────────────────────────────────────
('psn3-q1','ps-note-3','Pakistan''s 1962 Constitution was promulgated by which leader?','["Z.A. Bhutto","Iskander Mirza","Ayub Khan","Yahya Khan"]',2,'The 1962 Constitution was promulgated on 8 June 1962 by Field Marshal Ayub Khan. It introduced the Presidential system and Basic Democracies.','Pakistan Studies',1,TRUE),
('psn3-q2','ps-note-3','Which of Pakistan''s constitutions introduced a Bicameral (two-house) legislature?','["1956 Constitution","1962 Constitution","1973 Constitution","All of the above"]',2,'Only the 1973 Constitution (under Z.A. Bhutto) introduced a bicameral legislature with the National Assembly and the Senate.','Pakistan Studies',2,TRUE),
('psn3-q3','ps-note-3','Pakistan was declared an Islamic Republic for the first time under which constitution?','["1956 Constitution","1962 Constitution","1973 Constitution","1985 Amendments"]',0,'The 1956 Constitution, enforced on 23 March 1956, formally declared Pakistan an Islamic Republic for the first time.','Pakistan Studies',3,TRUE),
('psn3-q4','ps-note-3','The Objectives Resolution (1949) was made a substantive part of the 1973 Constitution via which amendment?','["5th Amendment","8th Amendment","13th Amendment","18th Amendment"]',1,'Article 2A (inserting the Objectives Resolution as a substantive part) was added to the 1973 Constitution through the 8th Amendment in 1985.','Pakistan Studies',4,TRUE),
('psn3-q5','ps-note-3','Under which constitution did Pakistan use the Presidential system of government?','["1956 Constitution","1962 Constitution","1973 Constitution","All constitutions"]',1,'Pakistan used a Presidential system exclusively under the 1962 Constitution (Ayub Khan era). The 1956 and 1973 constitutions both used the Parliamentary system.','Pakistan Studies',5,TRUE),
('psn3-q6','ps-note-3','On which date was the 1973 Constitution enforced?','["23 March 1973","14 August 1973","25 December 1973","1 January 1973"]',1,'The 1973 Constitution was enforced on 14 August 1973, Pakistan''s Independence Day, under Prime Minister Zulfikar Ali Bhutto.','Pakistan Studies',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- Pakistan Studies — ps-note-4 (Geography of Pakistan)
-- ─────────────────────────────────────────────────────────────
('psn4-q1','ps-note-4','Which is the highest peak in Pakistan?','["Nanga Parbat","K2 (Godwin-Austen)","Tirich Mir","Broad Peak"]',1,'K2 (Godwin-Austen) at 8,611 metres is Pakistan''s highest peak, located in the Karakoram range. It is the second highest in the world.','Pakistan Studies',1,TRUE),
('psn4-q2','ps-note-4','The Durand Line, Pakistan''s border with Afghanistan, was drawn in which year?','["1857","1873","1893","1947"]',2,'The Durand Line was demarcated in 1893 by Sir Mortimer Durand between British India and Afghanistan. It spans approximately 2,430 km.','Pakistan Studies',2,TRUE),
('psn4-q3','ps-note-4','What is the approximate total length of Pakistan''s coastline along the Arabian Sea?','["646 km","846 km","1,046 km","1,246 km"]',2,'Pakistan has approximately 1,046 km of coastline along the Arabian Sea, mostly in Balochistan and Sindh provinces.','Pakistan Studies',3,TRUE),
('psn4-q4','ps-note-4','The Indus River originates from which body of water in Tibet?','["Lake Titicaca","Lake Mansarovar","Lake Victoria","Lake Baikal"]',1,'The Indus River originates from Lake Mansarovar in Tibet and flows approximately 3,180 km before emptying into the Arabian Sea.','Pakistan Studies',4,TRUE),
('psn4-q5','ps-note-4','Use the acronym AIIC — Pakistan shares its border with how many countries?','["2","3","4","5"]',2,'Pakistan shares its borders with 4 countries: Afghanistan (A), India (I), Iran (I), and China (C) — remembered as AIIC.','Pakistan Studies',5,TRUE),
('psn4-q6','ps-note-4','Nanga Parbat (8,126 m) is located in which mountain range?','["Karakoram","Hindu Kush","Himalayas","Sulaiman Range"]',2,'Nanga Parbat is located in the Himalayas. K2 is in the Karakoram, while Tirich Mir is the highest peak of the Hindu Kush.','Pakistan Studies',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- Pakistan Studies — ps-note-5 (FATA Merger)
-- ─────────────────────────────────────────────────────────────
('psn5-q1','ps-note-5','The 25th Constitutional Amendment merged FATA into which province?','["Punjab","Sindh","Balochistan","Khyber Pakhtunkhwa"]',3,'The 25th Constitutional Amendment of 2018 officially merged FATA (7 agencies + 6 Frontier Regions) into Khyber Pakhtunkhwa.','Pakistan Studies',1,TRUE),
('psn5-q2','ps-note-5','Which draconian colonial law governing FATA was abolished by the 25th Amendment?','["Bengal Regulation Act","Frontier Crimes Regulation (FCR) of 1901","Rowlatt Act 1919","Public Safety Ordinance"]',1,'The Frontier Crimes Regulation (FCR) of 1901 — a harsh colonial-era law — was officially repealed with the FATA merger in 2018.','Pakistan Studies',2,TRUE),
('psn5-q3','ps-note-5','FATA consisted of how many Agencies before the 2018 merger?','["5","6","7","8"]',2,'Pre-merger FATA consisted of 7 Agencies (e.g., Khyber, North Waziristan, South Waziristan) and 6 Frontier Regions.','Pakistan Studies',3,TRUE),
('psn5-q4','ps-note-5','In which year were the first-ever provincial assembly elections held in the merged tribal districts?','["2018","2019","2020","2021"]',1,'The first-ever provincial assembly elections in the merged tribal districts of KPK were held in July 2019.','Pakistan Studies',4,TRUE),
('psn5-q5','ps-note-5','Before the 25th Amendment, FATA was governed by the President via which official?','["Chief Minister KPK","Governor KPK","FATA Secretariat Chief","Prime Minister directly"]',1,'Before the merger, FATA was governed directly by the President of Pakistan through the Governor of Khyber Pakhtunkhwa.','Pakistan Studies',5,TRUE),
('psn5-q6','ps-note-5','The 25th Amendment was passed in which month and year?','["August 2017","May 2018","March 2019","July 2020"]',1,'The 25th Constitutional Amendment was passed by the National Assembly and Senate in May 2018, receiving presidential assent on May 31, 2018.','Pakistan Studies',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- Pakistan Studies — ps-note-6 (Nuclear Programme)
-- ─────────────────────────────────────────────────────────────
('psn6-q1','ps-note-6','Pakistan''s first nuclear tests were conducted on which date (Youm-e-Takbeer)?','["28 May 1998","30 May 1998","6 June 1998","14 August 1998"]',0,'Pakistan conducted 5 simultaneous underground nuclear tests (Chagai-I) on 28 May 1998 in the Ras Koh Hills of Balochistan — commemorated as Youm-e-Takbeer.','Pakistan Studies',1,TRUE),
('psn6-q2','ps-note-6','Pakistan became the _____ country in the world to develop nuclear weapons.','["5th","6th","7th","8th"]',2,'Pakistan became the 7th nuclear-armed country in the world and the 1st in the Islamic world after its 1998 tests.','Pakistan Studies',2,TRUE),
('psn6-q3','ps-note-6','Who is considered the father of Pakistan''s nuclear program?','["Dr. Samar Mubarakmand","Dr. Abdul Qadeer Khan","Dr. Pervez Hoodbhoy","Dr. Munir Ahmad Khan"]',1,'Dr. Abdul Qadeer Khan (A.Q. Khan) spearheaded Pakistan''s uranium enrichment program at Kahuta Research Laboratories (KRL).','Pakistan Studies',3,TRUE),
('psn6-q4','ps-note-6','Pakistan''s first commercial nuclear power plant (KANUPP) was inaugurated in which year?','["1965","1972","1980","1985"]',1,'The Karachi Nuclear Power Plant (KANUPP) was inaugurated in 1972 with Canadian assistance. It was Pakistan''s first commercial nuclear power facility.','Pakistan Studies',4,TRUE),
('psn6-q5','ps-note-6','How many nuclear tests did Pakistan conduct on 30 May 1998 (Chagai-II)?','["1","2","3","5"]',0,'Chagai-II was a single underground nuclear test conducted on 30 May 1998 at Kharan desert, making a total of 6 tests in two days.','Pakistan Studies',5,TRUE),
('psn6-q6','ps-note-6','Pakistan''s nuclear program formally started in the 1970s under which Prime Minister?','["Ayub Khan","Zulfikar Ali Bhutto","Zia-ul-Haq","Liaquat Ali Khan"]',1,'The formal nuclear weapons program was initiated by Prime Minister Zulfikar Ali Bhutto in the early 1970s, following the 1971 war.','Pakistan Studies',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- Pakistan Studies — ps-note-7 (CPEC)
-- ─────────────────────────────────────────────────────────────
('psn7-q1','ps-note-7','CPEC connects Kashgar (China) to which Pakistani city?','["Karachi","Gwadar","Lahore","Peshawar"]',1,'CPEC connects Kashgar in China''s Xinjiang province to Gwadar Port in Balochistan — a deep-sea port on the Arabian Sea.','Pakistan Studies',1,TRUE),
('psn7-q2','ps-note-7','CPEC was officially launched during Chinese President Xi Jinping''s visit to Pakistan in which year?','["2013","2014","2015","2016"]',2,'CPEC agreements were officially signed during Xi Jinping''s visit to Pakistan in April 2015, with an initial investment of $46 billion.','Pakistan Studies',2,TRUE),
('psn7-q3','ps-note-7','CPEC is the flagship project of China''s which global initiative?','["AIIB","Belt and Road Initiative (BRI)","ASEAN Plus Three","SCO Development Fund"]',1,'CPEC is the flagship project of China''s Belt and Road Initiative (BRI), aimed at connecting Asia, Africa, and Europe via land and maritime networks.','Pakistan Studies',3,TRUE),
('psn7-q4','ps-note-7','Which company manages Gwadar Port under CPEC?','["PTCL","China Overseas Port Holding Company (COPHC)","China National Petroleum Corporation","HUBCO"]',1,'Gwadar Port is operated under a long-term lease by China Overseas Port Holding Company (COPHC).','Pakistan Studies',4,TRUE),
('psn7-q5','ps-note-7','CPEC has three road/rail alignment routes — which option lists them correctly?','["Northern, Southern, Eastern","Western, Central, Eastern","Coastal, Mountain, Desert","CPEC has only one route"]',1,'CPEC has three alignment routes: Western (through Balochistan/KPK), Central, and Eastern (through Punjab/Sindh).','Pakistan Studies',5,TRUE),
('psn7-q6','ps-note-7','The initial CPEC investment value was approximately:','["$6 billion","$26 billion","$46 billion","$66 billion"]',2,'CPEC started with an estimated $46 billion investment package (later expanded to over $62 billion), making it one of the largest infrastructure programs in history.','Pakistan Studies',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- Pakistan Studies — ps-note-8 (Constitutional Amendments)
-- ─────────────────────────────────────────────────────────────
('psn8-q1','ps-note-8','Which constitutional amendment introduced Article 58(2)(b) — the President''s power to dissolve the National Assembly?','["8th Amendment","13th Amendment","17th Amendment","18th Amendment"]',0,'The 8th Amendment (1985), passed under Zia-ul-Haq, added Article 58(2)(b) giving the President power to dissolve the National Assembly.','Pakistan Studies',1,TRUE),
('psn8-q2','ps-note-8','Which amendment permanently removed 58(2)(b) and devolved federal ministries to provinces?','["13th Amendment","17th Amendment","18th Amendment","25th Amendment"]',2,'The 18th Amendment (2010) permanently removed Article 58(2)(b), devolved major federal subjects to provinces, and renamed NWFP to Khyber Pakhtunkhwa.','Pakistan Studies',2,TRUE),
('psn8-q3','ps-note-8','The 17th Amendment (2003) was passed under which leader?','["Z.A. Bhutto","Nawaz Sharif","Pervez Musharraf","Asif Zardari"]',2,'The 17th Amendment was passed in December 2003 under President Pervez Musharraf, restoring 58(2)(b) powers to the Presidency.','Pakistan Studies',3,TRUE),
('psn8-q4','ps-note-8','The 13th Amendment (1997) was passed by which Prime Minister to strip Presidential dissolution powers?','["Zulfikar Ali Bhutto","Benazir Bhutto","Nawaz Sharif","Imran Khan"]',2,'The 13th Amendment was passed in 1997 under Prime Minister Nawaz Sharif''s second government, removing the President''s power under 58(2)(b).','Pakistan Studies',4,TRUE),
('psn8-q5','ps-note-8','Which amendment renamed NWFP (North-West Frontier Province) to Khyber Pakhtunkhwa?','["17th Amendment","18th Amendment","21st Amendment","25th Amendment"]',1,'The 18th Amendment (2010) renamed the North-West Frontier Province (NWFP) to Khyber Pakhtunkhwa, fulfilling a long-standing demand of the Pashtun people.','Pakistan Studies',5,TRUE),
('psn8-q6','ps-note-8','Which amendment first introduced Article 58(2)(b)?','["5th Amendment","7th Amendment","8th Amendment","10th Amendment"]',2,'Article 58(2)(b) was introduced by the 8th Amendment (1985) under Zia-ul-Haq. The 13th removed it, the 17th restored it, and the 18th permanently removed it.','Pakistan Studies',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- General Knowledge — gk-note-5 (SCO)
-- ─────────────────────────────────────────────────────────────
('gkn5-q1','gk-note-5','The Shanghai Cooperation Organisation (SCO) was founded on which date?','["15 June 1996","15 June 2001","15 September 2001","1 January 2005"]',1,'The SCO was officially founded on 15 June 2001 in Shanghai, China — evolving from the earlier "Shanghai Five" grouping.','General Knowledge',1,TRUE),
('gkn5-q2','gk-note-5','Where is the SCO Secretariat headquartered?','["Moscow","Shanghai","Beijing","Tashkent"]',2,'The SCO Secretariat is based in Beijing, China. The Regional Anti-Terrorist Structure (RATS) is based in Tashkent, Uzbekistan.','General Knowledge',2,TRUE),
('gkn5-q3','gk-note-5','Pakistan and India joined the SCO as full members in which year?','["2015","2016","2017","2018"]',2,'Pakistan and India became full members of the SCO together at the Astana Summit in 2017.','General Knowledge',3,TRUE),
('gkn5-q4','gk-note-5','Which country became the 9th member of the SCO in 2023?','["Turkey","Saudi Arabia","Iran","Egypt"]',2,'Iran joined the SCO as the 9th full member in 2023. Belarus subsequently joined as the 10th member in 2024.','General Knowledge',4,TRUE),
('gkn5-q5','gk-note-5','Before becoming the SCO in 2001, the group was known as the:','["Shanghai Three","Shanghai Four","Shanghai Five","Central Asian Pact"]',2,'Before 2001, the organization was called the "Shanghai Five" comprising Russia, China, Kazakhstan, Kyrgyzstan, and Tajikistan.','General Knowledge',5,TRUE),
('gkn5-q6','gk-note-5','The SCO''s RATS (Regional Anti-Terrorist Structure) is headquartered in which city?','["Beijing","Moscow","Almaty","Tashkent"]',3,'The RATS (Regional Anti-Terrorist Structure) of the SCO is headquartered in Tashkent, Uzbekistan.','General Knowledge',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- General Knowledge — gk-note-6 (ECO)
-- ─────────────────────────────────────────────────────────────
('gkn6-q1','gk-note-6','The Economic Cooperation Organisation (ECO) was established in which year?','["1964","1979","1985","1992"]',2,'The ECO was established in 1985 by Iran, Pakistan, and Turkey — as a successor to the earlier Regional Cooperation for Development (RCD) of 1964.','General Knowledge',1,TRUE),
('gkn6-q2','gk-note-6','The ECO Secretariat is located in which city?','["Islamabad","Ankara","Tehran","Almaty"]',2,'The ECO Secretariat is located in Tehran, Iran.','General Knowledge',2,TRUE),
('gkn6-q3','gk-note-6','In 1992, the ECO expanded to include how many new member states?','["5","7","9","10"]',1,'In 1992, the ECO expanded by 7 new members: Afghanistan, Azerbaijan, and the 5 Central Asian Republics (Kazakhstan, Kyrgyzstan, Tajikistan, Turkmenistan, Uzbekistan).','General Knowledge',3,TRUE),
('gkn6-q4','gk-note-6','Which treaty did ECO sign in 2003 to reduce trade tariffs among members?','["ECO Free Trade Agreement","ECO Trade Agreement (ECOTA)","Silk Road Trade Pact","Central Asian Customs Union"]',1,'The ECO Trade Agreement (ECOTA) was signed in 2003 to reduce tariffs and promote trade among ECO member states.','General Knowledge',4,TRUE),
('gkn6-q5','gk-note-6','ECO is a direct successor to the Regional Cooperation for Development (RCD) which was founded in:','["1955","1960","1964","1970"]',2,'The Regional Cooperation for Development (RCD) was founded in 1964 by the same three nations — Pakistan, Iran, and Turkey — that later formed the ECO in 1985.','General Knowledge',5,TRUE),
('gkn6-q6','gk-note-6','How many total members does the ECO currently have?','["3","5","8","10"]',3,'The ECO currently has 10 member states: the 3 founding members (Iran, Pakistan, Turkey) plus 7 that joined in 1992.','General Knowledge',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- General Knowledge — gk-note-7 (World Facts)
-- ─────────────────────────────────────────────────────────────
('gkn7-q1','gk-note-7','Which is the world''s largest country by total land area?','["Canada","United States","China","Russia"]',3,'Russia is the world''s largest country by total land area, spanning approximately 17.1 million km² across Europe and Asia.','General Knowledge',1,TRUE),
('gkn7-q2','gk-note-7','The Nile River, the world''s longest, is located on which continent?','["Asia","South America","Africa","Europe"]',2,'The Nile River (approximately 6,650 km long) flows through northeastern Africa, passing through countries like Uganda, Sudan, and Egypt.','General Knowledge',2,TRUE),
('gkn7-q3','gk-note-7','Mount Everest''s official height (re-measured in 2020) is:','["8,844.43 m","8,848.86 m","8,852.00 m","8,840.00 m"]',1,'Mount Everest''s height was officially revised to 8,848.86 metres following a joint Nepal-China survey in 2020.','General Knowledge',3,TRUE),
('gkn7-q4','gk-note-7','Which country surpassed China as the world''s most populous in 2023?','["USA","Indonesia","India","Bangladesh"]',2,'India surpassed China as the world''s most populous country in 2023, with an estimated population exceeding 1.4 billion.','General Knowledge',4,TRUE),
('gkn7-q5','gk-note-7','The Great Wall of China is over how many km in total length?','["8,000 km","13,000 km","17,000 km","21,000 km"]',3,'The total length of the Great Wall of China is over 21,000 km, including all its branches, when measured across all dynasties.','General Knowledge',5,TRUE),
('gkn7-q6','gk-note-7','The Caspian Sea is technically the world''s largest:','["Ocean","Sea","Inland body of water (lake)","Reservoir"]',2,'Despite its name, the Caspian Sea is technically the world''s largest enclosed inland body of water — making it a lake by strict geographic definition.','General Knowledge',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- General Knowledge — gk-note-8 (Nobel Prize)
-- ─────────────────────────────────────────────────────────────
('gkn8-q1','gk-note-8','Who established the Nobel Prize in his 1895 will?','["Albert Einstein","Alfred Nobel","Marie Curie","Charles Darwin"]',1,'The Nobel Prize was established by the 1895 will of Alfred Nobel, a Swedish chemist who invented dynamite. Prizes were first awarded in 1901.','General Knowledge',1,TRUE),
('gkn8-q2','gk-note-8','The Nobel Peace Prize is awarded in which city?','["Stockholm","Helsinki","Oslo","Copenhagen"]',2,'The Nobel Peace Prize is awarded in Oslo, Norway. All other Nobel Prizes are awarded in Stockholm, Sweden.','General Knowledge',2,TRUE),
('gkn8-q3','gk-note-8','Malala Yousafzai won the Nobel Peace Prize in which year?','["2012","2013","2014","2015"]',2,'Malala Yousafzai won the Nobel Peace Prize in 2014 (shared with Kailash Satyarthi), becoming the youngest Nobel laureate ever.','General Knowledge',3,TRUE),
('gkn8-q4','gk-note-8','The Nobel Prize in Economic Sciences was NOT in Alfred Nobel''s original will — it was added in which year?','["1945","1958","1968","1979"]',2,'The Nobel Memorial Prize in Economic Sciences was established by the Swedish central bank (Sveriges Riksbank) in 1968, not by Alfred Nobel''s will.','General Knowledge',4,TRUE),
('gkn8-q5','gk-note-8','Dr. Abdus Salam won the Nobel Prize in Physics in 1979. He was from which country?','["India","Pakistan","Bangladesh","Egypt"]',1,'Dr. Abdus Salam, a Pakistani theoretical physicist, won the 1979 Nobel Prize in Physics for his work on the electroweak unification theory.','General Knowledge',5,TRUE),
('gkn8-q6','gk-note-8','How many individuals can share a Nobel Prize at maximum?','["One only","Two","Three","Four"]',2,'A Nobel Prize can be awarded to a maximum of three individuals (and/or organizations in the case of the Peace Prize). It cannot be awarded posthumously.','General Knowledge',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- General Knowledge — gk-note-9 (G7 & G20)
-- ─────────────────────────────────────────────────────────────
('gkn9-q1','gk-note-9','The G7 was originally formed in which year?','["1965","1970","1975","1980"]',2,'The G7 was created in 1975. Russia was a member (making it the G8) from 1998 until it was expelled in 2014 over the annexation of Crimea.','General Knowledge',1,TRUE),
('gkn9-q2','gk-note-9','How many sovereign nations are in the G20 (excluding EU and African Union)?','["15","17","19","21"]',2,'The G20 consists of 19 sovereign nations plus the EU (and the African Union added in 2023), making 21 members total.','General Knowledge',2,TRUE),
('gkn9-q3','gk-note-9','G20 collectively represents approximately what percentage of global GDP?','["50%","60%","70%","80%"]',3,'The G20 represents approximately 80% of world GDP, 75% of global trade, and about two-thirds of the world''s population.','General Knowledge',3,TRUE),
('gkn9-q4','gk-note-9','Russia was suspended from the G8 in which year?','["2012","2014","2016","2022"]',1,'Russia was expelled from the G8 in 2014 following its annexation of Crimea, reverting the group to the G7.','General Knowledge',4,TRUE),
('gkn9-q5','gk-note-9','The G7 exclusively consists of which type of nations?','["Developing economies","BRICS nations","Advanced democratic economies","Asian-Pacific nations"]',2,'The G7 is an informal bloc of the world''s most advanced democracies: USA, UK, France, Germany, Italy, Canada, and Japan.','General Knowledge',5,TRUE),
('gkn9-q6','gk-note-9','The G20 was established in which year?','["1991","1995","1999","2001"]',2,'The G20 was established in 1999 as a response to the Asian financial crises of 1997–98, initially as a forum for finance ministers.','General Knowledge',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- English — eng-note-3 (Passive Voice)
-- ─────────────────────────────────────────────────────────────
('engn3-q1','eng-note-3','Convert to Passive Voice: "He is writing a letter."','["A letter was written by him.","A letter is being written by him.","A letter has been written by him.","A letter will be written by him."]',1,'Present Continuous Passive → "is/am/are + being + V3". So "He is writing" → "A letter is being written by him."','English',1,TRUE),
('engn3-q2','eng-note-3','What is the rule for converting a Modal sentence to Passive? "You must do this."','["This must been done by you.","This must be done by you.","This must being done by you.","This has must done by you."]',1,'Modal Passive rule: Modal + be + V3. "You must do this" → "This must be done by you."','English',2,TRUE),
('engn3-q3','eng-note-3','Convert to Passive Voice: "She has finished the work."','["The work is finished by her.","The work was finished by her.","The work has been finished by her.","The work had been finished by her."]',2,'Present Perfect Passive → "has/have + been + V3". So "She has finished the work" → "The work has been finished by her."','English',3,TRUE),
('engn3-q4','eng-note-3','What passive structure is used for an Imperative sentence? Convert: "Open the door."','["The door is opened.","The door was opened.","Let the door be opened.","The door should be opened."]',2,'Imperative Passive Rule: "Let + object + be + V3". "Open the door" → "Let the door be opened."','English',4,TRUE),
('engn3-q5','eng-note-3','In passive voice, the main verb is ALWAYS converted to its:','["1st form (Base)","2nd form (Past Simple)","3rd form (Past Participle)","Present Participle (-ing)"]',2,'The fundamental rule of passive voice: the main verb ALWAYS converts to its 3rd form (Past Participle), regardless of tense.','English',5,TRUE),
('engn3-q6','eng-note-3','Which preposition is generally added before the agent in passive voice?','["from","with","by","of"]',2,'The preposition "by" is generally added before the new agent (doer) in a passive voice sentence.','English',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- English — eng-note-4 (Indirect Speech)
-- ─────────────────────────────────────────────────────────────
('engn4-q1','eng-note-4','In indirect speech, "today" changes to:','["this day","that day","yesterday","the same day"]',1,'Time-word backshifting in indirect speech: "today" → "that day"; "yesterday" → "the previous day"; "tomorrow" → "the next day".','English',1,TRUE),
('engn4-q2','eng-note-4','Using the SON rule for pronoun changes, what does "O" (Object) change to?','["Changes according to 1st person of reporting verb","Changes according to 2nd person of reporting verb","Does not change","Changes to 3rd person always"]',1,'SON Rule: Subject changes with 1st person, Object changes with 2nd person, No change for 3rd person pronouns.','English',2,TRUE),
('engn4-q3','eng-note-4','Which tense does NOT change in indirect speech?','["Present Simple","Present Continuous","Past Perfect","Past Simple"]',2,'Past Perfect and Past Perfect Continuous do NOT change when converting to indirect speech — they are already at the furthest past form.','English',3,TRUE),
('engn4-q4','eng-note-4','For Yes/No questions in indirect speech, we use:','["that","which","if/whether","what"]',2,'Yes/No questions in indirect speech use "if" or "whether" as the conjunction, with normal subject-verb order (not question order).','English',4,TRUE),
('engn4-q5','eng-note-4','Convert to Indirect Speech: He said, "I am happy."','["He said that I am happy.","He said that he was happy.","He said that he is happy.","He told that he was happy."]',1,'Present Simple → Past Simple in indirect speech. "I am" → "he was". The reporting verb "said" also sets past backshift.','English',5,TRUE),
('engn4-q6','eng-note-4','In indirect speech, "here" changes to:','["this","that","there","those"]',2,'Place-word changes in indirect speech: "here" → "there"; "this" → "that"; "these" → "those".','English',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- English — eng-note-5 (One-Word Substitution & Word Roots)
-- ─────────────────────────────────────────────────────────────
('engn5-q1','eng-note-5','One-word substitution for "A person who does not believe in God":','["Agnostic","Atheist","Heretic","Pagan"]',1,'"Atheist" is a person who does not believe in the existence of God. An "Agnostic" believes the existence of God is unknown/unknowable.','English',1,TRUE),
('engn5-q2','eng-note-5','One-word substitution for "A life history written by oneself":','["Biography","Autobiography","Memoir","Epitaph"]',1,'"Autobiography" is a life story written by the person themselves. A "Biography" is written by someone else.','English',2,TRUE),
('engn5-q3','eng-note-5','The root "Omni" means:','["Half","One","All","Many"]',2,'"Omni" is a Latin root meaning "all". Hence: Omnipresent (present everywhere), Omnipotent (all-powerful), Omniscient (all-knowing).','English',3,TRUE),
('engn5-q4','eng-note-5','One-word for "A person who is indifferent to pleasure or pain":','["Hedonist","Stoic","Pessimist","Pacifist"]',1,'"Stoic" refers to a person who endures pain or hardship without showing feelings and without complaining — indifferent to pleasure or pain.','English',4,TRUE),
('engn5-q5','eng-note-5','One-word substitution for "Something that cannot be avoided":','["Inevitable","Implausible","Inexorable","Infallible"]',0,'"Inevitable" means certain to happen; unavoidable. "Inexorable" is close but means "relentless", while "Infallible" means "incapable of error".','English',5,TRUE),
('engn5-q6','eng-note-5','The root "Misan" means:','["Love","Hate","Fear","Study"]',1,'"Misan" (from Greek "misos") means hate. Hence: Misanthrope (one who hates mankind), Misogynist (one who hates women).','English',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- English — eng-note-6 (Advanced Vocabulary)
-- ─────────────────────────────────────────────────────────────
('engn6-q1','eng-note-6','What is the meaning of "Ephemeral"?','["Permanent","Lasting very short time","Very bright","Extremely large"]',1,'"Ephemeral" means lasting for a very short time. Its root comes from "ephemera" — short-lived insects that only live one day.','English',1,TRUE),
('engn6-q2','eng-note-6','Which word best describes someone who is "Garrulous"?','["Shy and reserved","Extremely talkative","Very intelligent","Physically strong"]',1,'"Garrulous" means excessively talkative, especially about trivial matters.','English',2,TRUE),
('engn6-q3','eng-note-6','The antonym of "Capricious" is:','["Fickle","Volatile","Consistent","Impulsive"]',2,'"Capricious" means given to sudden, unaccountable changes of mood. Its antonym is "Consistent" or "Stable".','English',3,TRUE),
('engn6-q4','eng-note-6','"Mitigate" means to:','["Make worse","Make less severe","Completely remove","Increase in size"]',1,'"Mitigate" means to make less severe, serious, or painful. It is used in context of pain, disaster, risk — not physical size.','English',4,TRUE),
('engn6-q5','eng-note-6','A "Sycophant" is someone who:','["Studies plant diseases","Hates authority","Acts obsequiously to gain favor","Is extremely pessimistic"]',2,'A "Sycophant" is a person who acts obsequiously (in an overly flattering way) toward someone important to gain personal advantage.','English',5,TRUE),
('engn6-q6','eng-note-6','"Pragmatic" means:','["Idealistic and unrealistic","Dealing with things sensibly and realistically","Easily influenced by others","Prone to exaggeration"]',1,'"Pragmatic" means dealing with things in a sensible and realistic way, based on practical considerations rather than theoretical ideals.','English',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- Mathematics — math-note-3 (Speed, Distance & Time)
-- ─────────────────────────────────────────────────────────────
('mathn3-q1','math-note-3','What is the basic formula for Distance?','["D = S + T","D = S × T","D = S / T","D = T / S"]',1,'The fundamental formula is Distance = Speed × Time (D = S × T). This is the core formula for all time-speed-distance problems.','Mathematics',1,TRUE),
('mathn3-q2','math-note-3','To convert km/h to m/s, multiply by:','["18/5","5/18","1/3.6 only","1000/60"]',1,'To convert km/h to m/s, multiply by 5/18. Conversely, to convert m/s to km/h, multiply by 18/5.','Mathematics',2,TRUE),
('mathn3-q3','math-note-3','For a round trip at speeds x and y (equal distances), the Average Speed is:','["(x + y) / 2","2xy / (x + y)","xy / (x + y)","√(xy)"]',1,'Average Speed for equal distances at different speeds = 2xy / (x + y). This is NOT a simple arithmetic mean.','Mathematics',3,TRUE),
('mathn3-q4','math-note-3','When a train crosses a stationary pole, the distance covered equals:','["Length of train + Length of pole","Length of train only","Length of platform","Zero"]',1,'When crossing a stationary point (pole/person), only the train''s own length must be covered. No platform length is added.','Mathematics',4,TRUE),
('mathn3-q5','math-note-3','Two trains traveling TOWARD each other have relative speed =','["S1 - S2 (subtract)","S1 + S2 (add)","S1 × S2","S1 / S2"]',1,'When objects move in OPPOSITE directions (toward each other), their relative speeds ADD together: Relative Speed = S1 + S2.','Mathematics',5,TRUE),
('mathn3-q6','math-note-3','A train 200m long passes a platform 300m long. The total distance covered by the train is:','["200 m","300 m","500 m","100 m"]',2,'When a train crosses a platform: Distance = Length of train + Length of platform = 200 + 300 = 500 m.','Mathematics',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- Mathematics — math-note-4 (LCM & HCF)
-- ─────────────────────────────────────────────────────────────
('mathn4-q1','math-note-4','The master property of LCM and HCF: For any two numbers A and B:','["LCM + HCF = A + B","LCM × HCF = A + B","LCM × HCF = A × B","LCM / HCF = A / B"]',2,'The most important property: Product of two numbers = LCM × HCF. That is, A × B = LCM(A,B) × HCF(A,B).','Mathematics',1,TRUE),
('mathn4-q2','math-note-4','The HCF of fractions is calculated as:','["LCM of numerators / HCF of denominators","HCF of numerators / LCM of denominators","HCF of numerators / HCF of denominators","LCM of numerators / LCM of denominators"]',1,'HCF of fractions = HCF of Numerators / LCM of Denominators. This is opposite of the LCM of fractions formula.','Mathematics',2,TRUE),
('mathn4-q3','math-note-4','Two numbers are co-prime if their HCF is:','["0","1","2","Either number itself"]',1,'Two numbers are called co-prime (or relatively prime) if their HCF = 1, meaning they share no common factor other than 1.','Mathematics',3,TRUE),
('mathn4-q4','math-note-4','3 bells ring at intervals of 4, 6, and 12 minutes. They will ring together again after:','["6 minutes","12 minutes","24 minutes","48 minutes"]',1,'Bell ringing problems use LCM. LCM(4, 6, 12) = 12. The bells will ring together again after 12 minutes.','Mathematics',4,TRUE),
('mathn4-q5','math-note-4','What is the LCM of 12 and 18?','["6","18","36","72"]',2,'LCM(12, 18): 12 = 2² × 3; 18 = 2 × 3². LCM = 2² × 3² = 4 × 9 = 36.','Mathematics',5,TRUE),
('mathn4-q6','math-note-4','The LCM of fractions is calculated as:','["HCF of numerators / LCM of denominators","LCM of numerators / HCF of denominators","LCM of numerators × HCF of denominators","Product of all numerators / all denominators"]',1,'LCM of fractions = LCM of Numerators / HCF of Denominators.','Mathematics',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- Mathematics — math-note-5 (Profit & Loss)
-- ─────────────────────────────────────────────────────────────
('mathn5-q1','math-note-5','Profit and Loss are always calculated on the:','["Selling Price (SP)","Marked Price (MP)","Cost Price (CP)","Average of SP and CP"]',2,'A critical rule: Profit % and Loss % are ALWAYS calculated on the Cost Price (CP), never on the Selling Price.','Mathematics',1,TRUE),
('mathn5-q2','math-note-5','Discount is always calculated on the:','["Cost Price (CP)","Selling Price (SP)","Marked Price (MP)","Profit amount"]',2,'Discount is ALWAYS calculated on the Marked Price (MP), not on the Selling Price or Cost Price.','Mathematics',2,TRUE),
('mathn5-q3','math-note-5','A shopkeeper buys an article for Rs. 200 and sells it for Rs. 250. What is the profit percentage?','["20%","25%","30%","50%"]',1,'Profit = SP - CP = 250 - 200 = Rs. 50. Profit% = (Profit / CP) × 100 = (50 / 200) × 100 = 25%.','Mathematics',3,TRUE),
('mathn5-q4','math-note-5','If MP = Rs. 500 and Discount = 20%, what is the Selling Price?','["Rs. 400","Rs. 450","Rs. 380","Rs. 420"]',0,'SP = MP × (100 - Discount%) / 100 = 500 × 80/100 = Rs. 400.','Mathematics',4,TRUE),
('mathn5-q5','math-note-5','Loss occurs when:','["SP > CP","SP = CP","CP > SP","CP = MP"]',2,'Loss occurs when the Cost Price (CP) is greater than the Selling Price (SP). Loss = CP - SP.','Mathematics',5,TRUE),
('mathn5-q6','math-note-5','A dishonest dealer uses a 900g weight instead of 1000g. His profit percentage (selling at CP) is:','["9%","10%","11.11%","12%"]',2,'Dishonest Dealer Profit% = Error / (True Value - Error) × 100 = 100 / (1000 - 100) × 100 = 100/900 × 100 ≈ 11.11%.','Mathematics',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- Computer Science — cs-note-2 (MS Office Shortcuts)
-- ─────────────────────────────────────────────────────────────
('csn2-q1','cs-note-2','Which keyboard shortcut starts a PowerPoint presentation FROM THE BEGINNING?','["Ctrl + F5","F5","Shift + F5","Alt + F5"]',1,'F5 starts a PowerPoint slide show from the very beginning. Shift + F5 starts from the current slide.','Computer Science',1,TRUE),
('csn2-q2','cs-note-2','What does Ctrl + K do in Microsoft Word?','["Cut","Copy","Insert Hyperlink","Justify text"]',2,'Ctrl + K inserts a hyperlink in Microsoft Word and Excel. This is a commonly tested exception.','Computer Science',2,TRUE),
('csn2-q3','cs-note-2','What does Ctrl + E do in Microsoft Word?','["Exit","Center align text","Edit document","Export to PDF"]',1,'Ctrl + E in Microsoft Word applies Center alignment to the selected text.','Computer Science',3,TRUE),
('csn2-q4','cs-note-2','Which shortcut moves the cursor to the BEGINNING of a document in MS Word?','["Ctrl + Home","Ctrl + Start","Ctrl + Begin","Ctrl + B"]',0,'Ctrl + Home moves the cursor to the absolute beginning of a Word document. Ctrl + End moves to the end.','Computer Science',4,TRUE),
('csn2-q5','cs-note-2','In MS Excel, which shortcut enables editing of the active cell?','["F1","F2","F3","F4"]',1,'F2 in Microsoft Excel allows you to edit the active (currently selected) cell directly.','Computer Science',5,TRUE),
('csn2-q6','cs-note-2','What does Ctrl + J do in Microsoft Word?','["Jump to page","Justify align text","Insert table","Open journal"]',1,'Ctrl + J in Microsoft Word applies Justify alignment, which aligns text to both the left and right margins.','Computer Science',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- Computer Science — cs-note-3 (Database Concepts)
-- ─────────────────────────────────────────────────────────────
('csn3-q1','cs-note-3','A Primary Key in a database must be:','["Null and non-unique","Unique and NOT NULL","Unique but can be NULL","Any data type, no restrictions"]',1,'A Primary Key must be UNIQUE (no two rows can have the same value) and NOT NULL (cannot be empty).','Computer Science',1,TRUE),
('csn3-q2','cs-note-3','In 1st Normal Form (1NF), the main requirement is:','["No transitive dependencies","No partial dependencies","Atomic (indivisible) values / no repeating groups","BCNF compliance"]',2,'1NF requires that all column values be atomic (cannot be divided further) and that there are no repeating groups within a row.','Computer Science',2,TRUE),
('csn3-q3','cs-note-3','A Foreign Key in one table points to the _____ in another table.','["Foreign Key","Primary Key","Candidate Key","Composite Key"]',1,'A Foreign Key establishes a referential link between two tables by pointing to the Primary Key in the referenced (parent) table.','Computer Science',3,TRUE),
('csn3-q4','cs-note-3','Which SQL command belongs to DDL (Data Definition Language)?','["SELECT","INSERT","UPDATE","CREATE"]',3,'DDL commands define database structure: CREATE, ALTER, DROP. DML commands manipulate data: SELECT, INSERT, UPDATE, DELETE.','Computer Science',4,TRUE),
('csn3-q5','cs-note-3','3rd Normal Form (3NF) requires elimination of:','["Repeating groups","Partial dependencies","Transitive dependencies","Null values"]',2,'3NF requires the table to be in 2NF AND have no transitive dependencies (non-key attributes must depend only on the primary key).','Computer Science',5,TRUE),
('csn3-q6','cs-note-3','Which SQL command retrieves data from a table?','["INSERT","CREATE","SELECT","ALTER"]',2,'SELECT is the SQL DML command used to retrieve/query data from one or more tables. It is the most commonly used SQL command.','Computer Science',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- Computer Science — cs-note-4 (Cybersecurity)
-- ─────────────────────────────────────────────────────────────
('csn4-q1','cs-note-4','What is a Phishing attack?','["Overloading a server with traffic","Fraudulent attempts via email to obtain sensitive info","Encrypting data for ransom","Exploiting SQL input fields"]',1,'Phishing involves fraudulent emails/websites disguised as trustworthy entities to trick users into revealing sensitive information.','Computer Science',1,TRUE),
('csn4-q2','cs-note-4','DDoS (Distributed Denial of Service) attacks aim to:','["Steal user credentials","Encrypt files for ransom","Overwhelm a server/network with traffic to crash it","Insert malicious SQL code"]',2,'A DDoS attack floods a target server with an overwhelming volume of fake traffic from many sources, causing it to crash or become unavailable.','Computer Science',2,TRUE),
('csn4-q3','cs-note-4','Ransomware is a type of malware that:','["Steals browser history","Spreads through USB drives only","Encrypts user data and demands payment for decryption","Slows down the CPU"]',2,'Ransomware encrypts the victim''s data and demands a ransom (usually cryptocurrency) in exchange for the decryption key.','Computer Science',3,TRUE),
('csn4-q4','cs-note-4','An SQL Injection attack involves:','["Sending too many login requests","Inserting malicious SQL into input fields to manipulate databases","Cracking encryption using brute force","Sending fake emails to users"]',1,'SQL Injection inserts or "injects" malicious SQL code into input fields (e.g., login forms) to manipulate the backend database.','Computer Science',4,TRUE),
('csn4-q5','cs-note-4','A Firewall''s primary function is to:','["Speed up internet connection","Encrypt all data transmissions","Monitor and control network traffic based on security rules","Compress files for storage"]',2,'A Firewall is a network security system that monitors and controls incoming and outgoing network traffic based on predetermined security rules.','Computer Science',5,TRUE),
('csn4-q6','cs-note-4','Which type of malware replicates itself WITHOUT requiring a host program?','["Virus","Trojan","Worm","Spyware"]',2,'A Worm is self-replicating malware that spreads across networks WITHOUT needing to attach to a host program (unlike a Virus).','Computer Science',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- Islamiat — isl-note-1 (Holy Quran)
-- ─────────────────────────────────────────────────────────────
('isln1-q1','isl-note-1','The Holy Quran has how many total Surahs?','["99","110","114","120"]',2,'The Holy Quran consists of 114 Surahs — 86 Makki (revealed in Makkah) and 28 Madni (revealed in Madinah).','Islamiat',1,TRUE),
('isln1-q2','isl-note-1','Which is the longest Surah of the Holy Quran?','["Surah Al-Fatiha","Surah Al-Imran","Surah Al-Baqarah","Surah An-Nisa"]',2,'Surah Al-Baqarah is the longest Surah of the Holy Quran, containing 286 verses. Surah Al-Kauthar (3 verses) is the shortest.','Islamiat',2,TRUE),
('isln1-q3','isl-note-1','Which Surah does NOT begin with Bismillah?','["Surah Al-Fatiha","Surah An-Naml","Surah Al-Tauba","Surah Al-Baqarah"]',2,'Surah Al-Tauba (Surah 9) is the only Surah that does not begin with Bismillah. Surah An-Naml contains Bismillah twice.','Islamiat',3,TRUE),
('isln1-q4','isl-note-1','The first revelation of the Holy Quran occurred in which cave?','["Cave of Thawr","Cave of Hira","Cave of Uhud","Cave of Badr"]',1,'The first revelation (Surah Al-Alaq, verses 1–5) was revealed to Prophet Muhammad (PBUH) in the Cave of Hira near Makkah in 610 CE.','Islamiat',4,TRUE),
('isln1-q5','isl-note-1','The Holy Quran is divided into how many Paras (Juz)?','["20","25","30","40"]',2,'The Holy Quran is divided into 30 equal parts called Paras (in Persian/Urdu) or Juz (in Arabic) for ease of recitation.','Islamiat',5,TRUE),
('isln1-q6','isl-note-1','The last Surah of the Holy Quran is:','["Surah Al-Ikhlas","Surah Al-Falaq","Surah An-Nas","Surah Al-Fatiha"]',2,'Surah An-Nas (Surah 114) is the last Surah of the Holy Quran in its compiled arrangement.','Islamiat',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- Islamiat — isl-note-2 (Seerat-un-Nabi & Hijrah)
-- ─────────────────────────────────────────────────────────────
('isln2-q1','isl-note-2','The Hijrah (migration of the Prophet PBUH) took place in which year?','["610 CE","615 CE","622 CE","630 CE"]',2,'The Hijrah took place in 622 CE when the Prophet (PBUH) migrated from Makkah to Madinah. This event marks the beginning of the Islamic (Hijri) calendar.','Islamiat',1,TRUE),
('isln2-q2','isl-note-2','Prophet Muhammad (PBUH) received the first revelation at what age?','["35","38","40","45"]',2,'The Prophet (PBUH) received his first revelation at the age of 40 in the Cave of Hira, approximately 610 CE.','Islamiat',2,TRUE),
('isln2-q3','isl-note-2','The "Year of Sorrow" (Aam-ul-Huzn) refers to the deaths of:','["Hazrat Ali and Hazrat Fatima","Hazrat Khadija and Abu Talib","Hazrat Umar and Hazrat Usman","Hazrat Hamza and Abu Jahl"]',1,'The Year of Sorrow refers to the deaths of the Prophet''s beloved wife Hazrat Khadija (RA) and his uncle Abu Talib in the same year.','Islamiat',3,TRUE),
('isln2-q4','isl-note-2','The Charter of Madinah is historically significant as:','["The first Islamic military treaty","The first written constitution creating a pluralistic state","The peace agreement with Makkah","The rules governing Hajj pilgrimage"]',1,'The Charter of Madinah was the world''s first written constitution, establishing a multi-religious, pluralistic state in Madinah.','Islamiat',4,TRUE),
('isln2-q5','isl-note-2','Prophet Muhammad (PBUH) passed away in which Hijri year?','["9 AH","10 AH","11 AH","12 AH"]',2,'The Prophet (PBUH) passed away in 11 AH (632 CE) in Madinah, where he is buried in Masjid-e-Nabawi.','Islamiat',5,TRUE),
('isln2-q6','isl-note-2','The Islamic Hijri calendar begins with the year of:','["The Prophet''s birth","The first revelation","The Hijrah (migration to Madinah)","The Battle of Badr"]',2,'The Islamic Hijri calendar is calculated from the year of the Hijrah (622 CE) — the Prophet''s (PBUH) migration from Makkah to Madinah.','Islamiat',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- Islamiat — isl-note-3 (Khulafa-e-Rashideen)
-- ─────────────────────────────────────────────────────────────
('isln3-q1','isl-note-3','Which Caliph suppressed the Ridda (apostasy) wars after the Prophet''s death?','["Hazrat Umar (RA)","Hazrat Abu Bakr (RA)","Hazrat Uthman (RA)","Hazrat Ali (RA)"]',1,'Hazrat Abu Bakr (RA), the 1st Caliph, suppressed the Ridda wars (632–633 CE) and also initiated the first formal compilation of the Quran.','Islamiat',1,TRUE),
('isln3-q2','isl-note-3','Hazrat Umar (RA) was martyred by whom?','["Abu Jahl","Abu Lu''lu''a (Fairuz)","Ibn Muljam","A rebel group"]',1,'Hazrat Umar ibn al-Khattab (RA) was assassinated by Abu Lu''lu''a (Fairuz), a Persian slave, in 644 CE while leading Fajr prayer.','Islamiat',2,TRUE),
('isln3-q3','isl-note-3','Which Caliph standardized the Holy Quran into a single unified dialect?','["Hazrat Abu Bakr (RA)","Hazrat Umar (RA)","Hazrat Uthman (RA)","Hazrat Ali (RA)"]',2,'Hazrat Uthman (RA) standardized the Quranic text into the Qurayshi dialect and distributed copies to all provinces, burning variant readings.','Islamiat',3,TRUE),
('isln3-q4','isl-note-3','Hazrat Ali (RA) moved the capital of the Islamic Caliphate from Madinah to:','["Damascus","Baghdad","Kufa","Basra"]',2,'Hazrat Ali (RA), the 4th Caliph, moved the caliphate''s capital from Madinah to Kufa (in modern-day Iraq) during his reign.','Islamiat',4,TRUE),
('isln3-q5','isl-note-3','The Battle of Jamal and Battle of Siffin occurred during whose caliphate?','["Hazrat Abu Bakr (RA)","Hazrat Umar (RA)","Hazrat Uthman (RA)","Hazrat Ali (RA)"]',3,'Both the Battle of Jamal (656 CE) and the Battle of Siffin (657 CE) were civil conflicts that occurred during Hazrat Ali''s (RA) caliphate.','Islamiat',5,TRUE),
('isln3-q6','isl-note-3','Hazrat Umar (RA) established which administrative system during his caliphate?','["Shura system","Diwan (administrative departments)","Bay''ah system","Waqf system"]',1,'Hazrat Umar (RA) established the Diwan — organized administrative departments for governance, army, and treasury — along with the police force and postal system.','Islamiat',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- Islamiat — isl-note-4 (Five Pillars of Islam)
-- ─────────────────────────────────────────────────────────────
('isln4-q1','isl-note-4','In which Hijri year did Hajj become obligatory?','["2 AH","5 AH","7 AH","9 AH"]',3,'Hajj was made obligatory in 9 AH. The Prophet (PBUH) performed his only (Farewell) Hajj in 10 AH.','Islamiat',1,TRUE),
('isln4-q2','isl-note-4','Zakat is obligatory at the rate of _____ on accumulated wealth over a lunar year.','["1%","2%","2.5%","5%"]',2,'Zakat (obligatory almsgiving) is fixed at 2.5% on accumulated wealth (above the Nisab threshold) held for a full lunar (Hijri) year.','Islamiat',2,TRUE),
('isln4-q3','isl-note-4','Salah (prayer) became obligatory during the night of:','["Laylat-ul-Qadr","Mi''raj (Isra wal Mi''raj)","Shab-e-Barat","Laylat-ul-Jumu''ah"]',1,'The five daily prayers (Salah) were made obligatory during the miraculous night journey of Mi''raj (Isra wal Mi''raj).','Islamiat',3,TRUE),
('isln4-q4','isl-note-4','Sawm (fasting) during Ramadan became obligatory in:','["1 AH","2 AH","3 AH","5 AH"]',1,'Fasting (Sawm) during the month of Ramadan was made obligatory in 2 AH, along with Zakat and the institutionalization of Salah.','Islamiat',4,TRUE),
('isln4-q5','isl-note-4','The Shahadah (declaration of faith) states belief in:','["Five Pillars only","Oneness of Allah and prophethood of Muhammad (PBUH)","The Day of Judgment only","All six articles of faith"]',1,'The Shahadah declares: "There is no god but Allah, and Muhammad (PBUH) is His messenger" — affirming monotheism and prophethood.','Islamiat',5,TRUE),
('isln4-q6','isl-note-4','Hajj is obligatory once in a lifetime for those who are:','["Male Muslims only","Adult Muslims with financial ability only","Physically and financially able","All Muslims regardless of ability"]',2,'Hajj is obligatory once in a lifetime for every adult Muslim who is both physically capable of the journey AND financially able to afford it.','Islamiat',6,TRUE),

-- ─────────────────────────────────────────────────────────────
-- Islamiat — isl-note-5 (Battles of Islam)
-- ─────────────────────────────────────────────────────────────
('isln5-q1','isl-note-5','In which Hijri year did the Battle of Badr take place?','["1 AH","2 AH","3 AH","5 AH"]',1,'The Battle of Badr took place in 2 AH (624 CE) — the first major battle of Islam in which 313 Muslims defeated a Quraish army of ~1,000.','Islamiat',1,TRUE),
('isln5-q2','isl-note-5','Which companion was martyred in the Battle of Uhud?','["Hazrat Ali (RA)","Hazrat Hamza (RA)","Hazrat Umar (RA)","Hazrat Bilal (RA)"]',1,'Hazrat Hamza ibn Abdul Muttalib (RA), the uncle of the Prophet (PBUH) and "Lion of Allah", was martyred in the Battle of Uhud (3 AH).','Islamiat',2,TRUE),
('isln5-q3','isl-note-5','Who suggested digging the trench (Khandaq) for the Battle of Khandaq?','["Hazrat Umar (RA)","Hazrat Ali (RA)","Salman Farsi (RA)","Hazrat Abu Bakr (RA)"]',2,'Salman Farsi (RA), a Persian companion, suggested the strategy of digging a trench around Madinah for the Battle of Khandaq (5 AH).','Islamiat',3,TRUE),
('isln5-q4','isl-note-5','The Treaty of Hudaybiyyah (6 AH) was a peace agreement with:','["Jewish tribes of Madinah","Byzantine Empire","The Quraish of Makkah","Persian Empire"]',2,'The Treaty of Hudaybiyyah (6 AH) was a 10-year peace treaty signed between the Muslims and the Quraish of Makkah.','Islamiat',4,TRUE),
('isln5-q5','isl-note-5','The Conquest of Makkah took place in:','["6 AH","7 AH","8 AH","9 AH"]',2,'The Conquest of Makkah occurred in 8 AH (630 CE). It was a largely peaceful takeover after the Quraish violated the Treaty of Hudaybiyyah.','Islamiat',5,TRUE),
('isln5-q6','isl-note-5','The Battle of Badr involved how many Muslim fighters against the Quraish?','["100 Muslims vs 500 Quraish","313 Muslims vs ~1,000 Quraish","500 Muslims vs 2,000 Quraish","200 Muslims vs 800 Quraish"]',1,'313 Muslims (poorly equipped) faced a well-armed Quraish army of approximately 1,000 at the Battle of Badr — a decisive Muslim victory.','Islamiat',6,TRUE)

ON CONFLICT (id) DO UPDATE SET
  note_topic_id  = EXCLUDED.note_topic_id,
  question       = EXCLUDED.question,
  options        = EXCLUDED.options,
  correct_answer = EXCLUDED.correct_answer,
  explanation    = EXCLUDED.explanation,
  category       = EXCLUDED.category,
  sort_order     = EXCLUDED.sort_order,
  is_public      = EXCLUDED.is_public;

-- ─────────────────────────────────────────────────────────────
-- Verification query (run after INSERT to confirm row counts):
-- SELECT note_topic_id, COUNT(*) as mcq_count
-- FROM public.note_topic_mcqs
-- GROUP BY note_topic_id
-- ORDER BY note_topic_id;
-- Expected: 28 rows, each with count = 6
-- ─────────────────────────────────────────────────────────────
