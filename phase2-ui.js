/* Projeto Ativa — telas da Fase 2 (prévia; sem alterações na produção). */
(function(root){
'use strict';
const dayNames=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const configs={
 exercisePlan:{title:'Planejamento semanal',fields:[['weekday','Dia','day'],['activity','Exercício','text'],['durationMinutes','Minutos previstos','number'],['notes','Observações','textarea']]},
 exerciseRecords:{title:'Exercícios realizados',fields:[['date','Data','date'],['activity','Atividade','text'],['durationMinutes','Duração (minutos)','number'],['intensity','Intensidade','select:leve|moderada|intensa'],['notes','Observações','textarea']]},
 healthMetrics:{title:'Medidas de saúde (opcional)',fields:[['date','Data','date'],['weightKg','Peso (kg)','number'],['waistCm','Cintura (cm)','number'],['hipCm','Quadril (cm)','number'],['notes','Observações','textarea']]},
 moodEntries:{title:'Como me senti',fields:[['date','Data','date'],['mood','Humor','select:muito bem|bem|neutro|cansada|triste/sobrecarregada'],['factors','O que influenciou?','textarea'],['needs','Do que preciso?','textarea']]},
 journalEntries:{title:'Meu diário privado',fields:[['date','Data','date'],['text','Escrever sobre meu dia','textarea'],['gratefulFor','Sou grata por','textarea'],['bestPart','Melhor momento','textarea']]},
 spiritualEntries:{title:'Espiritualidade',fields:[['date','Data','date'],['practice','Prática','select:oração|bíblia|meditação|outra'],['reference','Versículo ou passagem','text'],['reflection','Reflexão','textarea']]},
 homeTasks:{title:'Tarefas da casa',fields:[['date','Data','date'],['title','Tarefa','text'],['category','Categoria','select:limpeza|roupas|cozinha|compras|organização|outro'],['recurrence','Frequência','select:única|diária|semanal|mensal'],['notes','Observações','textarea']]},
 familyEntries:{title:'Momentos em família',fields:[['date','Data','date'],['activity','Momento','text'],['people','Com quem','text'],['description','O que quero lembrar','textarea']]}
};
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function today(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function fieldHtml(field,index,section){const [name,label,type]=field;const id='phase2-field-'+section+'-'+index;
 let control='';
 if(type==='day')control='<select id="'+id+'">'+dayNames.map((d,i)=>'<option value="'+i+'">'+d+'</option>').join('')+'</select>';
 else if(type.startsWith('select:'))control='<select id="'+id+'">'+type.slice(7).split('|').map(v=>'<option value="'+esc(v)+'">'+esc(v)+'</option>').join('')+'</select>';
 else if(type==='textarea')control='<textarea id="'+id+'" rows="2" maxlength="6000"></textarea>';
 else control='<input id="'+id+'" type="'+type+'" '+(type==='number'?'min="1" max="600" step="1"':'')+(type==='date'?' value="'+today()+'"':'')+' maxlength="160">';
 return '<div class="row"><label for="'+id+'">'+esc(label)+'</label>'+control+'</div>';
}
function form(section){const config=configs[section];return '<section class="panel"><h2>'+esc(config.title)+'</h2><p class="muted">Preencha apenas o que fizer sentido para você.</p>'+config.fields.map((field,index)=>fieldHtml(field,index,section)).join('')+'<button class="primary" onclick="ProjetoAtivaPhase2UI.add(\''+section+'\')">Salvar registro</button></section>'}
function list(section,data){const items=Array.isArray(data[section])?data[section]:[];return `<section class="panel"><h3>Registros (${items.length})</h3>${items.length?items.slice().reverse().slice(0,30).map((item,index)=>`<div class="habit"><div><b>${esc(item.activity||item.title||item.practice||item.mood||item.text||item.date||'Registro')}</b><small>${esc([item.date,item.durationMinutes?item.durationMinutes+' min':'',item.notes||item.description||item.gratefulFor||''].filter(Boolean).join(' · '))}</small></div>${section==='homeTasks'?'<button class="secondary" onclick="ProjetoAtivaPhase2UI.toggleTask('+(items.length-1-index)+')">'+(item.completed?'Concluída':'Concluir')+'</button> ':''}<button class="secondary" onclick="ProjetoAtivaPhase2UI.removeAt('${section}',${items.length-1-index})">Excluir</button></div>`).join(''):'<p class="muted">Nenhum registro ainda.</p>'}</section>`}
function summary(data){const week=new Date();week.setDate(week.getDate()-6);const start=[week.getFullYear(),String(week.getMonth()+1).padStart(2,'0'),String(week.getDate()).padStart(2,'0')].join('-');const records=(data.exerciseRecords||[]).filter(x=>x.date>=start&&x.completed!==false);const minutes=records.reduce((n,x)=>n+(Number(x.durationMinutes)||0),0);return '<section class="panel"><h2>Minha evolução recente</h2><div class="stats"><div class="stat"><span>Exercícios em 7 dias</span><b>'+records.length+'</b></div><div class="stat"><span>Minutos de movimento</span><b>'+minutes+'</b></div><div class="stat"><span>Registros de humor</span><b>'+(data.moodEntries||[]).length+'</b></div><div class="stat"><span>Momentos em família</span><b>'+(data.familyEntries||[]).length+'</b></div></div></section>'}
function sectionLinks(){return '<section class="panel"><h3>Outras áreas</h3><div class="actions">'+[['Rotina','Rotina'],['Metas','Metas'],['Pilares','Pilares'],['Calendário','Calendário'],['Espiritualidade','Espiritualidade'],['Lar e família','Lar e família']].map(([label,tab])=>'<button class="secondary" onclick="go(\''+tab+'\')">'+label+'</button>').join('')+'</div></section>'}
function calendar(data){
 const dates=[...new Set([...(data.exerciseRecords||[]).map(x=>x.date),...(data.moodEntries||[]).map(x=>x.date),...(data.journalEntries||[]).map(x=>x.date),...(data.spiritualEntries||[]).map(x=>x.date),...(data.homeTasks||[]).map(x=>x.date),...(data.familyEntries||[]).map(x=>x.date)])].filter(Boolean).sort().reverse().slice(0,40);
 const rows=dates.map(date=>{
  const groups=[['Exercícios',(data.exerciseRecords||[]).filter(x=>x.date===date).map(x=>x.activity)],['Humor',(data.moodEntries||[]).filter(x=>x.date===date).map(x=>x.mood)],['Diário',(data.journalEntries||[]).filter(x=>x.date===date).map(x=>'Registro pessoal')],['Espiritualidade',(data.spiritualEntries||[]).filter(x=>x.date===date).map(x=>x.practice)],['Casa',(data.homeTasks||[]).filter(x=>x.date===date).map(x=>x.title)],['Família',(data.familyEntries||[]).filter(x=>x.date===date).map(x=>x.activity)]].filter(g=>g[1].length);
  return '<div class="habit"><div><b>'+esc(new Date(date+'T12:00:00').toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'long',year:'numeric'}))+'</b><small>'+groups.map(g=>esc(g[0]+': '+g[1].join(', '))).join(' · ')+'</small></div></div>';
 });
 return '<section class="hero"><h1>Meu calendário</h1><p>Um histórico dos registros feitos nas diferentes áreas.</p></section><section class="panel">'+(rows.join('')||'<p class="muted">Seus registros aparecerão aqui quando você começar a usar as áreas da Fase 2.</p>')+'</section>';
}
function render(tab,data){let sections=[];
 if(tab==='Saúde')sections=['exercisePlan','exerciseRecords','healthMetrics'];
 if(tab==='Diário')sections=['moodEntries','journalEntries'];
 if(tab==='Espiritualidade')sections=['spiritualEntries'];
 if(tab==='Lar e família')sections=['homeTasks','familyEntries'];
 if(tab==='Calendário')return calendar(data)+sectionLinks();
 if(tab==='Evolução 2')return summary(data)+sectionLinks();
 if(!sections.length)return '';
 return '<section class="hero"><h1>'+esc(tab)+'</h1><p>Um passo de cada vez, no seu ritmo.</p></section>'+(tab==='Diário'?'<p class="note">Este diário é destinado ao uso privado na sua conta. Não há compartilhamento no aplicativo. A proteção depende da segurança da conta e das políticas do Supabase; não é criptografia ponta a ponta.</p>':'')+sections.map(s=>form(s)+list(s,data)).join('')+sectionLinks();
}
function add(section){const config=configs[section];if(!config)return;const item={id:'phase2-'+Date.now()+'-'+Math.random().toString(36).slice(2,9)};config.fields.forEach(([field,,type],i)=>{const el=document.getElementById('phase2-field-'+section+'-'+i);if(!el)return;let value=el.value.trim();if(!value)return;if(type==='number')value=Number(value);if(type==='day')value=Number(value);item[field]=value});if(section==='exercisePlan')item.active=true;if(section==='exerciseRecords')item.completed=true;if(section==='homeTasks')item.completed=false;
 if(!item.activity&&!item.title&&!item.mood&&!item.text&&!item.practice&&!item.weightKg&&!item.waistCm&&!item.hipCm){alert('Preencha pelo menos o campo principal.');return}
 const next=window.ProjetoAtivaPhase2.normalize({[section]:[item]})[section];if(next.length!==1){alert('Confira os dados preenchidos e tente novamente.');return}
 const old=data[section];data[section]=[...(old||[]),next[0]];if(!save()){data[section]=old;alert('Não foi possível salvar. Seus dados anteriores foram preservados.');return}renderApp();
}
function remove(section,id){if(!configs[section]||!confirm('Excluir este registro?'))return;const old=data[section];data[section]=(old||[]).filter(x=>x.id!==id);if(!save()){data[section]=old;alert('Não foi possível excluir. Seus dados anteriores foram preservados.');return}renderApp()}
function toggleTask(index){const old=data.homeTasks;const list=[...(old||[])];if(!list[index])return;list[index]={...list[index],completed:!list[index].completed};data.homeTasks=list;if(!save()){data.homeTasks=old;alert('Não foi possível atualizar a tarefa.');return}renderApp()}
function removeAt(section,index){const item=data[section]?.[index];if(item)remove(section,item.id)}
function renderApp(){root.render()}
root.ProjetoAtivaPhase2UI={render,add,removeAt,toggleTask};
})(window);
