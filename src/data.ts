import { Course, WhyUsPoint, ProcessStep, PricingPlan, Testimonial, FAQItem, BlogPost } from "./types";

import logoImg from "./assets/images/truth_quran_new_logo_1784203145448.jpg";
import kidsLearningBg from "./assets/images/kids_quran_learning_1784116863937.jpg";
import teacherBg from "./assets/images/online_quran_teacher_1784116886285.jpg";
import femaleTeacherBg from "./assets/images/female_quran_tutor_1784119152017.jpg";
import tajweedMasteryBg from "./assets/images/tajweed_mastery_art_1784119171753.jpg";

// New specialized individual assets
import sheikhAbdulRahmanImg from "./assets/images/sheikh_abdul_rahman_1784121404292.jpg";
import ustadhHafizZainImg from "./assets/images/ustadh_hafiz_zain_1784121424995.jpg";
import ustadhaMaryamImg from "./assets/images/female_quran_tutor_1784119152017.jpg";

import blogHifzTipsImg from "./assets/images/kids_quran_learning_1784116863937.jpg";
import blogTajweedRulesImg from "./assets/images/blog_tajweed_rules_1784121484956.jpg";
import blogTafseerTranslationImg from "./assets/images/parent_kids_quran_1784121554278.jpg";
import developerAbbasAliImg from "./assets/images/developer_abbas_ali_1784201380694.jpg";

export const academyContact = {
  phone: "+92 321 9347471",
  email: "muhammadzain92624@gmail.com",
  address: "Altaf Colony, Ranjar Head Quarter, Lahore Cantt, Pakistan",
  whatsapp: "https://wa.me/+923219347471",
  facebook: "https://www.facebook.com/truthquran?mibextid=ZbWKwL",
  instagram: "https://www.instagram.com/truth_quran_786?igsh=MTM1MmFvc3dtMHFhMQ==",
  linkedin: "https://www.linkedin.com/in/truth-quran-online-quran-academy-65688b423?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  developerName: "Abbas Ali",
  developerRole: "Full Stack Developer",
  developerGithub: "https://github.com",
  developerAvatar: developerAbbasAliImg
};

export const coursesData: Course[] = [
  {
    id: "noorani-qaida",
    title: "Noorani Qaida",
    arabicGlyph: "ا ب ت",
    tag: "Foundation",
    description: "The ideal starting point for absolute beginners and young children. Master the Arabic alphabet, phonetic rules, and join letters seamlessly with professional guidance.",
    difficulty: "Beginner",
    image: kidsLearningBg
  },
  {
    id: "tajweed-mastery",
    title: "Tajweed Mastery",
    arabicGlyph: "قُرْآن",
    tag: "Art of Recitation",
    description: "Learn the rules of Tajweed (Makharij, Sifat, Madd, and Ghunnah) to recite the Holy Quran with perfect pronunciation, mimicking the traditional scholars of Jamia Naeemia Lahore.",
    difficulty: "Intermediate",
    image: tajweedMasteryBg
  },
  {
    id: "quran-hifz",
    title: "Quran Memorization (Hifz)",
    arabicGlyph: "حِفْظ",
    tag: "Elite Program",
    description: "A structured, step-by-step memorization course utilizing proven traditional retention techniques. Includes rigorous revision (Mutashabihat) plans under certified Huffadh.",
    difficulty: "Advanced",
    image: kidsLearningBg
  },
  {
    id: "quran-tafseer",
    title: "Quran Translation & Tafseer",
    arabicGlyph: "تَفْسِير",
    tag: "Deep Meaning",
    description: "Dive deep into the theological, historical, and linguistic context of Quranic verses. Understand the divine wisdom and translate classical Arabic phrases to elevate your daily Salah.",
    difficulty: "Advanced",
    image: tajweedMasteryBg
  },
  {
    id: "arabic-language",
    title: "Arabic Language Course",
    arabicGlyph: "عَرَبِيّ",
    tag: "Classical Fusha",
    description: "Master classical Quranic Arabic (Fusha). This course builds grammar, vocabulary, reading, and listening comprehension so you can understand the Quran in its native tongue.",
    difficulty: "Intermediate",
    image: teacherBg
  },
  {
    id: "islamic-studies",
    title: "Islamic Studies for Kids",
    arabicGlyph: "أَدَب",
    tag: "Youth Care",
    description: "A comprehensive curriculum teaching fundamental Islamic beliefs (Aqeedah), practical jurisprudence (Fiqh/Salah), beautiful manners (Adab), and historical Prophetic stories.",
    difficulty: "Beginner",
    image: kidsLearningBg
  }
];

export const whyUsData: WhyUsPoint[] = [
  {
    id: "one-on-one",
    title: "1-on-1 Personalized Classes",
    description: "Receive full undivided attention from your dedicated tutor. Lessons are paced entirely according to your unique learning speed and capacity.",
    iconName: "UserCheck"
  },
  {
    id: "female-tutors",
    title: "Female Tutors Available",
    description: "We host certified, highly qualified female scholars and Huffadha for our sisters, girls, and young children to ensure maximum comfort and respect.",
    iconName: "Shield"
  },
  {
    id: "flexible-scheduling",
    title: "Flexible 24/7 Scheduling",
    description: "Study at times that suit you. We accommodate busy work shifts, school routines, and global timezones across USA, UK, Europe, and Asia.",
    iconName: "Calendar"
  },
  {
    id: "certified-scholars",
    title: "Certified Native Tutors",
    description: "All teachers are certified with traditional Ijazah credentials, possessing deep academic knowledge and stellar English/Arabic communication skills.",
    iconName: "Award"
  }
];

export const processSteps: ProcessStep[] = [
  {
    stepNumber: 1,
    title: "Free Evaluation Class",
    description: "Book your risk-free 30-minute trial session where our expert senior tutor evaluates your current recitation level, goals, and style."
  },
  {
    stepNumber: 2,
    title: "Customized Learning Plan",
    description: "Our academic committee drafts an optimal customized roadmap, selecting the most suitable books, materials, and learning goals."
  },
  {
    stepNumber: 3,
    title: "Choose Schedule & Tutor",
    description: "Select your preferred weekly days, active hours, and pick between our native male or female certified instructors."
  },
  {
    stepNumber: 4,
    title: "Begin Your Quranic Journey",
    description: "Gain lifetime access to your digital dashboard, attend live lessons exclusively via Zoom, WhatsApp, or Google Meet, and track weekly progress reports."
  }
];

export const pricingPlans: PricingPlan[] = [
  {
    id: "tier-1",
    name: "2 Days / Week",
    price: "$30",
    period: "month",
    features: [
      "8 Interactive 1-on-1 Lessons",
      "30 Minutes Per Lesson",
      "Personalized Student Dashboard",
      "Male/Female Tutors Option",
      "Monthly Progress Reports",
      "24/7 Flexible Rescheduling",
      "Certificate of Completion"
    ]
  },
  {
    id: "tier-2",
    name: "3 Days / Week",
    price: "$45",
    period: "month",
    features: [
      "12 Interactive 1-on-1 Lessons",
      "30 Minutes Per Lesson",
      "Custom Syllabus & Homework Files",
      "Prioritized Tutor Matching",
      "Weekly Progress Quizzes",
      "Complementary Parent-Teacher Meetings",
      "Certificate of Excellence (Ijazah Track)"
    ],
    isPopular: true
  },
  {
    id: "tier-3",
    name: "5 Days / Week",
    price: "$60",
    period: "month",
    features: [
      "20 Interactive 1-on-1 Lessons",
      "30 Minutes Per Lesson",
      "High-Intensity Learning Track",
      "Daily Memorization Logs & Audits",
      "Unlimited Rescheduling Privileges",
      "Dedicated Academic Coach Access",
      "Full Ijazah & Sanad Path Preparation"
    ]
  }
];

export const testimonialsData: Testimonial[] = [
  {
    id: "t1",
    name: "Sarah Jenkins",
    quote: "Finding a female Quran teacher with such perfect English and deep Tajweed knowledge was a blessing for my daughters. They look forward to their class every week!",
    rating: 5,
    country: "London, UK"
  },
  {
    id: "t2",
    name: "Tariq Mahmood",
    quote: "I wanted to memorize Surah Al-Baqarah but had a packed work schedule. The 24/7 flexibility at Truth Quran Academy allowed me to accomplish this within 8 months. Outstanding!",
    rating: 5,
    country: "Houston, USA"
  },
  {
    id: "t3",
    name: "Amina Al-Farsi",
    quote: "The Arabic language course is absolute gold. Unlike grammar-only courses, they taught me to converse fluently and read classical Tafseer scriptures within three terms.",
    rating: 5,
    country: "Toronto, Canada"
  },
  {
    id: "t4",
    name: "Bilal & Maryam",
    quote: "We enrolled our 7-year-old son in the Noorani Qaida course. His teacher is incredibly patient, using fun quizzes and animations that keep him absolutely engaged.",
    rating: 5,
    country: "Sydney, Australia"
  },
  {
    id: "t5",
    name: "Sami Yusuf",
    quote: "The 1-on-1 structure is unmatched. No wasting time in group distractions. My teacher corrected microscopic mistakes in my recitation that I didn't even know existed.",
    rating: 5,
    country: "Birmingham, UK"
  }
];

export const faqItems: FAQItem[] = [
  {
    id: "f1",
    question: "Who are the instructors at Truth Quran Academy?",
    answer: "Our instructors are highly qualified scholars, certified Huffadh, and graduates from world-renowned Islamic universities such as Jamia Naeemia Lahore, Umm Al-Qura, and leading institutes in Pakistan. They undergo thorough vetting and pedagogical training, and possess outstanding English and Arabic communication skills suitable for students of all ages."
  },
  {
    id: "f2",
    question: "How do the 1-on-1 online classes take place?",
    answer: "Classes are conducted live exclusively over Zoom, WhatsApp, or Google Meet. The teacher shares a digital copy of the Quran, Noorani Qaida, or Islamic worksheets, utilizing digital pens to draw, highlight, and guide pronunciation in real-time. It is highly interactive and matches the physical learning experience perfectly."
  },
  {
    id: "f3",
    question: "Can we customize class timings or reschedule lessons?",
    answer: "Absolutely. We understand that students have different shifts, school schedules, or family duties. We operate 24/7. When you register, you specify your ideal time windows. If you ever need to reschedule, you can simply notify your teacher 12–24 hours in advance, and the class will be shifted at no extra charge."
  },
  {
    id: "f4",
    question: "Do you have certified female teachers for girls and sisters?",
    answer: "Yes, we have a large faculty of highly specialized, qualified female scholars and Huffadha. Sisters can request a female teacher for themselves, and parents can choose female teachers for young children to ensure absolute comfort, security, and proper learning environments."
  },
  {
    id: "f5",
    question: "Is there a free trial class? How do we enroll?",
    answer: "Yes, we offer a 100% free, 30-minute trial evaluation session. This allows you to experience our teaching style, meet your prospective instructor, and get an honest assessment of your current pronunciation level. To enroll, click any 'Free Trial' button, fill out our short contact form, or message us directly on WhatsApp."
  }
];

export const blogPostsData: BlogPost[] = [
  {
    id: "hifz-tips-success",
    title: "5 Proven Strategies to Accelerate Your Quran Memorization (Hifz)",
    excerpt: "Embarking on the spiritual journey of memorizing the Holy Quran requires dedication, strategy, and consistency. Discover five traditional Jamia Naeemia Lahore techniques to double your retention rate.",
    category: "Quran Memorization Tips",
    coverImage: blogHifzTipsImg,
    author: {
      name: "Sheikh Abdul Rahman",
      avatar: sheikhAbdulRahmanImg,
      role: "Head of Quranic Studies"
    },
    date: "July 12, 2026",
    readTime: "6 min read",
    tags: ["Hifz", "Quran Memorization", "Spiritual Tips", "Brain Power"],
    arabicVerse: {
      arabic: "وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ",
      translation: "And We have indeed made the Quran easy to understand and remember, then is there any that will remember?",
      citation: "Surah Al-Qamar, 54:17"
    },
    content: `
<p>Embarking on the journey of Quranic memorization (Hifz) is one of the most noble spiritual pursuits a believer can undertake. However, many students face struggles with memory retention, distraction, and scheduling.</p>

<h3>1. Absolute Sincerity (Ikhlas)</h3>
<p>The foundation of any Quranic endeavor is purifying your intention. When memorizing, make your sole objective seeking the pleasure of Allah SWT. Sincerity opens divine doors of memory expansion and eases cognitive blocks.</p>

<h3>2. Consistent Time and Place</h3>
<p>Your brain is highly responsive to environmental cues. Establishing a dedicated study space and a static time—ideally right after Fajr prayers when the mind is fully rested and atmospheric oxygen levels are high—dramatically improves learning speeds.</p>

<blockquote>
  "And We have indeed made the Quran easy to understand and remember, then is there any that will remember?"
  <cite>Surah Al-Qamar, 54:17</cite>
</blockquote>

<h3>3. The 'Repetition of Five' (Traditional Method)</h3>
<p>A proven Jamia Naeemia Lahore method is to recite a newly learned verse 5 times while looking at the script, then 5 times from memory, and then repeat the cycle with the entire page before going to sleep. This shifts information from short-term hippocampus pathways into the long-term neocortex memory.</p>

<h3>4. Master Tajweed Rules First</h3>
<p>Never memorize a verse with incorrect pronunciation. Unlearning a faulty recitation is twice as difficult as memorizing from scratch. Always read your new portion to a certified tutor before attempting to commit it to memory.</p>

<h3>5. Daily Revision (Murooja'ah)</h3>
<p>The Prophet Muhammad (peace be upon him) compared the Quran in the memory to a camel that might run away if not bound. A golden rule is: 'A page of revision is worth ten pages of new memorization.' Always prioritize revising your old portions before adding even a single new verse.</p>
`
  },
  {
    id: "tajweed-importance",
    title: "Understanding the Essential Rules of Tajweed: Why Pronunciation Matters",
    excerpt: "Tajweed is not merely an optional decorative science—it is an obligation to preserve the semantic integrity of Allah's Words. Learn the absolute essential rules every Muslim must master.",
    category: "Tajweed Rules",
    coverImage: blogTajweedRulesImg,
    author: {
      name: "Ustadh Hafiz Zain",
      avatar: ustadhHafizZainImg,
      role: "Lead Tajweed Instructor"
    },
    date: "June 28, 2026",
    readTime: "5 min read",
    tags: ["Tajweed", "Quran Rules", "Makharij", "Pronunciation"],
    arabicVerse: {
      arabic: "أَوْ زِدْ عَلَيْهِ وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا",
      translation: "And recite the Quran with measured, beautiful recitation (Tajweed).",
      citation: "Surah Al-Muzzammil, 73:4"
    },
    content: `
<p>When reciting the Holy Quran, every letter carries deep spiritual weight. Mispronouncing a single syllable can completely alter the theological meaning of a verse. This is why mastering the science of Tajweed is paramount.</p>

<h3>What is Tajweed?</h3>
<p>Linguistically, Tajweed means 'proficiency' or 'doing something beautifully.' Historically, it is the systematic rules governing the recitation of the Quran as transmitted from the Angel Jibreel to the Prophet Muhammad (peace be upon him).</p>

<blockquote>
  "And recite the Quran with measured, beautiful recitation (Tajweed)."
  <cite>Surah Al-Muzzammil, 73:4</cite>
</blockquote>

<h3>The Core Elements of Tajweed</h3>
<ol>
  <li><strong>Makharij al-Huroof (Articulation Points):</strong> Finding the exact physical origin of each letter in the throat, tongue, lips, or nasal cavity. For example, distinguishing between standard 'Ha' and deep pharyngeal 'Haa'.</li>
  <li><strong>Sifat al-Huroof (Characteristics):</strong> How the letter behaves during pronunciation—such as whether breath should flow (Hams) or be trapped (Jahr).</li>
  <li><strong>Ahkam al-Noon (Rules of Noon Sakinah):</strong> Managing the nasal 'noon' sounds when meeting specific subsequent letters, including merging (Idghaam) or hiding (Ikhfaa).</li>
</ol>

<h3>Why it Matters for Everyday Prayer</h3>
<p>During the recitation of Surah Al-Fatihah in daily Salah, substituting one letter for another can transform a prayer of praise into an incorrect statement. Learning Tajweed is not a luxury—it is an essential duty to protect our worship and respect the divine scripture.</p>
`
  },

  {
    id: "benefits-of-translation",
    title: "The Transformative Power of Reading Quran with Tafseer & Understanding",
    excerpt: "Reciting Arabic is highly rewarding, but translating the text unleashes its true transformative power. Read why understanding context elevates your Salah and personal ethics.",
    category: "Islamic Studies",
    coverImage: blogTafseerTranslationImg,
    author: {
      name: "Dr. Ahmed Kamal",
      avatar: sheikhAbdulRahmanImg,
      role: "Senior Scholar"
    },
    date: "May 29, 2026",
    readTime: "8 min read",
    tags: ["Tafseer", "Arabic Translation", "Spiritual Transformation", "Quran Meaning"],
    arabicVerse: {
      arabic: "كِتَابٌ أَنزَلْنَاهُ إِلَيْكَ مُبَارَكٌ لِّيَدَّبَّرُوا آيَاتِهِ",
      translation: "This is a blessed Book which We have revealed to you, so that they may contemplate its verses.",
      citation: "Surah Sad, 38:29"
    },
    content: `
<p>Many Muslims recite several pages of the Quran daily without understanding a single word. While every letter brings blessings, the core purpose of the Quran's revelation is intellectual reflection, spiritual transformation, and behavioral reform.</p>

<h3>The Goal of Revelation: Tadabbur</h3>
<p>Allah SWT says in Surah Sad: 'This is a blessed Book which We have revealed to you, so that they may contemplate its verses.' This contemplation is known as Tadabbur. It requires translating the Arabic words and reading the Tafseer (exegesis) behind them.</p>

<blockquote>
  "This is a blessed Book which We have revealed to you, so that they may contemplate its verses."
  <cite>Surah Sad, 38:29</cite>
</blockquote>

<h3>3 Key Benefits of Understanding the Quran:</h3>
<ul>
  <li><strong>Elevated Concentration (Khushu) in Salah:</strong> When you comprehend the verses your Imam is reciting, your mind stops drifting to worldly thoughts, and your prayers transform into intimate spiritual dialogues with your Creator.</li>
  <li><strong>Ethical Alignment:</strong> Knowing the moral commands, historical warnings, and legal directives translates directly into how you handle business, treat parents, and support your local community.</li>
  <li><strong>Intellectual Conviction:</strong> In an era of doubt and complex ideologies, studying Tafseer equips your intellect with answers, reinforcing your faith on logical, structural foundations.</li>
</ul>

<p>Do not let your relationship with the Quran stop at sound. Elevate it to understanding, and watch your daily life transform.</p>
`
  }
];
