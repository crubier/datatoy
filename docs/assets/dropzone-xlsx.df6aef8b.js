var e=Object.assign;import{_ as t}from"./index.6da70642.js";import{r}from"./vendor.59b19d5c.js";import{u as a}from"./index.65e504a8.js";import"./index.07d4a353.js";export default({setState:o})=>{const n=r.useCallback((r=>{const a=t((()=>__import__("./xlsx.b23d8399.js").then((function(e){return e.x}))),["/datatoy/assets/xlsx.b23d8399.js","/datatoy/assets/vendor.59b19d5c.js"]),n=new FileReader;n.onload=async function(t){var r;const n=new Uint8Array((null==(r=t.target)?void 0:r.result)||[]),s=await a,l=s.read(n,{type:"array"});o((t=>e(e({},t),{data:s.utils.sheet_to_json(l.Sheets[l.SheetNames[0]],{blankrows:!1})})))},n.readAsArrayBuffer(r[0])}),[]),{getRootProps:s,getInputProps:l,isDragActive:i}=a({onDrop:n});return r.createElement("div",e({},s()),r.createElement("input",e({},l())),i?r.createElement("p",null,"Drop the Excel-compatible files here ..."):r.createElement("p",null,"Drag 'n' drop some Excel-compatible files here, or click to select files"))};
