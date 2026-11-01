const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
function loadContent(){const c={};for(const n of ['home','about','officers','events','albums','contact'])c[n]=JSON.parse(fs.readFileSync(`site/content/${n}.json`,'utf8'));return c}
const nodes=new Map();function node(k){if(!nodes.has(k))nodes.set(k,{innerHTML:'',textContent:'',style:{},value:'',dataset:{},setAttribute(){}});return nodes.get(k)}
const store=new Map();const ctx=vm.createContext({CONTENT:loadContent(),console,structuredClone,crypto,Date,setTimeout(){},location:{hash:''},localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},document:{querySelector:node,querySelectorAll:()=>[]},window:{addEventListener(){},scrollTo(){}},confirm:()=>true});vm.runInContext(fs.readFileSync('site/calendar.js','utf8'),ctx);vm.runInContext(fs.readFileSync('site/app.js','utf8'),ctx);
function run(s){return vm.runInContext(s,ctx)}
for(const page of ['home','about','officers','calendar','gallery','contact','officer','architecture']){run(`location.hash='#${page}';render()`);assert(node('#main').innerHTML.length>300,page)}
assert.equal(run('can(0)'),false);run("role='Webmaster'");assert.equal(run('can(0)&&can(1)&&can(2)'),true);run("role='Officer'");assert.equal(run('can(0)||can(1)||can(2)'),false);
run("role='Webmaster';location.hash='#officer';render()");const before=run('state.events.length');node('#external').onclick();assert.equal(run('state.events.length'),before+1);assert.match(run('events()'),/Google-side sample update/);assert(store.has('cvma-demo-v1'));
assert.equal(run("esc('<script>')"),'&lt;script&gt;');assert.equal(run("state.permissions.Commander.every(x=>!x)"),true);
console.log('PASS: 8 routes, initial role permissions, simulated Google import, persistence, and escaping.');

run("calendarMonth=new Date(2026,10,1,12);location.hash='#calendar';render()");assert.match(node('#main').innerHTML,/November 2026/);assert.match(node('#main').innerHTML,/#calendar\/2026-11-21-monthly-chapter-meeting/);assert.equal((node('#main').innerHTML.match(/class="calendar-day /g)||[]).length,35);
node('#month-next').onclick();assert.match(node('#main').innerHTML,/December 2026/);node('#month-prev').onclick();assert.match(node('#main').innerHTML,/November 2026/);
node('#month-today').onclick();assert.equal(run('calendarMonth.getMonth()'),run('currentMonth().getMonth()'));assert.equal(run('calendarMonth.getFullYear()'),run('currentMonth().getFullYear()'));
run("location.hash='#calendar/2026-10-24-bikes-boneheads';render()");assert.match(node('#main').innerHTML,/Bikes &amp; Boneheads/);assert.match(node('#main').innerHTML,/Saturday, October 24, 2026/);assert.match(node('#main').innerHTML,/Harley-Davidson of Louisville/);assert.match(node('#main').innerHTML,/1700 Arthur St, Louisville, KY 40208/);assert.match(node('#main').innerHTML,/google\.com\/maps\/search/);assert.match(node('#main').innerHTML,/Registration at 9:00 AM/);
run("location.hash='#calendar/missing';render()");assert.match(node('#main').innerHTML,/Event unavailable/);
run("calendarMonth=new Date(2028,1,1,12);location.hash='#calendar';render()");assert.match(node('#main').innerHTML,/2028-02-29/);
console.log('PASS: calendar month navigation, current-month reset, event detail links, missing events, and leap-year dates.');
assert.equal(crypto.createHash('sha256').update(fs.readFileSync('site/assets/odl-approved.png')).digest('hex'),'345c074790e128519d96f75057d9334067a00c3718e53f3eec3304b68a202afe','Approved ODL artwork changed');
run("location.hash='#home';render()");assert.doesNotMatch(node('#main').innerHTML,/data-variant/,'Homepage layout switch must stay removed');assert.match(node('#main').innerHTML,/hero photo/);
console.log('PASS: approved ODL unchanged, motorcycle layout only.');
const footerVersion=(fs.readFileSync('site/index.html','utf8').match(/data-version="(v\d+\.\d+\.\d+)"/)||[])[1];
const changelogVersion=(fs.readFileSync('CHANGELOG.md','utf8').match(/^## (v\d+\.\d+\.\d+)/m)||[])[1];
assert.ok(footerVersion,'Footer version missing');assert.equal(footerVersion,changelogVersion,'Footer version must match newest CHANGELOG entry');
assert.match(fs.readFileSync('site/index.html','utf8'),new RegExp('>Version '+footerVersion.replace(/\./g,'\\.')+'<'),'Footer text must show the same version');
console.log('PASS: footer shows '+footerVersion+', matching CHANGELOG.');
run("calendarMonth=new Date(2026,10,1,12);location.hash='#calendar';render()");assert.match(node('#main').innerHTML,/Monthly Chapter Meeting/);
run("calendarMonth=new Date(2026,11,1,12);location.hash='#calendar';render()");assert.match(node('#main').innerHTML,/Christmas Party/);
run("location.hash='#calendar/2026-11-21-monthly-chapter-meeting';render()");{const h=node('#main').innerHTML;assert.match(h,/Saturday, November 21, 2026/);assert.match(h,/10:30–12:30/);assert.match(h,/Bluegrass Harley-Davidson/);assert.match(h,/2755 Terra Crossing Blvd, Louisville, KY 40245/);assert.match(h,/google\.com\/maps\/search/);assert.match(h,/CHAPTER EVENT/);assert.doesNotMatch(h,/Illustrative event/);}
run("location.hash='#calendar/2026-12-12-monthly-chapter-meeting-christmas-party';render()");{const h=node('#main').innerHTML;assert.match(h,/Saturday, December 12, 2026/);assert.match(h,/17:00–21:00/);assert.match(h,/AMVETS Post 61/);assert.match(h,/9405 Smyrna Pkwy, Louisville, KY 40229/);}
assert.doesNotMatch(run('JSON.stringify(seed.events)'),/Veterans community ride|Chapter fellowship|Winter service day/);
assert.equal(run('seed.events.every(e=>e.confirmed)'),true,'Every built-in event is a confirmed chapter event');
run("location.hash='#calendar/2026-10-24-bikes-boneheads';render()");assert.match(node('#main').innerHTML,/PAST EVENT/);
{const old={events:[{id:'a',title:'Veterans community ride',date:'2026-11-14',time:'09:00',place:'x'}],permissions:{Webmaster:[true,true,true],Commander:[false,false,false],Officer:[false,false,false]},photos:[],log:[]};
 const st=new Map([['cvma-demo-v1',JSON.stringify(old)]]);const c2=vm.createContext({CONTENT:loadContent(),console,structuredClone,crypto,Date,setTimeout(){},location:{hash:''},localStorage:{getItem:k=>st.get(k),setItem:(k,v)=>st.set(k,v)},document:{querySelector:node,querySelectorAll:()=>[]},window:{addEventListener(){},scrollTo(){}},confirm:()=>true});
 vm.runInContext(fs.readFileSync('site/calendar.js','utf8'),c2);vm.runInContext(fs.readFileSync('site/app.js','utf8'),c2);
 assert.equal(vm.runInContext('state.events.map(e=>e.id).join()',c2),'2026-10-17-monthly-chapter-meeting,2026-10-17-annual-chapter-picnic,2026-10-24-bikes-boneheads,2026-11-21-monthly-chapter-meeting,2026-12-12-monthly-chapter-meeting-christmas-party','Returning visitor: samples removed, chapter events added');}
console.log('PASS: chapter meetings Nov 21 and Dec 12 shown with times, addresses and map links; returning visitors receive them.');
run("location.hash='#gallery';render()");assert.match(node('#main').innerHTML,/href="#gallery\/bikes-boneheads"/);assert.match(node('#main').innerHTML,/Bikes &amp; Boneheads/);assert.match(node('#main').innerHTML,/4 photos/);
run("location.hash='#gallery/bikes-boneheads';render()");{const h=node('#main').innerHTML;for(let n=1;n<=4;n++){assert.ok(fs.existsSync(`site/assets/albums/bikes-and-boneheads-2026/photo-${n}.jpg`)&&fs.existsSync(`site/assets/albums/bikes-and-boneheads-2026/photo-${n}-thumb.jpg`),'photo file '+n);assert.match(h,new RegExp(`photo-${n}-thumb\\.jpg`))}assert.match(h,/October 24, 2026/);}
run("location.hash='#gallery/nope';render()");assert.match(node('#main').innerHTML,/Album unavailable/);
run("location.hash='#calendar/2026-10-24-bikes-boneheads';render()");assert.match(node('#main').innerHTML,/View photos/);
console.log('PASS: Bikes & Boneheads album listed, 4 photos present, album page and event link work.');
run("location.hash='#calendar/2026-10-17-monthly-chapter-meeting';render()");{const h=node('#main').innerHTML;assert.match(h,/Saturday, October 17, 2026/);assert.match(h,/10:30 ·/);assert.match(h,/PAST EVENT/);}
run("location.hash='#calendar/2026-10-17-annual-chapter-picnic';render()");{const h=node('#main').innerHTML;assert.match(h,/Annual Chapter Picnic/);assert.match(h,/Saturday, October 17, 2026/);assert.match(h,/PAST EVENT/);assert.match(h,/13:00 ·/);assert.match(h,/Liberty Place/);assert.match(h,/2633 Grant Line Road, New Albany, IN 47150/);assert.match(h,/google\.com\/maps\/search/);}
console.log('PASS: Oct 17 meeting and Oct 17 picnic shown as past events.');
run("location.hash='#gallery';render()");assert.match(node('#main').innerHTML,/Chapter Picnic 2026/);assert.match(node('#main').innerHTML,/17 photos/);assert.match(node('#main').innerHTML,/chapter-picnic\/photo-16-thumb\.jpg/);
run("location.hash='#gallery/chapter-picnic-2026';render()");{const h=node('#main').innerHTML;for(let n=1;n<=17;n++){assert.ok(fs.existsSync(`site/assets/albums/chapter-picnic/photo-${n}.jpg`)&&fs.existsSync(`site/assets/albums/chapter-picnic/photo-${n}-thumb.jpg`),'picnic photo '+n);assert.match(h,new RegExp(`chapter-picnic/photo-${n}-thumb\\.jpg`))}}
run("location.hash='#calendar/2026-10-17-annual-chapter-picnic';render()");assert.match(node('#main').innerHTML,/#gallery\/chapter-picnic/);
console.log('PASS: Chapter Picnic album listed with 17 photos and linked from the picnic event.');
{const src=fs.readFileSync('site/app.js','utf8');assert.match(src,/id="lb-prev"/);assert.match(src,/id="lb-next"/);assert.match(src,/ArrowLeft/);assert.match(src,/ArrowRight/);assert.match(src,/touchend/);}
{const el=()=>{const o={innerHTML:'',className:'',_l:{},addEventListener(t,f){this._l[t]=f},showModal(){},close(){},querySelector(){return {}}};return o};
 const c3=vm.createContext({CONTENT:loadContent(),console,structuredClone,crypto,Date,setTimeout(){},location:{hash:''},localStorage:{getItem:()=>null,setItem(){}},document:{querySelector:node,querySelectorAll:()=>[],createElement:el,body:{append(){}}},window:{addEventListener(){},scrollTo(){}},confirm:()=>true});
 vm.runInContext(fs.readFileSync('site/calendar.js','utf8'),c3);vm.runInContext(fs.readFileSync('site/app.js','utf8'),c3);
 vm.runInContext("var v=openViewer(ALBUMS.find(a=>a.id==='bikes-boneheads'),0)",c3);
 vm.runInContext('v.step(1)',c3);assert.equal(vm.runInContext('v.index',c3),1);vm.runInContext('v.step(-1);v.step(-1)',c3);assert.equal(vm.runInContext('v.index',c3),3,'wraps backwards to last photo');vm.runInContext('v.step(1)',c3);assert.equal(vm.runInContext('v.index',c3),0,'wraps forward to first photo');}
console.log('PASS: photo viewer has previous/next, arrow keys and swipe, and wraps at both ends.');
for (const [id,url] of [['2026-10-17-annual-chapter-picnic','https://libertyplacenewalbany.com/'],['2026-10-24-bikes-boneheads','https://harleydavidsonlouisville.com/'],['2026-10-17-monthly-chapter-meeting','https://bluegrassharleydavidson.com/'],['2026-11-21-monthly-chapter-meeting','https://bluegrassharleydavidson.com/']]){run(`location.hash='#calendar/${id}';render()`);const h=node('#main').innerHTML;assert.ok(h.includes(`href="${url}" target="_blank" rel="noopener"`),id+' venue link');assert.match(h,/Visit .* (website|on Facebook) ↗/)}
run("location.hash='#calendar/2026-12-12-monthly-chapter-meeting-christmas-party';render()");{const h=node('#main').innerHTML;assert.doesNotMatch(h,/facebook\.com|amvets\.org|Visit AMVETS/);assert.match(h,/google\.com\/maps\/search/);}
console.log('PASS: venue websites linked; AMVETS Post 61 shows address and map link only.');
run("location.hash='#officers';render()");{const h=node('#main').innerHTML;
 for (const s of ['Chapter Commander','Donald “Joker” Lamon','mailto:commandercvma.ky1.4@gmail.com','David “Recon” Baird','mailto:Recon.xo.cvma.ky.1.4@gmail.com','Kyle “Dragonsclaw” Ohlmann','mailto:kyle.a.ohlmann@gmail.com','Stuart “Diesel” Rowe','mailto:seccvmaky1.4@gmail.com','Anthony “Ant” Williams','mailto:csaa.cvma.ky1.4@gmail.com','“Speedy”','mailto:PROCVMA1.4@gmail.com','James “Shepherd” Shelby Pruitt','Peter “Gascap” Weintraub','Shepherd · Ski · Caveman','Chapter Webmaster','To be determined'])assert.ok(h.includes(s),'Officers page missing: '+s);
 assert.equal((h.match(/class="card officer"/g)||[]).length,10);assert.doesNotMatch(h,/placeholders/);}
assert.doesNotMatch(fs.readFileSync('site/app.js','utf8'),/[A-Za-z0-9.]+@gmail\.com/,'emails must not appear whole in the source');
console.log('PASS: Officers page shows 10 positions with names and correct email links.');
run("location.hash='#officers';render()");{const h=node('#main').innerHTML;assert.equal((h.match(/class="officer-photo"/g)||[]).length,9,'9 officer photos (all but Road Captains)');assert.ok(fs.existsSync('site/assets/officers/placeholder.svg'));
 const rc=h.split('<article').find(c=>c.includes('Road Captains'));assert.doesNotMatch(rc,/officer-photo/);}
console.log('PASS: placeholder photos on 9 officer cards, none on Road Captains.');
{const h=fs.readFileSync('site/index.html','utf8');for(const f of ['favicon.ico','assets/icons/favicon-32.png','assets/icons/apple-touch-icon.png']){assert.ok(h.includes(`href="${f}"`),'icon link '+f);assert.ok(fs.existsSync('site/'+f),'icon file '+f)}}
console.log('PASS: site icon linked for browser tabs and phone home screens.');
{const c=loadContent();assert.equal(c.officers.length,10);assert.equal(c.events.length,5);assert.equal(c.albums.length,2);
 const yml=fs.readFileSync('.pages.yml','utf8');for(const f of ['home','about','officers','events','albums','contact'])assert.ok(yml.includes(`path: site/content/${f}.json`),'.pages.yml covers '+f);
 for(const a of c.albums)for(const p of a.photos){assert.ok(fs.existsSync('site/'+p.image),p.image);if(p.thumbnail)assert.ok(fs.existsSync('site/'+p.thumbnail),p.thumbnail)}}
assert.equal(run("md('Hello **there** <script>x</script> [site](https://example.com) [bad](javascript:void0)')"),'<p>Hello <strong>there</strong> &lt;script&gt;x&lt;/script&gt; <a href="https://example.com" target="_blank" rel="noopener">site</a> <a href="#">bad</a></p>','editor text is formatted safely');
assert.equal(run("md('- one\\n- two\\n\\n### Head')"),'<ul><li>one</li><li>two</li></ul><h3>Head</h3>');
{const old={events:[{id:'picnic-2026-11',title:'Annual Chapter Picnic',date:'2026-11-17',time:'13:00',place:'x',confirmed:true},{id:'demo-1',title:'Officer demo event',date:'2026-12-01',time:'10:00',place:'y'}],permissions:{Webmaster:[true,true,true],Commander:[false,false,false],Officer:[false,false,false]},photos:[],log:[]};
 const st=new Map([['cvma-demo-v1',JSON.stringify(old)]]);const c5=vm.createContext({CONTENT:loadContent(),console,structuredClone,crypto,Date,setTimeout(){},location:{hash:''},localStorage:{getItem:k=>st.get(k),setItem:(k,v)=>st.set(k,v)},document:{querySelector:node,querySelectorAll:()=>[]},window:{addEventListener(){},scrollTo(){}},confirm:()=>true});
 vm.runInContext(fs.readFileSync('site/calendar.js','utf8'),c5);vm.runInContext(fs.readFileSync('site/app.js','utf8'),c5);
 assert.equal(vm.runInContext("state.events.some(e=>e.date==='2026-11-17')",c5),false,'outdated saved chapter events are dropped');assert.equal(vm.runInContext("state.events.some(e=>e.id==='demo-1')",c5),true,'officer demo events kept');}
console.log('PASS: content files complete, Pages CMS covers every section, editor text formatted safely, saved copies cannot show outdated events.');
run("location.hash='#officer';render()");assert.match(node('#main').innerHTML,/app\.pagescms\.org/);
console.log('PASS: officer demo page points editors to Pages CMS.');
