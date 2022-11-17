
const fs = require('fs');
const cp = require('child_process');


const main = () => {

    const outName = 'gew';
    const cmd = `wasm-pack build --out-dir dist --out-name ${outName} --target nodejs`;
    cp.execSync(cmd);

    // clean
    fs.unlinkSync('./dist/.gitignore');
    fs.unlinkSync('./dist/LICENSE');
    fs.unlinkSync('./dist/package.json');
    fs.unlinkSync('./dist/README.md');

};

main();
