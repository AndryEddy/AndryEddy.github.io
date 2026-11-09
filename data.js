// Everything the portfolio shows: edit this file only to change the content.
// Categories: install, custom, migration, functional, integration, ai
window.PORTFOLIO = {
  name: 'Andry Eddy Rabeharilalao',
  shortName: 'Eddy',
  title: 'Développeur Odoo',
  // The years of experience are counted from this date
  careerStart: '2016-02',
  pitch: "Je conçois, personnalise et fais évoluer des ERP Odoo : de l'installation sur Docker à la migration vers la dernière version, en passant par les modules sur mesure et l'analyse fonctionnelle.",
  location: 'Antananarivo, Madagascar · télétravail ou présentiel',
  email: 'andryrabeharilalao@gmail.com',
  // Fill in the address of your LinkedIn profile (left empty: the link is hidden)
  linkedin: '',
  // A public version of the CV (without address nor phone), e.g. 'cv.pdf'; empty: no button
  cv: '',
  // A photo next to this file, e.g. 'photo.jpg'; empty: the initials are shown
  photo: 'photo.jpg',

  // "J'" before a vowel or an h, "Je" otherwise: chosen by itself
  verbs: ['installe', 'personnalise', 'migre', 'corrige', 'analyse', 'connecte', 'héberge', 'fais évoluer'],

  categories: {
    install: { label: 'Installation', color: '#3aa0ff' },
    custom: { label: 'Personnalisation', color: '#b77fd1' },
    migration: { label: 'Migration', color: '#f39a55' },
    functional: { label: 'Fonctionnel', color: '#36c2a5' },
    integration: { label: 'Intégrations', color: '#e8c35a' },
    ai: { label: 'IA', color: '#f07ab7' },
  },

  // The versions of Odoo worked on
  versions: [8, 9, 10, 11, 12, 13, 15, 16, 17, 18, 19],

  timeline: [
    {
      type: 'experience', start: '2026-04', end: null,
      role: 'Développeur Odoo', company: 'Captivea', place: 'Antananarivo',
      versions: [16, 17, 18, 19],
      items: [
        ['migration', 'Migration Odoo Enterprise de la v16 à la v19'],
        ['custom', 'Personnalisation de modules sous Odoo 18 et 19'],
        ['custom', 'Conception de rapports QWeb sous Odoo 19'],
        ['custom', 'Modules sur mesure selon les besoins des clients (v18, v19)'],
        ['ai', "Recherche et développement en IA appliquée à Odoo (LLM, RAG)"],
      ],
      tools: ['Git', 'Docker', 'Odoo.sh'],
    },
    {
      type: 'experience', start: '2023-02', end: '2026-04',
      role: 'Développeur Odoo', company: 'Abakus IT Solutions', place: 'Antananarivo',
      versions: [15, 16, 17, 18, 19],
      items: [
        ['functional', 'Analyse des besoins clients'],
        ['install', 'Implémentation Odoo Enterprise 15 : nouvelles fonctionnalités et support client'],
        ['migration', 'Migration Odoo de la v15 à la v18'],
        ['custom', 'Personnalisation en v18 : Réparation, Contacts, Facturation'],
        ['custom', 'Personnalisation de rapports PDF en v19'],
      ],
      tools: ['Git', 'Agile'],
    },
    {
      type: 'experience', start: '2020-11', end: '2023-01',
      role: 'Développeur Odoo Senior', company: 'Ingenosya', place: 'Antananarivo',
      versions: [13],
      items: [
        ['functional', 'Analyse des besoins clients'],
        ['custom', 'Modules Odoo 13 Community et Enterprise'],
        ['functional', 'Présences, GED, Produits, Fabrication, Stock, Ventes, Achats'],
      ],
      tools: ['Git', 'Agile'],
    },
    {
      type: 'experience', start: '2020-01', end: '2020-11',
      role: 'Développeur Odoo Senior', company: 'Etech Consulting (Arkeup France)', place: 'Antananarivo',
      versions: [11, 13],
      items: [
        ['functional', 'Analyse des besoins clients'],
        ['custom', 'Modules Odoo 11 et 13 : Achats, Ventes, Comptabilité, Stock'],
        ['integration', 'Modules Smile Impex et Smile Log (imports, journaux)'],
        ['install', 'Déploiements sur Odoo.sh'],
      ],
      tools: ['SVN', 'Git', 'Jira', 'Odoo.sh', 'Agile'],
    },
    {
      type: 'experience', start: '2017-07', end: '2019-12',
      role: 'Développeur Odoo Confirmé', company: 'Etech Consulting (Arkeup France)', place: 'Antananarivo',
      versions: [10, 11, 12],
      items: [
        ['custom', 'Modules Odoo 10, 11 et 12 Community et Enterprise'],
        ['integration', 'Webservices XML-RPC et JSON-RPC'],
        ['integration', 'Synchronisation des produits avec un ESB (Talend)'],
        ['integration', 'Paiements en ligne : Lemonway, Stripe'],
        ['functional', "Ventes, Achats, Comptabilité, Stock, Point de vente, Employés, Site web, CRM, Fabrication"],
      ],
      tools: ['SVN', 'Git', 'Jira', 'Odoo.sh', 'Agile'],
    },
    {
      type: 'experience', start: '2016-08', end: '2017-07',
      role: 'Développeur Odoo Junior', company: 'Etech Consulting (Arkeup France)', place: 'Antananarivo',
      versions: [8, 9, 10],
      items: [
        ['custom', 'Modules Odoo 8, 9 et 10 Community et Enterprise'],
        ['integration', 'Webservices XML-RPC et JSON-RPC'],
        ['functional', "Achats, Ventes, Produits, Stock, Appels d'offres, Fabrication"],
      ],
      tools: ['SVN', 'Git', 'Jira', 'Agile'],
    },
    {
      type: 'experience', start: '2016-02', end: '2016-07',
      role: 'Développeur Odoo Junior', company: 'Solibre', place: 'Antananarivo',
      versions: [8],
      items: [
        ['custom', 'Modules Odoo : Ventes, Achats, Produits, Comptabilité, Stock'],
      ],
      tools: ['Git'],
    },
    {
      type: 'certification', start: '2025-01', end: null,
      role: 'Odoo 18 Functional Certification', company: 'Odoo S.A.', place: 'Belgique',
      versions: [18], items: [['functional', 'Certification fonctionnelle officielle Odoo 18']],
    },
    {
      type: 'certification', start: '2024-01', end: null,
      role: 'Odoo 16 Functional Certification', company: 'Odoo S.A.', place: 'Belgique',
      versions: [16], items: [['functional', 'Certification fonctionnelle officielle Odoo 16']],
    },
    {
      type: 'certification', start: '2022-01', end: null,
      role: 'Odoo 13 Functional Certification', company: 'Odoo S.A.', place: 'Belgique',
      versions: [13], items: [['functional', 'Certification fonctionnelle officielle Odoo 13']],
    },
    {
      type: 'education', start: '2012-02', end: '2015-12',
      role: 'Licence en Informatique de Gestion', company: 'Infocentre de la Salle', place: 'Antananarivo',
      versions: [], items: [['custom', "Parcours développement d'applications"]],
    },
  ],

  skills: [
    { name: 'Python', group: 'Back-end', strong: true },
    { name: 'ORM Odoo', group: 'Back-end', strong: true },
    { name: 'PostgreSQL', group: 'Back-end', strong: true },
    { name: 'MySQL', group: 'Back-end' },
    { name: 'API REST', group: 'Back-end' },
    { name: 'XML-RPC / JSON-RPC', group: 'Back-end' },
    { name: 'XML & vues Odoo', group: 'Front-end', strong: true },
    { name: 'QWeb', group: 'Front-end', strong: true },
    { name: 'OWL', group: 'Front-end' },
    { name: 'JavaScript', group: 'Front-end' },
    { name: 'HTML / CSS', group: 'Front-end', strong: true },
    { name: 'Docker', group: 'Déploiement', strong: true },
    { name: 'Odoo.sh', group: 'Déploiement', strong: true },
    { name: 'Linux', group: 'Déploiement' },
    { name: 'Git', group: 'Déploiement', strong: true },
    { name: 'LLM & RAG', group: 'IA' },
    { name: 'Agile / Jira', group: 'Méthode' },
  ],
}
