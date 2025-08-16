import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutzerklärung – SchnellWissen',
  description: 'Datenschutzerklärung und Informationen zum Umgang mit personenbezogenen Daten bei SchnellWissen.',
};

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="card p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-8">Datenschutzerklärung</h1>
          
          <div className="space-y-8 text-text-muted">
            <section>
              <h2 className="text-xl font-semibold text-text mb-3">1. Allgemeine Hinweise</h2>
              <p className="leading-relaxed">
                Der Schutz Ihrer persönlichen Daten ist uns wichtig. In dieser Datenschutzerklärung 
                informieren wir Sie darüber, welche personenbezogenen Daten wir erheben, wie wir sie 
                verwenden und welche Rechte Sie diesbezüglich haben. Die Nutzung unserer Website ist 
                in der Regel ohne Angabe personenbezogener Daten möglich.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-text mb-3">2. Verantwortlicher</h2>
              <p className="leading-relaxed">
                Verantwortlich für die Datenverarbeitung auf dieser Website ist:
              </p>
              <div className="mt-3 space-y-1">
                <p><strong className="text-text">Paul Nelles</strong></p>
                <p>E-Mail: schnellwissen5@gmail.com</p>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-text mb-3">3. Erhebung und Speicherung personenbezogener Daten</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-text mb-2">3.1 Beim Besuch der Website</h3>
                  <p className="leading-relaxed">
                    Bei jedem Zugriff auf unsere Website werden automatisch Informationen durch den 
                    Browser an den Server unserer Website gesendet. Diese Informationen werden temporär 
                    in einem sogenannten Logfile gespeichert. Folgende Informationen werden dabei ohne 
                    Ihr Zutun erfasst und bis zur automatisierten Löschung gespeichert:
                  </p>
                  <ul className="list-disc list-inside mt-3 space-y-1">
                    <li>IP-Adresse des anfragenden Rechners</li>
                    <li>Datum und Uhrzeit des Zugriffs</li>
                    <li>Name und URL der abgerufenen Datei</li>
                    <li>Website, von der aus der Zugriff erfolgt (Referrer-URL)</li>
                    <li>Verwendeter Browser und ggf. das Betriebssystem</li>
                  </ul>
                  <p className="mt-3 leading-relaxed">
                    Die genannten Daten werden zu folgenden Zwecken verarbeitet:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Gewährleistung eines reibungslosen Verbindungsaufbaus der Website</li>
                    <li>Gewährleistung einer komfortablen Nutzung unserer Website</li>
                    <li>Auswertung der Systemsicherheit und -stabilität</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-text mb-2">3.2 Bei Kontaktaufnahme</h3>
                  <p className="leading-relaxed">
                    Wenn Sie uns per E-Mail oder über das Kontaktformular kontaktieren, werden die von 
                    Ihnen mitgeteilten Daten (Ihre E-Mail-Adresse, ggf. Ihr Name und Ihre Telefonnummer) 
                    von uns gespeichert, um Ihre Fragen zu beantworten. Die in diesem Zusammenhang 
                    anfallenden Daten löschen wir, nachdem die Speicherung nicht mehr erforderlich ist, 
                    oder schränken die Verarbeitung ein, falls gesetzliche Aufbewahrungspflichten bestehen.
                  </p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-text mb-3">4. Cookies und Tracking-Technologien</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-text mb-2">4.1 Cookie-Kategorien</h3>
                  <p className="leading-relaxed mb-3">
                    Unsere Website verwendet verschiedene Arten von Cookies, die wir in folgende Kategorien unterteilen:
                  </p>
                  
                  <div className="space-y-3">
                    <div className="pl-4 border-l-4 border-green-500">
                      <h4 className="font-medium text-text">Essenzielle Cookies (immer aktiv)</h4>
                      <p className="text-sm text-text-muted mt-1">
                        Diese Cookies sind für den Betrieb der Website unerlässlich und können nicht deaktiviert werden.
                      </p>
                      <ul className="text-sm text-text-muted mt-2 space-y-1">
                        <li>• <strong>sw_consent</strong>: Speichert Ihre Cookie-Einstellungen (6 Monate)</li>
                        <li>• <strong>session</strong>: Temporärer Sitzungs-Cookie für sichere Verbindungen</li>
                      </ul>
                    </div>
                    
                    <div className="pl-4 border-l-4 border-blue-500">
                      <h4 className="font-medium text-text">Funktionale Cookies (optional)</h4>
                      <p className="text-sm text-text-muted mt-1">
                        Ermöglichen erweiterte Funktionen und Personalisierung.
                      </p>
                      <ul className="text-sm text-text-muted mt-2 space-y-1">
                        <li>• YouTube-Videos: Eingebettete Videoinhalte</li>
                        <li>• Google Maps: Interaktive Kartenfunktionen</li>
                        <li>• Social Media: Teilen-Buttons und Integrationen</li>
                      </ul>
                    </div>
                    
                    <div className="pl-4 border-l-4 border-purple-500">
                      <h4 className="font-medium text-text">Analyse-Cookies (optional)</h4>
                      <p className="text-sm text-text-muted mt-1">
                        Helfen uns zu verstehen, wie Besucher unsere Website nutzen (anonymisiert).
                      </p>
                      <ul className="text-sm text-text-muted mt-2 space-y-1">
                        <li>• <strong>Google Analytics 4</strong>: Website-Nutzungsstatistiken mit IP-Anonymisierung</li>
                        <li>• <strong>_ga</strong>: Unterscheidung von Besuchern (2 Jahre)</li>
                        <li>• <strong>_gid</strong>: Unterscheidung von Besuchern (24 Stunden)</li>
                        <li>• <strong>_ga_*</strong>: Sitzungs- und Kampagnendaten (2 Jahre)</li>
                      </ul>
                    </div>
                    
                    <div className="pl-4 border-l-4 border-orange-500">
                      <h4 className="font-medium text-text">Marketing-Cookies (optional)</h4>
                      <p className="text-sm text-text-muted mt-1">
                        Werden für personalisierte Werbung und Remarketing verwendet.
                      </p>
                      <ul className="text-sm text-text-muted mt-2 space-y-1">
                        <li>• Google Ads: Conversion-Tracking und Remarketing</li>
                        <li>• Facebook Pixel: Social Media Remarketing</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-text mb-2">4.2 Cookie-Verwaltung</h3>
                  <p className="leading-relaxed">
                    Sie haben jederzeit die volle Kontrolle über die Verwendung von Cookies auf unserer Website:
                  </p>
                  <ul className="list-disc list-inside mt-3 space-y-2 text-text-muted">
                    <li>Beim ersten Besuch können Sie über unser Cookie-Banner Ihre Präferenzen festlegen</li>
                    <li>Ihre Einstellungen werden für 6 Monate gespeichert</li>
                    <li>Sie können Ihre Einstellungen jederzeit über den Link "Datenschutz & Cookies" im Footer ändern</li>
                    <li>Wir respektieren "Do Not Track" (DNT) und "Global Privacy Control" (GPC) Browser-Signale</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-text mb-2">4.3 Rechtsgrundlage</h3>
                  <p className="leading-relaxed">
                    Die Rechtsgrundlage für die Verwendung von Cookies ist:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-text-muted">
                    <li><strong>Essenzielle Cookies:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</li>
                    <li><strong>Alle anderen Cookies:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-900">
                    <strong>Browser-Einstellungen:</strong> Sie können Ihren Browser so einstellen, dass Sie über 
                    das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben. Bei der 
                    Deaktivierung von Cookies kann die Funktionalität unserer Website eingeschränkt sein.
                  </p>
                </div>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-text mb-3">5. Analyse-Tools und Werbung</h2>
              <p className="leading-relaxed">
                Derzeit verwenden wir keine Analyse-Tools oder Werbedienste von Drittanbietern. 
                Sollten wir in Zukunft solche Dienste einsetzen, werden wir Sie darüber in dieser 
                Datenschutzerklärung informieren.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-text mb-3">6. Rechte der betroffenen Personen</h2>
              <p className="leading-relaxed mb-3">
                Sie haben gegenüber uns folgende Rechte hinsichtlich der Sie betreffenden 
                personenbezogenen Daten:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong className="text-text">Recht auf Auskunft:</strong> Sie können Auskunft über Ihre von uns verarbeiteten personenbezogenen Daten verlangen.</li>
                <li><strong className="text-text">Recht auf Berichtigung:</strong> Sie können die Berichtigung unrichtiger oder die Vervollständigung Ihrer bei uns gespeicherten personenbezogenen Daten verlangen.</li>
                <li><strong className="text-text">Recht auf Löschung:</strong> Sie können die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten verlangen.</li>
                <li><strong className="text-text">Recht auf Einschränkung der Verarbeitung:</strong> Sie können die Einschränkung der Verarbeitung Ihrer personenbezogenen Daten verlangen.</li>
                <li><strong className="text-text">Recht auf Widerspruch:</strong> Sie können Widerspruch gegen die Verarbeitung einlegen.</li>
                <li><strong className="text-text">Recht auf Datenübertragbarkeit:</strong> Sie können verlangen, dass wir Ihnen Ihre personenbezogenen Daten in einem strukturierten, gängigen und maschinenlesbaren Format übermitteln.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-text mb-3">7. Beschwerderecht bei der Aufsichtsbehörde</h2>
              <p className="leading-relaxed">
                Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die 
                Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren. Die für uns 
                zuständige Aufsichtsbehörde finden Sie unter:
              </p>
              <p className="mt-3">
                <a href="https://www.bfdi.bund.de" target="_blank" rel="noopener noreferrer" 
                   className="link">
                  Der Bundesbeauftragte für den Datenschutz und die Informationsfreiheit
                </a>
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-text mb-3">8. Aktualität und Änderung dieser Datenschutzerklärung</h2>
              <p className="leading-relaxed">
                Diese Datenschutzerklärung ist aktuell gültig und hat den Stand: {new Date().toLocaleDateString('de-DE', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}.
              </p>
              <p className="mt-3 leading-relaxed">
                Durch die Weiterentwicklung unserer Website und Angebote darüber oder aufgrund 
                geänderter gesetzlicher beziehungsweise behördlicher Vorgaben kann es notwendig 
                werden, diese Datenschutzerklärung zu ändern. Die jeweils aktuelle 
                Datenschutzerklärung kann jederzeit auf der Website unter "/datenschutz" von 
                Ihnen abgerufen und ausgedruckt werden.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-text mb-3">9. Kontakt für Datenschutzfragen</h2>
              <p className="leading-relaxed">
                Bei Fragen zum Datenschutz wenden Sie sich bitte an:
              </p>
              <div className="mt-3 p-4 bg-primary/10 rounded-lg">
                <p className="font-medium text-text">E-Mail: schnellwissen5@gmail.com</p>
              </div>
            </section>
            
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Hinweis:</strong> Diese Datenschutzerklärung stellt eine Grundversion dar. 
                Bei der Integration weiterer Funktionen (z.B. Newsletter, Analysetools, Social Media) 
                wird diese Erklärung entsprechend erweitert und angepasst.
              </p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
              <Link href="/impressum" className="link font-medium">Impressum</Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link href="/kontakt" className="link font-medium">Kontakt</Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link href="/ueber-uns" className="link font-medium">Über uns</Link>
            </div>
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