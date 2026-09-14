export type CRMStage = {
  id: string;
  name: string;
  color: string;
};

export type Lead = {
  id: string;
  name: string;
  score: number;
  category: string;
  phone: string;
  crmStageId: string;
  position: number;
};

export const DEFAULT_PIPELINE: CRMStage[] = [
  { id: 'novo', name: 'Novo', color: 'bg-gray-500 border-gray-500' },
  { id: 'contatado', name: 'Contatado', color: 'bg-blue-500 border-blue-500' },
  { id: 'respondeu', name: 'Respondeu', color: 'bg-cyan-500 border-cyan-500' },
  { id: 'interessado', name: 'Interessado', color: 'bg-yellow-500 border-yellow-500' },
  { id: 'reuniao', name: 'Reunião', color: 'bg-orange-500 border-orange-500' },
  { id: 'proposta', name: 'Proposta', color: 'bg-purple-500 border-purple-500' },
  { id: 'negociacao', name: 'Negociação', color: 'bg-pink-500 border-pink-500' },
  { id: 'ganho', name: 'Ganho', color: 'bg-green-500 border-green-500' },
  { id: 'perdido', name: 'Perdido', color: 'bg-red-500 border-red-500' },
];
