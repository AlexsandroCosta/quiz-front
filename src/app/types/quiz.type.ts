export interface Resposta {
  id: number;
  resposta: string;
  correta: boolean;
}

export interface Pergunta {
  quizPergunta_id: number;
  pergunta: string;
  respostas: Resposta[];
}

export interface Conteudo {
  quizConteudo_id: number;
  conteudo_nome: string;
  perguntas: Pergunta[];
}

export interface Quiz {
  id: number;
  usuario: number;
  area: number;
  area_nome: string;
  nivel: string;
  nivel_display: string;
  pontuacao: number;
  criacao: string;  // ISO datetime string
  conteudos: Conteudo[];
}
