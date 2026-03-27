export const ALLOWED_EXTRA_EMAIL = "jaison7373@gmail.com";

export const isBitsathyEmail = (email) =>
  typeof email === "string" && email.toLowerCase().endsWith("@bitsathy.ac.in");

export const isAllowedEmail = (email) => {
  if (typeof email !== "string") return false;
  const normalizedEmail = email.toLowerCase();
  return (
    normalizedEmail.endsWith("@bitsathy.ac.in") ||
    normalizedEmail === ALLOWED_EXTRA_EMAIL
  );
};