import { ExecutorContext, ProjectConfiguration } from '@nrwl/devkit';

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

function getProjects(context: ExecutorContext) {
  // TODO: remove `context.workspace` when on nx v17
  const projects =
    context.projectsConfigurations?.projects ?? context.workspace?.projects;
  if (projects) {
    return projects;
  } else {
    throw new Error('Unable to find projects in workspace...');
  }
}

function getProject(context: ExecutorContext) {
  if (context.projectName) {
    return getProjects(context)[context.projectName];
  } else {
    throw new Error("Unable to find project's configuration...");
  }
}

function getRelativeRootFromProject(project: ProjectConfiguration) {
  return project.root.replace(/\\/g, '/');
}

export function getConfigFileLocationFromContext(
  options: CompileSchema,
  context: ExecutorContext
) {
  const project = getProject(context);
  const projectRelativeRoot = getRelativeRootFromProject(project);
  const defaultconfigFileLocation = `${projectRelativeRoot}/ng-doc-portal-config.json`;

  let configFileLocation: string | undefined = options.configFile;
  if (configFileLocation) {
    configFileLocation = `${configFileLocation}`;
  }
  return configFileLocation ?? defaultconfigFileLocation;
}

export function getDocPageLoadersFileLocationFromContext(
  _options: CompileSchema,
  context: ExecutorContext
) {
  const project = getProject(context);
  const projectRelativeRoot = getRelativeRootFromProject(project);
  return `${projectRelativeRoot}/src/app/doc-page-loaders.ts`;
}
