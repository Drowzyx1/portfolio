import { profile } from "@/content/profile";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        {profile.email && (
          <a href={`mailto:${profile.email}`} className="hover:underline">
            {profile.email}
          </a>
        )}
        {profile.links.github && (
          <>
            <span aria-hidden>·</span>
            <a
              href={profile.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              GitHub
            </a>
          </>
        )}
        {profile.links.linkedin && (
          <>
            <span aria-hidden>·</span>
            <a
              href={profile.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              LinkedIn
            </a>
          </>
        )}
        {profile.links.resume && (
          <>
            <span aria-hidden>·</span>
            <a
              href={profile.links.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Resume
            </a>
          </>
        )}
      </div>
    </footer>
  );
}
