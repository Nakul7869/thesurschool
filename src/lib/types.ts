export type Stat = { value: string; label: string };

export type SiteSettings = {
  schoolName: string;
  tagline: string;
  heroHeading: string;
  heroSubheading: string;
  teacherName: string;
  teacherTitle: string;
  teacherBio: string;
  teacherPhotoPath: string | null;
  whatsappNumber: string;
  phone: string;
  email: string;
  instagramUrl: string;
  instagramUrl2: string;
  youtubeUrl: string;
  facebookUrl: string;
  serviceArea: string;
  classModesNote: string;
  gradingNote: string;
  stats: Stat[];
};

export type CourseLevel = {
  id: string;
  courseId: string;
  levelName: string;
  description: string;
  duration: string;
  fee: string;
  offersGrading: boolean;
  gradingFee: string;
  sortOrder: number;
  isPublished: boolean;
};

export type Course = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  sortOrder: number;
  isPublished: boolean;
  levels: CourseLevel[];
};

export type GalleryItem = {
  id: string;
  kind: "photo" | "video";
  storagePath: string | null;
  videoUrl: string | null;
  caption: string;
  sortOrder: number;
  isPublished: boolean;
};

export type EventKind = "event" | "news";

export type SchoolEvent = {
  id: string;
  kind: EventKind;
  title: string;
  summary: string;
  details: string;
  startsOn: string;
  location: string;
  tags: string[];
  isPublished: boolean;
};
