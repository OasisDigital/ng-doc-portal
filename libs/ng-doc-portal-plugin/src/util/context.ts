import { ExecutorContext } from '@nrwl/devkit';

import { SchemaBase } from '../util/schema-base';

export function getAngularConfigTarget(
  options: SchemaBase,
  _context: ExecutorContext
) {
  return options['ng-config-target'];
}

export function getConfigFileLocationFromContext(
  options: SchemaBase,
  context: ExecutorContext
) {
  const projectRelativeRoot = context.workspace.projects[
    context.projectName ?? ''
  ].root.replace(/\\/g, '/');
  const defaultconfigFileLocation = `${projectRelativeRoot}/ng-doc-portal-config.json`;

  let configFileLocation: string | undefined = options.configFile;
  if (configFileLocation) {
    configFileLocation = `${configFileLocation}`;
  }

  return configFileLocation ?? defaultconfigFileLocation;
}

export function getDocPageConfigsFileLocationFromContext(
  _options: SchemaBase,
  context: ExecutorContext
) {
  const projectRelativeRoot = context.workspace.projects[
    context.projectName ?? ''
  ].root.replace(/\\/g, '/');
  return `${projectRelativeRoot}/src/app/doc-page-configs.ts`;
}
