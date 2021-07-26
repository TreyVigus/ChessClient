//This Script moves any files without .ts extensions from the app folder to the equivalent location of the build folder.
//If an equivalent location in the build folder doesn't exist, this will create it.

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
		const srcPath = `src\\app\\${path}`;
		const destPath = `build\\app\\${path}`;
		buildContainingDirectories(pathWithoutFile(destPath));
		fs.copyFileSync(srcPath, destPath);
	});
}

//e.g. src\app\thing.txt -> src\app
function pathWithoutFile(path) {
	const parts = path.split('\\');
	parts.pop();
	return parts.join('\\');
}

/**
 * Suppose destWithoutFile = build\app\fake\anotherFake
 * Suppose fake and anotherFake are directories that don't exist.
 * This will create fake and anotherFake.
 * That is, build\app\fake\anotherFake will be a valid path.
 */
function buildContainingDirectories(destWithoutFile) {
	//check build, then build\app, then build\app\fake, then build\app\fake\anotherFake
	//OPT: once a subpath is found that doesn't exist, all following subpaths won't exist
	//OPT: could binary search for a subpath that doesn't exist
	const parts = destWithoutFile.split('\\');
	for(let i = 0; i < parts.length; i++) {
		const subPath = parts.slice(0, i+1).join('\\');
		if(!fs.existsSync(subPath)) {
			fs.mkdirSync(subPath);
		}
	}
}

main();