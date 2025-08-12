export default function DevCss() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Tailwind CSS Check</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="h-20 rounded-lg bg-blue-500" />
        <div className="h-20 rounded-lg bg-emerald-500" />
      </div>
      <div className="card p-4">
        <p className="text-lg">
          <strong>Wenn diese Boxen farbig sind</strong>, lädt Tailwind. 
        </p>
        <p className="text-text-muted mt-2">
          Dies ist ein Text mit custom CSS-Variablen-Farbe.
        </p>
      </div>
      <div className="prose prose-lg">
        <h2>Typography Test</h2>
        <p>Dies ist ein Paragraph im Prose-Stil. Wenn das Typography-Plugin funktioniert, sollte dieser Text gut formatiert sein.</p>
        <blockquote>Dies ist ein Blockquote.</blockquote>
      </div>
      <div className="flex gap-2">
        <button className="btn-primary">Primary Button</button>
        <button className="btn-secondary">Secondary Button</button>
        <button className="btn-ghost">Ghost Button</button>
      </div>
    </div>
  );
}