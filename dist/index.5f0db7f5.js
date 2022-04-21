var H=Object.defineProperty,P=Object.defineProperties;var $=Object.getOwnPropertyDescriptors;var L=Object.getOwnPropertySymbols;var D=Object.prototype.hasOwnProperty,A=Object.prototype.propertyIsEnumerable;var k=(r,t,o)=>t in r?H(r,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):r[t]=o,h=(r,t)=>{for(var o in t||(t={}))D.call(t,o)&&k(r,o,t[o]);if(L)for(var o of L(t))A.call(t,o)&&k(r,o,t[o]);return r},T=(r,t)=>P(r,$(t));import{j as w,i as l,H as E,r as p,R as g,u as j,p as v,a as C,b as I}from"./vendor.8e1f98f5.js";const R=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))c(n);new MutationObserver(n=>{for(const e of n)if(e.type==="childList")for(const d of e.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&c(d)}).observe(document,{childList:!0,subtree:!0});function o(n){const e={};return n.integrity&&(e.integrity=n.integrity),n.referrerpolicy&&(e.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?e.credentials="include":n.crossorigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function c(n){if(n.ep)return;n.ep=!0;const e=o(n);fetch(n.href,e)}};R();const a=w.exports.jsx,G=w.exports.jsxs,F=w.exports.Fragment;l("ctx",()=>{const r=E(),t=p.exports.createContext(),o=c=>a(t.Provider,{value:c.hub?c.hub:r,children:c.children});return l("provider",o),{hub:r,HubContext:t,HubProvider:o}});l("ctx",({HubContext:r})=>{const t=p.exports.createContext(),o=({children:c})=>{const[n,e]=p.exports.useState({number:43,time:new Date().valueOf()}),d=p.exports.useContext(r);return p.exports.useEffect(d.effect(m=>{m.on("increment",()=>{e(s=>T(h({},s),{number:s.number+1}))});const u=setInterval(()=>{e(s=>T(h({},s),{time:new Date().valueOf()}))},1e3);return()=>{clearInterval(u)}}),[]),a(t.Provider,{value:n,children:c})};return l("provider",o),{StateContext:t,StateProvider:o}});l("pod",()=>{l("404",()=>a("div",{children:"404 / Page not found"}))});l("pod",({StateContext:r,HubContext:t})=>{l("route",["/",o=>()=>{const c=()=>{const[e,d]=g.useState(0),[m,u]=g.useState(0),s=z=>d(z),i=z=>u(z),f=[[{task:"a",month:"Jan '22",start:15,days:30}],[{task:"b",month:"Jan '22",start:10,days:20}],[{task:"c",month:"Mar '22",start:25,days:40}],[{task:"d",month:"Feb '22",start:5,days:10}],[{task:"e",month:"Feb '22",start:30,days:15}]],x=[["Task A"],["Task B"],["Task C"],["Task D"],["Task E"]],S=[["Jan '22","Feb '22","Mar '22","Apr '22","May '22","Jun '22","Jul '22","Aug '22","Sep '22","Oct '22","Nov '22","Dev '22"]],y={styles:{background:"LightGray",overflow:"auto",gridArea:"2 / 2 / 3 / 3"},updateScrollOffsetTop:s,updateScrollOffsetLeft:i,data:f,rowSize:60,columnSize:120},O={styles:{background:"GoldenRod",overflow:"hidden",gridArea:"2 / 1 / 3 / 2"},scrollOffsetTop:e,data:x,rowSize:60,columnSize:120};return G("div",{style:{display:"grid",gridTemplateColumns:"auto 1fr",gridTemplateRows:"auto 1fr",gridColumnGap:"0px",gridRowGap:"0px",height:"100%"},children:[a(n,h({},{styles:{background:"MediumSeaGreen",overflow:"hidden",gridArea:"1 / 2 / 2 / 3"},scrollOffsetLeft:m,data:S,rowSize:60,columnSize:120})),a(n,h({},O)),a(n,h({},y))]})},n=e=>{const d=g.useRef(!1);g.useEffect(()=>{"scrollOffsetTop"in e&&m.scrollToOffset(e.scrollOffsetTop),"scrollOffsetLeft"in e&&u.scrollToOffset(e.scrollOffsetLeft)},[e.scrollOffsetTop,e.scrollOffsetLeft]);const m=j({size:e.data.length,parentRef:d,estimateSize:g.useCallback(()=>e.rowSize,[]),overscan:5,scrollOffsetFn(s){const i=s==null?void 0:s.target.scrollTop;return i>=0?(e.updateScrollOffsetTop&&e.updateScrollOffsetTop(i),i):(e.updateScrollOffsetTop&&e.updateScrollOffsetTop(0),0)}}),u=j({horizontal:!0,size:e.data[0].length,parentRef:d,estimateSize:g.useCallback(()=>e.columnSize,[]),overscan:5,scrollOffsetFn(s){const i=s==null?void 0:s.target.scrollLeft;return i>=0?(e.updateScrollOffsetLeft&&e.updateScrollOffsetLeft(i),i):(e.updateScrollOffsetLeft&&e.updateScrollOffsetLeft(0),0)}});return a(F,{children:a("div",{ref:d,className:"List",style:h({},e.styles),children:a("div",{style:{height:`${m.totalSize}px`,width:`${u.totalSize}px`,position:"relative"},children:m.virtualItems.map(s=>a(g.Fragment,{children:u.virtualItems.map(i=>{const f=e.data[s.index][i.index];return console.log(f),Object.keys(f).length===0?a("div",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",position:"absolute",top:0,left:0,width:`${i.size}px`,height:`${s.size}px`,transform:`translateX(${i.start}px) translateY(${s.start}px)`},children:f},i.index):a("div",{style:{display:"inline-flex",alignItems:"center",justifyContent:"center",position:"absolute",top:0,left:0,width:`${i.size}px`,height:`${s.size}px`,transform:`translateX(${i.start}px) translateY(${s.start}px)`}},i.index)})},s.index))})})})};return a(c,{})}])});l("pod",()=>{l("route",["/orders",r=>()=>a("div",{children:"Orders Page"})])});l("pod",({RouterContext:r})=>{l("app",()=>{const t=p.exports.useContext(r),o=l.one("404");return a(F,{children:a("article",{children:t?a(t,{}):a(o,{})})})})});l("ctx",({HubContext:r})=>{const t=p.exports.createContext(),o=c=>{const[n,e]=p.exports.useState(),{children:d}=c,m=p.exports.useContext(r),u=window.location.hostname,s=u.split("."),i=s.length==3?s[0]:null;return p.exports.useEffect(()=>{v("*",(f,x)=>{x(),window.scrollTo(0,0)}),l.many("route").forEach(f=>C(...f)),C.routes().forEach(f=>{v(f.pattern,(x,S)=>{const y={hostname:u,subdomain:i,url:x.pathname,params:x.params,querystring:x.querystring};let O=!1;const b=f.cb(y,()=>{O=!0,S()});O||(e(()=>b),m.emit("navigate",y,b))})}),v.start()},[]),a(t.Provider,{value:n,children:d})};return l("provider",o),{RouterContext:t,RouterProvider:o}});l("pod",async()=>{const r=l.one("app"),t=()=>l.many("provider").reverse().reduce((o,c)=>a(c,{children:o}),a(r,{}));I.exports.render(a(t,{}),document.getElementById("root"))});(async()=>{const r={};for(let t of l.many("ctx"))Object.assign(r,await t(r));for(let t of l.many("pod"))await t(r);await r.hub.emit("ready")})();
