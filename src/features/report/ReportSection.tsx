import { BookOpenText, Search } from "lucide-react";

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
              <p className="font-mono text-xs uppercase tracking-wider text-primary">
                Writer Agent report
              </p>
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
