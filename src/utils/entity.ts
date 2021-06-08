export class Entity<T> {
  constructor(data: Partial<T>) {
    Object.assign(this, {}, data);
  }
}

export type Constructor<T> = new (...args: any[]) => T;
