import { describe, it, expect } from 'vitest';
function limparDoc(s:string){ return s.replace(/\D/g,''); }
function validarDocBasico(s:string){ const d = limparDoc(s); return d.length===11 || d.length===14; }
function formatarBRL(v:number){ return v.toLocaleString('pt-BR',{ style:'currency', currency:'BRL' }); }
describe('validação de documentos', () => {
  it('aceita CPF', ()=> expect(validarDocBasico('123.456.789-01')).toBe(true));
  it('aceita CNPJ', ()=> expect(validarDocBasico('12.345.678/0001-90')).toBe(true));
  it('rejeita curto', ()=> expect(validarDocBasico('123')).toBe(false));
});
describe('formatação BRL', () => {
  it('formata reais', ()=> expect(formatarBRL(4500)).toMatch(/4\.500,00/));
});
