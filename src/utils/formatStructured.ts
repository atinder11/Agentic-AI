// formatStructured.tsx

type Primitive = string | number | boolean | null | undefined;

function isPrimitive(v: unknown): v is Primitive {
  return v === null || v === undefined || typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean';
}

function indent(level: number) {
  return '  '.repeat(level);
}

/**
 * Convert a structured object (possibly from an LLM JSON response) into a readable markdown string.
 * - Top-level keys are shown as bold headings (e.g. **Findings**)
 * - Arrays are rendered as bulleted lists
 * - Nested objects are indented
 */
export function formatStructuredToMarkdown(obj: unknown, level = 0): string {
  if (isPrimitive(obj)) {
    return String(obj ?? '');
  }

  if (Array.isArray(obj)) {
    return obj.map((it) => `${indent(level)}- ${formatStructuredToMarkdown(it, level + 1)}`).join('\n');
  }

  // object
  const out: string[] = [];
  for (const [rawKey, value] of Object.entries(obj as Record<string, unknown>)) {
    const key = String(rawKey).replace(/[-_]/g, ' ');
    if (isPrimitive(value)) {
      out.push(`${indent(level)}**${capitalize(key)}:** ${String(value ?? '')}`);
    } else if (Array.isArray(value)) {
      out.push(`${indent(level)}**${capitalize(key)}:**`);
      out.push(formatStructuredToMarkdown(value, level + 1));
    } else {
      out.push(`${indent(level)}**${capitalize(key)}:**`);
      out.push(formatStructuredToMarkdown(value, level + 1));
    }
  }
  return out.join('\n');
}

function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default formatStructuredToMarkdown;

/**
 * Convert a plain single-line or hyphen-separated reply into readable markdown
 * while preserving line breaks, lists, and headers.
 */
export function formatPlainToMarkdown(reply: string): string {
  if (!reply) return "";

  // Step 1: Normalize asterisks (bold/italic)
  let cleaned = reply.replace(/\*{3,}/g, "**");

  // Step 2: Preserve line breaks; remove trailing spaces per line
  cleaned = cleaned.replace(/\r?\n\s*/g, '\n').replace(/[ \t]+$/gm, '').trim();

  // Step 3: Split by ' - ' for list items, but keep explicit line breaks
  const lines = cleaned.split(/\r?\n| - /).map(l => l.trim()).filter(Boolean);

  const mdLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for key-value pair
    const kvMatch = line.match(/^(.*?):\s*(.*)$/);
    if (kvMatch) {
      const k = kvMatch[1].replace(/\*+/g, '').trim();
      const v = kvMatch[2].replace(/^\*+\s*/g, '').replace(/\s*\*+$/g, '').trim();
      mdLines.push(`- **${k}:** ${v}`);
    } else if (i === 0 && !line.includes(':')) {
      // Treat first line as a header if no key-value
      mdLines.push(`**${line}**`);
    } else {
      mdLines.push(`- ${line}`);
    }
  }

  // Append closing line for further assistance if not already present
  if (!/questions|assistance|help/i.test(cleaned)) {
    mdLines.push("", "If you have any more questions or need further assistance, feel free to ask!");
  }

  return mdLines.join('\n');
}
