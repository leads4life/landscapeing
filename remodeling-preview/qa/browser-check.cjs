const {chromium}=require('playwright');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const routes=['index.html','services.html','kitchen-remodeling.html','bathroom-remodeling.html','whole-home-renovations.html','new-construction.html','portfolio.html','about.html','contact.html'];
 const report={label:'MEASURED',checks:[],errors:[]};
 for(const [device,width,height] of [['desktop',1440,900],['tablet',768,1024],['mobile',390,844]]){
  const page=await browser.newPage({viewport:{width,height}});
  page.on('pageerror',e=>report.errors.push({device,message:e.message}));
  page.on('response',r=>{if(r.status()>=400)report.errors.push({device,url:r.url(),status:r.status()})});
  for(const route of routes){
   await page.goto('http://127.0.0.1:8001/'+route,{waitUntil:'networkidle'});
   await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode()}))});
   const check=await page.evaluate(()=>({title:document.title,h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth>innerWidth,brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).length,main:!!document.querySelector('main')}));
   report.checks.push({device,route,...check});
   if(check.h1!==1||check.overflow||check.brokenImages||!check.main)report.errors.push({device,route,...check});
   await page.screenshot({path:__dirname+'/'+device+'-'+route.replace('.html','.png'),fullPage:true});
  }
  if(device==='mobile'){
   await page.getByRole('button',{name:'Menu',exact:true}).click();
   if(await page.locator('.menu').getAttribute('aria-expanded')!=='true')throw Error('Mobile menu failed');
   await page.keyboard.press('Escape');
   if(await page.locator('.menu').getAttribute('aria-expanded')!=='false')throw Error('Escape failed');
   report.checks.push({device,test:'menu open and Escape close',passed:true});
  }
  await page.goto('http://127.0.0.1:8001/portfolio.html');
  await page.getByRole('button',{name:'Bathrooms',exact:true}).click();
  if(await page.locator('[data-category]:visible').count()!==1)throw Error('Filter failed');
  report.checks.push({device,test:'inspiration filter',passed:true});
  await page.goto('http://127.0.0.1:8001/contact.html');
  await page.getByLabel('Name',{exact:true}).fill('Preview Test');
  await page.getByLabel('Email',{exact:true}).fill('preview@example.test');
  await page.getByLabel('Project type').selectOption({label:'Kitchen remodeling'});
  await page.getByLabel('What would you like to change?').fill('Local demo validation.');
  await page.getByRole('button',{name:'Try the demo form'}).click();
  if(!(await page.locator('#form-status').textContent()).includes('not been sent'))throw Error('Demo status missing');
  report.checks.push({device,test:'demo form clearly states no delivery',passed:true});
  await page.close();
 }
 await browser.close();fs.writeFileSync(__dirname+'/browser-report.json',JSON.stringify(report,null,2));
 console.log(JSON.stringify({checks:report.checks.length,errors:report.errors},null,2));
 if(report.errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
