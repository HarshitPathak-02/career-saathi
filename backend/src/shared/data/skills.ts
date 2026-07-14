export interface Skill {
  code: string;
  name: string;
  category: string;
  description: string;
}

export const skills: Skill[] = [
  {
    code: 'JAVASCRIPT',
    name: 'JavaScript',
    category: 'Programming Language',
    description:
      'Core programming language used for web development.',
  },
  {
    code: 'NODE_JS',
    name: 'Node.js',
    category: 'Backend',
    description:
      'JavaScript runtime for building server-side applications.',
  },
  {
    code: 'EXPRESS',
    name: 'Express.js',
    category: 'Backend',
    description:
      'Minimal and flexible Node.js web framework.',
  },
  {
    code: 'MONGODB',
    name: 'MongoDB',
    category: 'Database',
    description:
      'NoSQL document database.',
  },
  {
    code: 'GIT',
    name: 'Git',
    category: 'Version Control',
    description:
      'Distributed version control system.',
  },
  {
    code: 'REST_API',
    name: 'REST APIs',
    category: 'Backend',
    description:
      'Architectural style for building web APIs.',
  },
  {
    code: 'AUTHENTICATION',
    name: 'Authentication',
    category: 'Security',
    description:
      'Verifying the identity of users.',
  },
  {
    code: 'DOCKER',
    name: 'Docker',
    category: 'DevOps',
    description:
      'Containerization platform for applications.',
  },
];