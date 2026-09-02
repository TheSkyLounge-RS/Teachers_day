const students={
 akash:{name:'AKASH',role:'The Health Update Specialist',kicker:'Memory 01 — The classic message',photo:'images/akash.jpg',desc:'There was always that one message that somehow became part of the class routine.',funny:'“Sir ajke shorir kharap, aste parbo na.”'},
 anik:{name:'ANIK',role:'The Question Generator',kicker:'Memory 02 — One more question',photo:'images/anik.jpg',desc:'One question became two. Two became ten. And somehow Sir still had the patience to listen.',funny:'Question count: ∞\nSir’s reaction: 😂'},
 rupsha:{name:'RUPSHA',role:'The Serious Laugher',kicker:'Memory 03 — Serious mode: failed',photo:'images/rupsha.jpg',desc:'She tried to look serious. Unfortunately, the laugh always arrived before the seriousness could.',funny:'Serious face: ON\nLaugh detected: 😂'},
 upanjan:{name:'UPANJAN',role:'The Double-Meaning Processor',kicker:'Memory 04 — You know what he heard',photo:'images/upanjan.jpg',desc:'Every completely normal sentence had a second meaning waiting somewhere in his processor.',funny:'Double meaning found.\nLaugh activated. 😂'},
 sneha:{name:'SNEHA',role:'The Attendance Mystery',kicker:'Memory 05 — Where is Sneha?',photo:'images/sneha.jpg',desc:'Sometimes she was there, sometimes she was not. But somehow, her absence became one of the memories too.',funny:'Attendance system searching…\nSNEHA: ... 👻'}
};
const letters={
 akash:`Pranam Sir, you have given us so many good memories that I will always remember.\n\nThank you for always supporting me and making me believe that I can do better.`,
 anik:`Pranam Sir, sometimes we may not say it, but your words really mean a lot to us.\n\nI’m really grateful that I got the chance to learn from a teacher like you.`,
 rupsha:`Pranam Sir, your classes and the little things you taught us will always stay with me.\n\nI will miss those moments and always remember you with a lot of respect.`,
 upanjan:`Pranam Sir, you have corrected us when we were wrong and encouraged us when we felt low.\n\nThank you for being such an important part of our student life.`,
 sneha:`Pranam Sir, it feels strange to think that one day we won't be sitting in your class anymore.\n\nThank you for all your patience, care and for making us feel that we could always do better.`
};
const order=['akash','anik','rupsha','upanjan','sneha'];let memIndex=0,letterIndex=0,current=null,sound=false,audio=null,ctx=null,master=null;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
function scene(id){$$('.scene').forEach(x=>x.classList.remove('active'));$('#'+id).classList.add('active');scrollTo({top:0,behavior:'instant'});}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2200)}
function setupAudio(){if(ctx)return;const C=window.AudioContext||window.webkitAudioContext;if(!C)return;ctx=new C();master=ctx.createGain();master.gain.value=.22;master.connect(ctx.destination)}
function beep(type='click'){if(!sound)return;setupAudio();if(!ctx)return;const o=ctx.createOscillator(),g=ctx.createGain(),n=ctx.currentTime;o.connect(g);g.connect(master);const f=type==='open'?300:type==='success'?440:560;o.frequency.value=f;o.type='sine';g.gain.setValueAtTime(.0001,n);g.gain.exponentialRampToValueAtTime(.12,n+.01);g.gain.exponentialRampToValueAtTime(.0001,n+.16);o.start(n);o.stop(n+.18)}
function startMusic(){if(!sound)return;if(!audio){audio=new Audio('cinematic-ambient.wav');audio.loop=true;audio.volume=.38}audio.play().catch(()=>toast('Click SOUND ON once to start the music.'))}
function setSound(on){sound=on;$('#soundBtn').textContent=on?'🔊 SOUND ON':'🔇 SOUND OFF';if(on){setupAudio();ctx?.resume();startMusic();beep('open')}else if(audio){audio.pause();audio.currentTime=0}}
$('#soundBtn').onclick=()=>setSound(!sound);
const canvas=$('#particles'),c=canvas.getContext('2d');let dots=[];function resize(){canvas.width=innerWidth;canvas.height=innerHeight;dots=Array.from({length:70},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.4+.2,v:Math.random()*.3+.05,a:Math.random()*.35}))}function animate(){c.clearRect(0,0,innerWidth,innerHeight);dots.forEach(p=>{p.y-=p.v;if(p.y<0)p.y=innerHeight;c.globalAlpha=p.a;c.fillStyle='#d8b46a';c.beginPath();c.arc(p.x,p.y,p.r,0,Math.PI*2);c.fill()});requestAnimationFrame(animate)}addEventListener('resize',resize);resize();animate();
function typeText(el,text,speed){el.textContent='';let i=0;return new Promise(res=>{function t(){el.textContent+=text[i++]||'';if(i<=text.length){setTimeout(t,speed)}else res()}t()})}
async function boot(){const lines=['$ ./teachers_day.exe','','Initializing Teachers’ Day experience...','Loading memories....... OK','Loading students....... 5','Loading DSA............ OK','Loading gratitude...... ∞','','Teacher detected: PRANAM SIR ❤️','','System ready.'];for(const line of lines){await typeText($('#terminalBody'),$('#terminalBody').textContent+(line?'':''),1);if(line){$('#terminalBody').textContent+='' ;await typeText($('#terminalBody'),line+'\n',line.startsWith('$')?28:12)}}$('#introCopy').classList.remove('hidden');}
boot();
$('#startBtn').onclick=()=>{setSound(true);beep('success');scene('sir')};
$('[data-next="memories"]').onclick=()=>{beep();scene('memories');updateMemories()};
function updateMemories(){const key=order[memIndex];$$('.memory-card').forEach(x=>{const i=order.indexOf(x.dataset.student);x.classList.toggle('locked',i>memIndex)});$('#memoryGuide').innerHTML=`Sir, let's start with <b>${students[key].name[0]+students[key].name.slice(1).toLowerCase()}</b>. Click ${students[key].name}'s photo.`}
$$('.memory-card').forEach(card=>card.onclick=()=>{const key=card.dataset.student;if(order.indexOf(key)!==memIndex){toast(`Not yet — please click ${students[order[memIndex]].name} next.`);beep();return}openStudent(key)});
function openStudent(key){current=key;const d=students[key];$('#studentBg').src=d.photo;$('#studentPhoto').src=d.photo;$('#studentName').textContent=d.name;$('#studentRole').textContent=d.role;$('#studentKicker').textContent=d.kicker;$('#studentDesc').textContent=d.desc;$('#funnyBox').textContent=d.funny;beep('open');scene('student')}
$('#studentClose').onclick=()=>scene('memories');
$('#studentContinue').onclick=()=>{memIndex++;beep();if(memIndex<order.length){scene('memories');updateMemories()}else{scene('letters');updateLetters()}};
function updateLetters(){const key=order[letterIndex];$$('.letter-card').forEach(x=>{const i=order.indexOf(x.dataset.letter);x.classList.toggle('locked',i>letterIndex);x.querySelector('small').textContent=i<letterIndex?'✓ READ':i===letterIndex?'OPEN LETTER':'LOCKED'});$('#letterGuide').innerHTML=`Sir, please open <b>${students[key].name[0]+students[key].name.slice(1).toLowerCase()}'s</b> letter first.`}
$$('.letter-card').forEach(card=>card.onclick=()=>{const key=card.dataset.letter;if(order.indexOf(key)!==letterIndex){toast(`Please open ${students[order[letterIndex]].name}'s letter next.`);beep();return}openLetter(key)});
function openLetter(key){current=key;$('#letterPhoto').src=students[key].photo;$('#letterName').textContent=students[key].name;$('#letterText').textContent=letters[key];$('#letterModal').classList.add('open');beep('open')}
$('#closeLetter').onclick=()=>$('#letterModal').classList.remove('open');
$('#letterContinue').onclick=()=>{beep();$('#letterModal').classList.remove('open');letterIndex++;if(letterIndex<order.length)updateLetters();else{scene('scrapbook')}};
$('#toFinal').onclick=()=>{beep('success');scene('final');setTimeout(()=>$('#punchline').classList.add('show'),2800)};
$('#replay').onclick=()=>location.reload();
