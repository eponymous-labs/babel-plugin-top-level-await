import { parse } from 'babylon'
import { Pipeline } from 'babel-core'

import { readFileSync } from 'fs'



let pipeline = new Pipeline;


var code = readFileSync('./test.js', 'utf8');

var out = pipeline.pretransform(code, {
	presets: ['es2015', 'stage-1'],
	plugins: [require('./top-level-await.js').default]
})


console.log(out.transform().code)
