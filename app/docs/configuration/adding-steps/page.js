import { DocH2, DocH3, DocLi, DocP, DocSection, DocUl } from '@/components/docs/doc-article'
import { DocHeader } from '@/components/docs/doc-header'

export const metadata = {
  title: 'Adding steps',
}

export default function Page() {
  return (
    <article className="flex flex-col gap-8 pb-16">
      <DocHeader
        breadcrumb={[{ label: 'Configuration' }, { label: 'Adding steps' }]}
        title="Adding steps"
        description="Each step is one tooltip anchored to a DOM node on your site."
      />

      <DocSection>
        <DocH2>Fields</DocH2>
        <DocUl>
          <DocLi>
            <strong className="text-foreground">Selector</strong> — any valid CSS selector that resolves to a visible element.
          </DocLi>
          <DocLi>
            <strong className="text-foreground">Title & message</strong> — concise headline plus supporting copy.
          </DocLi>
          <DocLi>
            <strong className="text-foreground">Position</strong> — top, bottom, left, or right relative to the element box.
          </DocLi>
        </DocUl>
      </DocSection>

      <DocSection>
        <DocH2>Trigger URL (optional)</DocH2>
        <DocP>
          Each step can optionally specify a URL path. When set, the tour starts from that step if the visitor is on a
          matching page (based on <code className="text-primary">window.location.pathname</code>).
        </DocP>
        <DocH3>Example setup</DocH3>
        <DocUl>
          <DocLi>Step 1 — Trigger URL: <code className="text-primary">/dashboard</code></DocLi>
          <DocLi>Step 2 — Trigger URL: <code className="text-primary">/projects</code></DocLi>
          <DocLi>Step 3 — Trigger URL: <code className="text-primary">/settings</code></DocLi>
          <DocLi>Step 4 — no trigger URL</DocLi>
        </DocUl>
        <DocH3>Result</DocH3>
        <DocUl>
          <DocLi>Visitor on <code className="text-primary">/dashboard</code> → tour starts at step 1</DocLi>
          <DocLi>Visitor on <code className="text-primary">/settings</code> → tour starts at step 3</DocLi>
          <DocLi>Visitor on <code className="text-primary">/other</code> → tour starts at step 1 (no match)</DocLi>
        </DocUl>
        <DocP>
          Use <code className="text-primary">*</code> at the end of a pattern for prefix matching:{' '}
          <code className="text-primary">/projects*</code> matches <code className="text-primary">/projects/123/edit</code>.
        </DocP>
        <DocP>
          If no step defines a trigger URL, behavior is unchanged: the tour always begins at step 1. Leave trigger URL
          empty for steps that should not influence where the tour starts.
        </DocP>
      </DocSection>

      <DocSection>
        <DocH2>Ordering</DocH2>
        <DocP>Reorder steps in the dashboard — runtime order follows your saved sequence.</DocP>
      </DocSection>
    </article>
  )
}
