export enum SortDirection {
  DESC = 'desc',
  ASC = 'asc',
}

export function sortBy<T extends {}>(property: keyof T, direction: SortDirection = SortDirection.DESC) {
  return (prev: T, next: T) => {
    if (direction === SortDirection.DESC) {
      return (next[property] as number) - (prev[property] as number);
    }

    return (prev[property] as number) - (next[property] as number);
  };
}
