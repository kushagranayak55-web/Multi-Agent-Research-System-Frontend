import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ReportViewerProps {
  markdown: string;
}

/**
 * Custom element renderers instead of a generic "prose" plugin class —
 * keeps every heading/list/quote styled directly from the MARS design
 * tokens (font-display for headings, muted-foreground body copy, etc.)
 * rather than inheriting a third-party typography theme.
 */
export function ReportViewer({ markdown }: ReportViewerProps) {
  return (
    <div className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 mt-8 font-display text-2xl font-semibold tracking-tight first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-8 font-display text-xl font-semibold tracking-tight first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-2 mt-6 font-display text-lg font-medium">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-[15px] leading-relaxed text-foreground/90">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 ml-5 list-disc space-y-1.5 text-[15px] leading-relaxed text-foreground/90">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-5 list-decimal space-y-1.5 text-[15px] leading-relaxed text-foreground/90">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-4 hover:underline"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="mb-4 border-l-2 border-primary/50 pl-4 text-sm italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <code className="rounded bg-surface-raised px-1.5 py-0.5 font-mono text-[13px] text-primary">
              {children}
            </code>
          ),
          hr: () => <hr className="my-8 border-border" />,
          table: ({ children }) => (
            <div className="mb-4 overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-border bg-surface-raised px-3 py-2 text-left font-medium">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-border/60 px-3 py-2 text-foreground/90">
              {children}
            </td>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
