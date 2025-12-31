// 自动注入侧边栏到任意页面（基于 Tailwind + lucide）
(function(){
  // 若当前为登录页面，则不要注入侧边栏（避免在登录页显示）
  try{
    const pageName = location.pathname.split('/').pop();
    if(pageName === 'login.html') return;
  }catch(e){}
  const sidebarHTML = `
  <aside class="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col z-20" data-injected-sidebar>
      <div class="h-16 flex items-center px-6 border-b border-slate-100">
          <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg mr-3 shadow-lg shadow-blue-600/20">U</div>
          <span class="font-bold text-lg tracking-tight text-slate-900">大学生岗位胜任力提升平台</span>
      </div>

      <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div class="px-2 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">平台功能</div>
          <a href="index.html" class="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg group transition-all">
              <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
              <span class="font-medium text-sm">主页</span>
          </a>
          <a href="courses.html" class="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg group transition-all">
              <i data-lucide="book-open" class="w-5 h-5 group-hover:text-blue-600 transition-colors"></i>
              <span class="font-medium text-sm">课程中心</span>
          </a>
          <a href="careers.html" class="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg group transition-all">
              <i data-lucide="briefcase" class="w-5 h-5 group-hover:text-blue-600 transition-colors"></i>
              <span class="font-medium text-sm">职位库</span>
          </a>
            <a href="ai.html" class="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg group transition-all">
              <i data-lucide="cpu" class="w-5 h-5 group-hover:text-blue-600 transition-colors"></i>
              <span class="font-medium text-sm">AI智赋</span>
            </a>
          <a href="assessments.html" class="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg group transition-all">
              <i data-lucide="target" class="w-5 h-5 group-hover:text-blue-600 transition-colors"></i>
              <span class="font-medium text-sm">能力测评</span>
          </a>
          <a href="community.html" class="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg group transition-all">
              <i data-lucide="messages-square" class="w-5 h-5 group-hover:text-blue-600 transition-colors"></i>
              <span class="font-medium text-sm">社区</span>
          </a>

          <div class="px-2 mt-8 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">个人中心</div>
          <a href="login.html" class="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg group transition-all">
              <i data-lucide="user-circle" class="w-5 h-5 group-hover:text-blue-600 transition-colors"></i>
              <span class="font-medium text-sm">我的档案</span>
          </a>
          <a href="favorites.html" class="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg group transition-all">
              <i data-lucide="bookmark" class="w-5 h-5 group-hover:text-blue-600 transition-colors"></i>
              <span class="font-medium text-sm">收藏职位</span>
          </a>
      </nav>

      <div class="p-4 border-t border-slate-100">
          <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div class="flex items-center justify-between mb-2">
                  <span class="text-xs font-semibold text-slate-500">档案完善度</span>
                  <span class="text-xs font-bold text-blue-600">85%</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div class="bg-blue-600 h-1.5 rounded-full" style="width: 85%"></div>
              </div>
          </div>
      </div>
  </aside>
  `;

  function injectSidebar(){
    if(!document.body) return;
    // Avoid double-inject
    if(document.querySelector('aside[data-injected-sidebar]')) return;

    const temp = document.createElement('div');
    temp.innerHTML = sidebarHTML.trim();
    const asideEl = temp.firstChild;

    // Ensure body has layout classes
    document.body.classList.add('bg-slate-50','text-slate-800','antialiased','flex','h-screen','overflow-hidden');

    // Insert aside as first child
    document.body.insertBefore(asideEl, document.body.firstChild);

    // Find existing main and convert to scrollable area
    const main = document.querySelector('main') || document.querySelector('body > div') || document.body.querySelector('section');
    if(main){
      main.classList.add('flex-1','flex','flex-col','relative','overflow-hidden');
      // If no inner scroll wrapper, create one and move children
      if(!main.querySelector('.injected-scroll')){
        const scroll = document.createElement('div');
        scroll.className = 'injected-scroll flex-1 overflow-y-auto bg-slate-50 scroll-smooth pb-10';
        while(main.firstChild){
          scroll.appendChild(main.firstChild);
        }
        main.appendChild(scroll);
      }
    }

    // Initialize icons if lucide exists
    if(window.lucide && typeof window.lucide.createIcons === 'function'){
      window.lucide.createIcons();
    }
    // 高亮当前页面对应的链接（例如 ai.html）
    try{
      const current = location.pathname.split('/').pop() || 'index.html';
      const match = asideEl.querySelector(`a[href="${current}"]`);
      if(match){
        match.classList.add('bg-blue-50','text-blue-700');
      }
    }catch(e){}
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', injectSidebar);
  } else {
    injectSidebar();
  }
})();
