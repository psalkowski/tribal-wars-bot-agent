import moment from 'moment';

export const durationToMs = (str: string): number =>
  moment.duration(str).asMilliseconds();

/**
 * Property: data-endtime
 *
 * @param unix
 */
export const getDiffFromUnix = (unix: number): number => {
  const end = moment.unix(unix);
  const now = moment();

  return (end.unix() - now.unix()) * 1000;
};
