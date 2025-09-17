// /src/app/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import PdfGallery from "./components/PdfGallery";

export default async function HomePage() {
  // Verifica sessão do usuário
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Lista de PDFs
  const pdfs = [
    { title: "BLOCOS 1", file: "BLOCOS_1.pdf", cover: "/Designer.png" },
    { title: "BLOCOS 2", file: "BLOCOS_2.pdf", cover: "/Designer.png" },
    { title: "BLOCOS 4", file: "BLOCOS_4.pdf", cover: "/Designer.png" },
    { title: "BLOCOS 5", file: "BLOCOS_5.pdf", cover: "/Designer.png" },
  ];

  // Passa para o componente Client
  return <PdfGallery pdfs={pdfs} />;
}
