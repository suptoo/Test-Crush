"use client";

import { InlineMath, BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

interface MathTextProps {
  text: string;
  className?: string;
}

/**
 * Component that renders text with embedded LaTeX math expressions
 * Supports both inline math ($...$) and display math ($$...$$)
 */
export function MathText({ text, className = "" }: MathTextProps) {
  if (!text) return null;

  // Split text by math delimiters
  const parts: JSX.Element[] = [];
  let currentIndex = 0;
  let partKey = 0;

  // Regular expression to match $...$ or $$...$$
  const mathRegex = /\$\$(.+?)\$\$|\$(.+?)\$/g;
  let match;

  while ((match = mathRegex.exec(text)) !== null) {
    // Add text before the math
    if (match.index > currentIndex) {
      const textBefore = text.substring(currentIndex, match.index);
      parts.push(
        <span key={`text-${partKey++}`}>{textBefore}</span>
      );
    }

    // Add the math (either display or inline)
    const mathContent = match[1] || match[2]; // match[1] for $$, match[2] for $
    const isDisplayMath = match[0].startsWith("$$");

    try {
      if (isDisplayMath) {
        parts.push(
          <span key={`math-${partKey++}`} className="block my-2">
            <BlockMath math={mathContent} />
          </span>
        );
      } else {
        parts.push(
          <span key={`math-${partKey++}`} className="inline-block mx-1">
            <InlineMath math={mathContent} />
          </span>
        );
      }
    } catch (error) {
      // If LaTeX parsing fails, show the original text
      parts.push(
        <span key={`error-${partKey++}`} className="text-red-500">
          {match[0]}
        </span>
      );
    }

    currentIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (currentIndex < text.length) {
    parts.push(
      <span key={`text-${partKey++}`}>{text.substring(currentIndex)}</span>
    );
  }

  return <span className={className}>{parts}</span>;
}
