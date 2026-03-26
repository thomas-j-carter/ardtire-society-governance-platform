plugins: [
  [
    '@docusaurus/plugin-content-docs',
    {
      id: 'journal',
      path: 'journal',
      routeBasePath: 'journal',
      sidebarPath: './sidebars/journal.ts',
    },
  ],
  [
    '@docusaurus/plugin-content-docs',
    {
      id: 'adr',
      path: 'docs/adr',
      routeBasePath: 'adr',
      sidebarPath: './sidebars/adr.ts',
    },
  ],
  [
    '@docusaurus/plugin-content-docs',
    {
      id: 'ai',
      path: 'ai',
      routeBasePath: 'ai',
      sidebarPath: './sidebars/ai.ts',
    },
  ],
]