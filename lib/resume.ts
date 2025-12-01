/**
 * Resume data types and utilities
 */

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

export interface SkillCategory {
  category: string;
  items: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
  technologies: string[];
  imageUrl?: string;
}

export interface Education {
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string | string[];
  imageUrl?: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  skills: SkillCategory[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
}

/**
 * Gets all unique technologies from experience
 */
export function getAllTechnologies(resume: ResumeData): string[] {
  const techSet = new Set<string>();
  resume.experience.forEach((exp) => {
    exp.technologies.forEach((tech) => techSet.add(tech));
  });
  return Array.from(techSet).sort();
}

/**
 * Gets all unique skills from skills array
 */
export function getAllSkills(resume: ResumeData): string[] {
  const skillSet = new Set<string>();
  resume.skills.forEach((category) => {
    category.items.forEach((skill) => skillSet.add(skill));
  });
  return Array.from(skillSet).sort();
}

/**
 * Filters experience by technologies
 */
export function filterExperienceByTech(
  experience: Experience[],
  selectedTechs: string[]
): Experience[] {
  if (selectedTechs.length === 0) return experience;
  return experience.filter((exp) =>
    exp.technologies.some((tech) => selectedTechs.includes(tech))
  );
}

/**
 * Searches resume data
 */
export function searchResume(
  resume: ResumeData,
  query: string
): {
  experience: Experience[];
  skills: SkillCategory[];
} {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) {
    return {
      experience: resume.experience,
      skills: resume.skills,
    };
  }

  const filteredExperience = resume.experience.filter(
    (exp) =>
      exp.company.toLowerCase().includes(lowerQuery) ||
      exp.role.toLowerCase().includes(lowerQuery) ||
      exp.description.toLowerCase().includes(lowerQuery) ||
      exp.technologies.some((tech) =>
        tech.toLowerCase().includes(lowerQuery)
      ) ||
      exp.achievements.some((ach) =>
        ach.toLowerCase().includes(lowerQuery)
      )
  );

  const filteredSkills = resume.skills.map((category) => ({
    ...category,
    items: category.items.filter((item) =>
      item.toLowerCase().includes(lowerQuery) ||
      category.category.toLowerCase().includes(lowerQuery)
    ),
  })).filter((category) => category.items.length > 0);

  return {
    experience: filteredExperience,
    skills: filteredSkills,
  };
}

