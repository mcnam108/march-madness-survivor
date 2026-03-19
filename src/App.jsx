import { useState, useMemo, useCallback, useEffect } from "react";

// ============================================================
// TEAM DATABASE — all 68 teams, latest injury data as of 3/18
// ============================================================
const T = {
  "Duke":{s:1,r:"East",k:1,aO:4,aD:2,em:33.5,pa:"mod",oI:"balanced",dI:"man-elite",mo:"hot",inj:[{p:"Caleb Foster",st:"out",im:.12,d:"Broken foot — possible Final Four return"},{p:"Patrick Ngongba II",st:"out",im:.08,d:"Foot soreness — very unlikely R1, targeting R2"}]},
  "UConn":{s:2,r:"East",k:6,aO:28,aD:11,em:25.1,pa:"mod",oI:"balanced",dI:"man-phys",mo:"neut",inj:[{p:"Jaylin Stewart",st:"prob",im:.04,d:"Knee — expected back at some point"}]},
  "Michigan St":{s:3,r:"East",k:9,aO:24,aD:13,em:23.8,pa:"mod",oI:"bscreen",dI:"man-sw",mo:"neut",inj:[]},
  "Kansas":{s:4,r:"East",k:15,aO:18,aD:12,em:21.2,pa:"mod",oI:"guard",dI:"man-elite",mo:"cold",inj:[{p:"Darryn Peterson",st:"prob",im:.05,d:"Availability saga all season"}]},
  "St. John's":{s:5,r:"East",k:21,aO:44,aD:12,em:19.5,pa:"slow",oI:"def2off",dI:"man-press",mo:"hot",inj:[]},
  "Louisville":{s:6,r:"East",k:22,aO:20,aD:25,em:18.8,pa:"fast",oI:"trans",dI:"man-press",mo:"cold",inj:[{p:"Mikel Brown Jr.",st:"out",im:.25,d:"Back — out first weekend min, needs Sweet 16"}]},
  "UCLA":{s:7,r:"East",k:28,aO:35,aD:22,em:17.2,pa:"mod",oI:"balanced",dI:"man-sw",mo:"cold",inj:[{p:"Tyler Bilodeau",st:"quest",im:.18,d:"Knee strain — likely plays, limited"},{p:"Donovan Dent",st:"quest",im:.12,d:"Calf strain — uncertain"}]},
  "Ohio State":{s:8,r:"East",k:31,aO:38,aD:30,em:15.5,pa:"mod",oI:"balanced",dI:"man-std",mo:"hot",inj:[{p:"Devin Chatman",st:"quest",im:.06,d:"Groin"}]},
  "TCU":{s:9,r:"East",k:34,aO:42,aD:23,em:14.8,pa:"slow",oI:"hcourt",dI:"man-phys",mo:"neut",inj:[]},
  "UCF":{s:10,r:"East",k:38,aO:45,aD:35,em:13.2,pa:"fast",oI:"trans",dI:"man-std",mo:"neut",inj:[]},
  "South Florida":{s:11,r:"East",k:46,aO:55,aD:40,em:11.5,pa:"slow",oI:"hcourt",dI:"zone",mo:"hot",inj:[]},
  "N. Iowa":{s:12,r:"East",k:49,aO:62,aD:25,em:10.8,pa:"slow",oI:"grind",dI:"packline",mo:"hot",inj:[]},
  "Cal Baptist":{s:13,r:"East",k:51,aO:58,aD:48,em:9.5,pa:"mod",oI:"3pt",dI:"man-std",mo:"neut",inj:[]},
  "N. Dakota St":{s:14,r:"East",k:55,aO:65,aD:50,em:8.2,pa:"slow",oI:"hcourt",dI:"man-std",mo:"neut",inj:[]},
  "Furman":{s:15,r:"East",k:80,aO:72,aD:88,em:3.5,pa:"fast",oI:"trans",dI:"man-std",mo:"hot",inj:[]},
  "Siena":{s:16,r:"East",k:145,aO:140,aD:135,em:-2.5,pa:"mod",oI:"balanced",dI:"man-std",mo:"hot",inj:[]},
  "Arizona":{s:1,r:"West",k:3,aO:5,aD:3,em:31.2,pa:"fast",oI:"balanced",dI:"man-sw",mo:"hot",inj:[]},
  "Purdue":{s:2,r:"West",k:8,aO:2,aD:36,em:24.2,pa:"slow",oI:"paint",dI:"man-std",mo:"hot",inj:[]},
  "Gonzaga":{s:3,r:"West",k:11,aO:29,aD:9,em:22.5,pa:"mod",oI:"balanced",dI:"man-help",mo:"hot",inj:[{p:"Braden Huff",st:"doubt",im:.15,d:"Knee — out since Jan, maybe later rounds"}]},
  "Arkansas":{s:4,r:"West",k:16,aO:6,aD:46,em:20.5,pa:"fast",oI:"trans",dI:"man-press",mo:"neut",inj:[{p:"Karter Knox",st:"out",im:.10,d:"Torn meniscus — out since mid-Feb"}]},
  "Wisconsin":{s:5,r:"West",k:24,aO:30,aD:62,em:17.8,pa:"slow",oI:"3pt",dI:"man-std",mo:"hot",inj:[{p:"Nolan Winter",st:"prob",im:.03,d:"Minor — expects to play"}]},
  "BYU":{s:6,r:"West",k:25,aO:15,aD:38,em:17.5,pa:"mod",oI:"star",dI:"man-sw",mo:"cold",inj:[{p:"Richie Saunders",st:"out",im:.22,d:"Season-ending torn ACL"}]},
  "Miami FL":{s:7,r:"West",k:27,aO:22,aD:34,em:17.5,pa:"mod",oI:"balanced",dI:"man-sw",mo:"neut",inj:[]},
  "Villanova":{s:8,r:"West",k:33,aO:32,aD:42,em:15.2,pa:"slow",oI:"hcourt",dI:"man-std",mo:"neut",inj:[]},
  "Utah St":{s:9,r:"West",k:32,aO:36,aD:32,em:15.5,pa:"slow",oI:"hcourt",dI:"packline",mo:"hot",inj:[]},
  "Missouri":{s:10,r:"West",k:51,aO:48,aD:55,em:10.2,pa:"mod",oI:"balanced",dI:"man-std",mo:"neut",inj:[]},
  "Texas":{s:11,r:"West",k:42,aO:38,aD:48,em:12.2,pa:"mod",oI:"balanced",dI:"man-std",mo:"hot",inj:[]},
  "High Point":{s:12,r:"West",k:50,aO:52,aD:52,em:10.5,pa:"fast",oI:"trans",dI:"man-press",mo:"hot",inj:[]},
  "Hawaii":{s:13,r:"West",k:54,aO:50,aD:60,em:9.8,pa:"fast",oI:"3pt",dI:"man-std",mo:"hot",inj:[]},
  "Kennesaw St":{s:14,r:"West",k:95,aO:98,aD:92,em:2.2,pa:"slow",oI:"hcourt",dI:"man-std",mo:"neut",inj:[]},
  "Queens":{s:15,r:"West",k:130,aO:125,aD:128,em:-1.5,pa:"mod",oI:"balanced",dI:"man-std",mo:"hot",inj:[]},
  "LIU":{s:16,r:"West",k:155,aO:150,aD:148,em:-4.2,pa:"fast",oI:"trans",dI:"man-std",mo:"hot",inj:[]},
  "Michigan":{s:1,r:"MW",k:2,aO:8,aD:1,em:32.8,pa:"mod",oI:"balanced",dI:"man-elite",mo:"neut",inj:[{p:"L.J. Cason",st:"out",im:.10,d:"Season-ending torn ACL"},{p:"Yaxel Lendeborg",st:"prob",im:.02,d:"Low ankle sprain — expects to play"}]},
  "Iowa St":{s:2,r:"MW",k:7,aO:21,aD:4,em:24.5,pa:"slow",oI:"3pt",dI:"man-press",mo:"hot",inj:[]},
  "Virginia":{s:3,r:"MW",k:13,aO:27,aD:16,em:21.8,pa:"slow",oI:"hcourt",dI:"packline",mo:"hot",inj:[]},
  "Alabama":{s:4,r:"MW",k:17,aO:10,aD:68,em:20.2,pa:"fast",oI:"3pt",dI:"man-gamble",mo:"cold",inj:[{p:"Aden Holloway",st:"out",im:.20,d:"Arrested — felony drug charge, suspended"}]},
  "Texas Tech":{s:5,r:"MW",k:19,aO:12,aD:33,em:19.5,pa:"slow",oI:"balanced",dI:"man-phys",mo:"cold",inj:[{p:"JT Toppin",st:"out",im:.28,d:"Season-ending torn ACL — was 21.8 PPG"},{p:"Christian Anderson",st:"prob",im:.03,d:"Groin — confirmed available"},{p:"LeJuan Watts",st:"prob",im:.02,d:"Foot — expected to play"}]},
  "Tennessee":{s:6,r:"MW",k:14,aO:37,aD:15,em:21.5,pa:"slow",oI:"grind",dI:"man-phys",mo:"neut",inj:[]},
  "Kentucky":{s:7,r:"MW",k:26,aO:25,aD:28,em:17.5,pa:"fast",oI:"trans",dI:"man-sw",mo:"cold",inj:[{p:"Jayden Quaintance",st:"out",im:.06,d:"Knee — played only 4 games all season"}]},
  "Georgia":{s:8,r:"MW",k:30,aO:33,aD:31,em:16.2,pa:"mod",oI:"balanced",dI:"man-std",mo:"neut",inj:[]},
  "Saint Louis":{s:9,r:"MW",k:35,aO:40,aD:35,em:14.5,pa:"mod",oI:"balanced",dI:"man-std",mo:"hot",inj:[]},
  "Santa Clara":{s:10,r:"MW",k:37,aO:23,aD:55,em:13.8,pa:"mod",oI:"3pt",dI:"man-std",mo:"neut",inj:[]},
  "Miami OH":{s:11,r:"MW",k:44,aO:42,aD:48,em:12.2,pa:"mod",oI:"balanced",dI:"man-std",mo:"cold",inj:[]},
  "Akron":{s:12,r:"MW",k:48,aO:50,aD:50,em:11.2,pa:"mod",oI:"3pt",dI:"man-std",mo:"hot",inj:[]},
  "Hofstra":{s:13,r:"MW",k:52,aO:55,aD:52,em:10.2,pa:"fast",oI:"trans",dI:"man-std",mo:"hot",inj:[]},
  "Wright St":{s:14,r:"MW",k:57,aO:60,aD:58,em:8.5,pa:"mod",oI:"balanced",dI:"man-std",mo:"neut",inj:[]},
  "Tenn St":{s:15,r:"MW",k:110,aO:105,aD:112,em:0.5,pa:"fast",oI:"trans",dI:"man-std",mo:"hot",inj:[]},
  "Howard":{s:16,r:"MW",k:120,aO:118,aD:115,em:-0.8,pa:"fast",oI:"guard",dI:"man-std",mo:"hot",inj:[]},
  "Florida":{s:1,r:"South",k:4,aO:9,aD:6,em:28.5,pa:"mod",oI:"balanced",dI:"man-sw",mo:"neut",inj:[]},
  "Houston":{s:2,r:"South",k:5,aO:14,aD:5,em:27.2,pa:"slow",oI:"paint",dI:"man-phys",mo:"hot",inj:[]},
  "Illinois":{s:3,r:"South",k:10,aO:1,aD:28,em:23.5,pa:"fast",oI:"3pt",dI:"man-sw",mo:"neut",inj:[]},
  "Nebraska":{s:4,r:"South",k:14,aO:55,aD:7,em:21.5,pa:"slow",oI:"grind",dI:"man-press",mo:"hot",inj:[]},
  "Vanderbilt":{s:5,r:"South",k:12,aO:7,aD:29,em:22.2,pa:"mod",oI:"balanced",dI:"man-std",mo:"hot",inj:[]},
  "North Carolina":{s:6,r:"South",k:20,aO:16,aD:26,em:19.8,pa:"fast",oI:"trans",dI:"man-std",mo:"cold",inj:[{p:"Caleb Wilson",st:"out",im:.30,d:"Season-ending thumb surgery — was 19.8 PPG"}]},
  "Saint Mary's":{s:7,r:"South",k:23,aO:45,aD:18,em:18.5,pa:"slow",oI:"hcourt",dI:"man-phys",mo:"neut",inj:[]},
  "Clemson":{s:8,r:"South",k:29,aO:34,aD:27,em:16.8,pa:"mod",oI:"balanced",dI:"man-sw",mo:"neut",inj:[{p:"Carter Welling",st:"out",im:.12,d:"Torn ACL in ACC tourney — 10.2 PPG"}]},
  "Iowa":{s:9,r:"South",k:36,aO:26,aD:50,em:14.2,pa:"fast",oI:"3pt",dI:"man-std",mo:"neut",inj:[]},
  "Texas A&M":{s:10,r:"South",k:40,aO:43,aD:40,em:13.5,pa:"mod",oI:"balanced",dI:"man-phys",mo:"neut",inj:[]},
  "VCU":{s:11,r:"South",k:47,aO:52,aD:42,em:11.8,pa:"fast",oI:"trans",dI:"press",mo:"hot",inj:[]},
  "McNeese":{s:12,r:"South",k:47,aO:48,aD:48,em:11.5,pa:"mod",oI:"balanced",dI:"man-std",mo:"hot",inj:[]},
  "Troy":{s:13,r:"South",k:53,aO:56,aD:55,em:9.5,pa:"fast",oI:"trans",dI:"man-std",mo:"hot",inj:[]},
  "Penn":{s:14,r:"South",k:56,aO:58,aD:58,em:8.8,pa:"slow",oI:"hcourt",dI:"man-std",mo:"hot",inj:[{p:"Ethan Roberts",st:"out",im:.25,d:"Concussion — OUT entire tournament per coach"}]},
  "Idaho":{s:15,r:"South",k:100,aO:95,aD:102,em:1.5,pa:"mod",oI:"balanced",dI:"man-std",mo:"hot",inj:[]},
  "Lehigh":{s:16,r:"South",k:148,aO:142,aD:145,em:-3.5,pa:"mod",oI:"balanced",dI:"man-std",mo:"neut",inj:[]},
};

const DAYS = [
  { id:1, label:"Day 1 — Round of 64", date:"Thu, Mar 19", games:[
    {a:"TCU",b:"Ohio State"},{a:"Kansas",b:"Cal Baptist"},{a:"Michigan St",b:"N. Dakota St"},{a:"UConn",b:"Furman"},
    {a:"Georgia",b:"Saint Louis"},{a:"Alabama",b:"Hofstra"},{a:"Virginia",b:"Wright St"},{a:"Iowa St",b:"Tenn St"},
  ]},
  { id:2, label:"Day 2 — Round of 64", date:"Fri, Mar 20", games:[
    {a:"Duke",b:"Siena"},{a:"Louisville",b:"South Florida"},{a:"St. John's",b:"N. Iowa"},{a:"UCLA",b:"UCF"},
    {a:"Michigan",b:"Howard"},{a:"Texas Tech",b:"Akron"},{a:"Tennessee",b:"Miami OH"},{a:"Kentucky",b:"Santa Clara"},
    {a:"Arizona",b:"LIU"},{a:"Villanova",b:"Utah St"},{a:"Wisconsin",b:"High Point"},{a:"Arkansas",b:"Hawaii"},
    {a:"BYU",b:"Texas"},{a:"Gonzaga",b:"Kennesaw St"},{a:"Miami FL",b:"Missouri"},{a:"Purdue",b:"Queens"},
    {a:"Florida",b:"Lehigh"},{a:"Clemson",b:"Iowa"},{a:"Vanderbilt",b:"McNeese"},{a:"Nebraska",b:"Troy"},
    {a:"North Carolina",b:"VCU"},{a:"Illinois",b:"Penn"},{a:"Saint Mary's",b:"Texas A&M"},{a:"Houston",b:"Idaho"},
  ]},
  { id:3, label:"Day 3 — Round of 32", date:"Sat, Mar 21", games:[] },
  { id:4, label:"Day 4 — Round of 32", date:"Sun, Mar 22", games:[] },
  { id:5, label:"Day 5 — Sweet 16", date:"Thu, Mar 27", games:[] },
  { id:6, label:"Day 6 — Sweet 16", date:"Fri, Mar 28", games:[] },
  { id:7, label:"Day 7 — Elite 8 ★", date:"Sat–Sun, Mar 29–30", games:[], combined:true, note:"Combined pool: pick from any E8 game" },
  { id:8, label:"Day 8 — Elite 8 ★", date:"Sat–Sun, Mar 29–30", games:[], combined:true, note:"Combined pool: pick from any E8 game" },
  { id:9, label:"Day 9 — Final Four", date:"Sat, Apr 4", games:[] },
  { id:10, label:"Day 10 — Championship", date:"Mon, Apr 6", games:[] },
];

// Style matchup matrix
const SM={"zone_bscreen":-4.5,"packline_trans":-3.5,"press_guard":3.5,"man-press_3pt":-2,"man-phys_trans":-2.5,"man-elite_3pt":2.5,"packline_3pt":-3,"man-gamble_hcourt":-2,"zone_3pt":-4,"man-phys_paint":-1.5,"man-sw_star":2};
function styleMod(a,b){let m=0;const k1=`${a.dI}_${b.oI}`,k2=`${b.dI}_${a.oI}`;if(SM[k1])m+=SM[k1];if(SM[k2])m-=SM[k2];if(a.pa==="slow"&&b.pa==="fast")m+=1.5;if(a.pa==="fast"&&b.pa==="slow")m-=1.5;return m;}
function injPen(t){return(t.inj||[]).reduce((s,i)=>{if(i.st==="out")return s+i.im*100;if(i.st==="doubt")return s+i.im*80;if(i.st==="quest")return s+i.im*50;if(i.st==="prob")return s+i.im*15;return s;},0);}
function power(n){const t=T[n];if(!t)return 0;return Math.max(0,(180-t.k))*0.4+((60-Math.min(t.aO,60))+(60-Math.min(t.aD,60)))*0.25+(t.mo==="hot"?4:t.mo==="cold"?-4:0)-injPen(t);}
function winPct(a,b){const ta=T[a],tb=T[b];if(!ta||!tb)return 50;let d=power(a)-power(b)+styleMod(ta,tb);return Math.round(100/(1+Math.pow(10,-d/18)));}

function optScore(name,opp,daysLeft,used){
  const t=T[name];if(!t||used.includes(name))return-999;
  const wp=winPct(name,opp)/100, sv=t.s;
  const futureDiscount=daysLeft>5?(16-t.s)/15*0.25:0;
  const safetyW=daysLeft<=3?2.0:daysLeft<=5?1.3:0.85;
  const eff=(sv*wp*safetyW)-(futureDiscount*10);
  return wp>=0.65?eff:eff-100;
}

function InjuryRefresher({onUpdate}){
  const[loading,setLoading]=useState(false);
  const[lastRefresh,setLastRefresh]=useState(null);
  const refresh=async()=>{
    setLoading(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,
          tools:[{type:"web_search_20250305",name:"web_search"}],
          messages:[{role:"user",content:"Search for the very latest NCAA men's basketball tournament injuries today. List each injured player, their team, status (out/doubtful/questionable/probable), and brief description. Only tournament teams. Return ONLY a JSON array like: [{\"team\":\"Duke\",\"player\":\"Caleb Foster\",\"status\":\"out\",\"detail\":\"broken foot\"}]. No other text."}]
        })
      });
      const data=await res.json();
      const text=data.content?.map(c=>c.text||"").join("")||"";
      try{const parsed=JSON.parse(text.replace(/```json|```/g,"").trim());onUpdate(parsed);setLastRefresh(new Date().toLocaleTimeString());}
      catch{setLastRefresh("Updated (check console)");}
    }catch(e){console.error(e);setLastRefresh("Error fetching");}
    setLoading(false);
  };
  return(
    <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
      <button onClick={refresh} disabled={loading} style={{background:"#1a1a3e",border:"1px solid #2a2a5e",borderRadius:"6px",padding:"5px 10px",color:"#a5b4fc",fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",opacity:loading?0.5:1}}>
        {loading?"⏳ Searching...":"🔄 Live Injury Update"}
      </button>
      {lastRefresh&&<span style={{fontSize:"10px",color:"#64748b"}}>{lastRefresh}</span>}
    </div>
  );
}

function GameCard({game,used,dayPick,onPick,result,onResult,daysLeft}){
  const{a,b}=game;const wpA=winPct(a,b),wpB=100-wpA;
  const aUsed=used.includes(a),bUsed=used.includes(b);
  const resolved=!!result;
  const scoreA=!aUsed?optScore(a,b,daysLeft,used):-999;
  const scoreB=!bUsed?optScore(b,a,daysLeft,used):-999;
  const best=scoreA>scoreB?a:scoreB>scoreA?b:null;
  return(
    <div style={{background:"#0a0a14",border:"1px solid #1a1a3e",borderRadius:"10px",padding:"8px",borderLeft:(dayPick===a||dayPick===b)?"3px solid #22c55e":"3px solid transparent",opacity:resolved?0.55:1}}>
      {[{n:a,wp:wpA,u:aUsed},{n:b,wp:wpB,u:bUsed}].map(({n,wp,u},i)=>{
        const t=T[n];const hasInj=t?.inj?.some(x=>x.st==="out"||x.st==="doubt");
        return(
          <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 8px",borderRadius:"6px",gap:"6px",flexWrap:"wrap",marginBottom:"2px",
            background:dayPick===n?"linear-gradient(135deg,#0d3320,#14532d)":result===n?"#0a1a14":(result&&result!==n)?"#1a0808":"#0f0f1e",
            border:best===n&&!dayPick&&!resolved?"1px solid #a78bfa":dayPick===n?"1px solid #22c55e":"1px solid #1a1a3e"}}>
            <div style={{display:"flex",alignItems:"center",gap:"6px",flex:1,minWidth:0}}>
              <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:"22px",height:"22px",borderRadius:"4px",fontSize:"11px",fontWeight:700,color:"#e2e2f0",fontFamily:"'JetBrains Mono',monospace",flexShrink:0,background:t?.s<=4?"#1e3a5f":t?.s<=8?"#1a1a3e":"#2a1a0a"}}>{t?.s}</span>
              <span style={{fontWeight:600,fontSize:"13px",color:result===n?"#22c55e":(result&&result!==n)?"#ef4444":"#e2e2f0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n}</span>
              {u&&<span style={{background:"#7f1d1d",color:"#fca5a5",fontSize:"8px",fontWeight:700,padding:"1px 4px",borderRadius:"3px"}}>USED</span>}
              {hasInj&&<span style={{fontSize:"11px"}}>⚠️</span>}
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"6px",flexShrink:0}}>
              <div style={{width:"50px",height:"5px",background:"#1a1a3e",borderRadius:"3px",overflow:"hidden"}}><div style={{height:"100%",borderRadius:"3px",width:`${wp}%`,background:wp>=75?"#22c55e":wp>=60?"#eab308":"#ef4444"}}/></div>
              <span style={{fontSize:"11px",fontWeight:700,fontFamily:"'JetBrains Mono',monospace",width:"32px",textAlign:"right",color:wp>=75?"#22c55e":wp>=60?"#eab308":"#ef4444"}}>{wp}%</span>
              {!u&&!resolved&&<span style={{fontSize:"10px",color:"#fbbf24",fontFamily:"'JetBrains Mono',monospace"}}>+{t?.s}pt</span>}
              {!u&&!resolved&&<button onClick={()=>onPick(n)} style={{border:"1px solid #3a3a5e",borderRadius:"5px",padding:"3px 10px",fontSize:"10px",fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif",background:dayPick===n?"#22c55e":"#2a2a4a",color:dayPick===n?"#000":"#e2e2f0"}}>{dayPick===n?"✓":"Pick"}</button>}
            </div>
          </div>);
      })}
      {!resolved&&<div style={{display:"flex",alignItems:"center",gap:"5px",padding:"4px 6px 0",flexWrap:"wrap"}}>
        <span style={{fontSize:"10px",color:"#475569"}}>Result:</span>
        <button onClick={()=>onResult(game,a)} style={{border:"1px solid #22c55e44",borderRadius:"4px",padding:"2px 8px",fontSize:"9px",fontWeight:600,cursor:"pointer",color:"#22c55e",background:"#0d3320",fontFamily:"'Outfit',sans-serif"}}>{a} won</button>
        <button onClick={()=>onResult(game,b)} style={{border:"1px solid #22c55e44",borderRadius:"4px",padding:"2px 8px",fontSize:"9px",fontWeight:600,cursor:"pointer",color:"#22c55e",background:"#0d3320",fontFamily:"'Outfit',sans-serif"}}>{b} won</button>
      </div>}
      {resolved&&<div style={{padding:"3px 8px",fontSize:"11px",color:"#22c55e"}}>✓ {result} advanced</div>}
      {best&&!dayPick&&!resolved&&<div style={{padding:"5px 8px",fontSize:"10px",color:"#c4b5fd",background:"#1a1230",borderRadius:"0 0 8px 8px",marginTop:"2px"}}>💡 <strong>{best}</strong> — {winPct(best,best===a?b:a)}% win × {T[best]?.s} seed pts = best efficiency</div>}
    </div>
  );
}

export default function App(){
  const[activeDay,setActiveDay]=useState(()=>{try{return JSON.parse(localStorage.getItem("sv_activeDay"))||1;}catch{return 1;}});
  const[activeEntry,setActiveEntry]=useState(()=>{try{return JSON.parse(localStorage.getItem("sv_activeEntry"))||1;}catch{return 1;}});
  const[entries,setEntries]=useState(()=>{try{return JSON.parse(localStorage.getItem("sv_entries"))||{1:{picks:{},results:{},eliminated:false},2:{picks:{},results:{},eliminated:false}};}catch{return{1:{picks:{},results:{},eliminated:false},2:{picks:{},results:{},eliminated:false}};}});

  // Persist to localStorage on every change
  useEffect(()=>{try{localStorage.setItem("sv_entries",JSON.stringify(entries));}catch{}},[entries]);
  useEffect(()=>{try{localStorage.setItem("sv_activeDay",JSON.stringify(activeDay));}catch{}},[activeDay]);
  useEffect(()=>{try{localStorage.setItem("sv_activeEntry",JSON.stringify(activeEntry));}catch{}},[activeEntry]);

  const entry=entries[activeEntry];
  const used=useMemo(()=>Object.values(entry.picks).filter(Boolean),[entry.picks]);
  const seedPts=useMemo(()=>used.reduce((s,n)=>s+(T[n]?.s||0),0),[used]);
  const daysLeft=10-activeDay+1;
  const day=DAYS.find(d=>d.id===activeDay);

  const handlePick=useCallback((team)=>{
    setEntries(prev=>({...prev,[activeEntry]:{...prev[activeEntry],picks:{...prev[activeEntry].picks,[activeDay]:prev[activeEntry].picks[activeDay]===team?null:team}}}));
  },[activeEntry,activeDay]);

  const handleResult=useCallback((game,winner)=>{
    const key=`${game.a}_${game.b}`;
    setEntries(prev=>{
      const u={...prev};
      [1,2].forEach(eid=>{
        u[eid]={...u[eid],results:{...u[eid].results,[key]:winner}};
        Object.values(u[eid].picks).forEach(pick=>{
          if((pick===game.a||pick===game.b)&&pick!==winner)u[eid]={...u[eid],eliminated:true};
        });
      });
      return u;
    });
  },[]);

  const handleInjuryUpdate=useCallback((data)=>{
    if(!Array.isArray(data))return;
    data.forEach(({team,player,status,detail})=>{
      if(T[team]){
        const stMap={out:"out",doubtful:"doubt",questionable:"quest",probable:"prob"};
        const idx=T[team].inj.findIndex(i=>i.p===player);
        const ni={p:player,st:stMap[status]||"quest",im:0.10,d:detail||""};
        if(idx>=0)T[team].inj[idx]={...T[team].inj[idx],st:ni.st,d:ni.d};
        else T[team].inj.push(ni);
      }
    });
  },[]);

  const handleReset=useCallback(()=>{
    if(window.confirm(`Reset Entry ${activeEntry}? This clears all picks and results for this entry.`)){
      setEntries(prev=>({...prev,[activeEntry]:{picks:{},results:{},eliminated:false}}));
    }
  },[activeEntry]);

  return(
    <div style={{fontFamily:"'Outfit',sans-serif",background:"linear-gradient(180deg,#08080f,#0c0c1a)",minHeight:"100vh",color:"#e2e2f0"}}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet"/>
      <header style={{background:"linear-gradient(135deg,#0a0a18,#1a0a2a)",borderBottom:"1px solid #2a1a3e",padding:"14px 16px",display:"flex",alignItems:"center",gap:"12px",flexWrap:"wrap"}}>
        <div style={{flex:1}}>
          <h1 style={{margin:0,fontSize:"20px",fontWeight:800,letterSpacing:"2px",background:"linear-gradient(135deg,#a5b4fc,#c084fc)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>SURVIVOR POOL OPTIMIZER</h1>
          <p style={{margin:"2px 0 0",color:"#64748b",fontSize:"11px"}}>March Madness 2026 • 10 days • 2 entries • Higher seed pts wins tiebreaker • 💾 Auto-saves in browser</p>
        </div>
        <InjuryRefresher onUpdate={handleInjuryUpdate}/>
        <button onClick={handleReset} style={{background:"#1a1a2e",border:"1px solid #2a2a3e",borderRadius:"6px",padding:"5px 10px",color:"#94a3b8",fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>↺ Reset Entry</button>
      </header>

      <div style={{display:"flex",borderBottom:"1px solid #1a1a3e"}}>
        {[1,2].map(eid=>(
          <button key={eid} onClick={()=>setActiveEntry(eid)} style={{flex:1,padding:"10px",border:"none",cursor:"pointer",fontSize:"13px",fontWeight:700,fontFamily:"'Outfit',sans-serif",textAlign:"center",
            background:activeEntry===eid?"#1a1a3e":"transparent",color:activeEntry===eid?"#a5b4fc":"#475569",borderBottom:activeEntry===eid?"2px solid #a5b4fc":"2px solid transparent"}}>
            Entry {eid} {entries[eid].eliminated?"💀":`(${seedPts} pts)`}
          </button>
        ))}
      </div>

      {entry.eliminated&&<div style={{background:"linear-gradient(135deg,#7f1d1d,#450a0a)",padding:"12px",textAlign:"center",color:"#fca5a5",fontWeight:700,fontSize:"14px"}}>💀 ENTRY {activeEntry} ELIMINATED</div>}

      <div style={{display:"flex",borderBottom:"1px solid #1a1a3e"}}>
        {[{l:"Seed Pts",v:seedPts,c:"#fbbf24"},{l:"Picks",v:`${used.length}/10`,c:"#e2e2f0"},{l:"Days Left",v:daysLeft,c:"#a5b4fc"},{l:"Status",v:entry.eliminated?"OUT":"ALIVE",c:entry.eliminated?"#ef4444":"#22c55e"}].map((s,i)=>(
          <div key={i} style={{flex:1,padding:"10px 12px",textAlign:"center",borderRight:"1px solid #1a1a3e"}}>
            <div style={{fontSize:"9px",color:"#475569",textTransform:"uppercase",letterSpacing:"1px"}}>{s.l}</div>
            <div style={{fontSize:"18px",fontWeight:800,color:s.c,fontFamily:"'JetBrains Mono',monospace",marginTop:"1px"}}>{s.v}</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",overflowX:"auto",borderBottom:"1px solid #1a1a3e"}}>
        {DAYS.map(d=>{const hasPick=!!entry.picks[d.id];return(
          <button key={d.id} onClick={()=>setActiveDay(d.id)} style={{padding:"6px 10px",border:"none",cursor:"pointer",fontSize:"11px",fontWeight:600,fontFamily:"'Outfit',sans-serif",whiteSpace:"nowrap",display:"flex",flexDirection:"column",alignItems:"center",gap:"1px",minWidth:"70px",
            background:activeDay===d.id?"#1a1a3e":"transparent",color:activeDay===d.id?"#e2e2f0":hasPick?"#22c55e":"#475569",borderBottom:activeDay===d.id?"2px solid #a5b4fc":"2px solid transparent"}}>
            <span style={{fontSize:"9px",opacity:0.7}}>{d.date}</span>
            <span>Day {d.id}{d.combined?" ★":""}</span>
            {hasPick&&<span style={{color:"#22c55e",fontSize:"9px"}}>✓ {entry.picks[d.id]}</span>}
          </button>
        );})}
      </div>

      <main style={{padding:"14px",maxWidth:"800px",margin:"0 auto"}}>
        <div style={{marginBottom:"10px"}}>
          <h2 style={{margin:0,fontSize:"17px",fontWeight:700,color:"#e2e2f0"}}>{day?.label}</h2>
          <span style={{fontSize:"12px",color:"#64748b"}}>{day?.date} • {day?.games.length||0} games{day?.combined?" • ★ Combined pool — pick from any Elite 8 game":""}</span>
        </div>

        {entry.picks[activeDay]&&(
          <div style={{background:"#0d3320",border:"1px solid #22c55e",borderRadius:"8px",padding:"8px 12px",marginBottom:"10px",fontSize:"12px"}}>
            <span style={{color:"#22c55e",fontWeight:700}}>Today's Pick:</span>{" "}
            <span style={{fontWeight:600}}>{entry.picks[activeDay]}</span>{" "}
            <span style={{color:"#64748b"}}>({T[entry.picks[activeDay]]?.s}-seed • +{T[entry.picks[activeDay]]?.s} pts)</span>
          </div>
        )}

        <div style={{background:"#0f0f1e",border:"1px solid #1a1a3e",borderRadius:"8px",padding:"10px 12px",marginBottom:"10px"}}>
          <div style={{fontSize:"11px",fontWeight:700,color:"#a5b4fc",textTransform:"uppercase",letterSpacing:"1px",marginBottom:"4px"}}>
            🧠 Strategy — {daysLeft>6?"Early Tournament":daysLeft>3?"Mid Tournament":"Endgame"}
          </div>
          {(daysLeft>6?[
            "Target high seeds (8–12) that are heavy favorites — max seed points at low risk",
            "Save 1-seeds and 2-seeds for later when games are tighter",
            "A 5-seed at 85% gives 5 pts vs a 1-seed at 98% for only 1 pt",
          ]:daysLeft>3?[
            "Use mid-seeds (4–7) with favorable matchups now",
            "Keep at least one 1/2-seed for the Final Four or Championship",
            "Games are tighter — weight safety more heavily",
          ]:[
            "Days 7–8 share a combined Elite 8 pool — plan both picks together",
            "Survival is paramount — pick the safest available team",
            "Tiebreaker points still matter if you're in contention",
          ]).map((t,i)=><div key={i} style={{fontSize:"11px",color:"#cbd5e1",padding:"2px 0",lineHeight:1.5}}><span style={{color:"#a5b4fc"}}>→</span> {t}</div>)}
        </div>

        {used.length>0&&(
          <div style={{background:"#0a0a14",border:"1px solid #1a1a3e",borderRadius:"8px",padding:"8px 10px",marginBottom:"10px",display:"flex",flexWrap:"wrap",gap:"4px",alignItems:"center"}}>
            <span style={{fontSize:"10px",fontWeight:700,color:"#475569",textTransform:"uppercase",letterSpacing:"1px"}}>Used: </span>
            {used.map(n=><span key={n} style={{background:"#1a1a3e",padding:"2px 7px",borderRadius:"4px",fontSize:"10px",color:"#94a3b8",display:"inline-flex",gap:"3px",alignItems:"center"}}><strong style={{color:"#a5b4fc"}}>{T[n]?.s}</strong>{n}</span>)}
          </div>
        )}

        {day?.games.length===0?(
          <div style={{textAlign:"center",padding:"40px 20px"}}>
            <div style={{fontSize:"28px",marginBottom:"8px"}}>📋</div>
            <p style={{color:"#64748b",fontSize:"13px"}}>Games populate as earlier rounds complete.</p>
            <p style={{color:"#475569",fontSize:"11px"}}>Mark results in previous days to advance teams.</p>
          </div>
        ):(
          <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            {day.games.map((g,i)=>{
              const key=`${g.a}_${g.b}`;
              return <GameCard key={i} game={g} used={used} dayPick={entry.picks[activeDay]}
                onPick={handlePick} result={entry.results[key]} onResult={handleResult} daysLeft={daysLeft}/>;
            })}
          </div>
        )}
      </main>
    </div>
  );
}
