(function () {
  'use strict';
  const formURL = 'https://forms.gle/j3YSga7YkyxfVhpB7';
  const allowedSources = ['instagram','x','twitter','line','facebook','tiktok','youtube','newsletter','referral','event','organic','direct'];
  const params = new URLSearchParams(location.search);
  const sourceValue = (params.get('utm_source') || '').toLowerCase();
  const source = !sourceValue ? 'direct' : allowedSources.includes(sourceValue) ? sourceValue : 'other';
  window.questTrack = function (event, properties) {
    const payload = {event, site:'career_quest', source, ...properties};
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    document.dispatchEvent(new CustomEvent('careerquest:analytics', {detail:payload}));
  };
  document.querySelectorAll('[data-entry]').forEach(link => {
    link.href = formURL;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.addEventListener('click', () => {
      window.questTrack('cta_click', {placement:link.dataset.placement || 'entry'});
      window.questTrack('application_form_open', {placement:link.dataset.placement || 'entry'});
    });
  });
  document.querySelectorAll('[data-quiz-link]').forEach(link => {
    link.addEventListener('click', () => window.questTrack('diagnosis_open', {placement:link.dataset.placement || 'page'}));
  });
  const menu = document.querySelector('.mobile-menu');
  if (menu) {
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {menu.open=false;}));
    document.addEventListener('click', e => {if(menu.open && !menu.contains(e.target)) menu.open=false;});
    document.addEventListener('keydown', e => {if(e.key==='Escape' && menu.open){menu.open=false;menu.querySelector('summary').focus();}});
  }
  const observed = new Set();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting && !observed.has(entry.target.id)) {
        observed.add(entry.target.id);
        window.questTrack('section_view', {section:entry.target.id});
        observer.unobserve(entry.target);
      }
    }), {threshold:0.12});
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
  }
}());
