import { withAuth } from "next-auth/middleware";

// Middleware do NextAuth para proteger rotas privadas
export default withAuth({
  pages: {
    signIn: "/login", // Redireciona não autenticados para /login
  },
});

export const config = {
  // Regex que protege tudo, exceto /login, /register e rotas /api
  matcher: ["/((?!login|register|api).*)"],
};
