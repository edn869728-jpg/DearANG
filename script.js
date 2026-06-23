

let lyricsEnabled=true;
let lastLyricIndex=-1;
let lastAudioTime=0;
const ROOT_LYRIC_FILES={
  lrc:'./給安格.lrc',
  srt:'./給安格.srt',
  embedded:'./lyrics_embedded.js.txt'
};
function parseTimeToSeconds(s){
  if(!s)return 0;
  s=String(s).trim();
  const p=s.split(':').map(x=>x.replace(',','.'));
  if(p.length===2)return Number(p[0])*60+Number(p[1]);
  if(p.length===3)return Number(p[0])*3600+Number(p[1])*60+Number(p[2]);
  return Number(s)||0;
}
function parseLrc(text){
  const rows=[];
  String(text||'').split(/\r?\n/).forEach(line=>{
    const tags=[...line.matchAll(/\[(\d{1,2}:\d{2}(?:[\.:]\d{1,3})?)\]/g)].map(m=>m[1]);
    const words=line.replace(/\[[^\]]+\]/g,'').trim();
    if(!tags.length||!words)return;
    tags.forEach(t=>rows.push({time:parseTimeToSeconds(t),text:words}));
  });
  rows.sort((a,b)=>a.time-b.time);
  return rows.map((r,i)=>({time:r.time,end:rows[i+1]?Math.max(rows[i+1].time-.05,r.time+1):r.time+6,text:r.text}));
}
function parseSrt(text){
  const rows=[];
  const blocks=String(text||'').replace(/\r/g,'').split(/\n\s*\n/);
  blocks.forEach(block=>{
    const lines=block.split('\n').filter(Boolean);
    const timeLine=lines.find(x=>x.includes('-->'));
    if(!timeLine)return;
    const parts=timeLine.split('-->').map(x=>x.trim());
    const textLines=lines.slice(lines.indexOf(timeLine)+1).map(x=>x.trim()).filter(Boolean);
    const words=textLines.join(' / ').trim();
    if(!words)return;
    rows.push({time:parseTimeToSeconds(parts[0]),end:parseTimeToSeconds(parts[1]),text:words});
  });
  return rows;
}
async function fetchTextFile(url){
  const r=await fetch(url+(url.includes('?')?'&':'?')+'_=' + Date.now(),{cache:'no-store'});
  if(!r.ok)throw new Error(url+' 讀取失敗');
  return await r.text();
}
async function loadLyricsFromRootFiles(){
  // 你的歌詞檔就在 DearANG 根目錄，不搬家、不改名：給安格.lrc / 給安格.srt / lyrics_embedded.js.txt
  try{
    const lrc=await fetchTextFile(ROOT_LYRIC_FILES.lrc);
    const parsed=parseLrc(lrc);
    if(parsed.length){LYRIC_LINES=parsed;return '給安格.lrc';}
  }catch(e){}
  try{
    const srt=await fetchTextFile(ROOT_LYRIC_FILES.srt);
    const parsed=parseSrt(srt);
    if(parsed.length){LYRIC_LINES=parsed;return '給安格.srt';}
  }catch(e){}
  try{
    const txt=await fetchTextFile(ROOT_LYRIC_FILES.embedded);
    const m=txt.match(/LYRIC_LINES\s*=\s*(\[[\s\S]*?\]);/);
    if(m){
      const parsed=Function('return '+m[1])();
      if(Array.isArray(parsed)&&parsed.length){LYRIC_LINES=parsed;return 'lyrics_embedded.js.txt';}
    }
  }catch(e){}
  return 'index.html 內建備援歌詞';
}

let LYRIC_LINES = [
  { time: 6.33, end: 17.62, text: "主題曲:給安格 Dear ANG" },
  { time: 17.72, end: 27.47, text: "作詞:Enden 作曲:Enden" },
  { time: 27.57, end: 30.46, text: "這個世界最殘酷的事情" },
  { time: 30.56, end: 34.82, text: "總在無意之中" },
  { time: 34.92, end: 37.21, text: "悄悄把身邊的人" },
  { time: 37.31, end: 41.38, text: "一個一個帶走" },
  { time: 41.48, end: 43.94, text: "我們總以為" },
  { time: 44.04, end: 48.49, text: "還有很多時間" },
  { time: 48.59, end: 50.8, text: "說好以後再見" },
  { time: 50.9, end: 54.66, text: "說好下次再去" },
  { time: 54.76, end: 57.7, text: "可當我回頭" },
  { time: 57.8, end: 61.13, text: "時間早已沉默" },
  { time: 61.23, end: 64.11, text: "那些沒說出口的話" },
  { time: 64.21, end: 68.62, text: "停在昨天以後" },
  { time: 68.72, end: 71.24, text: "原來這個世界沒有如果" },
  { time: 71.34, end: 75.18, text: "發生了就是結果" },
  { time: 75.28, end: 78.19, text: "那些來不及說的再見" },
  { time: 78.29, end: 82.46, text: "變成一生的沉默" },
  { time: 82.56, end: 85.68, text: "我不知道你聽不聽得到" },
  { time: 85.78, end: 89.06, text: "我真的很想你" },
  { time: 89.16, end: 91.71, text: "我永遠是你弟弟" },
  { time: 91.81, end: 97.42, text: "你永遠是我哥" },
  { time: 97.52, end: 100.33, text: "一年多以前的那個夜晚" },
  { time: 100.43, end: 104.34, text: "高速公路燈閃過" },
  { time: 104.44, end: 107.39, text: "我們笑著說如果誰先走" },
  { time: 107.49, end: 110.44, text: "一定要打給對方" },
  { time: 110.54, end: 112.38, text: "就算要下葬之前" },
  { time: 112.48, end: 117.13, text: "也要從棺材爬出來說" },
  { time: 117.23, end: 119.43, text: "兄弟我要走了" },
  { time: 119.53, end: 124.15, text: "別讓我最後一個人走" },
  { time: 124.25, end: 125.43, text: "可最後卻是" },
  { time: 125.53, end: 127.47, text: "別人告訴我" },
  { time: 127.57, end: 130.21, text: "為什麼我連最後一面" },
  { time: 130.31, end: 134.72, text: "都來不及見你" },
  { time: 134.82, end: 137.4, text: "原來這個世界沒有如果" },
  { time: 137.5, end: 141.63, text: "發生了就是結果" },
  { time: 141.73, end: 144.28, text: "那些還沒說完的故事" },
  { time: 144.38, end: 148.42, text: "停在那一刻" },
  { time: 148.52, end: 151.62, text: "我不知道你聽不聽得到" },
  { time: 151.72, end: 154.85, text: "我真的很想你" },
  { time: 154.95, end: 158.08, text: "就算沒有血緣" },
  { time: 158.18, end: 162.36, text: "你永遠是我哥" },
  { time: 162.46, end: 164.62, text: "你可不可以" },
  { time: 164.72, end: 169.15, text: "到我夢裡說說話" },
  { time: 169.25, end: 171.64, text: "告訴我到底怎麼了" },
  { time: 171.74, end: 176.67, text: "告訴我你還好嗎" },
  { time: 176.77, end: 179.95, text: "如果真的有人害你" },
  { time: 180.05, end: 183.19, text: "如果你還沒說完" },
  { time: 183.29, end: 185.71, text: "至少讓我知道" },
  { time: 185.81, end: 193.56, text: "你不是一個人走" },
  { time: 193.66, end: 196.51, text: "原來這個世界沒有如果" },
  { time: 196.61, end: 200.75, text: "只剩回憶陪著我" },
  { time: 200.85, end: 203.43, text: "那些一起走過的日子" },
  { time: 203.53, end: 207.74, text: "一輩子不會走" },
  { time: 207.84, end: 211.05, text: "如果你真的聽得到" },
  { time: 211.15, end: 214.15, text: "就來我夢裡吧" },
  { time: 214.25, end: 218.07, text: "再叫我一聲弟弟" },
  { time: 218.17, end: 221.59, text: "再說一次" },
  { time: 221.69, end: 223.47, text: "兄弟" },
  { time: 223.57, end: 257.35, text: "我走了" },
  { time: 257.45, end: 263.45, text: "兄弟.." }
];
const LYRIC_OFFSET_SECONDS = 8; // 歌詞固定提前 20 秒
function setupLyricDanmaku(){
  const audio=document.getElementById('themeAudio');
  if(!audio || audio.dataset.lyricBound==='1')return;
  audio.dataset.lyricBound='1';
  audio.addEventListener('timeupdate',()=>{
    if(!lyricsEnabled)return;
    const t=audio.currentTime + LYRIC_OFFSET_SECONDS;
    if(audio.currentTime < lastAudioTime-1){lastLyricIndex=-1;clearLyricLayer();}
    lastAudioTime=audio.currentTime;
    for(let i=0;i<LYRIC_LINES.length;i++){
      const line=LYRIC_LINES[i];
      if(i!==lastLyricIndex && t>=line.time && t<(line.end||line.time+4)){
        lastLyricIndex=i;
        spawnLyric(line.text);
        break;
      }
    }
  });
  audio.addEventListener('seeked',()=>{lastLyricIndex=-1;clearLyricLayer();});
  audio.addEventListener('ended',()=>{lastLyricIndex=-1;clearLyricLayer();});
}
function spawnLyric(text){
  const layer=document.getElementById('lyricDanmakuLayer');
  if(!layer || !text)return;
  const el=document.createElement('div');
  el.className='lyric-danmaku'+(Math.random()>.55?' soft':'');
  el.textContent=text;
  el.style.top=(12+Math.random()*66).toFixed(1)+'vh';
  el.style.setProperty('--flyDur',(9+Math.random()*4).toFixed(1)+'s');
  layer.appendChild(el);
  setTimeout(()=>{if(el.parentNode)el.parentNode.removeChild(el)},15000);
}
function clearLyricLayer(){
  const layer=document.getElementById('lyricDanmakuLayer');
  if(layer)layer.innerHTML='';
}
function toggleLyrics(){
  lyricsEnabled=!lyricsEnabled;
  const btn=document.getElementById('lyricBtn');
  if(btn){btn.textContent=lyricsEnabled?'詞':'詞';btn.classList.toggle('on',lyricsEnabled);btn.classList.toggle('off',!lyricsEnabled);}
  if(!lyricsEnabled){clearLyricLayer();toast('歌詞彈幕已關閉');}
  else{lastLyricIndex=-1;toast('歌詞彈幕已開啟');}
}
function testLyricDanmaku(){spawnLyric('想見你. 想見你.. 想見你… 了….');}

const CONFIG={LOCAL_THEME:'assets/audio/dear-ang-theme.mp3',
  APP_VERSION:'20260620_memory_world_v21_opening_countdown_video_lyrics20',
  GAS_API_URL:'https://script.google.com/macros/s/AKfycbzrduB_eXPk6OpqnGPXjNBNQCeUyarzAfki4IL-X_JIVQr7RS9sN5ayyvA2OEaXDXzv/exec',
  GITHUB_THEME_AUDIO:''
};
const PLACE_POINTS=[
  {id:1,title:'等你出來的小門',lat:24.1670447,lng:120.6550652},
  {id:2,title:'第一次陪你搬家',lat:24.1820553,lng:120.5887194},
  {id:3,title:'搬來當鄰居',lat:24.2158341,lng:120.633206},
  {id:4,title:'搬到大雅',lat:24.1790991,lng:120.6668274},
  {id:5,title:'磁鐵',lat:24.143955,lng:120.71775},
  {id:6,title:'第六棵樹',lat:24.11397,lng:120.7823878}
];
let DATA={photos:[],photoGroups:[],songs:[],memories:[],comments:[],theme:null};
let musicWanted=false;

let openingCountdownActive=false;
let openingCountdownTimer=null;
let openingCountdownSeconds=10;

function shuffleOpening(arr){
  arr=(arr||[]).slice();
  for(let i=arr.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [arr[i],arr[j]]=[arr[j],arr[i]];
  }
  return arr;
}
function openingPersonalPhotos(){
  let pool=[];
  try{
    const folders=collectAreaFolders('home','image',[]);
    folders.forEach(f=>pool.push(...(f.items||[])));
  }catch(e){}
  if(!pool.length){
    pool=(DATA.photos||[]).filter(p=>{
      const text=[p.rootKey,p.folderPath,p.path,p.name].join(' ');
      return detectAreaKey(text)==='home';
    });
  }
  if(!pool.length){
    pool=(DATA.photos||[]).filter(p=>{
      const k=String(p.kind||'').toLowerCase();
      const m=String(p.mimeType||'').toLowerCase();
      return k==='image'||m.indexOf('image/')===0;
    });
  }
  const seen={};
  pool=pool.filter(p=>{
    const key=p.id||p.url||p.thumbnailUrl||p.name;
    if(!key||seen[key])return false;
    seen[key]=1;
    return true;
  });
  return shuffleOpening(pool).slice(0,11);
}
function renderOpeningPhotoDraw(){
  const box=document.getElementById('openingPhotoDraw');
  if(!box)return;
  const photos=openingPersonalPhotos();
  let html='';
  for(let i=0;i<11;i++){
    const p=photos[i];
    if(p){
      const sources=driveImageCandidates(p);
      sources.slice(0,2).forEach(preloadImage);
      html+=`<div class="opening-photo-slot" data-no="${String(i+1).padStart(2,'0')}"><img ${imgAttrs(p,`alt="個人照 ${i+1}"`)}></div>`;
    }else{
      html+=`<div class="opening-photo-slot" data-no="${String(i+1).padStart(2,'0')}"><div class="opening-photo-placeholder">等待<br>個人照</div></div>`;
    }
  }
  box.innerHTML=html;
}
function primeThemeBeforeCountdown(){
  const a=document.getElementById('themeAudio');
  if(!a)return;
  setupLyricDanmaku();
  if(!a.src){
    if(CONFIG.LOCAL_THEME)a.src=CONFIG.LOCAL_THEME+'?v='+CONFIG.APP_VERSION;
    else if(CONFIG.GITHUB_THEME_AUDIO)a.src=CONFIG.GITHUB_THEME_AUDIO+'?v='+CONFIG.APP_VERSION;
    else if(DATA.theme&&DATA.theme.streamUrl)a.src=DATA.theme.streamUrl;
  }
  try{
    const oldVol=a.volume || 1;
    a.volume=0;
    const p=a.play();
    if(p&&p.then){
      p.then(()=>{
        setTimeout(()=>{
          try{a.pause();a.currentTime=0;}catch(e){}
          a.volume=oldVol;
        },120);
      }).catch(()=>{a.volume=oldVol;});
    }else{
      setTimeout(()=>{try{a.pause();a.currentTime=0;}catch(e){}a.volume=oldVol;},120);
    }
  }catch(e){}
}
function startOpeningMemoryCountdown(){
  if(openingCountdownActive)return;
  openingCountdownActive=true;
  playUiSound('open');
  primeThemeBeforeCountdown();

  const gate=document.getElementById('gate');
  const overlay=document.getElementById('openingCountdown');
  const video=document.getElementById('openingCountdownVideo');
  if(gate)gate.classList.add('out');
  if(overlay){overlay.classList.remove('done');overlay.classList.add('show');}

  clearInterval(openingCountdownTimer);
  if(video){
    try{
      video.currentTime=0;
      video.muted=false;
      video.volume=1;
    }catch(e){}
    video.onended=()=>finishOpeningMemoryCountdown();
    const p=video.play();
    if(p&&p.catch){
      p.catch(()=>{
        // 若手機擋住影片音訊，改靜音播放倒數；主題曲仍會在結束後播放
        try{video.muted=true;video.play().catch(()=>{});}catch(e){}
      });
    }
  }else{
    openingCountdownTimer=setTimeout(()=>finishOpeningMemoryCountdown(),10000);
  }
}
function finishOpeningMemoryCountdown(){
  const overlay=document.getElementById('openingCountdown');
  const video=document.getElementById('openingCountdownVideo');
  if(video){try{video.pause();video.currentTime=0;}catch(e){}}
  const gate=document.getElementById('gate');
  musicWanted=true;
  const a=document.getElementById('themeAudio');
  if(a)a.volume=1;
  startTheme();
  setTimeout(()=>{
    if(overlay){overlay.classList.add('done');setTimeout(()=>overlay.classList.remove('show','done'),360);}
    if(gate)gate.classList.add('hidden');
    showMiniWorld();
    openingCountdownActive=false;
  },260);
}


let uiAudioCtx=null;
let hintHidden=false;
const CAPSULE_AREAS={
  photo:'華光相館｜有你的時光',
  video:'新時代影音館｜影片',
  home:'中間公寓｜他家',
  music:'金嗓卡拉OK｜他唱的歌',
  food:'美而美早餐店｜食物記憶',
  nav:'公路局｜通往他的路'
};
function setupExperienceLayer(){
  const sc=document.getElementById('scroller');
  const world=document.getElementById('world');
  if(sc&&world){
    const hide=()=>{if(hintHidden)return;hintHidden=true;world.classList.add('hint-muted')};
    sc.addEventListener('scroll',hide,{passive:true,once:true});
    sc.addEventListener('touchstart',hide,{passive:true,once:true});
    sc.addEventListener('wheel',hide,{passive:true,once:true});
  }
  document.addEventListener('click',()=>initUiAudio(),{once:true});
  document.addEventListener('touchstart',()=>initUiAudio(),{once:true,passive:true});
}
function initUiAudio(){
  try{
    const C=window.AudioContext||window.webkitAudioContext;
    if(!C)return;
    if(!uiAudioCtx)uiAudioCtx=new C();
    if(uiAudioCtx.state==='suspended')uiAudioCtx.resume();
  }catch(e){}
}
function playUiSound(type){
  try{
    initUiAudio();
    if(!uiAudioCtx)return;
    const now=uiAudioCtx.currentTime;
    const osc=uiAudioCtx.createOscillator();
    const gain=uiAudioCtx.createGain();
    osc.type='sine';
    if(type==='open'){osc.frequency.setValueAtTime(392,now);osc.frequency.exponentialRampToValueAtTime(660,now+.11);}
    else if(type==='close'){osc.frequency.setValueAtTime(330,now);osc.frequency.exponentialRampToValueAtTime(220,now+.10);}
    else if(type==='slide'){osc.frequency.setValueAtTime(520,now);osc.frequency.exponentialRampToValueAtTime(430,now+.08);}
    else{osc.frequency.setValueAtTime(460,now);}
    gain.gain.setValueAtTime(0.0001,now);
    gain.gain.exponentialRampToValueAtTime(type==='slide'?0.018:0.026,now+.012);
    gain.gain.exponentialRampToValueAtTime(0.0001,now+.12);
    osc.connect(gain);gain.connect(uiAudioCtx.destination);
    osc.start(now);osc.stop(now+.14);
  }catch(e){}
}
function showPreloadStatus(msg){
  const el=document.getElementById('assetPreloadStatus');
  if(!el)return;
  el.textContent=msg||'正在準備回憶…';
  el.classList.add('show');
  clearTimeout(showPreloadStatus._t);
  showPreloadStatus._t=setTimeout(()=>el.classList.remove('show'),1200);
}
function preloadImage(src){
  if(!src)return;
  const img=new Image();
  img.decoding='async';
  img.src=src;
}
function preloadStaticAssets(){
  ['assets/images/memory-world.png?v=20260620-v17','assets/images/ktv-stage.png?v=20260620-v16-stage','assets/images/ktv-remote.png?v=20260620-v16-remote','assets/images/sixth_tree.jpeg?v=20260620-v17'].forEach(preloadImage);
}
function preloadFirstDriveAssets(){
  const first=(DATA.photos||[]).slice(0,8);
  first.forEach(p=>driveImageCandidates(p).slice(0,2).forEach(preloadImage));
}
function preloadAreaAssets(id){
  showPreloadStatus('正在準備 '+(CAPSULE_AREAS[id]||'這一區')+'…');
  try{
    let area=id==='nav'?'road':id;
    if(id==='photo'||id==='home'||id==='food'||id==='nav'){
      const folders=collectAreaFolders(area,'image',[]);
      folders.slice(0,3).forEach(f=>(f.items||[]).slice(0,2).forEach(p=>driveImageCandidates(p).slice(0,2).forEach(preloadImage)));
    }
  }catch(e){}
}
function capsulePrefix(id){return '[CAPSULE:'+id+'] ';}
function capsuleMessages(id){
  const pre=capsulePrefix(id);
  return (DATA.comments||[]).filter(c=>String(c.message||'').indexOf(pre)===0).map(c=>Object.assign({},c,{message:String(c.message||'').slice(pre.length)}));
}
function renderMemoryCapsule(id){
  const page=document.getElementById('page-'+id);
  if(!page)return;
  const body=page.querySelector('.page-body');
  if(!body)return;
  let box=page.querySelector('.memory-capsule');
  if(!box){
    box=document.createElement('section');
    box.className='memory-capsule';
    box.innerHTML=`<h2>時光膠囊</h2>
      <p class="capsule-note">這裡只放這一區的留言。不會自動亂寫故事，內容由你和好友自己留下。</p>
      <div class="capsule-list" id="capsule-list-${id}"></div>
      <div class="capsule-form">
        <input id="capsule-name-${id}" placeholder="名字，可留空">
        <textarea id="capsule-text-${id}" placeholder="寫下這一區想留下的話"></textarea>
        <button onclick="submitMemoryCapsule('${id}')">留下這段回憶</button>
      </div>`;
    body.appendChild(box);
  }
  const list=box.querySelector('#capsule-list-'+id);
  const msgs=capsuleMessages(id);
  list.innerHTML=msgs.length?msgs.map(m=>`<div class="capsule-msg"><b>${esc(m.name||'匿名')}</b>${esc(m.message||'')}</div>`).join(''):`<div class="empty">這一區還沒有留言。</div>`;
}
function submitMemoryCapsule(id){
  const name=(document.getElementById('capsule-name-'+id)||{}).value||'匿名';
  const input=document.getElementById('capsule-text-'+id);
  const text=input?input.value.trim():'';
  if(!text){toast('先寫一點內容',1);return}
  playUiSound('open');
  api({action:'addComment',name:name,message:capsulePrefix(id)+text}).then(r=>{
    if(!r.ok)throw Error(r.error||'留言失敗');
    DATA.comments=r.comments||DATA.comments||[];
    if(input)input.value='';
    renderMemoryCapsule(id);
    toast('已留下');
  }).catch(e=>toast(e.message||'留言失敗',1));
}



const MEMORY_WEATHERS=[
  {key:'sunny',label:'☀️ 晴天',chip:'☀️',bg:'assets/images/weather/day-sunny.png',fx:''},
  {key:'hot',label:'☀️ 炎熱',chip:'☀️',bg:'assets/images/weather/day-sunny.png',fx:'heat'},
  {key:'cloudy',label:'⛅ 多雲',chip:'⛅',bg:'assets/images/weather/day-cloudy.png',fx:''},
  {key:'overcast',label:'☁️ 陰天',chip:'☁️',bg:'assets/images/weather/day-cloudy.png',fx:'haze'},
  {key:'rain',label:'🌧️ 雨天',chip:'🌧️',bg:'assets/images/weather/day-rain.png',fx:'rain'},
  {key:'storm',label:'⛈️ 暴雨',chip:'⛈️',bg:'assets/images/weather/day-storm.png',fx:'storm'},
  {key:'fog',label:'🌫️ 霧',chip:'🌫️',bg:'assets/images/weather/day-storm.png',fx:'fog'},
  {key:'haze',label:'😷 霾',chip:'😷',bg:'assets/images/weather/day-storm.png',fx:'haze'},
  {key:'night',label:'🌙 夜晚',chip:'🌙',bg:'assets/images/weather/night-clear.png',fx:'night'},
  {key:'nightRain',label:'🌧️ 夜雨',chip:'🌧️',bg:'assets/images/weather/night-cloudy.png',fx:'rain night'},
  {key:'snow',label:'❄️ 下雪',chip:'❄️',bg:'assets/images/weather/night-cloudy.png',fx:'snow haze'}
];
let memoryWeatherKey=localStorage.getItem('dearAngMemoryWeather')||'sunny';
function memoryWeatherByKey(key){return MEMORY_WEATHERS.find(w=>w.key===key)||MEMORY_WEATHERS[0];}
function renderMiniWeatherButtons(){
  const box=document.getElementById('miniWeatherButtons');
  if(!box)return;
  box.innerHTML='<button type="button" class="active" id="autoWeatherStatus">讀取 24.113978,120.782379 天氣中…</button>';
}
function setMemoryWeather(key,ev){
  if(ev){ev.stopPropagation();}
  const w=memoryWeatherByKey(key);
  memoryWeatherKey=w.key;
  try{localStorage.setItem('dearAngMemoryWeather',w.key);}catch(e){}
  const stage=document.getElementById('stage');
  if(stage)stage.style.setProperty('--memory-world-bg',`url("${w.bg}?v=20260622-v30")`);
  const miniBg=document.getElementById('miniWorldBg');
  if(miniBg)miniBg.src=w.bg+'?v=20260622-v30';
  const chip=document.getElementById('weatherChip');
  if(chip)chip.textContent=w.chip;
  const miniFx=document.getElementById('miniWorldWeather');
  const worldFx=document.getElementById('worldWeather');
  if(miniFx)miniFx.className='mini-world-weather '+(w.fx||'');
  if(worldFx)worldFx.className='world-weather '+(w.fx||'');
  const autoStatus=document.getElementById('autoWeatherStatus');
  if(autoStatus)autoStatus.classList.add('active');
}
function cycleMemoryWeather(){
  setupWeather(true);
}
function showMiniWorld(){
  // 小世界一出現就先用台灣時間判斷底圖，不等 API；API 回來後再自動覆蓋。
  if(autoWeatherSource!=='auto')applyTimeWeatherFallback();
  renderMiniWeatherButtons();
  setMemoryWeather(memoryWeatherKey,null,autoWeatherSource||'time');
  refreshAutoWeather(false);
  const mini=document.getElementById('miniWorld');
  if(mini){mini.classList.remove('hidden','zooming');}
}
function enterMainWorld(){
  const mini=document.getElementById('miniWorld');
  if(mini){
    mini.classList.add('zooming');
    setTimeout(()=>{mini.classList.add('hidden');mini.classList.remove('zooming');centerWorld();},620);
  }else{
    centerWorld();
  }
}

window.addEventListener('load',()=>{centerWorld();setupExperienceLayer();preloadStaticAssets();renderMiniWeatherButtons();setMemoryWeather(memoryWeatherKey);loadLyricsFromRootFiles().finally(()=>setupLyricDanmaku());loadData();setupWeather();setInterval(()=>setupWeather(true),10*60*1000);renderFood();renderMaps();});
function enterWorld(){startOpeningMemoryCountdown()}
function centerWorld(){const sc=document.getElementById('scroller');setTimeout(()=>{sc.scrollLeft=(sc.scrollWidth-sc.clientWidth)/2;},60)}
function openPage(id){
  playUiSound('open');
  const page=document.getElementById('page-'+id);
  if(!page)return;
  page.classList.remove('closing');
  page.classList.add('show');
  document.body.style.overflow='hidden';
  renderMemoryCapsule(id);
  preloadAreaAssets(id);
}
function closePage(){
  playUiSound('close');
  document.querySelectorAll('.page.show').forEach(p=>{
    p.classList.add('closing');
    setTimeout(()=>{p.classList.remove('show','closing')},180);
  });
  document.body.style.overflow='hidden';
}
function toast(msg,bad){const t=document.getElementById('toast');t.textContent=msg;t.style.background=bad?'#963232':'#5b3f2f';t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2300)}
function api(p){return new Promise((res,rej)=>{let cb='cb'+Date.now()+Math.floor(Math.random()*9e4),u=new URL(CONFIG.GAS_API_URL);Object.keys(p).forEach(k=>u.searchParams.set(k,p[k]));u.searchParams.set('callback',cb);u.searchParams.set('_ts',Date.now());u.searchParams.set('v',CONFIG.APP_VERSION);let sc=document.createElement('script'),tm=setTimeout(()=>done(rej,new Error('讀取逾時')),16000);window[cb]=x=>done(res,x);function done(f,v){clearTimeout(tm);delete window[cb];sc.remove();f(v)}sc.onerror=()=>done(rej,new Error('讀取失敗'));sc.src=u;document.head.appendChild(sc)})}
function loadData(){api({action:'getMemorialData'}).then(r=>{if(!r.ok)throw Error(r.error||'讀取失敗');DATA=r;DATA.photos=orderPhotos(DATA.photos||flatGroups(DATA.photoGroups||[]));renderDynamic();preloadFirstDriveAssets();if(openingCountdownActive)renderOpeningPhotoDraw();startTheme();}).catch(e=>{renderDynamic();toast('雲端資料讀取失敗，先顯示本機內容',1)})}
function detectAreaKey(text){
  text=String(text||'');
  const areas={
    photo:['01_有你的時光','有你的時光','華光','相館'],
    video:['02_影音館','影音館','影片','新時代'],
    home:['03_他的家','他的家','他家','個人','中間公寓'],
    music:['04_金嗓卡拉OK','金嗓','卡拉OK','他唱的歌'],
    food:['05_美而美早餐店','美而美','早餐','食物','飲食','吃過','喜歡吃','推薦'],
    road:['06_通往他的路','通往他的路','公路局','第六棵樹','長眠地','導航'],
    friend:['07_好友投稿','好友投稿','投稿']
  };
  for(const key of Object.keys(areas)){
    if(areas[key].some(k=>text.includes(k)))return key;
  }
  return '';
}
function getRawChildFolders(g){
  const out=[];
  ['children','folders','subfolders','subFolders','childFolders','folderGroups'].forEach(k=>{
    const v=g&&g[k];
    if(Array.isArray(v))out.push(...v);
  });
  return out;
}
function getRawItems(g){
  const out=[];
  ['items','files','photos','videos','audios','childrenFiles'].forEach(k=>{
    const v=g&&g[k];
    if(Array.isArray(v))out.push(...v);
  });
  return out;
}
function normalizeDriveGroups(groups){
  const out=[];
  function walk(g,parentPath='',parentRoot=''){
    if(!g)return;
    const name=String(g.name||g.title||g.folderName||g.displayName||'未命名資料夾');
    const rawPath=String(g.path||g.folderPath||g.fullPath||g.relativePath||'');
    const path=rawPath || (parentPath?parentPath+'/'+name:name);
    const root=parentRoot || detectAreaKey(path) || detectAreaKey(name);
    const items=getRawItems(g).map(it=>Object.assign({},it,{_folderName:name,_folderPath:path,_rootKey:root}));
    out.push({name,path,rootKey:root,items,parentPath});
    getRawChildFolders(g).forEach(ch=>walk(ch,path,root));
  }
  (groups||[]).forEach(g=>walk(g));
  return out;
}
function flatGroups(groups){
  let out=[];
  normalizeDriveGroups(groups).forEach(g=>(g.items||[]).forEach(i=>out.push(i)));
  return out;
}
function orderPhotos(p){const mains=['IMG_4130.jpg','IMG_2818.JPG'].map(x=>x.toLowerCase());let used=new Set(),out=[];mains.forEach(n=>{let i=p.findIndex((x,j)=>!used.has(j)&&String(x.name).toLowerCase()==n);if(i>=0){out.push(p[i]);used.add(i)}});return out.concat(p.filter((_,i)=>!used.has(i)))}
function esc(s){return String(s||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
function mediaKindOf(it){
  const mt=String(it.mimeType||it.type||'').toLowerCase();
  const kind=String(it.kind||'').toLowerCase();
  const name=String(it.name||it.filename||'').toLowerCase();
  if(mt.startsWith('image/')||kind==='image'||/\.(jpg|jpeg|png|gif|webp|avif|heic)$/i.test(name))return 'image';
  if(mt.startsWith('audio/')||kind==='audio'||/\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(name))return 'audio';
  if(mt.startsWith('video/')||kind==='video'||/\.(mp4|mov|m4v|webm)$/i.test(name))return 'video';
  if(it.thumbnailUrl && !it.streamUrl)return 'image';
  if(it.streamUrl)return 'video';
  return 'file';
}
function matchMediaKind(it,kind){
  const k=mediaKindOf(it);
  if(kind==='image')return k==='image';
  if(kind==='video')return k==='video';
  if(kind==='audio')return k==='audio';
  if(kind==='audioVideo')return k==='audio'||k==='video';
  return true;
}
function cleanFolderLabel(path,area){
  let p=String(path||'').replace(/^\/+|\/+$/g,'');
  const rootMap={photo:'01_有你的時光',video:'02_影音館',home:'03_他的家',music:'04_金嗓卡拉OK',food:'05_美而美早餐店',road:'06_通往他的路',friend:'07_好友投稿'};
  const root=rootMap[area]||'';
  if(p===root)return '主資料夾';
  if(root && p.startsWith(root+'/'))p=p.slice(root.length+1);
  return p||'主資料夾';
}
function collectAreaFolders(area,kind,fallbackItems){
  const normalized=normalizeDriveGroups(DATA.photoGroups||[]);
  const buckets=new Map();
  normalized.forEach(g=>{
    let root=g.rootKey || detectAreaKey(g.path) || detectAreaKey(g.name);
    if(root!==area)return;
    const items=(g.items||[]).filter(it=>matchMediaKind(it,kind));
    if(!items.length)return;
    const label=cleanFolderLabel(g.path,area);
    const key=g.path||label;
    if(!buckets.has(key))buckets.set(key,{label,path:g.path,items:[]});
    buckets.get(key).items.push(...items);
  });
  let arr=[...buckets.values()].filter(x=>x.items.length);
  if(!arr.length && Array.isArray(fallbackItems) && fallbackItems.length){
    arr=[{label:'主資料夾',path:'',items:fallbackItems.filter(it=>matchMediaKind(it,kind))}].filter(x=>x.items.length);
  }
  return arr;
}
let ALBUM_STORE={};
let albumTouchY=0, albumTouchX=0;
function attr(s){return esc(s).replace(/&#039;/g,'&#39;')}
function uniqueList(arr){const seen={};return (arr||[]).filter(x=>{x=String(x||'').trim();if(!x||seen[x])return false;seen[x]=1;return true;})}
function driveImageCandidates(p){
  p=p||{};
  const id=p.id?encodeURIComponent(p.id):'';
  return uniqueList([
    p.thumbnailUrl,
    p.url,
    id?`https://drive.google.com/thumbnail?id=${id}&sz=w1600`:'',
    id?`https://lh3.googleusercontent.com/d/${id}=w1600`:'',
    id?`https://drive.google.com/uc?export=view&id=${id}`:'',
    p.streamUrl
  ]);
}
function imgAttrs(p,extra){
  const sources=driveImageCandidates(p);
  const first=sources[0]||'';
  return `src="${esc(first)}" data-img-index="0" data-img-sources='${attr(JSON.stringify(sources))}' onerror="nextImageSource(this)" ${extra||''}`;
}
function nextImageSource(img){
  try{
    const sources=JSON.parse(img.dataset.imgSources||'[]');
    let idx=Number(img.dataset.imgIndex||0)+1;
    if(idx<sources.length){img.dataset.imgIndex=String(idx);img.src=sources[idx];return;}
  }catch(e){}
  const wrap=img.closest('.album-slide,.album-cover,.photo,.album-thumb');
  if(wrap){wrap.innerHTML='<div class="img-fail">這張預覽讀不到，點開或換下一張試試</div>';}
}
function albumCarouselHtml(folders,area){
  const clean=(folders||[]).filter(f=>(f.items||[]).length);
  if(!clean.length)return '<div class="empty">目前沒有照片。</div>';
  return `<div class="album-carousel-shell"><div class="album-carousel-hint">← 左右滑卡片｜往上滑展開照片 →</div><div class="album-carousel">`+
    clean.map((f,i)=>{
      const albumId='album_'+area+'_'+i+'_'+String(f.path||f.label||'').replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g,'_').slice(0,24);
      const items=(f.items||[]).slice(0,240);
      ALBUM_STORE[albumId]={label:f.label||'相簿',path:f.path||'',items:items,index:0};
      const cover=items[0]||{};
      const thumbs=items.slice(0,18).map((p,ti)=>`<button class="album-thumb ${ti===0?'active':''}" id="thumb-${albumId}-${ti}" onclick="setAlbumPhoto('${albumId}',${ti});event.stopPropagation()"><img ${imgAttrs(p)}></button>`).join('');
      return `<article class="album-card" data-album-id="${esc(albumId)}" ontouchstart="albumTouchStart(event)" ontouchend="albumTouchEnd(event)">
        <div class="album-cover" onclick="expandAlbum('${albumId}')"><img ${imgAttrs(cover)}><div class="album-cover-text"><b>${esc(f.label||'相簿')}</b><small>${items.length} 張照片｜往上滑展開</small></div></div>
        <div class="album-summary"><div class="album-path">${esc(f.path||'主資料夾')}</div><button class="album-open" onclick="expandAlbum('${albumId}')">打開這本相簿</button></div>
        <div class="album-detail">
          <div class="album-slide">
            <button class="album-slide-btn prev" onclick="nextAlbumPhoto('${albumId}',-1);event.stopPropagation()">‹</button>
            <img id="album-img-${albumId}" ${imgAttrs(cover)} onclick="openCurrentAlbumPhoto('${albumId}')">
            <button class="album-slide-btn next" onclick="nextAlbumPhoto('${albumId}',1);event.stopPropagation()">›</button>
            <div class="album-counter"><span id="album-name-${albumId}">${esc(cover.name||'')}</span><span id="album-count-${albumId}">1 / ${items.length}</span></div>
          </div>
          <div class="album-thumbs">${thumbs}</div>
        </div>
      </article>`;
    }).join('')+
  `</div></div>`;
}
function photoGridHtml(items){
  const f=[{label:'照片',path:'',items:(items||[])}];
  return albumCarouselHtml(f,'legacy');
}
function expandAlbum(albumId){
  const card=document.querySelector(`[data-album-id="${albumId}"]`);
  if(card){card.classList.add('expanded');card.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});}
  renderAlbumSlide(albumId);
}
function albumTouchStart(e){const t=e.touches&&e.touches[0];if(!t)return;albumTouchY=t.clientY;albumTouchX=t.clientX;}
function albumTouchEnd(e){const t=e.changedTouches&&e.changedTouches[0];if(!t)return;const dy=albumTouchY-t.clientY,dx=Math.abs(albumTouchX-t.clientX);if(dy>34&&dy>dx){const card=e.currentTarget;expandAlbum(card.dataset.albumId);}}
function setAlbumPhoto(albumId,index){
  const album=ALBUM_STORE[albumId];if(!album||!album.items.length)return;
  album.index=(index+album.items.length)%album.items.length;
  renderAlbumSlide(albumId);
}
function nextAlbumPhoto(albumId,delta){playUiSound('slide');const album=ALBUM_STORE[albumId];if(!album)return;setAlbumPhoto(albumId,(album.index||0)+delta);}
function setImgToItem(img,p){
  if(!img)return;
  const sources=driveImageCandidates(p);
  img.dataset.imgSources=JSON.stringify(sources);
  img.dataset.imgIndex='0';
  img.src=sources[0]||'';
}
function renderAlbumSlide(albumId){
  const album=ALBUM_STORE[albumId];if(!album||!album.items.length)return;
  const index=album.index||0,p=album.items[index];
  setImgToItem(document.getElementById('album-img-'+albumId),p);
  const name=document.getElementById('album-name-'+albumId);if(name)name.textContent=p.name||'';
  const count=document.getElementById('album-count-'+albumId);if(count)count.textContent=(index+1)+' / '+album.items.length;
  document.querySelectorAll(`[id^="thumb-${albumId}-"]`).forEach(x=>x.classList.remove('active'));
  const th=document.getElementById('thumb-'+albumId+'-'+index);if(th)th.classList.add('active');
}
function openCurrentAlbumPhoto(albumId){const album=ALBUM_STORE[albumId];if(!album)return;openAlbumLightbox(albumId,album.index||0);}
function openAlbumLightbox(albumId,index){const album=ALBUM_STORE[albumId];if(!album)return;LIGHTBOX_ITEMS=album.items||[];LIGHTBOX_INDEX=index||0;updateLightbox();document.getElementById('lightbox').classList.add('show');}
function mediaListHtml(list){
  return `<div class="video-grid">`+list.map(v=>{
    const k=mediaKindOf(v);
    if(k==='audio')return `<div class="vcard"><audio controls preload="none" src="${esc(v.streamUrl||v.url||'')}"></audio><h3>${esc(v.name||'')}</h3>${v.webViewUrl?`<a href="${esc(v.webViewUrl)}" target="_blank" rel="noopener">另開</a>`:''}</div>`;
    return `<div class="vcard"><video controls playsinline preload="none" poster="${esc(v.thumbnailUrl||'')}"><source src="${esc(v.streamUrl||v.url||'')}" type="${esc(v.mimeType||'video/mp4')}"></video><h3>${esc(v.name||'')}</h3>${v.webViewUrl?`<a href="${esc(v.webViewUrl)}" target="_blank" rel="noopener">另開</a>`:''}</div>`;
  }).join('')+'</div>';
}
function renderFolderedMedia(id,area,kind,emptyMsg,fallbackItems){
  const box=document.getElementById(id);
  if(!box)return;
  const folders=collectAreaFolders(area,kind,fallbackItems);
  if(!folders.length){box.innerHTML='<div class="empty">'+(emptyMsg||'目前沒有資料。請確認 Google Drive 分類資料夾。')+'</div>';return;}
  if(kind==='image'){
    // 照片區改成輪轉卡片，不再用小圖格；每個 Drive 子資料夾就是一本相簿卡片。
    box.innerHTML=albumCarouselHtml(folders,area);
    return;
  }
  box.innerHTML=folders.map(f=>{
    const body=mediaListHtml(f.items);
    const path=f.path?`<div class="folder-path">${esc(f.path)}</div>`:'';
    return `<div class="folder-block"><h3><span>${esc(f.label)}</span><small>${f.items.length} 個檔案</small></h3>${path}${body}</div>`;
  }).join('');
}


/* ===== 金嗓卡拉OK｜歌本 + 遙控器 ===== */
let KTV_SONGS=[];
let ktvInput='';
let ktvSelectedIndex=-1;
function ktvPadNo(i){return String(i+1).padStart(3,'0');}
function renderKtvSongs(){
  const box=document.getElementById('ktvSongbook');
  if(!box)return;
  const folders=collectAreaFolders('music','audioVideo',DATA.songs||[]);
  let songs=[];
  folders.forEach(f=>{
    (f.items||[]).forEach(it=>{
      songs.push(Object.assign({},it,{ktvFolder:f.label||'',ktvPath:f.path||''}));
    });
  });
  KTV_SONGS=songs.map((s,i)=>Object.assign({},s,{ktvNo:ktvPadNo(i)}));
  ktvInput='';
  ktvSelectedIndex=-1;
  ktvUpdateDisplay();
  if(!KTV_SONGS.length){
    box.innerHTML='<div class="empty">目前沒有歌曲。請把他唱的歌放在 Google Drive「04_金嗓卡拉OK」及子資料夾。</div>';
    ktvSetOsd('歌本目前沒有歌曲');
    return;
  }
  box.innerHTML='<div class="ktv-list">'+KTV_SONGS.map((s,i)=>{
    const kind=mediaKindOf(s)==='video'?'影片':'音檔';
    const folder=s.ktvPath||s.ktvFolder||'04_金嗓卡拉OK';
    return `<div class="ktv-row" id="ktv-row-${i}" onclick="ktvSelectNo('${s.ktvNo}')">
      <div class="ktv-num">${s.ktvNo}</div>
      <div class="ktv-title"><b>${esc(s.name||'未命名')}</b><small>${esc(folder)}</small></div>
      <div class="ktv-kind">${kind}</div>
    </div>`;
  }).join('')+'</div>';
  ktvSetOsd('歌本已載入 '+KTV_SONGS.length+' 首｜請輸入編號');
}
function ktvSetOsd(text){const el=document.getElementById('ktvOsd');if(el)el.textContent=text||'';}
function ktvUpdateDisplay(){
  const d=document.getElementById('ktvDisplay');
  const s=document.getElementById('ktvSelectedText');
  if(d)d.textContent=ktvInput?ktvInput.padStart(3,'0'):'---';
  if(s){
    if(ktvSelectedIndex>=0&&KTV_SONGS[ktvSelectedIndex])s.textContent=KTV_SONGS[ktvSelectedIndex].ktvNo+'｜'+(KTV_SONGS[ktvSelectedIndex].name||'');
    else s.textContent='尚未選歌';
  }
  document.querySelectorAll('.ktv-row').forEach(x=>x.classList.remove('active'));
  if(ktvSelectedIndex>=0){const row=document.getElementById('ktv-row-'+ktvSelectedIndex);if(row)row.classList.add('active');}
}
function ktvPress(n){
  if(ktvInput.length>=3)ktvInput='';
  ktvInput=(ktvInput+n).replace(/\D/g,'').slice(0,3);
  ktvSelectedIndex=-1;
  ktvUpdateDisplay();
  ktvSetOsd('已輸入歌號 '+ktvInput.padStart(3,'0')+'，請按「輸入」');
}
function ktvBackspace(){ktvInput=ktvInput.slice(0,-1);ktvSelectedIndex=-1;ktvUpdateDisplay();}
function ktvClear(){ktvInput='';ktvSelectedIndex=-1;ktvUpdateDisplay();ktvSetOsd('已清除，請重新輸入歌號');}
function ktvSelectNo(no){ktvInput=String(no||'').replace(/\D/g,'').slice(0,3);ktvEnter();}
function ktvEnter(){
  if(!KTV_SONGS.length){ktvSetOsd('歌本目前沒有歌曲');return;}
  const no=(ktvInput||'').replace(/\D/g,'').padStart(3,'0');
  const idx=KTV_SONGS.findIndex(x=>x.ktvNo===no);
  if(idx<0){ktvSelectedIndex=-1;ktvUpdateDisplay();ktvSetOsd('找不到歌號 '+no+'，請重新輸入');return;}
  ktvSelectedIndex=idx;
  ktvInput=no;
  ktvUpdateDisplay();
  const row=document.getElementById('ktv-row-'+idx);if(row)row.scrollIntoView({behavior:'smooth',block:'nearest'});
  ktvSetOsd('已選擇 '+no+'｜請按「開始播放」');
}
function ktvStart(){
  if(ktvSelectedIndex<0)ktvEnter();
  if(ktvSelectedIndex<0||!KTV_SONGS[ktvSelectedIndex])return;
  const item=KTV_SONGS[ktvSelectedIndex];
  const src=item.streamUrl||item.url||'';
  if(!src){ktvSetOsd('這首沒有可播放網址');return;}
  const theme=document.getElementById('themeAudio');if(theme)theme.pause();
  const video=document.getElementById('ktvVideo');
  const audio=document.getElementById('ktvAudio');
  const visual=document.getElementById('ktvAudioVisual');
  const title=document.getElementById('ktvAudioTitle');
  if(video){video.pause();video.removeAttribute('src');video.style.display='none';video.load();}
  if(audio){audio.pause();audio.removeAttribute('src');audio.style.display='none';audio.load();}
  if(title)title.textContent=item.name||'他唱的歌';
  const kind=mediaKindOf(item);
  ktvSetOsd('正在播放 '+item.ktvNo+'｜'+(item.name||''));
  if(kind==='video'){
    if(visual)visual.style.display='none';
    if(video){video.src=src;video.style.display='block';video.play().catch(()=>ktvSetOsd('請再按一次螢幕播放'));}
  }else{
    if(visual)visual.style.display='grid';
    if(audio){audio.src=src;audio.style.display='block';audio.play().catch(()=>ktvSetOsd('請再按一次開始或音訊播放鍵'));}
  }
}

function ktvRemoteHint(text){ktvSetOsd(text||'這個按鍵暫不使用');}
function ktvCurrentPlayer(){
  const video=document.getElementById('ktvVideo');
  const audio=document.getElementById('ktvAudio');
  if(video&&video.style.display==='block')return video;
  if(audio&&audio.style.display==='block')return audio;
  return null;
}
function ktvStop(){const p=ktvCurrentPlayer();if(p){p.pause();try{p.currentTime=0;}catch(e){}}ktvSetOsd('已停止');}
function ktvTogglePlayPause(){const p=ktvCurrentPlayer();if(p&&p.src){if(p.paused){p.play().catch(()=>ktvSetOsd('請再按一次播放'));ktvSetOsd('繼續播放');}else{p.pause();ktvSetOsd('已暫停');}return;}ktvStart();}
function ktvReplay(){const p=ktvCurrentPlayer();if(p){try{p.currentTime=0;}catch(e){}p.play().catch(()=>ktvSetOsd('請再按一次重播'));ktvSetOsd('重新播放');}else ktvStart();}
function ktvPrev(){if(!KTV_SONGS.length)return;ktvSelectedIndex=ktvSelectedIndex>0?ktvSelectedIndex-1:KTV_SONGS.length-1;ktvInput=KTV_SONGS[ktvSelectedIndex].ktvNo;ktvUpdateDisplay();ktvStart();}
function ktvNext(){if(!KTV_SONGS.length)return;ktvSelectedIndex=ktvSelectedIndex>=0?(ktvSelectedIndex+1)%KTV_SONGS.length:0;ktvInput=KTV_SONGS[ktvSelectedIndex].ktvNo;ktvUpdateDisplay();ktvStart();}
function ktvVolume(delta){const p=ktvCurrentPlayer();if(!p){ktvSetOsd('尚未播放，無法調整音量');return;}p.volume=Math.max(0,Math.min(1,(p.volume||1)+delta));ktvSetOsd('音量 '+Math.round(p.volume*100)+'%');}

function renderDynamic(){
  renderFolderedMedia('photoGrid','photo','image','請在 Google Drive 建立「01_有你的時光」，底下可再分子資料夾。',DATA.photos||[]);
  renderFolderedMedia('homePhotoGrid','home','image','這裡只讀「03_他的家」及其子資料夾。');
  renderFolderedMedia('foodPhotoGrid','food','image','請在 Google Drive 建立「05_美而美早餐店」，底下可再分子資料夾。');
  renderFolderedMedia('roadPhotoGrid','road','image','請在 Google Drive 建立「06_通往他的路」，底下可再分子資料夾。');
  renderFolderedMedia('videoGrid','video','video','請把影片放在 Google Drive「02_影音館」及其子資料夾。',DATA.memories||[]);
  renderKtvSongs();
}
function renderPhotos(id,items,emptyMsg){let box=document.getElementById(id);items=items||[];if(!box)return;if(!items.length){box.innerHTML='<div class="empty">'+(emptyMsg||'目前沒有資料。請確認 Google Drive 分類資料夾。')+'</div>';return}box.innerHTML=photoGridHtml(items)}
function renderVideos(id,list,empty){let box=document.getElementById(id);if(!box)return;list=list||[];if(!list.length){box.innerHTML='<div class="empty">'+empty+'</div>';return}box.innerHTML=mediaListHtml(list)}
let LIGHTBOX_ITEMS=[];
let LIGHTBOX_INDEX=0;
let lbStartX=0;
function openLightbox(src){
  if(!src)return;
  LIGHTBOX_ITEMS=[{name:'',thumbnailUrl:src,url:src,streamUrl:src}];
  LIGHTBOX_INDEX=0;
  updateLightbox();
  document.getElementById('lightbox').classList.add('show');
}
function updateLightbox(){
  const p=LIGHTBOX_ITEMS[LIGHTBOX_INDEX];
  if(!p)return;
  setImgToItem(document.getElementById('lbImg'),p);
  const cap=document.getElementById('lbCaption');
  if(cap)cap.textContent=(LIGHTBOX_INDEX+1)+' / '+LIGHTBOX_ITEMS.length+(p.name?'｜'+p.name:'');
}
function moveLightbox(delta){
  if(!LIGHTBOX_ITEMS.length)return;
  LIGHTBOX_INDEX=(LIGHTBOX_INDEX+delta+LIGHTBOX_ITEMS.length)%LIGHTBOX_ITEMS.length;
  updateLightbox();
}
function closeLightbox(){
  document.getElementById('lightbox').classList.remove('show');
  document.getElementById('lbImg').src='';
  const cap=document.getElementById('lbCaption');if(cap)cap.textContent='';
  LIGHTBOX_ITEMS=[];LIGHTBOX_INDEX=0;
}
function lbTouchStart(e){const t=e.touches&&e.touches[0];if(t)lbStartX=t.clientX;}
function lbTouchEnd(e){const t=e.changedTouches&&e.changedTouches[0];if(!t)return;const dx=t.clientX-lbStartX;if(Math.abs(dx)>42)moveLightbox(dx>0?-1:1);}
document.addEventListener('keydown',e=>{const lb=document.getElementById('lightbox');if(!lb||!lb.classList.contains('show'))return;if(e.key==='ArrowLeft')moveLightbox(-1);if(e.key==='ArrowRight')moveLightbox(1);if(e.key==='Escape')closeLightbox();});
function startTheme(){
  const a=document.getElementById('themeAudio');
  setupLyricDanmaku();
  // 主題曲固定優先使用 GitHub Pages 本機檔：assets/audio/dear-ang-theme.mp3
  // Google Drive 的 00_主題曲只當備份，不再優先蓋掉 GitHub 音樂。
  if(!a.src){
    if(CONFIG.LOCAL_THEME){
      a.src=CONFIG.LOCAL_THEME+'?v='+CONFIG.APP_VERSION;
    }else if(CONFIG.GITHUB_THEME_AUDIO){
      a.src=CONFIG.GITHUB_THEME_AUDIO+'?v='+CONFIG.APP_VERSION;
    }else if(DATA.theme&&DATA.theme.streamUrl){
      a.src=DATA.theme.streamUrl;
    }
  }
  if(musicWanted){
    if(!a.src && CONFIG.LOCAL_THEME){a.src=CONFIG.LOCAL_THEME+'?v='+CONFIG.APP_VERSION;}
    if(!a.src){toast('主題曲路徑不存在');return;}
    a.play().catch(()=>toast('手機瀏覽器擋住音樂，請再按一次 ♫'));
  }
}
function toggleMusic(){const a=document.getElementById('themeAudio');musicWanted=true;if(a.paused){startTheme();document.getElementById('musicBtn').textContent='♫'}else{a.pause();document.getElementById('musicBtn').textContent='♪'}}
function renderFood(){}
function renderMaps(){
  const box=document.getElementById('mapList');
  if(!box)return;
  box.innerHTML=PLACE_POINTS.map(p=>{
    let q=`${p.lat},${p.lng}`;
    return `<div class="map-row"><b>${p.id}｜${p.title}</b><span>${q}</span><div class="toolbar"><a class="pill soft" href="https://www.google.com/maps?q=${q}" target="_blank" rel="noopener">打開地圖</a><a class="pill soft" href="https://www.google.com/maps?q=${q}&layer=c" target="_blank" rel="noopener">開街景</a></div></div>`;
  }).join('')+`<div class="map-row"><b>導航到第六棵樹</b><span>從你現在的位置出發</span><div class="toolbar"><a class="pill" href="https://www.google.com/maps/dir/?api=1&destination=24.11397,120.7823878&travelmode=driving" target="_blank" rel="noopener">開始導航</a></div></div>`;
}
function weatherKeyFromOpenMeteo(c){
  const code=Number(c.weather_code||0);
  const isDay=Number(c.is_day)===1;
  const temp=Number(c.temperature_2m);
  const wind=Number(c.wind_speed_10m);
  const rain=(Number(c.rain)||0)+(Number(c.showers)||0)+(Number(c.precipitation)||0);
  if(code>=95 || wind>=45) return isDay?'storm':'nightRain';
  if(code>=71 && code<=86) return 'snow';
  if(code===45 || code===48) return 'fog';
  if(code>=51 && code<=67) return rain>=8?'storm':(isDay?'rain':'nightRain');
  if(code>=80 && code<=82) return rain>=8?'storm':(isDay?'rain':'nightRain');
  if(rain>0) return rain>=8?'storm':(isDay?'rain':'nightRain');
  if(!isDay) return 'night';
  if(isFinite(temp) && temp>=32) return 'hot';
  if(code===3) return 'overcast';
  if(code===2) return 'cloudy';
  return 'sunny';
}
function setupWeather(silent=false){
  const label=document.getElementById('weatherLabel');
  const page=document.getElementById('page-nav');
  const status=document.getElementById('autoWeatherStatus');
  const lat=24.113978,lng=120.782379;
  if(status&&!silent)status.textContent='讀取 24.113978,120.782379 天氣中…';
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,is_day,wind_speed_10m,precipitation,rain,showers&timezone=auto`,{cache:'no-store'})
    .then(r=>r.json())
    .then(d=>{
      const c=d.current||{};
      const key=weatherKeyFromOpenMeteo(c);
      setMemoryWeather(key);
      const w=memoryWeatherByKey(key);
      const temp=Number(c.temperature_2m),wind=Number(c.wind_speed_10m);
      const text=`自動天氣：${w.label}｜${isFinite(temp)?temp.toFixed(1):'--'}°C｜風速 ${isFinite(wind)?wind.toFixed(0):'--'} km/h`;
      if(label)label.textContent=`24.113978, 120.782379 現在：${text.replace('自動天氣：','')}`;
      if(page)page.dataset.weather=w.label;
      const chip=document.getElementById('weatherChip');
      if(chip)chip.title='依 24.113978,120.782379 自動天氣｜點一下重新讀取';
      if(status)status.textContent=text;
    })
    .catch(()=>{
      if(label)label.textContent='24.113978, 120.782379 天氣暫時讀取不到，先使用上一次畫面。';
      if(status)status.textContent='天氣暫時讀取不到，先使用上一次畫面';
    });
}
