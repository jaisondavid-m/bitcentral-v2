// src/Pages/DocsPage.jsx
import ReactMarkdown from "react-markdown";
import { Helmet } from "react-helmet-async";
import aboutContent from "../docs/about.md?raw";

export default function DocsPage() {
  return (
    <main className="max-w-4xl mx-auto p-6">
        <Helmet>
        <title>BIT Central Documentation</title>
        <meta
          name="description"
          content="Official documentation for BIT Central."
        />
      </Helmet>
      <article className="prose max-w-none dark:prose-invert">
        <ReactMarkdown>{aboutContent}</ReactMarkdown>
      </article>
    </main>
  );
}