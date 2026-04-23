"use client";
import { useState } from "react";
import { hsContact, hsMeeting, contactIds, bdrMeetings, scoring } from "./data";

const C = {
  bg:"#0a0e17",card:"#0f1624",border:"#1a2236",accent:"#3b82f6",
  accentL:"#60a5fa",green:"#10b981",red:"#ef4444",yellow:"#f59e0b",
  text:"#e2e8f0",muted:"#94a3b8",dim:"#64748b",faint:"#475569",
};

function Badge({children,type="cold"}){
  const t={cold:{bg:"rgba(59,130,246,0.12)",c:"#60a5fa",b:"rgba(59,130,246,0.25)"},warm:{bg:"rgba(245,158,11,0.12)",c:"#fbbf24",b:"rgba(245,158,11,0.25)"},held:{bg:"rgba(16,185,129,0.12)",c:"#34d399",b:"rgba(16,185,129,0.25)"},sched:{bg:"rgba(148,163,184,0.06)",c:"#94a3b8",b:"rgba(148,163,184,0.15)"},noshow:{bg:"rgba(239,68,68,0.12)",c:"#f87171",b:"rgba(239,68,68,0.25)"}};
  const s=t[type]||t.cold;
  return <span style={{display:"inline-block",padding:"3px 10px",borderRadius:6,fontSize:11,fontWeight:600,letterSpacing:0.3,background:s.bg,color:s.c,border:`1px solid ${s.b}`,whiteSpace:"nowrap"}}>{children}</span>;
}
function OutcomeBadge({out}){
  if(out==="COMPLETED")return <Badge type="held">Held</Badge>;
  if(out==="NO_SHOW")return <Badge type="noshow">No show</Badge>;
  return <Badge type="sched">Scheduled</Badge>;
}
function ContactLink({email,name}){
  const id=contactIds[email];
  if(!id)return <span>{name}</span>;
  return <a href={hsContact(id)} target="_blank" rel="noopener" style={{color:C.accentL}}>{name}</a>;
}
function ScoreBar({value,max=5}){
  const pct=(value/max)*100;
  const col=value>=4?C.green:value>=3?C.yellow:C.red;
  return <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:100,height:6,borderRadius:3,background:"rgba(255,255,255,0.05)"}}><div style={{width:`${pct}%`,height:"100%",borderRadius:3,background:col}}/></div><span style={{fontSize:13,fontWeight:700,color:col,minWidth:36}}>{value.toFixed(2)}</span></div>;
}
function SL({children}){return <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:C.faint,marginBottom:16,marginTop:8}}>{children}</div>;}
function Card({children,style={}}){return <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:28,...style}}>{children}</div>;}

const th={padding:"10px 0",fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:0.5,color:C.dim,borderBottom:`1px solid ${C.border}`};
const td={padding:"14px 0",borderBottom:`1px solid ${C.border}`,fontSize:13};

function MeetingRow({m}){
  return(
    <div style={{display:"grid",gridTemplateColumns:"130px 1fr auto auto auto auto",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}>
      <span style={{fontWeight:600,color:C.text}}>{m.co}</span>
      <span><ContactLink email={m.email} name={m.contact}/></span>
      <span>{m.sourcing==="warm"&&<span style={{fontSize:11,color:C.yellow,whiteSpace:"nowrap"}}>{m.ae} {m.days===0?"(same day)":`${m.days}d prior`}</span>}</span>
      <OutcomeBadge out={m.out}/>
      <span style={{fontSize:12,color:C.dim,minWidth:52,textAlign:"right"}}>{m.start}</span>
      <a href={hsMeeting(m.mtgId)} target="_blank" rel="noopener" style={{color:C.dim,fontSize:13,opacity:0.6}}>↗</a>
    </div>
  );
}

export default function Page(){
  const[showAllCold,setShowAllCold]=useState(false);
  const[showAllWarm,setShowAllWarm]=useState(false);
  const coldMtgs=bdrMeetings.filter(m=>m.sourcing==="cold");
  const warmMtgs=bdrMeetings.filter(m=>m.sourcing==="warm");

  return(
    <div style={{maxWidth:960,margin:"0 auto",padding:"48px 40px 64px"}}>

      {/* Header */}
      <div style={{marginBottom:48,paddingBottom:28,borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:C.accent}}/>
          <span style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:C.dim}}>RevOps · BDR Performance</span>
        </div>
        <h1 style={{fontSize:32,fontWeight:800,letterSpacing:-0.5,margin:"0 0 6px",color:C.text}}>BDR outreach report</h1>
        <p style={{fontSize:15,color:C.muted,margin:0}}>Rolling 30 days — April 23, 2026</p>
      </div>

      {/* KPIs */}
      <SL>Team totals — cold outreach only</SL>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:48}}>
        {[{l:"Contacts actioned",n:"856",s:"343 companies"},{l:"Replies",n:"84",s:"9.8% reply rate"},{l:"Meetings booked",n:"25",s:"BDR-sourced"},{l:"Meetings held",n:"14",s:"56% hold rate"}].map((k,i)=>(
          <div key={i} style={{background:"rgba(255,255,255,0.025)",border:`1px solid ${C.border}`,borderRadius:12,padding:"20px 24px"}}>
            <div style={{fontSize:13,color:C.muted,marginBottom:8}}>{k.l}</div>
            <div style={{fontSize:30,fontWeight:800,lineHeight:1,color:C.text}}>{k.n}</div>
            <div style={{fontSize:12,color:C.dim,marginTop:4}}>{k.s}</div>
          </div>
        ))}
      </div>

      {/* Two Motions */}
      <SL>Two outreach motions</SL>
      <Card style={{marginBottom:24,padding:"20px 24px"}}>
        <p style={{fontSize:14,color:C.muted,lineHeight:1.7,margin:0}}>
          The BDR team operates in <strong style={{color:C.text,fontWeight:600}}>two distinct motions</strong>: high-volume cold prospecting (Joe, Taner) and AE-supported warm outreach (Jennie, Carter). Both create value differently — below we break them out so each motion is measured fairly.
        </p>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:48}}>
        <Card>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
            <h3 style={{fontSize:17,fontWeight:700,margin:0}}>Cold prospecting</h3>
            <Badge type="cold">Joe & Taner</Badge>
          </div>
          <p style={{fontSize:13,color:C.muted,marginBottom:20,lineHeight:1.6}}>High-volume outreach to new accounts with no prior AE involvement. Every meeting is 100% BDR-sourced.</p>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr><th style={{...th,textAlign:"left"}}>BDR</th><th style={{...th,textAlign:"right"}}>Actioned</th><th style={{...th,textAlign:"right"}}>Replied</th><th style={{...th,textAlign:"right"}}>Reply %</th><th style={{...th,textAlign:"right"}}>Meetings</th></tr></thead>
            <tbody>
              {[{n:"Joseph Reed",a:379,r:16,rr:"4.2%",m:5},{n:"Taner Bennerson",a:155,r:5,rr:"3.2%",m:1}].map((r,i)=>(
                <tr key={i}><td style={{...td,fontWeight:600}}>{r.n}</td><td style={{...td,textAlign:"right"}}>{r.a}</td><td style={{...td,textAlign:"right"}}>{r.r}</td><td style={{...td,textAlign:"right",color:C.muted}}>{r.rr}</td><td style={{...td,textAlign:"right"}}>{r.m}</td></tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
            <h3 style={{fontSize:17,fontWeight:700,margin:0}}>AE-supported outreach</h3>
            <Badge type="warm">Jennie & Carter</Badge>
          </div>
          <p style={{fontSize:13,color:C.muted,marginBottom:20,lineHeight:1.6}}>Working accounts where Jen Abel or Tom Manatos have established relationships. Higher reply rates reflect warm introductions.</p>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr><th style={{...th,textAlign:"left"}}>BDR</th><th style={{...th,textAlign:"right"}}>Actioned</th><th style={{...th,textAlign:"right"}}>Replied</th><th style={{...th,textAlign:"right"}}>Reply %</th><th style={{...th,textAlign:"right"}}>Meetings</th></tr></thead>
            <tbody>
              {[{n:"Jennie Chasseur",a:198,r:36,rr:"18.2%",m:12},{n:"Carter Phillips",a:124,r:27,rr:"21.8%",m:8}].map((r,i)=>(
                <tr key={i}><td style={{...td,fontWeight:600}}>{r.n}</td><td style={{...td,textAlign:"right"}}>{r.a}</td><td style={{...td,textAlign:"right"}}>{r.r}</td><td style={{...td,textAlign:"right",color:C.green}}>{r.rr}</td><td style={{...td,textAlign:"right"}}>{r.m}</td></tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Meeting Attribution */}
      <SL>Meeting attribution</SL>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:48}}>
        <Card>
          <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:20}}>
            <h3 style={{fontSize:17,fontWeight:700,margin:0}}>BDR-sourced</h3>
            <span style={{fontSize:14,color:C.dim}}>({coldMtgs.length})</span>
          </div>
          {coldMtgs.slice(0,showAllCold?999:6).map((m,i)=><MeetingRow key={i} m={m}/>)}
          {coldMtgs.length>6&&<button onClick={()=>setShowAllCold(!showAllCold)} style={{background:"none",border:"none",color:C.accentL,fontSize:13,cursor:"pointer",padding:"14px 0 0",fontWeight:500}}>{showAllCold?"Show less":`+ ${coldMtgs.length-6} more meetings`}</button>}
        </Card>
        <Card>
          <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:20}}>
            <h3 style={{fontSize:17,fontWeight:700,margin:0}}>AE-assisted</h3>
            <span style={{fontSize:14,color:C.dim}}>({warmMtgs.length})</span>
          </div>
          {warmMtgs.slice(0,showAllWarm?999:6).map((m,i)=><MeetingRow key={i} m={m}/>)}
          {warmMtgs.length>6&&<button onClick={()=>setShowAllWarm(!showAllWarm)} style={{background:"none",border:"none",color:C.accentL,fontSize:13,cursor:"pointer",padding:"14px 0 0",fontWeight:500}}>{showAllWarm?"Show less":`+ ${warmMtgs.length-6} more meetings`}</button>}
        </Card>
      </div>

      {/* ICP Scoring */}
      <SL>Account quality — ICP scoring</SL>
      <Card style={{marginBottom:24}}>
        <h3 style={{fontSize:16,fontWeight:700,margin:"0 0 12px",color:C.text}}>How accounts are scored</h3>
        <p style={{fontSize:13,color:C.muted,lineHeight:1.7,margin:"0 0 20px"}}>
          Every target account is scored across <strong style={{color:C.text,fontWeight:600}}>three dimensions</strong> using AI-powered analysis (Anthropic API) validated against closed-won deal data in BigQuery. Each dimension is scored 1–5:
        </p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:20}}>
          {[
            {label:"State policy exposure",color:C.accentL,bg:"rgba(59,130,246,0.06)",b:"rgba(59,130,246,0.15)",desc:"How much state legislative activity directly impacts this company. Higher score = more bills, regulations, and enforcement actions touching their business."},
            {label:"GA maturity",color:C.green,bg:"rgba(16,185,129,0.06)",b:"rgba(16,185,129,0.15)",desc:"How mature the company's government affairs function is. Score 5 = dedicated GA team with existing tools and budget. Score 1 = no GA function."},
            {label:"ICP fit",color:C.yellow,bg:"rgba(245,158,11,0.06)",b:"rgba(245,158,11,0.15)",desc:"Overall fit with our ideal customer profile — revenue, vertical, team size, buying signals. Derived from 43 closed-won deals. Score 5 = strong match."},
          ].map((d,i)=>(
            <div key={i} style={{background:d.bg,borderRadius:10,padding:"16px 18px",border:`1px solid ${d.b}`}}>
              <div style={{fontSize:13,fontWeight:700,color:d.color,marginBottom:8}}>{d.label}</div>
              <div style={{fontSize:12,color:C.muted,lineHeight:1.6}}>{d.desc}</div>
            </div>
          ))}
        </div>
        <p style={{fontSize:13,color:C.muted,lineHeight:1.7,margin:0}}>
          The <strong style={{color:C.text,fontWeight:600}}>composite score</strong> averages all three dimensions. Accounts scoring 4+ are "high-fit" — historically these convert at an 18% new business win rate. Accounts below 3 are lower probability but may still convert with the right timing.
        </p>
      </Card>

      <Card style={{marginBottom:20,padding:"20px 24px"}}>
        <p style={{fontSize:14,color:C.muted,lineHeight:1.6,margin:0}}>
          Cold prospecting naturally targets a <strong style={{color:C.text,fontWeight:600}}>wider ICP range</strong> — Joe and Taner work 70 accounts each at lower average scores. Jennie and Carter work fewer, higher-scored accounts, many introduced by AEs. This is expected and reflects the different motions.
        </p>
      </Card>

      <Card style={{marginBottom:20}}>
        <h4 style={{fontSize:14,fontWeight:700,margin:"0 0 20px",color:C.text}}>Composite score</h4>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            {["BDR","Accounts","Composite","High-fit (4+)","Low-fit (<3)"].map((h,i)=>(
              <th key={i} style={{...th,textAlign:i===0||i===2?"left":"right",paddingLeft:i===2?16:0}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {scoring.map((d,i)=>(
              <tr key={i}>
                <td style={{...td,fontWeight:600}}>{d.bdr}</td>
                <td style={{...td,textAlign:"right"}}>{d.n}</td>
                <td style={{...td,paddingLeft:16}}><ScoreBar value={d.comp}/></td>
                <td style={{...td,textAlign:"right"}}><span style={{color:d.hi>70?C.green:d.hi>50?C.yellow:C.red}}>{d.hi}%</span></td>
                <td style={{...td,textAlign:"right"}}><span style={{color:d.lo>20?C.red:d.lo>10?C.yellow:C.green}}>{d.lo}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card style={{marginBottom:48}}>
        <h4 style={{fontSize:14,fontWeight:700,margin:"0 0 20px",color:C.text}}>Score by dimension</h4>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>
            {["BDR","Policy exposure","GA maturity","ICP fit"].map((h,i)=>(
              <th key={i} style={{...th,textAlign:"left",paddingLeft:i>0?16:0}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {scoring.map((d,i)=>(
              <tr key={i}>
                <td style={{...td,fontWeight:600}}>{d.bdr}</td>
                <td style={{...td,paddingLeft:16}}><ScoreBar value={d.pol}/></td>
                <td style={{...td,paddingLeft:16}}><ScoreBar value={d.ga}/></td>
                <td style={{...td,paddingLeft:16}}><ScoreBar value={d.icp}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Footer */}
      <div style={{borderTop:`1px solid ${C.border}`,paddingTop:24,fontSize:12,color:C.dim,lineHeight:2}}>
        <div style={{marginBottom:16}}>
          <strong style={{color:C.muted}}>Methodology</strong><br/>
          Contacts actioned = first outbound email/call/communication from BDR in 30-day window. Excludes internal contacts, warmup emails, contacts with prior open deals or intro meetings. AE exclusion: contacts where Tom Manatos or Jen Abel emailed within 30 days before BDR's first touch are classified as "AE-supported" and reported separately. Replies = inbound email owned by that BDR, excluding auto-replies and OOO. Interested = lead outcome Interested/Referral or Introduction meeting booked, attributed to the BDR.
        </div>
        <div>
          <strong style={{color:C.muted}}>Raw data</strong><br/>
          <a href="https://docs.google.com/spreadsheets/d/1EJfBXIz1V0gEb8bxEx_NL7ezJowF8WkGciAEZK5Tvh4/edit?gid=2064563813#gid=2064563813" target="_blank" rel="noopener" style={{color:C.accentL}}>Account Scoring + Meeting Attribution (Google Sheet)</a>
          {" · "}
          <a href="https://stateaffairs.metabaseapp.com/dashboard/85-saro-performance-fy26-50m?tab=376-enterprise-bdr" target="_blank" rel="noopener" style={{color:C.accentL}}>Metabase Dashboard</a>
        </div>
      </div>
    </div>
  );
}
