import { describe, it, expect } from 'vitest';
function filtrarFretes(fretes:any[], filtro:any) {
  return fretes.filter(f=>{
    if (filtro.origem_uf && f.origem_uf !== filtro.origem_uf) return false;
    if (filtro.destino_uf && f.destino_uf !== filtro.destino_uf) return false;
    if (filtro.tipo_veiculo && f.tipo_veiculo !== filtro.tipo_veiculo) return false;
    if (filtro.carroceria && f.carroceria !== filtro.carroceria) return false;
    if (filtro.data_de && f.data_coleta < filtro.data_de) return false;
    return true;
  });
}
const mock = [
  { origem_uf:'SP', destino_uf:'PR', tipo_veiculo:'carreta', carroceria:'bau', data_coleta:'2025-01-10' },
  { origem_uf:'SP', destino_uf:'MG', tipo_veiculo:'truck', carroceria:'sider', data_coleta:'2025-01-05' },
  { origem_uf:'RJ', destino_uf:'PR', tipo_veiculo:'carreta', carroceria:'bau', data_coleta:'2025-01-20' },
];
describe('filtro de fretes', () => {
  it('por origem', ()=> expect(filtrarFretes(mock,{origem_uf:'SP'})).toHaveLength(2));
  it('por veículo + carroceria', ()=> expect(filtrarFretes(mock,{tipo_veiculo:'carreta',carroceria:'bau'})).toHaveLength(2));
  it('por data mínima', ()=> expect(filtrarFretes(mock,{data_de:'2025-01-10'})).toHaveLength(2));
});
