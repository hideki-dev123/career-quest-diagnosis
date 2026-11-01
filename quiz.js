(function () {
  'use strict';
  const {questions,outcomes,scoreAnswers,restoreProgress} = window.QUEST_QUIZ;
  const storageKey = 'career-quest-quiz-v2';
  const home = document.body.dataset.home || './';
  document.querySelectorAll('[data-home-link]').forEach(a => {a.href=home;});
  document.querySelectorAll('[data-home-section]').forEach(a => {a.href=home+'#'+a.dataset.homeSection;});
  const $ = id => document.getElementById(id);
  const screens = ['quiz-intro','quiz-question','quiz-result'];
  let answers = Array(questions.length).fill(null), step=0, completed=false, started=false;
  function track(name,properties){if(window.questTrack)window.questTrack(name,properties);}
  function save(){try{sessionStorage.setItem(storageKey,JSON.stringify({answers,step,completed}));}catch(_){/* private browsing may disallow storage */}}
  try {
    const saved = restoreProgress(JSON.parse(sessionStorage.getItem(storageKey)));
    if(saved) {
      answers=saved.answers; step=saved.step; completed=saved.completed;
      started=answers.some(Boolean);
      if(started){$('resume-note').hidden=false;$('quiz-start').firstChild.textContent=completed?'前回の結果を見る ':'続きから回答する ';}
    }
  } catch(_){/* ignore corrupt or unavailable session storage */}
  function show(id){screens.forEach(s=>{$(s).hidden=s!==id;});window.scrollTo({top:0,behavior:'instant'});}
  function renderQuestion(){
    completed=false; show('quiz-question');
    const q=questions[step]; const number=String(step+1).padStart(2,'0');
    $('question-title').textContent=q.title;$('question-legend').textContent=q.title;
    $('question-number').textContent=number;$('question-kicker').textContent='QUESTION '+number;
    $('quiz-progress').value=step+1;$('quiz-progress').textContent=(step+1)+' / 10';
    $('quiz-next').disabled=!answers[step];$('next-label').textContent=step===9?'結果を見る':'次の質問へ';
    $('quiz-choices').replaceChildren();
    q.choices.forEach((choice,index)=>{
      const label=document.createElement('label');label.className='quiz-choice';
      const input=document.createElement('input');input.type='radio';input.name='answer';input.value=choice.type;input.required=true;input.checked=answers[step]===choice.type;
      const key=document.createElement('span');key.className='choice-key';key.textContent=String.fromCharCode(65+index);
      const text=document.createElement('span');text.textContent=choice.text;
      const check=document.createElement('span');check.className='choice-check';check.textContent='✓';check.setAttribute('aria-hidden','true');
      input.addEventListener('change',()=>{answers[step]=choice.type;$('quiz-next').disabled=false;save();});
      label.append(input,key,text,check);$('quiz-choices').append(label);
    });
    save();$('question-title').focus({preventScroll:true});
  }
  function para(text,className){const el=document.createElement('p');el.textContent=text;if(className)el.className=className;return el;}
  function renderResult(emit){
    const {scores,matches}=scoreAnswers(answers);completed=true;save();show('quiz-result');
    $('result-title').textContent=matches.length>1?'複数の傾向があります。':'今のあなたには、'+outcomes[matches[0]].name+'から。';
    $('result-lead').textContent=matches.length>1?'同じ得点のコースを並べてご紹介します。どちらも今のあなたの一面。自分が近いと感じる入口を選んでください。':'選んだ回答から、今のあなたに合いそうな体験の入口をご提案します。';
    $('result-scores').replaceChildren();
    Object.entries(scores).forEach(([type,score])=>{
      const item=document.createElement('div');item.className='score-item';
      const text=para(outcomes[type].name+' '+score+' / 10');const meter=document.createElement('meter');meter.min=0;meter.max=10;meter.value=score;meter.setAttribute('aria-label',outcomes[type].name+'に対応する回答 '+score+'問');item.append(text,meter);$('result-scores').append(item);
    });
    $('result-cards').replaceChildren();
    matches.forEach(type=>{
      const data=outcomes[type],card=document.createElement('article');card.className='result-card';
      const top=document.createElement('div');top.className='result-card-top';top.append(para(data.roman,'eyebrow'),para('今のあなたにおすすめ','result-badge'));
      const h=document.createElement('h2');const name=document.createElement('span');name.textContent=data.name;h.append(name,document.createTextNode(data.title));
      card.append(top,h,para(data.subtitle,'result-subtitle'),para(data.state));
      [['おすすめする理由',data.reason],['最初に体験してみること',data.experience],['持ち帰るもののイメージ',data.takeaway]].forEach(([label,text])=>{const heading=document.createElement('h3');heading.textContent=label;card.append(heading,para(text));});
      const intent=para('次の希望：'+data.cta,'result-intent');
      const entry=document.createElement('a');entry.href='https://forms.gle/j3YSga7YkyxfVhpB7';entry.target='_blank';entry.rel='noopener noreferrer';entry.className='button result-entry';entry.textContent=data.name+'から始めたい方のエントリー ↗';entry.addEventListener('click',()=>{track('cta_click',{placement:'result_'+type});track('application_form_open',{placement:'result_'+type});});
      const note=para('共通の0期生エントリーシートが開きます。Googleログインが必要です。希望コースは運営からの案内時にお伝えください。','small-note');
      const link=document.createElement('a');link.className='plain-link';link.href=home+'#'+type;link.textContent=data.name+'のコース内容・参加条件を見る →';card.append(intent,entry,note,link);$('result-cards').append(card);
    });
    if(emit)track('diagnosis_complete',{types:matches.join(','),question_count:10});
    $('result-title').focus({preventScroll:true});
  }
  $('quiz-start').addEventListener('click',()=>{if(!started){track('diagnosis_start',{question_count:10});started=true;}if(completed)renderResult(false);else renderQuestion();});
  $('quiz-form').addEventListener('submit',event=>{event.preventDefault();if(!answers[step])return;if(step<9){step++;renderQuestion();}else renderResult(true);});
  $('quiz-back').addEventListener('click',()=>{if(step===0){save();show('quiz-intro');$('quiz-start').focus({preventScroll:true});}else{step--;renderQuestion();}});
  $('quiz-retry').addEventListener('click',()=>{answers=Array(10).fill(null);step=0;completed=false;started=true;$('resume-note').hidden=true;save();track('diagnosis_start',{question_count:10,retry:true});renderQuestion();});
}());
