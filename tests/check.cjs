const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const nodes=new Map();function node(k){if(!nodes.has(k))nodes.set(k,{innerHTML:'',textContent:'',style:{},value:'',dataset:{},setAttribute(){}});return nodes.get(k)}
const store=new Map();const ctx=vm.createContext({console,structuredClone,crypto,Date,setTimeout(){},location:{hash:''},localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},document:{querySelector:node,querySelectorAll:()=>[]},window:{addEventListener(){},scrollTo(){}},confirm:()=>true});vm.runInContext(fs.readFileSync('site/calendar.js','utf8'),ctx);vm.runInContext(fs.readFileSync('site/app.js','utf8'),ctx);
function run(s){return vm.runInContext(s,ctx)}
for(const page of ['home','about','officers','calendar','gallery','contact','officer','architecture']){run(`location.hash='#${page}';render()`);assert(node('#main').innerHTML.length>300,page)}
assert.equal(run('can(0)'),false);run("role='Webmaster'");assert.equal(run('can(0)&&can(1)&&can(2)'),true);run("role='Officer'");assert.equal(run('can(0)||can(1)||can(2)'),false);
run("role='Webmaster';location.hash='#officer';render()");const before=run('state.events.length');node('#external').onclick();assert.equal(run('state.events.length'),before+1);assert.match(run('events()'),/Google-side sample update/);assert(store.has('cvma-demo-v1'));
assert.equal(run("esc('<script>')"),'&lt;script&gt;');assert.equal(run("state.permissions.Commander.every(x=>!x)"),true);
console.log('PASS: 8 routes, initial role permissions, simulated Google import, persistence, and escaping.');

run("calendarMonth=new Date(2026,10,1,12);location.hash='#calendar';render()");assert.match(node('#main').innerHTML,/November 2026/);assert.match(node('#main').innerHTML,/#calendar\/a/);assert.equal((node('#main').innerHTML.match(/class="calendar-day /g)||[]).length,35);
node('#month-next').onclick();assert.match(node('#main').innerHTML,/December 2026/);node('#month-prev').onclick();assert.match(node('#main').innerHTML,/November 2026/);
node('#month-today').onclick();assert.equal(run('calendarMonth.getMonth()'),run('currentMonth().getMonth()'));assert.equal(run('calendarMonth.getFullYear()'),run('currentMonth().getFullYear()'));
run("location.hash='#calendar/a';render()");assert.match(node('#main').innerHTML,/Veterans community ride/);assert.match(node('#main').innerHTML,/Saturday, November 14, 2026/);assert.match(node('#main').innerHTML,/staging location TBD/);
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
