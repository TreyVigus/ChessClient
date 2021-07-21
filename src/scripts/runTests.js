import readdirp from 'readdirp';
import childProcess from 'child_process'; //https://nodejs.org/api/child_process.html

async function main() {
    //retrieve all .test.js files from the build/app directory.
    const files = await readdirp.promise('build/app', {
		fileFilter: (entry) => {
            const parts = entry.path.split('.');
            if(parts.length < 3) {
                return false;
            }
			return parts.pop() === 'js' && parts.pop() === 'test';
		}
	});

    const paths = files.map(file => `build/app/${file.path}`);
    executeTestScripts(0, paths);
}

//sequentially execute the .test.js scripts located at the given srcPaths
//OPT: To speed this up, execute multiple children at once.
function executeTestScripts(currPathIndex, srcPaths) {
    if(currPathIndex === srcPaths.length) {
        return;
    }

    const cp = childProcess.fork(srcPaths[currPathIndex]);
    // wait until the child process ends, then spawn another process.
    cp.on('exit', ()=> {
        executeTestScripts(currPathIndex + 1, srcPaths);
    });
}

main();