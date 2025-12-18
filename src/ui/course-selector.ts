import prompts from 'prompts';
import type { Course } from '@/browser/course-detector';

export async function selectCourse(courses: Course[]): Promise<Course | null> {
  const { course } = await prompts({
    type: 'select',
    name: 'course',
    message: 'Select a course',
    choices: courses.map((c) => ({
      title: c.name,
      description: c.professor,
      value: c,
    })),
  });

  return course || null;
}
