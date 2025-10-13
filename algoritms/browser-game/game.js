(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const startBtn = document.getElementById('startBtn');
  const restartBtn = document.getElementById('restartBtn');
  const overlay = document.getElementById('overlay');
  const overlayStart = document.getElementById('overlayStart');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayText = document.getElementById('overlayText');
  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');
  const speedEl = document.getElementById('speed');
  const playerNameEl = document.getElementById('playerName');
  const saveBtn = document.getElementById('saveBtn');
  const saveMsg = document.getElementById('saveMsg');
  const lbBody = document.getElementById('leaderboardBody');

  const API_BASE = './php';

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const randRange = (a, b) => Math.random() * (b - a) + a;

  const GROUND_Y = canvas.height - 64;
  const SKY_GRADIENT = (() => {
    const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
    g.addColorStop(0, '#0d123a');
    g.addColorStop(1, '#0a0e2a');
    return g;
  })();

  const obstacleTypes = [
    { key: 'donkey', label: 'Осёл', color: '#a37bff', w: 36, h: 46 },
    { key: 'pinocchio', label: 'Пиноккио', color: '#ffd166', w: 28, h: 50 },
    { key: 'shrek', label: 'Шрек', color: '#7bdc74', w: 40, h: 54 },
    { key: 'cookie', label: 'Печенье', color: '#ff9f80', w: 24, h: 24 },
    { key: 'baskov', label: 'Н. Басков', color: '#ff6bb3', w: 34, h: 48 }
  ];

  const bossType = { key: 'humpty', label: 'Шалтай-Болтай', color: '#e34f5c', w: 64, h: 78 };

  const keys = { up: false, down: false };
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') keys.up = true;
    if (e.code === 'ArrowDown') keys.down = true;
    if (e.code === 'KeyR') tryRestart();
    if ((e.code === 'Space' || e.code === 'Enter') && state === 'READY') startGame();
  });
  window.addEventListener('keyup', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') keys.up = false;
    if (e.code === 'ArrowDown') keys.down = false;
  });
  canvas.addEventListener('pointerdown', () => keys.up = true);
  canvas.addEventListener('pointerup', () => keys.up = false);

  startBtn.addEventListener('click', () => startGame());
  overlayStart.addEventListener('click', () => startGame());
  restartBtn.addEventListener('click', () => tryRestart());
  saveBtn.addEventListener('click', () => saveScore());

  let state = 'READY';
  let score = 0;
  let best = Number(localStorage.getItem('cat_best') || 0);
  let speed = 6; // world units per frame baseline
  let speedMultiplier = 1;
  let time = 0;
  let spawnCooldown = 0;
  let obstacles = [];
  let boss = null;

  class Cat {
    constructor() {
      this.x = 120; this.y = GROUND_Y;
      this.w = 44; this.h = 44;
      this.vy = 0; this.onGround = true; this.duck = false;
    }
    update(dt) {
      const gravity = 0.9;
      const jumpV = -14;
      this.duck = keys.down && this.onGround;
      const duckH = this.duck ? 28 : 44;
      this.h = duckH;
      if ((keys.up) && this.onGround) {
        this.vy = jumpV; this.onGround = false;
      }
      this.vy += gravity;
      this.y += this.vy;
      if (this.y >= GROUND_Y - (this.h - 44)) {
        this.y = GROUND_Y - (this.h - 44); this.vy = 0; this.onGround = true;
      }
    }
    bbox() { return {x: this.x+6, y: this.y-44+6, w: this.w-12, h: this.h-12}; }
    draw() {
      // Body
      const baseY = this.y - 44;
      ctx.save();
      ctx.translate(this.x, baseY);
      // shadow
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.beginPath();
      ctx.ellipse(12, 44, 16, 6, 0, 0, Math.PI*2); ctx.fill();
      // cat body
      ctx.fillStyle = '#ffdd7d';
      ctx.strokeStyle = '#4a3b14';
      roundRect(ctx, 0, 0, this.w, this.h, 10, true, true);
      // eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(16, 16, 7, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(30, 16, 7, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#2c2f50';
      ctx.beginPath(); ctx.arc(16, 16, 3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(30, 16, 3, 0, Math.PI*2); ctx.fill();
      // boots hint
      ctx.fillStyle = '#1f2d54';
      ctx.fillRect(4, this.h-8, 14, 6);
      ctx.fillRect(26, this.h-8, 14, 6);
      // hat feather
      ctx.strokeStyle = '#ff6bb3'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(36, 2); ctx.quadraticCurveTo(44, -4, 38, -10); ctx.stroke();
      ctx.restore();
    }
  }

  class Obstacle {
    constructor(type, x) {
      this.type = type; this.x = x; this.y = GROUND_Y - type.h + 44; // align baseline
      this.w = type.w; this.h = type.h; this.passed = false;
    }
    update(dt) { this.x -= speed * speedMultiplier; }
    bbox() { return {x: this.x, y: this.y, w: this.w, h: this.h}; }
    draw() {
      ctx.save();
      ctx.fillStyle = this.type.color;
      roundRect(ctx, this.x, this.y, this.w, this.h, 6, true, false);
      ctx.fillStyle = '#11152e';
      ctx.font = 'bold 12px Montserrat';
      ctx.textAlign = 'center';
      ctx.fillText(this.type.label, this.x + this.w/2, this.y - 6);
      ctx.restore();
    }
  }

  class Boss {
    constructor() {
      this.type = bossType; this.x = canvas.width + 40; this.y = GROUND_Y - this.type.h + 44;
      this.w = this.type.w; this.h = this.type.h; this.hp = 5; this.alive = true; this.timer = 0;
    }
    update(dt) {
      this.timer += dt;
      // Wavy movement and periodic jumps
      this.x -= (speed * speedMultiplier) * 0.9;
      this.y = GROUND_Y - this.h + 44 - Math.sin(this.timer * 2.0) * 18;
    }
    bbox() { return {x: this.x, y: this.y, w: this.w, h: this.h}; }
    draw() {
      ctx.save();
      ctx.fillStyle = this.type.color;
      roundRect(ctx, this.x, this.y, this.w, this.h, 12, true, false);
      // face
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(this.x + this.w/2 - 10, this.y + 24, 8, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(this.x + this.w/2 + 10, this.y + 24, 8, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#11152e';
      ctx.beginPath(); ctx.arc(this.x + this.w/2 - 10, this.y + 24, 3, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(this.x + this.w/2 + 10, this.y + 24, 3, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#11152e';
      ctx.font = 'bold 12px Montserrat'; ctx.textAlign='center';
      ctx.fillText('Шалтай-Болтай', this.x + this.w/2, this.y - 6);
      // HP bar
      const barW = 64, barH = 6;
      ctx.fillStyle = '#2b3166'; ctx.fillRect(this.x, this.y - 16, barW, barH);
      ctx.fillStyle = '#41d1b8'; ctx.fillRect(this.x, this.y - 16, (this.hp/5)*barW, barH);
      ctx.restore();
    }
  }

  function roundRect(ctx, x, y, w, h, r, fill, stroke){
    if (w < 2 * r) r = w / 2; if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y,   x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x,   y+h, r);
    ctx.arcTo(x,   y+h, x,   y,   r);
    ctx.arcTo(x,   y,   x+w, y,   r);
    ctx.closePath();
    if (fill) ctx.fill(); if (stroke) ctx.stroke();
  }

  function aabb(a, b){
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  const cat = new Cat();

  function reset() {
    state = 'READY';
    score = 0; time = 0; speedMultiplier = 1; spawnCooldown = 0; obstacles = []; boss = null;
    overlay.classList.remove('hidden');
    overlayTitle.textContent = 'Готовы?';
    overlayText.textContent = 'Нажмите Старт или Пробел';
    startBtn.disabled = false; restartBtn.disabled = true; saveBtn.disabled = true;
    saveMsg.textContent = '';
  }

  function startGame() {
    if (state === 'RUNNING') return;
    overlay.classList.add('hidden');
    startBtn.disabled = true; restartBtn.disabled = false; saveBtn.disabled = true; saveMsg.textContent = '';
    state = 'RUNNING';
  }

  function gameOver(winBoss = false) {
    state = 'GAMEOVER';
    best = Math.max(best, Math.floor(score));
    localStorage.setItem('cat_best', String(best));
    overlay.classList.remove('hidden');
    overlayTitle.textContent = winBoss ? 'Победа!' : 'Игра окончена';
    overlayText.textContent = `Ваш счёт: ${Math.floor(score)}`;
    saveBtn.disabled = false;
  }

  function tryRestart(){ if (state === 'GAMEOVER') reset(); }

  function spawnObstacle() {
    const t = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    const x = canvas.width + randRange(0, 180);
    obstacles.push(new Obstacle(t, x));
  }

  function maybeSpawnBoss(){
    if (boss || score < 500) return; // boss after reaching 500 points
    boss = new Boss();
  }

  function update(dt) {
    if (state !== 'RUNNING') return;
    time += dt;
    score += (dt * 60) * 1.5 * speedMultiplier; // score by time
    speedMultiplier = 1 + Math.min(1.5, Math.floor(score / 200) * 0.1);
    spawnCooldown -= dt;
    if (spawnCooldown <= 0 && !boss) {
      spawnObstacle();
      spawnCooldown = randRange(0.9, 1.6) / speedMultiplier;
    }
    maybeSpawnBoss();

    cat.update(dt);
    for (const o of obstacles) o.update(dt);
    obstacles = obstacles.filter(o => o.x + o.w > -20);
    if (boss) boss.update(dt);

    // Collisions
    const catBox = cat.bbox();
    for (const o of obstacles) {
      if (aabb(catBox, o.bbox())) return gameOver(false);
      if (!o.passed && o.x + o.w < cat.x) { o.passed = true; score += 5; }
    }
    if (boss && aabb(catBox, boss.bbox())) {
      // Touching boss decreases hp and knocks back
      boss.hp -= 1; score += 50; boss.x += 60;
      if (boss.hp <= 0) { boss.alive = false; gameOver(true); }
    }
  }

  function drawBackground() {
    // sky
    ctx.fillStyle = SKY_GRADIENT; ctx.fillRect(0, 0, canvas.width, canvas.height);
    // stars
    ctx.fillStyle = '#1c2150';
    for (let i=0;i<40;i++) {
      const x = (i * 83 + Math.floor(time*60)*2) % canvas.width;
      const y = (i * 53) % (canvas.height-80);
      ctx.fillRect(x, y, 2, 2);
    }
    // ground
    ctx.fillStyle = '#10163a'; ctx.fillRect(0, GROUND_Y, canvas.width, 6);
    ctx.fillStyle = '#0b1028'; ctx.fillRect(0, GROUND_Y+6, canvas.width, canvas.height - GROUND_Y - 6);
  }

  function render() {
    drawBackground();
    for (const o of obstacles) o.draw();
    if (boss && boss.alive) boss.draw();
    cat.draw();

    // HUD
    scoreEl.textContent = `Счёт: ${Math.floor(score)}`;
    bestEl.textContent = `Рекорд: ${best}`;
    speedEl.textContent = `Скорость: ${speedMultiplier.toFixed(1)}x`;

    if (state === 'READY') {
      ctx.fillStyle = 'rgba(7,9,24,.45)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  let last = 0;
  function loop(ts){
    const dt = Math.min(0.033, (ts - last) / 1000 || 0);
    last = ts;
    update(dt);
    render();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  reset();
  refreshLeaderboard();

  async function refreshLeaderboard(){
    try {
      const res = await fetch(`${API_BASE}/get_highscores.php`);
      const data = await res.json();
      lbBody.innerHTML = '';
      (data?.scores || []).forEach((row, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${i+1}</td><td>${escapeHtml(row.name)}</td><td>${row.score}</td><td>${row.created_at}</td>`;
        lbBody.appendChild(tr);
      });
      if ((data?.scores || []).length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="4" style="color:#8b91c7">Пока нет записей</td>`;
        lbBody.appendChild(tr);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function saveScore(){
    const name = (playerNameEl.value || '').trim().slice(0, 16) || 'Игрок';
    const payload = new URLSearchParams();
    payload.set('name', name);
    payload.set('score', String(Math.floor(score)));
    saveBtn.disabled = true; saveMsg.textContent = 'Сохраняю...';
    try {
      const res = await fetch(`${API_BASE}/save_score.php`, { method: 'POST', headers: { 'Content-Type':'application/x-www-form-urlencoded' }, body: payload.toString() });
      const data = await res.json();
      if (data.success) {
        saveMsg.style.color = '#41d1b8';
        saveMsg.textContent = 'Счёт сохранён!';
        refreshLeaderboard();
      } else {
        saveBtn.disabled = false; saveMsg.style.color = '#ff5d73'; saveMsg.textContent = data.error || 'Ошибка сохранения';
      }
    } catch (e) {
      saveBtn.disabled = false; saveMsg.style.color = '#ff5d73'; saveMsg.textContent = 'Сервер недоступен';
    }
  }

  function escapeHtml(str){
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();


