import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { BlobStore } from '../types';

export function createLocalBlobStore(rootDir: string): BlobStore {
  const resolve = (key: string) => join(rootDir, key);

  return {
    async put(key, data, _contentType) {
      const path = resolve(key);
      await mkdir(dirname(path), { recursive: true });
      const buf = data instanceof Buffer ? data : Buffer.from(data);
      await writeFile(path, buf);
    },
    async get(key) {
      try {
        return await readFile(resolve(key));
      } catch (err) {
        if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
        throw err;
      }
    },
    async delete(key) {
      await rm(resolve(key), { force: true });
    },
    async exists(key) {
      try {
        await stat(resolve(key));
        return true;
      } catch {
        return false;
      }
    },
  };
}
