import React from 'react';
const World = require('../../lifegame/world');
const downright = require('../../lifegame/demosjs/downright');
const gun = require('../../lifegame/demosjs/gun');

class WorldRender extends React.Component {
    constructor(props) {
        super(props);

        let world = World.fromJsonObject(downright);

        this.state = {
            world: world,
            timerRun: false,
            timerId: null,
        };
    }

    render() {
        const world = this.state.world;
        const lines = new Array();
        for(let chunkZ = 0; chunkZ < world.worldHeight; chunkZ++) {
            for(let localZ = 0; localZ < 8; localZ++)
            {
                lines.push(this.renderLine(
                        world,
                        chunkZ,
                        localZ)
                );
            }
        }

        return (<>
            <button onClick={() => this.loadDownRight()}>Load down right glider</button>
            <button onClick={() => this.loadGliderGun()}>Load glider gun</button>
            <button onClick={() => this.handleTick()}>Tick world</button>
            <button onClick={() => this.toggleTimedTick()}>{this.state.timerRun ? 'Stop ' : 'Start '} auto-tick</button>
            <div classname="counter">Generations: {this.state.world.worldAge}</div>
            <div className="world">{lines}</div>
            </>);
    }

    loadDownRight() { this.loadWorld(downright); }
    loadGliderGun() { this.loadWorld(gun); }

    loadWorld(data) {
        this.setState({...this.state, world: World.fromJsonObject(data)});
    }

    renderLine(world, chunkZ, localZ) {
        const nodes = new Array();

        for(let chunkX = 0; chunkX < world.worldWidth; chunkX++) {
            const index = world.getChunkIndex(chunkX, chunkZ);
            const chunk = world.grid[index] ?? world.emptyChunk;
            if(chunk === undefined) {
                console.log('grid length '+ world.grid.length + ' world width: ' + world.worldWidth + ' index:' + index + '\r\n' + world.grid);
            }
            for(let localX = 0; localX < 8; localX++) {
                const localIndex = world.getLocalIndex(localX, localZ);
                const value = chunk[localIndex];
                nodes.push(this.renderNode(value, chunkX * 8 + localX, chunkZ * 8 + localZ));
            }
        }
        return (
            <div className="world_line" key={chunkZ*8+localZ}> 
                {nodes}
            </div>
        );
    }

    renderNode(value, x, z) {
        let glyph = '.';
        let nodeclass = 'dead';
        if(value === 1) {
            glyph = '█';
            nodeclass = 'live';
        }

        return <span className={`${nodeclass} world_node`} key={`${x},${z}`}>{glyph}</span>
    }

    toggleTimedTick() {
        const newState = !this.state.timerRun;
        if(newState) {
            const timerId = setInterval(() => this.handleTick(true), 500);
            this.setState({...this.state, timerRun: newState, timerId: timerId});
        }
        else {
            clearInterval(this.state.timerId);
            this.setState({...this.state, timerRun: newState, timerId: null});
        }
    }

    handleTick(auto) {
        if(!auto && this.state.timerRun) {return;} //tick button doesn't do anything when ticking automatically. todo: get rid of when ticking automatically
        let newWorld = this.state.world.immutableTick();
        this.setState({...this.state, world: newWorld});
    }
}

class WorldLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            world: props.world,
            chunkZ: props.chunkZ,
            localZ: props.localZ,
        };
    }

    render() {
        const world = this.state.world;
        const chunkZ = this.state.chunkZ;
        const localZ = this.state.localZ;
        const nodes = new Array();

        for(let chunkX = 0; chunkX < world.worldWidth; chunkX++) {
            const index = world.getChunkIndex(chunkX, chunkZ);
            const chunk = world.grid[index] ?? world.emptyChunk;
            if(chunk === undefined) {
                console.log('grid length '+ world.grid.length + ' world width: ' + world.worldWidth + ' index:' + index + '\r\n' + world.grid);
            }
            for(let localX = 0; localX < 8; localX++) {
                const localIndex = world.getLocalIndex(localX, localZ);
                const value = chunk[localIndex];
                nodes.push(this.renderNode(value, chunkX * 8 + localX, chunkZ * 8 + localZ));
            }
        }
        return (
            <div className="world_line"> 
                {nodes}
            </div>
        );
    }

    renderNode(value, x, z) {
        let glyph = '.';
        let nodeclass = 'dead';
        if(value === 1) {
            glyph = '█';
            nodeclass = 'live';
        }

        return <span className={`${nodeclass} world_node`} key={`${x},${z}`}>{glyph}</span>
    }
}

export default WorldRender;