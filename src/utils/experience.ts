import type { ExperienceRecord } from '@/types';

interface ExperienceRecordGroup {
  companyName: ExperienceRecord['companyName'];
  companyLogo: ExperienceRecord['companyLogo'];
  startYear: ExperienceRecord['startYear'];
  endYear: ExperienceRecord['endYear'];
  items: ExperienceRecord[];
}

/**
 * Sorting experience record by end date in descending order.
 * If end date is NULL, it means it is present, so it should be sorted to the top.
 * Using start date as tie-breaker in descending order.
 *
 * @param experiences
 * @returns
 */
export function sortExperience(experiences: ExperienceRecord[]): ExperienceRecord[] {
  return experiences.sort((a, b) => {
    // Handle cases where end date is NULL
    const endA = a.endYear || 9999;
    const endB = b.endYear || 9999;

    // Compare end dates first
    if (endA < endB) return 1; // b comes before a
    if (endA > endB) return -1; // a comes before b

    return b.startYear - a.startYear; // Sort by start date in descending order
  });
}

/**
 * Groups an array of experience records by company name, merge continuous
 * periods of employment and separate periods with time gaps.
 * @param experiences An array of `ExperienceRecord` objects.
 * @returns An array of `ExperienceRecordGroup` objects sorted `DESC` by `startYear` if `endYear` is null.
 */
export function groupExperiences(experiences: ExperienceRecord[]): ExperienceRecordGroup[] {
  if (!experiences || experiences.length === 0) {
    return [];
  }
  const sortedExperiences = [...experiences];

  // Sort by company name & start year
  sortedExperiences.sort(
    (a, b) => a.companyName.localeCompare(b.companyName) || a.startYear - b.startYear
  );

  const grouped = sortedExperiences.reduce<ExperienceRecordGroup[]>((acc, exp) => {
    // Get most recent created group
    const lastGroup = acc.length > 0 ? acc[acc.length - 1] : null;

    // Conditions (same company & continuous employment period)
    const isSameCompany = lastGroup && lastGroup.companyName === exp.companyName;
    const isContinuous =
      lastGroup && (lastGroup.endYear === null || exp.startYear <= lastGroup.endYear);

    if (isSameCompany && isContinuous) {
      // Merge to the existing group
      lastGroup.items.push(exp);

      if (exp.endYear === null) {
        lastGroup.endYear = null;
      } else if (lastGroup.endYear !== null) {
        lastGroup.endYear = Math.max(lastGroup.endYear, exp.endYear);
      }
    } else {
      // Add to a new group
      acc.push({
        companyName: exp.companyName,
        companyLogo: exp.companyLogo,
        startYear: exp.startYear,
        endYear: exp.endYear,
        items: [exp],
      });
    }

    return acc;
  }, []);

  // Re-sort the final groups startYear only endYear is null (DESC order)
  return grouped.sort((a, b) => {
    if (a.endYear === null && b.endYear === null) {
      return b.startYear - a.startYear;
    } else if (a.endYear === null) {
      return -1;
    } else if (b.endYear === null) {
      return 1;
    } else {
      return b.startYear - a.startYear;
    }
  });
}
