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
    // Normalize key to a readable title
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
 * Convert a plain single-line or hyphen-separated reply into readable markdown.
 * Example input:
 * "The budget billing plan has been successfully created. Here are the details: - Plan ID: BB-default - Start Cycle: October 2025 - Monthly Amount: $100"
 */
export function formatPlainToMarkdown(reply: string): string {
  if (!reply) return "";
  // Normalize asterisks:
  // - collapse 3+ asterisks to '**' (intended bold)
  // - remove stray single asterisks that are not part of '**'
  // - normalize whitespace
  let cleaned = reply.replace(/\*{3,}/g, "**");
  // remove single '*' not part of a '**' pair
  cleaned = cleaned.replace(/(?<!\*)\*(?!\*)/g, '');
  // normalize spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // Try to split an initial header (sentence) and the rest of items separated by ' - '
  const parts = cleaned.split(/\s+-\s+/);
  let header = parts[0]?.trim() ?? "";
  const items = parts.slice(1).map(p => p.trim()).filter(Boolean);

  // If header contains multiple sentences and the first part looks like a heading, keep it
  // If the header itself looks like a key:value pair, don't bold the whole header
  if (/^[^:]+:\s*.+$/.test(header)) {
    // header is actually a key:value; move it into items
    items.unshift(header);
    header = "";
  }

  const mdLines: string[] = [];
  if (header) {
    mdLines.push(`**${header}**`, "");
  }

  for (const it of items) {
    // normalize key:value pairs
    const kvMatch = it.match(/^(.*?):\s*(.*)$/);
    if (kvMatch) {
      // remove stray asterisks around keys/values
      const rawK = kvMatch[1].trim();
      const rawV = kvMatch[2].trim();
      const k = rawK.replace(/\*+/g, '').trim();
      const v = rawV.replace(/^\*+\s*/g, '').replace(/\s*\*+$/g, '').trim();
      mdLines.push(`- **${k}:** ${v}`);
    } else {
      // not key-value, add as plain list item
      mdLines.push(`- ${it}`);
    }
  }

  // If we found no items but header contains multiple sentences separated by '.', try to split sentences
  if (items.length === 0 && header && header.includes('. ')) {
    const sentences = header.split(/\.\s+/).map(s => s.trim()).filter(Boolean);
    if (sentences.length > 1) {
      mdLines.length = 0;
      mdLines.push(`**${sentences[0]}.**`, "");
      for (let i = 1; i < sentences.length; i++) mdLines.push(`- ${sentences[i]}.`);
    }
  }

  // Append a closing line prompting next actions if not already present
  if (!/questions|assistance|help/i.test(cleaned)) {
    mdLines.push("", "If you have any more questions or need further assistance, feel free to ask!");
  }

  return mdLines.join('\n');
}
