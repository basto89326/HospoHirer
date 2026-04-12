/** Read avatar URL from a `workers` row (camelCase or snake_case column). */
export function workerRowAvatarUrl(row: Record<string, unknown>): string {
  const u = row.avatarUrl ?? row.avatar_url;
  return typeof u === "string" && u.trim() ? u.trim() : "";
}

/** Fired when the signed-in worker’s avatar URL changes (upload, save, or initial load). */
export const WORKER_NAV_AVATAR_EVENT = "hospohirer:worker-nav-avatar";

export type WorkerNavAvatarDetail = { url: string };

export function dispatchWorkerNavAvatar(url: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<WorkerNavAvatarDetail>(WORKER_NAV_AVATAR_EVENT, {
      detail: { url: typeof url === "string" ? url.trim() : "" },
    })
  );
}
