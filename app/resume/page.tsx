"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, logout } from "@/lib/auth";
import resumeData from "@/data/resume.json";
import {
  ResumeData,
  Experience,
  SkillCategory,
  getAllTechnologies,
  getAllSkills,
  filterExperienceByTech,
  searchResume,
} from "@/lib/resume";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Download,
  LogOut,
  LayoutGrid,
  Table2,
  MapPin,
  Calendar,
  Building2,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type ViewMode = "cards" | "table";

export default function ResumePage() {
  const router = useRouter();
  const resume = resumeData as ResumeData;
  const [isClient, setIsClient] = useState(false);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedExp, setExpandedExp] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const resumeRef = useRef<HTMLDivElement>(null);

  // Check authentication on mount
  useEffect(() => {
    setIsClient(true);
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  // Get all available technologies and skills
  const allTechnologies = getAllTechnologies(resume);
  const allSkills = getAllSkills(resume);

  // Filter and search resume data
  const searchResults = searchResume(resume, searchQuery);
  const filteredExperience = filterExperienceByTech(
    searchResults.experience,
    selectedTechs
  );

  const toggleExpanded = (id: string) => {
    setExpandedExp((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleTechFilter = (tech: string) => {
    setSelectedTechs((prev) =>
      prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
    );
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!isClient || !isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {resume.personalInfo.name}
              </h1>
              <p className="text-orange-600 dark:text-orange-400 font-medium mt-1">
                {resume.personalInfo.title}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <a href="/AliNexonResume.pdf" download className="flex">
                  <Download className="w-4 h-4 mr-2" />
                  Download CV
                </a>
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-gray-300 dark:border-gray-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        ref={resumeRef}
      >
        {/* Personal Info Section */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                Contact Information
              </h2>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <strong className="text-gray-900 dark:text-white">
                    Email:
                  </strong>{" "}
                  {resume.personalInfo.email}
                </li>
                <li className="flex items-center gap-2">
                  <strong className="text-gray-900 dark:text-white">
                    Phone:
                  </strong>{" "}
                  {resume.personalInfo.phone}
                </li>
                <li className="flex items-center gap-2">
                  <strong className="text-gray-900 dark:text-white">
                    Location:
                  </strong>{" "}
                  {resume.personalInfo.location}
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Summary
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {resume.personalInfo.summary}
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Controls */}
        <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 interactive-controls">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search roles, companies, skills..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white outline-none transition-all"
                aria-label="Search resume"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                View:
              </span>
              <div className="flex gap-2">
                <Button
                  onClick={() => setViewMode("cards")}
                  variant={viewMode === "cards" ? "default" : "outline"}
                  size="sm"
                  className={
                    viewMode === "cards"
                      ? "bg-orange-500 hover:bg-orange-600"
                      : ""
                  }
                >
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  Cards
                </Button>
                <Button
                  onClick={() => setViewMode("table")}
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  className={
                    viewMode === "table"
                      ? "bg-orange-500 hover:bg-orange-600"
                      : ""
                  }
                >
                  <Table2 className="w-4 h-4 mr-2" />
                  Table
                </Button>
              </div>
            </div>

            {/* Technology Filters */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-5 h-5 text-orange-500" />
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filter by Technology:
                </h3>
                {selectedTechs.length > 0 && (
                  <button
                    onClick={() => setSelectedTechs([])}
                    className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {allTechnologies.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => toggleTechFilter(tech)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      selectedTechs.includes(tech)
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                    aria-pressed={selectedTechs.includes(tech)}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-orange-500" />
            Work Experience
          </h2>
          {filteredExperience.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">
                No experience found matching your filters.
              </p>
            </div>
          ) : viewMode === "cards" ? (
            <div className="space-y-4">
              {filteredExperience.map((exp) => (
                <ExperienceCard
                  key={exp.id}
                  experience={exp}
                  isExpanded={expandedExp.has(exp.id)}
                  onToggle={() => toggleExpanded(exp.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Technologies
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredExperience.map((exp) => (
                      <tr
                        key={exp.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {exp.company}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {exp.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(exp.startDate)} -{" "}
                          {exp.endDate === "present"
                            ? "Present"
                            : formatDate(exp.endDate)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {exp.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-xs rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Skills Section */}
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Skills
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            {searchResults.skills.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">
                No skills found matching your search.
              </p>
            ) : (
              <div className="space-y-4">
                {searchResults.skills.map((category, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      {category.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-orange-500" />
            Education
          </h2>
          <div className="space-y-4">
            {resume.education.map((edu, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {edu.imageUrl && (
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                        <Image
                          src={edu.imageUrl}
                          alt={edu.institution}
                          width={80}
                          height={80}
                          className="object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                      {edu.degree}
                    </h3>
                    <p className="text-orange-600 dark:text-orange-400 font-medium mb-2">
                      {edu.institution}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {edu.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </span>
                    </div>
                    {Array.isArray(edu.description) ? (
                      <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                        {edu.description.map((desc, i) => (
                          <li key={i}>{desc}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

// Experience Card Component
function ExperienceCard({
  experience,
  isExpanded,
  onToggle,
}: {
  experience: Experience;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all">
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
        aria-expanded={isExpanded}
        aria-controls={`exp-${experience.id}`}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-3">
              {experience.imageUrl && (
                <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                  <Image
                    src={experience.imageUrl}
                    alt={experience.company}
                    width={64}
                    height={64}
                    className="object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {experience.role}
                </h3>
                <p className="text-orange-600 dark:text-orange-400 font-medium mb-2">
                  {experience.company}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {experience.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(experience.startDate)} -{" "}
                    {experience.endDate === "present"
                      ? "Present"
                      : formatDate(experience.endDate)}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {experience.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {experience.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-xs rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div className="ml-4 flex-shrink-0">
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </div>
      </button>

      {isExpanded && (
        <div
          id={`exp-${experience.id}`}
          className="px-6 pb-5 border-t border-gray-200 dark:border-gray-700 pt-4"
        >
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Key Achievements:
          </h4>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
            {experience.achievements.map((achievement, idx) => (
              <li key={idx}>{achievement}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Helper function to format dates
function formatDate(dateString: string): string {
  if (dateString === "present") return "Present";
  const [year, month] = dateString.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
