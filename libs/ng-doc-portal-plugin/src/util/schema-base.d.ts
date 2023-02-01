export interface CompileSchema {
  configFile?: string;
}

export interface CompileWithAngularConfigTargetSchema extends CompileSchema {
  ['ngConfigTarget']?: string;
}

export type BaseSchema = CompileWithAngularConfigTargetSchema;
