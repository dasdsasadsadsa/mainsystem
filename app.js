const $ = (q) => document.querySelector(q);
const state = {
  majors: [], universities: [], selectedMajor: null,
  favorites: new Set(JSON.parse(localStorage.getItem('optionmap:favorites') || '[]')),
  savedMajors: new Set(JSON.parse(localStorage.getItem('optionmap:savedMajors') || '[]')),
  history: JSON.parse(localStorage.getItem('optionmap:history') || '[]')
};

const clusterProfiles = {
  '컴퓨터·AI': {metrics:[92,96,18,91,96], careers:['소프트웨어 개발','AI·데이터','보안·클라우드','제품·기술기획'], insight:'기술 변화가 가장 빠른 대신, 만든 결과물이 곧 경쟁력이 되는 계열입니다.', action:'작은 서비스 3개를 완성하고 공개 포트폴리오로 남기기'},
  '전기·전자·반도체': {metrics:[84,86,33,79,88], careers:['반도체 설계·공정','회로·임베디드','통신·제어','전력·에너지'], insight:'산업 기반이 넓고 하드웨어와 소프트웨어 사이를 오갈 수 있습니다.', action:'회로·프로그래밍·실험 중 하나를 깊게 잡기'},
  '기계·모빌리티': {metrics:[83,73,29,82,86], careers:['설계·해석','로봇·자동화','자동차·항공','생산기술'], insight:'제조업의 여러 산업으로 이동하기 좋은 범용 공학 계열입니다.', action:'CAD·해석·제작 프로젝트를 한 묶음으로 만들기'},
  '화공·소재·에너지': {metrics:[78,79,31,73,84], careers:['공정기술','배터리·소재','에너지','연구개발'], insight:'산업 사이클의 영향을 받지만 소재와 공정의 기반 수요가 넓습니다.', action:'관심 산업 하나를 정해 실험·연구 경험 연결하기'},
  '건축·도시·환경': {metrics:[72,57,44,66,82], careers:['설계·시공','도시·교통','환경·안전','공공기술직'], insight:'현장·설계·공공 분야로 갈라지는 경로가 선명한 계열입니다.', action:'자격 경로와 포트폴리오 경로 중 먼저 갈 축 정하기'},
  '산업·융합공학': {metrics:[89,76,25,91,88], careers:['데이터·최적화','품질·생산','컨설팅','기술기획'], insight:'한 기술에 갇히기보다 시스템 전체를 개선하는 데 강합니다.', action:'데이터 분석과 실제 운영 문제를 한 프로젝트로 연결하기'},
  '수학·자연과학': {metrics:[74,70,20,83,78], careers:['연구·대학원','데이터·금융','교육','기술직'], insight:'기초 학문 자체보다 어떤 응용 분야와 결합하느냐가 선택지를 크게 바꿉니다.', action:'전공 기초와 함께 코딩·통계·실험 중 하나 결합하기'},
  '의약·보건': {metrics:[72,54,95,53,88], careers:['임상·의료','보건·공공','연구','의료산업'], insight:'면허와 자격이 강한 진입 장벽이 되어 경로가 또렷합니다.', action:'직무별 근무환경을 직접 비교하고 실습 경험 확인하기'},
  '경영·경제': {metrics:[92,76,18,94,91], careers:['기획·전략','금융·회계','마케팅·영업','창업·운영'], insight:'산업 선택 폭은 넓지만 경험과 성과로 차이가 크게 벌어집니다.', action:'한 산업을 정하고 숫자로 증명되는 프로젝트 만들기'},
  '사회과학': {metrics:[82,65,27,86,84], careers:['정책·행정','조사·분석','미디어·기획','상담·복지'], insight:'사람과 사회를 읽는 능력을 데이터·콘텐츠·자격과 연결할수록 강해집니다.', action:'조사·글쓰기·데이터 중 하나를 실제 결과물로 쌓기'},
  '법·공공': {metrics:[71,48,74,63,82], careers:['공무원·공공기관','법무·노무','경찰·소방','정책기획'], insight:'시험·자격·채용 경로가 분명해 준비 방향을 잡기 쉽습니다.', action:'희망 직무의 시험·자격·채용 구조를 먼저 역산하기'},
  '인문·언어': {metrics:[76,69,12,86,80], careers:['콘텐츠·출판','교육·번역','기획·마케팅','국제업무'], insight:'언어와 해석 능력에 디지털 도구나 산업 전문성을 붙이면 이동성이 커집니다.', action:'전공 언어를 활용한 공개 콘텐츠 또는 번역 결과물 만들기'},
  '교육': {metrics:[61,48,82,58,83], careers:['교사','교육기획','에듀테크','상담·연구'], insight:'교직 경로와 교육산업 경로를 함께 열어둘 수 있습니다.', action:'교직 이수 조건과 비교과 교육 경험을 동시에 확인하기'},
  '생활·식품·농생명': {metrics:[73,62,41,70,82], careers:['식품·바이오','영양·생활','농생명 연구','상품기획'], insight:'생활과 산업에 밀착되어 있고 자격·연구·상품 경로가 함께 존재합니다.', action:'실험·자격·상품개발 중 관심 축을 빠르게 체험하기'},
  '디자인·콘텐츠': {metrics:[88,91,9,86,98], careers:['브랜딩·UX','영상·콘텐츠','게임·웹툰','제품디자인'], insight:'학점보다 보여줄 수 있는 결과물과 취향의 일관성이 훨씬 중요합니다.', action:'같은 콘셉트로 완성도 높은 작품 5개 묶기'},
  '음악·공연·미술': {metrics:[69,77,8,68,99], careers:['창작·공연','프로덕션','교육','콘텐츠 제작'], insight:'작품·무대·관객 반응이 경력을 직접 만드는 계열입니다.', action:'정기 공개와 협업 횟수를 숫자로 관리하기'},
  '체육·스포츠': {metrics:[71,57,43,67,91], careers:['지도·교육','스포츠산업','재활·트레이닝','공공체육'], insight:'실기 능력에 자격과 현장 경험을 결합할수록 경로가 선명해집니다.', action:'종목 전문성 또는 산업 직무 중 중심축 하나 정하기'}
};
const metricNames = ['직무 확장성','변화 속도','자격 보호력','전공 전환성','실력 영향도'];
const bandLabels = {1:'최상위 도전군',2:'상위 도전군',3:'상위 대학군',4:'중상위 대학군',5:'거점·수도권 주요군',6:'전국 주요 대학군',7:'확장 선택군',8:'폭넓은 선택군'};

function gradeOptions(){return Array.from({length:9},(_,i)=>`<option value="${i+1}">${i+1}등급</option>`).join('')}
['korean','math','english','inquiry1','inquiry2'].forEach(id=>{$(`#${id}`).innerHTML=gradeOptions()});
const defaults={korean:4,math:6,english:3,inquiry1:5,inquiry2:5,region:'all'};
const savedInputs=JSON.parse(localStorage.getItem('optionmap:inputs')||'null')||defaults;
Object.entries(savedInputs).forEach(([k,v])=>{if($(`#${k}`)) $(`#${k}`).value=v});

function flattenMajors(groups){return groups.flatMap((g)=>g.names.map((name,i)=>({id:`${g.cluster}-${i}-${name}`,name,cluster:g.cluster})))}
function scoreValues(){return ['korean','math','english','inquiry1','inquiry2'].map(id=>Number($(`#${id}`).value))}
function targetBand(values=scoreValues()){
  const [k,m,e,q1,q2]=values; const avg=k*.24+m*.30+e*.16+((q1+q2)/2)*.30;
  if(avg<=1.45)return 1;if(avg<=2.15)return 2;if(avg<=2.9)return 3;if(avg<=3.75)return 4;if(avg<=4.75)return 5;if(avg<=5.8)return 6;if(avg<=6.9)return 7;return 8;
}
function matchesMajor(u,major){return u.strengths.includes('all')||u.strengths.includes(major.cluster)||u.strengths.includes(major.name)}
function filteredUniversities(major=state.selectedMajor){const region=$('#region').value;return state.universities.filter(u=>(region==='all'||u.region===region)&&matchesMajor(u,major))}
function saveInputs(){const inputs={};['korean','math','english','inquiry1','inquiry2','region'].forEach(id=>inputs[id]=$(`#${id}`).value);localStorage.setItem('optionmap:inputs',JSON.stringify(inputs))}
function bestBoost(){const values=scoreValues();const labels=['국어','수학','영어','탐구 1','탐구 2'];let best={idx:0,count:0,band:targetBand(values)};values.forEach((g,i)=>{if(g<=1)return;const changed=[...values];changed[i]-=1;const nb=targetBand(changed);const newly=nb<targetBand(values)?filteredUniversities().filter(u=>u.band>=nb&&u.band<targetBand(values)).length:0;if(newly>best.count)best={idx:i,count:newly,band:nb}});return {...best,label:labels[best.idx]}}
function setCountdown(){const exam=new Date('2027-11-18T08:40:00+09:00');const days=Math.max(0,Math.ceil((exam-new Date())/86400000));$('#daysLeft').textContent=days.toLocaleString()}

function renderClusters(){const clusters=[...new Set(state.majors.map(m=>m.cluster))];$('#clusterFilter').innerHTML='<option value="all">전체 계열</option>'+clusters.map(c=>`<option>${c}</option>`).join('')}
function renderMajorChips(){const q=$('#majorSearch').value.trim().toLowerCase();const c=$('#clusterFilter').value;const list=state.majors.filter(m=>(c==='all'||m.cluster===c)&&(!q||m.name.toLowerCase().includes(q)||m.cluster.toLowerCase().includes(q))).slice(0,80);$('#majorChips').innerHTML=list.map(m=>`<button class="chip ${state.selectedMajor?.id===m.id?'active':''}" data-major="${m.id}">${m.name}</button>`).join('');document.querySelectorAll('[data-major]').forEach(btn=>btn.onclick=()=>{state.selectedMajor=state.majors.find(m=>m.id===btn.dataset.major);localStorage.setItem('optionmap:selectedMajor',state.selectedMajor.id);renderAll()})}
function renderSummary(){const b=targetBand();const boost=bestBoost();const possible=filteredUniversities().filter(u=>u.band>=b).length;const near=filteredUniversities().filter(u=>u.band===Math.max(1,b-1)).length;$('#summaryCards').innerHTML=`
  <div class="summary-card"><strong>${possible}</strong><span>현재부터 탐색 가능한 대학</span></div>
  <div class="summary-card"><strong>${near}</strong><span>한 단계 위에서 새로 보이는 대학</span></div>
  <div class="summary-card"><strong>${state.savedMajors.size}</strong><span>저장한 관심 학과</span></div>
  <div class="summary-card boost-card"><strong>${boost.label} 1등급 ↑</strong><span>${boost.count?`${boost.count}개 대학이 새 선택지로 추가됩니다.`:'다음 대학군에 가장 가까운 과목입니다.'}</span><button id="simulateBoost">변화 미리보기</button></div>`;
  $('#simulateBoost').onclick=()=>{const ids=['korean','math','english','inquiry1','inquiry2'];const el=$(`#${ids[boost.idx]}`);if(Number(el.value)>1){el.value=Number(el.value)-1;renderAll();document.querySelector('.result-panel').scrollIntoView({behavior:'smooth'})}}
}
function renderUniversityBands(){const b=targetBand();const candidates=[Math.max(1,b-2),Math.max(1,b-1),b,Math.min(8,b+1)].filter((v,i,a)=>a.indexOf(v)===i);const labels=['가장 높은 목표','다음에 열릴 곳','지금 탐색할 곳','여유 있게 비교'];const uni=filteredUniversities();$('#universityBands').innerHTML=candidates.map((band,i)=>{const list=uni.filter(u=>u.band===band);return `<article class="band"><div class="band__top"><h3>${labels[i]||bandLabels[band]}</h3><span>${bandLabels[band]} · ${list.length}개</span></div><div class="university-list">${list.length?list.map(u=>`<button class="university ${state.favorites.has(u.name)?'favorite':''}" data-university="${u.name}"><b>${u.name}</b><small>${u.region} · ${u.type}</small></button>`).join(''):'<span class="muted">선호 지역을 전국으로 넓히면 더 많은 대학이 나타납니다.</span>'}</div></article>`}).join('');document.querySelectorAll('[data-university]').forEach(btn=>btn.onclick=()=>openUniversity(btn.dataset.university))}
function renderMajorAnalysis(){const m=state.selectedMajor;const p=clusterProfiles[m.cluster]||clusterProfiles['사회과학'];const saved=state.savedMajors.has(m.id);$('#majorAnalysis').innerHTML=`<div class="major-hero"><p class="kicker">${m.cluster}</p><h3>${m.name}</h3><p>${p.insight}</p><div class="career-tags">${p.careers.map(x=>`<span>${x}</span>`).join('')}</div><div class="insight">4년 동안 가장 먼저 챙길 것: ${p.action}</div><button id="saveMajor" class="save-major ${saved?'saved':''}">${saved?'저장됨 · 다시 누르면 해제':'내 학과 비교함에 저장'}</button></div><div class="metric-board"><h3>선택지 움직임</h3>${p.metrics.map((v,i)=>`<div class="metric"><span>${metricNames[i]}</span><div class="track"><i style="width:${v}%"></i></div><b>${v}</b></div>`).join('')}<div class="return-strip"><div class="return-card"><strong>${filteredUniversities().length}개</strong><span>연결 대학</span></div><div class="return-card"><strong>${p.careers.length}개 축</strong><span>대표 진로</span></div><div class="return-card"><strong>${p.metrics[3]>=80?'넓음':p.metrics[3]>=60?'보통':'집중형'}</strong><span>전공 전환성</span></div></div></div>`;$('#saveMajor').onclick=()=>{saved?state.savedMajors.delete(m.id):state.savedMajors.add(m.id);localStorage.setItem('optionmap:savedMajors',JSON.stringify([...state.savedMajors]));renderAll()}}
function renderSources(status){$('#dataStatus').textContent=`${state.universities.length}개 대학 · ${state.majors.length}개 학과`;$('#sourceList').innerHTML=status.sources.map(s=>`<div class="source-item"><strong>${s.name}</strong><span>${s.detail}</span></div>`).join('')+`<div class="source-item"><strong>최근 갱신</strong><span>${status.updatedAt}</span></div>`}
function renderDock(){let dock=$('.saved-dock');if(!dock){dock=document.createElement('button');dock.className='saved-dock';document.body.appendChild(dock)}dock.innerHTML=`비교함 <b>${state.savedMajors.size}</b> · 즐겨찾기 <b>${state.favorites.size}</b>`;dock.onclick=openSaved}
function renderAll(){saveInputs();renderMajorChips();renderSummary();renderUniversityBands();renderMajorAnalysis();renderDock()}
function openUniversity(name){const u=state.universities.find(x=>x.name===name);const fav=state.favorites.has(name);$('#dialogContent').innerHTML=`<p class="kicker">${u.region} · ${u.type}</p><h2>${u.name}</h2><p>${state.selectedMajor.name} 기준으로 함께 탐색 중인 ${bandLabels[u.band]}입니다.</p><h3>강점으로 연결된 영역</h3><div class="career-tags">${u.strengths.map(s=>`<span>${s==='all'?'다양한 계열':s}</span>`).join('')}</div><button id="favUniversity" class="save-major ${fav?'saved':''}">${fav?'즐겨찾기에서 빼기':'관심 대학으로 저장'}</button>`;$('#favUniversity').onclick=()=>{fav?state.favorites.delete(name):state.favorites.add(name);localStorage.setItem('optionmap:favorites',JSON.stringify([...state.favorites]));$('#majorDialog').close();renderAll()};$('#majorDialog').showModal()}
function openSaved(){const majors=[...state.savedMajors].map(id=>state.majors.find(m=>m.id===id)).filter(Boolean);$('#dialogContent').innerHTML=`<p class="kicker">MY OPTION MAP</p><h2>내 비교함</h2><h3>저장한 학과</h3><div class="major-chips">${majors.length?majors.map(m=>`<button class="chip" data-saved-major="${m.id}">${m.name}</button>`).join(''):'아직 저장한 학과가 없습니다.'}</div><h3>관심 대학</h3><div class="university-list">${[...state.favorites].map(n=>`<button class="university" data-saved-uni="${n}">${n}</button>`).join('')||'아직 저장한 대학이 없습니다.'}</div><button id="saveSnapshot" class="save-major">오늘 성적 변화 저장</button>${state.history.length?`<p>최근 저장: ${state.history.at(-1).date} · ${state.history.at(-1).major}</p>`:''}`;document.querySelectorAll('[data-saved-major]').forEach(b=>b.onclick=()=>{state.selectedMajor=state.majors.find(m=>m.id===b.dataset.savedMajor);$('#majorDialog').close();renderAll()});document.querySelectorAll('[data-saved-uni]').forEach(b=>b.onclick=()=>openUniversity(b.dataset.savedUni));$('#saveSnapshot').onclick=saveSnapshot;$('#majorDialog').showModal()}
function saveSnapshot(){state.history.push({date:new Date().toLocaleDateString('ko-KR'),scores:scoreValues(),major:state.selectedMajor.name,band:targetBand()});state.history=state.history.slice(-20);localStorage.setItem('optionmap:history',JSON.stringify(state.history));$('#saveSnapshot').textContent='오늘 변화 저장 완료'}

$('#dialogClose').onclick=()=>$('#majorDialog').close();$('#majorDialog').addEventListener('click',e=>{if(e.target===$('#majorDialog'))$('#majorDialog').close()});
$('#majorSearch').addEventListener('input',renderMajorChips);$('#clusterFilter').addEventListener('change',renderMajorChips);['korean','math','english','inquiry1','inquiry2','region'].forEach(id=>$(`#${id}`).addEventListener('change',renderAll));
$('#resetBtn').onclick=()=>{Object.entries(defaults).forEach(([k,v])=>$(`#${k}`).value=v);state.favorites.clear();state.savedMajors.clear();localStorage.clear();state.selectedMajor=state.majors.find(m=>m.name==='컴퓨터공학')||state.majors[0];renderAll()};

async function init(){
  const [majorGroups,universities,status]=await Promise.all([
    fetch('./data/majors.json').then(r=>r.json()),fetch('./data/universities.json').then(r=>r.json()),fetch('./data/source_status.json').then(r=>r.json())
  ]);state.majors=flattenMajors(majorGroups);state.universities=universities;const selectedId=localStorage.getItem('optionmap:selectedMajor');state.selectedMajor=state.majors.find(m=>m.id===selectedId)||state.majors.find(m=>m.name==='컴퓨터공학')||state.majors[0];setCountdown();renderClusters();renderSources(status);renderAll()}
init().catch(err=>{console.error(err);$('#dataStatus').textContent='새로고침 필요'});
