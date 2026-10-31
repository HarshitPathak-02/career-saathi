import { useState } from "react";
import { CheckCircle2, XCircle, Clock, Terminal, AlertCircle } from "lucide-react";
import type { TestSuiteResult } from "../types/practice.types";

interface TestResultsPaneProps {
  testSuiteResult: TestSuiteResult | null;
  isRunning: boolean;
  onRunTests: () => void;
}

export const TestResultsPane = ({
  testSuiteResult,
  isRunning,
  onRunTests,
}: TestResultsPaneProps) => {
  const [activeTab, setActiveTab] = useState<"results" | "console">("results");
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);

  const allLogs = testSuiteResult?.results.flatMap((r) => r.logs) ?? [];

  return (
    <div className="flex flex-col h-full bg-slate-900 border-t border-slate-800 text-slate-200">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("results")}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              activeTab === "results"
                ? "bg-indigo-600/30 text-indigo-400 border border-indigo-500/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            Test Cases {testSuiteResult ? `(${testSuiteResult.passed}/${testSuiteResult.total})` : ""}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("console")}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors flex items-center gap-1.5 ${
              activeTab === "console"
                ? "bg-indigo-600/30 text-indigo-400 border border-indigo-500/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Terminal size={12} />
            Console {allLogs.length > 0 ? `(${allLogs.length})` : ""}
          </button>
        </div>

        {testSuiteResult && (
          <div className="flex items-center gap-3 text-xs">
            <span
              className={`font-semibold px-2 py-0.5 rounded ${
                testSuiteResult.failed === 0
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
              }`}
            >
              {testSuiteResult.failed === 0
                ? "All Tests Passed"
                : `${testSuiteResult.failed} Failed`}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock size={12} />
              {testSuiteResult.executionTimeMs}ms
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
        {isRunning ? (
          <div className="flex items-center justify-center h-full text-slate-400 space-x-2">
            <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span>Running test suite...</span>
          </div>
        ) : !testSuiteResult ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
            <p className="mb-2">Click "Run Tests" or press Ctrl+Enter to execute tests</p>
            <button
              type="button"
              onClick={onRunTests}
              className="px-3 py-1.5 text-xs font-sans font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
            >
              Run Test Suite
            </button>
          </div>
        ) : activeTab === "console" ? (
          <div className="space-y-1">
            {allLogs.length === 0 ? (
              <p className="text-slate-500 italic">No output logged to console.</p>
            ) : (
              allLogs.map((log, idx) => (
                <div key={idx} className="text-slate-300 whitespace-pre-wrap">
                  {log}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {testSuiteResult.results.map((result) => {
              const isSelected = selectedTestId === result.id || (!selectedTestId && !result.passed);
              return (
                <div
                  key={result.id}
                  className={`border rounded-lg p-3 transition-colors ${
                    result.passed
                      ? "border-emerald-500/30 bg-emerald-950/10"
                      : "border-rose-500/40 bg-rose-950/20"
                  }`}
                >
                  <div
                    onClick={() => setSelectedTestId(selectedTestId === result.id ? null : result.id)}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      {result.passed ? (
                        <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle size={15} className="text-rose-400 shrink-0" />
                      )}
                      <span className="font-sans font-medium text-slate-200">
                        {result.name}
                      </span>
                    </div>
                    <span className="text-slate-500 font-sans text-[11px]">
                      {result.executionTimeMs}ms
                    </span>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block mb-0.5">Expected:</span>
                        <pre className="p-1.5 rounded bg-slate-950 text-emerald-300 overflow-x-auto">
                          {result.expectedOutput}
                        </pre>
                      </div>

                      <div>
                        <span className="text-slate-400 block mb-0.5">Actual:</span>
                        <pre
                          className={`p-1.5 rounded bg-slate-950 overflow-x-auto ${
                            result.passed ? "text-emerald-300" : "text-rose-300"
                          }`}
                        >
                          {result.actualOutput}
                        </pre>
                      </div>

                      {result.error && (
                        <div className="flex items-start gap-1.5 text-rose-400 mt-2 bg-rose-900/20 p-2 rounded border border-rose-800/40">
                          <AlertCircle size={14} className="shrink-0 mt-0.5" />
                          <span className="break-all">{result.error}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
