// Basit kalp animasyonu
const canvas = document.getElementById("hearts");
const ctx = canvas.getContext("2d");
let W,H,hearts;
function resize(){W=canvas.width=window.innerWidth;H=canvas.height=window.innerHeight}
window.addEventListener("resize",resize);
function spawnHeart(){const x=Math.random()*W,size=6+Math.random()*16,speed=0.3+Math.random()*0.7,alpha=0.2+Math.random()*0.6;return {x,y:H+size,size,speed,alpha}}
function drawHeart(x,y,size,alpha){ctx.save();ctx.translate(x,y);ctx.scale(size/20,size/20);ctx.globalAlpha=alpha;ctx.fillStyle="#ff3b6b";ctx.beginPath();ctx.moveTo(0,6);ctx.bezierCurveTo(0,-6,20,-6,20,6);ctx.bezierCurveTo(20,18,10,22,0,30);ctx.bezierCurveTo(-10,22,-20,18,-20,6);ctx.bezierCurveTo(-20,-6,0,-6,0,6);ctx.closePath();ctx.fill();ctx.restore()}
function loop(){ctx.clearRect(0,0,W,H);hearts.forEach(h=>{h.y-=h.speed;h.alpha*=0.998;drawHeart(h.x,h.y,h.size,h.alpha)});hearts=hearts.filter(h=>h.y>-40&&h.alpha>0.02);while(hearts.length<40){hearts.push(spawnHeart())}requestAnimationFrame(loop)}
function init(){resize();hearts=Array.from({length:40},spawnHeart);loop()}
init();
