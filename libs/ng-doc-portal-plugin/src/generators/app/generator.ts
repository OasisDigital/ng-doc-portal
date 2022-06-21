import { applicationGenerator } from '@nrwl/angular/generators';
import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
  readProjectConfiguration,
  updateProjectConfiguration,
} from '@nrwl/devkit';

import { NgDocPortalPluginGeneratorSchema } from './schema';

import * as path from 'path';

interface NormalizedSchema extends NgDocPortalPluginGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  tree: Tree,
  options: NgDocPortalPluginGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    tmpl: '',
  };

  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    `${options.projectRoot}/src`,
    templateOptions
  );
}

async function updateProjectStyles(tree: Tree, options: NormalizedSchema) {
  const projectConfig = readProjectConfiguration(tree, options.projectName);

  if (projectConfig.targets) {
    const styles = projectConfig.targets.build.options.styles;
    const updatedStyles = [
      // TODO: replace with `node_modules` target folder when we have a proper npm scope/package
      'libs/component-document-portal/styles/component-document-portal.scss',
      ...styles,
    ];
    projectConfig.targets.build.options.styles = updatedStyles;

    updateProjectConfiguration(tree, options.projectName, projectConfig);
  }
}

// async function updateProjectExecutors(tree: Tree, options: NormalizedSchema) {}

export default async function (
  tree: Tree,
  options: NgDocPortalPluginGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);
  await applicationGenerator(tree, {
    name: options.name ?? 'component-document-portal',
    tags: normalizedOptions.parsedTags.join(','),
    directory: options.directory,
    e2eTestRunner: 'none' as any,
    skipTests: true,
    prefix: 'app',
    // TODO: Figure out a good way to get rid of the boilerplate in the `app.component.ts` without
    // hardcoding the new angular app to a particular stylesheet format
    // We "should" use the default the nx workspace has
    style: 'scss',
  });
  addFiles(tree, normalizedOptions);
  console.log(
    `${normalizedOptions.projectRoot}/src/app/nx-welcome.component.ts`
  );
  tree.delete(
    `${normalizedOptions.projectRoot}/src/app/nx-welcome.component.ts`
  );
  await updateProjectStyles(tree, normalizedOptions);
  // await updateProjectExecutors(tree, normalizedOptions);
  await formatFiles(tree);
}
