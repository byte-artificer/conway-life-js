module.exports = function renderToConsole(world) {
    console.log('   01234567890123456789012345678901');
    for(let chunkZ = 0; chunkZ < world.worldHeight; chunkZ++) {
        for(let localZ = 0; localZ < 8; localZ++)
        {
            let line = (''+(chunkZ*8+localZ)+' ').padStart(3, ' ');
            for(let chunkX = 0; chunkX < world.worldWidth; chunkX++) {
                const index = world.getChunkIndex(chunkX, chunkZ);
                const chunk = world.grid[index] ?? world.emptyChunk;
                if(chunk === undefined) {
                    console.log('grid length '+ world.grid.length + ' world width: ' + world.worldWidth + ' index:' + index + '\r\n' + world.grid);
                }
                for(let localX = 0; localX < 8; localX++) {
                    const localIndex = world.getLocalIndex(localX, localZ);
                    const value = chunk[localIndex];
                    if(value === 1) {
                        line = line.concat('█');
                    }
                    else {
                        line = line.concat('.');
                    }
                }
            }
            console.log(line);
        }
    }
}
