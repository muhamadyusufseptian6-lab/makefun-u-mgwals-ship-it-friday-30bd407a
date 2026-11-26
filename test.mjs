// TDD-lite checks for the Ship It Friday entry (run with: node test.mjs).
// Each check mirrors a kit requirement: gate length, single line, determinism,
// stdlib-only imports, and no dotfiles in the output.
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const entryDir = new URL(".", import.meta.url).pathname;
let failures = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
};

const run = (outDir) =>
  execFileSync("node", [join(entryDir, "main.ts")], {
    env: { ...process.env, MAKEFUN_OUTPUT_DIR: outDir },
    encoding: "utf8",
  });

const out1 = mkdtempSync(join(tmpdir(), "shipit-1-"));
const out2 = mkdtempSync(join(tmpdir(), "shipit-2-"));
run(out1);
run(out2);
const text1 = readFileSync(join(out1, "entry.txt"), "utf8");
const text2 = readFileSync(join(out2, "entry.txt"), "utf8");

check("gate: 1–159 characters", text1.length >= 1 && text1.length <= 159, `${text1.length} chars`);
check("gate: not only whitespace", text1.trim().length > 0);
check("single line, no trailing newline", !text1.includes("\n"));
check("deterministic: two runs identical", text1 === text2);
check("reads like a commit message", /^feat: /.test(text1));
check("no dotfiles in output", !readdirSync(out1).some((f) => f.startsWith(".")));

const mainSrc = readFileSync(join(entryDir, "main.ts"), "utf8");
const imports = [...mainSrc.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]);
check("stdlib-only imports", imports.every((i) => i.startsWith("node:")), imports.join(", "));

rmSync(out1, { recursive: true, force: true });
rmSync(out2, { recursive: true, force: true });

console.log(failures === 0 ? "ALL CHECKS PASSED" : `${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
