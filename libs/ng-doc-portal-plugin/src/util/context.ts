import { ExecutorContext } from '@nrwl/devkit';

import {
  CompileSchema,
  CompileWithAngularConfigTargetSchema,
} from '../util/schema-base';

export function getAngularConfigTarget(
  options: CompileWithAngularConfigTargetSchema,
  _context: ExecutorContext
) {
  return options['ngConfigTarget'];
}

export function getConfigFileLocationFromContext(
  options: CompileSchema,
  context: ExecutorContext
) {
  const projects = context.projectsConfigurations?.projects;
  if (projects && context.projectName) {
    const projectRelativeRoot = projects[context.projectName].root.replace(
      /\\/g,
      '/'
    );
    const defaultconfigFileLocation = `${projectRelativeRoot}/ng-doc-portal-config.json`;

    let configFileLocation: string | undefined = options.configFile;
    if (configFileLocation) {
      configFileLocation = `${configFileLocation}`;
    }
    return configFileLocation ?? defaultconfigFileLocation;
  } else {
    throw new Error("Unable to find project's configuration...");
  }
}

export function getDocPageLoadersFileLocationFromContext(
  _options: CompileSchema,
  context: ExecutorContext
) {
  const projects = context.projectsConfigurations?.projects;
  if (projects && context.projectName) {
    const projectRelativeRoot = projects[context.projectName].root.replace(
      /\\/g,
      '/'
    );
    return `${projectRelativeRoot}/src/app/doc-page-loaders.ts`;
  } else {
    throw new Error("Unable to find project's configuration...");
  }
}
