"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (_ref) {
    var t = _ref.types;

    return {
        manipulateOptions: function manipulateOptions(opts, parserOpts) {
            parserOpts.plugins.push("topLevelAwait");
        },

        visitor: {
            Program: function Program(path) {
                // check if this program contains top-level awaits
                // or if it contains exports (which aren't supported)
                var has_export = false,
                    has_await = false;

                path.traverse({
                    AwaitExpression: function AwaitExpression(path) {
                        var parent = path.getFunctionParent();
                        if (parent.type === 'Program') has_await = true;
                    },
                    ExportDeclaration: function ExportDeclaration() {
                        has_export = true;
                    },
                    ExportNamespaceSpecifier: function ExportNamespaceSpecifier() {
                        has_export = true;
                    },
                    ExportSpecifier: function ExportSpecifier() {
                        has_export = true;
                    },
                    ExportDefaultSpecifier: function ExportDefaultSpecifier() {
                        has_export = true;
                    }
                });

                // fast path shortcut if there are no top-level awaits
                if (!has_await) return;
                if (has_export) throw new SyntaxError('Modules using top level await must not have exports');

                // we need to hoist all the imports
                var statements = [],
                    imports = [];

                path.node.body.forEach(function (stmt) {
                    // hoist import statements
                    if (t.isImportDeclaration(stmt) || t.isImportDefaultSpecifier(stmt) || t.isImportNamespaceSpecifier(stmt) || t.isImportSpecifier(stmt)) {
                        imports.push(stmt);
                    } else {
                        statements.push(stmt);
                    }
                });

                // here's the actual magical mess
                path.replaceWith(t.program(imports.concat([t.exportNamedDeclaration(t.variableDeclaration("const", [t.variableDeclarator(t.identifier('__async'), t.callExpression(t.functionExpression(null, // anonymous
                [], // params
                t.blockStatement(statements), false, // generator
                true), // async
                []))]), [], null)])));
            }
        }
    };
};

var _types = require("babylon/lib/tokenizer/types");

var _parser = require("babylon/lib/parser");

// Copyright (c) 2016 antimatter15

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


_parser.plugins.topLevelAwait = function (instance) {
    instance.extend("parseTopLevel", function (file, program) {
        return function (file, program) {
            program.sourceType = this.options.sourceType;

            // set state to inAsync to allow awaits
            this.state.inAsync = true;

            // allow strings at the top of a script
            // plus the only useful directive is "use strict"
            // which gets added by babel anyways

            var allowDirectives = false;
            this.parseBlockBody(program, allowDirectives, true, _types.types.eof);

            file.program = this.finishNode(program, "Program");
            file.comments = this.state.comments;
            file.tokens = this.state.tokens;

            return this.finishNode(file, "File");
        };
    });
};
