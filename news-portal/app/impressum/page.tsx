import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum – SchnellWissen',
  description: 'Impressum und rechtliche Informationen zu SchnellWissen.',
};

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="card p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-8">Impressum</h1>
          
          <div className="space-y-8 text-text-muted">
            <section>
              <h2 className="text-xl font-semibold text-text mb-3">Angaben gemäß § 5 TMG</h2>
              <div className="space-y-1">
                <p><strong className="text-text">SchnellWissen</strong></p>
                <p>Betreiber: Pabo</p>
                <p>Musterstraße 123</p>
                <p>50667 Köln</p>
                <p>E-Mail: schnellwissen5@gmail.com</p>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-text mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
              <div className="space-y-1">
                <p>Pabo</p>
                <p>Musterstraße 123</p>
                <p>50667 Köln</p>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-text mb-3">Haftungsausschluss</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-text mb-2">Haftung für Inhalte</h3>
                  <p className="leading-relaxed">
                    Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, 
                    Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. 
                    Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                    nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
                    Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde 
                    Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige 
                    Tätigkeit hinweisen.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-text mb-2">Haftung für Links</h3>
                  <p className="leading-relaxed">
                    Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen 
                    Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
                    Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
                    Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf 
                    mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der 
                    Verlinkung nicht erkennbar.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-text mb-2">Urheberrecht</h3>
                  <p className="leading-relaxed">
                    Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                    dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
                    der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
                    Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind 
                    nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                  </p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-text mb-3">Streitschlichtung</h2>
              <p className="leading-relaxed">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" 
                   className="link ml-1">
                  https://ec.europa.eu/consumers/odr
                </a>
              </p>
              <p className="leading-relaxed mt-2">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>
            
            <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-900">
                <strong>Stand:</strong> {new Date().toLocaleDateString('de-DE', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-text-muted text-sm text-center">
              Bei Fragen wenden Sie sich bitte an: <Link href="/kontakt" className="link font-medium">Kontakt</Link>
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