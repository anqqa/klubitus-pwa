import { dateFromISOWeek, monday } from './date';


test('dateFromISOWeek', () => {
  expect(dateFromISOWeek(1, 2015).toDateString()).toBe('Mon Dec 29 2014');
  expect(dateFromISOWeek(2, 2015).toDateString()).toBe('Mon Jan 05 2015');
  expect(dateFromISOWeek(1, 2016).toDateString()).toBe('Mon Jan 04 2016');
  expect(dateFromISOWeek(52, 2016).toDateString()).toBe('Mon Dec 26 2016');
  expect(dateFromISOWeek(1, 2017).toDateString()).toBe('Mon Jan 02 2017');
  expect(dateFromISOWeek(10, 2017).toDateString()).toBe('Mon Mar 06 2017');
});


test('monday', () => {
  expect(monday(new Date('2015-01-01')).toDateString()).toBe('Mon Dec 29 2014');
  expect(monday(new Date('2017-11-19')).toDateString()).toBe('Mon Nov 13 2017');
  expect(monday(new Date('2017-11-20')).toDateString()).toBe('Mon Nov 20 2017');
  expect(monday(new Date('2017-11-21')).toDateString()).toBe('Mon Nov 20 2017');
});
