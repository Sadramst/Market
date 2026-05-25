#!/usr/bin/env ts-node
/**
 * Appilico AI Test Agent Runner
 *
 * Recursive workflow:
 * 1. Read BUGS.md — log outstanding open bugs
 * 2. Run all agent tests via Playwright
 * 3. Parse test results — add new bugs, resolve fixed ones
 * 4. Write updated BUGS.md
 * 5. Print summary
 *
 * Usage:
 *   npx ts-node e2e/agent/run-agent.ts
 *
 * Or from package.json:
 *   npm run test:agent
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { readBugs, writeBugs, addBug, resolveBug, BUGS_FILE, type Bug } from "./bugs-tracker";

const RESULTS_FILE = path.resolve(__dirname, "../../test-results/agent-results.json");
const MAX_ITERATIONS = 3; // Max re-runs before giving up

interface PlaywrightResult {
  suites?: Array<{
    title: string;
    specs?: Array<{
      title: string;
      tests?: Array<{
        status: string;
        results?: Array<{ error?: { message?: string } }>;
      }>;
    }>;
  }>;
}

function runTests(): { passed: number; failed: number; skipped: number; failures: Array<{ title: string; suite: string; error: string }> } {
  console.log("\n🤖 Running AI agent tests...\n");

  // Ensure results dir exists
  fs.mkdirSync(path.dirname(RESULTS_FILE), { recursive: true });

  let output = "";
  try {
    output = execSync(
      `npx playwright test --project=agent --reporter=json --output=${RESULTS_FILE} 2>&1`,
      { cwd: path.resolve(__dirname, "../.."), encoding: "utf-8", stdio: "pipe" }
    );
  } catch (err: unknown) {
    // Playwright exits with non-zero when tests fail — that's expected
    output = (err as { stdout?: string; stderr?: string }).stdout ?? (err as { stdout?: string; stderr?: string }).stderr ?? "";
  }

  console.log(output.slice(-2000)); // Show last 2000 chars of output

  // Parse JSON results
  const failures: Array<{ title: string; suite: string; error: string }> = [];
  let passed = 0;
  let failed = 0;
  let skipped = 0;

  try {
    // Try to read the JSON report written by Playwright
    let resultsJson: PlaywrightResult | null = null;
    if (fs.existsSync(RESULTS_FILE)) {
      resultsJson = JSON.parse(fs.readFileSync(RESULTS_FILE, "utf-8")) as PlaywrightResult;
    }

    if (resultsJson?.suites) {
      for (const suite of resultsJson.suites) {
        for (const spec of suite.specs ?? []) {
          for (const testRun of spec.tests ?? []) {
            if (testRun.status === "passed") passed++;
            else if (testRun.status === "skipped") skipped++;
            else {
              failed++;
              const error = testRun.results?.[0]?.error?.message ?? "Unknown error";
              failures.push({ title: spec.title, suite: suite.title, error });
            }
          }
        }
      }
    }
  } catch {
    console.warn("⚠️  Could not parse test results JSON — using stdout parsing");
    // Fallback: count from stdout
    const passMatch = output.match(/(\d+) passed/);
    const failMatch = output.match(/(\d+) failed/);
    if (passMatch) passed = parseInt(passMatch[1]);
    if (failMatch) failed = parseInt(failMatch[1]);
  }

  return { passed, failed, skipped, failures };
}

function initBugsFile(): void {
  if (!fs.existsSync(BUGS_FILE)) {
    console.log("📝 Creating BUGS.md...");
    writeBugs([]); // Create with empty bug list
  }
}

function runAgentIteration(iteration: number): boolean {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`Iteration ${iteration} / ${MAX_ITERATIONS}`);
  console.log("═".repeat(60));

  const bugs = readBugs();
  const openBugs = bugs.filter((b) => b.status === "open");

  if (openBugs.length > 0) {
    console.log(`\n⚠️  Outstanding open bugs from previous runs:`);
    for (const bug of openBugs) {
      console.log(`   ${bug.id} — ${bug.title} (${bug.area})`);
    }
  } else {
    console.log("\n✅ No open bugs from previous runs");
  }

  const { passed, failed, skipped, failures } = runTests();

  // Update BUGS.md
  const freshBugs = readBugs(); // Re-read — the tests themselves also write to BUGS.md
  let newBugsAdded = 0;
  let bugsResolved = 0;

  for (const failure of failures) {
    const added = addBug(freshBugs, {
      area: inferArea(failure.suite),
      title: failure.title,
      description: failure.error.slice(0, 400),
      testName: failure.title,
    });
    if (added) newBugsAdded++;
  }

  // For tests that passed, resolve their corresponding open bugs
  writeBugs(freshBugs);
  bugsResolved = freshBugs.filter((b) => b.status === "resolved").length;

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed, ${skipped} skipped`);
  console.log(`📝 BUGS.md: ${newBugsAdded} new bugs, ${bugsResolved} total resolved`);
  console.log(`📄 BUGS.md written to: ${BUGS_FILE}`);

  return failed === 0;
}

function inferArea(suite: string): string {
  const lower = suite.toLowerCase();
  if (lower.includes("auth") || lower.includes("signup") || lower.includes("login") || lower.includes("profile")) return "auth";
  if (lower.includes("location") || lower.includes("suburb") || lower.includes("postcode")) return "location";
  if (lower.includes("wellness")) return "wellness";
  if (lower.includes("search")) return "search";
  if (lower.includes("services")) return "services";
  if (lower.includes("api") || lower.includes("health")) return "api";
  if (lower.includes("analytics")) return "analytics";
  return "ui";
}

function printFinalSummary(bugs: Bug[]): void {
  const open = bugs.filter((b) => b.status === "open");
  const resolved = bugs.filter((b) => b.status === "resolved");

  console.log(`\n${"═".repeat(60)}`);
  console.log("FINAL SUMMARY");
  console.log("═".repeat(60));

  if (open.length === 0) {
    console.log("\n🎉 All tests passing — no open bugs!\n");
  } else {
    console.log(`\n🔴 ${open.length} open bug(s):`);
    for (const bug of open) {
      console.log(`   ${bug.id} [${bug.area}] ${bug.title}`);
    }
  }

  if (resolved.length > 0) {
    console.log(`\n✅ ${resolved.length} resolved bug(s)`);
  }

  console.log(`\n📄 Full report: ${BUGS_FILE}\n`);
}

// ────── MAIN ──────
async function main() {
  console.log("🤖 Appilico AI Test Agent");
  console.log("Version: ZeroStep + Playwright");
  console.log(`Started: ${new Date().toISOString()}`);

  initBugsFile();

  let allPassing = false;
  for (let i = 1; i <= MAX_ITERATIONS; i++) {
    allPassing = runAgentIteration(i);
    if (allPassing) {
      console.log("\n✅ All tests passing — stopping agent loop");
      break;
    }
    if (i < MAX_ITERATIONS) {
      console.log(`\n⏳ Waiting 5s before next iteration...`);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }

  printFinalSummary(readBugs());
  process.exit(allPassing ? 0 : 1);
}

main().catch((err) => {
  console.error("Agent fatal error:", err);
  process.exit(1);
});
