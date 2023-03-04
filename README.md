# Ng Doc Portal Project

This is the root of the nx workspace containing the two packages:

- [`ng-doc-portal`](./libs/ng-doc-portal/README.md)
- [`ng-doc-portal-plugin`](./libs/ng-doc-portal-plugin/README.md)

## [`ng-doc-portal`](./libs/ng-doc-portal/README.md) Overview

This part of the repo is dedicated to the angular application that runs and displays the document pages.

This contains the component set we provide, root module/routing system, DI configuration system and css styling.

## [`ng-doc-portal-plugin`](./libs/ng-doc-portal-plugin/README.md) Overview

This part of the repo contains the `nx` generators/executors we have developed.

The executors are responsible for running our custom compiler along with a normal angular serve/build.

The generators are responsible for creating a default `ng-doc-portal` configured angular application or generating a single `.doc-page` file.

## Getting Setup

Run `npm install` to get the project setup.

## Running Example Application

Run `npm start` to run the example `ng-doc-portal` application.

## Building Example Application

Run `npm build` to build the example `ng-doc-portal` application.

## Publishing

Publishing is automatically done via the Github release process.

Once a release is created a workflow will be triggered to update, publish, and commit the `package.json` files of the npm packages in the repo.
