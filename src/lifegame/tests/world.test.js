const World = require('../world');

const expect = require('chai').expect;

const renderToConsole = require('../renderers/console');

describe('Testing local coordinates to index', function() {

    let testWorld = new World();

    beforeEach(function() {
        testWorld = new World();
        testWorld.worldWidth = 1;
        testWorld.worldHeight = 1;
    });

    it('1. coordinate 0, 0 should be index 0', function() {
        const index = testWorld.getLocalIndex(0,0);
        expect(index).to.equal(0);
    });

    it('2. coordinate 1, 0 should be index 1', function() {
        const index = testWorld.getLocalIndex(1,0);
        expect(index).to.equal(1);
    });
    
    it('3. coordinate 0, 1 should be index 8', function() {
        const index = testWorld.getLocalIndex(0,1);
        expect(index).to.equal(8);
    });

    it('4. coordinate 1, 1 should be index 9', function() {
        const index = testWorld.getLocalIndex(1,1);
        expect(index).to.equal(9);
    });

    it('5. coordinate 6, 7 should be index 62', function() {
        const index = testWorld.getLocalIndex(6,7);
        expect(index).to.equal(62);
    });
});

describe('Testing index to coords', function() {

    let testWorld = new World();

    beforeEach(function() {
        testWorld = new World();
        testWorld.worldWidth = 1;
        testWorld.worldHeight = 1;
    });

    it('1. coordinate 0, 0 should be from index 0', function() {
        const coords = testWorld.getCoord(0,8);
        expect(coords.x).to.equal(0);
        expect(coords.z).to.equal(0);
    });

    it('2. coordinate 1, 0 should be from index 1', function() {
        const coords = testWorld.getCoord(1,8);
        expect(coords.x).to.equal(1);
        expect(coords.z).to.equal(0);
    });
    
    it('3. coordinate 0, 1 should be from index 8', function() {
        const coords = testWorld.getCoord(8,8);
        expect(coords.x).to.equal(0);
        expect(coords.z).to.equal(1);
    });

    it('4. coordinate 1, 1 should be from index 9', function() {
        const coords = testWorld.getCoord(9,8);
        expect(coords.x).to.equal(1);
        expect(coords.z).to.equal(1);
    });

    it('5. coordinate 6, 7 should be from index 62', function() {
        const coords = testWorld.getCoord(62,8);
        expect(coords.x).to.equal(6);
        expect(coords.z).to.equal(7);
    });
})

describe('Testing chunk index from global coords (3x3 world)', function() {

    let testWorld = new World();

    beforeEach(function() {
        testWorld = new World();
        testWorld.worldWidth = 3;
        testWorld.worldHeight = 3;
    });

    it('1. coordinate 0, 0 should be in chunk 0', function() {
        const index = testWorld.getChunkIndexForGlobalCoords(0,0);
        expect(index).to.equal(0);
    });

    it('2. coordinate 1, 0 should be in chunk 0', function() {
        const index = testWorld.getChunkIndexForGlobalCoords(1,0);
        expect(index).to.equal(0);
    });

    it('3. coordinate 7, 7 should be in chunk 0', function() {
        const index = testWorld.getChunkIndexForGlobalCoords(7,7);
        expect(index).to.equal(0);
    });
    
    it('4. coordinate 9, 1 should be in chunk 1', function() {
        const index = testWorld.getChunkIndexForGlobalCoords(9,1);
        expect(index).to.equal(1);
    });

    it('5. coordinate 8, 8 should be in chunk 4', function() {
        const index = testWorld.getChunkIndexForGlobalCoords(8,8);
        expect(index).to.equal(4);
    });

    it('6. coordinate 16, 20 should be in chunk 8', function() {
        const index = testWorld.getChunkIndexForGlobalCoords(16,20);
        expect(index).to.equal(8);
    });
})

describe('Testing get node value from global coords (2x2 world)', function() {

    let testWorld = new World();

    beforeEach(function() {
        testWorld = new World();
        testWorld.worldWidth = 2;
        testWorld.worldHeight = 2;
        
        let chunkOneZero = testWorld.emptyChunk.slice();
        chunkOneZero[testWorld.getLocalIndex(2,2)] = 1; //global coordinate 10, 2
        testWorld.grid[testWorld.getChunkIndex(1,0)] = chunkOneZero; 
        
        let chunkZeroOne = testWorld.emptyChunk.slice();
        chunkZeroOne[testWorld.getLocalIndex(3,3)] = 1; //global coordinate 3, 11 
        testWorld.grid[testWorld.getChunkIndex(0,1)] = chunkZeroOne;
    });

    it('1. coordinate 0, 0 should be 0', function() {
        const index = testWorld.getNodeFromGlobalCoords(0,0);
        expect(index).to.equal(0);
    });

    it('2. coordinate 10, 2 should be 1', function() {
        const index = testWorld.getNodeFromGlobalCoords(10,2);
        expect(index).to.equal(1);
    });
    it('3. coordinate 2, 10 should be 0', function() {
        const index = testWorld.getNodeFromGlobalCoords(2, 10);
        expect(index).to.equal(0);
    });
    it('4. coordinate 3, 11 should be 1', function() {
        const index = testWorld.getNodeFromGlobalCoords(3,11);
        expect(index).to.equal(1);
    });
});

describe('Testing tick chunk (3x3 world)', function() {

    let testWorld = new World();

    beforeEach(function() {
        testWorld = new World();
        testWorld.worldWidth = 3;
        testWorld.worldHeight = 3;

        /*----------- EXPECTED RESULTS --------
        *   0 1 2 3 4 5 6 7*0 1 2 3 4 5 6 7*0 1 2 3 4 5 6 7
        *   . . . . . . . . . . . . . . . . . . . . . . . . 
        *   . . . . . . . . . . . O . . . . . . . . . . . . 
        *   . . . . . . . . . . . O . . . . . . . O O . . . 
        *   . . . . . . . . . . . O . . . . . . . O O . . . 
        *   . . . . . . . . . . . . . . . . . . . . . . . . 
        *   . . . . . . . . . . . . . . . . . . . . . . . . 
        *   . . . . . . . . . . . . . . . . . . . . . . . . 
        *   . . . . . . . . . . . . . . . . . . . . . . . . 
        * * . . . . . . . . . . . . . . . . . . . . . . . . *
        *   . . . . . . . . . . . . . . . . . . . . . . . . 
        *   . . O O . . . . . . . . . . . . . . . . . . . . 
        *   . O . . . . . . . . . . . . . . . . . . . . . . 
        *   . . O O . . . . . . . . . . . . . . . . . . . . 
        *   . . . . . . . . . . . . . . . . . . . . . . . . 
        *   . . . . . . . . . . . . . . . . . . . . O . . . 
        *   . . . . . . . . . O O . . . . . . . . O . O . . 
        * * . . . . . . . . . O O . . . . . . . . O . O . . *
        * 1 . . . . . . . . . . . . . . . . . . . . . . . . 
        * 2 . . . . . . . . . . . . . . . . . . . . . . . . 
        * 3 . . . O O . . . . . . . . . . . . . . . . . . . 
        * 4 . . O O . . . . . . . . . . . . . . . . . . . . 
        * 5 . . . . O . . . . . . . . . . . . . . . . . . . 
        *   . . . . . . . . . . . . . . . . . . . . . . . . 
        *   . . . . . . . . . . . . . . . . . . . . . . . . 
        *                  *               *               
        */
        generate3x3TestGrid(testWorld);
    });

    it('1. tick chunk 0,0', function() {
        const isAlive = testWorld.tickChunk(testWorld.getChunkIndex(0,0));
        expect(isAlive).to.equal(false);
    });
    it('2. tick chunk 1,0', function() {
        const isAlive = testWorld.tickChunk(testWorld.getChunkIndex(1,0));
        expect(isAlive).to.equal(true);
        const aliveCount = testWorld.newGrid[testWorld.getChunkIndex(1,0)].reduce((sum, node) => sum + node);
        expect(aliveCount).to.equal(3);
        const nodeThreeOne = testWorld.newGrid[testWorld.getChunkIndex(1,0)][testWorld.getLocalIndex(3,1)];
        expect(nodeThreeOne).to.equal(1);
        const nodeTwoTwo = testWorld.newGrid[testWorld.getChunkIndex(1,0)][testWorld.getLocalIndex(2,2)];
        expect(nodeTwoTwo).to.equal(0);
        const nodeThreeTwo = testWorld.newGrid[testWorld.getChunkIndex(1,0)][testWorld.getLocalIndex(3,2)];
        expect(nodeThreeTwo).to.equal(1);
        const nodeFourTwo = testWorld.newGrid[testWorld.getChunkIndex(1,0)][testWorld.getLocalIndex(4,2)];
        expect(nodeFourTwo).to.equal(0);
        const nodeThreeThree = testWorld.newGrid[testWorld.getChunkIndex(1,0)][testWorld.getLocalIndex(3,3)];
        expect(nodeThreeThree).to.equal(1);
    });
    it('3. tick chunk 2,0', function() {
        const isAlive = testWorld.tickChunk(testWorld.getChunkIndex(2,0));
        expect(isAlive).to.equal(true);
        const aliveCount = testWorld.newGrid[testWorld.getChunkIndex(2,0)].reduce((sum, node) => sum + node);
        expect(aliveCount).to.equal(4);
        const startingChunk = testWorld.grid[testWorld.getChunkIndex(2,0)];
        const noChange = testWorld.newGrid[testWorld.getChunkIndex(2,0)].reduce((sum, node, index) => sum && (node === startingChunk[index]), true);
        expect(noChange).to.equal(true);
    });
    it('4. tick chunk 0,1', function() {
        const isAlive = testWorld.tickChunk(testWorld.getChunkIndex(0,1));
        expect(isAlive).to.equal(true);
        const aliveCount = testWorld.newGrid[testWorld.getChunkIndex(0,1)].reduce((sum, node) => sum + node);
        expect(aliveCount).to.equal(5);
        const nodeTwoTwo = testWorld.newGrid[testWorld.getChunkIndex(0,1)][testWorld.getLocalIndex(2,2)];
        expect(nodeTwoTwo).to.equal(1);
        const nodeThreeTwo = testWorld.newGrid[testWorld.getChunkIndex(0,1)][testWorld.getLocalIndex(3,2)];
        expect(nodeThreeTwo).to.equal(1);
        const nodeoneThree = testWorld.newGrid[testWorld.getChunkIndex(0,1)][testWorld.getLocalIndex(1,3)];
        expect(nodeoneThree).to.equal(1);
        const nodeTwoThree = testWorld.newGrid[testWorld.getChunkIndex(0,1)][testWorld.getLocalIndex(2,3)];
        expect(nodeTwoThree).to.equal(0);
        const nodeThreeThree = testWorld.newGrid[testWorld.getChunkIndex(0,1)][testWorld.getLocalIndex(3,3)];
        expect(nodeThreeThree).to.equal(0);
        const nodeTwoFour = testWorld.newGrid[testWorld.getChunkIndex(0,1)][testWorld.getLocalIndex(2,4)];
        expect(nodeTwoFour).to.equal(1);
        const nodeThreeFour = testWorld.newGrid[testWorld.getChunkIndex(0,1)][testWorld.getLocalIndex(3,4)];
        expect(nodeThreeFour).to.equal(1);
    });
    it('5. tick chunk 1,1', function() {
        const isAlive = testWorld.tickChunk(testWorld.getChunkIndex(1,1));
        expect(isAlive).to.equal(true);
        const aliveCount = testWorld.newGrid[testWorld.getChunkIndex(1,1)].reduce((sum, node) => sum + node);
        expect(aliveCount).to.equal(2);
        const startingChunk = testWorld.grid[testWorld.getChunkIndex(1,1)];
        const noChange = testWorld.newGrid[testWorld.getChunkIndex(1,1)].reduce((sum, node, index) => sum && (node === startingChunk[index]), true);
        expect(noChange).to.equal(true);
    });
    it('6. tick chunk 2,1', function() {
        const isAlive = testWorld.tickChunk(testWorld.getChunkIndex(2,1));
        expect(isAlive).to.equal(true);
        const aliveCount = testWorld.newGrid[testWorld.getChunkIndex(2,1)].reduce((sum, node) => sum + node);
        expect(aliveCount).to.equal(3);
        const nodeFourSix = testWorld.newGrid[testWorld.getChunkIndex(2,1)][testWorld.getLocalIndex(4,6)];
        expect(nodeFourSix).to.equal(1);
        const nodeThreeSeven = testWorld.newGrid[testWorld.getChunkIndex(2,1)][testWorld.getLocalIndex(3,7)];
        expect(nodeThreeSeven).to.equal(1);
        const nodeFourSeven = testWorld.newGrid[testWorld.getChunkIndex(2,1)][testWorld.getLocalIndex(4,7)];
        expect(nodeFourSeven).to.equal(0);
        const nodeFiveSeven = testWorld.newGrid[testWorld.getChunkIndex(2,1)][testWorld.getLocalIndex(5,7)];
        expect(nodeFiveSeven).to.equal(1);
    });
    it('7. tick chunk 0,2', function() {
        const isAlive = testWorld.tickChunk(testWorld.getChunkIndex(0,2));
        expect(isAlive).to.equal(true);
        const aliveCount = testWorld.newGrid[testWorld.getChunkIndex(0,2)].reduce((sum, node) => sum + node);
        expect(aliveCount).to.equal(5);
        const nodeThreeThree = testWorld.newGrid[testWorld.getChunkIndex(0,2)][testWorld.getLocalIndex(3,3)];
        expect(nodeThreeThree).to.equal(1);
        const nodeFourThree = testWorld.newGrid[testWorld.getChunkIndex(0,2)][testWorld.getLocalIndex(4,3)];
        expect(nodeFourThree).to.equal(1);
        const nodeTwoFour = testWorld.newGrid[testWorld.getChunkIndex(0,2)][testWorld.getLocalIndex(2,4)];
        expect(nodeTwoFour).to.equal(1);
        const nodeThreeFour = testWorld.newGrid[testWorld.getChunkIndex(0,2)][testWorld.getLocalIndex(3,4)];
        expect(nodeThreeFour).to.equal(1);
        const nodeFiveFour = testWorld.newGrid[testWorld.getChunkIndex(0,2)][testWorld.getLocalIndex(5,4)];
        expect(nodeFiveFour).to.equal(0);
        const nodeThreeFive = testWorld.newGrid[testWorld.getChunkIndex(0,2)][testWorld.getLocalIndex(3,5)];
        expect(nodeThreeFive).to.equal(0);
        const nodeFourFive = testWorld.newGrid[testWorld.getChunkIndex(0,2)][testWorld.getLocalIndex(4,5)];
        expect(nodeFourFive).to.equal(1);
    });
    it('8. tick chunk 1,2', function() {
        const isAlive = testWorld.tickChunk(testWorld.getChunkIndex(1,2));
        expect(isAlive).to.equal(true);
        const aliveCount = testWorld.newGrid[testWorld.getChunkIndex(1,2)].reduce((sum, node) => sum + node);
        expect(aliveCount).to.equal(2);
        const nodeOneZero = testWorld.newGrid[testWorld.getChunkIndex(1,2)][testWorld.getLocalIndex(1,0)];
        expect(nodeOneZero).to.equal(1);
        const nodeTwoZero = testWorld.newGrid[testWorld.getChunkIndex(1,2)][testWorld.getLocalIndex(2,0)];
        expect(nodeTwoZero).to.equal(1);
    });
    it('9. tick chunk 2,2', function() {
        const isAlive = testWorld.tickChunk(testWorld.getChunkIndex(2,2));
        expect(isAlive).to.equal(true);
        const aliveCount = testWorld.newGrid[testWorld.getChunkIndex(2,2)].reduce((sum, node) => sum + node);
        expect(aliveCount).to.equal(2);
        const nodeThreeZero = testWorld.newGrid[testWorld.getChunkIndex(2,2)][testWorld.getLocalIndex(3,0)];
        expect(nodeThreeZero).to.equal(1);
        const nodeFourZero = testWorld.newGrid[testWorld.getChunkIndex(2,2)][testWorld.getLocalIndex(4,0)];
        expect(nodeFourZero).to.equal(0);
        const nodeFiveZero = testWorld.newGrid[testWorld.getChunkIndex(2,2)][testWorld.getLocalIndex(5,0)];
        expect(nodeFiveZero).to.equal(1);
    });
});

describe('ensure tick immutable does not mutate original', function() {
    
    let testWorld = new World();
    let untouched = new World();

    beforeEach(function() {
        testWorld = new World();
        testWorld.worldWidth = 3;
        testWorld.worldHeight = 3;

        generate3x3TestGrid(testWorld);

        untouched = new World();
        untouched.worldWidth = 3;
        untouched.worldHeight = 3;

        generate3x3TestGrid(untouched);
    });

    it('tick', function() {
        const newWorld = testWorld.immutableTick();

        expect(testWorld.worldAge).to.equal(untouched.worldAge);
        expect(testWorld.worldWidth).to.equal(untouched.worldWidth);
        expect(testWorld.worldHeight).to.equal(untouched.worldHeight);
        const noChanges = testWorld.grid.reduce(
            (prev, chunk, chunkIndex) => 
                prev && 
                chunk.reduce(
                    (cPrev, node, index) => 
                        cPrev && untouched.grid[chunkIndex] !== undefined && node === untouched.grid[chunkIndex][index], 
                    true
                ), 
            true
        );
        expect(noChanges).to.equal(true);
        const newWorldHasNoChanges = testWorld.grid.reduce(
            (prev, chunk, chunkIndex) => 
                prev && 
                chunk.reduce(
                    (cPrev, node, index) => 
                        cPrev && newWorld.grid[chunkIndex] !== undefined && node === newWorld.grid[chunkIndex][index], 
                    true
                ), 
            true
        );
        expect(newWorldHasNoChanges).to.equal(false);
    });
})

function generate3x3TestGrid(testWorld)
{
    /*----------- FROM --------
        *   0 1 2 3 4 5 6 7*0 1 2 3 4 5 6 7*0 1 2 3 4 5 6 7
        * 0 . . . . . . . . . . . . . . . . . . . . . . . . 
        * 1 . . . . . . . . . . . . . . . . . . . . . . . . 
        * 2 . . . O O . . . . . O O O . . . . . . O O . . . 
        * 3 . . . . . . . . . . . . . . . . . . . O O . . . 
        * 4 . . . . . . . . . . . . . . . . . . . . . . . . 
        * 5 . . . . . . . . . . . . . . . . . . . . . . . . 
        * 6 . . . . . . . . . . . . . . . . . . . . . . . . 
        * 7 . . . . . . . . . . . . . . . . . . . . . . . . 
        * * . . . . . . . . . . . . . . . . . . . . . . . . *
        * 1 . . . . . . . . . . . . . . . . . . . . . . . . 
        * 2 . . O . . . . . . . . . . . . . . . . . . . . . 
        * 3 . . O O . . . . . . . . . . . . . . . . . . . . 
        * 4 . . O O . . . . . . . . . . . . . . . . . . . . 
        * 5 . . . . . . . . . . . . . . . . . . . . . . . . 
        * 6 . . . . . . . . . . . . . . . . . . . . . . . . 
        * 7 . . . . . . . . . O O . . . . . . . . O O O . .
        * * . . . . . . . . . O . . . . . . . . . O O . . . *
        * 1 . . . . . . . . . . . . . . . . . . . . . . . . 
        * 2 . . . . . . . . . . . . . . . . . . . . . . . . 
        * 3 . . . O O . . . . . . . . . . . . . . . . . . . 
        * 4 . . . O . O . . . . . . . . . . . . . . . . . . 
        * 5 . . . O . . . . . . . . . . . . . . . . . . . . 
        * 6 . . . . . . . . . . . . . . . . . . . . . . . . 
        * 7 . . . . . . . . . . . . . . . . . . . . . . . . 
        *                  *               *               
        */
       
    let chunkZeroZero = testWorld.emptyChunk.slice();
    chunkZeroZero[testWorld.getLocalIndex(3,2)] = 1;
    chunkZeroZero[testWorld.getLocalIndex(4,2)] = 1;
    testWorld.grid[testWorld.getChunkIndex(0,0)] = chunkZeroZero; 
    let chunkOneZero = testWorld.emptyChunk.slice();
    chunkOneZero[testWorld.getLocalIndex(2,2)] = 1;
    chunkOneZero[testWorld.getLocalIndex(3,2)] = 1;
    chunkOneZero[testWorld.getLocalIndex(4,2)] = 1;
    testWorld.grid[testWorld.getChunkIndex(1,0)] = chunkOneZero; 
    let chunkTwoZero = testWorld.emptyChunk.slice();
    chunkTwoZero[testWorld.getLocalIndex(3,2)] = 1;
    chunkTwoZero[testWorld.getLocalIndex(3,3)] = 1;
    chunkTwoZero[testWorld.getLocalIndex(4,2)] = 1;
    chunkTwoZero[testWorld.getLocalIndex(4,3)] = 1;
    testWorld.grid[testWorld.getChunkIndex(2,0)] = chunkTwoZero; 
    let chunkZeroOne = testWorld.emptyChunk.slice();
    chunkZeroOne[testWorld.getLocalIndex(2,2)] = 1;
    chunkZeroOne[testWorld.getLocalIndex(2,3)] = 1;
    chunkZeroOne[testWorld.getLocalIndex(2,4)] = 1;
    chunkZeroOne[testWorld.getLocalIndex(3,3)] = 1;
    chunkZeroOne[testWorld.getLocalIndex(3,4)] = 1;
    testWorld.grid[testWorld.getChunkIndex(0,1)] = chunkZeroOne; 
    let chunkOneOne = testWorld.emptyChunk.slice();
    chunkOneOne[testWorld.getLocalIndex(1,7)] = 1;
    chunkOneOne[testWorld.getLocalIndex(2,7)] = 1;
    testWorld.grid[testWorld.getChunkIndex(1,1)] = chunkOneOne; 
    let chunkTwoOne = testWorld.emptyChunk.slice();
    chunkTwoOne[testWorld.getLocalIndex(3,7)] = 1;
    chunkTwoOne[testWorld.getLocalIndex(4,7)] = 1;
    chunkTwoOne[testWorld.getLocalIndex(5,7)] = 1;
    testWorld.grid[testWorld.getChunkIndex(2,1)] = chunkTwoOne; 
    let chunkZeroTwo = testWorld.emptyChunk.slice();
    chunkZeroTwo[testWorld.getLocalIndex(3,3)] = 1;
    chunkZeroTwo[testWorld.getLocalIndex(4,3)] = 1;
    chunkZeroTwo[testWorld.getLocalIndex(3,4)] = 1;
    chunkZeroTwo[testWorld.getLocalIndex(5,4)] = 1;
    chunkZeroTwo[testWorld.getLocalIndex(3,5)] = 1;
    testWorld.grid[testWorld.getChunkIndex(0,2)] = chunkZeroTwo; 
    let chunkOneTwo = testWorld.emptyChunk.slice();
    chunkOneTwo[testWorld.getLocalIndex(1,0)] = 1;
    testWorld.grid[testWorld.getChunkIndex(1,2)] = chunkOneTwo;
    let chunkTwoTwo = testWorld.emptyChunk.slice();
    chunkTwoTwo[testWorld.getLocalIndex(3,0)] = 1;
    chunkTwoTwo[testWorld.getLocalIndex(4,0)] = 1;
    testWorld.grid[testWorld.getChunkIndex(2,2)] = chunkTwoTwo;
}