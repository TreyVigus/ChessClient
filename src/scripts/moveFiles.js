//This Script moves any files without .ts extensions from the app folder to the equivalent location of the build folder.
//NOTE: This will NOT move directories, and thus expects the directory structure of the build/app folder to be the same as src/app,
//			except possibly missing some files.

import readdirp from 'readdirp'; //allows for recursive traversal of directories. https://github.com/paulmillr/readdirp
import fs from 'fs';

async function main() {
	//retrieve all non .ts files from the src/app directory.
	const files = await readdirp.promise('src/app', {
		fileFilter: (entry) => {
			return extension(entry.path) !== 'ts'
		}
	});

	//keep in mind these paths are relative to src/app
	const paths = files.map(file => file.path);
	copyFiles(paths);
}

function extension(fileName) {
	return fileName.split('.').pop();
}

//given a list of files located in the src/app directory, 
//	copy them to the equivalent location in the build/app directory.
function copyFiles(srcPaths) {
	srcPaths.forEach(path => {
		fs.copyFileSync(`src/app/${path}`, `build/app/${path}`);
	});
}

main();