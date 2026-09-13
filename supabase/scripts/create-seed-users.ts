import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const users = [
  { id:'00000000-0000-0000-0000-000000000001', email:'alfa@teste.com',  password:'teste123' },
  { id:'00000000-0000-0000-0000-000000000002', email:'beta@teste.com',  password:'teste123' },
  { id:'00000000-0000-0000-0000-000000000003', email:'gamma@teste.com', password:'teste123' },
  { id:'00000000-0000-0000-0000-000000000011', email:'joao@teste.com',  password:'teste123' },
  { id:'00000000-0000-0000-0000-000000000012', email:'carlos@teste.com',password:'teste123' },
  { id:'00000000-0000-0000-0000-000000000013', email:'marcos@teste.com',password:'teste123' },
];
(async () => {
  for (const u of users) {
    const { error } = await supabase.auth.admin.createUser({ id:u.id, email:u.email, password:u.password, email_confirm:true });
    console.log(u.email, error ? `ERRO: ${error.message}` : 'OK');
  }
})();
