export const PING_ON = String(import.meta.env.PING_ON || "")
  .trim()
  .toLowerCase() === "true";