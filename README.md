# Top Level Await

This is a simple Babel plugin which automatically wraps top-level `await` expressions.

That is, it'll turn code like:

	await fetch('http://www.google.com/')

into:

	export const __async = true;
	export default (async function(){
		await fetch('http://www.google.com/')
	})()

This implementation automatically hoists import declarations so that they remain at the top level:

	import _ from "lodash";
	import fs from "fs-promise"

	var text = await fs.readFile('README.md', 'utf-8')

	console.log(text)

This is transpiled conveniently into:

	import _ from "lodash";
	import fs from "fs-promise"
	
	export const __async = (async function(){
		var text = await fs.readFile('README.md', 'utf-8')

		console.log(text)
	})()


In addition, transformed modules export `__async` which is the promise of the wrapped async expression. 


The current implementation doesn't support exports. Top level awaits might interfere with the behavior of certain modules (as many of their exports may not be defined until well after the module has been loaded). Anyway, this top-level await transform is primarily useful for REPL-style interactions, as essentially a convenience to avoid wrapping things with an async IIFE (immediately invoked function expression).


Additional Information: https://github.com/tc39/ecmascript-asyncawait/issues/9

# To Run:

There's a demo in the `test/` folder

	babel-node --presets es2015 transform.js
