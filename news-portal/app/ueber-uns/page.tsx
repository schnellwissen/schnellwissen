import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Über uns – SchnellWissen',
  description: 'Erfahren Sie mehr über SchnellWissen - Ihre Plattform für schnelle, fundierte Wissensvermittlung zu Alltag, Finanzen und Technologie.',
};

export default function UeberUnsPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="card p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-8">Über uns</h1>
          
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <p className="text-text-muted text-lg leading-relaxed mb-6">
                Willkommen bei <strong className="text-text">SchnellWissen</strong> – Ihrer zentralen Anlaufstelle für 
                fundierte und verständliche Informationen zu den Themen, die wirklich wichtig sind.
              </p>
              
              <h2 className="text-2xl font-semibold text-text mt-8 mb-4">Unsere Mission</h2>
              <p className="text-text-muted leading-relaxed mb-6">
                In einer Zeit der Informationsflut möchten wir Ihnen helfen, schnell und effizient das Wissen zu finden, 
                das Sie suchen. Ob es um Ihre Gesundheit, Finanzen, die neueste Technologie oder Ihren Lifestyle geht – 
                wir bereiten komplexe Themen verständlich und praxisnah für Sie auf.
              </p>
              
              <h2 className="text-2xl font-semibold text-text mt-8 mb-4">Was uns auszeichnet</h2>
              <ul className="list-disc list-inside space-y-3 text-text-muted mb-6">
                <li><strong className="text-text">Qualität vor Quantität:</strong> Jeder Artikel wird sorgfältig recherchiert und von Experten geprüft</li>
                <li><strong className="text-text">Verständlichkeit:</strong> Komplexe Themen einfach erklärt, ohne dabei an Tiefe zu verlieren</li>
                <li><strong className="text-text">Aktualität:</strong> Stets am Puls der Zeit mit den neuesten Entwicklungen und Trends</li>
                <li><strong className="text-text">Vielfalt:</strong> Von Gesundheitstipps über Finanzratgeber bis zu Tech-News – für jeden etwas dabei</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-text mt-8 mb-4">Unser Versprechen</h2>
              <p className="text-text-muted leading-relaxed mb-6">
                Wir verpflichten uns, Ihnen verlässliche, gut recherchierte und praktisch anwendbare Informationen zu liefern. 
                Unser Ziel ist es, dass Sie nach dem Lesen unserer Artikel nicht nur informierter, sondern auch handlungsfähiger sind.
              </p>
              
              <div className="bg-primary/10 rounded-lg p-6 mt-8">
                <p className="text-text text-center italic">
                  "Wissen ist Macht – und wir möchten, dass diese Macht in Ihren Händen liegt."
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-text-muted text-sm text-center">
              Haben Sie Fragen oder Anregungen? <Link href="/kontakt" className="link font-medium">Kontaktieren Sie uns</Link>
            </p>
          </div>
        </div>
      </div>
      
      <footer className="mt-16 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-text-muted">
            © 2024 SchnellWissen. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </div>
  );
}