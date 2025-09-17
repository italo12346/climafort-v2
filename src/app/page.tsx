import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./api/auth/[...nextauth]/route";
import Header from "./components/Header";

const pdfs = [
  { title: "BLOCOS 1", file: "BLOCOS_1.pdf", cover: "/Designer.png" },
  { title: "BLOCOS 2", file: "BLOCOS_2.pdf", cover: "/Designer.png" },
  { title: "BLOCOS 4", file: "BLOCOS_4.pdf", cover: "/Designer.png" },
  { title: "BLOCOS 5", file: "BLOCOS_5.pdf", cover: "/Designer.png" },
];

export default async function HomePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Header />
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pdfs.map((pdf, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-lg overflow-hidden text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <a
              href={`/api/pdfs/${pdf.file}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={pdf.cover}
                alt={`Capa ${pdf.title}`}
                className="w-full h-80 object-cover cursor-pointer"
              />
            </a>
            <h2 className="py-4 text-lg font-semibold text-gray-700">
              {pdf.title}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
