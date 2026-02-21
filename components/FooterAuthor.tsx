"use client";

import { useState } from "react";

const AUTHOR_NAME = "Łukasz Mandziej";
const ABOUT_TEXT = `Cześć! Nazywam się ${AUTHOR_NAME} i jestem twórcą History Master Online. Od zawsze fascynowała mnie historia, ale zdaję sobie sprawę, że jej tradycyjna nauka potrafi być dla wielu monotonna. Stworzyłem tę aplikację, aby połączyć moją pasję do dziejów z nowoczesnymi technologiami. Moim celem jest udowodnienie, że historia to nie tylko zbiór suchych dat, ale fascynująca gra i przygoda, do której każdy ma dostęp.`;

export function FooterAuthor() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-semibold text-gray-400 hover:text-[#ffbd45] transition-colors cursor-pointer"
      >
        {AUTHOR_NAME}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="O twórcy"
        >
          <div
            className="relative max-w-md w-full rounded-xl border border-gray-700 bg-[#161b22] p-6 shadow-xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-line">
              {ABOUT_TEXT}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-lg py-2 text-sm font-medium bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors"
            >
              Zamknij
            </button>
          </div>
        </div>
      )}
    </>
  );
}
