export type StatusFrete = 'aberto'|'negociando'|'fechado'|'cancelado'|'entregue';
export interface Frete {
  id:string; embarcador_id:string;
  origem_cidade:string; origem_uf:string;
  destino_cidade:string; destino_uf:string;
  tipo_carga:string; tipo_veiculo:string; carroceria:string;
  peso_kg:number; valor_oferecido:number|null;
  data_coleta:string; descricao:string|null;
  status:StatusFrete; created_at:string;
}
export interface Mensagem { id:string; conversa_id:string; autor_id:string; conteudo:string; lida:boolean; created_at:string; }
