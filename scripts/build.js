
const fs = require('fs');
const cp = require('child_process');


const main = () => {

    const outName = 'index';
    const cmd = `wasm-pack build --out-dir lib --out-name ${outName} --target nodejs`;
    cp.execSync(cmd);

    // clean
    fs.unlinkSync('./lib/.gitignore');
    fs.unlinkSync('./lib/LICENSE');
    fs.unlinkSync('./lib/package.json');
    fs.unlinkSync('./lib/README.md');

    fs.unlinkSync(`./lib/${outName}_bg.wasm.d.ts`);
    fs.unlinkSync(`./lib/${outName}.d.ts`);

};

main();
