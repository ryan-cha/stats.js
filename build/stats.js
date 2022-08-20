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
	 * @returns
	 */
	var Stats = function (showTotalAverage) {
	  var mode = 0;

	  var container = document.createElement('div');
	  container.style.cssText =
	    'position:absolute;top:0;left:0;cursor:pointer;opacity:0.9;z-index:1000';
	  container.addEventListener(
	    'click',
	    function (event) {
	      event.preventDefault();
	      showPanel(++mode % container.children.length);
	    },
	    false
	  );

	  //

	  function addPanel(panel) {
	    container.appendChild(panel.dom);
	    return panel;
	  }

	  function showPanel(id) {
	    for (var i = 0; i < container.children.length; i++) {
	      container.children[i].style.display = i === id ? 'block' : 'none';
	    }

	    mode = id;
	  }

	  var beginTime = (performance || Date).now(),
	    prevTime = beginTime,
	    frames = 0;

	  var fpsPanel = addPanel(
	    new Stats.Panel(showTotalAverage ?? false, 'FPS', '#0ff', '#002')
	  );
	  var msPanel = addPanel(
	    new Stats.Panel(showTotalAverage ?? false, 'ms', '#0f0', '#020', '#ff0000')
	  );
	  // if (self.performance && self.performance.memory) {
	  //   var memPanel = addPanel(new Stats.Panel('MB', '#f08', '#201'));
	  // }

	  showPanel(0);

	  return {
	    REVISION: 16,

	    dom: container,

	    addPanel: addPanel,
	    showPanel: showPanel,

	    begin: function () {
	      beginTime = (performance || Date).now();
	    },

	    end: function () {
	      frames++;

	      const time = (performance || Date).now();
	      const elapsed = time - beginTime;

	      msPanel.update(elapsed, 200);

	      if (time >= prevTime + 1000) {
	        fpsPanel.update((frames * 1000) / (time - prevTime), 100);

	        prevTime = time;
	        frames = 0;
	      }

	      return time;
	    },

	    update: function () {
	      beginTime = this.end();
	    },

	    // Backwards Compatibility

	    domElement: container,
	    setMode: showPanel,
	  };
	};

	Stats.Panel = function (showTotalAverage, name, fg, bg, avgLineColor) {
	  var min = Infinity,
	    max = 0,
	    round = Math.round;
	  const PR = round(window.devicePixelRatio || 1);

	  /**
	   * Contains the accumulated sum and the number of items
	   * [sum, count]
	   */
	  const allHistory = [0, 0];
	  const bucket = [];

	  const W = 100;
	  const H = 60;
	  const offset = 3;
	  var WIDTH = W * PR,
	    HEIGHT = H * PR,
	    TEXT_X = offset * PR,
	    TEXT_Y = offset * PR,
	    GRAPH_X = offset * PR,
	    GRAPH_Y = offset * 5 * PR,
	    GRAPH_WIDTH = (W - 2 * offset) * PR,
	    GRAPH_HEIGHT = (H - offset * 6) * PR;
	  const BUCKET_COUNT = W - 2 * offset;
	  const showAverage =
	    avgLineColor !== undefined && typeof avgLineColor === 'string';

	  var canvas = document.createElement('canvas');
	  canvas.width = WIDTH;
	  canvas.height = HEIGHT;
	  canvas.style.cssText = `width:${W}px;height:${H}px`;

	  var context = canvas.getContext('2d');
	  context.font = 'bold ' + 10 * PR + 'px Helvetica,Arial,sans-serif';
	  context.textBaseline = 'top';

	  context.fillStyle = bg;
	  context.fillRect(0, 0, WIDTH, HEIGHT);

	  context.fillStyle = fg;
	  context.fillText(name, TEXT_X, TEXT_Y);
	  context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

	  context.fillStyle = bg;
	  context.globalAlpha = 0.9;
	  context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

	  return {
	    dom: canvas,

	    updateAverage: function (average, allAverage) {
	      if (!showAverage || average === 0) {
	        return;
	      }
	      const y = round((1 - average / max) * GRAPH_HEIGHT);
	      context.save();
	      context.beginPath();
	      context.moveTo(GRAPH_X, GRAPH_Y + y);
	      context.lineTo(GRAPH_X + GRAPH_WIDTH, GRAPH_Y + y);
	      context.lineWidth = 2;
	      context.strokeStyle = avgLineColor;
	      context.stroke();

	      const text = `A:${
        allAverage ? `${allAverage.toFixed()} | ` : ''
      }${average.toFixed()}ms`;
	      const textX = GRAPH_X + GRAPH_WIDTH - text.length * 6.1 * PR;
	      const textY = GRAPH_Y + (GRAPH_HEIGHT - 10 * PR);

	      context.fillStyle = 'rgba(255,255,255, 0.75)';
	      context.fillRect(
	        textX - 3 * PR,
	        textY - 3 * PR,
	        WIDTH - (textX - 3 * PR) - offset * PR,
	        HEIGHT - textY
	      );

	      context.fillStyle = '#ff0000';
	      context.fillText(text, textX, textY);

	      context.restore();
	    },

	    update: function (value, maxValue) {
	      min = Math.min(min, value);
	      max = Math.max(max, value);

	      if (bucket.length >= BUCKET_COUNT) {
	        bucket.shift();
	      }
	      bucket.push(value);
	      allHistory[0] += value;
	      allHistory[1] += 1;

	      context.fillStyle = bg;
	      context.globalAlpha = 1;
	      context.fillRect(0, 0, WIDTH, GRAPH_Y);

	      context.fillStyle = fg;
	      context.fillText(
	        round(value) + ' ' + name + ' (' + round(min) + '-' + round(max) + ')',
	        TEXT_X,
	        TEXT_Y
	      );

	      // clear and fill background
	      context.fillStyle = fg;
	      context.globalAlpha = 1;
	      context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);
	      context.fillStyle = bg;
	      context.globalAlpha = 0.9;
	      context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

	      //
	      context.fillStyle = fg;
	      context.globalAlpha = 1;
	      let sum = 0;
	      bucket.forEach((v, idx) => {
	        sum += v;
	        const valueHeight = 1 - v / max;
	        const offsetY = round(GRAPH_HEIGHT * valueHeight);
	        context.fillRect(
	          GRAPH_X + idx * PR,
	          GRAPH_Y + offsetY,
	          PR,
	          GRAPH_HEIGHT - offsetY
	        );
	      });

	      // average line
	      const average = sum / bucket.length;
	      this.updateAverage(
	        average,
	        showTotalAverage ? allHistory[0] / allHistory[1] : undefined
	      );
	    },
	  };
	};

	return Stats;

}));
