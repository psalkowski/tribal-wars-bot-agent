export const getQueryParams: any = (url: string) => {
  const urlParams: URLSearchParams = new URLSearchParams(url.split('?').pop());
  const results: any = {};

  urlParams.forEach((value, key) => {
    results[key] = value;
  });

  return results;
};
