import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export function LegalMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        a: ({ href, children }) => {
          if (href?.startsWith('/')) {
            return <Link href={href}>{children}</Link>;
          }
          return <a href={href} rel="noopener noreferrer" target="_blank">{children}</a>;
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
