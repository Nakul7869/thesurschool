-- Starting content for The Sur School. Everything here can be edited from the admin panel.
-- Safe to run more than once: it never overwrites content that already exists.

insert into public.site_settings (
  id, school_name, tagline, hero_heading, hero_subheading, teacher_name, teacher_title, teacher_bio,
  whatsapp_number, phone, email, class_modes_note, grading_note, stats
) values (
  1,
  'The Sur School',
  'Piano, guitar and ukulele lessons, online and at your home.',
  'Find your sur.',
  'Piano, guitar and ukulele lessons with Nakul Raikhelkar, online or at your home. Beginner to advanced, with grading exam preparation.',
  'Nakul Raikhelkar',
  'Pianist and music teacher',
  E'I have been playing the piano for over 15 years and teaching for more than 6. In that time I have taught over 100 students, both online and offline, from complete beginners to advanced players.\n\nAt The Sur School I teach piano, guitar and ukulele, with grading classes for each instrument for students who want to take their music further.',
  '919381517689',
  '919381517689',
  'thesurschool@gmail.com',
  'Classes are held online, or at your home.',
  'Grading classes prepare students for graded music exams, with structured practice at every level.',
  '[{"value":"15+","label":"Years playing piano"},{"value":"6+","label":"Years teaching"},{"value":"100+","label":"Students taught"},{"value":"All","label":"Levels, beginner to advanced"}]'::jsonb
) on conflict (id) do nothing;

insert into public.courses (slug, name, tagline, sort_order) values
  ('piano', 'Piano', 'Beginner to advanced', 0),
  ('guitar', 'Guitar', 'Basic and medium levels', 1),
  ('ukulele', 'Ukulele', 'Basic and medium levels', 2)
on conflict (slug) do nothing;

insert into public.course_levels (course_id, level_name, fee, grading_fee, sort_order)
select c.id, l.level_name, 'Ask on WhatsApp', 'Ask on WhatsApp', l.sort_order
from public.courses c
join (values
  ('piano', 'Basic', 0), ('piano', 'Medium', 1), ('piano', 'Advanced', 2),
  ('guitar', 'Basic', 0), ('guitar', 'Medium', 1),
  ('ukulele', 'Basic', 0), ('ukulele', 'Medium', 1)
) as l (slug, level_name, sort_order) on l.slug = c.slug
where not exists (select 1 from public.course_levels x where x.course_id = c.id);
