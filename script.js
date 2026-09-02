const students={
  akash:{name:'AKASH',photo:'images/akash.jpg',role:'The Health Update Specialist',desc:'There is always one message that can arrive at exactly the right moment.',terminal:'AKASH.EXE\n\nHealth status detected...\nMessage received:\n"Sir ajke shorir kharap, aste parbo na."\n\nReason: HEALTH_UPDATE.exe',funny:''},
  anik:{name:'ANIK',photo:'images/anik.jpg',role:'The Question Generator',desc:'One question becomes two. Two become ten. And somehow Sir is still laughing.',terminal:'ANIK.EXE\n\nQuestion detected...\nQuestion #1\nQuestion #2\nQuestion #3\nQuestion #∞\n\nCPU: 100%\nLogic: STILL PROCESSING...',funny:'“Tumi Vbab Bondho Koro Age.”'},
  rupsha:{name:'RUPSHA',photo:'images/rupsha.jpg',role:'The Serious Laugher',desc:'She tries to keep a straight face. The algorithm disagrees.',terminal:'RUPSHA.EXE\n\nSerious_Mode = TRUE\n\nScanning...\n\nERROR!\nLaugh detected 😂\n\nSerious_Mode = FALSE',funny:''},
  upanjan:{name:'UPANJAN',photo:'images/upanjan.jpg',role:'The Double-Meaning Processor',desc:'Every innocent sentence enters the processor. The output is… laughter.',terminal:'UPANJAN.EXE\n\nInput received...\nProcessing...\n\nDoubleMeaningDetector:\n████████████████ 100%\n\nDOUBLE MEANING FOUND 😂\n\nInfinite Laugh Loop...',funny:''},
  sneha:{name:'SNEHA',photo:'images/sneha.jpg',role:'The Missing Node',desc:'Sometimes the most recognizable presence in a class is the one the attendance system keeps looking for.',terminal:'ATTENDANCE.SYSTEM\n\nSearching for: SNEHA\n\nRUPSHA     ✓\nAKASH      ✓\nANIK       ✓\nUPANJAN    ✓\nSNEHA      ...\n\nStatus: ABSENCE DETECTED 👻',funny:''}
};
const letters={
  akash:`Pranam Sir, you have given us so many good memories that I will always remember.\n\nThank you for always supporting me and making me believe that I can do better.`,
  anik:`Pranam Sir, sometimes we may not say it, but your words really mean a lot to us.\n\nI’m really grateful that I got the chance to learn from a teacher like you.`,
  rupsha:`Pranam Sir, your classes and the little things you taught us will always stay with me.\n\nI will miss those moments and always remember you with a lot of respect.`,
  upanjan:`Pranam Sir, you have corrected us when we were wrong and encouraged us when we felt low.\n\nThank you for being such an important part of our student life.`,
  sneha:`Pranam Sir, it feels strange to think that one day we won't be sitting in your class anymore.\n\nThank you for all your patience, care and for making us feel that we could always do better.`
};
const order=['akash','anik','rupsha','upanjan','sneha'];
let graphIndex=0, letterIndex=0, currentLetter=null, soundOn=false, audioCtx=null, master=null, musicTimer=null, ambientAudio=null;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function showScene(id){$$('.scene').forEach(s=>{s.classList.remove('scene-active','fade-in');s.classList.add('scene-hidden')});const el=$('#'+id);el.classList.remove('scene-hidden');el.classList.add('scene-active','fade-in');window.scrollTo({top:0,behavior:'instant'});}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2300)}
function typeText(el,text,speed=22){el.textContent='';let i=0;return new Promise(resolve=>{const tick=()=>{el.textContent+=text[i++]||'';if(i<=text.length){if(soundOn&&i%3===0)sfx('type');setTimeout(tick,speed)}else resolve()};tick()})}
function setupAudio(){
  if(audioCtx)return;
  const Ctx=window.AudioContext||window.webkitAudioContext;
  if(!Ctx)return;
  audioCtx=new Ctx();
  master=audioCtx.createGain();
  master.gain.value=.28;
  master.connect(audioCtx.destination);
}
function ensureAudio(){
  setupAudio();
  if(audioCtx&&audioCtx.state==='suspended') audioCtx.resume().catch(()=>{});
}
function sfx(kind){
  if(!soundOn)return;
  ensureAudio();
  if(!audioCtx||!master)return;
  const now=audioCtx.currentTime;
  const osc=audioCtx.createOscillator();
  const gain=audioCtx.createGain();
  osc.connect(gain); gain.connect(master);
  const cfg={
    click:[520,.11,.12,'triangle'],
    type:[Math.random()*180+320,.055,.055,'square'],
    open:[260,.14,.22,'sine'],
    node:[700,.15,.16,'triangle'],
    transition:[180,.10,.32,'sine'],
    success:[440,.16,.55,'sine']
  }[kind]||[220,.08,.1,'sine'];
  const [freq,vol,dur,wave]=cfg;
  osc.type=wave;
  osc.frequency.setValueAtTime(freq,now);
  if(kind==='open'||kind==='success'){
    osc.frequency.exponentialRampToValueAtTime(freq*1.7,now+dur*.7);
  }
  gain.gain.setValueAtTime(.0001,now);
  gain.gain.exponentialRampToValueAtTime(vol,now+.012);
  gain.gain.exponentialRampToValueAtTime(.0001,now+dur);
  osc.start(now); osc.stop(now+dur+.02);
}
function startAmbient(){
  if(!soundOn)return;
  if(!ambientAudio){
    ambientAudio=new Audio('cinematic-ambient.wav');
    ambientAudio.loop=true;
    ambientAudio.preload='auto';
    ambientAudio.volume=.42;
  }
  ambientAudio.muted=false;
  const p=ambientAudio.play();
  if(p&&p.catch)p.catch(()=>{ toast('Click SOUND ON once to enable the background music.'); });
}
function stopAmbient(){if(ambientAudio){ambientAudio.pause();ambientAudio.currentTime=0}}
function toggleSound(){
  soundOn=!soundOn;
  $('#soundBtn').textContent=soundOn?'🔊 SOUND ON':'🔇 SOUND OFF';
  if(soundOn){ensureAudio();startAmbient();sfx('open');}
  else stopAmbient();
}
$('#soundBtn').addEventListener('click',toggleSound);
// particles
const canvas=$('#particles'),ctx=canvas.getContext('2d');let ps=[];function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);ps=Array.from({length:Math.min(90,Math.floor(innerWidth/14))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.5+.3,v:Math.random()*.25+.05,a:Math.random()*.45+.1}))}function particles(){ctx.clearRect(0,0,innerWidth,innerHeight);ps.forEach(p=>{p.y-=p.v;if(p.y<0)p.y=innerHeight;ctx.globalAlpha=p.a;ctx.fillStyle='#e7d5ad';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()});requestAnimationFrame(particles)}addEventListener('resize',resize);resize();particles();addEventListener('pointermove',e=>{$('#cursorGlow').style.left=e.clientX+'px';$('#cursorGlow').style.top=e.clientY+'px'});
async function boot(){const body=$('#terminalBody');const lines=['$ ./teachers_day.exe','', 'Initializing Teachers\' Day experience...','Loading memories...','Loading students....... 5','Loading DSA............ OK','Loading gratitude...... ∞','', 'Teacher detected: PRANAM SIR ❤️','', 'System ready.'];body.textContent='';for(const l of lines){await typeText(body,l+'\n',l.startsWith('$')?35:18)}$('#introCopy').classList.remove('hidden');$('#introCopy').classList.add('reveal-up')}
boot();
$('#startBtn').addEventListener('click',()=>{if(!soundOn){soundOn=true;$('#soundBtn').textContent='🔊 SOUND ON'}ensureAudio();startAmbient();sfx('success');showScene('sir')});
$('#sir .next-btn').addEventListener('click',()=>{sfx('click');showScene('graph');setTimeout(()=>activateGraph(0),500)});
function activateGraph(i){graphIndex=i;const key=order[i];$$('.student-node').forEach(n=>n.classList.toggle('locked',order.indexOf(n.dataset.student)>i));$$('.student-node').forEach(n=>n.classList.toggle('active',n.dataset.student===key));$$('.connections path').forEach(p=>p.classList.remove('active'));$('#line-'+key).classList.add('active');$('#instructionText').textContent=`Click ${students[key].name} to begin`;}
$$('.student-node button').forEach(btn=>btn.addEventListener('click',()=>{const key=btn.closest('.student-node').dataset.student;if(key!==order[graphIndex]){toast(`Not yet — the website says click ${students[order[graphIndex]].name} next.`);sfx('click');return}sfx('node');openStory(key)}));
function openStory(key){const d=students[key];sfx('open');$('#storyPhoto').src=d.photo;$('#storyName').textContent=d.name;$('#storyRole').textContent=d.role;$('#storyDescription').textContent=d.desc;$('#famousLine').textContent=d.funny;$('#storyTerminal').textContent='';typeText($('#storyTerminal'),d.terminal,10);$('#storyCode').textContent=`// ${d.name}.js\nconst student = {\n  curiosity: true,\n  memories: Infinity\n};\n\nwhile (teacher.isPatient) {\n  student.learn();\n}`;showScene('story')}
$('#storyContinue').addEventListener('click',()=>{sfx('click');graphIndex++;if(graphIndex<order.length){showScene('graph');setTimeout(()=>activateGraph(graphIndex),500)}else{showScene('letters');setTimeout(()=>activateLetters(0),450)}});
function activateLetters(i){letterIndex=i;const key=order[i];$$('.letter-card').forEach(c=>{const idx=order.indexOf(c.dataset.letter);c.classList.toggle('locked',idx>i);c.querySelector('small').textContent=idx<i?'✓ READ':idx===i?'CLICK TO OPEN':'LOCKED'});$('#letterInstruction').textContent=`Click ${students[key].name} to open the letter`;}
$$('.letter-card').forEach(card=>card.addEventListener('click',()=>{const key=card.dataset.letter;if(order.indexOf(key)!==letterIndex){toast(`Please follow the order — click ${students[order[letterIndex]].name} next.`);sfx('click');return}openLetter(key)}));
function openLetter(key){currentLetter=key;sfx('open');$('#letterPhoto').src=students[key].photo;$('#letterName').textContent=students[key].name;$('#letterText').textContent=letters[key];$('#letterModal').classList.add('open');$('#letterModal').setAttribute('aria-hidden','false');$('#letterContinue').focus();sfx('open')}
$('#closeLetter').addEventListener('click',()=>{if(currentLetter){toast('Your letter is still waiting. Use CONTINUE when you are ready.');} });
$('#letterContinue').addEventListener('click',()=>{sfx('click');$('#letterModal').classList.remove('open');$('#letterModal').setAttribute('aria-hidden','true');letterIndex++;if(letterIndex<order.length){activateLetters(letterIndex)}else{showScene('algorithm');runFinalAlgorithm()}});
async function runFinalAlgorithm(){sfx('success');const code=`function gratitude(students, teacher) {\n\n  for (const student of students) {\n    memories.push(student);\n    respect++;\n    gratitude++;\n  }\n\n  return "Thank You, " + teacher;\n}\n\nconst result = gratitude(\n  [AKASH, ANIK, RUPSHA, UPANJAN, SNEHA],\n  "PRANAM SIR"\n);`;await typeText($('#finalCode'),code,8);$('#finalOutput').textContent='Executing...';await wait(600);$('#finalOutput').textContent='Student[1] ✓   Student[2] ✓   Student[3] ✓   Student[4] ✓   Student[5] ✓';await wait(900);$('#finalOutput').textContent='Result: GRATITUDE = ∞';await wait(900);$('#finalBtn').classList.remove('hidden')}
$('#finalBtn').addEventListener('click',()=>{sfx('click');showScene('ending');runEnding()});
async function runEnding(){sfx('success');await wait(2300);await typeText($('#endingTerminal'),'Teachers_Day.exe\n\nExecution completed successfully.\n\nQuestions : ∞\nMemories  : ∞\nTeacher   : PRANAM SIR\n\nStatus : ❤️ THANK YOU, SIR',22);await wait(700);$('#lastPunchline').classList.add('show');}
$('#replayBtn').addEventListener('click',()=>location.reload());function wait(ms){return new Promise(r=>setTimeout(r,ms))}
