"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

interface MathKeyboardProps {
  onInsert: (symbol: string) => void;
  onClose?: () => void;
}

const mathSymbols = {
  basic: [
    { label: "x²", latex: "^{2}", display: "x²" },
    { label: "xⁿ", latex: "^{n}", display: "xⁿ" },
    { label: "x₁", latex: "_{1}", display: "x₁" },
    { label: "√", latex: "\\sqrt{}", display: "√x" },
    { label: "ⁿ√", latex: "\\sqrt[n]{}", display: "ⁿ√x" },
    { label: "÷", latex: "\\div", display: "÷" },
    { label: "×", latex: "\\times", display: "×" },
    { label: "±", latex: "\\pm", display: "±" },
  ],
  fractions: [
    { label: "½", latex: "\\frac{1}{2}", display: "½" },
    { label: "a/b", latex: "\\frac{a}{b}", display: "a/b" },
    { label: "()", latex: "()", display: "()" },
    { label: "[]", latex: "[]", display: "[]" },
    { label: "{}", latex: "\\{\\}", display: "{}" },
    { label: "|x|", latex: "|x|", display: "|x|" },
  ],
  calculus: [
    { label: "∫", latex: "\\int", display: "∫" },
    { label: "∫ᵇₐ", latex: "\\int_{a}^{b}", display: "∫ᵇₐ" },
    { label: "∑", latex: "\\sum", display: "∑" },
    { label: "∏", latex: "\\prod", display: "∏" },
    { label: "lim", latex: "\\lim_{x\\to a}", display: "lim" },
    { label: "d/dx", latex: "\\frac{d}{dx}", display: "d/dx" },
    { label: "∂/∂x", latex: "\\frac{\\partial}{\\partial x}", display: "∂/∂x" },
  ],
  trigonometry: [
    { label: "sin", latex: "\\sin", display: "sin" },
    { label: "cos", latex: "\\cos", display: "cos" },
    { label: "tan", latex: "\\tan", display: "tan" },
    { label: "csc", latex: "\\csc", display: "csc" },
    { label: "sec", latex: "\\sec", display: "sec" },
    { label: "cot", latex: "\\cot", display: "cot" },
    { label: "sin⁻¹", latex: "\\sin^{-1}", display: "sin⁻¹" },
    { label: "cos⁻¹", latex: "\\cos^{-1}", display: "cos⁻¹" },
  ],
  greek: [
    { label: "α", latex: "\\alpha", display: "α" },
    { label: "β", latex: "\\beta", display: "β" },
    { label: "γ", latex: "\\gamma", display: "γ" },
    { label: "δ", latex: "\\delta", display: "δ" },
    { label: "θ", latex: "\\theta", display: "θ" },
    { label: "π", latex: "\\pi", display: "π" },
    { label: "Σ", latex: "\\Sigma", display: "Σ" },
    { label: "Ω", latex: "\\Omega", display: "Ω" },
  ],
  comparison: [
    { label: "=", latex: "=", display: "=" },
    { label: "≠", latex: "\\neq", display: "≠" },
    { label: "<", latex: "<", display: "<" },
    { label: ">", latex: ">", display: ">" },
    { label: "≤", latex: "\\leq", display: "≤" },
    { label: "≥", latex: "\\geq", display: "≥" },
    { label: "≈", latex: "\\approx", display: "≈" },
    { label: "∞", latex: "\\infty", display: "∞" },
  ],
  logic: [
    { label: "∀", latex: "\\forall", display: "∀" },
    { label: "∃", latex: "\\exists", display: "∃" },
    { label: "∈", latex: "\\in", display: "∈" },
    { label: "∉", latex: "\\notin", display: "∉" },
    { label: "⊂", latex: "\\subset", display: "⊂" },
    { label: "∪", latex: "\\cup", display: "∪" },
    { label: "∩", latex: "\\cap", display: "∩" },
    { label: "∅", latex: "\\emptyset", display: "∅" },
  ],
};

export function MathKeyboard({ onInsert, onClose }: MathKeyboardProps) {
  const [activeTab, setActiveTab] = useState<keyof typeof mathSymbols>("basic");
  const [preview, setPreview] = useState("");

  const handleSymbolClick = (latex: string) => {
    onInsert(latex);
    setPreview(latex);
  };

  const tabs: { key: keyof typeof mathSymbols; label: string }[] = [
    { key: "basic", label: "Basic" },
    { key: "fractions", label: "Fractions" },
    { key: "calculus", label: "Calculus" },
    { key: "trigonometry", label: "Trig" },
    { key: "greek", label: "Greek" },
    { key: "comparison", label: "Compare" },
    { key: "logic", label: "Logic" },
  ];

  return (
    <Card className="border-2 border-blue-200 dark:border-blue-800">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Math Keyboard</CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {/* Preview */}
        {preview && (
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 mb-1">Last inserted:</p>
            <div className="text-xl">
              <InlineMath math={preview} />
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 border-b pb-2">
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
              className="text-xs"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Symbol Grid */}
        <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto p-2">
          {mathSymbols[activeTab].map((symbol, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-12 text-lg font-semibold"
              onClick={() => handleSymbolClick(symbol.latex)}
              title={symbol.latex}
            >
              {symbol.display}
            </Button>
          ))}
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
          <p>💡 <strong>Tip:</strong> Click any symbol to insert it at cursor position</p>
          <p>📝 <strong>LaTeX Mode:</strong> Use $ to wrap math expressions</p>
          <p>
            <strong>Example:</strong> Type &quot;$\int x^2 dx$&quot; to display{" "}
            <InlineMath math="\int x^2 dx" />
          </p>
        </div>

        {/* Common Examples */}
        <div className="space-y-2 pt-2">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            Quick Examples:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSymbolClick("\\int_{0}^{\\infty} x^2 dx")}
              className="text-xs justify-start"
            >
              <InlineMath math="\int_{0}^{\infty} x^2 dx" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSymbolClick("\\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}")}
              className="text-xs justify-start"
            >
              Quadratic
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSymbolClick("\\sin^2\\theta + \\cos^2\\theta = 1")}
              className="text-xs justify-start"
            >
              Pythagorean
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSymbolClick("e^{i\\pi} + 1 = 0")}
              className="text-xs justify-start"
            >
              Euler&apos;s Identity
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
