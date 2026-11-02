import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity, AlignCenter, AlignLeft, AlignRight, ArrowDown, ArrowUp, Box, Check,
  ChevronDown, ChevronRight, CircleHelp, Code2, Copy, Download, Eye, FileImage,
  FilePlus2, FolderOpen, Globe2, Grid2X2, Image as ImageIcon, Layers, Layout,
  Monitor, MoreHorizontal, MousePointer2, PanelLeftClose, PanelRightClose,
  Plus, Redo2, Rocket, Save, Search, Settings2, Smartphone, Sparkles, Square,
  Type, Trash2, Undo2, Upload, X, Circle, Video, List, Quote, FormInput, Navigation, UserCircle, Gauge, Star, CheckCircle2, Play, Heart, Menu, ZoomIn, ZoomOut
} from 'lucide-react'

type Kind = 'heading' | 'text' | 'button' | 'image' | 'card' | 'divider' | 'spacer' | 'shape' | 'badge' | 'list' | 'quote' | 'input' | 'navbar' | 'avatar' | 'video' | 'progress' | 'icon'
type Block = { id: string; kind: Kind; label: string; content: string; color: string; background: string; size: number; radius: number; padding: number; align: 'left'|'center'|'right'; width: number }
type Project = { name: string; blocks: Block[] }
const STORAGE = 'nova-studio-project-v1'
const uid = () => Math.random().toString(36).slice(2, 10)
const makeBlock = (kind: Kind): Block => {
  const defaults: Record<Kind, Omit<Block,'id'|'kind'>> = {
    heading: { label:'Titolo', content:'Dai forma alle tue idee.', color:'#f8fafc', background:'transparent', size:42, radius:0, padding:12, align:'left', width:100 },
    text: { label:'Testo', content:'Un paragrafo di esempio. Seleziona questo elemento per modificarne il contenuto, lo stile e la disposizione.', color:'#aab4c8', background:'transparent', size:15, radius:0, padding:10, align:'left', width:100 },
    button: { label:'Pulsante', content:'Scopri di più', color:'#ffffff', background:'#64748b', size:14, radius:12, padding:15, align:'center', width:100 },
    image: { label:'Immagine', content:'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=85', color:'#ffffff', background:'#20283a', size:14, radius:16, padding:0, align:'center', width:100 },
    card: { label:'Card', content:'Un posto per la tua prossima grande idea. Aggiungi contenuti e rendi il tuo progetto unico.', color:'#e9edfa', background:'#171e2d', size:15, radius:18, padding:24, align:'left', width:100 },
    divider: { label:'Separatore', content:'', color:'#343d50', background:'#343d50', size:1, radius:1, padding:8, align:'left', width:100 },
    spacer: { label:'Spazio', content:'', color:'#ffffff', background:'transparent', size:32, radius:0, padding:0, align:'left', width:100 },
    shape: { label:'Forma', content:'', color:'#ffffff', background:'#d8dde5', size:120, radius:18, padding:0, align:'center', width:40 },
    badge: { label:'Badge', content:'Nuovo', color:'#334155', background:'#e2e8f0', size:12, radius:999, padding:9, align:'center', width:25 },
    list: { label:'Lista', content:'Primo elemento\nSecondo elemento\nTerzo elemento', color:'#475569', background:'transparent', size:15, radius:0, padding:8, align:'left', width:100 },
    quote: { label:'Citazione', content:'Le grandi idee prendono forma quando inizi a costruirle.', color:'#334155', background:'#f1f5f9', size:20, radius:14, padding:24, align:'left', width:100 },
    input: { label:'Campo input', content:'Inserisci il tuo testo', color:'#334155', background:'#ffffff', size:14, radius:10, padding:13, align:'left', width:100 },
    navbar: { label:'Navigazione', content:'Home · Progetti · Chi siamo · Contatti', color:'#334155', background:'#f8fafc', size:14, radius:12, padding:18, align:'left', width:100 },
    avatar: { label:'Avatar', content:'NS', color:'#ffffff', background:'#64748b', size:22, radius:999, padding:18, align:'center', width:18 },
    video: { label:'Video', content:'https://www.youtube.com/embed/dQw4w9WgXcQ', color:'#ffffff', background:'#0f172a', size:14, radius:14, padding:0, align:'center', width:100 },
    progress: { label:'Barra progresso', content:'75', color:'#334155', background:'#e2e8f0', size:14, radius:999, padding:5, align:'left', width:100 },
    icon: { label:'Icona', content:'✦', color:'#475569', background:'transparent', size:48, radius:0, padding:8, align:'center', width:20 }
  }
  return { id:uid(), kind, ...defaults[kind] }
}
const initial: Project = { name:'Il mio primo progetto', blocks:[
  { ...makeBlock('heading'), id:'hero-title', content:'Progetta senza limiti.', size:48 },
  { ...makeBlock('text'), id:'hero-copy', content:'Dalla prima idea a un’esperienza digitale completa. Questo è il tuo spazio creativo.', size:16 },
  { ...makeBlock('button'), id:'hero-cta', content:'Inizia ora' },
  { ...makeBlock('image'), id:'hero-image', content:'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=85' }
] }
const palette: {kind:Kind; title:string; desc:string; icon:any}[] = [
  {kind:'heading',title:'Titolo',desc:'Titoli e intestazioni',icon:Type},
  {kind:'text',title:'Testo',desc:'Paragrafi e descrizioni',icon:AlignLeft},
  {kind:'button',title:'Pulsante',desc:'Call to action',icon:MousePointer2},
  {kind:'image',title:'Immagine',desc:'Foto e grafiche da URL',icon:ImageIcon},
  {kind:'card',title:'Card',desc:'Contenitore di contenuti',icon:Square},
  {kind:'shape',title:'Forma',desc:'Forme e superfici',icon:Circle},
  {kind:'badge',title:'Badge',desc:'Etichette e tag',icon:Star},
  {kind:'list',title:'Lista',desc:'Elenchi testuali',icon:List},
  {kind:'quote',title:'Citazione',desc:'Testo in evidenza',icon:Quote},
  {kind:'input',title:'Campo input',desc:'Campo modulo visuale',icon:FormInput},
  {kind:'navbar',title:'Navigazione',desc:'Menu e link di pagina',icon:Navigation},
  {kind:'avatar',title:'Avatar',desc:'Elemento profilo',icon:UserCircle},
  {kind:'video',title:'Video',desc:'Video incorporato',icon:Video},
  {kind:'progress',title:'Progresso',desc:'Barra di avanzamento',icon:Gauge},
  {kind:'icon',title:'Icona',desc:'Simbolo o glifo',icon:Sparkles},
  {kind:'divider',title:'Separatore',desc:'Linea divisoria',icon:MinusIcon},
  {kind:'spacer',title:'Spaziatore',desc:'Spazio verticale',icon:ArrowDown}
]
function MinusIcon(){ return <span className="minus-icon">—</span> }
function download(name:string, data:string, type='application/json') {
  const url=URL.createObjectURL(new Blob([data],{type})); const a=document.createElement('a'); a.href=url; a.download=name; a.click(); URL.revokeObjectURL(url)
}
function escapeHtml(s:string){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!))}
function renderBlock(b:Block, preview=false) {
  const style={color:b.color,background:b.background,fontSize:b.size,borderRadius:b.radius,padding:b.padding,textAlign:b.align as any,width:b.width+'%'} as React.CSSProperties
  if(b.kind==='heading') return <h1 className="block-heading" style={style}>{b.content}</h1>
  if(b.kind==='text') return <p className="block-text" style={style}>{b.content}</p>
  if(b.kind==='button') return <div className="button-wrap" style={{textAlign:b.align}}><button className="preview-button" style={style}>{b.content}</button></div>
  if(b.kind==='image') return <div className="image-wrap" style={{width:b.width+'%',padding:b.padding}}><img src={b.content} alt="Contenuto del progetto" style={{borderRadius:b.radius}} onError={e=>{(e.currentTarget as HTMLImageElement).src='https://placehold.co/1200x600/171e2d/aab4c8?text=Immagine'}} /></div>
  if(b.kind==='card') return <div className="preview-card" style={style}><strong>{b.label==='Card'?'Una nuova possibilità':b.label}</strong><p>{b.content}</p></div>
  if(b.kind==='shape') return <div style={{width:b.width+'%',height:b.size,background:b.background,borderRadius:b.radius,color:b.color,margin:'4px 0'}} />
  if(b.kind==='badge') return <div style={{width:b.width+'%',textAlign:b.align}}><span style={{display:'inline-block',background:b.background,color:b.color,borderRadius:b.radius,padding:b.padding,fontSize:b.size,fontWeight:700}}>{b.content}</span></div>
  if(b.kind==='list') return <ul style={{...style,paddingLeft:28,whiteSpace:'pre-line',lineHeight:1.9,margin:0}}>{b.content.split('\n').filter(Boolean).map((item,i)=><li key={i}>{item}</li>)}</ul>
  if(b.kind==='quote') return <blockquote style={{...style,borderLeft:'3px solid #94a3b8',margin:0,fontStyle:'italic',lineHeight:1.6}}>{b.content}</blockquote>
  if(b.kind==='input') return <div style={{width:b.width+'%'}}><input readOnly placeholder={b.content} style={{width:'100%',padding:b.padding,borderRadius:b.radius,border:'1px solid #cbd5e1',background:b.background,color:b.color,fontSize:b.size}} /></div>
  if(b.kind==='navbar') return <nav style={{...style,fontWeight:600,display:'flex',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>{b.content.split('·').map((item,i)=><span key={i}>{item.trim()}</span>)}</nav>
  if(b.kind==='avatar') return <div style={{width:b.width+'%',textAlign:b.align}}><span style={{display:'inline-grid',placeItems:'center',width:b.size+b.padding*2,height:b.size+b.padding*2,borderRadius:'50%',background:b.background,color:b.color,fontWeight:700,fontSize:b.size}}>{b.content}</span></div>
  if(b.kind==='video') return <div style={{width:b.width+'%',aspectRatio:'16/9',background:'#0f172a',borderRadius:b.radius,overflow:'hidden',display:'grid',placeItems:'center',color:'#fff'}}><div style={{textAlign:'center'}}><Play size={34}/><small style={{display:'block',marginTop:8}}>Video · {b.content}</small></div></div>
  if(b.kind==='icon') return <div style={{width:b.width+'%',textAlign:b.align,fontSize:b.size,color:b.color,padding:b.padding}}>{b.content}</div>
  if(b.kind==='progress') return <div style={{width:b.width+'%',background:b.background,borderRadius:999,padding:4}}><div style={{height:10,width:Math.min(100,Math.max(0,Number(b.content)||0))+'%',background:'#64748b',borderRadius:999}}/></div>
  if(b.kind==='divider') return <div style={{padding:b.padding+'px 0',width:b.width+'%'}}><div style={{height:1,background:b.background}} /></div>
  return <div style={{height:b.size,width:'100%'}} />
}
function App(){
  const [project,setProject]=useState<Project>(()=>{try{return JSON.parse(localStorage.getItem(STORAGE)||'null')||initial}catch{return initial}})
  const [selected,setSelected]=useState(project.blocks[0]?.id||'')
  const [tab,setTab]=useState<'elements'|'layers'>('elements')
  const [device,setDevice]=useState<'desktop'|'mobile'>('desktop')
  const [preview,setPreview]=useState(false)
  const [leftOpen,setLeftOpen]=useState(true),[rightOpen,setRightOpen]=useState(true)
  const [query,setQuery]=useState(''),[saved,setSaved]=useState(true),[toast,setToast]=useState('')
  const [history,setHistory]=useState<Project[]>([]),[future,setFuture]=useState<Project[]>([])
  const [dragId,setDragId]=useState<string|null>(null)
  const [zoom,setZoom]=useState(100)
  const importRef=useRef<HTMLInputElement>(null)
  const active=project.blocks.find(b=>b.id===selected)
  useEffect(()=>{const t=window.setTimeout(()=>{localStorage.setItem(STORAGE,JSON.stringify(project));setSaved(true)},450);return()=>window.clearTimeout(t)},[project])
  const notify=(s:string)=>{setToast(s);window.setTimeout(()=>setToast(''),2200)}
  useEffect(()=>{const onKey=(e:KeyboardEvent)=>{const el=e.target as HTMLElement|null;const typing=el&&(el.tagName==='INPUT'||el.tagName==='TEXTAREA'||el.isContentEditable);if(typing)return;const mod=e.metaKey||e.ctrlKey;if(mod&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?redo():undo()}else if((e.key==='Delete'||e.key==='Backspace')&&selected){e.preventDefault();remove()}};window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[selected,history,future,project])
  const commit=(next:Project)=>{setHistory(h=>[...h.slice(-39),project]);setFuture([]);setProject(next);setSaved(false)}
  const update=(patch:Partial<Block>)=>{if(!active)return;commit({...project,blocks:project.blocks.map(b=>b.id===active.id?{...b,...patch}:b)})}
  const add=(kind:Kind)=>{const b=makeBlock(kind);commit({...project,blocks:[...project.blocks,b]});setSelected(b.id);setTab('layers');notify('Elemento aggiunto')}
  const remove=()=>{if(!active)return;commit({...project,blocks:project.blocks.filter(b=>b.id!==active.id)});setSelected(project.blocks.find(b=>b.id!==active.id)?.id||'')}
  const duplicate=()=>{if(!active)return;const b={...active,id:uid(),label:active.label+' copia'};const i=project.blocks.findIndex(x=>x.id===active.id);const blocks=[...project.blocks];blocks.splice(i+1,0,b);commit({...project,blocks});setSelected(b.id);notify('Elemento duplicato')}
  const move=(dir:-1|1)=>{if(!active)return;const i=project.blocks.findIndex(b=>b.id===active.id),j=i+dir;if(j<0||j>=project.blocks.length)return;const blocks=[...project.blocks];[blocks[i],blocks[j]]=[blocks[j],blocks[i]];commit({...project,blocks})}
  const undo=()=>{if(!history.length)return;const prev=history[history.length-1];setFuture(f=>[project,...f]);setHistory(h=>h.slice(0,-1));setProject(prev)}
  const redo=()=>{if(!future.length)return;const next=future[0];setHistory(h=>[...h,project]);setFuture(f=>f.slice(1));setProject(next)}
  const exportProject=()=>{download((project.name||'nova-project').toLowerCase().replace(/\s+/g,'-')+'.json',JSON.stringify(project,null,2));notify('Progetto esportato')}
  const exportHtml=()=>{const html='<!doctype html><html lang="it"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escapeHtml(project.name)+'</title><style>*{box-sizing:border-box}body{margin:0;background:#0b1020;color:#f8fafc;font-family:Inter,system-ui,sans-serif}.page{max-width:1000px;margin:auto;padding:8vh 7vw}h1{line-height:1.1}p{line-height:1.7}.cta{display:inline-block;border:0;border-radius:12px;padding:14px 20px;background:#64748b;color:white;font-weight:700}.card{border:1px solid #293348;border-radius:18px;padding:24px;background:#171e2d}img{max-width:100%;height:auto;display:block}</style><main class="page">'+project.blocks.map(b=>{const c=escapeHtml(b.content);if(b.kind==='heading')return '<h1 style="font-size:'+b.size+'px;text-align:'+b.align+'">'+c+'</h1>';if(b.kind==='text')return '<p style="font-size:'+b.size+'px;text-align:'+b.align+'">'+c+'</p>';if(b.kind==='button')return '<p style="text-align:'+b.align+'"><span class="cta">'+c+'</span></p>';if(b.kind==='image')return '<img src="'+c+'" >';if(b.kind==='shape')return '<div style="width:'+b.width+'%;height:'+b.size+'px;background:'+b.background+';border-radius:'+b.radius+'px"></div>';if(b.kind==='badge')return '<span style="display:inline-block;background:'+b.background+';color:'+b.color+';padding:'+b.padding+'px;border-radius:'+b.radius+'px">'+c+'</span>';if(b.kind==='list')return '<ul>'+c.split('\n').map(x=>'<li>'+x+'</li>').join('')+'</ul>';if(b.kind==='quote')return '<blockquote>'+c+'</blockquote>';if(b.kind==='input')return '<input placeholder="'+c+'" style="padding:'+b.padding+'px;border-radius:'+b.radius+'px">';if(b.kind==='navbar')return '<nav>'+c.split('·').map(x=>'<span style="margin-right:20px">'+x+'</span>').join('')+'</nav>';if(b.kind==='avatar')return '<span style="display:inline-grid;place-items:center;width:64px;height:64px;border-radius:50%;background:'+b.background+';color:'+b.color+'">'+c+'</span>';if(b.kind==='video')return '<div style="aspect-ratio:16/9;background:#0f172a;color:white;padding:20px">Video: '+c+'</div>';if(b.kind==='progress')return '<div style="background:'+b.background+';height:12px;border-radius:99px"><div style="height:12px;width:'+Math.min(100,Number(c)||0)+'%;background:#64748b;border-radius:99px"></div></div>';if(b.kind==='icon')return '<div style="font-size:'+b.size+'px;color:'+b.color+'">'+c+'</div>';if(b.kind==='card')return '<section class="card"><h2>'+escapeHtml(b.label)+'</h2><p>'+c+'</p></section>';if(b.kind==='divider')return '<hr style="border:0;border-top:1px solid '+b.background+'">';return '<div style="height:'+b.size+'px"></div>'}).join('')+'</main></html>';download('nova-studio-site.html',html,'text/html');notify('HTML esportato')}
  const importProject=(file?:File)=>{if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const data=JSON.parse(String(reader.result));if(!data.blocks||!Array.isArray(data.blocks))throw new Error();commit({name:String(data.name||'Progetto importato'),blocks:data.blocks});setSelected(data.blocks[0]?.id||'');notify('Progetto importato')}catch{notify('File progetto non valido')}};reader.readAsText(file)}
  const filtered=useMemo(()=>palette.filter(p=>(p.title+' '+p.desc).toLowerCase().includes(query.toLowerCase())),[query])
  const reorder=(target:string)=>{if(!dragId||dragId===target)return;const blocks=[...project.blocks],from=blocks.findIndex(b=>b.id===dragId),to=blocks.findIndex(b=>b.id===target);const [item]=blocks.splice(from,1);blocks.splice(to,0,item);commit({...project,blocks});setDragId(null)}
  return <div className="app-shell">
    <header className="topbar">
      <div className="brand"><div className="brand-mark"><Sparkles size={17}/></div><span>nova<span className="brand-light">studio</span></span><span className="beta">BETA</span></div>
      <div className="project-name"><input value={project.name} onChange={e=>{setProject(p=>({...p,name:e.target.value}));setSaved(false)}} aria-label="Nome progetto"/><ChevronDown size={13}/></div>
      <div className="top-actions"><span className="save-state"><span className={'status-dot '+(saved?'':'busy')}/>{saved?'Salvato':'Salvataggio…'}</span><button className="icon-btn" title="Annulla" onClick={undo} disabled={!history.length}><Undo2 size={16}/></button><button className="icon-btn" title="Ripeti" onClick={redo} disabled={!future.length}><Redo2 size={16}/></button><span className="top-divider"/><button className="top-btn secondary" onClick={exportProject}><Download size={15}/> Esporta</button><button className="top-btn primary" onClick={()=>{setPreview(!preview);notify(preview?'Editor attivo':'Anteprima attiva')}}><Eye size={15}/>{preview?'Torna all’editor':'Anteprima'}</button></div>
    </header>
    <div className="workspace">
      {!preview&&leftOpen&&<aside className="left-panel">
        <div className="panel-tabs"><button className={tab==='elements'?'active':''} onClick={()=>setTab('elements')}><Grid2X2 size={15}/> Elementi</button><button className={tab==='layers'?'active':''} onClick={()=>setTab('layers')}><Layers size={15}/> Livelli</button></div>
        {tab==='elements'?<><div className="panel-heading"><div><h3>Componenti</h3><p>Costruisci la tua pagina</p></div><span className="count">{palette.length}</span></div><div className="searchbox"><Search size={14}/><input placeholder="Cerca elementi..." value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="component-list">{filtered.map(p=><button className="component-item" key={p.kind} onClick={()=>add(p.kind)}><span className="component-icon"><p.icon size={17}/></span><span><b>{p.title}</b><small>{p.desc}</small></span><Plus size={15} className="add-icon"/></button>)}</div><div className="panel-tip"><Sparkles size={15}/><span><b>Un consiglio</b>Trascina gli elementi nell’ordine che preferisci dal pannello Livelli.</span></div></>:<><div className="panel-heading"><div><h3>Livelli</h3><p>{project.blocks.length} elementi nella pagina</p></div><button className="tiny-btn" onClick={()=>add('text')}><Plus size={15}/></button></div><div className="layer-list">{project.blocks.map((b,i)=><div key={b.id} draggable onDragStart={()=>setDragId(b.id)} onDragOver={e=>e.preventDefault()} onDrop={()=>reorder(b.id)} className={'layer-item '+(selected===b.id?'selected':'')} onClick={()=>setSelected(b.id)}><span className="layer-grip">⠿</span><span className="layer-type">{b.kind==='heading'?<Type size={14}/>:b.kind==='image'?<ImageIcon size={14}/>:b.kind==='button'?<MousePointer2 size={14}/>:b.kind==='card'?<Square size={14}/>:<AlignLeft size={14}/>}</span><span className="layer-name">{b.label}</span><button title="Sposta su" onClick={e=>{e.stopPropagation();setSelected(b.id);const idx=i;if(idx>0){const arr=[...project.blocks];[arr[idx-1],arr[idx]]=[arr[idx],arr[idx-1]];commit({...project,blocks:arr})}}}><MoreHorizontal size={15}/></button></div>)}</div></>}
        <div className="left-footer"><button onClick={()=>importRef.current?.click()}><FolderOpen size={15}/> Apri progetto</button><button onClick={exportProject}><Download size={15}/> Backup JSON</button><input ref={importRef} type="file" accept="application/json,.json" hidden onChange={e=>importProject(e.target.files?.[0])}/></div>
      </aside>}
      <main className="canvas-area">
        <div className="canvas-toolbar"><div className="canvas-label"><span className="live-dot"/><span>{preview?'Anteprima live':'Canvas'}</span><ChevronRight size={13}/><span className="muted-label">{project.name}</span></div><div className="canvas-tools"><button title="Riduci zoom" onClick={()=>setZoom(z=>Math.max(50,z-10))}><ZoomOut size={15}/></button><button title="Aumenta zoom" onClick={()=>setZoom(z=>Math.min(150,z+10))}><ZoomIn size={15}/></button><button className={!preview&&device==='desktop'?'tool-active':''} onClick={()=>setDevice('desktop')} title="Desktop"><Monitor size={16}/></button><button className={!preview&&device==='mobile'?'tool-active':''} onClick={()=>setDevice('mobile')} title="Mobile"><Smartphone size={16}/></button><span className="tool-sep"/><button onClick={()=>setLeftOpen(!leftOpen)} title="Pannello elementi"><PanelLeftClose size={16}/></button><button onClick={()=>setRightOpen(!rightOpen)} title="Inspector"><PanelRightClose size={16}/></button></div></div>
        <div className="canvas-scroll"><div className={'artboard '+(device==='mobile'?'mobile-artboard':'')} style={{transform:'scale('+zoom/100+')',transformOrigin:'top center'}}><div className="artboard-top"><span/><span/><span/><small>{device==='mobile'?'Mobile preview':'Pagina principale'}</small></div><div className="site-canvas">{project.blocks.map(b=><div key={b.id} className={'canvas-block '+(!preview&&selected===b.id?'is-selected':'')} onClick={()=>!preview&&setSelected(b.id)} draggable={!preview} onDragStart={()=>setDragId(b.id)} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.stopPropagation();reorder(b.id)}}>{renderBlock(b)}{!preview&&selected===b.id&&<span className="selection-tag">{b.label}</span>}</div>)}{!preview&&<button className="canvas-add" onClick={()=>add('heading')}><Plus size={16}/> Aggiungi elemento</button>}</div></div></div>
        <div className="canvas-status"><span><span className="status-dot"/>{preview?'Modalità anteprima':'Tutte le modifiche salvate localmente'}</span><span>{device==='desktop'?'1440 px':'390 px'} <span className="status-divider">·</span> {zoom}%</span></div>
      </main>
      {!preview&&rightOpen&&<aside className="right-panel"><div className="inspector-head"><div><h3>Inspector</h3><p>Personalizza elemento</p></div><Settings2 size={17}/></div>{active?<><div className="selected-object"><span className="selected-icon"><Box size={16}/></span><div><b>{active.label}</b><small>{active.kind} · Selezionato</small></div><button onClick={duplicate} title="Duplica"><Copy size={15}/></button><button onClick={remove} title="Elimina"><Trash2 size={15}/></button></div><div className="inspector-section"><h4>Contenuto</h4><label className="field-label">Nome livello<input value={active.label} onChange={e=>update({label:e.target.value})}/></label>{active.kind!=='divider'&&active.kind!=='spacer'&&<label className="field-label">{active.kind==='image'?'URL immagine':'Testo'}{active.kind==='image'?<><input value={active.content.startsWith('data:')?'Immagine caricata dal dispositivo':active.content} onChange={e=>update({content:e.target.value})}/><input type="file" accept="image/*" onChange={e=>{const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>update({content:String(reader.result)});reader.readAsDataURL(file)}}/></>:<textarea rows={active.kind==='heading'?2:3} value={active.content} onChange={e=>update({content:e.target.value})}/>}</label>}</div><div className="inspector-section"><h4>Tipografia</h4><div className="field-row"><label className="field-label">Dimensione <span>{active.size}px</span><input type="range" min="1" max="72" value={active.size} onChange={e=>update({size:+e.target.value})}/></label></div><div className="align-control"><button className={active.align==='left'?'chosen':''} onClick={()=>update({align:'left'})}><AlignLeft size={16}/></button><button className={active.align==='center'?'chosen':''} onClick={()=>update({align:'center'})}><AlignCenter size={16}/></button><button className={active.align==='right'?'chosen':''} onClick={()=>update({align:'right'})}><AlignRight size={16}/></button></div></div><div className="inspector-section"><h4>Aspetto</h4><div className="color-row"><label>Colore testo</label><input type="color" value={active.color.startsWith('#')?active.color:'#ffffff'} onChange={e=>update({color:e.target.value})}/></div><div className="color-row"><label>Sfondo</label><input type="color" value={active.background.startsWith('#')?active.background:'#171e2d'} onChange={e=>update({background:e.target.value})}/></div><label className="field-label">Larghezza <span>{active.width}%</span><input type="range" min="20" max="100" step="5" value={active.width} onChange={e=>update({width:+e.target.value})}/></label><label className="field-label">Raggio angoli <span>{active.radius}px</span><input type="range" min="0" max="36" value={active.radius} onChange={e=>update({radius:+e.target.value})}/></label><label className="field-label">Spaziatura interna <span>{active.padding}px</span><input type="range" min="0" max="48" value={active.padding} onChange={e=>update({padding:+e.target.value})}/></label></div><div className="inspector-section"><h4>Ordine</h4><div className="order-actions"><button onClick={()=>move(-1)}><ArrowUp size={14}/> Porta su</button><button onClick={()=>move(1)}><ArrowDown size={14}/> Porta giù</button></div></div><div className="inspector-bottom"><span><Check size={14}/> Proprietà aggiornate live</span></div></>:<div className="empty-inspector"><MousePointer2 size={24}/><b>Nessun elemento selezionato</b><span>Seleziona un elemento sul canvas o dal pannello Livelli per modificarlo.</span></div>}</aside>}
    </div>
    <footer className="bottom-bar"><div><span className="bottom-brand"><Activity size={14}/> NOVA STUDIO</span><span className="bottom-sep"/> <span>Visual builder</span></div><div><button onClick={exportHtml}><Code2 size={14}/> Esporta HTML</button><button onClick={exportProject}><Download size={14}/> Esporta progetto</button><button onClick={()=>notify('Guida rapida: aggiungi un componente, selezionalo e modifica le proprietà nell’Inspector.')}><CircleHelp size={14}/> Aiuto</button></div></footer>
    {toast&&<div className="toast"><Check size={15}/>{toast}</div>}
  </div>
}
export default App
