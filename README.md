

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

Render.com – Node.js Deploy

Contato
Equipe de Desenvolvimento Climafort


---

Se você quiser, posso criar **uma versão “Markdown com exemplos de deploy e URLs de teste”**, que inclui como acessar `/api/auth/signin` e `/api/pdfs/[file]` direto no README, deixando o repositório pronto para qualquer novo desenvolvedor interno.  

Quer que eu faça isso também?
Você disse:
Crie o arquivo markdow para que eu baixe 
O ChatGPT disse:
Climafort Readme
· other
# Climafort V2
- **NextAuth** (autenticação via credenciais)
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