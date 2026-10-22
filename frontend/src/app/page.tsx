import type { CSSProperties } from "react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductConditionBadge } from "@/components/ui/product-condition-badge";
import { ButtonSpecimen } from "@/components/design-system/button-specimen";

const colors = [
  ["Pitch black", "Primary background", "#0B0D0C", "bg-charcoal"],
  ["Electric lime", "Signature accent", "#B8F12B", "bg-accent"],
  ["Off-white", "Shopping canvas", "#F4F5F1", "bg-off-white"],
  ["Graphite", "Secondary text", "#555C57", "bg-graphite"],
  ["White", "Clean surface", "#FFFFFF", "bg-surface"],
] as const;

export default function Home() {
  return (
    <main>
      <Container>
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-7">
          <p className="eyebrow">Football Boots Store <span className="mx-3 text-muted">/</span> Performance studio</p>
          <Badge>Phase 1A · Development showcase</Badge>
        </header>
        <section aria-labelledby="study-title" className="specimen-section entrance">
          <div className="mb-8 flex flex-wrap justify-between gap-3 text-muted">
            <p className="eyebrow">Visual foundations / Study no. 01</p>
            <p className="eyebrow">Football DNA. Forward energy.</p>
          </div>
          <h1 id="study-title" className="font-display text-display font-bold uppercase leading-[0.95] tracking-[-0.045em]">Built for<br /><span className="text-accent">the game.</span></h1>
          <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-16">
            <p className="max-w-md text-lg leading-relaxed">Original boots. Renewed ambition. A bold visual language for football’s next chapter.</p>
            <p className="max-w-md text-sm text-muted">A temporary design-system specimen, not the final storefront. Exploring type, colour, components and rhythm for a premium resale boutique in Pakistan.</p>
          </div>
        </section>
        <Divider />
        <section aria-labelledby="type-title" className="specimen-section grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
          <SectionHeading id="type-title" eyebrow="01 / Typography" description="Confident display type. Precise, readable details. A shared performance mindset.">Two voices.<br />One identity.</SectionHeading>
          <div className="space-y-8">
            <div className="border-b border-line pb-8">
              <p className="eyebrow mb-5 text-muted">Space Grotesk / Bold 700</p>
              <p className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-tight tracking-tight">Power. Pace. Precision.</p>
              <p className="mt-4 font-display text-xl text-muted">Aa Bb Cc Dd Ee Ff Gg Hh · 0123456789</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div><p className="eyebrow mb-4 text-muted">Inter / Regular 400</p><p className="max-w-sm">Great football boots carry a story. Clear, honest details make the next chapter easier to choose.</p></div>
              <div><p className="eyebrow mb-4 text-muted">Inter / Medium 500 & 600</p><p className="font-medium">Details make the difference.</p><p className="mt-3 text-sm text-muted">Body 16 / 26 · Interface 13 / 20</p></div>
            </div>
          </div>
        </section>
        <Divider />
      </Container>
      <div className="theme-light">
      <Container>
        <section aria-labelledby="palette-title" className="specimen-section">
          <SectionHeading id="palette-title" eyebrow="02 / Palette" description="Pitch black and electric lime. Clean neutrals keep the details in focus.">A sharper identity.</SectionHeading>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-5">
            {colors.map(([name, role, hex, background]) => <div key={name}>
              <div aria-hidden="true" className={`mb-4 h-28 border border-line ${background}`} />
              <p className="text-sm font-medium">{name}</p><p className="text-xs text-muted">{role}</p><p className="mt-2 font-mono text-xs text-muted">{hex}</p>
            </div>)}
          </div>
        </section>
        <Divider />
        <section aria-labelledby="components-title" className="specimen-section grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
          <SectionHeading id="components-title" eyebrow="03 / Components" description="Decisive actions. Honest condition labels. Designed for clarity on a clean shopping canvas.">The essentials.</SectionHeading>
          <div className="space-y-9">
            <div><h3 className="eyebrow mb-6 text-muted">Actions / Live interaction samples</h3><ButtonSpecimen /></div>
            <Divider />
            <div><h3 className="eyebrow mb-5 text-muted">Condition / Label specimens</h3>
              <div className="flex flex-wrap gap-3">{(["excellent", "good", "fair", "new"] as const).map(condition => <ProductConditionBadge key={condition} condition={condition} />)}</div>
              <p className="mt-4 text-sm text-muted">Presentation labels only. Grading criteria will be defined before inventory is introduced.</p>
            </div>
          </div>
        </section>
      </Container>
      </div>
      <section aria-labelledby="rhythm-title" className="theme-light border-t border-line">
        <Container className="specimen-section grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
          <SectionHeading id="rhythm-title" eyebrow="04 / Space & surface" description="Room for the details that matter. Built on a consistent four-pixel rhythm.">Space to breathe.</SectionHeading>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="surface-panel p-6"><p className="eyebrow mb-6 text-muted">Spacing scale / px</p><div className="space-y-3">{[4, 8, 16, 24, 32, 48].map(value => <div key={value} className="flex items-center gap-4"><span className="w-5 text-xs text-muted">{value}</span><div aria-hidden="true" className="h-2 bg-charcoal" style={{ width: `${value * 2}px` }} /></div>)}</div></div>
            <div className="flex flex-col justify-between bg-charcoal p-6 text-surface"><span className="eyebrow">Surface / Editorial</span><p className="my-8 font-display text-3xl font-bold uppercase leading-tight">All focus.<br />No noise.</p><p className="text-xs leading-relaxed">Black for impact. White for clarity.<br />No unnecessary ornament.</p></div>
          </div>
        </Container>
      </section>
      <Container>
        <section aria-labelledby="motion-title" className="specimen-section grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
          <SectionHeading id="motion-title" eyebrow="05 / Motion" description="A little movement, always with purpose. Reduced-motion preferences are respected.">Controlled energy.</SectionHeading>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">{[["200", "Hover"], ["300", "Card"], ["550", "Entrance"], ["70", "Stagger"]].map(([time, label], index) => <div key={label} className="entrance border-t border-line pt-5" style={{ "--stagger-index": index } as CSSProperties}><p className="font-display text-4xl font-bold">{time}<span className="ml-1 font-sans text-xs text-muted">ms</span></p><p className="mt-3 text-xs text-muted">{label}</p></div>)}</div>
        </section>
        <footer className="flex flex-wrap justify-between gap-4 border-t border-line py-7 text-xs text-muted"><p>Football Boots Store · Visual foundation</p><p>Phase 1A / Storefront to follow</p></footer>
      </Container>
    </main>
  );
}
