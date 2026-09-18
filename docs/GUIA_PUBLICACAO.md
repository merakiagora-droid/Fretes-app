# Guia de publicação do Fretes App

Este guia descreve a configuração necessária para colocar o Fretes App em funcionamento. O projeto já contém o código web, o aplicativo Expo/Android, as migrations do Supabase, as Edge Functions e os workflows do GitHub Actions. Ainda é necessário conectar esses componentes a uma conta GitHub, a um projeto Supabase e, opcionalmente, a um projeto Vercel para o site web.

> **Importante:** nunca envie neste chat, nem coloque no código, a chave `service_role`, a senha do banco ou um token de acesso do Supabase. Esses valores devem ser cadastrados somente como secrets no GitHub.

## 1. Criar o repositório no GitHub

Acesse [github.com/new](https://github.com/new), crie um repositório chamado `fretes-app` e selecione **Public** se quiser usar os runners gratuitos do GitHub Actions. Não marque a opção de criar README, `.gitignore` ou licença, porque esses arquivos já existem no projeto.

Na máquina que contém a pasta do projeto, execute:

```bash
cd /caminho/para/fretes-app
git remote add origin https://github.com/SEU_USUARIO/fretes-app.git
git branch -M main
git push -u origin main
```

Se o repositório já tiver um remote chamado `origin`, use:

```bash
git remote set-url origin https://github.com/SEU_USUARIO/fretes-app.git
git push -u origin main
```

Depois do push, confirme em **GitHub → Actions** que os workflows aparecem. O workflow Android agora se chama **Build Android APK Release** e gera um APK release com o bundle JavaScript embutido.

## 2. Criar o projeto Supabase

Acesse [database.new](https://database.new), crie um projeto e anote os dados abaixo. O campo **Project URL** e a chave pública podem ser vistos em **Project Settings → API**. O **Project reference ID** aparece na URL do projeto ou em **Project Settings → General**.

| Dado | Onde encontrar | Uso |
|---|---|---|
| Project URL | Project Settings → API | Aplicativo web e Android |
| Publishable key ou anon key | Project Settings → API | Aplicativo web e Android |
| Project reference ID | Project Settings → General | Workflow de migrations |
| Database password | Definida ao criar o projeto | Workflow `supabase db push` |
| Access token do Supabase | Account → Access Tokens | Workflow de migrations e Functions |

O token de acesso pode ser criado em [Supabase Account Tokens](https://supabase.com/dashboard/account/tokens). Crie um token com permissão suficiente para vincular o projeto e aplicar migrations. Não o envie por mensagem.

## 3. Configurar autenticação no Supabase

Em **Authentication → Providers**, habilite **Email**. Para o fluxo por telefone usado pelo aplicativo, habilite também **Phone** e configure um provedor SMS compatível, como Twilio. Sem um provedor SMS, o cadastro por telefone não conseguirá enviar o código, mesmo que o restante do banco esteja correto.

Durante os primeiros testes, é possível desabilitar a confirmação obrigatória de e-mail em **Authentication → Providers → Email**, caso o fluxo de teste não tenha um servidor de e-mail configurado. Em produção, mantenha a confirmação habilitada e configure o SMTP do projeto.

## 4. Cadastrar os secrets do GitHub

No repositório, abra **Settings → Secrets and variables → Actions → New repository secret**. Crie exatamente os secrets abaixo.

### Obrigatórios para banco e autenticação

| Nome exato | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable/anon key |
| `EXPO_PUBLIC_SUPABASE_URL` | A mesma Project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | A mesma publishable/anon key |
| `SUPABASE_PROJECT_REF` | Project reference ID |
| `SUPABASE_ACCESS_TOKEN` | Token criado em Account → Access Tokens |
| `SUPABASE_DB_PASSWORD` | Senha do banco do projeto |

Os quatro primeiros secrets permitem o build e o funcionamento do web/mobile. Os três últimos permitem que o workflow aplique as migrations e publique as Edge Functions.

### Opcionais para recursos externos

| Nome exato | Quando é necessário |
|---|---|
| `RESEND_API_KEY` | Envio de e-mails por Resend, se essa integração for ativada |
| `MAPBOX_TOKEN` | Mapas e geocodificação Mapbox |
| `FCM_SERVER_KEY` | Push pelo Firebase Cloud Messaging |
| `VERCEL_TOKEN` | Deploy automático do site web |
| `VERCEL_ORG_ID` | Deploy automático do site web |
| `VERCEL_PROJECT_ID` | Deploy automático do site web |

As Edge Functions deste repositório usam automaticamente `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` fornecidos pelo próprio ambiente Supabase quando são executadas. A `service_role` não deve ser cadastrada no aplicativo Android, no navegador ou em `NEXT_PUBLIC_*`/`EXPO_PUBLIC_*`.

## 5. Aplicar o banco e publicar as Edge Functions

Depois que os secrets obrigatórios estiverem cadastrados, faça um pequeno commit ou execute o workflow manualmente, se a interface oferecer essa opção. O workflow **Deploy Supabase** é acionado quando há alterações em `supabase/**` na branch `main`.

Para executar manualmente, abra **Actions → Deploy Supabase → Run workflow**. O workflow deve concluir estas etapas:

1. Vincular o repositório ao `SUPABASE_PROJECT_REF`.
2. Aplicar `001_schema.sql` até `005_trigger_matching.sql`.
3. Publicar `validar-doc`.
4. Publicar `send-push`.
5. Publicar `matching-frete`.

Se o workflow falhar, abra a execução, copie somente a mensagem de erro e envie-a aqui. Não envie o conteúdo dos secrets.

## 6. Executar CI e verificar o web

Abra **Actions → CI → Run workflow**, se disponível, ou faça um commit na branch `main`. O CI verifica instalação, lint, testes unitários, E2E e build web.

O workflow E2E e o build web usam:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Sem esses dois secrets, o build pode até iniciar, mas a autenticação e as chamadas de banco não funcionarão.

## 7. Publicar o site web com Vercel

Se quiser o site web público, acesse [vercel.com/new](https://vercel.com/new), importe o repositório e configure o projeto para usar `apps/web` como diretório do app. O monorepo já possui o workflow **Deploy Web (Vercel)**, mas ele depende dos três secrets de Vercel.

No Vercel, obtenha:

- `VERCEL_ORG_ID`;
- `VERCEL_PROJECT_ID`;
- `VERCEL_TOKEN`.

Cadastre esses três valores no GitHub. Em **Vercel → Project Settings → Environment Variables**, cadastre também `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` para o ambiente Production.

O deploy será acionado por alterações em `apps/web/**`, `packages/**` ou no próprio workflow de deploy.

## 8. Gerar o APK Android correto

Depois que os secrets `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` estiverem configurados, abra **Actions → Build Android APK Release → Run workflow**.

O workflow usa Java 17 e executa `assembleRelease`. Antes de publicar o artefato, ele verifica se o APK contém:

```text
assets/index.android.bundle
```

Ao terminar, abra a execução, desça até **Artifacts** e baixe `fretes-app-release-apk`. Esse é o arquivo correto para instalar no celular. Não use o antigo `app-debug.apk`, pois ele depende do Metro e exibe a tela vermelha de erro quando o Metro não está rodando.

## 9. Teste final no aparelho

Desinstale a versão antiga do Fretes App para evitar conflito de assinatura. Instale o novo APK release e teste nesta ordem:

1. Abrir o aplicativo sem executar Metro.
2. Criar uma conta por e-mail.
3. Confirmar o login.
4. Testar o cadastro por telefone, se o provedor SMS estiver configurado.
5. Completar o perfil de embarcador ou motorista.
6. Publicar ou buscar um frete.
7. Enviar uma proposta.
8. Abrir o chat.
9. Testar logout e login novamente.

## 10. O que entregar aqui para finalizar

Depois de concluir os passos, envie nesta conversa somente os itens não secretos abaixo:

```text
URL do repositório GitHub:
Nome da branch principal: main ou master
URL do projeto Supabase, sem tokens:
Project reference ID:
URL pública do Vercel, se tiver publicado:
Link da execução do workflow Deploy Supabase:
Link da execução do workflow CI:
Link da execução do workflow Build Android APK Release:
Mensagem de erro, se algum workflow falhar:
```

Não envie `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, `VERCEL_TOKEN`, chaves privadas, `service_role` ou qualquer outro segredo. Com os links e identificadores acima, será possível verificar o estado da publicação, corrigir falhas e entregar o APK final configurado para o backend real.

## Referências

[1]: https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions "GitHub Actions — Using secrets"
[2]: https://supabase.com/docs/guides/platform/ project-settings "Supabase — Project settings and API credentials"
[3]: https://supabase.com/docs/guides/cli "Supabase CLI documentation"
[4]: https://vercel.com/docs/deployments/git "Vercel — Deploying Git repositories"
[5]: https://docs.expo.dev/build-reference/apk/ "Expo — Building APK files for Android"
