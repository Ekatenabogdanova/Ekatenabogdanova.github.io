/* Метрика сайта: Яндекс Метрика + цели по кликам.
   Подключается на всех публичных страницах: <script src="assets/metrics.js" defer></script>
   Пока YM_ID пустой, скрипт ничего не грузит и ничего не отправляет. */
(function () {
  var YM_ID = 0; // номер счётчика из metrika.yandex.ru, например 98765432

  if (!YM_ID || location.hostname !== 'ekateribogdana.github.io') return;

  (function (m, e, t, r, i, k, a) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
    m[i].l = 1 * new Date();
    for (var j = 0; j < e.scripts.length; j++) { if (e.scripts[j].src === r) return; }
    k = e.createElement(t); a = e.getElementsByTagName(t)[0];
    k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
  })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

  // Откуда пришли: нейропоиски и ИИ-ассистенты — отдельным параметром визита
  var AI_REFERRERS = {
    'chatgpt.com': 'ChatGPT', 'chat.openai.com': 'ChatGPT',
    'perplexity.ai': 'Perplexity', 'claude.ai': 'Claude',
    'gemini.google.com': 'Gemini', 'copilot.microsoft.com': 'Copilot',
    'alice.yandex.ru': 'Алиса', 'ya.ru': 'Яндекс', 'deepseek.com': 'DeepSeek',
    'you.com': 'You.com', 'phind.com': 'Phind'
  };
  var visit = {};
  var ref = '';
  try { ref = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '') : ''; } catch (e) {}
  for (var host in AI_REFERRERS) {
    if (ref === host || ref.slice(-host.length - 1) === '.' + host) { visit.ai_source = AI_REFERRERS[host]; break; }
  }
  var utm = new URLSearchParams(location.search).get('utm_source');
  if (utm) visit.utm_source = utm;

  ym(YM_ID, 'init', {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
    params: visit
  });
  if (visit.ai_source) ym(YM_ID, 'reachGoal', 'ai_visit', visit);

  // Цели: что считаем откликом рекрутера
  function goalFor(href) {
    if (/^mailto:/.test(href)) return 'contact_email';
    if (/t\.me\//.test(href)) return 'contact_telegram';
    if (/\.pdf($|\?)/i.test(href)) return 'resume_pdf';
    if (/resume\.html/.test(href)) return 'resume_open';
    if (/behance\.net/.test(href)) return 'behance';
    if (/figma\.com/.test(href)) return 'figma_prototype';
    if (/vidmerdance\.ru/.test(href)) return 'vidmer_live';
    if (/(looma|vidmer|frameup)\.html/.test(href)) return 'case_open';
    return null;
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    var goal = goalFor(href);
    if (goal) ym(YM_ID, 'reachGoal', goal, { from: location.pathname, href: href });
  }, true);

  // Дочитали кейс до конца — видна финальная полоса со следующим проектом
  var end = document.querySelector('.case-next');
  if (end && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        ym(YM_ID, 'reachGoal', 'case_read_to_end', { page: location.pathname });
        io.disconnect();
      }
    });
    io.observe(end);
  }
})();
