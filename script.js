// Basit kişiselleştirme ayarları (localStorage)
const defaultConfig = {
  herName: "Sevgilim",
  yourName: "Onur",
  whatsapp: "905xxxxxxxxx", // ülke kodu ile
  spotify: "https://open.spotify.com/playlist/37i9dQZF1DX6mMeq1VVekF",
  message: "Seni kırdığım için üzgünüm. Hazır olduğunda konuşalım, söz veriyorum seni önceleyen bir tutumla yaklaşacağım."
};

const storeKey = "affetBeniConfig_v1";

function getConfig(){
  const s = localStorage.getItem(storeKey);
  try { return s ? {...defaultConfig, ...JSON.parse(s)} : {...defaultConfig}; }
  catch { return {...defaultConfig}; }
}

function saveConfig(cfg){
  localStorage.setItem(storeKey, JSON.stringify(cfg));
  applyConfig(cfg);
}

function resetConfig(){
  localStorage.removeItem(storeKey);
  applyConfig(defaultConfig);
}

function applyConfig(cfg){
  document.getElementById("herName").textContent = cfg.herName || defaultConfig.herName;
  document.getElementById("yourName").textContent = cfg.yourName || defaultConfig.yourName;
  document.getElementById("customMessage").textContent = cfg.message || defaultConfig.message;
  // WhatsApp ve mailto
  const wa = document.getElementById("cta-whatsapp");
  const msg = encodeURIComponent("Merhaba, konuşabilir miyiz?");
  wa.href = `https://wa.me/${cfg.whatsapp}?text=${msg}`;
  const sec = document.getElementById("cta-secondary");
  sec.href = wa.href;
  const mailto = document.getElementById("mailtoLink");
  mailto.href = `mailto:?subject=Konuşabilir miyiz?&body=${encodeURIComponent("Seni kırdığım için özür dilerim. Hazırsan konuşalım.")}`;
  // Spotify
  const sp = document.getElementById("spotifyEmbed");
  sp.src = cfg.spotify.replace("/playlist/","/embed/playlist/");
  // Bugünün tarihi
  document.getElementById("today").textContent = new Date().toLocaleDateString("tr-TR", {year:"numeric",month:"long",day:"numeric"});
  // Başlık
  document.getElementById("title").innerHTML = `Affet Beni, <span id="herName">${cfg.herName}</span> ❤️`;
}

// Ayarlar dialog
const dlg = document.getElementById("settingsDialog");
document.getElementById("openSettings").addEventListener("click", ()=>{
  const cfg = getConfig();
  document.getElementById("inpHerName").value = cfg.herName;
  document.getElementById("inpYourName").value = cfg.yourName;
  document.getElementById("inpWhats").value = cfg.whatsapp;
  document.getElementById("inpSpotify").value = cfg.spotify;
  document.getElementById("inpMsg").value = cfg.message;
  dlg.showModal();
});

document.getElementById("saveBtn").addEventListener("click", (e)=>{
  e.preventDefault();
  const cfg = {
    herName: document.getElementById("inpHerName").value.trim() || defaultConfig.herName,
    yourName: document.getElementById("inpYourName").value.trim() || defaultConfig.yourName,
    whatsapp: document.getElementById("inpWhats").value.trim() || defaultConfig.whatsapp,
    spotify: document.getElementById("inpSpotify").value.trim() || defaultConfig.spotify,
    message: document.getElementById("inpMsg").value.trim() || defaultConfig.message,
  };
  saveConfig(cfg);
  dlg.close();
});

document.getElementById("resetBtn").addEventListener("click", (e)=>{
  e.preventDefault();
  resetConfig();
  dlg.close();
});

// Kalp animasyonu
const canvas = document.getElementById("hearts");
const ctx = canvas.getContext("2d");
let W, H, hearts;

function resize(){
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);

function spawnHeart(){
  const x = Math.random()*W;
  const size = 6 + Math.random()*16;
  const speed = 0.3 + Math.random()*0.7;
  const alpha = 0.2 + Math.random()*0.6;
  return {x, y:H+size, size, speed, alpha};
}

function drawHeart(x,y,size,alpha){
  ctx.save();
  ctx.translate(x,y);
  ctx.scale(size/20, size/20);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "#ff3b6b";
  ctx.beginPath();
  // simple heart path
  ctx.moveTo(0,6);
  ctx.bezierCurveTo(0,-6,20,-6,20,6);
  ctx.bezierCurveTo(20,18,10,22,0,30);
  ctx.bezierCurveTo(-10,22,-20,18,-20,6);
  ctx.bezierCurveTo(-20,-6,0,-6,0,6);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function loop(){
  ctx.clearRect(0,0,W,H);
  hearts.forEach(h=>{
    h.y -= h.speed;
    h.alpha *= 0.998;
    drawHeart(h.x,h.y,h.size,h.alpha);
  });
  // remove off-screen
  hearts = hearts.filter(h => h.y > -40 && h.alpha > 0.02);
  // spawn new
  while(hearts.length < 40){
    hearts.push(spawnHeart());
  }
  requestAnimationFrame(loop);
}

function init(){
  resize();
  hearts = Array.from({length:40}, spawnHeart);
  applyConfig(getConfig());
  loop();
}

init();
