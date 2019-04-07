# find-in-project
 Find values ​​in project files.

#Installing

npm install --save find-in-project

#Example

const findInProject = require('find-in-project');

const options = {
  find: ["(%value%)"],
  resultFilename: "result.txt",
  exclude: ["node_modules"],
  resultItemTemplate: "%value% - %file%\n",
  resultTemplate: "INIT\n%template%END"
}

findInProject(options);
