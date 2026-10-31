const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const nodes=new Map();function node(k){if(!nodes.has(k))nodes.set(k,{innerHTML:'',textContent:'',style:{},value:'',dataset:{},setAttribute(){}});return nodes.get(k)}
const store=new Map();const ctx=vm.createContext({console,structuredClone,crypto,Date,setTimeout(){},location:{hash:''},localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},document:{querySelector:node,querySelectorAll:()=>[]},window:{addEventListener(){},scrollTo(){}},confirm:()=>true});vm.runInContext(fs.readFileSync('site/calendar.js','utf8'),ctx);vm.runInContext(fs.readFileSync('site/app.js','utf8'),ctx);
function run(s){return vm.runInContext(s,ctx)}
for(const page of ['home','about','officers','calendar','gallery','contact','officer','architecture']){run(`location.hash='#${page}';render()`);assert(node('#main').innerHTML.length>300,page)}
assert.equal(run('can(0)'),false);run("role='Webmaster'");assert.equal(run('can(0)&&can(1)&&can(2)'),true);run("role='Officer'");assert.equal(run('can(0)||can(1)||can(2)'),false);
run("role='Webmaster';location.hash='#officer';render()");const before=run('state.events.length');node('#external').onclick();assert.equal(run('state.events.length'),before+1);assert.match(run('events()'),/Google-side sample update/);assert(store.has('cvma-demo-v1'));
assert.equal(run("esc('<script>')"),'&lt;script&gt;');assert.equal(run("state.permissions.Commander.every(x=>!x)"),true);
console.log('PASS: 8 routes, initial role permissions, simulated Google import, persistence, and escaping.');

run("calendarMonth=new Date(2026,10,1,12);location.hash='#calendar';render()");assert.match(node('#main').innerHTML,/November 2026/);assert.match(node('#main').innerHTML,/#calendar\/mtg-2026-11/);assert.equal((node('#main').innerHTML.match(/class="calendar-day /g)||[]).length,35);
node('#month-next').onclick();assert.match(node('#main').innerHTML,/December 2026/);node('#month-prev').onclick();assert.match(node('#main').innerHTML,/November 2026/);
node('#month-today').onclick();assert.equal(run('calendarMonth.getMonth()'),run('currentMonth().getMonth()'));assert.equal(run('calendarMonth.getFullYear()'),run('currentMonth().getFullYear()'));
run("location.hash='#calendar/bnb-2026-10';render()");assert.match(node('#main').innerHTML,/Bikes &amp; Boneheads/);assert.match(node('#main').innerHTML,/Saturday, October 24, 2026/);assert.match(node('#main').innerHTML,/Louisville Harley-Davidson/);assert.match(node('#main').innerHTML,/Registration at 9:00 AM/);
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
run("location.hash='#calendar/mtg-2026-11';render()");{const h=node('#main').innerHTML;assert.match(h,/Saturday, November 21, 2026/);assert.match(h,/10:30–12:30/);assert.match(h,/Bluegrass Harley-Davidson/);assert.match(h,/2755 Terra Crossing Blvd, Louisville, KY 40245/);assert.match(h,/google\.com\/maps\/search/);assert.match(h,/CHAPTER EVENT/);assert.doesNotMatch(h,/Illustrative event/);}
run("location.hash='#calendar/mtg-2026-12';render()");{const h=node('#main').innerHTML;assert.match(h,/Saturday, December 12, 2026/);assert.match(h,/17:00–21:00/);assert.match(h,/AMVETS Post 61/);assert.match(h,/9405 Smyrna Pkwy, Louisville, KY 40229/);}
assert.doesNotMatch(run('JSON.stringify(seed.events)'),/Veterans community ride|Chapter fellowship|Winter service day/);
assert.equal(run('seed.events.every(e=>e.confirmed)'),true,'Every built-in event is a confirmed chapter event');
run("location.hash='#calendar/bnb-2026-10';render()");assert.match(node('#main').innerHTML,/PAST EVENT/);
{const old={events:[{id:'a',title:'Veterans community ride',date:'2026-11-14',time:'09:00',place:'x'}],permissions:{Webmaster:[true,true,true],Commander:[false,false,false],Officer:[false,false,false]},photos:[],log:[]};
 const st=new Map([['cvma-demo-v1',JSON.stringify(old)]]);const c2=vm.createContext({console,structuredClone,crypto,Date,setTimeout(){},location:{hash:''},localStorage:{getItem:k=>st.get(k),setItem:(k,v)=>st.set(k,v)},document:{querySelector:node,querySelectorAll:()=>[]},window:{addEventListener(){},scrollTo(){}},confirm:()=>true});
 vm.runInContext(fs.readFileSync('site/calendar.js','utf8'),c2);vm.runInContext(fs.readFileSync('site/app.js','utf8'),c2);
 assert.equal(vm.runInContext('state.events.map(e=>e.id).join()',c2),'bnb-2026-10,mtg-2026-11,mtg-2026-12','Returning visitor: samples removed, chapter events added');}
console.log('PASS: chapter meetings Nov 21 and Dec 12 shown with times, addresses and map links; returning visitors receive them.');
