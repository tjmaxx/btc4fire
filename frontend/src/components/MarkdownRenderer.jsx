import React from 'react';

// Renders inline markdown: **bold**, *italic*, `code`
function renderInline(text) {
  const parts = text.split(/(\*\*\*.*?\*\*\*|\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('***') && part.endsWith('***'))
      return <strong key={i}><em>{part.slice(3, -3)}</em></strong>;
    if (part.startsWith('**') && part.endsWith('**'))
      return <strong key={i} className="text-gray-900 dark:text-white font-semibold">{part.slice(2, -2)}</strong>;
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2)
      return <em key={i}>{part.slice(1, -1)}</em>;
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2)
      return <code key={i} className="bg-gray-200 dark:bg-slate-700 text-orange-500 dark:text-orange-300 px-1.5 py-0.5 rounded text-sm font-mono">{part.slice(1, -1)}</code>;
    return part;
  });
}

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  let _inTable = false;

  lines.forEach((line, idx) => {
    // Headings
    if (line.startsWith('### '))
      return elements.push(<h3 key={idx} className="text-lg font-bold text-gray-900 dark:text-white mt-6 mb-2">{renderInline(line.slice(4))}</h3>);
    if (line.startsWith('## '))
      return elements.push(<h2 key={idx} className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-3">{renderInline(line.slice(3))}</h2>);
    if (line.startsWith('# '))
      return elements.push(<h1 key={idx} className="text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4">{renderInline(line.slice(2))}</h1>);

    // Code block fence (skip the line itself)
    if (line.startsWith('```')) return;

    // Empty line
    if (line.trim() === '') return elements.push(<div key={idx} className="h-3" />);

    // Table row
    if (line.startsWith('|')) {
      if (line.includes('---')) return; // separator
      const cells = line.split('|').filter(c => c.trim() !== '');
      return elements.push(
        <tr key={idx} className="border-b border-gray-200 dark:border-slate-700">
          {cells.map((cell, i) => (
            <td key={i} className="px-4 py-2 text-gray-600 dark:text-slate-300 text-sm">{cell.trim()}</td>
          ))}
        </tr>
      );
    }

    // Unordered list
    if (line.startsWith('- ') || line.startsWith('* '))
      return elements.push(
        <li key={idx} className="text-gray-600 dark:text-slate-300 ml-5 list-disc leading-relaxed">
          {renderInline(line.slice(2))}
        </li>
      );

    // Ordered list
    if (/^\d+\.\s/.test(line))
      return elements.push(
        <li key={idx} className="text-gray-600 dark:text-slate-300 ml-5 list-decimal leading-relaxed">
          {renderInline(line.replace(/^\d+\.\s/, ''))}
        </li>
      );

    // Blockquote
    if (line.startsWith('> '))
      return elements.push(
        <blockquote key={idx} className="border-l-4 border-orange-500 pl-4 text-gray-500 dark:text-slate-400 italic my-2">
          {renderInline(line.slice(2))}
        </blockquote>
      );

    // Default paragraph
    elements.push(
      <p key={idx} className="text-gray-600 dark:text-slate-300 leading-relaxed">
        {renderInline(line)}
      </p>
    );
  });

  return <div className="space-y-1">{elements}</div>;
}
