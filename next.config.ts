import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

/** Directory that contains this config file — stable even if `process.cwd()` differs (IDE / monorepos). */
const appRoot = path.dirname(fileURLToPath(import.meta.url));

/**
 * Pin Turbopack root to this app. A parent `package-lock.json` can make Next infer the wrong
 * workspace root and stall or break dev compilation / chunk loading.
 */
const nextConfig: NextConfig = {
  turbopack: {
    root: appRoot,
  },
};

export default nextConfig;
