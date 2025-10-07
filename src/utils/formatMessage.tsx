import React from "react";

type Node = React.ReactNode;

// Small markdown subset parser to convert text into React nodes
// Supports: **bold**, *italic* or _italic_, `inline code`, ```code block```,
// unordered lists (-, *, +) and ordered lists (1.), and line breaks.

export function formatMessageToNodes(input: string): Node[] {
  if (!input) return [""];

  console.log("Raw Message:", input);

  // Normalize some unicode characters that look like asterisks and remove zero-width spaces
  let normalized = input.replace(/\u00A0/g, ' ').replace(/\u200B/g, '');
  // common unicode star-like characters: ✱ ＊ ⋆ ✳ ✴
  normalized = normalized.replace(/[✱＊⋆✳✴]/g, '*');
  // collapse runs of 3+ '*' to '**' (intended bold)
  normalized = normalized.replace(/\*{3,}/g, '**');

  const lines = normalized.split(/\r?\n/);
  const nodes: Node[] = [];

  let i = 0;
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];

  while (i < lines.length) {
    const line = lines[i];

    // code block start/end
    const codeFenceMatch = line.match(/^```\s*(\w+)?\s*$/);
    if (codeFenceMatch) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockLines = [];
      } else {
        // closing fence
        inCodeBlock = false;
        nodes.push(
          <pre key={`cb-${i}`}>
            <code>{codeBlockLines.join("\n")}</code>
          </pre>
        );
      }
      i++;
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      i++;
      continue;
    }

    // unordered list
    const ulMatch = line.match(/^\s*[-*+]\s+(.*)$/);
    if (ulMatch) {
      const items: Node[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^\s*[-*+]\s+(.*)$/);
        if (!m) break;
        items.push(<li key={`li-${i}`}>{parseInline(m[1])}</li>);
        i++;
      }
      nodes.push(<ul key={`ul-${i}`}>{items}</ul>);
      continue;
    }

    // ordered list
    const olMatch = line.match(/^\s*\d+\.\s+(.*)$/);
    if (olMatch) {
      const items: Node[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^\s*\d+\.\s+(.*)$/);
        if (!m) break;
        items.push(<li key={`oli-${i}`}>{parseInline(m[1])}</li>);
        i++;
      }
      nodes.push(<ol key={`ol-${i}`}>{items}</ol>);
      continue;
    }

    // blank line -> add a line break element
    if (line.trim() === "") {
      nodes.push(<br key={`br-${i}`} />);
      i++;
      continue;
    }

    // normal paragraph line
    // we push inline-parsed nodes and add a <br/> to preserve line breaks inside paragraph
    const parsed = parseInline(line);
    parsed.forEach((n) => nodes.push(n));
    // add a <br/> to preserve explicit newlines
    if (i < lines.length - 1) nodes.push(<br key={`nl-${i}`} />);

    i++;
  }
  console.log("Parsed Nodes:", nodes);

  return nodes;
}

function parseInline(text: string): Node[] {
  // Recursive inline parser that handles inline code, bold, and italic
  const result: Node[] = [];
  let remaining = text;

  while (remaining.length > 0) {
    const next = findNextInline(remaining);
    if (!next) {
      result.push(remaining);
      break;
    }
    const { index, length, type, content } = next;
    if (index > 0) {
      result.push(remaining.slice(0, index));
    }
    switch (type) {
      case "code":
        result.push(<code key={`code-${index}`}>{content.trim()}</code>);
        break;
      case "bold":
        result.push(<strong key={`b-${index}`}>{parseInline(content.trim())}</strong>);
        break;
      case "italic":
        result.push(<em key={`i-${index}`}>{parseInline(content.trim())}</em>);
        break;
      default:
        result.push(content);
    }
    remaining = remaining.slice(index + length);
  }

  return result;
}

function findNextInline(s: string): { index: number; length: number; type: "code" | "bold" | "italic"; content: string } | null {
  const patterns: { type: "code" | "bold" | "italic"; rx: RegExp }[] = [
    { type: "code", rx: /`([^`]+)`/ },
    { type: "bold", rx: /\*\*(.+?)\*\*/ },
    // italics: either *text* or _text_
    { type: "italic", rx: /_(.+?)_|\*(.+?)\*/ },
  ];

  let earliest: { index: number; length: number; type: "code" | "bold" | "italic"; content: string } | null = null;
  for (const p of patterns) {
    const m = p.rx.exec(s);
    if (m) {
      const idx = m.index;
      const full = m[0];
      const inner = (m[1] ?? m[2]) ?? "";
      if (!earliest || idx < earliest.index) {
        earliest = { index: idx, length: full.length, type: p.type, content: inner };
      }
    }
  }

  return earliest;
}

export default formatMessageToNodes;
