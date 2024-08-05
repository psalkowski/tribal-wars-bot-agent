import * as path from 'path';

export function getAppRootDir() {
  return process.env.ROOT_DIR;
}

export function getAppDir(subPath: string) {
  return path.join(getAppRootDir(), subPath);
}
