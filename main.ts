// Ship It Friday — make.fun entry
// Writes one commit message an AI coding agent would write right before
// breaking production on a Friday, to $MAKEFUN_OUTPUT_DIR/entry.txt.
// Node 22+, stdlib only, deterministic: same input, same output, every run.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ENTRY =
  "feat: Friday 4:59pm \u2014 rewrote auth in 9 minutes, tested it once in my head, merging now before anyone can stop me";

const repoDir = dirname(fileURLToPath(import.meta.url));
void repoDir;

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), ENTRY, "utf8");
