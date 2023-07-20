import {
  Tree,
  logger,
  names,
  generateFiles,
  formatFiles,
  getProjects,
  readWorkspaceConfiguration,
} from '@nx/devkit';

import { DocPageSchema } from './schema';

import * as path from 'path';

const execSchematicCommand = `npm run nx workspace-generator doc-page`;

export default async function (tree: Tree, schema: DocPageSchema) {
  logger.info(
    `✳️  Starting Schematic Command: ✳️  ${execSchematicCommand} ${schema.name}`
  );
  const defaultProject = readWorkspaceConfiguration(tree).defaultProject;
  const findPath = getProjects(tree).get(defaultProject ?? '')?.root;
  const targetPath = findPath ?? './';
  const templatePath = path.join(__dirname, 'files');
  const interfaceNames = names(schema.name);

  const substitutions = {
    path: schema.path ? schema.path + '/' : '',
    // remove __tmpl__ from file endings
    tmpl: '',
    // make the different name variants available as substitutions
    ...interfaceNames,
  };
  generateFiles(tree, templatePath, targetPath, substitutions);
  await formatFiles(tree);
}
