'use client';

import { ExperienceRecord, ProfileAiReviewFeedback } from '@/types';
import { useProfileAiReview } from './profile-review-provider';
import { Bot } from 'lucide-react';

export function ProfileExperienceListWithReview({
  experiences,
}: {
  experiences: ExperienceRecord[];
}) {
  const { feedback } = useProfileAiReview();
  const groupedExp = groupExperiences(experiences);

  return (
    <>
      {feedback && (
        <div className="bg-card border text-sm my-4 p-4 rounded flex-col gap-2 flex">
          <h2 className="font-semibold text-blue-800 dark:text-blue-400 flex items-center gap-2">
            <Bot />
            AI Review Summary ({feedback.rating}/10)
          </h2>

          <div className="max-w-[200px] h-4 bg-muted rounded overflow-hidden">
            <div
              className="h-full bg-gray-400"
              style={{ width: `${(feedback.rating / 10) * 100}%` }}
            ></div>
          </div>

          <p>{feedback.feedback}</p>
        </div>
      )}

      <div className="flex flex-col gap-4 mt-6">
        {groupedExp.map((company, idx) => {
          return (
            <div key={idx} className="flex gap-2">
              {/* company logo */}
              <div className="bg-card border h-12 w-12 rounded shrink-0 flex items-center justify-center text-orange-400 font-bold">
                {company.companyName
                  .split(' ')
                  .slice(0, 2)
                  .map(word => word.charAt(0).toUpperCase())
                  .join('')}
              </div>

              {/* experience list (single) */}
              {company.items.length <= 1 &&
                company.items.map((exp, index) => {
                  const aiFeedback = feedback?.experiences.find(
                    experience => experience.id === exp.id
                  );
                  return (
                    <div key={index}>
                      <h3 className="text-sm font-semibold">{exp.role}</h3>{' '}
                      <p className="text-sm text-muted-foreground text-balance">
                        <span className="text-orange-400">{company.companyName}</span> (
                        {exp.startYear}&nbsp;-&nbsp;{exp.endYear ? exp.endYear : 'Present'})
                      </p>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {exp.description}
                      </p>
                      {aiFeedback && <AIFeedBack feedback={aiFeedback} />}
                    </div>
                  );
                })}

              {/* experience list (multiple) */}
              {company.items.length > 1 && (
                <>
                  <div className="flex flex-col gap-3">
                    {/* company name & date range */}
                    <div>
                      <h3 className=" text-orange-400">{company.companyName}</h3>{' '}
                      <p className="text-sm text-muted-foreground text-balance">
                        <span>
                          Working range: {company.startYear}&nbsp;-&nbsp;
                          {company.endYear ?? 'Present'}
                        </span>{' '}
                      </p>
                    </div>

                    {/* each experience */}
                    {company.items.map((exp, index) => {
                      const aiFeedback = feedback?.experiences.find(
                        experience => experience.id === exp.id
                      );
                      return (
                        <div key={index} className="experience-item">
                          <h3 className="text-sm font-semibold">{exp.role}</h3>{' '}
                          <p className="text-sm text-muted-foreground">
                            <span>
                              {exp.startYear}&nbsp;-&nbsp;{exp.endYear ? exp.endYear : 'Present'}
                            </span>
                          </p>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {exp.description}
                          </p>
                          {aiFeedback && <AIFeedBack feedback={aiFeedback} />}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

const AIFeedBack = ({ feedback }: { feedback: ProfileAiReviewFeedback['experiences'][0] }) => {
  return (
    <div className="bg-card border p-2 text-sm my-2 rounded flex flex-col gap-1">
      <h2 className="font-semibold text-blue-800 dark:text-blue-400 flex items-center gap-2">
        <Bot />
        AI Feedback
      </h2>
      <p>{feedback.feedback}</p>
      {feedback.suggestion && (
        <>
          <strong>Suggestion</strong>
          <p>{feedback.suggestion}</p>
        </>
      )}
    </div>
  );
};

interface ExperienceRecordGroup {
  companyName: ExperienceRecord['companyName'];
  companyLogo: ExperienceRecord['companyLogo'];
  startYear: ExperienceRecord['startYear'];
  endYear: ExperienceRecord['endYear'];
  items: ExperienceRecord[];
}
/**
 * Groups an array of experience records by company name, merge continuous
 * periods of employment and separate periods with time gaps.
 * @param experiences An array of `ExperienceRecord` objects.
 * @returns An array of `ExperienceRecordGroup` objects sorted `DESC` by `startYear` property.
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

  // Re-sort the final groups startYear (DESC order)
  return grouped.sort((a, b) => b.startYear - a.startYear);
}
