const prompt = require("prompt-sync")();
require('node:buffer');
const fs = require('fs');
const World = require('./world');
const path = require('path');

let world = new World();
let run = true;

while(run)
{
    console.log("load predefined pattern:\r\n1. down right glider\r\n2. up left glider\r\n3. glider gun");
    const toLoad = prompt("?");
    let fileToLoad = './demos/downright.txt';
    switch(toLoad)
    {
        case '1':
            fileToLoad = 'demos/downright.txt';
            break;
        case '2':
            fileToLoad = 'demos/upleft.txt';
            break;
        case '3':
            fileToLoad = 'demos/gun.txt';
            break;
    }

    const data = fs.readFileSync(path.join(__dirname, fileToLoad), 'utf8');
    console.log(data);
    world = World.deserialize(data);
    let tick = true;
    while(tick) {
        world.renderToConsole();
        console.log('---------------------------------------------------------------------------');
        const res = prompt("next? ");
        if(res === 'n') { run = false; tick = false; }
        if(res === 's') { console.log(world.serialize()); }
        if(res === 'r') { tick = false; }
        else { world.tick(); }
    }
}