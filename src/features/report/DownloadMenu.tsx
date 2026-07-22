import { Download, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";

interface DownloadMenuProps {
  topic: string;
  markdown: string;
}

function slugify(topic: string): string {
  return (
    topic
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "mars-report"
  );
}

function downloadMarkdown(topic: string, markdown: string) {
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${slugify(topic)}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function DownloadMenu({ topic, markdown }: DownloadMenuProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => downloadMarkdown(topic, markdown)}
      >
        <FileText className="h-3.5 w-3.5" />
        Download Markdown
      </Button>
      <Button variant="secondary" size="sm" onClick={() => window.print()}>
        <Download className="h-3.5 w-3.5" />
        Download PDF
      </Button>
    </div>
  );
}
