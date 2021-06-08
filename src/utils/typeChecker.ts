export function isUserUuid(data: string | undefined): string {
  if (data) {
    const arr = data.split(':');
    if (arr[0] == 'e') {
      return arr[1];
    }
  }
  return '';
}

export function notNullAsset<T>(data: T): boolean {
  return !!data;
}

export function typeAssert<T>(
  data: T | undefined | unknown,
  defaultValue: T,
): T {
  return data !== undefined && data !== null ? (data as T) : defaultValue;
}
