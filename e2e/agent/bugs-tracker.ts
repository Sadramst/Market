/**
 * BugsTracker — reads and writes the BUGS.md file.
 * The agent uses this to track outstanding issues and mark them resolved.
 */
import * as fs from "fs";
import * as path from "path";

export const BUGS_FILE = path.resolve(__dirname, "BUGS.md");

export interface Bug {
  id: string;           // e.g. "BUG-001"
  title: string;
  status: "open" | "resolved" | "skipped";
  area: string;         // e.g. "auth", "location", "search", "wellness"
  description: string;
  firstSeen: string;    // ISO date
  resolvedAt?: string;
  testName?: string;
}

/** Parse BUGS.md into a list of Bug objects */
export function readBugs(): Bug[] {
  if (!fs.existsSync(BUGS_FILE)) return [];
  const content = fs.readFileSync(BUGS_FILE, "utf-8");
  const bugs: Bug[] = [];

  // Parse each ## BUG-NNN block
  const blocks = content.split(/^##\s+/m).filter((b) => b.trim().startsWith("BUG-"));
  for (const block of blocks) {
    const lines = block.split("\n");
    const headerMatch = lines[0].match(/^(BUG-\d+)\s+(.+?)(?:\s+`(\w+)`)?$/);
    if (!headerMatch) continue;

    const id = headerMatch[1];
    const title = headerMatch[2].trim();
    const statusRaw = headerMatch[3]?.toLowerCase() ?? "open";
    const status = (["open", "resolved", "skipped"].includes(statusRaw) ? statusRaw : "open") as Bug["status"];

    let area = "general";
    let description = "";
    let firstSeen = new Date().toISOString().slice(0, 10);
    let resolvedAt: string | undefined;
    let testName: string | undefined;

    for (const line of lines.slice(1)) {
      if (line.startsWith("- **Area**:")) area = line.replace("- **Area**:", "").trim();
      else if (line.startsWith("- **First seen**:")) firstSeen = line.replace("- **First seen**:", "").trim();
      else if (line.startsWith("- **Resolved**:")) resolvedAt = line.replace("- **Resolved**:", "").trim();
      else if (line.startsWith("- **Test**:")) testName = line.replace("- **Test**:", "").trim();
      else if (line.startsWith("> ")) description += line.replace(/^> /, "") + "\n";
    }

    bugs.push({ id, title, status, area, description: description.trim(), firstSeen, resolvedAt, testName });
  }
  return bugs;
}

/** Generate sequential ID for a new bug */
export function nextBugId(bugs: Bug[]): string {
  const max = bugs.reduce((m, b) => {
    const n = parseInt(b.id.replace("BUG-", ""), 10);
    return n > m ? n : m;
  }, 0);
  return `BUG-${String(max + 1).padStart(3, "0")}`;
}

/** Write all bugs back to BUGS.md */
export function writeBugs(bugs: Bug[]): void {
  const today = new Date().toISOString().slice(0, 10);
  const openCount = bugs.filter((b) => b.status === "open").length;
  const resolvedCount = bugs.filter((b) => b.status === "resolved").length;

  let md = `# Appilico Market — Bug Tracker\n\n`;
  md += `> Auto-maintained by the AI test agent. Last updated: ${today}\n\n`;
  md += `| Status | Count |\n|--------|-------|\n`;
  md += `| 🔴 Open | ${openCount} |\n`;
  md += `| ✅ Resolved | ${resolvedCount} |\n\n`;
  md += `---\n\n`;

  // Open bugs first, then resolved
  const sorted = [...bugs].sort((a, b) => {
    const order = { open: 0, skipped: 1, resolved: 2 };
    return order[a.status] - order[b.status];
  });

  for (const bug of sorted) {
    const statusBadge = bug.status === "resolved" ? "`resolved`" : bug.status === "skipped" ? "`skipped`" : "`open`";
    md += `## ${bug.id} ${bug.title} ${statusBadge}\n\n`;
    md += `- **Area**: ${bug.area}\n`;
    md += `- **First seen**: ${bug.firstSeen}\n`;
    if (bug.resolvedAt) md += `- **Resolved**: ${bug.resolvedAt}\n`;
    if (bug.testName) md += `- **Test**: ${bug.testName}\n`;
    if (bug.description) md += `\n> ${bug.description.split("\n").join("\n> ")}\n`;
    md += "\n";
  }

  fs.writeFileSync(BUGS_FILE, md, "utf-8");
}

/** Add a new bug — returns the new bug (does nothing if same title already open) */
export function addBug(bugs: Bug[], partial: Omit<Bug, "id" | "status" | "firstSeen">): Bug | null {
  const exists = bugs.find(
    (b) => b.title.toLowerCase() === partial.title.toLowerCase() && b.status === "open"
  );
  if (exists) return null; // already tracked

  const bug: Bug = {
    id: nextBugId(bugs),
    status: "open",
    firstSeen: new Date().toISOString().slice(0, 10),
    ...partial,
  };
  bugs.push(bug);
  return bug;
}

/** Mark a bug as resolved by ID or title */
export function resolveBug(bugs: Bug[], idOrTitle: string): boolean {
  const bug = bugs.find(
    (b) => b.id === idOrTitle || b.title.toLowerCase() === idOrTitle.toLowerCase()
  );
  if (!bug || bug.status === "resolved") return false;
  bug.status = "resolved";
  bug.resolvedAt = new Date().toISOString().slice(0, 10);
  return true;
}
