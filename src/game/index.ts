import Engine from "../engine/index.js";
import Manager from "../engine/manager.js";
import WorldLocationData from "../engine/components/worldLocationData.js";
import DrawableData from "../engine/components/drawableData.js";
import DisplaySystem from "../engine/systems/display/index.js";
import Tile, {TileSystem} from "./objects/tile.js";
import Bush from "./objects/bush.js";
import Logger from "../engine/utils/logger.js";

const log = new Logger("game");

class Game {
    private engine: Engine;
    private manager: Manager;

    private tiles: Tile[][] = [];
    private bushes: Bush[][] = [];

    constructor() {
        log.new();
        this.engine = new Engine();
        this.manager = this.engine.manager;

        const displaySystem = this.manager.getSystem("display") as DisplaySystem;
        displaySystem.disableSmoothing();

        this.createWorld();
        //this.debugPerformance();
    }

    private createWorld(): void {
        this.manager.registerComponent("tile");
        this.manager.registerSystem("tile", new TileSystem());

        const size = 16;
        const tileSizePx = 50;

        for (let x = 0; x < size; x++) {
            this.tiles[x] = [];
            this.bushes[x] = [];
            for (let y = 0; y < size; y++) {
                this.tiles[x][y] = new Tile(this.manager, x, y, tileSizePx);
                if (Math.random() < 0.1) this.bushes[x][y] = new Bush(this.manager, x, y, tileSizePx);
            }
        }
    }

    private debugPerformance(): void {
        const n = 1000;
        const ds = this.manager.getSystem("display") as DisplaySystem;
        const {width, height} = ds.getSize();

        log.info(`creating ${n}`);
        for (let i = 0; i < n; i++) {
            const entity = this.manager.createEntity();
            this.manager.setComponent(entity, "worldLocation", {
                x: Math.random() * width,
                y: Math.random() * height,
            } as WorldLocationData);
            if (Math.random() > 0.95) {
                this.manager.setComponent(entity, "drawable", {
                    type: "TEXT",
                    content: "Text",
                    color: `#${Math.round(Math.random() * 9)}${Math.round(Math.random() * 9)}${Math.round(Math.random() * 9)}`,
                } as DrawableData);
            } else {
                const stroked = Math.random() > 0.5;
                this.manager.setComponent(entity, "drawable", {
                    type: "RECT",
                    width: Math.random() * 15,
                    height: Math.random() * 15,
                    color: stroked ? undefined : `#${Math.round(Math.random() * 9)}${Math.round(Math.random() * 9)}${Math.round(Math.random() * 9)}`,
                    strokeColor: stroked ? `#${Math.round(Math.random() * 9)}${Math.round(Math.random() * 9)}${Math.round(Math.random() * 9)}` : undefined,
                    strokeWidth: Math.random() * 3,
                } as DrawableData);
            }
        }
        log.info(`${n} created`);
    }
}

const start = () => {
    console.time("init");
    const game = new Game();
    console.timeEnd("init");
}

start();
