import { profile } from "@/content/profile";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
      <p>
        {profile.email && (
          <a href={`mailto:${profile.email}`} className="hover:underline">
            {profile.email}
          </a>
        )}
      </p>
    </footer>
  );
}
