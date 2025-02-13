(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Stats = factory());
})(this, (function () { 'use strict';

	/**
	 * @author mrdoob / http://mrdoob.com/
	 * @contributor Ryan Cha
	 */
	/**
	 * @param showTotalAverage Whether to show the average of all time (besides the recent average)
	 */
	class Stats {
	    constructor(showEverage, showTotalAverage = false) {
	        this.mode = 0;
	        const container = document.createElement('div');
	        container.style.cssText =
	            'position:absolute;top:0;left:0;cursor:pointer;opacity:0.9;z-index:1000';
	        container.addEventListener('click', (event) => {
	            event.preventDefault();
	            this.showPanel(++this.mode % container.children.length);
	        }, false);
	        this.containerDiv = container;
	        this.beginTime = (performance || Date).now();
	        this.prevTime = this.beginTime;
	        this.frames = 0;
	        this.fpsPanel = this.addPanel(new Panel(showTotalAverage !== null && showTotalAverage !== void 0 ? showTotalAverage : false, 'FPS', '#0ff', '#002'));
	        this.msPanel = this.addPanel(new Panel(showTotalAverage !== null && showTotalAverage !== void 0 ? showTotalAverage : false, 'ms', '#0f0', '#020', showEverage ? '#ff0000' : undefined));
	        this.memPanel = undefined;
	        // TODO
	        // if (self.performance && self.performance.memory) {
	        //   let memPanel = addPanel(new Stats.Panel('MB', '#f08', '#201'));
	        // }
	        this.showPanel(0);
	    }
	    addPanel(panel) {
	        this.containerDiv.appendChild(panel.dom);
	        return panel;
	    }
	    showPanel(id) {
	        for (let i = 0; i < this.containerDiv.children.length; i++) {
	            this.containerDiv.children[i].style.display =
	                i === id ? 'block' : 'none';
	        }
	        this.mode = id;
	    }
	    begin() {
	        this.beginTime = (performance || Date).now();
	    }
	    end() {
	        this.frames += 1;
	        const time = (performance || Date).now();
	        const elapsed = time - this.beginTime;
	        this.msPanel.update(elapsed, 200);
	        if (time >= this.prevTime + 1000) {
	            this.fpsPanel.update((this.frames * 1000) / (time - this.prevTime), 100);
	            this.prevTime = time;
	            this.frames = 0;
	            if (this.memPanel) {
	                const memory = performance.memory;
	                this.memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);
	            }
	        }
	        return time;
	    }
	    update() {
	        this.beginTime = this.end();
	    }
	    get dom() {
	        return this.containerDiv;
	    }
	}
	class Panel {
	    constructor(showTotalAverage, name, fg, bg, avgLineColor) {
	        this.min = Infinity;
	        this.max = 0;
	        this.PR = Math.round(window.devicePixelRatio || 1);
	        /**
	         * Contains the accumulated sum and the number of items
	         * [sum, count]
	         */
	        this.allHistory = [0, 0];
	        this.bucket = [];
	        this.W = 100;
	        this.H = 60;
	        this.offset = 3;
	        this.WIDTH = this.W * this.PR;
	        this.HEIGHT = this.H * this.PR;
	        this.TEXT_X = this.offset * this.PR;
	        this.TEXT_Y = this.offset * this.PR;
	        this.GRAPH_X = this.offset * this.PR;
	        this.GRAPH_Y = this.offset * 5 * this.PR;
	        this.GRAPH_WIDTH = (this.W - 2 * this.offset) * this.PR;
	        this.GRAPH_HEIGHT = (this.H - this.offset * 6) * this.PR;
	        this.BUCKET_COUNT = this.W - 2 * this.offset;
	        this.color = {
	            fg,
	            bg,
	            avgLineColor,
	        };
	        this.name = name;
	        this.showTotalAverage = showTotalAverage;
	        this.showAverage =
	            avgLineColor !== undefined && typeof avgLineColor === 'string';
	        const canvas = document.createElement('canvas');
	        canvas.width = this.WIDTH;
	        canvas.height = this.HEIGHT;
	        canvas.style.cssText = `width:${this.W}px;height:${this.H}px`;
	        this.canvas = canvas;
	        const context = canvas.getContext('2d');
	        if (!context) {
	            throw Error('Failed to get context');
	        }
	        context.font = 'bold ' + 10 * this.PR + 'px Helvetica,Arial,sans-serif';
	        context.textBaseline = 'top';
	        context.fillStyle = bg;
	        context.fillRect(0, 0, this.WIDTH, this.HEIGHT);
	        context.fillStyle = fg;
	        context.fillText(name, this.TEXT_X, this.TEXT_Y);
	        context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT);
	        context.fillStyle = bg;
	        context.globalAlpha = 0.9;
	        context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT);
	        this.context = context;
	    }
	    get dom() {
	        return this.canvas;
	    }
	    update(value, maxValue) {
	        const context = this.context;
	        this.min = Math.min(this.min, value);
	        this.max = Math.max(this.max, value);
	        if (this.bucket.length >= this.BUCKET_COUNT) {
	            this.bucket.shift();
	        }
	        this.bucket.push(value);
	        this.allHistory[0] += value;
	        this.allHistory[1] += 1;
	        context.fillStyle = this.color.bg;
	        context.globalAlpha = 1;
	        context.fillRect(0, 0, this.WIDTH, this.GRAPH_Y);
	        context.fillStyle = this.color.fg;
	        context.fillText(`${Math.round(value)} ${this.name} (${Math.round(this.min)}-${Math.round(this.max)})`, this.TEXT_X, this.TEXT_Y);
	        // clear and fill background
	        context.fillStyle = this.color.fg;
	        context.globalAlpha = 1;
	        context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT);
	        context.fillStyle = this.color.bg;
	        context.globalAlpha = 0.9;
	        context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT);
	        //
	        context.fillStyle = this.color.fg;
	        context.globalAlpha = 1;
	        let sum = 0;
	        this.bucket.forEach((v, idx) => {
	            sum += v;
	            const valueHeight = 1 - v / this.max;
	            const offsetY = Math.round(this.GRAPH_HEIGHT * valueHeight);
	            context.fillRect(this.GRAPH_X + idx * this.PR, this.GRAPH_Y + offsetY, this.PR, this.GRAPH_HEIGHT - offsetY);
	        });
	        // average line
	        if (this.showAverage) {
	            const average = sum / this.bucket.length;
	            this.updateAverage(average, this.showTotalAverage
	                ? this.allHistory[0] / this.allHistory[1]
	                : undefined);
	        }
	    }
	    updateAverage(average, allAverage) {
	        if (average === 0 || !this.color.avgLineColor) {
	            return;
	        }
	        const context = this.context;
	        const y = Math.round((1 - average / this.max) * this.GRAPH_HEIGHT);
	        context.save();
	        context.beginPath();
	        context.moveTo(this.GRAPH_X, this.GRAPH_Y + y);
	        context.lineTo(this.GRAPH_X + this.GRAPH_WIDTH, this.GRAPH_Y + y);
	        context.lineWidth = 2;
	        context.strokeStyle = this.color.avgLineColor;
	        context.stroke();
	        const text = `A:${allAverage ? `${allAverage.toFixed()} | ` : ''}${average.toFixed()}ms`;
	        const textX = this.GRAPH_X + this.GRAPH_WIDTH - text.length * 6.1 * this.PR;
	        const textY = this.GRAPH_Y + (this.GRAPH_HEIGHT - 10 * this.PR);
	        context.fillStyle = 'rgba(255,255,255, 0.75)';
	        context.fillRect(textX - 3 * this.PR, textY - 3 * this.PR, this.WIDTH - (textX - 3 * this.PR) - this.offset * this.PR, this.HEIGHT - textY);
	        context.fillStyle = '#ff0000';
	        context.fillText(text, textX, textY);
	        context.restore();
	    }
	}

	return Stats;

}));
