/**
 * @author mrdoob / http://mrdoob.com/
 * @contributor Ryan Cha
 */
/**
 * @param showTotalAverage Whether to show the average of all time (besides the recent average)
 */
declare class Stats {
    private mode;
    private containerDiv;
    private beginTime;
    private prevTime;
    private frames;
    private fpsPanel;
    private msPanel;
    private memPanel?;
    constructor(showEverage: boolean, showTotalAverage?: boolean);
    addPanel(panel: Panel): Panel;
    showPanel(id: number): void;
    begin(): void;
    end(): number;
    update(): void;
}
declare class Panel {
    private canvas;
    private context;
    private min;
    private max;
    private PR;
    private color;
    /**
     * Contains the accumulated sum and the number of items
     * [sum, count]
     */
    private allHistory;
    private bucket;
    private W;
    private H;
    private offset;
    private WIDTH;
    private HEIGHT;
    private TEXT_X;
    private TEXT_Y;
    private GRAPH_X;
    private GRAPH_Y;
    private GRAPH_WIDTH;
    private GRAPH_HEIGHT;
    private BUCKET_COUNT;
    private name;
    private showAverage;
    private showTotalAverage;
    constructor(showTotalAverage: boolean, name: string, fg: string, bg: string, avgLineColor?: string);
    get dom(): HTMLCanvasElement;
    update(value: number, maxValue: number): void;
    updateAverage(average: number, allAverage?: number): void;
}
export { Stats as default };
