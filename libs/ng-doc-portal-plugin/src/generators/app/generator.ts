import { applicationGenerator } from '@nrwl/angular/generators';
import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
  logger,
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
    `${options.projectRoot}`,
    templateOptions
  );
}

function updateProjectStyles(tree: Tree, options: NormalizedSchema) {
  const projectConfig = readProjectConfiguration(tree, options.projectName);

  if (projectConfig.targets) {
    const styles = projectConfig.targets.build.options.styles;
    const updatedStyles = [
      'node_modules/@oasisdigital/ng-doc-portal/src/lib/styles/ng-doc-portal.scss',
      ...styles,
    ];
    projectConfig.targets.build.options.styles = updatedStyles;

    updateProjectConfiguration(tree, options.projectName, projectConfig);
  }
}

function updateProjectCommonJsDependencies(
  tree: Tree,
  options: NormalizedSchema
) {
  const projectConfig = readProjectConfiguration(tree, options.projectName);

  if (projectConfig.targets) {
    projectConfig.targets.build.options['allowedCommonJsDependencies'] = [
      'prettier',
    ];

    updateProjectConfiguration(tree, options.projectName, projectConfig);
  }
}

function updateProjectExecutors(tree: Tree, options: NormalizedSchema) {
  const projectConfig = readProjectConfiguration(tree, options.projectName);

  const appName = options.name || 'component-doc-portal';

  if (projectConfig.targets) {
    const targetOptions = {
      configFile: `apps/${appName}/ng-doc-portal-config.json`,
    };

    projectConfig.targets = {
      ...projectConfig.targets,
      ['ng-build']: { ...projectConfig.targets['build'] },
      ['ng-serve']: { ...projectConfig.targets['serve'] },
      ['compile']: {
        executor: '@oasisdigital/ng-doc-portal-plugin:compile',
        options: targetOptions,
      },
      ['build']: {
        executor: '@oasisdigital/ng-doc-portal-plugin:build',
        options: targetOptions,
        configurations: {
          production: {
            ngConfigTarget: 'production',
          },
          configuration: {
            ngConfigTarget: 'development',
          },
        },
      },
      ['serve']: {
        executor: '@oasisdigital/ng-doc-portal-plugin:serve',
        options: targetOptions,
        configurations: {
          production: {
            ngConfigTarget: 'production',
          },
          configuration: {
            ngConfigTarget: 'development',
          },
        },
      },
    };

    // Need to replace the default build targets that point to `build` to `ng-build` in `ng-serve`
    if (projectConfig.targets['ng-serve'].configurations) {
      Object.keys(projectConfig.targets['ng-serve'].configurations).forEach(
        (configKey) => {
          const ngServeTarget = projectConfig.targets?.['ng-serve'] as any;
          (projectConfig.targets as any)['ng-serve'].configurations[
            configKey
          ].browserTarget = ngServeTarget.configurations[
            configKey
          ].browserTarget.replace(':build:', ':ng-build:');
        }
      );
    }

    // If there is an 'extract-i18n' we need to re-work it
    if (projectConfig.targets['extract-i18n']) {
      projectConfig.targets['ng-extract-i18n'] = {
        ...projectConfig.targets['extract-i18n'],
        options: {
          ...projectConfig.targets['extract-i18n'].options,
          browserTarget: projectConfig.targets[
            'extract-i18n'
          ].options.browserTarget.replace(':build', ':ng-build'),
        },
      };

      projectConfig.targets['extract-i18n'] = {
        executor: 'nx:run-commands',
        options: {
          commands: [
            {
              command: `npx nx compile ${appName}`,
            },
            {
              command: `npx nx ng-extract-i18n ${appName}`,
            },
          ],
          parallel: false,
        },
      };
    }

    updateProjectConfiguration(tree, options.projectName, projectConfig);
  }
}

function removeProjectBuildBudgets(tree: Tree, options: NormalizedSchema) {
  const projectConfig = readProjectConfiguration(tree, options.projectName);

  if (projectConfig.targets) {
    delete projectConfig.targets.build.configurations?.production.budgets;

    updateProjectConfiguration(tree, options.projectName, projectConfig);
  }
}

function removeExtractI18N(tree: Tree, options: NormalizedSchema) {
  const projectConfig = readProjectConfiguration(tree, options.projectName);

  if (projectConfig.targets && projectConfig.targets?.['extract-i18n']) {
    delete projectConfig.targets['extract-i18n'];

    updateProjectConfiguration(tree, options.projectName, projectConfig);
  }
}

async function updateGitIgnore(tree: Tree) {
  if (tree.exists('.gitignore')) {
    const entry = '**/doc-page-loaders.ts';

    let content = tree.read('.gitignore', 'utf-8') ?? '';
    if (/\*\*\/doc-page-loaders\.ts/gm.test(content)) {
      return;
    }

    content = `${content}\n${entry}\n`;
    tree.write('.gitignore', content);
  } else {
    logger.warn(`Couldn't find .gitignore file to update`);
  }
}

export default async function (
  tree: Tree,
  options: NgDocPortalPluginGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);

  await applicationGenerator(tree, {
    name: options.name || 'component-doc-portal',
    tags: normalizedOptions.parsedTags.join(','),
    directory: options.directory,
    e2eTestRunner: 'none' as any,
    skipTests: true,
    prefix: 'app',
    style: 'scss',
  });

  addFiles(tree, normalizedOptions);

  tree.delete(
    `${normalizedOptions.projectRoot}/src/app/nx-welcome.component.ts`
  );

  updateProjectStyles(tree, normalizedOptions);
  updateProjectCommonJsDependencies(tree, normalizedOptions);
  updateProjectExecutors(tree, normalizedOptions);
  removeProjectBuildBudgets(tree, normalizedOptions);
  removeExtractI18N(tree, normalizedOptions);
  updateGitIgnore(tree);
  await formatFiles(tree);
}
