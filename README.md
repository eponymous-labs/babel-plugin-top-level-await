# Top Level Await

https://github.com/tc39/ecmascript-asyncawait/issues/9

The general approach is to throw stuff into a big async function.

	await fetch('http://www.google.com/')

Turns into:

	(async function(){
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

	(async function(){
		var text = await fs.readFile('README.md', 'utf-8')

		console.log(text)
	})()


The current implementation doesn't support exports. Top level awaits might interfere with the behavior of certain modules (as many of their exports may not be defined until well after the module has been loaded). Anyway, this top-level await transform is primarily useful for REPL-style interactions, as essentially a convenience to avoid wrapping things with an async IIFE (immediately invoked function expression).


# To Run:

	babel-node --presets es2015 transform.js
