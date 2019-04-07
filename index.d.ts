declare module index {
  export function findInProject(options:
    {
      find: string[],
      exclude: string[],
      filename: string,
      resultItemTemplate: string,
      resultTemplate: string
    }): void;
}