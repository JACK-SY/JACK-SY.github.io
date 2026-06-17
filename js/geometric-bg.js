/**
 * Dynamic Geometric Background Animation
 * 淡蓝色粒子连线 + 鼠标跟随交互
 */
(function () {
  "use strict";

  var config = {
    z_index: -1,
    opacity: 0.6,
    color: "100,180,255",        // 淡蓝色线条 RGB
    pointColor: "100,180,255",   // 淡蓝色粒子 RGB
    count: 80,
    distance: 120,
    mouseDistance: 160,          // 鼠标连线最大距离
    radius: 2,
    lineWidth: 0.8,
    speed: 0.3
  };

  var canvas = document.createElement("canvas");
  canvas.style.cssText =
    "display:block;position:fixed;margin:0;padding:0;border:0;outline:0;left:0;top:0;width:100%;height:100%;z-index:" + config.z_index;
  document.body.appendChild(canvas);

  var ctx = canvas.getContext("2d");
  var points = [];
  var width, height;
  var mouse = { x: null, y: null };

  // 鼠标跟踪
  document.addEventListener("mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  document.addEventListener("mouseleave", function () {
    mouse.x = null;
    mouse.y = null;
  });

  // 触摸跟踪
  document.addEventListener("touchmove", function (e) {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  });
  document.addEventListener("touchend", function () {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function initPoints() {
    points = [];
    for (var i = 0; i < config.count; i++) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * config.speed * 2,
        vy: (Math.random() - 0.5) * config.speed * 2
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    var lineColor = config.color;
    var dotColor = config.pointColor;

    // 粒子间连线
    for (var i = 0; i < points.length; i++) {
      for (var j = i + 1; j < points.length; j++) {
        var dx = points[i].x - points[j].x;
        var dy = points[i].y - points[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.distance) {
          var alpha = (1 - dist / config.distance) * config.opacity;
          ctx.strokeStyle = "rgba(" + lineColor + "," + alpha + ")";
          ctx.lineWidth = config.lineWidth;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }

    // 鼠标与粒子连线
    if (mouse.x !== null && mouse.y !== null) {
      for (var m = 0; m < points.length; m++) {
        var mdx = points[m].x - mouse.x;
        var mdy = points[m].y - mouse.y;
        var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < config.mouseDistance) {
          var malpha = (1 - mdist / config.mouseDistance) * config.opacity * 1.5;
          ctx.strokeStyle = "rgba(" + lineColor + "," + malpha + ")";
          ctx.lineWidth = config.lineWidth * 1.5;
          ctx.beginPath();
          ctx.moveTo(points[m].x, points[m].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
      // 鼠标点
      ctx.fillStyle = "rgba(" + dotColor + "," + config.opacity * 1.5 + ")";
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, config.radius * 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    // 绘制 & 移动粒子
    for (var k = 0; k < points.length; k++) {
      var p = points[k];

      // 鼠标附近粒子轻微被吸引
      if (mouse.x !== null && mouse.y !== null) {
        var adx = mouse.x - p.x;
        var ady = mouse.y - p.y;
        var adist = Math.sqrt(adx * adx + ady * ady);
        if (adist < config.mouseDistance && adist > 0) {
          var force = (config.mouseDistance - adist) / config.mouseDistance * 0.02;
          p.vx += adx / adist * force;
          p.vy += ady / adist * force;
          // 限速
          var maxV = config.speed * 1.5;
          if (p.vx > maxV) p.vx = maxV;
          if (p.vx < -maxV) p.vx = -maxV;
          if (p.vy > maxV) p.vy = maxV;
          if (p.vy < -maxV) p.vy = -maxV;
        }
      }

      ctx.fillStyle = "rgba(" + dotColor + "," + config.opacity + ")";
      ctx.beginPath();
      ctx.arc(p.x, p.y, config.radius, 0, 2 * Math.PI);
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx = -p.vx;
      if (p.y < 0 || p.y > height) p.vy = -p.vy;
    }

    requestAnimationFrame(draw);
  }

  resize();
  initPoints();
  draw();

  window.addEventListener("resize", function () {
    resize();
    initPoints();
  });
})();
