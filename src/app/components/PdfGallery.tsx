"use client";

import { useState, useEffect } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import Header from "./Header";

interface Pdf {
  title: string;
  file: string;
  cover: string;
}

interface PdfGalleryProps {
  pdfs: Pdf[];
}

export default function PdfGallery({ pdfs }: PdfGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState<number>(1); // 1 = 100%

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.25));

  // Teclas de atalho
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "+") zoomIn();
      if (e.key === "-") zoomOut();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Header />

      {/* GRID DE CARDS */}
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pdfs.map((pdf, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-lg overflow-hidden text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
            onClick={() => setSelectedIndex(i)}
          >
            <img
              src={pdf.cover}
              alt={pdf.title}
              className="w-full h-80 object-cover"
            />
            <h2 className="py-4 text-lg font-semibold text-gray-700">
              {pdf.title}
            </h2>
          </div>
        ))}
      </div>

      {/* MODAL FULLSCREEN */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black">
          {/* BARRA DE CONTROLES */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-4">
            <span className="text-white font-semibold">
              {selectedIndex + 1} / {pdfs.length}
            </span>
            <button
              className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200"
              onClick={zoomOut}
            >
              −
            </button>
            <span className="text-white">{Math.round(zoom * 100)}%</span>
            <button
              className="bg-white text-black px-3 py-1 rounded hover:bg-gray-200"
              onClick={zoomIn}
            >
              +
            </button>
          </div>

          {/* BOTÃO FECHAR */}
          <button
            className="absolute top-4 right-4 z-50 bg-white text-black px-4 py-2 rounded-lg shadow-lg hover:bg-gray-200"
            onClick={() => setSelectedIndex(null)}
          >
            Fechar ✕
          </button>

          {/* PDF VIEWER – atualiza sempre que `zoom` mudar */}
          <div className="flex-1 overflow-auto">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                key={zoom} // força re-render sempre que zoom mudar
                fileUrl={`/api/pdfs/${pdfs[selectedIndex].file}`}
                defaultScale={zoom}
              />
            </Worker>
          </div>
        </div>
      )}
    </div>
  );
}
