import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // ─── Admin User ───────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@portfolio.com' },
    update: {},
    create: {
      email: 'admin@portfolio.com',
      name: 'Brahim Mlaghui',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });
  console.log('✅ Admin:', admin.email);

  // ─── Profile ──────────────────────────────────────────────────
  await prisma.profile.deleteMany();
  await prisma.profile.create({
    data: {
      name: 'Brahim Mlaghui',
      title: 'Tech Leader & Développeur Full Stack',
      titleEn: 'Tech Leader & Resourceful Full Stack Developer',
      bio: 'Tech Leader & Développeur Full Stack avec plus de 10 ans d\'expérience dans la conception et le développement d\'applications web modernes. Spécialisé en Angular et Symfony, je pilote des architectures scalables et encadre des équipes techniques chez Jizô AI.',
      bioEn: 'Tech Leader & Full Stack Developer with 10+ years of experience designing and building modern web applications. Specialized in Angular & Symfony, I drive scalable architectures and lead technical teams at Jizô AI.',
      email: 'bmlaghui@gmail.com',
      phone: '0767510038',
      location: 'Argenteuil, Île-de-France, France',
      available: true,
      socials: {
        github: 'https://github.com/bmlaghui',
        linkedin: 'https://www.linkedin.com/in/brahimlaghui',
        website: 'https://mlaghuibrahim.fr',
      },
    },
  });
  console.log('✅ Profile mis à jour');

  // ─── Skills ───────────────────────────────────────────────────
  await prisma.skill.deleteMany();
  await prisma.skill.createMany({
    data: [
      // Frontend
      { name: 'Angular', category: 'Frontend', icon: 'angular', level: 5, order: 1 },
      { name: 'TypeScript', category: 'Frontend', icon: 'typescript', level: 5, order: 2 },
      { name: 'JavaScript', category: 'Frontend', icon: 'javascript', level: 5, order: 3 },
      { name: 'HTML / CSS', category: 'Frontend', icon: 'html5', level: 5, order: 4 },
      { name: 'SCSS', category: 'Frontend', icon: 'sass', level: 4, order: 5 },
      { name: 'RxJS', category: 'Frontend', icon: 'reactivex', level: 4, order: 6 },
      // Backend
      { name: 'Symfony', category: 'Backend', icon: 'symfony', level: 5, order: 1 },
      { name: 'NestJS', category: 'Backend', icon: 'nestjs', level: 4, order: 2 },
      { name: 'Node.js', category: 'Backend', icon: 'nodejs', level: 4, order: 3 },
      { name: 'PHP', category: 'Backend', icon: 'php', level: 4, order: 4 },
      { name: 'Elasticsearch', category: 'Backend', icon: 'elasticsearch', level: 3, order: 5 },
      { name: 'PostgreSQL', category: 'Backend', icon: 'postgresql', level: 4, order: 6 },
      { name: 'MySQL', category: 'Backend', icon: 'mysql', level: 4, order: 7 },
      // DevOps & Outils
      { name: 'Git', category: 'DevOps', icon: 'git', level: 5, order: 1 },
      { name: 'Docker', category: 'DevOps', icon: 'docker', level: 4, order: 2 },
      { name: 'Jenkins', category: 'DevOps', icon: 'jenkins', level: 3, order: 3 },
      { name: 'Linux', category: 'DevOps', icon: 'linux', level: 3, order: 4 },
      // CMS / Autres
      { name: 'WordPress', category: 'CMS', icon: 'wordpress', level: 4, order: 1 },
      { name: 'PrestaShop', category: 'CMS', icon: 'prestashop', level: 3, order: 2 },
    ],
  });
  console.log('✅ Skills mis à jour');

  // ─── Experiences ──────────────────────────────────────────────
  await prisma.experience.deleteMany();
  await prisma.experience.createMany({
    data: [
      {
        company: 'Jizô AI',
        position: 'Technical Lead',
        positionEn: 'Technical Lead',
        startDate: new Date('2025-09-01'),
        current: true,
        description: 'Technical Leader & Full-Stack Web Developer : pilotage d\'architectures scalables, encadrement d\'équipes techniques et développement d\'applications web modernes avec Angular & Symfony.',
        descriptionEn: 'Technical Leader & Full-Stack Web Developer | Driving scalable architectures, leading teams, and building modern web applications with Angular & Symfony.',
        skills: ['Angular', 'Symfony', 'Elasticsearch', 'Jenkins', 'Docker'],
        order: 1,
      },
      {
        company: 'Jizô AI',
        position: 'Développeur Web',
        positionEn: 'Web Developer',
        startDate: new Date('2023-09-01'),
        endDate: new Date('2025-08-31'),
        current: false,
        description: 'Refonte entière du produit phare de l\'entreprise : Jizo IA. Développement full-stack avec Angular, Symfony, Elasticsearch, Suricata, Jenkins et Logstash.',
        descriptionEn: 'Complete redesign of the company\'s flagship product: Jizo AI. Full-stack development with Angular, Symfony, Elasticsearch, Suricata, Jenkins and Logstash.',
        skills: ['Angular', 'Symfony', 'Elasticsearch', 'Logstash', 'Jenkins'],
        order: 2,
      },
      {
        company: 'Synapsys Digital France',
        position: 'Développeur',
        positionEn: 'Developer',
        startDate: new Date('2022-12-01'),
        endDate: new Date('2023-09-30'),
        current: false,
        description: 'Développement d\'applications web pour des clients variés. Paris, Île-de-France.',
        descriptionEn: 'Web application development for various clients. Paris, Île-de-France.',
        skills: ['Angular', 'Symfony', 'PHP', 'JavaScript'],
        order: 3,
      },
      {
        company: 'Domi6il',
        position: 'Développeur Web Full-Stack',
        positionEn: 'Full-Stack Web Developer',
        startDate: new Date('2021-01-01'),
        endDate: new Date('2022-03-31'),
        current: false,
        description: 'Développement du site web d\'une entreprise de domiciliation en Symfony.',
        descriptionEn: 'Development of a business domiciliation company website using Symfony.',
        skills: ['Symfony', 'PHP', 'JavaScript', 'HTML', 'CSS'],
        order: 4,
      },
      {
        company: 'ITIC Paris',
        position: 'Développeur Web Full-Stack',
        positionEn: 'Full-Stack Web Developer',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2021-01-31'),
        current: false,
        description: 'Création d\'une plateforme ALUMNI de l\'école : rédaction du cahier des charges, conception UML, développement frontend Angular JS, backend Symfony, et boutique en ligne PrestaShop.',
        descriptionEn: 'Creation of the school\'s ALUMNI platform: requirements writing, UML design, Angular JS frontend, Symfony backend, and PrestaShop online store.',
        skills: ['Angular', 'Symfony', 'Node.js', 'PrestaShop', 'UML'],
        order: 5,
      },
      {
        company: 'MULTISERV PLUS',
        position: 'Fondateur',
        positionEn: 'Founder',
        startDate: new Date('2016-09-01'),
        endDate: new Date('2022-11-30'),
        current: false,
        description: 'Création et direction d\'une agence de communication spécialisée dans la création de sites web, applications web, webmarketing et impression numérique.',
        descriptionEn: 'Founded and managed a communication agency specializing in website creation, web applications, web marketing and digital printing.',
        skills: ['WordPress', 'PHP', 'JavaScript', 'HTML', 'CSS'],
        order: 6,
      },
    ],
  });
  console.log('✅ Expériences mises à jour');

  // ─── Education ────────────────────────────────────────────────
  await prisma.education.deleteMany();
  await prisma.education.createMany({
    data: [
      {
        school: 'ITIC Paris',
        degree: 'Master – Expert IT',
        field: 'Applications intelligentes et Big Data',
        startDate: new Date('2020-01-01'),
        endDate: new Date('2022-11-30'),
        description: 'Formation d\'expert en technologies de l\'information avec spécialisation en intelligence artificielle et Big Data.',
        order: 1,
      },
      {
        school: 'ITIC Paris',
        degree: 'Bachelor',
        field: 'Développement Web & Mobile',
        startDate: new Date('2019-09-01'),
        endDate: new Date('2020-06-30'),
        description: 'Formation en développement web et mobile, conception d\'applications et intégration.',
        order: 2,
      },
      {
        school: 'ITIC Paris',
        degree: 'BTS SIO',
        field: 'Services Informatiques aux Organisations',
        startDate: new Date('2017-09-01'),
        endDate: new Date('2019-06-30'),
        description: 'BTS axé sur les services informatiques, réseaux et développement d\'applications.',
        order: 3,
      },
      {
        school: 'École Supérieure d\'Économie Numérique – Manouba',
        degree: 'Mastère Professionnel',
        field: 'Informatique de gestion – Commerce électronique',
        startDate: new Date('2013-09-01'),
        endDate: new Date('2014-06-30'),
        description: 'Spécialisation en commerce électronique et systèmes d\'information de gestion.',
        order: 4,
      },
      {
        school: 'ISET Charguia',
        degree: 'Licence Appliquée',
        field: 'Développement des Systèmes d\'Information',
        startDate: new Date('2009-09-01'),
        endDate: new Date('2012-06-30'),
        description: 'Licence en développement des systèmes d\'information, algorithmique et bases de données.',
        order: 5,
      },
    ],
  });
  console.log('✅ Formations mises à jour');

  // ─── Projects ─────────────────────────────────────────────────
  await prisma.project.deleteMany();
  {
    await prisma.project.createMany({
      data: [
        {
          title: 'Portfolio CMS',
          titleEn: 'Portfolio CMS',
          slug: 'portfolio-cms',
          description: 'Portfolio personnel avec un CMS intégré permettant de gérer tous les contenus (projets, expériences, blog) via une interface d\'administration.',
          descriptionEn: 'Personal portfolio with an integrated CMS to manage all content (projects, experiences, blog) through an admin interface.',
          challenge: 'Concevoir une vitrine personnelle qui ne soit pas figée, avec une administration simple et une expérience éditoriale bilingue.',
          challengeEn: 'Build a personal showcase that is not static, with straightforward administration and a bilingual editorial experience.',
          solution: 'Une architecture Angular et NestJS conteneurisée, un CMS sur mesure connecté à Prisma et un design system cohérent du mobile au desktop.',
          solutionEn: 'A containerized Angular and NestJS architecture, a custom Prisma-powered CMS and a consistent design system from mobile to desktop.',
          results: ['Contenu entièrement administrable', 'Expérience bilingue FR/EN', 'Déploiement reproductible avec Docker'],
          resultsEn: ['Fully manageable content', 'Bilingual FR/EN experience', 'Reproducible Docker deployment'],
          role: 'Conception, UX/UI & développement full-stack',
          duration: 'Projet continu',
          tags: ['Angular', 'NestJS', 'PostgreSQL', 'Docker', 'Prisma'],
          featured: true,
          published: true,
          link: 'https://mlaghuibrahim.com',
          github: 'https://github.com/bmlaghui',
          accent: '#c084fc',
          order: 1,
        },
        {
          title: 'Jizô IA – Refonte plateforme',
          titleEn: 'Jizô AI – Platform Redesign',
          slug: 'jizo-ai-refonte-plateforme',
          description: 'Refonte complète du produit phare de Jizô AI : architecture microservices, moteur de recherche Elasticsearch, pipeline Logstash et interface Angular moderne.',
          descriptionEn: 'Complete redesign of Jizô AI flagship product: microservices architecture, Elasticsearch search engine, Logstash pipeline and modern Angular interface.',
          challenge: 'Faire évoluer une plateforme métier riche sans interrompre les usages existants, tout en améliorant la recherche et la maintenabilité.',
          challengeEn: 'Evolve a feature-rich business platform without disrupting existing workflows while improving search and maintainability.',
          solution: 'Découpage progressif en services, nouvelle interface Angular et chaîne d’indexation Elasticsearch/Logstash supervisée par la CI.',
          solutionEn: 'Progressive service decomposition, a new Angular interface and an Elasticsearch/Logstash indexing pipeline monitored through CI.',
          results: ['Recherche métier plus pertinente', 'Livraisons sécurisées par la CI', 'Socle frontend modernisé'],
          resultsEn: ['More relevant business search', 'CI-secured releases', 'Modernized frontend foundation'],
          role: 'Tech Lead / Développeur full-stack',
          duration: '2022 — aujourd’hui',
          tags: ['Angular', 'Symfony', 'Elasticsearch', 'Logstash', 'Jenkins'],
          featured: true,
          published: true,
          accent: '#f97316',
          order: 2,
        },
        {
          title: 'Plateforme ALUMNI – ITIC Paris',
          titleEn: 'ALUMNI Platform – ITIC Paris',
          slug: 'plateforme-alumni-itic-paris',
          description: 'Plateforme communautaire pour les anciens élèves de l\'ITIC Paris avec espace membre, boutique en ligne PrestaShop et gestion des événements.',
          descriptionEn: 'Community platform for ITIC Paris alumni with member space, PrestaShop online store and event management.',
          challenge: 'Réunir communauté, événements et commerce dans un parcours cohérent pour les anciens étudiants.',
          challengeEn: 'Bring community, events and commerce together in one coherent alumni journey.',
          solution: 'Une plateforme modulaire associant Angular, Symfony et PrestaShop, pensée autour des principaux parcours membres.',
          solutionEn: 'A modular platform combining Angular, Symfony and PrestaShop, designed around key member journeys.',
          results: ['Espace membre centralisé', 'Parcours événementiel simplifié', 'Boutique intégrée'],
          resultsEn: ['Centralized member area', 'Simplified event journey', 'Integrated shop'],
          role: 'Conception & développement full-stack',
          duration: 'Projet académique',
          tags: ['Angular', 'Symfony', 'Node.js', 'PrestaShop', 'UML'],
          featured: false,
          published: true,
          accent: '#34d399',
          order: 3,
        },
        {
          title: 'Domi6il – Plateforme de domiciliation',
          titleEn: 'Domi6il – Business Domiciliation Platform',
          slug: 'domi6il-plateforme-domiciliation',
          description: 'Site métier pour une société de domiciliation : parcours clients, présentation des services et socle Symfony maintenable.',
          descriptionEn: 'Business website for a domiciliation company, featuring customer journeys, service presentation, and a maintainable Symfony foundation.',
          challenge: 'Transformer une offre réglementée et complexe en parcours clairs pour des entrepreneurs pressés.',
          challengeEn: 'Turn a complex regulated offer into clear journeys for time-constrained entrepreneurs.',
          solution: 'Un socle Symfony maintenable et une hiérarchie de contenu centrée sur les besoins, services et prises de contact.',
          solutionEn: 'A maintainable Symfony foundation and content hierarchy centered on needs, services and contact.',
          results: ['Offre plus lisible', 'Parcours de contact raccourci', 'Base technique maintenable'],
          resultsEn: ['Clearer service offer', 'Shorter contact journey', 'Maintainable technical base'],
          role: 'Développeur web',
          duration: 'Mission',
          tags: ['Symfony', 'PHP', 'JavaScript', 'MySQL'],
          featured: false,
          published: true,
          accent: '#22d3ee',
          order: 4,
        },
      ],
    });
    console.log('✅ Projets créés');
  }

  // ─── Blog Posts ───────────────────────────────────────────────
  await prisma.blogPost.deleteMany();
  {
    await prisma.blogPost.createMany({
      data: [
        {
          title: 'Pourquoi j\'ai choisi NestJS pour mon backend',
          titleEn: 'Why I chose NestJS for my backend',
          slug: 'pourquoi-nestjs-backend',
          summary: 'NestJS apporte une structure solide et opinionée à Node.js. Découvrez pourquoi c\'est mon framework backend de prédilection.',
          summaryEn: 'NestJS brings a solid and opinionated structure to Node.js. Find out why it\'s my go-to backend framework.',
          content: `# Pourquoi j'ai choisi NestJS

NestJS est un framework Node.js qui s'inspire fortement d'Angular dans son architecture. Il utilise TypeScript par défaut et propose une structure modulaire qui facilite la maintenance des projets.

## Les avantages

- **Architecture modulaire** : chaque fonctionnalité est encapsulée dans un module
- **Injection de dépendances** : comme Angular, NestJS utilise un système d'IoC puissant
- **Décorateurs TypeScript** : le code est lisible et expressif
- **Écosystème riche** : intégrations officielles avec Prisma, Redis, JWT, etc.

## Conclusion

Pour des APIs robustes et maintenables, NestJS est un excellent choix.`,
          contentEn: `# Why I chose NestJS

NestJS is a Node.js framework heavily inspired by Angular in its architecture. It uses TypeScript by default and offers a modular structure that makes project maintenance easier.

## Advantages

- **Modular architecture**: each feature is encapsulated in a module
- **Dependency injection**: like Angular, NestJS uses a powerful IoC system
- **TypeScript decorators**: the code is readable and expressive
- **Rich ecosystem**: official integrations with Prisma, Redis, JWT, etc.

## Conclusion

For robust and maintainable APIs, NestJS is an excellent choice.`,
          tags: ['NestJS', 'Node.js', 'TypeScript', 'Backend'],
          published: true,
          featured: true,
          readTime: 5,
          createdAt: new Date('2026-05-12T09:00:00Z'),
        },
        {
          title: 'Gérer l\'état dans Angular avec les Signals',
          titleEn: 'Managing state in Angular with Signals',
          slug: 'angular-signals-etat',
          summary: 'Les Signals d\'Angular 17+ révolutionnent la gestion de l\'état réactif. Un tour d\'horizon de cette nouvelle primitive.',
          summaryEn: 'Angular 17+ Signals revolutionize reactive state management. An overview of this new primitive.',
          content: `# Les Signals dans Angular

Angular 17 a introduit les Signals comme nouvelle primitive réactive. Contrairement à RxJS, les Signals sont synchrones et plus simples à utiliser pour la gestion d'état local.

## Exemple

\`\`\`typescript
const count = signal(0);
const doubled = computed(() => count() * 2);

count.set(5); // doubled() === 10
\`\`\`

## Quand les utiliser ?

Les Signals sont idéaux pour l'état local d'un composant. Pour les flux asynchrones complexes, RxJS reste la meilleure option.`,
          contentEn: `# Signals in Angular

Angular 17 introduced Signals as a new reactive primitive. Unlike RxJS, Signals are synchronous and simpler to use for local state management.

## Example

\`\`\`typescript
const count = signal(0);
const doubled = computed(() => count() * 2);

count.set(5); // doubled() === 10
\`\`\`

## When to use them?

Signals are ideal for component-local state. For complex async streams, RxJS remains the best option.`,
          tags: ['Angular', 'Signals', 'Frontend', 'TypeScript'],
          published: true,
          featured: false,
          readTime: 4,
          createdAt: new Date('2026-05-26T09:00:00Z'),
        },
        {
          title: 'De développeur Full-Stack à Tech Lead',
          titleEn: 'From Full-Stack Developer to Technical Lead',
          slug: 'developpeur-full-stack-tech-lead',
          summary: 'Passer Tech Lead ne consiste pas à écrire plus de code : il s’agit surtout de créer les conditions pour que toute l’équipe livre mieux.',
          summaryEn: 'Becoming a Technical Lead is not about writing more code; it is about creating the conditions for the whole team to deliver better.',
          content: `# De développeur Full-Stack à Tech Lead

Le passage au rôle de Tech Lead change la définition d'une journée réussie. La qualité de votre propre code reste importante, mais elle ne suffit plus.

## Donner un cap technique

Une architecture utile doit être comprise par l'équipe. Je privilégie des décisions courtes, documentées et réversibles lorsque c'est possible.

## Fluidifier la livraison

- Clarifier les responsabilités entre modules
- Automatiser les contrôles dans la CI
- Réduire la taille des changements
- Partager le contexte pendant les revues

## Faire grandir le collectif

Le meilleur indicateur n'est pas le nombre de tickets que le Tech Lead termine, mais l'autonomie et la confiance que l'équipe gagne.`,
          contentEn: `# From Full-Stack Developer to Technical Lead

Moving into a Technical Lead role changes the definition of a successful day. The quality of your own code still matters, but it is no longer enough.

## Set a technical direction

A useful architecture must be understood by the team. I favor short, documented decisions that remain reversible whenever possible.

## Improve delivery flow

- Clarify responsibilities between modules
- Automate checks in CI
- Reduce change size
- Share context during reviews

## Grow the team

The best indicator is not how many tickets the Technical Lead completes, but how much autonomy and confidence the team gains.`,
          tags: ['Leadership', 'Architecture', 'Engineering'],
          published: true,
          featured: true,
          readTime: 6,
          createdAt: new Date('2026-06-18T09:00:00Z'),
        },
        {
          title: 'Accélérer Angular sans complexifier l’application',
          titleEn: 'Making Angular faster without making it complex',
          slug: 'performance-angular-sans-complexite',
          summary: 'Une méthode pragmatique pour améliorer les performances Angular avec les Signals, le lazy loading et une mesure utile.',
          summaryEn: 'A pragmatic approach to Angular performance using Signals, lazy loading, and meaningful measurements.',
          content: `# Accélérer Angular sans complexifier l'application

La performance commence par une mesure, pas par une optimisation prématurée.

## Les leviers les plus rentables

- Découper les routes et fonctionnalités lourdes
- Stabiliser les calculs avec les Signals
- Réduire le travail réalisé pendant la détection de changements
- Optimiser les images et les polices

## Mesurer avant et après

Une amélioration est utile lorsqu'elle réduit un temps perceptible par l'utilisateur sans dégrader la lisibilité du code.`,
          contentEn: `# Making Angular faster without making it complex

Performance starts with measurement, not premature optimization.

## High-impact improvements

- Split heavy routes and features
- Stabilize computations with Signals
- Reduce work during change detection
- Optimize images and fonts

## Measure before and after

An improvement matters when it reduces user-perceived latency without damaging code readability.`,
          tags: ['Angular', 'Frontend', 'Performance'],
          published: true,
          featured: true,
          readTime: 5,
          createdAt: new Date('2026-06-10T09:00:00Z'),
        },
        {
          title: 'Concevoir une API Symfony qui dure',
          titleEn: 'Designing a Symfony API that lasts',
          slug: 'api-symfony-maintenable',
          summary: 'Contrats explicites, validation aux frontières et responsabilités claires : les bases d’une API Symfony maintenable.',
          summaryEn: 'Explicit contracts, boundary validation, and clear responsibilities: the foundations of a maintainable Symfony API.',
          content: `# Concevoir une API Symfony qui dure

Une API robuste ne dépend pas uniquement du framework. Elle dépend surtout de frontières claires.

## Des contrats explicites

Les DTO permettent de distinguer les données reçues du modèle métier et rendent la validation visible.

## Une architecture proportionnée

Les couches doivent protéger le domaine sans transformer chaque fonctionnalité en cérémonie. La bonne architecture reste simple à expliquer à l'équipe.`,
          contentEn: `# Designing a Symfony API that lasts

A robust API does not depend on the framework alone. It mostly depends on clear boundaries.

## Explicit contracts

DTOs separate incoming data from the domain model and make validation visible.

## Proportionate architecture

Layers should protect the domain without turning every feature into a ceremony. Good architecture remains easy to explain to the team.`,
          tags: ['Backend', 'Symfony', 'API'],
          published: true,
          featured: false,
          readTime: 6,
          createdAt: new Date('2026-05-30T09:00:00Z'),
        },
        {
          title: 'Une CI Docker rapide et fiable',
          titleEn: 'A fast and reliable Docker CI pipeline',
          slug: 'ci-docker-rapide-fiable',
          summary: 'Caches, images reproductibles et feedback rapide : construire une CI qui aide réellement l’équipe.',
          summaryEn: 'Caching, reproducible images, and fast feedback: building CI that genuinely helps the team.',
          content: `# Une CI Docker rapide et fiable

Une bonne CI donne confiance sans ralentir l'équipe.

## Images reproductibles

Épinglez les versions importantes, séparez les étapes de build et exploitez correctement le cache des dépendances.

## Feedback rapide

- Lancer les contrôles les moins coûteux en premier
- Exécuter les suites indépendantes en parallèle
- Publier des erreurs lisibles
- Garder les étapes de déploiement explicites`,
          contentEn: `# A fast and reliable Docker CI pipeline

Good CI creates confidence without slowing the team down.

## Reproducible images

Pin important versions, separate build stages, and use dependency caches effectively.

## Fast feedback

- Run inexpensive checks first
- Execute independent suites in parallel
- Publish readable failures
- Keep deployment steps explicit`,
          tags: ['DevOps', 'Docker', 'CI/CD'],
          published: true,
          featured: false,
          readTime: 5,
          createdAt: new Date('2026-05-18T09:00:00Z'),
        },
        {
          title: 'Clean Architecture : garder ce qui aide',
          titleEn: 'Clean Architecture: keeping what helps',
          slug: 'clean-architecture-pragmatique',
          summary: 'Une lecture pragmatique de la Clean Architecture pour protéger le métier sans multiplier les abstractions.',
          summaryEn: 'A pragmatic take on Clean Architecture that protects business logic without multiplying abstractions.',
          content: `# Clean Architecture : garder ce qui aide

La Clean Architecture est une direction, pas un concours de dossiers.

## Protéger les décisions métier

Le cœur de l'application doit pouvoir évoluer sans dépendre directement du transport HTTP ou de la base de données.

## Éviter l'abstraction automatique

Une interface devient utile lorsqu'elle exprime une vraie frontière ou permet plusieurs implémentations crédibles. Sinon, elle ajoute souvent du bruit.`,
          contentEn: `# Clean Architecture: keeping what helps

Clean Architecture is a direction, not a folder competition.

## Protect business decisions

The application core should evolve without directly depending on HTTP transport or database details.

## Avoid automatic abstractions

An interface is useful when it expresses a real boundary or supports credible implementations. Otherwise, it often adds noise.`,
          tags: ['Architecture', 'Backend', 'Testing'],
          published: true,
          featured: true,
          readTime: 7,
          createdAt: new Date('2026-06-25T09:00:00Z'),
        },
      ],
    });
    console.log('✅ Articles de blog créés');
  }

  // ─── Testimonials ─────────────────────────────────────────────
  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Équipe produit',
        role: 'Collaboration produit',
        company: 'Jizô AI',
        quote: 'Brahim sait relier les décisions techniques aux vrais enjeux produit, puis accompagner l’équipe jusqu’à une livraison solide.',
        quoteEn: 'Brahim connects technical decisions to real product goals and guides the team toward reliable delivery.',
        order: 1,
      },
      {
        name: 'Direction technique',
        role: 'Collaboration engineering',
        quote: 'Une approche pragmatique, beaucoup de clarté dans les arbitrages et une attention constante à la maintenabilité.',
        quoteEn: 'A pragmatic approach, clear trade-offs and constant attention to maintainability.',
        order: 2,
      },
      {
        name: 'Partenaire projet',
        role: 'Accompagnement digital',
        quote: 'Le besoin métier a rapidement été transformé en une expérience claire, moderne et réellement utilisable.',
        quoteEn: 'The business need was quickly turned into a clear, modern and genuinely usable experience.',
        order: 3,
      },
    ],
  });
  console.log('✅ Témoignages créés');

  console.log('\n🎉 Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
