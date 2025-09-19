# Climafort V2

![Climafort Logo](./logo.png) <!-- opcional, se houver logo -->

## Descrição

**Climafort V2** é uma aplicação interna da empresa para gestão de usuários e documentos em PDF.  
A aplicação permite que colaboradores se cadastrem, façam login seguro via e-mail e senha, e acessem PDFs hospedados no sistema.  

A aplicação é construída com:

- **Next.js 15** (App Router)
- **NextAuth** (autenticação via credenciais)
- **Prisma** (ORM para banco de dados)
- **PostgreSQL/MySQL** (ou outro banco suportado pelo Prisma)
- **bcrypt** para hashing de senhas

---

## Funcionalidades

- Cadastro de usuários
- Login seguro com JWT
- Upload e download de PDFs
- Seed inicial de usuário administrador
- Backend organizado com rotas API (`/api`)

---

## Estrutura do Projeto



ChatGPT
Você disse:
tenho um erro 
> climafort@0.1.0 build
> next build

   ▲ Next.js 15.5.3
   - Environments: .env

   Creating an optimized production build ...
 ✓ Compiled successfully in 5.0s
   Linting and checking validity of types  ..Failed to compile.

.next/types/app/api/auth/[...nextauth]/route.ts:12:13
Type error: Type 'OmitWithTag<typeof import("C:/Users/Italo/Documents/GitHub/climafort/src/app/api/auth/[...nextauth]/route"), "GET" | "POST" | "HEAD" | "OPTIONS" | "PUT" | "DELETE" | "PATCH" | "config" | ... 7 more ... | "maxDuration", "">' does not satisfy the constraint '{ [x: string]: never; }'.
  Property 'authOptions' is incompatible with index signature.
    Type 'AuthOptions' is not assignable to type 'never'.

  10 |
  11 | // Check that the entry is a valid entry
> 12 | checkFields<Diff<{
     |             ^
  13 |   GET?: Function
  14 |   HEAD?: Function
  15 |   OPTIONS?: Function
Next.js build worker exited with code: 1 and signal: null
O ChatGPT disse:
Esse erro que você está tendo no next build vem do Next.js 15 com NextAuth no App Router.
O compilador está reclamando porque no seu route.ts você exportou algo que não é um handler de rota válido — provavelmente exportou também o authOptions.

⚠️ No App Router (src/app/api/.../route.ts), o arquivo só pode exportar handlers HTTP (GET, POST, etc.) ou configurações especiais (dynamic, revalidate, runtime, etc.).
Qualquer export extra (como authOptions) quebra o build de tipagem.

Como corrigir
No seu arquivo atual (src/app/api/auth/[...nextauth]/route.ts), você deve ter algo parecido com:

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
👉 O problema é o export const authOptions.
Isso não pode estar aí nesse arquivo de rota.

Solução correta
Crie um arquivo separado para suas opções de autenticação, por exemplo:

src/lib/auth.ts

import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
};
Use esse arquivo dentro da rota:

src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
✅ Dessa forma:

O arquivo de rota só exporta GET e POST (válidos).

O authOptions fica isolado em lib/auth.ts, onde pode ser importado também em middlewares ou server components.

Quer que eu ajuste o teu código atual (se você colar aqui o route.ts que está usando) para a forma corrigida?

Você disse:
sim,aqui esta 
import NextAuth, { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null;

        // Busca usuário no banco
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        // Compara senha usando bcrypt
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        // Retorna usuário com id e email (NextAuth espera string id)
        return { id: user.id.toString(), name: null, email: user.email };
      },
    }),
  ],

  // Configuração da sessão
  session: {
    strategy: "jwt", // ✅ TypeScript reconhece como SessionStrategy
  },

  secret: process.env.NEXTAUTH_SECRET,
};
const handler = NextAuth(authOptions) as unknown as (
  req: Request
) => Promise<Response>;

export { handler as GET, handler as POST };
O ChatGPT disse:
Perfeito! O problema no seu código é justamente o export const authOptions. No Next.js 15 App Router, o arquivo de rota (route.ts) não pode exportar constantes que não sejam handlers HTTP ou configurações válidas.

A forma correta é mover o authOptions para outro arquivo e deixar o route.ts exportando apenas GET e POST. Aqui está o ajuste completo:

1️⃣ Crie um arquivo separado src/lib/auth.ts:
import NextAuth, { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null;

        // Busca usuário no banco
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        // Compara senha usando bcrypt
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        // Retorna usuário com id e email
        return { id: user.id.toString(), name: null, email: user.email };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
2️⃣ Ajuste o arquivo de rota src/app/api/auth/[...nextauth]/route.ts:
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
✅ Com isso:

O route.ts só exporta GET e POST, que é aceito pelo App Router.

O authOptions fica separado e pode ser importado em qualquer outro lugar (middlewares, etc.).

O erro de tipagem que você viu vai desaparecer no next build.

Se você quiser, posso te mostrar uma versão ainda melhor que evita criar uma nova instância do PrismaClient a cada requisição, evitando warnings de conexão com o banco.

Quer que eu faça isso?

Você disse:
quer q mostre a disposição de pastas 
O ChatGPT disse:
Sim, mostra a disposição de pastas que você está usando, assim consigo te sugerir exatamente onde colocar o auth.ts e como ajustar os imports para o Next.js App Router.

Você disse:
ok
O ChatGPT disse:
Perfeito! Pode colar aqui a estrutura de pastas do seu projeto, principalmente na parte de src/app/api/auth e onde você tem os arquivos de configuração/serviços, para eu te mostrar exatamente como organizar.

Você disse:
estou tendo erro 502 
2025-09-18T18:08:43.486482598Z ==> Cloning from https://github.com/italo12346/climafort-v2
2025-09-18T18:08:44.344939757Z ==> Checking out commit 8f799bee4320d274e63faeeb6144d2244eaeb3ea in branch master
2025-09-18T18:08:45.511379594Z ==> Using Node.js version 22.16.0 (default)
2025-09-18T18:08:45.53538876Z ==> Docs on specifying a Node.js version: https://render.com/docs/node-version
2025-09-18T18:08:47.363450115Z ==> Running build command 'npm install; npm run build;'...
2025-09-18T18:09:32.647143137Z 
2025-09-18T18:09:32.647168407Z added 479 packages, and audited 480 packages in 45s
2025-09-18T18:09:32.647188607Z 
2025-09-18T18:09:32.647204458Z 159 packages are looking for funding
2025-09-18T18:09:32.647219518Z   run npm fund for details
2025-09-18T18:09:32.658915656Z 
2025-09-18T18:09:32.658935436Z 19 high severity vulnerabilities
2025-09-18T18:09:32.658941956Z 
2025-09-18T18:09:32.658948846Z To address issues that do not require attention, run:
2025-09-18T18:09:32.658954516Z   npm audit fix
2025-09-18T18:09:32.658960026Z 
2025-09-18T18:09:32.658965597Z Some issues need review, and may require choosing
2025-09-18T18:09:32.658971706Z a different dependency.
2025-09-18T18:09:32.658976897Z 
2025-09-18T18:09:32.658982457Z Run npm audit for details.
2025-09-18T18:09:32.826574969Z 
2025-09-18T18:09:32.826598449Z > climafort@0.1.0 build
2025-09-18T18:09:32.826605659Z > next build
2025-09-18T18:09:32.826611169Z 
2025-09-18T18:09:33.594034756Z ⚠ No build cache found. Please configure build caching for faster rebuilds. Read more: https://nextjs.org/docs/messages/no-cache
2025-09-18T18:09:33.645130446Z    ▲ Next.js 15.5.3
2025-09-18T18:09:33.645215918Z 
2025-09-18T18:09:33.670773018Z    Creating an optimized production build ...
2025-09-18T18:09:44.120432968Z  ✓ Compiled successfully in 8.0s
2025-09-18T18:09:44.122016734Z    Linting and checking validity of types ...
2025-09-18T18:09:47.144728878Z 
2025-09-18T18:09:47.144754769Z ./src/app/api/auth/[...nextauth]/auth.ts
2025-09-18T18:09:47.144760109Z 1:8  Warning: 'NextAuth' is defined but never used.  @typescript-eslint/no-unused-vars
2025-09-18T18:09:47.144763829Z 
2025-09-18T18:09:47.144767819Z info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
2025-09-18T18:09:47.657605721Z    Collecting page data ...
2025-09-18T18:09:51.271873023Z    Generating static pages (0/8) ...
2025-09-18T18:09:52.288090702Z    Generating static pages (2/8) 
2025-09-18T18:09:52.288113293Z    Generating static pages (4/8) 
2025-09-18T18:09:52.288123542Z    Generating static pages (6/8) 
2025-09-18T18:09:52.288127263Z  ✓ Generating static pages (8/8)
2025-09-18T18:09:52.769413297Z    Finalizing page optimization ...
2025-09-18T18:09:52.769441727Z    Collecting build traces ...
2025-09-18T18:09:58.931605078Z 
2025-09-18T18:09:58.934177069Z Route (app)                                 Size  First Load JS
2025-09-18T18:09:58.934187849Z ┌ ƒ /                                     123 kB         234 kB
2025-09-18T18:09:58.934192609Z ├ ○ /_not-found                            993 B         103 kB
2025-09-18T18:09:58.934197319Z ├ ƒ /api/auth/[...nextauth]                130 B         102 kB
2025-09-18T18:09:58.93421491Z ├ ƒ /api/pdfs/[file]                       130 B         102 kB
2025-09-18T18:09:58.93421818Z ├ ƒ /api/register                          130 B         102 kB
2025-09-18T18:09:58.93421999Z ├ ○ /login                                 954 B         112 kB
2025-09-18T18:09:58.93422166Z └ ○ /register                              981 B         103 kB
2025-09-18T18:09:58.93422397Z + First Load JS shared by all             102 kB
2025-09-18T18:09:58.93422567Z   ├ chunks/255-40634877ae3e8e9d.js       45.7 kB
2025-09-18T18:09:58.93422745Z   ├ chunks/4bd1b696-c023c6e3521b1417.js  54.2 kB
2025-09-18T18:09:58.93422922Z   └ other shared chunks (total)          1.93 kB
2025-09-18T18:09:58.9342308Z 
2025-09-18T18:09:58.93423241Z 
2025-09-18T18:09:58.934284541Z ○  (Static)   prerendered as static content
2025-09-18T18:09:58.934289711Z ƒ  (Dynamic)  server-rendered on demand
2025-09-18T18:09:58.934291771Z 
2025-09-18T18:09:59.683180646Z ==> Uploading build...
2025-09-18T18:10:19.817730369Z ==> Uploaded in 16.2s. Compression took 3.9s
2025-09-18T18:10:19.894418078Z ==> Build successful 🎉
2025-09-18T18:10:29.92408616Z ==> Deploying...
2025-09-18T18:11:14.458540982Z ==> Running 'npm start'
2025-09-18T18:11:16.171101322Z 
2025-09-18T18:11:16.171127273Z > climafort@0.1.0 start
2025-09-18T18:11:16.171130433Z > next start
2025-09-18T18:11:16.171132553Z 
2025-09-18T18:11:18.765054891Z    ▲ Next.js 15.5.3
2025-09-18T18:11:18.765325438Z    - Local:        http://localhost:10000
2025-09-18T18:11:18.765333879Z    - Network:      http://10.204.35.104:10000
2025-09-18T18:11:18.765449922Z 
2025-09-18T18:11:18.765624476Z  ✓ Starting...
2025-09-18T18:11:21.375326668Z ==> Your service is live 🎉
2025-09-18T18:11:21.403207927Z ==> 
2025-09-18T18:11:21.440797117Z ==> ///////////////////////////////////////////////////////////
2025-09-18T18:11:21.470296746Z ==> 
2025-09-18T18:11:21.497257276Z ==> Available at your primary URL https://climafort-v2.onrender.com
2025-09-18T18:11:21.523465716Z ==> 
2025-09-18T18:11:21.551879965Z ==> ///////////////////////////////////////////////////////////
2025-09-18T18:11:24.451722777Z  ✓ Ready in 7.4s
2025-09-18T18:11:26.252225625Z [next-auth][warn][NEXTAUTH_URL] 
2025-09-18T18:11:26.252262356Z https://next-auth.js.org/warnings#nextauth_url
O ChatGPT disse:
Percebi o que está acontecendo. O erro 502 no seu deploy não é exatamente um problema de build — o build está completando com sucesso. O problema está relacionado ao NextAuth e à variável NEXTAUTH_URL.

No log você tem:

[next-auth][warn][NEXTAUTH_URL] 
https://next-auth.js.org/warnings#nextauth_url
Isso significa que o NextAuth não está encontrando a URL base da aplicação para gerar callbacks, redirecionamentos e tokens. No App Router, essa variável é obrigatória em produção.

Como resolver
Defina a variável de ambiente NEXTAUTH_URL no Render:

Vá no dashboard do seu serviço no Render.

Acesse Environment → Environment Variables.

Adicione:

NEXTAUTH_URL=https://climafort-v2.onrender.com
Salve e redeploy.

Verifique NEXTAUTH_SECRET:

Já que você usa JWT, a variável também precisa estar definida:

NEXTAUTH_SECRET=uma_chave_segura_aleatoria
Você pode gerar uma chave segura com Node.js:

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
Opcional — ajuste no código:

Em src/lib/auth.ts (ou onde você exporta authOptions):

import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  // ...
  secret: process.env.NEXTAUTH_SECRET,
  // adiciona callbacks se necessário
};
Depois de definir essas variáveis no Render, redeploy o projeto. O 502 geralmente some porque agora o NextAuth consegue processar requisições de autenticação corretamente.

Se você quiser, posso te passar uma checklist completa de variáveis e ajustes do NextAuth no App Router para garantir que não vai ter 502 nem warnings em produção.

Quer que eu faça isso?

Você disse:
sim
O ChatGPT disse:
Perfeito! Aqui está uma checklist completa para configurar NextAuth com App Router em produção (Render, Vercel, etc.), evitando erros 502 e warnings:

1️⃣ Variáveis de ambiente obrigatórias
No painel do Render, Defina todas essas variáveis:

Variável	Descrição
NEXTAUTH_URL	URL pública da sua aplicação. Ex.: https://climafort-v2.onrender.com
NEXTAUTH_SECRET	Segredo usado pelo NextAuth para JWT/Criptografia. Gere um com node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
DATABASE_URL	URL de conexão com seu banco Prisma (Postgres/MySQL/etc.)
GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET	Caso use OAuth com Google (ou equivalentes para outros provedores)
⚠️ Sem NEXTAUTH_URL e NEXTAUTH_SECRET, o NextAuth não consegue processar sessões, gerando 502.

2️⃣ Estrutura correta para App Router
Arquivo de rota: src/app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
Arquivo de configuração: src/lib/auth.ts

import { PrismaClient } from "@prisma/client";
import NextAuth, { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: { email: { type: "text" }, password: { type: "password" } },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return { id: user.id.toString(), email: user.email, name: null };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
3️⃣ Prisma & Banco de Dados
Certifique-se de que DATABASE_URL está correto.

Se estiver usando Render, o banco precisa aceitar conexões externas.

Adicione prisma generate no postinstall do package.json se necessário.

"scripts": {
  "postinstall": "prisma generate"
}
4️⃣ Build & Start
No Render, configure:

Build Command: npm install && npm run build

Start Command: npm start ou next start

O Next.js 15 App Router requer que apenas GET/POST sejam exportados no route.ts, qualquer export extra quebra a tipagem.

5️⃣ Testes pós-deploy
Acesse https://climafort-v2.onrender.com/api/auth/signin

Verifique se consegue logar sem 502.

Confirme que sessões JWT funcionam (/api/auth/session).

Se você quiser, posso te enviar um modelo pronto de route.ts + auth.ts já configurado para Render, incluindo triggers de JWT e credenciais, que você só copia e cola.

Quer que eu faça isso?

Você disse:
npx tsx prisma/seed.ts
PrismaClientKnownRequestError: 
Invalid prisma.user.upsert() invocation in
C:\Users\Italo\Documents\GitHub\climafort\prisma\seed.ts:8:21

  5
  6 async function main() {
  7   const password = await bcrypt.hash("admin123", 10);
→ 8   await prisma.user.upsert(
The table main.User does not exist in the current database.
    at ei.handleRequestError (C:\Users\Italo\Documents\GitHub\climafort\node_modules\@prisma\client\src\runtime\RequestHandler.ts:228:13)
    at ei.handleAndLogRequestError (C:\Users\Italo\Documents\GitHub\climafort\node_modules\@prisma\client\src\runtime\RequestHandler.ts:174:12)
    at ei.request (C:\Users\Italo\Documents\GitHub\climafort\node_modules\@prisma\client\src\runtime\RequestHandler.ts:143:12)
    at a (C:\Users\Italo\Documents\GitHub\climafort\node_modules\@prisma\client\src\runtime\getPrismaClient.ts:833:24)    
    at main (C:\Users\Italo\Documents\GitHub\climafort\prisma\seed.ts:8:3) {
  code: 'P2021',
  meta: { modelName: 'User', table: 'main.User' },
  clientVersion: '6.16.2'
}
PS C:\Users\Italo\Documents\GitHub\climafort> 
O ChatGPT disse:
Esse erro do Prisma:

The table `main.User` does not exist in the current database.
code: 'P2021'
significa que você está tentando usar a tabela User, mas ela ainda não foi criada no banco. Isso acontece quando você atualiza seu schema, mas ainda não rodou a migração.

Passos para corrigir
Verifique o schema.prisma

Certifique-se que você tem algo como:

model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  password String
  name     String?
}
Crie ou atualize a migração

Se você ainda não criou migrações:

npx prisma migrate dev --name init
Isso cria as tabelas no banco local e atualiza o client.

Se já tiver migrações antigas, use prisma migrate deploy para aplicar no banco de produção.

Gere o Prisma Client atualizado

Sempre após mudar o schema:

npx prisma generate
Rodar o seed

Depois que as tabelas existirem:

npx tsx prisma/seed.ts
💡 Dica: Se estiver usando Render ou outro host, o banco remoto precisa estar atualizado também. No Render, você pode rodar:

npx prisma migrate deploy
para aplicar todas as migrações.

Se você quiser, posso te escrever o passo a passo completo para criar a tabela User, migrar, e rodar o seed sem erros.

Quer que eu faça isso?

Você disse:
Você entendeu o que essa aplicação faz ?
O ChatGPT disse:
Ainda não tenho todos os detalhes do que a sua aplicação faz, mas pelo que vi até agora pelos trechos de código e erros:

É um projeto Next.js 15 (App Router).

Usa NextAuth com Credenciais (login por e-mail e senha).

Usa Prisma como ORM, com um modelo User no banco.

No seed.ts você está tentando criar (ou garantir) um usuário administrador inicial (admin123).

Já vi também que você tem rotas api/pdfs/[file] e api/register, então além de autenticação, parece que há cadastro de usuário e upload/gerenciamento de PDFs.

Ou seja, pelo que juntei: é um sistema onde o usuário se cadastra/loga e tem acesso a PDFs/documentos hospedados, com backend em Next.js + Prisma.

👉 Mas eu não sei ainda se esse sistema é para uso interno (ex.: empresa) ou se é uma aplicação pública (ex.: clientes acessam documentos).

Quer me explicar em poucas palavras qual é o objetivo principal da aplicação (por exemplo: “gestão de relatórios em PDF para clientes”)? Assim eu consigo te ajudar melhor, inclusive ajustando banco, autenticação e fluxo de usuários.

Você disse:
De uso interno da empresa

Quero que você crie um readme para esse repositorio 
O ChatGPT disse:
Perfeito! Com base no que conversamos, aqui está um README.md completo e organizado para o seu repositório climafort-v2, focado em uma aplicação interna de gestão de usuários e PDFs, usando Next.js, Prisma e NextAuth.

Você pode ajustar detalhes específicos, como variáveis de ambiente ou links, se necessário.

# Climafort V2

![Climafort Logo](./logo.png) <!-- opcional, se houver logo -->

## Descrição

**Climafort V2** é uma aplicação interna da empresa para gestão de usuários e documentos em PDF.  
A aplicação permite que colaboradores se cadastrem, façam login seguro via e-mail e senha, e acessem PDFs hospedados no sistema.  

A aplicação é construída com:

- **Next.js 15** (App Router)
- **NextAuth** (autenticação via credenciais)
- **Prisma** (ORM para banco de dados)
- **PostgreSQL/MySQL** (ou outro banco suportado pelo Prisma)
- **bcrypt** para hashing de senhas

---

## Funcionalidades

- Cadastro de usuários
- Login seguro com JWT
- Upload e download de PDFs
- Seed inicial de usuário administrador
- Backend organizado com rotas API (`/api`)

---

## Estrutura do Projeto

climafort-v2/
│
├─ prisma/
│ ├─ schema.prisma # Schema do banco de dados
│ └─ seed.ts # Script para criar usuário inicial
│
├─ src/
│ ├─ app/
│ │ ├─ api/
│ │ │ ├─ auth/[...nextauth]/route.ts # Rotas de autenticação
│ │ │ ├─ pdfs/[file]/route.ts # Rotas de PDFs
│ │ │ └─ register/route.ts # Cadastro de usuários
│ │ └─ pages/... # Pages da aplicação
│ │
│ └─ lib/
│ └─ auth.ts # Configuração do NextAuth
│
├─ package.json
└─ README.md


---

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/italo12346/climafort-v2.git
cd climafort-v2
Instale dependências:

npm install
Configure variáveis de ambiente:

Crie um arquivo .env na raiz com:

NEXTAUTH_URL=https://seu-dominio.com
NEXTAUTH_SECRET=sua_chave_secreta
DATABASE_URL=postgresql://user:password@host:port/dbname
GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx
⚠️ NEXTAUTH_URL e NEXTAUTH_SECRET são obrigatórios para autenticação em produção.

Gere o client do Prisma:

npx prisma generate
Execute as migrações para criar o banco de dados:

npx prisma migrate dev --name init
Rode o seed inicial (cria usuário administrador):

npx tsx prisma/seed.ts
Scripts úteis
Script	Descrição
npm run dev	Roda a aplicação em modo desenvolvimento
npm run build	Cria build de produção
npm start	Inicia a aplicação em produção
npx prisma generate	Gera o client Prisma
npx prisma migrate dev	Aplica migrações no banco
npx tsx prisma/seed.ts	Executa script de seed inicial
Contribuição
⚠️ Este é um projeto interno. Para contribuir, consulte o time de desenvolvimento antes de enviar alterações.

Crie uma branch a partir da main

Faça suas alterações

Teste localmente (npm run dev)

Abra um pull request para revisão

Referências
Next.js 15 App Router

NextAuth.js

Prisma ORM

Render.com – Node.js Deploy

Contato
Equipe de Desenvolvimento Climafort


---

Se você quiser, eu posso criar **uma versão ainda mais prática**, com **instruções de deploy direto no Render** e exemplos de URLs de teste para `/api/auth/signin` e `/api/pdfs/[file]`.  

Quer que eu faça isso?
Você disse:
Quero o código todo para que eu possa colar no readm

Cancelar

Enviar
O ChatGPT disse:
Perfeito! Aqui está o README completo e pronto para colar no seu repositório, já com todos os trechos de código, comandos e estrutura do projeto, pronto para uso:

# Climafort V2

![Climafort Logo](./logo.png) <!-- opcional, se houver logo -->

## Descrição

**Climafort V2** é uma aplicação interna da empresa para gestão de usuários e documentos em PDF.  
A aplicação permite que colaboradores se cadastrem, façam login seguro via e-mail e senha, e acessem PDFs hospedados no sistema.  

A aplicação é construída com:

- **Next.js 15** (App Router)
- **NextAuth** (autenticação via credenciais)
- **Prisma** (ORM para banco de dados)
- **PostgreSQL/MySQL** (ou outro banco suportado pelo Prisma)
- **bcrypt** para hashing de senhas

---

## Funcionalidades

- Cadastro de usuários
- Login seguro com JWT
- Upload e download de PDFs
- Seed inicial de usuário administrador
- Backend organizado com rotas API (`/api`)

---

## Estrutura do Projeto

climafort-v2/
│
├─ prisma/
│ ├─ schema.prisma # Schema do banco de dados
│ └─ seed.ts # Script para criar usuário inicial
│
├─ src/
│ ├─ app/
│ │ ├─ api/
│ │ │ ├─ auth/[...nextauth]/route.ts # Rotas de autenticação
│ │ │ ├─ pdfs/[file]/route.ts # Rotas de PDFs
│ │ │ └─ register/route.ts # Cadastro de usuários
│ │ └─ pages/... # Pages da aplicação
│ │
│ └─ lib/
│ └─ auth.ts # Configuração do NextAuth
│
├─ package.json
└─ README.md


---

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/italo12346/climafort-v2.git
cd climafort-v2
Instale dependências:

npm install
Configure variáveis de ambiente:

Crie um arquivo .env na raiz com:

NEXTAUTH_URL=https://seu-dominio.com
NEXTAUTH_SECRET=sua_chave_secreta
DATABASE_URL=postgresql://user:password@host:port/dbname
GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx
⚠️ NEXTAUTH_URL e NEXTAUTH_SECRET são obrigatórios para autenticação em produção.

Gere o client do Prisma:

npx prisma generate
Execute as migrações para criar o banco de dados:

npx prisma migrate dev --name init
Rode o seed inicial (cria usuário administrador):

npx tsx prisma/seed.ts
Exemplo de Código
1. Configuração do NextAuth (src/lib/auth.ts)
import { PrismaClient } from "@prisma/client";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: { email: { type: "text" }, password: { type: "password" } },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return { id: user.id.toString(), email: user.email, name: null };
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
2. Rota de autenticação (src/app/api/auth/[...nextauth]/route.ts)
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
3. Seed inicial (prisma/seed.ts)
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@climafort.com" },
    update: {},
    create: {
      email: "admin@climafort.com",
      password,
      name: "Administrador",
    },
  });
  console.log("Seed concluído!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
Scripts úteis
Script	Descrição
npm run dev	Roda a aplicação em modo desenvolvimento
npm run build	Cria build de produção
npm start	Inicia a aplicação em produção
npx prisma generate	Gera o client Prisma
npx prisma migrate dev	Aplica migrações no banco
npx tsx prisma/seed.ts	Executa script de seed inicial
Contribuição
⚠️ Este é um projeto interno. Para contribuir, consulte o time de desenvolvimento antes de enviar alterações.

Crie uma branch a partir da main

Faça suas alterações

Teste localmente (npm run dev)

Abra um pull request para revisão

Referências
Next.js 15 App Router

NextAuth.js

Prisma ORM

Climafort Readme
· other
climafort-v2/
│  │

1. Clone o repositório:

```bash
git clone https://github.com/italo12346/climafort-v2.git
cd climafort-v2
```

2. Instale dependências:

```bash
npm install
```

3. Configure variáveis de ambiente:

Crie um arquivo `.env` na raiz com:

```env
NEXTAUTH_URL=https://seu-dominio.com
NEXTAUTH_SECRET=sua_chave_secreta
DATABASE_URL=postgresql://user:password@host:port/dbname
GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx
```

> ⚠️ `NEXTAUTH_URL` e `NEXTAUTH_SECRET` são obrigatórios para autenticação em produção.

4. Gere o client do Prisma:

```bash
npx prisma generate
```

5. Execute as migrações para criar o banco de dados:

```bash
npx prisma migrate dev --name init
```

6. Rode o seed inicial (cria usuário administrador):

```bash
npx tsx prisma/seed.ts
```