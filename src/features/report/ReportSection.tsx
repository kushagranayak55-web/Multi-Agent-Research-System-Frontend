import { BookOpenText, RefreshCcw, Search } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { CollapsiblePanel } from "@/components/common/CollapsiblePanel";
import { DownloadMenu } from "@/features/report/DownloadMenu";
import { ReportViewer } from "@/features/report/ReportViewer";
import type { ResearchResult } from "@/services/types/research.types";

interface ReportSectionProps {
  topic: string;
  result: ResearchResult;
}

export function ReportSection({ topic, result }: ReportSectionProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <CollapsiblePanel
          icon={Search}
          title="Search Agent output"
          subtitle="Sources found for this topic"
          content={result.searchResult}
        />
        <CollapsiblePanel
          icon={BookOpenText}
          title="Reader Agent output"
          subtitle="Extracted source content"
          content={result.scrapedContent}
        />
      </div>

      <Card>
        <CardContent className="p-6 sm:p-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-mono text-xs uppercase tracking-wider text-primary">
                  Writer Agent report
                </p>
                {result.revisionCount > 0 && (
                  <span className="flex items-center gap-1 rounded-full border border-warning/40 bg-warning/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-warning">
                    <RefreshCcw className="h-3 w-3" />
                    Revised {result.revisionCount}{" "}
                    {result.revisionCount === 1 ? "time" : "times"} by Critic feedback
                  </span>
                )}
              </div>
              <h2 className="mt-1 font-display text-xl font-semibold tracking-tight">
                {topic}
              </h2>
            </div>
            <DownloadMenu topic={topic} markdown={result.report} />
          </div>

          <div id="print-report">
            <ReportViewer markdown={result.report} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
