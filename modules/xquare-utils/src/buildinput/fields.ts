/**
 * Build type field definitions and validation helpers
 * Shared across application creation and deployment configuration
 */

export type BuildField =
  | "VERSION"
  | "BUILD_COMMAND"
  | "START_COMMAND"
  | "INPUT_PATH"
  | "OUTPUT_PATH"
  | "WORKING_DIRECTORY";

export const REQUIRED_FIELDS: Record<string, BuildField[]> = {
  gradle: ["VERSION", "BUILD_COMMAND", "OUTPUT_PATH"],
  node_js: ["VERSION", "BUILD_COMMAND", "START_COMMAND"],
  react: ["VERSION", "BUILD_COMMAND", "OUTPUT_PATH"],
  vite: ["VERSION", "BUILD_COMMAND", "OUTPUT_PATH"],
  vue: ["VERSION", "BUILD_COMMAND", "OUTPUT_PATH"],
  next_js: ["VERSION", "BUILD_COMMAND", "START_COMMAND"],
  go: ["VERSION", "BUILD_COMMAND", "OUTPUT_PATH"],
  rust: ["VERSION", "BUILD_COMMAND", "OUTPUT_PATH"],
  maven: ["VERSION", "BUILD_COMMAND", "OUTPUT_PATH"],
  django: ["VERSION", "BUILD_COMMAND", "START_COMMAND"],
  flask: ["VERSION", "BUILD_COMMAND", "START_COMMAND"],
  docker: ["INPUT_PATH", "WORKING_DIRECTORY"],
};

export const needsField = (type: string, field: BuildField): boolean => {
  const t = (type ?? "").trim();
  const set = REQUIRED_FIELDS[t];
  return Array.isArray(set) ? set.includes(field) : false;
};

export const needsVersion = (type: string): boolean =>
  needsField(type, "VERSION");

export const needsBuildCommand = (type: string): boolean =>
  needsField(type, "BUILD_COMMAND");

export const needsStartCommand = (type: string): boolean =>
  needsField(type, "START_COMMAND");

export const needsInputPath = (type: string): boolean =>
  needsField(type, "INPUT_PATH");

export const needsOutputPath = (type: string): boolean =>
  needsField(type, "OUTPUT_PATH");

export const needsWorkingDirectory = (type: string): boolean =>
  needsField(type, "WORKING_DIRECTORY");
