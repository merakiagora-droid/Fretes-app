-- Create the public profile with the auth signup, including when email confirmation
-- is enabled and the client does not yet have an authenticated session.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, tipo, nome, email, cpf_cnpj)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'tipo', 'embarcador'),
    coalesce(nullif(new.raw_user_meta_data->>'nome', ''), split_part(new.email, '@', 1)),
    new.email,
    nullif(new.raw_user_meta_data->>'cpf_cnpj', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
