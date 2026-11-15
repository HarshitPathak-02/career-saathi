import { useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { Play, RotateCcw, Send, Moon, Sun } from "lucide-react";

interface CodingEditorPaneProps {
  code: string;
  onChange: (code: string) => void;
  onRunTests: () => void;
  onSubmit: () => void;
  onReset: () => void;
  isRunning: boolean;
  isSubmitting: boolean;
  hasRunTests: boolean;
}

export const CodingEditorPane = ({
  code,
  onChange,
  onRunTests,
  onSubmit,
  onReset,
  isRunning,
  isSubmitting,
  hasRunTests,
}: CodingEditorPaneProps) => {
  const [theme, setTheme] = useState<"vs-dark" | "light">("light");

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    (window as any).__monacoEditor = editor;
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      onRunTests();
    });
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200">
      {/* Editor toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200 shadow-2xs">
            JavaScript / TypeScript
          </span>
          <button
            type="button"
            onClick={onReset}
            title="Reset code to starter template"
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
          >
            <RotateCcw size={12} />
            <span>Reset</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTheme(theme === "vs-dark" ? "light" : "vs-dark")}
            title="Toggle editor theme (Light / Dark)"
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            {theme === "vs-dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <button
            type="button"
            onClick={onRunTests}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg transition-colors border border-slate-300 disabled:opacity-50 shadow-2xs"
          >
            <Play size={12} className="text-emerald-600" />
            <span>{isRunning ? "Running..." : "Run Tests"}</span>
            <span className="hidden sm:inline text-[10px] text-slate-400 ml-1">
              (Ctrl+Enter)
            </span>
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || isRunning}
            title={!hasRunTests ? "Tip: Run tests first to verify your solution" : "Submit for AI mentor review"}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 shadow-2xs"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>AI Reviewing...</span>
              </>
            ) : (
              <>
                <Send size={12} />
                <span>Submit & Review</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 relative min-h-[300px]">
        <Editor
          height="100%"
          language="javascript"
          theme={theme}
          value={code}
          onChange={(val) => onChange(val ?? "")}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            fontFamily: "JetBrains Mono, Menlo, Monaco, Consolas, monospace",
            bracketPairColorization: { enabled: true },
            lineDecorationsWidth: 6,
            wordWrap: "on",
          }}
        />
      </div>
    </div>
  );
};
