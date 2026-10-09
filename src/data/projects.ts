// Compatibility view-model for the current Atlas implementation.
// Canonical content lives in src/content; Atlas migrates in its dedicated phase.
import { projectSummaries } from "@/content/selectors";
import type { ProjectSummary } from "@/content/types";

export type Project = ProjectSummary;
export const projects = projectSummaries;
