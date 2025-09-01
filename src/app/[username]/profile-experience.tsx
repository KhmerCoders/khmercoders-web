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

  const disloyalExp: GroupedEXPWithGap<ExperienceRecord> = {
    keyForSort: 'startYear',
    keyForCheck: 'endYear',
    sort: 'DESC',
  };
  const groupedExp = groupExpByKey(experiences, 'companyName', 'items', disloyalExp);

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
                      <p className="text-sm text-muted-foreground">
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
                      <p className="text-sm text-muted-foreground">
                        <span>
                          Working range: {Math.min(...company.items.map(exp => exp.startYear))}
                          &nbsp;-&nbsp;
                          {company.items.map(exp => exp.endYear).includes(null)
                            ? 'Present'
                            : Math.max(...company.items.map(exp => exp.endYear ?? 0))}
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

type GroupedEXP<T, K extends keyof T, I extends string> = {
  [P in K]: T[P];
} & {
  [P in I]: Array<Omit<T, K>>;
};

type GroupedEXPWithGap<T> =
  | false
  | { keyForSort: keyof T; keyForCheck: keyof T; sort: 'ASC' | 'DESC' };

function groupExpByKey<T, K extends keyof T, I extends string>(
  data: T[],
  groupByKey: K,
  itemsKey: I,
  groupWithGap: GroupedEXPWithGap<T> = false
): Array<GroupedEXP<T, K, I>> {
  if (groupWithGap !== false && groupWithGap) {
    const groupedMap = data.reduce((acc, currentItem) => {
      const groupValue = currentItem[groupByKey];
      const { [groupByKey]: _, ...itemWithoutGroupKey } = currentItem;

      if (!acc.has(groupValue)) {
        acc.set(groupValue, []);
      }
      // Store both (original item and item without group key) for later use
      acc.get(groupValue)!.push({
        original: currentItem,
        omitted: itemWithoutGroupKey,
      });
      return acc;
    }, new Map<T[K], Array<{ original: T; omitted: Omit<T, K> }>>());

    const result: Array<GroupedEXP<T, K, I>> = [];

    groupedMap.forEach((items, groupValue) => {
      // sort exp to see gaps
      items.sort(
        (a, b) =>
          new Date(a.original[groupWithGap.keyForSort] as any).getTime() -
          new Date(b.original[groupWithGap.keyForSort] as any).getTime()
      );

      let currentGroup: Omit<T, K>[] = [];
      let lastEndDate: Date | null = null;

      items.forEach(item => {
        const currentStartDate = new Date(item.original[groupWithGap.keyForSort] as any);

        if (lastEndDate && currentStartDate.getTime() > lastEndDate.getTime()) {
          // if found a gap, push current group and start new one
          result.push({
            [groupByKey]: groupValue,
            [itemsKey]: currentGroup,
          } as GroupedEXP<T, K, I>);
          currentGroup = [];
        }

        currentGroup.push(item.omitted);
        lastEndDate = new Date(item.original[groupWithGap.keyForCheck] as any);
      });

      result.push({
        [groupByKey]: groupValue,
        [itemsKey]: currentGroup,
      } as GroupedEXP<T, K, I>);
    });

    // final sorting based on KeyForSort
    return result.sort((a, b) => {
      const startA = new Date((a[itemsKey] as any)[0][groupWithGap.keyForSort] as any).getTime();
      const startB = new Date((b[itemsKey] as any)[0][groupWithGap.keyForSort] as any).getTime();

      return groupWithGap.sort === 'ASC' ? startA - startB : startB - startA;
    });
  } else {
    // simple grouping with sorting order of original data
    const groupedMap = data.reduce((acc, currentItem) => {
      const groupValue = currentItem[groupByKey];
      const { [groupByKey]: _, ...itemWithoutGroupKey } = currentItem;
      if (!acc.has(groupValue)) {
        acc.set(groupValue, {
          [groupByKey]: groupValue,
          [itemsKey]: [],
        } as GroupedEXP<T, K, I>);
      }
      acc.get(groupValue)![itemsKey].push(itemWithoutGroupKey);
      return acc;
    }, new Map<T[K], GroupedEXP<T, K, I>>());

    return Array.from(groupedMap.values()) as Array<GroupedEXP<T, K, I>>;
  }
}
