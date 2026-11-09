(function(){
  var $=function(s){return document.querySelector(s)};
  // chatbot
  var btn=$('#cf-chat-btn'),box=$('#cf-chat'),log=$('#cf-log'),f=$('#cf-chat form');
  if(btn){btn.onclick=function(){box.style.display=box.style.display==='block'?'none':'block'};
    f.onsubmit=function(e){e.preventDefault();var i=f.querySelector('input'),m=i.value.trim();if(!m)return;
      log.innerHTML+='<div class="cf-u"></div>';log.lastChild.textContent=m;i.value='';
      fetch(CF_API_BASE+CF_ENDPOINTS.bot,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:m})})
      .then(function(r){return r.json()}).then(function(d){add(d.reply||d.response||d.answer||'Thanks! Please try again.')})
      .catch(function(){add('I could not reach the server. Please try again shortly.')});};
    function add(t){log.innerHTML+='<div class="cf-b"></div>';log.lastChild.textContent=t;log.scrollTop=log.scrollHeight}
    add("Hi, I'm TechieStart. Ask me about CareerForge programmes, tracks or how to apply.");}
  // apply form
  var t=$('#cf-type');if(t){t.onchange=function(){document.querySelectorAll('.cf-internship').forEach(function(e){e.style.display=t.value==='Internship'?'block':'none'})}}
  document.querySelectorAll('form[data-cf]').forEach(function(fm){fm.onsubmit=function(e){e.preventDefault();
    var o={};new FormData(fm).forEach(function(v,k){o[k]=v});var s=fm.querySelector('.cf-msg');
    fetch(CF_API_BASE+CF_ENDPOINTS[fm.dataset.cf],{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(o)})
    .then(function(r){if(!r.ok)throw 0;s.textContent='Received. We will be in touch soon.';fm.reset()}).catch(function(){s.textContent='Could not submit right now. Please try again.'})}});
})();
