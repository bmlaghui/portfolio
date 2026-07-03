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
          content: `NestJS est un framework Node.js qui s'inspire fortement d'Angular dans son architecture. Il utilise TypeScript par défaut et propose une structure modulaire qui facilite la maintenance des projets.`,
          contentEn: `NestJS is a Node.js framework heavily inspired by Angular. It uses TypeScript by default and offers a modular structure.`,
          blocks: [
            { id: 'b1', type: 'paragraph', content: `<h2>Pourquoi NestJS ?</h2><p>NestJS est un framework Node.js qui s\'inspire d\'Angular dans son architecture. Il utilise TypeScript par défaut et propose une structure modulaire qui facilite la maintenance des projets à grande échelle.</p>` },
            { id: 'b2', type: 'paragraph', content: `<h3>Architecture modulaire</h3><p>Chaque fonctionnalité est encapsulée dans un <strong>module NestJS</strong>. Cela permet d\'isoler les responsabilités et de tester chaque partie indépendamment.</p>` },
            { id: 'b3', type: 'code', language: 'typescript', content: `@Module({
  imports: [PrismaModule, JwtModule.registerAsync({...})],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}` },
            { id: 'b4', type: 'paragraph', content: `<h3>Injection de dépendances</h3><p>Le système d\'IoC de NestJS rend le code testable et les dépendances explicites. Chaque service déclare ses dépendances via le constructeur.</p>` },
            { id: 'b5', type: 'code', language: 'typescript', content: `@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    });
  }
}` },
            { id: 'b6', type: 'quote', content: 'NestJS vous force à écrire du code structuré dès le départ, ce qui vous remercie à chaque nouvelle fonctionnalité.', caption: `Retour d\'expérience personnel` },
          ],
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
          content: `Les Signals sont la nouvelle primitive réactive d'Angular, synchrones et simples à composer.`,
          contentEn: `Signals are Angular's new reactive primitive, synchronous and easy to compose.`,
          blocks: [
            { id: 'b1', type: 'paragraph', content: `<h2>Les Signals dans Angular 17+</h2><p>Angular 17 a introduit les <strong>Signals</strong> comme nouvelle primitive réactive. Contrairement à RxJS, les Signals sont <strong>synchrones</strong> et plus simples à utiliser pour la gestion d\'état local d\'un composant.</p>` },
            { id: 'b2', type: 'code', language: 'typescript', content: `import { signal, computed, effect } from '@angular/core';

// Signal de base
const count = signal(0);

// Signal calculé
const doubled = computed(() => count() * 2);

// Effet (s'exécute quand les deps changent)
effect(() => console.log('count =', count()));

// Mutation
count.set(5);         // doubled() === 10
count.update(v => v + 1); // count() === 6` },
            { id: 'b3', type: 'paragraph', content: `<h3>Signals vs RxJS : quand utiliser quoi ?</h3><ul><li><strong>Signals</strong> : état local d\'un composant, valeurs dérivées synchrones, bindings dans le template</li><li><strong>RxJS</strong> : flux asynchrones (HTTP, WebSocket), opérations complexes (debounce, merge, switchMap)</li></ul>` },
            { id: 'b4', type: 'code', language: 'typescript', content: `@Component({
  template: \`
    <h1>{{ title() }}</h1>
    <p>Count: {{ count() }}</p>
    <button (click)="increment()">+</button>
  \`,
})
export class CounterComponent {
  count = signal(0);
  title = computed(() => \`Counter: \${this.count()}\`);

  increment() { this.count.update(v => v + 1); }
}` },
            { id: 'b5', type: 'quote', content: `Avec les Signals, Angular évolue vers une réactivité fine-grained sans Zone.js. C\'est l\'avenir du framework.', caption: 'Angular Blog, 2024` },
          ],
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
          summary: "Passer Tech Lead ne consiste pas à écrire plus de code : il s'agit surtout de créer les conditions pour que toute l'équipe livre mieux.",
          summaryEn: 'Becoming a Technical Lead is not about writing more code; it is about creating the conditions for the whole team to deliver better.',
          content: "Le passage au rôle de Tech Lead change la définition d'une journée réussie. Architecture, livraison, collectif.",
          contentEn: 'Moving to Technical Lead changes the definition of a successful day. Architecture, delivery, team growth.',
          blocks: [
            { id: 'b1', type: 'paragraph', content: "<h2>De développeur Full-Stack à Tech Lead</h2><p>Le passage au rôle de Tech Lead change la définition d'une journée réussie. La qualité de votre propre code reste importante, mais elle ne suffit plus : vous devenez <strong>responsable de la qualité collective</strong>.</p>" },
            { id: 'b2', type: 'paragraph', content: "<h3>Donner un cap technique</h3><p>Une architecture utile doit être comprise par l'équipe. Je privilégie des <strong>décisions courtes, documentées et réversibles</strong> lorsque c'est possible. L'Architecture Decision Record (ADR) est un outil simple et puissant pour cela.</p>" },
            { id: 'b3', type: 'code', language: 'markdown', content: `# ADR-001 : Choix de NestJS pour le backend

## Contexte
Nous devons choisir un framework Node.js pour l'API REST du projet.

## Décision
Utiliser NestJS pour sa structure modulaire et son écosystème TypeScript mature.

## Conséquences
- ✅ Structure claire, decorateurs, injection de dépendances
- ✅ Tests unitaires et e2e bien supportés
- ⚠️ Courbe d'apprentissage pour les devs junior` },
            { id: 'b4', type: 'paragraph', content: "<h3>Fluidifier la livraison</h3><p>Un bon Tech Lead mesure son impact à la <strong>vitesse de livraison de l'équipe</strong>, pas à son propre throughput. Quelques leviers clés :</p><ul><li>Clarifier les responsabilités entre modules</li><li>Automatiser les contrôles dans la CI</li><li>Réduire la taille des PR (200 lignes max idéalement)</li><li>Partager le contexte pendant les revues</li></ul>" },
            { id: 'b5', type: 'quote', content: "Le meilleur indicateur n'est pas le nombre de tickets que le Tech Lead termine, mais l'autonomie et la confiance que l'équipe gagne.", caption: "Mon approche du leadership technique" },
          ],
          tags: ['Leadership', 'Architecture', 'Engineering'],
          published: true,
          featured: true,
          readTime: 6,
          createdAt: new Date('2026-06-18T09:00:00Z'),
        },
        {
          title: "Accélérer Angular sans complexifier l'application",
          titleEn: 'Making Angular faster without making it complex',
          slug: 'performance-angular-sans-complexite',
          summary: 'Une méthode pragmatique pour améliorer les performances Angular avec les Signals, le lazy loading et une mesure utile.',
          summaryEn: 'A pragmatic approach to Angular performance using Signals, lazy loading, and meaningful measurements.',
          content: "Performance Angular : Signals, lazy loading, OnPush, images optimisées, mesure avec DevTools.",
          contentEn: 'Angular performance: Signals, lazy loading, OnPush, optimized images, DevTools measurement.',
          blocks: [
            { id: 'b1', type: 'paragraph', content: "<h2>Accélérer Angular sans complexifier</h2><p>La performance commence par une <strong>mesure</strong>, pas par une optimisation prématurée. Angular DevTools et Lighthouse sont vos premiers outils.</p>" },
            { id: 'b2', type: 'paragraph', content: '<h3>OnPush + Signals = moins de re-renders</h3><p>Avec <code>ChangeDetectionStrategy.OnPush</code> et les Signals, Angular ne re-rend que les composants dont les données ont changé. Résultat : bien moins de travail pour le moteur de rendu.</p>' },
            { id: 'b3', type: 'code', language: 'typescript', content: `@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    @for (item of items(); track item.id) {
      <app-item [data]="item" />
    }
  \`,
})
export class ListComponent {
  items = signal<Item[]>([]);

  // Angular ne re-render que si items() change réellement
  updateItem(id: number, patch: Partial<Item>) {
    this.items.update(list =>
      list.map(item => item.id === id ? { ...item, ...patch } : item)
    );
  }
}` },
            { id: 'b4', type: 'paragraph', content: '<h3>Lazy loading + preloading strategy</h3><p>Découpez vos routes et préchargez intelligemment avec <code>PreloadAllModules</code> ou une stratégie custom pour éviter les délais sur navigation.</p>' },
            { id: 'b5', type: 'code', language: 'typescript', content: `@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,  // précharge en arrière-plan
    }),
  ],
})
export class AppModule {}` },
            { id: 'b6', type: 'quote', content: "Une amélioration est utile lorsqu'elle réduit un temps perceptible par l'utilisateur sans dégrader la lisibilité du code.", caption: "Règle d'or perf" },
          ],
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
          summary: "Contrats explicites, validation aux frontières et responsabilités claires : les bases d'une API Symfony maintenable.",
          summaryEn: 'Explicit contracts, boundary validation, and clear responsibilities: the foundations of a maintainable Symfony API.',
          content: "API Symfony maintenable : DTO, validation, architecture en couches, tests.",
          contentEn: 'Maintainable Symfony API: DTOs, validation, layered architecture, testing.',
          blocks: [
            { id: 'b1', type: 'paragraph', content: "<h2>Concevoir une API Symfony qui dure</h2><p>Une API robuste ne dépend pas uniquement du framework. Elle dépend surtout de <strong>frontières claires</strong> entre les couches et de contrats explicites avec les clients.</p>" },
            { id: 'b2', type: 'paragraph', content: '<h3>DTOs et validation aux frontières</h3><p>Les DTO séparent les données reçues du modèle métier et rendent la validation visible et testable. Symfony Validator + API Platform forment un duo puissant.</p>' },
            { id: 'b3', type: 'code', language: 'php', content: `<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class CreateProjectDto
{
    #[Assert\NotBlank]
    #[Assert\Length(min: 3, max: 100)]
    public string $title;

    #[Assert\NotBlank]
    public string $description;

    #[Assert\Url]
    #[Assert\NotBlank]
    public string $githubUrl;

    /** @var string[] */
    #[Assert\All([new Assert\NotBlank()])]
    public array $technologies = [];
}` },
            { id: 'b4', type: 'paragraph', content: `<h3>Service layer : un seul point d'entrée par cas d'usage</h3><p>Chaque fonctionnalité métier a son propre service. Le controller ne fait qu'orchestrer : valider, appeler le service, retourner la réponse.</p>` },
            { id: 'b5', type: 'code', language: 'php', content: `#[Route('/api/projects', methods: ['POST'])]
public function create(
    Request $request,
    ProjectService $service,
    ValidatorInterface $validator
): JsonResponse {
    $dto = $this->serializer->deserialize($request->getContent(), CreateProjectDto::class, 'json');
    
    $errors = $validator->validate($dto);
    if (count($errors) > 0) {
        return $this->json(['errors' => (string) $errors], 422);
    }

    $project = $service->create($dto);
    return $this->json($project, 201, [], ['groups' => ['project:read']]);
}` },
            { id: 'b6', type: 'quote', content: "Les couches doivent protéger le domaine sans transformer chaque fonctionnalité en cérémonie. La bonne architecture reste simple à expliquer à l'équipe.", caption: 'Principe de proportionnalité' },
          ],
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
          summary: "Caches, images reproductibles et feedback rapide : construire une CI qui aide réellement l'équipe.",
          summaryEn: 'Caching, reproducible images, and fast feedback: building CI that genuinely helps the team.',
          content: "Une bonne CI donne confiance sans ralentir l'équipe. Multi-stage builds, cache npm, GitHub Actions.",
          contentEn: 'Good CI creates confidence without slowing the team. Multi-stage builds, npm cache, GitHub Actions.',
          blocks: [
            { id: 'b1', type: 'paragraph', content: "<h2>Une CI Docker rapide et fiable</h2><p>Une pipeline CI bien conçue est un <strong>multiplicateur de vitesse</strong>. Elle donne confiance en la qualité sans ralentir les livraisons.</p>" },
            { id: 'b2', type: 'paragraph', content: '<h3>Multi-stage Dockerfile</h3><p>Séparer les étapes de build des artefacts finaux réduit la taille des images et isole les dépendances de dev.</p>' },
            { id: 'b3', type: 'code', language: 'dockerfile', content: `# Stage build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --frozen-lockfile
COPY . .
RUN npm run build

# Stage production
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]` },
            { id: 'b4', type: 'paragraph', content: '<h3>GitHub Actions avec cache npm</h3><p>Le cache des node_modules peut diviser le temps de build par 3 sur un projet classique.</p>' },
            { id: 'b5', type: 'code', language: 'yaml', content: `name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build` },
            { id: 'b6', type: 'quote', content: "Une CI qui échoue en moins de 3 minutes est une CI utile. Au-delà, les développeurs arrêtent de la surveiller.", caption: 'Principe DevOps' },
          ],
          tags: ['DevOps', 'Docker', 'CI/CD'],
          published: true,
          featured: false,
          readTime: 5,
          createdAt: new Date('2026-05-18T09:00:00Z'),
        },
        {
          title: "10 tips Angular que j'utilise au quotidien",
          titleEn: '10 Angular tips I use every day',
          slug: 'tips-angular-quotidien',
          summary: 'Des techniques concrètes pour écrire du code Angular plus propre, plus performant et plus maintenable.',
          summaryEn: 'Concrete techniques to write cleaner, faster and more maintainable Angular code.',
          content: "Tips Angular : standalone components, signals, lazy loading, OnPush et plus.",
          contentEn: 'Angular tips: standalone components, signals, lazy loading, OnPush and more.',
          blocks: [
            { id: 'b1', type: 'paragraph', content: "<h2>10 tips Angular au quotidien</h2><p>Voici les patterns que j'utilise systématiquement dans mes projets Angular pour garder le code propre et performant.</p>" },
            { id: 'b2', type: 'paragraph', content: '<h3>1. Composants standalone</h3><p>Depuis Angular 14+, les composants standalone suppriment le besoin de NgModule et rendent les dépendances explicites.</p>' },
            { id: 'b3', type: 'code', language: 'typescript', content: `@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: \`<h1>{{ title() }}</h1>\`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent {
  title = signal('Hello');
}` },
            { id: 'b4', type: 'paragraph', content: '<h3>2. takeUntilDestroyed</h3><p>Fini le boilerplate de désabonnement manuel. Le hook takeUntilDestroyed gère automatiquement le cycle de vie.</p>' },
            { id: 'b5', type: 'code', language: 'typescript', content: `import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({...})
export class MyComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.service.data$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.data.set(data));
  }
}` },
            { id: 'b6', type: 'paragraph', content: '<h3>3. Lazy loading des routes</h3><p>Ne chargez que ce dont utilisateur a besoin. Le lazy loading réduit le bundle initial et améliore le First Contentful Paint.</p>' },
            { id: 'b7', type: 'code', language: 'typescript', content: `export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./blog/blog-detail').then(m => m.BlogDetailComponent)
  },
];` },
            { id: 'b8', type: 'quote', content: "Les bonnes performances Angular ne viennent pas d'une seule technique, mais de l'accumulation de bonnes habitudes.", caption: "Retour d'expérience" },
          ],
          tags: ['Angular', 'TypeScript', 'Frontend', 'Performance'],
          published: true,
          featured: true,
          readTime: 8,
          createdAt: new Date('2026-06-28T09:00:00Z'),
        },
        {
          title: 'Clean Architecture : garder ce qui aide',
          titleEn: 'Clean Architecture: keeping what helps',
          slug: 'clean-architecture-pragmatique',
          summary: 'Une lecture pragmatique de la Clean Architecture pour protéger le métier sans multiplier les abstractions.',
          summaryEn: 'A pragmatic take on Clean Architecture that protects business logic without multiplying abstractions.',
          content: "Clean Architecture : une direction, pas un concours de dossiers. Protéger le domaine, éviter l'abstraction automatique.",
          contentEn: 'Clean Architecture: a direction, not a folder contest. Protect the domain, avoid automatic abstractions.',
          blocks: [
            { id: 'b1', type: 'paragraph', content: "<h2>Clean Architecture : garder ce qui aide</h2><p>La Clean Architecture est souvent mal interprétée comme une liste de dossiers à créer. C'est avant tout une <strong>direction</strong> : isoler les décisions métier du reste.</p>" },
            { id: 'b2', type: 'paragraph', content: "<h3>Protéger le domaine</h3><p>Le cœur de l'application doit pouvoir évoluer sans dépendre directement du transport HTTP ou de la base de données. En pratique, cela signifie des <strong>interfaces de repository</strong> et des use cases indépendants de l'infrastructure.</p>" },
            { id: 'b3', type: 'code', language: 'typescript', content: `// ✅ Use case : aucune dépendance NestJS, aucun Prisma direct
export class CreateProjectUseCase {
  constructor(private readonly repo: IProjectRepository) {}

  async execute(dto: CreateProjectDto): Promise<Project> {
    const project = Project.create(dto);  // logique métier ici
    return this.repo.save(project);       // l'infra est injectée
  }
}

// L'implémentation Prisma est dans la couche infrastructure
@Injectable()
export class PrismaProjectRepository implements IProjectRepository {
  constructor(private prisma: PrismaService) {}

  async save(project: Project): Promise<Project> {
    return this.prisma.project.create({ data: project });
  }
}` },
            { id: 'b4', type: 'paragraph', content: "<h3>Éviter l'abstraction automatique</h3><p>Une interface est utile lorsqu'elle exprime une vraie frontière ou permet plusieurs implémentations crédibles. Pour un CRUD simple, une architecture en couches (controller → service → repository) suffit souvent. <strong>Ne créez pas de complexité pour l'amour de la complexité.</strong></p>" },
            { id: 'b5', type: 'paragraph', content: `<h3>Quand aller plus loin ?</h3><p>La Clean Architecture complète vaut l'investissement quand le domaine est riche (règles métier complexes, multiples sources de données, besoin de testabilité maximale). Pour la majorité des applications CRUD, une architecture simple et bien organisée est largement suffisante.</p>` },
            { id: 'b6', type: 'quote', content: "La complexité architecturale doit être proportionnelle à la complexité métier, pas à l'ambition du développeur.", caption: 'Principe de proportionnalité' },
          ],
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
