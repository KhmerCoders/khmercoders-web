import { expect, test } from 'vitest';
import { sortExperience, groupExperiences } from './experience';
import { ExperienceRecord } from '@/types';

test('ordering working experience with present', () => {
  const exp = sortExperience([
    e('Company A', 2020, 2022),
    e('Company B', 2019, null), // Present
    e('Company C', 2021, 2023),
    e('Company D', 2018, null), // Present
    e('Company E', 2022, null), // Present
  ]);

  expect(exp[0].companyName).toEqual('Company E'); // Most recent present experience
  expect(exp[1].companyName).toEqual('Company B'); // Second most recent present experience
  expect(exp[2].companyName).toEqual('Company D'); // Most recent past experience
  expect(exp[3].companyName).toEqual('Company C'); // Second most recent past experience
  expect(exp[4].companyName).toEqual('Company A'); // Oldest present experience
});

test('ordering working experience with all past', () => {
  const exp = sortExperience([
    e('Company A', 2020, 2022),
    e('Company B', 2019, 2021),
    e('Company C', 2021, 2023),
    e('Company D', 2018, 2020),
    e('Company E', 2022, 2023),
  ]);

  expect(exp[0].companyName).toEqual('Company E'); // Most recent past experience
  expect(exp[1].companyName).toEqual('Company C'); // Second most recent past experience
  expect(exp[2].companyName).toEqual('Company A'); // Third most recent past experience
  expect(exp[3].companyName).toEqual('Company B'); // Fourth most recent past experience
  expect(exp[4].companyName).toEqual('Company D'); // Oldest past experience
});

// groupExperiences tests
test('ordering working experience with present', () => {
  const exp = groupExperiences([
    e('Company A', 2023, null),
    e('Company C', 2022, null),
    e('Company D', 2019, 2020),
    e('Company B', 2018, null),
    e('Company E', 2016, 2017),
  ]);

  expect(exp[0].companyName).toEqual('Company A'); // Most recent present experience
  expect(exp[1].companyName).toEqual('Company C'); // Second most recent present experience
  expect(exp[2].companyName).toEqual('Company B'); // Third most recent present experience
  expect(exp[3].companyName).toEqual('Company D'); // Second most recent past experience
  expect(exp[4].companyName).toEqual('Company E'); // Oldest past experience
});

test('ordering working experience with all past', () => {
  const exp = groupExperiences([
    e('Company A', 2022, 2023),
    e('Company B', 2019, 2020),
    e('Company C', 2017, 2021),
    e('Company D', 2018, 2020),
    e('Company E', 2021, 2022),
  ]);

  expect(exp[0].companyName).toEqual('Company A'); // Most recent past experience
  expect(exp[1].companyName).toEqual('Company E'); // Second most recent past experience
  expect(exp[2].companyName).toEqual('Company B'); // Third most recent past experience
  expect(exp[3].companyName).toEqual('Company D'); // Fourth most recent past experience
  expect(exp[4].companyName).toEqual('Company C'); // Oldest past experience
});

test('ordering and grouping working experience with present & past (non-consecutive)', () => {
  const exp = groupExperiences([
    e('Company A', 2022, 2023),
    e('Company A', 2023, null),
    e('Company B', 2017, 2021),
    e('Company C', 2018, 2020),
    e('Company C', 2021, null),
  ]);

  // grouping experiences with latest start year and null end year (present)
  expect(exp[0].companyName).toEqual('Company A');
  expect(exp[0].items.length).toEqual(2); // 2 items in the group

  // no getting grouped by most recent experience start year is bigger than
  // second most recent experience end year
  expect(exp[1].companyName).toEqual('Company C');
  expect(exp[2].companyName).toEqual('Company C');

  expect(exp[3].companyName).toEqual('Company B'); // Oldest past experience
});

test('ordering and grouping working experience with present & past (consecutive)', () => {
  const exp = groupExperiences([
    e('Company A', 2022, 2023),
    e('Company A', 2023, null),
    e('Company B', 2017, 2021),
    e('Company C', 2018, 2020),
    e('Company C', 2020, null),
    e('Company C', 2022, null),
  ]);

  // grouping experiences with latest start year and null end year (present)
  expect(exp[0].companyName).toEqual('Company A');
  expect(exp[0].items.length).toEqual(2); // 2 items in the group

  expect(exp[1].companyName).toEqual('Company C');
  expect(exp[1].items.length).toEqual(3); // 3 items in the group

  expect(exp[2].companyName).toEqual('Company B'); // Oldest past experience
});

/**
 * Helper function to create an experience record.
 * This is used to generate test data for the sorting function.
 */
function e(companyName: string, startYear: number, endYear: number | null): ExperienceRecord {
  return {
    id: companyName,
    companyName,
    startYear,
    endYear,
    updatedAt: new Date(),
    createdAt: new Date(),
    role: '',
    description: '',
    companyId: null,
    userId: '',
    companyLogo: '',
  };
}
