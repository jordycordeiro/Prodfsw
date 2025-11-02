import { MenuItem, ContentItem, User, FinancialPlan, Subscription, Payment } from './admin-types';

// Mock data para Menus e Prescrições
export const mockMenus: MenuItem[] = [
  {
    id: 1,
    name: 'Exame Físico',
    description: 'Conjunto de prescrições para exames físicos',
    status: 'active',
    prescriptions: [
      {
        id: 1,
        name: 'Observações Gerais',
        menuId: 1,
        content: 'Conteúdo das observações gerais',
        medications: [],
        status: 'active',
        createdAt: '2023-04-15',
        updatedAt: '2023-04-15',
      },
      {
        id: 2,
        name: 'Medicações na Unidade',
        menuId: 1,
        content: 'Conteúdo sobre medicações',
        medications: [
          { id: 1, name: 'Dipirona', dosage: '500mg' },
          { id: 2, name: 'Paracetamol', dosage: '750mg' },
        ],
        status: 'active',
        createdAt: '2023-04-15',
        updatedAt: '2023-04-15',
      },
      {
        id: 3,
        name: 'Infectologia',
        menuId: 1,
        content: 'Conteúdo sobre infectologia',
        medications: [],
        status: 'active',
        createdAt: '2023-04-15',
        updatedAt: '2023-04-15',
      },
    ],
    createdAt: '2023-04-15',
    updatedAt: '2023-04-15',
  },
  {
    id: 2,
    name: 'Sifilis',
    description: 'Prescrições relacionadas a sífilis',
    status: 'active',
    prescriptions: [
      {
        id: 4,
        name: 'USO ORAL - Posologia completa',
        menuId: 2,
        content: 'Posologia completa para uso oral',
        medications: [
          { id: 3, name: 'Penicilina G Benzatina', dosage: '2.4 milhões UI' },
        ],
        status: 'active',
        createdAt: '2023-04-15',
        updatedAt: '2023-04-15',
      },
    ],
    createdAt: '2023-04-15',
    updatedAt: '2023-04-15',
  },
  {
    id: 3,
    name: 'Cardiologia',
    description: 'Prescrições para cardiologia',
    status: 'active',
    prescriptions: [],
    createdAt: '2023-04-15',
    updatedAt: '2023-04-15',
  },
];

// Mock data para Conteúdo do Site
export const mockContent: ContentItem[] = [
  {
    id: 1,
    title: 'Exame Físico Completo',
    type: 'exam',
    author: 'Administrador',
    content: 'Descrição do exame físico completo',
    status: 'active',
    createdAt: '2023-04-15',
    updatedAt: '2023-04-15',
  },
  {
    id: 2,
    title: 'Exame Cardiológico',
    type: 'exam',
    author: 'Dr. Silva',
    content: 'Descrição do exame cardiológico',
    status: 'active',
    createdAt: '2023-03-22',
    updatedAt: '2023-03-22',
  },
  {
    id: 3,
    title: 'Síndrome Gripal',
    type: 'complaint',
    category: 'Infectologia',
    author: 'Administrador',
    content: 'Descrição da síndrome gripal',
    status: 'active',
    createdAt: '2023-05-10',
    updatedAt: '2023-05-10',
  },
  {
    id: 4,
    title: 'Diarréico Agudo',
    type: 'complaint',
    category: 'Gastroenterologia',
    author: 'Dra. Costa',
    content: 'Descrição do diarréico agudo',
    status: 'active',
    createdAt: '2023-05-05',
    updatedAt: '2023-05-05',
  },
  {
    id: 5,
    title: 'Modelo de Prescrição Padrão',
    type: 'template',
    author: 'Administrador',
    content: 'Modelo padrão de prescrição',
    status: 'active',
    createdAt: '2023-04-15',
    updatedAt: '2023-04-15',
  },
];

// Mock data para Usuários
export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Dr. João Silva',
    email: 'joao.silva@prodoc.com',
    type: 'doctor',
    status: 'active',
    registrationDate: '2023-01-15',
    lastLogin: '2023-05-10',
  },
  {
    id: 2,
    name: 'Dra. Maria Costa',
    email: 'maria.costa@prodoc.com',
    type: 'doctor',
    status: 'active',
    registrationDate: '2023-02-22',
    lastLogin: '2023-05-09',
  },
  {
    id: 3,
    name: 'Dr. Pedro Oliveira',
    email: 'pedro.oliveira@prodoc.com',
    type: 'admin',
    status: 'active',
    registrationDate: '2022-12-10',
    lastLogin: '2023-05-10',
  },
  {
    id: 4,
    name: 'Dra. Ana Santos',
    email: 'ana.santos@prodoc.com',
    type: 'doctor',
    status: 'inactive',
    registrationDate: '2023-03-05',
  },
];

// Mock data para Planos Financeiros
export const mockPlans: FinancialPlan[] = [
  {
    id: 1,
    name: 'Básico',
    price: 99.9,
    period: 'monthly',
    activeUsers: 85,
    status: 'active',
  },
  {
    id: 2,
    name: 'Profissional',
    price: 199.9,
    period: 'monthly',
    activeUsers: 42,
    status: 'active',
  },
  {
    id: 3,
    name: 'Enterprise',
    price: 499.9,
    period: 'monthly',
    activeUsers: 12,
    status: 'active',
  },
];

// Mock data para Assinaturas
export const mockSubscriptions: Subscription[] = [
  {
    id: 1,
    userId: 1,
    planId: 2,
    startDate: '2023-01-15',
    nextBillingDate: '2023-06-15',
    status: 'active',
  },
  {
    id: 2,
    userId: 2,
    planId: 1,
    startDate: '2023-02-22',
    nextBillingDate: '2023-06-22',
    status: 'active',
  },
];

// Mock data para Pagamentos
export const mockPayments: Payment[] = [
  {
    id: 1,
    userId: 1,
    planId: 2,
    amount: 199.9,
    date: '2023-05-15',
    status: 'paid',
  },
  {
    id: 2,
    userId: 2,
    planId: 1,
    amount: 99.9,
    date: '2023-05-22',
    status: 'paid',
  },
];
