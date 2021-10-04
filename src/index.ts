import { Madoi, ShareClass, Share, GetState, SetState } from "./madoi/madoi";

window.addEventListener("load", function () {
    const m = new Madoi(`wss://fungo.kcg.edu/madoi-20211003/rooms/whiteboard-o3id4alskdjj`);
    const wb = new WhiteBoard("#whiteboard");
    m.register(wb);
});

interface Drawing{
    prevX: number, prevY: number,
    x: number, y: number,
    size: number, color: string
}

@ShareClass({snapshot: true})
export class WhiteBoard {
    private boardElm: HTMLElement;
    private colorInput: HTMLInputElement;
    private sizeInput: HTMLInputElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private drawing: boolean = false;
    private button: number = 0;
    private prevPos = { x: 0, y: 0 };
    private loading: boolean = false;
    private pendingDrawings = new Array<Drawing>();

    constructor(boardSelector: string) {
        this.boardElm = document.querySelector(boardSelector)!;
        this.colorInput = this.boardElm.querySelector("input[name='foreground-color']")!;
        this.sizeInput = this.boardElm.querySelector("input[name='pen-size']") as HTMLInputElement;
        this.canvas = this.boardElm.querySelector("canvas")!;
        this.ctx = this.canvas.getContext("2d")!;

        this.canvas.addEventListener("mousedown", e => {
            this.drawing = true;
            this.button = e.button;
            this.prevPos.x = e.offsetX;
            this.prevPos.y = e.offsetY;
            this.ctx.lineCap = 'round';
            e.preventDefault();
        });
        this.canvas.addEventListener("mouseup", () => {
            this.drawing = false;
        });
        this.canvas.addEventListener("mousemove", e => {
            if (!this.drawing) return;
            let c = "#FFFFFF";
            let size = parseInt(this.sizeInput.value);
            if (this.button === 0) {
                c = this.colorInput.value;
            } else{
                size += 4;
            }
            this.draw(this.prevPos.x, this.prevPos.y, e.offsetX, e.offsetY, size, c);
            this.prevPos = {x: e.offsetX, y: e.offsetY};
        });
        this.canvas.oncontextmenu = () => false;
    }

    @Share({maxLog: 100})
    draw(prevX: number, prevY: number, x: number, y: number, size: number, color: string) {
        if(this.loading){
            // 画像がロード中の場合は描画を後回しにする
            this.pendingDrawings.push({
                prevX: prevX, prevY: prevY,
                x: x, y: y, size: size, color: color
            });
        } else{
            this.ctx.beginPath();
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = size;
            this.ctx.moveTo(prevX, prevY);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
    }

    @GetState({maxInterval: 10000, maxUpdates: 100})
    getState(): string {
        return this.canvas.toDataURL("image/png");
    }

    @SetState()
    setState(state: string) {
        this.loading = true;
        const img = new Image();
        img.onload = () => {
            this.ctx.drawImage(img, 0, 0);
            for(const p of this.pendingDrawings){
                this.ctx.beginPath();
                this.ctx.strokeStyle = p.color;
                this.ctx.lineWidth = p.size;
                this.ctx.moveTo(p.prevX, p.prevY);
                this.ctx.lineTo(p.x, p.y);
                this.ctx.stroke();
            }
            this.pendingDrawings = new Array();
            this.loading = false;
        };
        img.src = state;
    }
}
