import Link from "next/link";
import { usePathname } from "next/navigation";
import { fetcher } from "@/lib/api/fetcher";
import {
  buildLeagueConfigs,
  getFallbackLeagueMetadata,
} from "@/lib/leagues/leagueConfig";
import useSWR from "swr";

const Header: React.FC = () => {
  const { data: leaguesMetadata } = useSWR("/api/leagues", fetcher);
  const leagueLinks = buildLeagueConfigs(
    leaguesMetadata ?? getFallbackLeagueMetadata(),
  )
    .filter((league) => league.showInHeader)
    .map((league) => ({ label: league.label, href: league.path }));
  const links = [{ label: "Dashboard", href: "/" }, ...leagueLinks];

  const pathname = usePathname();

  return (
    <div className="p-1 font-mono border bg-sky-200 dark:bg-neutral-800 border border-gray-300 dark:border-gray-500">
      <div className="p-1 text-4xl font-extrabold text-gray-900 dark:text-white bg-color-white">
        Tallyo
      </div>
      <div className="p-1 text-gray-900 dark:text-white">
        A simple scoreboard
      </div>
      <nav className="space-x-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`p-1 rounded-md font-medium transition-colors duration-200 hover:text-white
              ${
                pathname === link.href
                  ? "border border-gray-300 dark:border-gray-500"
                  : ""
              }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Header;
