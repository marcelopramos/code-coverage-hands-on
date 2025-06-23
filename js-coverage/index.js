const babel = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default; 
const fs = require('fs');

global.totalBranches = 0;
global.totalFunctions = 0;

global.branchesExecuted = 0;
global.functionsExecuted = 0;

function addBranchIncrement() {
  return babel.parse('global.branchesExecuted++;', { sourceType: 'script' }).program.body[0];
}

function addFunctionIncrement() {
  return babel.parse('global.functionsExecuted++;', { sourceType: 'script' }).program.body[0];
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
    path.node.body.body.unshift(addFunctionIncrement());
  },
  IfStatement(path) {
    console.log(path.node);
    /* 
     * TODO 2: Implement the instrumentation for IfStatement
     * Add the addBranchIncrement subtree to the body of the branches
     * Check the printed node - where's the then node? And the else?
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