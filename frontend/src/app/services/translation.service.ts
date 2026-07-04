import { Injectable, signal } from '@angular/core';

export type Lang = 'fr' | 'en';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  currentLang = signal<Lang>('fr');

  private dict: Record<string, Record<string, any>> = {
    fr: {
      nav: {
        about: 'À propos',
        projects: 'Projets',
        blog: 'Blog',
        contact: 'Contact',
      },
      hero: {
        badge: 'INGÉNIEUR FULL-STACK & ARCHITECTE LOGICIEL',
        title: 'Concevoir',
        roles: ["L'Innovation Digitale.", 'Des Architectures Cloud.', 'Des Interfaces Modernes.'],
        statements: [
          { line1: 'Idées complexes.', line2: 'Produits remarquables.' },
          { line1: 'Du pixel.', line2: 'Jusqu’au cloud.' },
          { line1: 'Penser juste.', line2: 'Construire solide.' },
          { line1: 'Code performant.', line2: 'Expérience mémorable.' },
        ],
        lead: 'Tech Lead et développeur Full-Stack avec plus de 10 ans d\'expérience. Je relie <strong>vision produit</strong>, <strong>architecture robuste</strong> et <strong>interfaces soignées</strong> pour construire des expériences numériques durables.',
        action1: 'Construisons quelque chose',
        action2: 'Voir mes réalisations',
        scroll: 'DÉFILEZ POUR EXPLORER',
      },
      about: {
        label: 'Mon Profil',
        yearExp: "Années d'Exp.",
        title: 'La technique',
        titleSub: 'au service de la vision.',
        manifesto: 'Architecturer des solutions fiables et évolutives.',
        bio1: 'Passionné par le développement web moderne et l\'architecture logicielle, j\'accompagne les entreprises dans la conception technique de leurs applications. Mon approche allie rigueur de développement (Principes SOLID, Clean Architecture) et sensibilité UI/UX.',
        bio2: 'Que ce soit pour déployer des APIs robustes, industrialiser la livraison avec Docker et Jenkins ou créer des frontends fluides en Angular, je m\'engage à fournir une qualité logicielle exigeante.',
        cta1: 'Parlons de votre projet',
        cta2: 'Télécharger mon CV',
      },
      projects: {
        title: 'Réalisations',
        titleSub: 'Récentes.',
      },
      contact: {
        label: 'Contact',
        title: 'Discutons de',
        titleSub: 'votre prochain défi.',
        tagline: 'Vous cherchez un ingénieur expérimenté pour concrétiser vos idées ? Laissez-moi un message et je vous répondrai dans les plus brefs délais.',
        name: 'NOM',
        namePh: 'Votre prénom et nom',
        email: 'EMAIL',
        subject: 'SUJET',
        subjectPh: 'L\'objet de votre message',
        message: 'MESSAGE',
        messagePh: 'Détaillez votre projet ou opportunité...',
        send: 'ENVOYER LE MESSAGE',
        success: 'Message envoyé avec succès ! Je vous répondrai sous 24h.',
        error: 'Le message n’a pas pu être envoyé. Réessayez dans un instant.',
      },
    },
    en: {
      nav: {
        about: 'About',
        projects: 'Projects',
        blog: 'Blog',
        contact: 'Contact',
      },
      hero: {
        badge: 'FULL-STACK ENGINEER & SOFTWARE ARCHITECT',
        title: 'Designing',
        roles: ['Digital Innovation.', 'Cloud Architectures.', 'Modern Interfaces.'],
        statements: [
          { line1: 'Complex ideas.', line2: 'Remarkable products.' },
          { line1: 'From pixels.', line2: 'All the way to cloud.' },
          { line1: 'Think clearly.', line2: 'Build boldly.' },
          { line1: 'Performant code.', line2: 'Memorable experiences.' },
        ],
        lead: 'Technical Lead and Full-Stack developer with 10+ years of experience. I connect <strong>product vision</strong>, <strong>robust architecture</strong> and <strong>polished interfaces</strong> to build digital experiences that last.',
        action1: 'Let’s build something',
        action2: 'See my work',
        scroll: 'SCROLL TO EXPLORE',
      },
      about: {
        label: 'My Profile',
        yearExp: 'Years Exp.',
        title: 'Technology',
        titleSub: 'enabling vision.',
        manifesto: 'Architecting reliable and scalable solutions.',
        bio1: 'Passionate about modern web development and software architecture, I help forward-thinking companies design and implement technical applications. My approach combines rigorous engineering (SOLID principles, Clean Architecture) with UI/UX sensitivity.',
        bio2: 'Whether deploying robust APIs, industrializing delivery with Docker and Jenkins, or crafting fluid Angular frontends, I am committed to delivering uncompromising software quality.',
        cta1: 'Let\'s talk',
        cta2: 'Download my CV',
      },
      projects: {
        title: 'Recent',
        titleSub: 'Achievements.',
      },
      contact: {
        label: 'Connect',
        title: 'Let\'s Discuss',
        titleSub: 'Your Next Challenge.',
        tagline: 'Looking for a seasoned engineer to bring your software ideas to life? Leave me a message and I will get back to you promptly.',
        name: 'NAME',
        namePh: 'Your full name',
        email: 'EMAIL',
        subject: 'SUBJECT',
        subjectPh: 'Reason for contacting',
        message: 'MESSAGE',
        messagePh: 'Detail your project or opportunity...',
        send: 'SEND MESSAGE',
        success: 'Message successfully sent! I\'ll reply within 24h.',
        error: 'The message could not be sent. Please try again in a moment.',
      },
    },
  };

  translate(key: string): any {
    const parts = key.split('.');
    let node: any = this.dict[this.currentLang()];
    for (const p of parts) {
      if (node == null || typeof node !== 'object') return key;
      node = node[p];
    }
    return node ?? key;
  }

  setLang(lang: Lang) {
    this.currentLang.set(lang);
    if (typeof document !== 'undefined') document.documentElement.lang = lang;
    if (typeof window !== 'undefined') localStorage.setItem('lang', lang);
  }

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lang') as Lang | null;
      if (saved === 'fr' || saved === 'en') this.currentLang.set(saved);
      document.documentElement.lang = this.currentLang();
    }
  }
}
