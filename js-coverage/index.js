const babel = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default; 
const fs = require('fs');

global.totalBranches = 0;
global.totalFunctions = 0;

global.branchesExecuted = [];
global.functionsExecuted = [];

function addBranchIncrement(branchId) {
  const node = babel.parse(`if (!global.branchesExecuted.includes(${branchId})) global.branchesExecuted.push(${branchId});`, { sourceType: 'script' }).program.body[0];
  return node;
}

function addFunctionIncrement(functionId) {
  return babel.parse(`if (!global.functionsExecuted.includes('${functionId}')) global.functionsExecuted.push('${functionId}');`, { sourceType: 'script' }).program.body[0];
}

const code = fs.readFileSync('code.js', 'utf8');

/* 
 * TODO 1: Generate the AST from code
 * Look at babel.parse function from @babel/parser
 */
let ast;

// Traverse the AST instrumenting

const visitor = {
  FunctionDeclaration(path) {
    global.totalFunctions++;
    path.node.body.body.unshift(addFunctionIncrement(path.node.id.name));
  },
  IfStatement(path) {
    console.log(path.node);
    /* 
    * TODO 2: Implement the instrumentation for IfStatement
    * Add the addBranchIncrement subtree to the body of the branches
    * 
    * Check the printed node - where's the then node? And the else?
    * 
    * Note that the instrumentation function contains an IfStatement,
    * so its branches will also be instrumented. How can we ignore it?
    */
  },
};

traverse(ast, visitor);

/* 
 * TODO 3: Generate the instrumented code from AST and write to instrumented-code.js
 * Look at generate function from @babel/generator
 */

// Test
const shouldIDeployOn = require('./instrumented-code.js').shouldIDeployOn;

console.assert(shouldIDeployOn('Tuesday') === "Yes");

/* 
 * TODO 4: Create a report
 */