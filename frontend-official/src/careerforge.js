(function(){
  var $=function(s){return document.querySelector(s)};
  document.querySelectorAll('a[data-cf-apply]').forEach(function(link){
    var target=new URL(CF_APPLICATION_URL,window.location.href);
    target.searchParams.set('type',link.getAttribute('data-cf-apply'));
    link.href=target.toString();
  });
  // chatbot
  var btn=$('#cf-chat-btn'),box=$('#cf-chat'),log=$('#cf-log'),f=$('#cf-chat form');
  if(btn){btn.onclick=function(){box.style.display=box.style.display==='block'?'none':'block'};
    var sessionKey='cf_chat_session_id',sessionId=sessionStorage.getItem(sessionKey);
    if(!sessionId){sessionId=window.crypto&&window.crypto.randomUUID?window.crypto.randomUUID():'cf-'+Date.now()+'-'+Math.random().toString(36).slice(2);sessionStorage.setItem(sessionKey,sessionId)}
    var chatHeader=box.querySelector('header');if(chatHeader)chatHeader.textContent='CareerForge Assistant';
    f.onsubmit=function(e){e.preventDefault();var i=f.querySelector('input'),m=i.value.trim();if(!m)return;
      log.innerHTML+='<div class="cf-u"></div>';log.lastChild.textContent=m;i.value='';
      fetch(CF_API_BASE+CF_ENDPOINTS.bot,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({session_id:sessionId,message:m})})
      .then(function(r){return r.json().then(function(d){if(!r.ok)throw new Error(d.detail||'Chat request failed');return d})})
      .then(function(d){add(d.reply||'The assistant did not return a response.')})
      .catch(function(){add('I could not reach the server. Please try again shortly.')});};
    function add(t){log.innerHTML+='<div class="cf-b"></div>';log.lastChild.textContent=t;log.scrollTop=log.scrollHeight}
    add("Hi, I'm the CareerForge assistant. Ask me about programmes, tracks or how to apply.");}
  // apply form
  var t=$('#cf-type');if(t){t.onchange=function(){document.querySelectorAll('.cf-internship').forEach(function(e){e.style.display=t.value==='Internship'?'block':'none'})}}
  document.querySelectorAll('form[data-cf]').forEach(function(fm){fm.onsubmit=function(e){e.preventDefault();
    var o={};new FormData(fm).forEach(function(v,k){o[k]=v});var s=fm.querySelector('.cf-msg');
    fetch(CF_API_BASE+CF_ENDPOINTS[fm.dataset.cf],{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(o)})
    .then(function(r){if(!r.ok)throw 0;s.textContent='Received. We will be in touch soon.';fm.reset()}).catch(function(){s.textContent='Could not submit right now. Please try again.'})}});
})();
