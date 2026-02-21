import Link from "next/link";
import { GITHUB_REPO_URL } from "@/lib/site-config";
import { FooterAuthor } from "./FooterAuthor";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 z-10 py-4 text-center text-sm text-gray-500 bg-[#0e1117]/95 border-t border-gray-800"
      role="contentinfo"
    >
      <p>
        Created by <FooterAuthor /> • {year} •{" "}
        <Link
          href={GITHUB_REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-[#ffbd45] transition-colors"
        >
          GitHub
        </Link>{" "}
        •{" "}
        <Link
          href={`${GITHUB_REPO_URL}/issues`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-[#ffbd45] transition-colors"
        >
          Zgłoś błąd
        </Link>
      </p>
    </footer>
  );
}
