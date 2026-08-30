import React from "react";
import * as LucideIcons from "lucide-react";

/**
 * Dynamically resolves and renders a Lucide Icon by name.
 * Normalizes snake_case, kebab-case, and lowercase icon names to PascalCase.
 */
export function getLucideIconComponent(name) {
  if (!name || typeof name !== "string") return null;

  const trimmed = name.trim();
  if (!trimmed) return null;

  // Direct match
  if (LucideIcons[trimmed]) {
    return LucideIcons[trimmed];
  }

  // Convert kebab-case or snake_case or spaces to PascalCase (e.g. "badge-check" -> "BadgeCheck")
  const pascalName = trimmed
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");

  if (LucideIcons[pascalName]) {
    return LucideIcons[pascalName];
  }

  // Case-insensitive fallback search across exported icon names
  const lowerTarget = trimmed.toLowerCase().replace(/[^a-z0-9]/g, "");
  const foundKey = Object.keys(LucideIcons).find(
    (key) => key.toLowerCase() === lowerTarget
  );

  if (foundKey && LucideIcons[foundKey]) {
    return LucideIcons[foundKey];
  }

  return null;
}

export function DynamicIcon({ name, fallback = "Award", className = "w-6 h-6", size, ...props }) {
  const Component = getLucideIconComponent(name) || getLucideIconComponent(fallback) || LucideIcons.Award;
  return <Component className={className} size={size} {...props} />;
}

export default DynamicIcon;
