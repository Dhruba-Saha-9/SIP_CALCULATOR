const $=id=>document.getElementById(id), money=n=>'₹'+Math.round(Number.isFinite(n)?n:0).toLocaleString('en-IN');
const num=id=>Math.max(0,Number($(id).value)||0);
const pct=(r)=>Math.pow(1+r/100,1/12)-1;
function sipProjection(sip,rate,years,step,expense=0,pause=0){
 const months=Math.max(0,Math.floor(years*12)), mr=pct(Math.max(-.99,rate-expense));
 let invested=0,stamp=0,gross=0;
 for(let m=0;m<months;m++){
   let contribution=m<pause?0:sip*Math.pow(1+step/100,Math.floor(m/12));
   let duty=contribution*.00005,cost=contribution-duty;
   invested+=contribution;stamp+=duty;gross+=cost*Math.pow(1+mr,months-m-1);
 }
 const profit=Math.max(0,gross-invested);
 const ltcgTax=Math.max(0,profit-125000)*.125*1.04;
 const stt=gross*.00001;
 const deductions=stamp+stt+ltcgTax;
 return {invested,gross,profit,stamp,stt,ltcgTax,tax:ltcgTax,deductions,net:gross-stt-ltcgTax,monthly:sip};
}
function drawLineChart(el,rows){
 if(!rows.length){$(el).innerHTML='<div class="empty">Set duration above zero to view chart.</div>';return;}
 const w=640,h=210,p=30,max=Math.max(1,...rows.map(r=>Math.max(r.value,r.invested)));
 const x=i=>p+(w-2*p)*(rows.length===1?1:i/(rows.length-1)),y=v=>h-p-(h-2*p)*v/max;
 const path=k=>rows.map((r,i)=>(i?'L':'M')+x(i).toFixed(1)+' '+y(r[k]).toFixed(1)).join(' ');
 $(el).innerHTML=`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Investment growth chart"><line x1="${p}" y1="${y(max/2)}" x2="${w-p}" y2="${y(max/2)}" stroke="#2a3b55" stroke-dasharray="4 5"/><path d="${path('value')}" fill="none" stroke="#70dfaa" stroke-width="4" stroke-linecap="round"/><path d="${path('invested')}" fill="none" stroke="#86b9ff" stroke-width="3" stroke-linecap="round"/><text x="${p}" y="${h-5}" fill="#aab8cd" font-size="11">Year 1</text><text x="${w-p}" y="${h-5}" text-anchor="end" fill="#aab8cd" font-size="11">Year ${rows.length}</text></svg>`;
}
let lastSipRows=[],lastSipResult=null;
function updateSip(){
 const sip=num('sipAmount'),rate=num('sipRate'),years=num('sipYears'),step=num('sipStep'),expense=num('sipExpense'),pause=Math.min(480,num('pauseMonths'));
 $('sipOut').textContent=money(sip);$('sipRateOut').textContent=rate+'%';$('sipYearsOut').textContent=years+' years';$('sipStepOut').textContent=step+'%';$('sipExpenseOut').textContent=expense.toFixed(2)+'%';
 const res=sipProjection(sip,rate,years,step,expense,pause);
 $('sipNet').textContent=money(res.net);$('sipInvested').textContent=money(res.invested);$('sipGross').textContent=money(res.gross);$('sipProfit').textContent=money(res.profit);$('sipDeductions').textContent=money(res.deductions);
 lastSipResult=res;lastSipRows=[];
 const mr=pct(Math.max(-.99,rate-expense));
 for(let y=1;y<=years;y++){let end=y*12,inv=0,val=0;for(let m=0;m<end;m++){let c=m<pause?0:sip*Math.pow(1+step/100,Math.floor(m/12));inv+=c;val+=c*.99995*Math.pow(1+mr,end-m-1);}lastSipRows.push({year:y,monthly:y*12<=pause?0:sip*Math.pow(1+step/100,y-1),invested:inv,value:val});}
 drawLineChart('sipChart',lastSipRows);
 let interval=lastSipRows.filter(r=>r.year%5===0||r.year===years);
 $('sipYearRows').innerHTML=interval.length?interval.map(r=>{let d=Math.max(0,(r.value-r.invested)-125000)*.125*1.04+r.value*.00001;return `<tr><td>${r.year}</td><td>${money(r.monthly)}</td><td>${money(r.invested)}</td><td>${money(r.value)}</td><td>${money(r.value-d)}</td></tr>`}).join(''):'<tr><td colspan="5">Set duration above zero.</td></tr>';
 let returns=[8,10,12,15,18];$('compareRows').innerHTML=returns.map(v=>{let a=sipProjection(sip,v,years,step,expense,pause);return `<tr><td>${v}%</td><td>${money(a.invested)}</td><td>${money(a.gross)}</td><td>${money(a.net)}</td></tr>`}).join('');
}
['sipAmount','sipRate','sipYears','sipStep','sipExpense','pauseMonths'].forEach(id=>$(id).addEventListener('input',updateSip));
$('resetSip').onclick=()=>{['sipAmount','sipRate','sipYears','sipStep','sipExpense','pauseMonths'].forEach(id=>$(id).value=0);updateSip();};

// Tabs
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.id===b.dataset.tab));window.scrollTo({top:0,behavior:'smooth'});}));

// Portfolio, saved locally
let portfolio=[];try{portfolio=JSON.parse(localStorage.getItem('wealthPlannerPortfolio')||'[]')}catch(e){portfolio=[]}
function savePortfolio(){localStorage.setItem('wealthPlannerPortfolio',JSON.stringify(portfolio));renderPortfolio()}
function renderPortfolio(){
 let totalGross=0,invested=0,totalStamp=0,totalStt=0;
 $('portfolioList').innerHTML=portfolio.length?portfolio.map((p,i)=>{
   let r=sipProjection(p.amount,p.rate,p.years,0,0,0);
   totalGross+=r.gross;invested+=r.invested;totalStamp+=r.stamp;totalStt+=r.stt;
   return `<div class="item"><div><strong>${escapeHtml(p.name)}</strong><small>${money(p.amount)}/month · ${p.rate}% · ${p.years} years</small></div><div style="text-align:right"><strong>${money(r.gross)} gross</strong><br><button class="btn small danger" data-remove="${i}">Remove</button></div></div>`;
 }).join(''):'<div class="empty">No investments added yet.</div>';
 const portfolioTax=Math.max(0,totalGross-invested-125000)*.125*1.04;
 const totalDeductions=totalStamp+totalStt+portfolioTax;
 const totalNet=totalGross-totalStt-portfolioTax;
 $('portfolioValue').textContent=money(totalNet);$('portfolioInvested').textContent=money(invested);$('portfolioGross').textContent=money(totalGross);$('portfolioGain').textContent=money(totalGross-invested);$('portfolioDeductions').textContent=money(totalDeductions);
 document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{portfolio.splice(+b.dataset.remove,1);savePortfolio()});
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
$('addInvestment').onclick=()=>{let name=$('pName').value.trim(),amount=num('pAmount'),rate=num('pRate'),years=num('pYears');if(!name||amount<=0||years<=0){alert('Enter a name, monthly SIP and duration above zero.');return;}portfolio.push({name,amount,rate,years});savePortfolio();$('pName').value='';$('pAmount').value='';};
$('clearPortfolio').onclick=()=>{if(confirm('Delete all saved portfolio entries?')){portfolio=[];savePortfolio()}};

// Goal SIP: solve starting SIP by binary search for annual step-up contribution plan.
function goalValue(start,rate,years,step){return sipProjection(start,rate,years,step,0,0).net}
function updateGoal(){
 let target=num('goalTarget'),years=Math.min(50,num('goalYears')),rate=num('goalRate'),step=num('goalStep'),lo=0,hi=Math.max(1,target);
 for(let i=0;i<70;i++){let mid=(lo+hi)/2;if(goalValue(mid,rate,years,step)<target)lo=mid;else hi=mid;}
 let monthly=years>0?hi:0,res=sipProjection(monthly,rate,years,step,0,0);
 $('goalSip').textContent=money(monthly);$('goalInvested').textContent=money(res.invested);$('goalGross').textContent=money(res.gross);$('goalDeductions').textContent=money(res.deductions);$('goalDisplay').textContent=money(target);
}
['goalTarget','goalYears','goalRate','goalStep'].forEach(id=>$(id).addEventListener('input',updateGoal));
function updateLump(){let a=num('lumpAmount'),r=num('lumpRate')/100,y=num('lumpYears'),v=a*Math.pow(1+r,y),gain=Math.max(0,v-a),tax=Math.max(0,gain-125000)*.125*1.04,stt=v*.00001,d=tax+stt;$('lumpValue').textContent=money(v-d);$('lumpGross').textContent=money(v);$('lumpGain').textContent=money(gain);$('lumpDeductions').textContent=money(d)}
['lumpAmount','lumpRate','lumpYears'].forEach(id=>$(id).addEventListener('input',updateLump));

// SWP monthly simulation, month-end withdrawals
function updateSwp(){
 let c=num('swpCorpus'),basis=c,w=num('swpMonthly'),r=pct(num('swpRate')),months=Math.min(720,num('swpYears')*12),total=0,stt=0,runout=null,annualGains={};
 for(let m=1;m<=months;m++){c*=1+r;if(w>0&&c>0){let withdrawal=Math.min(w,c),basisSold=Math.min(basis,basis*(withdrawal/c)),gain=Math.max(0,withdrawal-basisSold),fy=Math.ceil(m/12);annualGains[fy]=(annualGains[fy]||0)+gain;basis-=basisSold;c-=withdrawal;total+=withdrawal;stt+=withdrawal*.00001;if(c<=.005){c=0;basis=0;runout=m;break;}}}
 let tax=Object.values(annualGains).reduce((sum,g)=>sum+Math.max(0,g-125000)*.125*1.04,0),deductions=tax+stt;
 const remainingGain=Math.max(0,c-basis),lastBlock=Math.ceil(months/12),usedExemption=annualGains[lastBlock]||0;
 const remainingLtcgTax=Math.max(0,remainingGain-Math.max(0,125000-usedExemption))*.125*1.04;
 const remainingStt=c*.00001,remainingInHand=Math.max(0,c-remainingLtcgTax-remainingStt);
 $('swpRemaining').textContent=money(remainingInHand);$('swpTotal').textContent=money(total);$('swpDeductions').textContent=money(deductions);$('swpInHand').textContent=money(total-deductions);
 $('swpRunout').textContent=runout?`${runout} months (${(runout/12).toFixed(1)} years)`:'Not within selected period';$('swpStatus').textContent=runout?'Corpus depleted':'Corpus remains';
}
['swpCorpus','swpMonthly','swpRate','swpYears'].forEach(id=>$(id).addEventListener('input',updateSwp));

// Export projection data to CSV
$('exportCsv').onclick=()=>{let rows=[['Year','Monthly SIP','Cumulative invested','Gross corpus','Estimated in-hand'],...lastSipRows.map(r=>{let d=Math.max(0,r.value-r.invested-125000)*.125*1.04+r.value*.00001;return [r.year,Math.round(r.monthly),Math.round(r.invested),Math.round(r.value),Math.round(r.value-d)]})];let csv=rows.map(r=>r.join(',')).join('\n');let blob=new Blob([csv],{type:'text/csv'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='sip-in-hand-projection.csv';a.click();URL.revokeObjectURL(url)};
$('printReport').onclick=()=>window.print();

function estimateNet(gross,basis){
 const gain=Math.max(0,gross-basis);
 return Math.max(0,gross-Math.max(0,gain-125000)*.125*1.04-gross*.00001);
}
function accumulate(current,monthly,years,annualReturn,step){
 const months=Math.max(0,Math.floor(years*12)),mr=pct(annualReturn);
 let gross=current,basis=current;
 for(let m=0;m<months;m++){
   const contribution=monthly*Math.pow(1+step/100,Math.floor(m/12))*.99995;
   gross=gross*(1+mr)+contribution;basis+=contribution;
 }
 const net=estimateNet(gross,basis);
 return {gross,basis,net,deductions:gross-net};
}
function updateFire(){
 const age=num('fireAge'),expenses=num('fireExpenses'),current=num('fireCurrent'),monthly=num('fireMonthly');
 const step=num('fireStep'),ret=num('fireReturn'),infl=num('fireInflation'),swr=Math.max(.1,num('fireSWR'));
 let gross=current,basis=current,found=null,foundData=null;const mr=pct(ret);
 for(let m=1;m<=480;m++){
   const contribution=monthly*Math.pow(1+step/100,Math.floor((m-1)/12))*.99995;
   gross=gross*(1+mr)+contribution;basis+=contribution;
   const years=m/12,futureMonthly=expenses*Math.pow(1+infl/100,years);
   const target=futureMonthly*12/(swr/100),net=estimateNet(gross,basis);
   if(net>=target){found=years;foundData={gross,net,target,futureMonthly};break;}
 }
 // Independently project the full 40-year endpoint for the gap metric.
 let endGross=current,endBasis=current;
 for(let m=1;m<=480;m++){
   const contribution=monthly*Math.pow(1+step/100,Math.floor((m-1)/12))*.99995;
   endGross=endGross*(1+mr)+contribution;
   endBasis+=contribution;
 }
 const endNet=estimateNet(endGross,endBasis);
 const data=foundData||{gross:gross,net:estimateNet(gross,basis),target:expenses*Math.pow(1+infl/100,40)*12/(swr/100),futureMonthly:expenses*Math.pow(1+infl/100,40)};
 const endTarget=expenses*Math.pow(1+infl/100,40)*12/(swr/100);
 $('fireTarget').textContent=money(data.target);
 $('fireTime').textContent=found===null?'Beyond 40 years':`${found.toFixed(1)} years`;
 $('fireAgeResult').textContent=found===null?'Not reached':`${(age+found).toFixed(1)} years`;
 $('fireFutureExpense').textContent=money(data.futureMonthly);
 $('fireCorpus').textContent=money(data.net);
 $('fireGross').textContent=money(data.gross);
 $('fireDeductions').textContent=money(data.gross-data.net);
 $('fireGap').textContent=(endNet-endTarget>=0?'+':'−')+money(Math.abs(endNet-endTarget));
}
['fireAge','fireExpenses','fireCurrent','fireMonthly','fireStep','fireReturn','fireInflation','fireSWR'].forEach(id=>$(id).addEventListener('input',updateFire));

function retirementTarget(monthlyAtRet,yearsRetired,postReturn,inflation){
 const months=Math.max(0,Math.floor(yearsRetired*12)),r=pct(postReturn),g=pct(inflation);
 let corpus=0;
 for(let m=1;m<=months;m++)corpus+=monthlyAtRet*Math.pow(1+g,m-1)/Math.pow(1+r,m);
 return corpus;
}
function updateRetirement(){
 const age=num('retAge'),retAge=num('retAt'),life=num('retLife'),expense=num('retExpense');
 const inflation=num('retInflation'),current=num('retCurrent'),monthly=num('retMonthly'),step=num('retStep');
 const pre=num('retPreReturn'),post=num('retPostReturn');
 const years=Math.max(0,retAge-age),duration=Math.max(0,life-retAge);
 const futureMonthly=expense*Math.pow(1+inflation/100,years);
 const target=retirementTarget(futureMonthly,duration,post,inflation);
 const projected=accumulate(current,monthly,years,pre,step);
 let lo=0,hi=Math.max(1000,target);
 for(let i=0;i<65;i++){
   const mid=(lo+hi)/2;
   if(accumulate(current,mid,years,pre,step).net<target)lo=mid;else hi=mid;
 }
 const required=years>0?hi:0,gap=projected.net-target;
 $('retTarget').textContent=money(target);
 $('retFutureExpense').textContent=money(futureMonthly);
 $('retProjectedNet').textContent=money(projected.net);
 $('retProjectedGross').textContent=money(projected.gross);
 $('retDeductions').textContent=money(projected.deductions);
 $('retGap').textContent=(gap>=0?'+':'−')+money(Math.abs(gap));
 $('retRequiredSip').textContent=money(required);
 $('retDuration').textContent=`${duration} years (${duration*12} months)`;
}
['retAge','retAt','retLife','retExpense','retInflation','retCurrent','retMonthly','retStep','retPreReturn','retPostReturn'].forEach(id=>$(id).addEventListener('input',updateRetirement));

updateSip();renderPortfolio();updateGoal();updateLump();updateSwp();updateFire();updateRetirement();
// Appearance preference: persist the user's theme locally.
(function(){
  const root=document.documentElement;
  const button=document.getElementById('themeToggle');
  const label=document.getElementById('themeLabel');
  if(!button)return;
  let saved='dark';
  try{saved=localStorage.getItem('wealthPlannerTheme')||'dark'}catch(e){}
  function apply(theme){
    root.dataset.theme=theme;
    const light=theme==='light';
    button.innerHTML=(light?'☾':'☼')+' <span id="themeLabel">'+(light?'Dark':'Light')+'</span>';
    button.setAttribute('aria-label',light?'Switch to dark appearance':'Switch to light appearance');
  }
  apply(saved==='light'?'light':'dark');
  button.addEventListener('click',()=>{
    const next=root.dataset.theme==='light'?'dark':'light';
    apply(next);
    try{localStorage.setItem('wealthPlannerTheme',next)}catch(e){}
  });
})();

