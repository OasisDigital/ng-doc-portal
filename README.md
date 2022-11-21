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

Currently there is no automation in place for adjusting the package versions & publishing. So, you will need to manually do the below:

Adjust the version in both packages' `package.json` file.

Run `npm build:packages` to build the compiled output.

Open up the two dist folders for the packages and run `npm publish`.
