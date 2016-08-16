import _ from "lodash";
import fs from "fs-promise"

var text = await fs.readFile('README.md', 'utf-8')

console.log(text)