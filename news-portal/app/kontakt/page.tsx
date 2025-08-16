'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hier würde normalerweise die E-Mail versendet werden
    // Für jetzt zeigen wir nur eine Erfolgsmeldung
    const mailtoLink = `mailto:schnellwissen5@gmail.com?subject=Kontaktanfrage von ${formData.name}&body=${encodeURIComponent(
      `Name: ${formData.name}\nE-Mail: ${formData.email}\n\nNachricht:\n${formData.message}`
    )}`;
    
    window.location.href = mailtoLink;
    
    toast.success('Ihre Nachricht wurde vorbereitet. Bitte senden Sie die E-Mail über Ihr E-Mail-Programm.');
    
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-bg">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="card p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-8">Kontakt</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-text mb-4">Nehmen Sie Kontakt auf</h2>
              <p className="text-text-muted mb-6">
                Haben Sie Fragen, Anregungen oder möchten Sie mit uns zusammenarbeiten? 
                Wir freuen uns auf Ihre Nachricht!
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-primary mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-medium text-text">E-Mail</p>
                    <a href="mailto:schnellwissen5@gmail.com" className="text-primary hover:underline">
                      schnellwissen5@gmail.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-primary mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-medium text-text">Antwortzeit</p>
                    <p className="text-text-muted">Wir antworten in der Regel innerhalb von 24-48 Stunden</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-primary/10 rounded-lg">
                <h3 className="font-semibold text-text mb-2">Betreiber</h3>
                <p className="text-text-muted">Paul Nelles</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-text mb-4">Kontaktformular</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ihr Name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text mb-1">
                    E-Mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="ihre.email@beispiel.de"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text mb-1">
                    Nachricht *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Ihre Nachricht..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full btn-primary"
                >
                  Nachricht senden
                </button>
                
                <p className="text-xs text-text-muted text-center">
                  * Pflichtfelder. Mit dem Absenden stimmen Sie unserer{' '}
                  <Link href="/datenschutz" className="link">Datenschutzerklärung</Link> zu.
                </p>
              </form>
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