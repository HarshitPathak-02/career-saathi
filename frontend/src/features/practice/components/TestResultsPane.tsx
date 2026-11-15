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
    <div className="flex flex-col h-full bg-white border-t border-slate-200 text-slate-800">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50 shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("results")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === "results"
                ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            Test Cases {testSuiteResult ? `(${testSuiteResult.passed}/${testSuiteResult.total})` : ""}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("console")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === "console"
                ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Terminal size={12} />
            Console {allLogs.length > 0 ? `(${allLogs.length})` : ""}
          </button>
        </div>

        {testSuiteResult && (
          <div className="flex items-center gap-3 text-xs">
            <span
              className={`font-semibold px-2 py-0.5 rounded-full ${
                testSuiteResult.failed === 0
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {testSuiteResult.failed === 0
                ? "All Tests Passed"
                : `${testSuiteResult.failed} Failed`}
            </span>
            <span className="flex items-center gap-1 text-slate-500 font-mono">
              <Clock size={12} />
              {testSuiteResult.executionTimeMs}ms
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-xs">
        {isRunning ? (
          <div className="flex items-center justify-center h-full text-slate-500 space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="font-sans font-medium text-xs">Running test suite...</span>
          </div>
        ) : !testSuiteResult ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 space-y-2">
            <p className="font-sans text-xs">Click "Run Tests" or press Ctrl+Enter to execute test suite.</p>
            <button
              type="button"
              onClick={onRunTests}
              className="px-3.5 py-1.5 text-xs font-sans font-semibold bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-300 shadow-xs transition-colors"
            >
              Run Test Suite
            </button>
          </div>
        ) : activeTab === "console" ? (
          <div className="space-y-1">
            {allLogs.length === 0 ? (
              <p className="text-slate-400 font-sans italic text-xs">No output logged to console.</p>
            ) : (
              allLogs.map((log, idx) => (
                <div key={idx} className="text-slate-800 whitespace-pre-wrap font-mono text-xs">
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
                  className={`border rounded-xl p-3.5 transition-colors ${
                    result.passed
                      ? "border-emerald-200 bg-emerald-50/30"
                      : "border-rose-200 bg-rose-50/40"
                  }`}
                >
                  <div
                    onClick={() => setSelectedTestId(selectedTestId === result.id ? null : result.id)}
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      {result.passed ? (
                        <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle size={15} className="text-rose-600 shrink-0" />
                      )}
                      <span className="font-sans font-semibold text-slate-900 text-xs">
                        {result.name}
                      </span>
                    </div>
                    <span className="text-slate-500 font-sans text-[11px]">
                      {result.executionTimeMs}ms
                    </span>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 font-sans block mb-0.5 font-medium">Expected:</span>
                        <pre className="p-2 rounded-lg bg-slate-100 text-emerald-800 overflow-x-auto border border-slate-200/80">
                          {result.expectedOutput}
                        </pre>
                      </div>

                      <div>
                        <span className="text-slate-500 font-sans block mb-0.5 font-medium">Actual:</span>
                        <pre
                          className={`p-2 rounded-lg bg-slate-100 overflow-x-auto border border-slate-200/80 ${
                            result.passed ? "text-emerald-800" : "text-rose-800"
                          }`}
                        >
                          {result.actualOutput}
                        </pre>
                      </div>

                      {result.error && (
                        <div className="flex items-start gap-1.5 text-rose-700 mt-2 bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                          <AlertCircle size={14} className="shrink-0 mt-0.5 text-rose-600" />
                          <span className="break-all font-mono text-xs">{result.error}</span>
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
