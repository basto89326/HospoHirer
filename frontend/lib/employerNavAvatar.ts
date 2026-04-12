/** Read avatar URL from an `employers` row (snake_case column). */
export function employerRowAvatarUrl(row: Record<string, unknown>): string {
  const u = row.avatar_url;
  return typeof u === "string" && u.trim() ? u.trim() : "";
}

/** Read name from an `employers` row. */
export function employerRowName(row: Record<string, unknown>): string {
  const n = row.name;
  return typeof n === "string" && n.trim() ? n.trim() : "";
}

/** Fired when the signed-in employer's profile changes (save or initial load). */
export const EMPLOYER_NAV_AVATAR_EVENT = "hospohirer:employer-nav-avatar";

export type EmployerNavAvatarDetail = { url: string; name: string };

export function dispatchEmployerNavAvatar(url: string, name: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<EmployerNavAvatarDetail>(EMPLOYER_NAV_AVATAR_EVENT, {
      detail: {
        url:  typeof url  === "string" ? url.trim()  : "",
        name: typeof name === "string" ? name.trim() : "",
      },
    })
  );
}
