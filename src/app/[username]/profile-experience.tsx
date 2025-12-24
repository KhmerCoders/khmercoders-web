'use client';

import { ExperienceRecord, ProfileAiReviewFeedback } from '@/types';
import { useProfileAiReview } from './profile-review-provider';
import { Bot } from 'lucide-react';
import { groupExperiences } from '@/utils/experience';

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
