
class World {
    worldWidth = 5;
    worldHeight = 2;
    originIndex = 0;
    grid = new Array(1).fill(new Array(64).fill(0));
    newGrid = new Array(0);
    emptyChunk = new Array(64).fill(0);

    liveChunks = new Array();

    constructor() {
        //serialization test
        // const chunkZeroZero = this.emptyChunk.slice();
        // chunkZeroZero[this.getLocalIndex(0,0)] = 1;
        // chunkZeroZero[this.getLocalIndex(1,1)] = 1;
        // chunkZeroZero[this.getLocalIndex(2,2)] = 1;
        // chunkZeroZero[this.getLocalIndex(3,3)] = 1;
        // chunkZeroZero[this.getLocalIndex(4,4)] = 1;
        // chunkZeroZero[this.getLocalIndex(5,5)] = 1;
        // chunkZeroZero[this.getLocalIndex(6,6)] = 1;
        // chunkZeroZero[this.getLocalIndex(7,7)] = 1;
        // this.grid[0] = chunkZeroZero;


        //add a glider gun, for testing
        // const chunkZeroZero = this.emptyChunk.slice();
        // chunkZeroZero[this.getLocalIndex(0,4)] = 1;
        // chunkZeroZero[this.getLocalIndex(1,4)] = 1;
        // chunkZeroZero[this.getLocalIndex(0,5)] = 1;
        // chunkZeroZero[this.getLocalIndex(1,5)] = 1;
        // this.grid[this.getChunkIndex(0,0)] = chunkZeroZero;

        // const chunkOneZero = this.emptyChunk.slice();
        // chunkOneZero[this.getLocalIndex(4,2)] = 1;
        // chunkOneZero[this.getLocalIndex(5,2)] = 1;
        // chunkOneZero[this.getLocalIndex(3,3)] = 1;
        // chunkOneZero[this.getLocalIndex(7,3)] = 1;
        // chunkOneZero[this.getLocalIndex(2,4)] = 1;
        // chunkOneZero[this.getLocalIndex(2,5)] = 1;
        // chunkOneZero[this.getLocalIndex(6,5)] = 1;
        // chunkOneZero[this.getLocalIndex(2,6)] = 1;
        // chunkOneZero[this.getLocalIndex(3,7)] = 1;
        // chunkOneZero[this.getLocalIndex(7,7)] = 1;
        // this.grid[this.getChunkIndex(1,0)] = chunkOneZero;

        // const chunkTwoZero = this.emptyChunk.slice();
        // chunkTwoZero[this.getLocalIndex(6,1)] = 1;
        // chunkTwoZero[this.getLocalIndex(4,2)] = 1;
        // chunkTwoZero[this.getLocalIndex(5,2)] = 1;
        // chunkTwoZero[this.getLocalIndex(4,3)] = 1;
        // chunkTwoZero[this.getLocalIndex(5,3)] = 1;
        // chunkTwoZero[this.getLocalIndex(0,4)] = 1;
        // chunkTwoZero[this.getLocalIndex(4,4)] = 1;
        // chunkTwoZero[this.getLocalIndex(5,4)] = 1;
        // chunkTwoZero[this.getLocalIndex(0,5)] = 1;
        // chunkTwoZero[this.getLocalIndex(1,5)] = 1;
        // chunkTwoZero[this.getLocalIndex(6,5)] = 1;
        // chunkTwoZero[this.getLocalIndex(0,6)] = 1;
        // this.grid[this.getChunkIndex(2,0)] = chunkTwoZero;

        // const chunkThreeZero = this.emptyChunk.slice();
        // chunkThreeZero[this.getLocalIndex(0,0)] = 1;
        // chunkThreeZero[this.getLocalIndex(0,1)] = 1;
        // chunkThreeZero[this.getLocalIndex(0,5)] = 1;
        // chunkThreeZero[this.getLocalIndex(0,6)] = 1;
        // this.grid[this.getChunkIndex(3,0)] = chunkThreeZero;

        // const chunkFourZero = this.emptyChunk.slice();
        // chunkFourZero[this.getLocalIndex(2,2)] = 1;
        // chunkFourZero[this.getLocalIndex(3,2)] = 1;
        // chunkFourZero[this.getLocalIndex(2,3)] = 1;
        // chunkFourZero[this.getLocalIndex(3,3)] = 1;
        // this.grid[this.getChunkIndex(4,0)] = chunkFourZero;

        // const chunkOneOne = this.emptyChunk.slice();
        // chunkOneOne[this.getLocalIndex(4,0)] = 1;
        // chunkOneOne[this.getLocalIndex(5,0)] = 1;
        // this.grid[this.getChunkIndex(1,1)] = chunkOneOne;

        //glider down right
        // const chunk = this.emptyChunk.slice();
        // chunk[this.getLocalIndex(2,3)] = 1;
        // chunk[this.getLocalIndex(3,3)] = 1;
        // chunk[this.getLocalIndex(4,3)] = 1;
        // chunk[this.getLocalIndex(4,2)] = 1;
        // chunk[this.getLocalIndex(3,1)] = 1;
        // this.grid[0] = chunk;
        // this.liveChunks.push(0);

        //glider up left
        // const chunk = this.emptyChunk.slice();
        // chunk[this.getLocalIndex(2,2)] = 1;
        // chunk[this.getLocalIndex(2,3)] = 1;
        // chunk[this.getLocalIndex(2,4)] = 1;
        // chunk[this.getLocalIndex(3,2)] = 1;
        // chunk[this.getLocalIndex(4,3)] = 1;
        // this.grid[0] = chunk;

    }

    tick() {
        let widenBy = 0;
        let shiftRight = false;
        let shiftDown = false;

        if(this.grid.some((_, index) => index % this.worldWidth === (this.worldWidth - 1))) {
            widenBy++;
        }
        if(this.grid.some((_, index) => index % this.worldWidth === 0)) {
            widenBy++;
            shiftRight = true;
        }

        if(this.grid.some((_, index) => Math.floor(index / this.worldWidth) === (this.worldHeight - 1))) {
            this.worldHeight++;
        }

        if(this.grid.some((_, index) => Math.floor(index / this.worldWidth) === 0)) {
            shiftDown = true;
        }

        this.widenWorld(widenBy, shiftRight, shiftDown);

        let newLiveChunks = new Array();

        for(let i = 0; i < this.worldWidth * this.worldHeight; i++) {
            const chunkX = i % this.worldWidth;
            const chunkZ = Math.floor(i / this.worldWidth);
            const neighborIndices = this.getNeighborIdicies(i, this.worldWidth);

            if(this.grid[i] !== undefined || neighborIndices.some((index) => this.grid[index] !== undefined)) {
                this.tickChunk(i);
            }
        }
        this.liveChunks = newLiveChunks;

        this.grid = this.newGrid;
        this.newGrid = new Array(0);
    }

    tickChunk(chunkIndex) {
        const chunk = this.grid[chunkIndex] ?? this.emptyChunk;
        const newChunk = this.emptyChunk.slice();
        let chunkIsAlive = false;

        for(let i = 0; i < 64; i++) {
            const coords = this.getGlobalCoord(chunkIndex, i);
            const nodeIsAlive = chunk[i] === 1;
            const neighbors = this.getNeighborCoords(coords.x, coords.z, 8);
            const liveNeighbors = neighbors.filter((crds) => this.getNodeFromGlobalCoords(crds.x, crds.z) === 1).length;

            if(nodeIsAlive && liveNeighbors === 2) {
                newChunk[i] = 1;
                chunkIsAlive = true;
            }
            else if(liveNeighbors === 3) {
                newChunk[i] = 1;
                chunkIsAlive = true;
            }

        }

        if(chunkIsAlive) {
            this.newGrid[chunkIndex] = newChunk;
        }

        return chunkIsAlive;
    }

    getGlobalCoord(chunkIndex, localIndex) {
        const chunkCoords = this.getCoord(chunkIndex, this.worldWidth)
        const localTop = chunkCoords.z * 8;
        const localLeft = chunkCoords.x * 8;
        const localCoords = this.getCoord(localIndex, 8);
        return {...new worldCoord(), z: (localTop+localCoords.z), x: (localLeft + localCoords.x), chunkIndex: chunkIndex, localIndex: localIndex};
    }

    getCoord(index, width) {
        const z = Math.floor(index / width);
        const x = index % width;
        return {...new simpleCoord(), z: z, x: x};
    }

    getNodeFromGlobalCoords(globalX, globalZ) {
        const chunkIndex = this.getChunkIndexForGlobalCoords(globalX, globalZ);
        const chunk = this.grid[chunkIndex];
        if(chunkIndex !== undefined) {
            const localX = globalX % 8;
            const localZ = globalZ % 8;
            const localIndex = this.getLocalIndex(localX, localZ);

            const chunk = this.grid[chunkIndex] ?? this.emptyChunk;

            return chunk[localIndex];
        }
        return 0;
    }

    getChunkIndex(chunkX, chunkZ, worldWidth) {
        return this.getIndex(chunkX, chunkZ, worldWidth ?? this.worldWidth);
    }
    getLocalIndex(localX, localZ) {
        return this.getIndex(localX, localZ, 8);
    }

    getIndex(x, z, width) {
        return z * width + x;
    }

    getChunkIndexForGlobalCoords(globalX, globalZ) {
        const chunkX = Math.floor(globalX / 8);
        const chunkZ = Math.floor(globalZ / 8);
        return this.getChunkIndex(chunkX, chunkZ);
    }

    renderToConsole() {
        console.log('   01234567890123456789012345678901');
        for(let chunkZ = 0; chunkZ < this.worldHeight; chunkZ++) {
            for(let localZ = 0; localZ < 8; localZ++)
            {
                let line = (''+(chunkZ*8+localZ)+' ').padStart(3, ' ');
                for(let chunkX = 0; chunkX < this.worldWidth; chunkX++) {
                    const index = this.getChunkIndex(chunkX, chunkZ);
                    const chunk = this.grid[index] ?? this.emptyChunk;
                    if(chunk === undefined) {
                        console.log('grid length '+ this.grid.length + ' world width: ' + this.worldWidth + ' index:' + index + '\r\n' + this.grid);
                    }
                    for(let localX = 0; localX < 8; localX++) {
                        const localIndex = this.getLocalIndex(localX, localZ);
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

    getNeighborIdicies(index, width) {
        const coords = this.getCoord(index, width);
        const neighborIndices = this.getNeighborCoords(coords.x, coords.z, width)
            .map((crds) => this.getIndex(crds.x, crds.z, width));

        return neighborIndices;
    }

    getNeighborCoords(x, z)
    {
        let neighbors = new Array(8);

        neighbors.push(
            {...new simpleCoord(), z: z+1, x: x},
            {...new simpleCoord(), z: z+1, x: x+1},
            {...new simpleCoord(), z: z+1, x: x-1},
            {...new simpleCoord(), z: z-1, x: x},
            {...new simpleCoord(), z: z-1, x: x+1},
            {...new simpleCoord(), z: z-1, x: x-1},
            {...new simpleCoord(), z: z,   x: x+1},
            {...new simpleCoord(), z: z,   x: x-1},
        );

        return neighbors;
    }

    widenWorld(widenBy, shiftRight, shiftDown) {
        if(widenBy === 0 && !shiftDown && !shiftRight) {
            return;
        }

        const addToX = shiftRight ? 1 : 0;
        const addToZ = shiftDown ? 1 : 0;
        const newGrid = new Array(this.grid.length);
        this.grid.forEach((chunk, i) => {
            const coords = this.getCoord(i, this.worldWidth);
            const newIndex = this.getChunkIndex(coords.x+addToX, coords.z+addToZ, this.worldWidth+widenBy);
            if(i === this.originIndex) {
                this.originIndex = newIndex;
            }
            newGrid[newIndex] = chunk;
        });
        this.grid = newGrid;
        this.worldWidth += widenBy;
        this.worldHeight += addToZ;

    }

    serialize() {
        const ser = { width: this.worldWidth, height: this.worldHeight, origin: this.originIndex, chunks: new Array(), fmt: 'bin' };
        this.grid.forEach((chunk,i) => { 
            const compressed = this.binaryCompressChunk(chunk);
            console.log('--');
            const test = World.binaryDecompressChunk(compressed);

            const verify = chunk.every((v, j) => chunk[j] === test[j]);
            if(!verify) { throw new Error("bad serialization"); }

            ser.chunks.push({i:i, d:compressed}); 
        });
        return JSON.stringify(ser);
    }

    static deserialize(jsonString) {
        const ser = JSON.parse(jsonString);
        const world = new World();
        world.worldWidth = ser.width;
        world.worldHeight = ser.height;
        world.originIndex = ser.origin;
        ser.chunks.forEach((sChunk) => {
            world.newGrid[sChunk.i] = World.binaryDecompressChunk(sChunk.d);
        });

        world.grid = world.newGrid;
        world.newGrid = new Array(0);
        return world;
    }

    binaryCompressChunk(chunk) {
        let val = 0;
        const b = Buffer.alloc(8);
        chunk.forEach((node, index) => {
            if(index !== 0 && index % 8 == 0) {
                b.writeUInt8(val, (index/8)-1);
                console.log(val.toString(2).padStart(8, '0'));
                val = 0;
            }
            val += (node << (7-index%8));
        });
        console.log(val.toString(2).padStart(8, '0'));
        b.writeUint8(val,7);
        return b.toString('base64');
    }

    static binaryDecompressChunk(base64Data) {
        const b = Buffer.from(base64Data, 'base64');
        const chunk = new Array(64).fill(0);
        for(let i = 0;i < b.length;i++) {
            const val = b.readUInt8(i);
            console.log(val.toString(2).padStart(8, '0'));
            for(let j = 7; j >= 0; j--) {
                const bit = val & (1 << j);
                if(bit !== 0) {
                    const index = i*8 + (7-j);
                    chunk[index] = 1;
                }
            }
        }
        return chunk;
    }

    simpleCompressChunk(chunk) {

        let lastVal = chunk[0];
        let count = 1;
        let compressed = '';

        for(let i = 1;i<chunk.length;i++) {
            const val = chunk[i];
            if(val !== lastVal) {
                compressed = compressed.concat(`${lastVal},${count};`);
                lastVal = val;
                count = 1;
                continue;
            }
            count++;
        }
        compressed = compressed.concat(`${lastVal},${count}`);
        return compressed;
    }
}

class simpleCoord {
    x = 0;
    z = 0;
}

class worldCoord extends simpleCoord {
    chunkIndex = 0;
    localIndex = 0;
}

module.exports = World;