import type { Course, SchoolEvent, SiteSettings } from "./types";

const LEVEL_FEE = "Ask on WhatsApp";

export const DEFAULT_SETTINGS: SiteSettings = {
  schoolName: "The Sur School",
  tagline: "Piano, guitar and ukulele lessons, online and at your home.",
  heroHeading: "Find your sur.",
  heroSubheading:
    "Piano, guitar and ukulele lessons with Nakul Raikhelkar, online or at your home. Beginner to advanced, with grading exam preparation.",
  teacherName: "Nakul Raikhelkar",
  teacherTitle: "Pianist and music teacher",
  teacherBio: [
    "I have been playing the piano for over 15 years and teaching for more than 6. In that time I have taught over 100 students, both online and offline, from complete beginners to advanced players.",
    "At The Sur School I teach piano, guitar and ukulele, with grading classes for each instrument for students who want to take their music further.",
  ].join("\n\n"),
  teacherPhotoPath: null,
  whatsappNumber: "919381517689",
  phone: "919381517689",
  email: "thesurschool@gmail.com",
  instagramUrl: "",
  youtubeUrl: "",
  facebookUrl: "",
  serviceArea: "",
  classModesNote: "Classes are held online, or at your home.",
  gradingNote: "Grading classes prepare students for graded music exams, with structured practice at every level.",
  stats: [
    { value: "15+", label: "Years playing piano" },
    { value: "6+", label: "Years teaching" },
    { value: "100+", label: "Students taught" },
    { value: "All", label: "Levels, beginner to advanced" },
  ],
};

function level(courseId: string, index: number, name: string) {
  return {
    id: `${courseId}-${index}`,
    courseId,
    levelName: name,
    description: "",
    duration: "",
    fee: LEVEL_FEE,
    offersGrading: true,
    gradingFee: LEVEL_FEE,
    sortOrder: index,
    isPublished: true,
  };
}

function course(slug: string, name: string, tagline: string, sortOrder: number, levels: string[]): Course {
  return {
    id: slug,
    slug,
    name,
    tagline,
    description: "",
    sortOrder,
    isPublished: true,
    levels: levels.map((levelName, index) => level(slug, index, levelName)),
  };
}

export const DEFAULT_COURSES: Course[] = [
  course("piano", "Piano", "Beginner to advanced", 0, ["Basic", "Medium", "Advanced"]),
  course("guitar", "Guitar", "Basic and medium levels", 1, ["Basic", "Medium"]),
  course("ukulele", "Ukulele", "Basic and medium levels", 2, ["Basic", "Medium"]),
];

export const DEFAULT_EVENTS: SchoolEvent[] = [];
