import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/auth";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.redirect("/login");

  const { file } = await params; // ✅ precisa do await
  const filePath = path.join(process.cwd(), "private_pdfs", file);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: "Arquivo não encontrado" },
      { status: 404 }
    );
  }

  const fileBuffer = fs.readFileSync(filePath);
  return new Response(fileBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${file}"`,
    },
  });
}
