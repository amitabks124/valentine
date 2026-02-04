// ---------- background hearts (creates .heart elements) ----------
(function createHearts(){
  const container = document.querySelector('.hearts');
  const count = 12;
  for(let i=0;i<count;i++){
    const h = document.createElement('div');
    h.className = 'heart';
    const size = 10 + Math.random()*26;
    h.style.width = size + 'px';
    h.style.height = size + 'px';
    h.style.left = (Math.random()*100) + '%';
    h.style.top = (100 + Math.random()*20) + '%';
    h.style.opacity = 0.55 + Math.random()*0.5;
    h.style.animationDuration = (6 + Math.random()*10) + 's';
    h.style.animationDelay = (-Math.random()*10) + 's';
    // alternating color fill choices
    if (Math.random() > 0.5) {
      h.style.background = 'linear-gradient(180deg,#ff6b8a,#ff4d6d)';
    } else {
      h.style.background = '#ff7aa2';
    }
    container.appendChild(h);
  }
})();

// ---------- No button playful movement ----------
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const card = document.getElementById("card");

const noTexts = [
  "No 🙃", "Are you sure?", "Think again 😏", "Wrong choice",
  "Nice try", "Still no?", "Absolutely not", "Okay this is awkward"
];

function moveNoBtnSmooth(x, y) {
  noBtn.style.transition = 'transform 220ms cubic-bezier(.2,.9,.3,1)';
  noBtn.style.transform = `translate(${x}px, ${y}px)`;
  setTimeout(()=> noBtn.style.transition = '', 260);
}

noBtn.addEventListener("mouseover", () => {
  const x = Math.random() * 240 - 120;
  const y = Math.random() * 90 - 45;
  moveNoBtnSmooth(x, y);
  const randomText = noTexts[Math.floor(Math.random() * noTexts.length)];
  noBtn.textContent = randomText;
});

noBtn.addEventListener("focus", () => {
  const x = Math.random() * 200 - 100;
  const y = Math.random() * 60 - 30;
  moveNoBtnSmooth(x, y);
});

// ---------- Confetti engine ----------
(function confettiModule(){
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  const particles = [];
  const colors = ['#ff4d6d','#ff7aa2','#ffd166','#ff9fbf','#ff6b8a','#ffb3c6'];

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  function rand(min, max) { return Math.random()*(max-min)+min; }

  function Particle(x,y){
    this.x = x; this.y = y;
    this.size = rand(6,12);
    const angle = rand(-Math.PI, Math.PI);
    const speed = rand(2,9);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.color = colors[Math.floor(Math.random()*colors.length)];
    this.tilt = rand(-0.1, 0.1);
    this.gravity = 0.25 + Math.random()*0.22;
    this.drag = 0.998;
    this.life = 60 + Math.floor(Math.random()*40);
    this.ttl = this.life;
    this.spin = rand(-0.08, 0.08);
  }

  Particle.prototype.update = function(){
    this.vy += this.gravity;
    this.vx *= this.drag;
    this.vy *= this.drag;
    this.x += this.vx;
    this.y += this.vy;
    this.tilt += this.spin;
    this.ttl--;
  };

  Particle.prototype.draw = function(ctx){
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.tilt);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size*0.6);
    ctx.restore();
  };

  function emit(x,y,count=30){
    for(let i=0;i<count;i++){
      particles.push(new Particle(x + rand(-10,10), y + rand(-10,10)));
    }
  }

  function animate(){
    ctx.clearRect(0,0,W,H);
    for(let i = particles.length - 1; i >= 0; i--){
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.ttl <= 0 || p.y > H + 60 || p.x < -60 || p.x > W + 60) {
        particles.splice(i,1);
      }
    }
    requestAnimationFrame(animate);
  }
  animate();

  window.blastConfetti = function(x = W/2, y = H/2, bursts = 5){
    for(let i=0;i<bursts;i++){
      setTimeout(()=> emit(x + rand(-60,60), y + rand(-60,60), 18 + Math.floor(rand(8,28))), i*80);
    }
  };

})();

// ---------- Yes button: trigger confetti and show celebrate message ----------
yesBtn.addEventListener("click", (e) => {
  const rect = card.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2;

  window.blastConfetti(cx, cy, 6);
  window.blastConfetti(cx - 150, cy - 20, 4);
  window.blastConfetti(cx + 140, cy - 20, 4);

  yesBtn.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(1.06)' },
    { transform: 'scale(1)' }
  ], { duration: 420, easing: 'ease-out' });

  setTimeout(()=> {
    // Replace card contents with celebration content using your repo GIF
    card.innerHTML = `
      <div style="text-align:center;">
        <h1 style="color:#ff2f6a;margin:0 0 6px 0;">YAY! 💘</h1>
        <p style="color:#6b6b6b;margin:0 0 12px 0;">Thank you for making me the happiest person ever.</p>
        <img class="celebrate" src="valentine-16.gif" alt="Celebration">
      </div>
    `;
    // encore confetti
    window.blastConfetti(window.innerWidth/2, window.innerHeight/3, 8);
  }, 350);
});

yesBtn.addEventListener('keydown', (ev) => {
  if(ev.key === 'Enter' || ev.key === ' '){
    ev.preventDefault();
    yesBtn.click();
  }
});

noBtn.addEventListener('keydown', (ev) => {
  if(ev.key === 'Enter' || ev.key === ' '){
    ev.preventDefault();
    const x = Math.random() * 260 - 130;
    const y = Math.random() * 80 - 40;
    noBtn.style.transform = `translate(${x}px, ${y}px)`;
  }
});// ---------- background hearts (creates .heart elements) ----------
(function createHearts(){
  const container = document.querySelector('.hearts');
  const count = 12;
  for(let i=0;i<count;i++){
    const h = document.createElement('div');
    h.className = 'heart';
    const size = 10 + Math.random()*26;
    h.style.width = size + 'px';
    h.style.height = size + 'px';
    h.style.left = (Math.random()*100) + '%';
    h.style.top = (100 + Math.random()*20) + '%';
    h.style.opacity = 0.55 + Math.random()*0.5;
    h.style.animationDuration = (6 + Math.random()*10) + 's';
    h.style.animationDelay = (-Math.random()*10) + 's';
    // alternating color fill choices
    if (Math.random() > 0.5) {
      h.style.background = 'linear-gradient(180deg,#ff6b8a,#ff4d6d)';
    } else {
      h.style.background = '#ff7aa2';
    }
    container.appendChild(h);
  }
})();

// ---------- No button playful movement ----------
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const card = document.getElementById("card");

const noTexts = [
  "No 🙃", "Are you sure?", "Think again 😏", "Wrong choice",
  "Nice try", "Still no?", "Absolutely not", "Okay this is awkward"
];

function moveNoBtnSmooth(x, y) {
  noBtn.style.transition = 'transform 220ms cubic-bezier(.2,.9,.3,1)';
  noBtn.style.transform = `translate(${x}px, ${y}px)`;
  setTimeout(()=> noBtn.style.transition = '', 260);
}

noBtn.addEventListener("mouseover", () => {
  const x = Math.random() * 240 - 120;
  const y = Math.random() * 90 - 45;
  moveNoBtnSmooth(x, y);
  const randomText = noTexts[Math.floor(Math.random() * noTexts.length)];
  noBtn.textContent = randomText;
});

noBtn.addEventListener("focus", () => {
  const x = Math.random() * 200 - 100;
  const y = Math.random() * 60 - 30;
  moveNoBtnSmooth(x, y);
});

// ---------- Confetti engine ----------
(function confettiModule(){
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  const particles = [];
  const colors = ['#ff4d6d','#ff7aa2','#ffd166','#ff9fbf','#ff6b8a','#ffb3c6'];

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  function rand(min, max) { return Math.random()*(max-min)+min; }

  function Particle(x,y){
    this.x = x; this.y = y;
    this.size = rand(6,12);
    const angle = rand(-Math.PI, Math.PI);
    const speed = rand(2,9);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.color = colors[Math.floor(Math.random()*colors.length)];
    this.tilt = rand(-0.1, 0.1);
    this.gravity = 0.25 + Math.random()*0.22;
    this.drag = 0.998;
    this.life = 60 + Math.floor(Math.random()*40);
    this.ttl = this.life;
    this.spin = rand(-0.08, 0.08);
  }

  Particle.prototype.update = function(){
    this.vy += this.gravity;
    this.vx *= this.drag;
    this.vy *= this.drag;
    this.x += this.vx;
    this.y += this.vy;
    this.tilt += this.spin;
    this.ttl--;
  };

  Particle.prototype.draw = function(ctx){
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.tilt);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size/2, -this.size/2, this.size, this.size*0.6);
    ctx.restore();
  };

  function emit(x,y,count=30){
    for(let i=0;i<count;i++){
      particles.push(new Particle(x + rand(-10,10), y + rand(-10,10)));
    }
  }

  function animate(){
    ctx.clearRect(0,0,W,H);
    for(let i = particles.length - 1; i >= 0; i--){
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.ttl <= 0 || p.y > H + 60 || p.x < -60 || p.x > W + 60) {
        particles.splice(i,1);
      }
    }
    requestAnimationFrame(animate);
  }
  animate();

  window.blastConfetti = function(x = W/2, y = H/2, bursts = 5){
    for(let i=0;i<bursts;i++){
      setTimeout(()=> emit(x + rand(-60,60), y + rand(-60,60), 18 + Math.floor(rand(8,28))), i*80);
    }
  };

})();

// ---------- Yes button: trigger confetti and show celebrate message ----------
yesBtn.addEventListener("click", (e) => {
  const rect = card.getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2;

  window.blastConfetti(cx, cy, 6);
  window.blastConfetti(cx - 150, cy - 20, 4);
  window.blastConfetti(cx + 140, cy - 20, 4);

  yesBtn.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(1.06)' },
    { transform: 'scale(1)' }
  ], { duration: 420, easing: 'ease-out' });

  setTimeout(()=> {
    // Replace card contents with celebration content using your repo GIF
    card.innerHTML = `
      <div style="text-align:center;">
        <h1 style="color:#ff2f6a;margin:0 0 6px 0;">YAY! 💘</h1>
        <p style="color:#6b6b6b;margin:0 0 12px 0;">Thank you for making me the happiest person ever.</p>
        <img class="celebrate" src="valentine-16.gif" alt="Celebration">
      </div>
    `;
    // encore confetti
    window.blastConfetti(window.innerWidth/2, window.innerHeight/3, 8);
  }, 350);
});

yesBtn.addEventListener('keydown', (ev) => {
  if(ev.key === 'Enter' || ev.key === ' '){
    ev.preventDefault();
    yesBtn.click();
  }
});

noBtn.addEventListener('keydown', (ev) => {
  if(ev.key === 'Enter' || ev.key === ' '){
    ev.preventDefault();
    const x = Math.random() * 260 - 130;
    const y = Math.random() * 80 - 40;
    noBtn.style.transform = `translate(${x}px, ${y}px)`;
  }
});
