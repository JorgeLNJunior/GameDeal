/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  type ApplicationCache,
  type CacheData,
} from "@localtypes/http/cache.type";

export class FakeCache implements ApplicationCache {
  async get(key: string): Promise<CacheData | undefined> {
    return undefined;
  }

  async set(
    key: string,
    keyvalue: unknown,
    expire?: number | undefined,
  ): Promise<void> {
    /* empty */
  }
}
