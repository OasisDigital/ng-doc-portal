import { ExecutorContext } from '@nrwl/devkit';

export function getConfigFileLocationFromContext(context: ExecutorContext) {
  const projectRelativeRoot = context.workspace.projects[
    context.projectName ?? ''
  ].root.replace(/\\/g, '/');
  const defaultconfigFileLocation = `${projectRelativeRoot}/ng-doc-portal-config.json`;

  let configFileLocation: string | undefined =
    context.target?.options?.configFile;
  if (configFileLocation) {
    configFileLocation = `${configFileLocation}`;
  }

  return configFileLocation ?? defaultconfigFileLocation;
}

export function getDocPageConfigsFileLocationFromContext(
  context: ExecutorContext
) {
  const projectRelativeRoot = context.workspace.projects[
    context.projectName ?? ''
  ].root.replace(/\\/g, '/');
  return `${projectRelativeRoot}/src/app/doc-page-configs.ts`;
}
