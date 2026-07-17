import '../css/home.css';
import { button } from '../components/button'
export function home() {
  setTimeout(() => {
    const header = document.getElementById('site-header');
    if (header) {
      let lastScroll = 0;
      window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        lastScroll = scrollY;
      }, { passive: true });
    }

    const desktopNav = document.getElementById('desktop-nav');
    const navIndicator = document.getElementById('nav-indicator');
    if (desktopNav && navIndicator) {
      const allNavLinks = desktopNav.querySelectorAll('.nav-link');

      function moveIndicatorToLink(link) {
        if (!link || !navIndicator || !desktopNav) return;
        const navRect = desktopNav.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();
        const left = linkRect.left - navRect.left - 2;
        const width = linkRect.width + 4;
        navIndicator.style.left = left + 'px';
        navIndicator.style.width = width + 'px';
        navIndicator.classList.add('visible');
      }

      function initIndicator() {
        const activeLink = desktopNav.querySelector('.nav-link.active');
        if (activeLink) {
          moveIndicatorToLink(activeLink);
        } else if (allNavLinks.length > 0) {
          moveIndicatorToLink(allNavLinks[0]);
        }
      }

      allNavLinks.forEach(link => {
        link.addEventListener('mouseenter', () => moveIndicatorToLink(link));
      });
      desktopNav.addEventListener('mouseleave', () => {
        const activeLink = desktopNav.querySelector('.nav-link.active');
        if (activeLink) moveIndicatorToLink(activeLink);
      });

      setTimeout(initIndicator, 100);
      window.addEventListener('resize', () => {
        const activeLink = desktopNav.querySelector('.nav-link.active');
        if (activeLink) moveIndicatorToLink(activeLink);
      });

      window.moveIndicatorToLink = moveIndicatorToLink;
    }

    const magneticLinks = document.querySelectorAll('.magnetic-link');
    magneticLinks.forEach(link => {
      link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        link.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
      });
      link.addEventListener('mouseleave', () => {
        link.style.transform = 'translate(0, 0)';
      });
    });

    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-overlay');
    if (toggle && menu && overlay) {
      const mobileLinks = menu.querySelectorAll('.mobile-link');

      function closeMenu() {
        toggle.classList.remove('active');
        menu.classList.remove('open');
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
        mobileLinks.forEach(l => {
          l.style.transitionDelay = '0s';
        });
      }
      function openMenu() {
        toggle.classList.add('active');
        menu.classList.add('open');
        overlay.classList.add('visible');
        document.body.style.overflow = 'hidden';
        mobileLinks.forEach((l, i) => {
          l.style.transitionDelay = (0.05 + i * 0.05) + 's';
        });
      }

      toggle.addEventListener('click', () => {
        menu.classList.contains('open') ? closeMenu() : openMenu();
      });
      overlay.addEventListener('click', closeMenu);
      mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
      });
    }

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    function animateCounters() {
      const counters = document.querySelectorAll('.stat-number');
      counters.forEach(counter => {
        if (counter.dataset.animated) return;
        const target = parseFloat(counter.dataset.target);
        const prefix = counter.dataset.prefix || '';
        const suffix = counter.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();
        const isDecimal = target % 1 !== 0;

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 4);
          const current = target * eased;

          if (isDecimal) {
            counter.textContent = prefix + current.toFixed(1) + suffix;
          } else {
            counter.textContent = prefix + Math.round(current) + suffix;
          }

          if (progress < 1) {
            requestAnimationFrame(update);
          }
        }

        counter.dataset.animated = 'true';
        requestAnimationFrame(update);
      });
    }

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
        }
      });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stat-number');
    if (statsSection) counterObserver.observe(statsSection.closest('section'));

    document.querySelectorAll('.faq-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const answer = item.querySelector('.faq-answer');
        const icon = btn.querySelector('.faq-btn-icon');
        const isOpen = answer.classList.contains('open');

        document.querySelectorAll('.faq-answer').forEach(a => {
          a.classList.remove('open');
          a.style.maxHeight = '0';
          if (a.closest('.faq-item').querySelector('.faq-btn-icon')) {
            a.closest('.faq-item').querySelector('.faq-btn-icon').classList.remove('rotated');
          }
        });

        if (!isOpen) {
          answer.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          icon.classList.add('rotated');
        }
      });
    });

    const sections = document.querySelectorAll('section[id]');
    const navLinksList = document.querySelectorAll('.nav-link');

    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
              if (window.moveIndicatorToLink) {
                window.moveIndicatorToLink(link);
              }
            }
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

    sections.forEach(section => navObserver.observe(section));

  }, 100);

  return `
  <!-- ===== OVERLAY PARA MENÚ MÓVIL ===== -->
  <div id="mobile-overlay" class="mobile-overlay md:hidden"></div>

  <!-- ===== HEADER / NAVEGACIÓN PRINCIPAL ===== -->
  <header id="site-header" class="fixed top-0 left-0 right-0 z-50 header-glass animate-navbar-in">
    <div class="w-full max-w-5xl mx-auto px-5 sm:px-6 py-3 flex items-center justify-between">
      <!-- Logo -->
      <a href="#hero" class="flex items-center group animate-logo-in relative">
        <div
          class="absolute -inset-4 bg-gradient-to-r from-[#7c3aed]/20 to-[#6366f1]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 pointer-events-none">
        </div>
        <span
          class="inline-block bg-gradient-to-br from-[#7c3aed] to-[#6366f1] bg-clip-text text-transparent text-4xl font-black animate-pulse-414 group-hover:scale-110 transition-transform duration-300 relative z-10">{</span>
        <span
          class="text-slate-900 font-extrabold text-2xl tracking-tight -ml-0.5 logo-text relative z-10 [text-shadow:0_0_12px_rgba(255,255,255,0.8)] group-hover:text-[#7c3aed] transition-colors duration-300">onnect</span>
      </a>

      <!-- Desktop Nav -->
      <nav id="desktop-nav" class="hidden md:flex nav-pill relative">
        <div class="nav-pill-indicator" id="nav-indicator"></div>
        <a href="#como-funciona" class="magnetic-link nav-link opacity-0 animate-nav-in [animation-delay:300ms] active">Cómo funciona</a>
        <a href="#caracteristicas" class="magnetic-link nav-link opacity-0 animate-nav-in [animation-delay:400ms]">Características</a>
        <a href="#testimonios" class="magnetic-link nav-link opacity-0 animate-nav-in [animation-delay:500ms]">Testimonios</a>
        <a href="#faq" class="magnetic-link nav-link opacity-0 animate-nav-in [animation-delay:700ms]">FAQ</a>
      </nav>

      <!-- Nav Actions -->
      <div class="hidden md:flex nav-actions opacity-0 animate-nav-in [animation-delay:800ms]">
        <a href="#/login" data-route="/login" onclick="navigate(event, '/login')" class="btn-signin rounded text-black [text-shadow:0_0_12px_rgba(255,255,255,0.8)] hover:text-[#7c3aed] transition-colors duration-300">Iniciar sesión</a>
        <a href="#/register" data-route="/register" onclick="navigate(event, '/register')" class="btn-cta">
          <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
          Empezar
        </a>
      </div>

      <!-- Hamburger Button -->
      <button id="menu-toggle" class="md:hidden toggle-btn flex flex-col p-2 rounded-xl hover:bg-slate-100 transition-all duration-300" aria-label="Menú">
        <span></span><span></span><span></span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div id="mobile-menu" class="md:hidden bg-white/95 backdrop-blur-2xl border-t border-slate-100 px-5">
      <div class="flex flex-col space-y-0.5 py-3 text-sm font-medium text-slate-500">
        <a href="#como-funciona" class="mobile-link hover:text-slate-900 hover:bg-slate-50 transition-all py-3 px-4 rounded-xl">Cómo funciona</a>
        <a href="#caracteristicas" class="mobile-link hover:text-slate-900 hover:bg-slate-50 transition-all py-3 px-4 rounded-xl">Características</a>
        <a href="#testimonios" class="mobile-link hover:text-slate-900 hover:bg-slate-50 transition-all py-3 px-4 rounded-xl">Testimonios</a>
        <a href="#planes" class="mobile-link hover:text-slate-900 hover:bg-slate-50 transition-all py-3 px-4 rounded-xl">Planes</a>
        <a href="#faq" class="mobile-link hover:text-slate-900 hover:bg-slate-50 transition-all py-3 px-4 rounded-xl">FAQ</a>
        <div class="border-t border-slate-100 my-2"></div>
        <a href="#hero" class="mobile-link text-[#7c3aed] font-bold hover:text-[#6366f1] hover:bg-slate-50 transition-all py-3 px-4 rounded-xl">Iniciar sesión</a>
        <a href="#hero" class="mobile-link bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-all w-full mt-1 flex items-center justify-center gap-2">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="7" y1="17" x2="17" y2="7"></line>
            <polyline points="7 7 17 7 17 17"></polyline>
          </svg>
          Empezar
        </a>
      </div>
    </div>
  </header>

  <!-- ===== SECCIÓN HERO ===== -->
  <section id="hero" class="relative pt-32 pb-20 min-h-[95vh] flex items-center justify-center bg-[#F9FAFB] overflow-hidden">
    <!-- Fondos dinámicos de colores -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[10%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-br from-brand-300/30 to-indigo-300/30 blur-[100px] animate-pulse-slow"></div>
      <div class="absolute top-[20%] -left-[10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tr from-violet-300/30 to-fuchsia-300/30 blur-[120px] animate-pulse-slow" style="animation-delay: 2s;"></div>
      <div class="absolute inset-0 dot-grid opacity-[0.35]"></div>
      <div class="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
      <div class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
    </div>

    <!-- Contenido del hero -->
    <div class="relative z-10 max-w-7xl mx-auto px-5 w-full flex flex-col items-center text-center mt-10">

      <!-- Etiqueta superior -->
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-100 shadow-sm mb-8 reveal">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-brand-600"></span>
        </span>
        <span class="text-xs font-bold uppercase tracking-wider text-brand-700">La nueva era de colaboración</span>
      </div>

      <!-- Título Principal -->
      <h1 class="text-5xl sm:text-7xl lg:text-[5.5rem] font-heading font-black tracking-tight text-slate-900 mb-6 reveal reveal-delay-1 leading-[1.05]">
        Conecta con tu <br class="hidden sm:block" />
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-fuchsia-600 animate-gradient-xy">
          Equipo Ideal
        </span>
      </h1>

      <!-- Subtítulo -->
      <p class="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 reveal reveal-delay-2 leading-relaxed">
        Descubre tu rol perfecto, haz match con desarrolladores talentosos y construye proyectos increíbles desde el primer día con nuestras herramientas de colaboración en tiempo real.
      </p>

      <!-- Botones de Acción -->
      <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto reveal reveal-delay-3">
        <button class="relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-brand-600 rounded-2xl hover:bg-brand-700 hover:shadow-[0_8px_30px_rgba(124,58,237,0.3)] hover:-translate-y-1 overflow-hidden group">
          <span class="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
          <a href="#/register" data-route="/register" onclick="navigate(event, '/register')" class="relative flex items-center gap-2">
            ¡Empieza ahora!
            <svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </button>
       </div>

      <!-- Interfaz Flotante (Mockup Dashboard) -->
      <div class="mt-16 w-full max-w-5xl mx-auto relative reveal reveal-delay-4 z-20">
        <div class="absolute -inset-1 bg-gradient-to-r from-brand-500 to-indigo-500 rounded-3xl blur-2xl opacity-20 animate-pulse-slow"></div>
        <div class="relative bg-white/70 backdrop-blur-2xl border border-white p-2 rounded-3xl shadow-2xl">
          <div class="w-full bg-slate-100 rounded-t-2xl px-4 py-3 flex items-center gap-2 border-b border-slate-200">
            <div class="w-3 h-3 rounded-full bg-rose-400"></div>
            <div class="w-3 h-3 rounded-full bg-amber-400"></div>
            <div class="w-3 h-3 rounded-full bg-emerald-400"></div>
          </div>
          <img src="./assets/home.jpg" alt="Connect Dashboard" class="w-full rounded-b-2xl shadow-inner object-cover h-[300px] sm:h-[400px] lg:h-[550px] grayscale-[15%] hover:grayscale-0 transition-all duration-700" />

          <div class="absolute -left-6 top-1/4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] animate-float hidden md:flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p class="text-sm font-bold text-slate-800 font-heading">¡Match de equipo!</p>
              <p class="text-xs font-medium text-slate-500">Frontend Developer</p>
            </div>
          </div>

          <div class="absolute -right-6 bottom-1/4 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] animate-float-delay hidden md:flex items-center gap-4">
            <div class="flex -space-x-3">
              <div class="w-10 h-10 rounded-full border-[3px] border-white bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xs font-bold shadow-md">JD</div>
              <div class="w-10 h-10 rounded-full border-[3px] border-white bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">MF</div>
            </div>
            <div>
              <p class="text-sm font-bold text-slate-800 font-heading">Proyecto iniciado</p>
              <p class="text-xs font-medium text-slate-500">E-commerce App</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== BARRA DE ESTADÍSTICAS ===== -->
  <section class="w-full relative z-30 -mt-10 md:-mt-16 px-5 sm:px-6">
    <div class="max-w-6xl mx-auto bg-white/80 backdrop-blur-2xl border border-white shadow-[0_8px_40px_rgb(0,0,0,0.06)] rounded-3xl p-8 md:p-12">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-100">
        <div class="reveal visible">
          <p class="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-brand-600 to-indigo-600 font-heading tracking-tight flex justify-center items-baseline gap-1">
            <span class="stat-number" data-target="12">0</span><span class="text-3xl">K</span>
          </p>
          <p class="text-sm text-slate-500 mt-2 font-semibold tracking-wide uppercase">Desarrolladores</p>
        </div>
        <div class="reveal visible reveal-delay-1 border-transparent md:border-slate-100">
          <p class="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-brand-600 to-indigo-600 font-heading tracking-tight flex justify-center items-baseline gap-1">
            <span class="stat-number" data-target="3.4">0</span><span class="text-3xl">K</span>
          </p>
          <p class="text-sm text-slate-500 mt-2 font-semibold tracking-wide uppercase">Equipos Formados</p>
        </div>
        <div class="reveal visible reveal-delay-2 pt-8 md:pt-0">
          <p class="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-brand-600 to-indigo-600 font-heading tracking-tight flex justify-center items-baseline gap-1">
            <span class="stat-number" data-target="98">0</span><span class="text-3xl">%</span>
          </p>
          <p class="text-sm text-slate-500 mt-2 font-semibold tracking-wide uppercase">Satisfacción</p>
        </div>
        <div class="reveal visible reveal-delay-3 pt-8 md:pt-0 border-transparent md:border-slate-100">
          <p class="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-brand-600 to-indigo-600 font-heading tracking-tight flex justify-center items-baseline gap-1">
            <span class="text-3xl">+</span><span class="stat-number" data-target="250">0</span>
          </p>
          <p class="text-sm text-slate-500 mt-2 font-semibold tracking-wide uppercase">Proyectos Activos</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== SECCIÓN "CÓMO FUNCIONA" ===== -->
  <section id="como-funciona" class="max-w-7xl mx-auto px-5 sm:px-6 py-24 lg:py-32 relative">
    <div class="text-center max-w-3xl mx-auto mb-20 reveal">
      <h2 class="text-brand-600 font-bold tracking-widest uppercase text-sm mb-4">Proceso</h2>
      <h3 class="text-4xl md:text-5xl font-heading font-black text-slate-900 tracking-tight">Tu camino hacia el éxito</h3>
      <p class="text-slate-500 mt-5 text-lg leading-relaxed">Tres pasos simples, un solo objetivo: construir el software del mañana en equipo.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
      <div class="hidden md:block absolute top-12 left-[10%] w-[80%] h-1 bg-gradient-to-r from-brand-100 via-brand-300 to-brand-100 z-0"></div>

      <div class="relative z-10 flex flex-col items-center text-center group reveal reveal-delay-1">
        <div class="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-brand-500 to-indigo-600 mb-8 border-2 border-brand-50 group-hover:scale-110 group-hover:-translate-y-2 group-hover:shadow-brand-500/20 transition-all duration-300">
          01
        </div>
        <h4 class="text-2xl font-bold text-slate-900 mb-4 font-heading">Crea tu perfil</h4>
        <p class="text-slate-500 leading-relaxed max-w-xs">Regístrate y completa tu perfil técnico detallando tu experiencia, stack favorito y disponibilidad de tiempo.</p>
      </div>

      <div class="relative z-10 flex flex-col items-center text-center group reveal reveal-delay-2">
        <div class="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-brand-500 to-indigo-600 mb-8 border-2 border-brand-50 group-hover:scale-110 group-hover:-translate-y-2 group-hover:shadow-brand-500/20 transition-all duration-300">
          02
        </div>
        <h4 class="text-2xl font-bold text-slate-900 mb-4 font-heading">Encuentra tu equipo</h4>
        <p class="text-slate-500 leading-relaxed max-w-xs">Nuestro algoritmo de IA se encarga de conectarte con desarrolladores cuyas habilidades complementen las tuyas.</p>
      </div>

      <div class="relative z-10 flex flex-col items-center text-center group reveal reveal-delay-3">
        <div class="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-brand-500 to-indigo-600 mb-8 border-2 border-brand-50 group-hover:scale-110 group-hover:-translate-y-2 group-hover:shadow-brand-500/20 transition-all duration-300">
          03
        </div>
        <h4 class="text-2xl font-bold text-slate-900 mb-4 font-heading">Colabora y crea</h4>
        <p class="text-slate-500 leading-relaxed max-w-xs">Accede a un entorno con herramientas integradas, Kanban y chats para lanzar tu proyecto sin complicaciones.</p>
      </div>
    </div>
  </section>

  <!-- ===== SECCIÓN CARACTERÍSTICAS ===== -->
  <section id="caracteristicas" class="py-24 lg:py-32 bg-dark relative overflow-hidden">
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-900/40 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-900/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
    <div class="absolute inset-0 dot-grid opacity-[0.05]"></div>

    <div class="max-w-7xl mx-auto px-5 sm:px-6 relative z-10">
      <div class="text-center max-w-3xl mx-auto mb-20 reveal">
        <h2 class="text-brand-400 font-bold tracking-widest uppercase text-sm mb-4">Características Premium</h2>
        <h3 class="text-4xl md:text-5xl font-heading font-black text-white tracking-tight">Todo lo que necesitas para gestionar Coders</h3>
        <p class="text-slate-400 mt-5 text-lg leading-relaxed">Una plataforma pensada para evaluar, organizar y potenciar el crecimiento de los equipos de desarrollo.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:bg-white/[0.05] hover:border-brand-500/40 transition-all duration-500 group reveal">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mb-6 border border-violet-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-transform text-violet-400">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h4 class="text-xl font-bold text-white mb-3 font-heading">Banco de preguntas</h4>
          <p class="text-slate-400 leading-relaxed text-sm">Crea, edita, activa o desactiva preguntas y configura pruebas técnicas a la medida de cada proceso de evaluación.</p>
        </div>

        <div class="p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:bg-white/[0.05] hover:border-indigo-500/40 transition-all duration-500 group reveal reveal-delay-1">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center mb-6 border border-indigo-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-transform text-indigo-400">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h4 class="text-xl font-bold text-white mb-3 font-heading">Estadísticas en tiempo real</h4>
          <p class="text-slate-400 leading-relaxed text-sm">Revisa el progreso de registro y las estadísticas generales de cada equipo, con datos siempre actualizados.</p>
        </div>

        <div class="p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:bg-white/[0.05] hover:border-rose-500/40 transition-all duration-500 group reveal reveal-delay-2">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500/20 to-orange-500/20 flex items-center justify-center mb-6 border border-rose-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-transform text-rose-400">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h4 class="text-xl font-bold text-white mb-3 font-heading">Gestión de equipos</h4>
          <p class="text-slate-400 leading-relaxed text-sm">Consulta las fortalezas y debilidades de los equipos conformados, y toma decisiones informadas sobre su composición.</p>
        </div>

        <div class="p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:bg-white/[0.05] hover:border-emerald-500/40 transition-all duration-500 group reveal">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-6 border border-emerald-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-transform text-emerald-400">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h4 class="text-xl font-bold text-white mb-3 font-heading">Pruebas técnicas configurables</h4>
          <p class="text-slate-400 leading-relaxed text-sm">Diseña assessments a la medida, activa las preguntas que necesites y evalúa el nivel técnico real de cada Coder.</p>
        </div>

        <div class="p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:bg-white/[0.05] hover:border-amber-500/40 transition-all duration-500 group reveal reveal-delay-1">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center mb-6 border border-amber-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-transform text-amber-400">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h4 class="text-xl font-bold text-white mb-3 font-heading">Recomendaciones inteligentes</h4>
          <p class="text-slate-400 leading-relaxed text-sm">Recibe sugerencias personalizadas para mejorar el rendimiento individual y grupal de tus equipos de Coders.</p>
        </div>

        <div class="p-8 rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] hover:bg-white/[0.05] hover:border-cyan-500/40 transition-all duration-500 group reveal reveal-delay-2">
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-6 border border-cyan-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-transform text-cyan-400">
            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17a5 5 0 110-10 5 5 0 010 10z" />
            </svg>
          </div>
          <h4 class="text-xl font-bold text-white mb-3 font-heading">Panel de administración</h4>
          <p class="text-slate-400 leading-relaxed text-sm">Gestiona todo desde un solo lugar: usuarios, roles, equipos y contenido de evaluación, con control total como administrador.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== SECCIÓN TESTIMONIOS (CAROUSEL MARQUEE) ===== -->
  <section id="testimonios" class="py-24 lg:py-32 bg-slate-50 overflow-hidden relative">
    <div class="absolute inset-0 bg-gradient-to-b from-white to-slate-50/50"></div>
    <div class="text-center max-w-3xl mx-auto mb-16 relative z-10 reveal">
      <h2 class="text-brand-600 font-bold tracking-widest uppercase text-sm mb-4">Comunidad</h2>
      <h3 class="text-4xl md:text-5xl font-heading font-black text-slate-900 tracking-tight">Amado por desarrolladores</h3>
    </div>

    <div class="relative w-full flex overflow-hidden mask-image-fade py-4 z-10 group" style="mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);">
      <div class="flex space-x-6 animate-marquee group-hover:[animation-play-state:paused]">
        <div class="w-[350px] md:w-[400px] shrink-0 bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-slate-100">
          <div class="flex gap-1 text-amber-400 mb-5">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          </div>
          <p class="text-slate-700 leading-relaxed mb-6 italic text-[15px]">"Encontré a mi co-founder en Connect. En dos semanas ya teníamos el MVP listo. La mejor decisión que tomé para mi startup."</p>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">MJ</div>
            <div>
              <p class="font-bold text-slate-900 font-heading">María José</p>
              <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold">Full Stack · Medellín</p>
            </div>
          </div>
        </div>

        <div class="w-[350px] md:w-[400px] shrink-0 bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-slate-100">
          <div class="flex gap-1 text-amber-400 mb-5">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          </div>
          <p class="text-slate-700 leading-relaxed mb-6 italic text-[15px]">"La funcionalidad de matching es increíble. Encontré un equipo que complementaba perfectamente mis habilidades en backend."</p>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md">CP</div>
            <div>
              <p class="font-bold text-slate-900 font-heading">Carlos Pérez</p>
              <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold">Backend · Bogotá</p>
            </div>
          </div>
        </div>

        <div class="w-[350px] md:w-[400px] shrink-0 bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-slate-100">
          <div class="flex gap-1 text-amber-400 mb-5">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          </div>
          <p class="text-slate-700 leading-relaxed mb-6 italic text-[15px]">"Las herramientas de colaboración me ahorraron horas de reuniones. Todo lo que necesitamos está en un solo lugar y súper intuitivo."</p>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-md">AG</div>
            <div>
              <p class="font-bold text-slate-900 font-heading">Andrea Gómez</p>
              <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold">Frontend · Cali</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex space-x-6 animate-marquee ml-6 group-hover:[animation-play-state:paused]" aria-hidden="true">
        <!-- (Duplicated marquee content) -->
        <div class="w-[350px] md:w-[400px] shrink-0 bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-slate-100">
          <div class="flex gap-1 text-amber-400 mb-5">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          </div>
          <p class="text-slate-700 leading-relaxed mb-6 italic text-[15px]">"Encontré a mi co-founder en Connect. En dos semanas ya teníamos el MVP listo. La mejor decisión que tomé para mi startup."</p>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">MJ</div>
            <div>
              <p class="font-bold text-slate-900 font-heading">María José</p>
              <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold">Full Stack · Medellín</p>
            </div>
          </div>
        </div>

        <div class="w-[350px] md:w-[400px] shrink-0 bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-slate-100">
          <div class="flex gap-1 text-amber-400 mb-5">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          </div>
          <p class="text-slate-700 leading-relaxed mb-6 italic text-[15px]">"La funcionalidad de matching es increíble. Encontré un equipo que complementaba perfectamente mis habilidades en backend."</p>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold shadow-md">CP</div>
            <div>
              <p class="font-bold text-slate-900 font-heading">Carlos Pérez</p>
              <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold">Backend · Bogotá</p>
            </div>
          </div>
        </div>

        <div class="w-[350px] md:w-[400px] shrink-0 bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.04)] border border-slate-100">
          <div class="flex gap-1 text-amber-400 mb-5">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          </div>
          <p class="text-slate-700 leading-relaxed mb-6 italic text-[15px]">"Las herramientas de colaboración me ahorraron horas de reuniones. Todo lo que necesitamos está en un solo lugar y súper intuitivo."</p>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold shadow-md">AG</div>
            <div>
              <p class="font-bold text-slate-900 font-heading">Andrea Gómez</p>
              <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold">Frontend · Cali</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== SECCIÓN FAQ ===== -->
  <section id="faq" class="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
    <div class="max-w-4xl mx-auto px-5 sm:px-6 relative z-10">
      <div class="text-center mb-16 reveal">
        <h2 class="text-brand-600 font-bold tracking-widest uppercase text-sm mb-4">FAQ</h2>
        <h3 class="text-4xl md:text-5xl font-heading font-black text-slate-900 tracking-tight">Preguntas frecuentes</h3>
      </div>

      <div class="space-y-4">
        <div class="faq-item bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-brand-300 transition-colors duration-300 reveal shadow-sm">
          <button class="faq-btn w-full flex items-center justify-between p-6 text-left font-bold font-heading text-lg text-slate-900 transition-colors duration-300">
            <span class="pr-4">¿Cómo funciona el algoritmo de matching?</span>
            <svg class="faq-btn-icon w-6 h-6 text-brand-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div class="faq-answer">
            <p class="px-6 pb-6 text-slate-600 leading-relaxed">El algoritmo analiza tu stack tecnológico, nivel de experiencia, intereses y disponibilidad. Luego te conecta con desarrolladores cuyas habilidades complementan las tuyas, maximizando la compatibilidad del equipo.</p>
          </div>
        </div>

        <div class="faq-item bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-brand-300 transition-colors duration-300 reveal shadow-sm reveal-delay-1">
          <button class="faq-btn w-full flex items-center justify-between p-6 text-left font-bold font-heading text-lg text-slate-900 transition-colors duration-300">
            <span class="pr-4">¿Puedo usar Connect si soy principiante?</span>
            <svg class="faq-btn-icon w-6 h-6 text-brand-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div class="faq-answer">
            <p class="px-6 pb-6 text-slate-600 leading-relaxed">¡Claro! Connect está diseñado para desarrolladores de todos los niveles. El algoritmo prioriza la complementariedad, así que te emparejaremos con personas que puedan guiarte y con quienes puedas crecer.</p>
          </div>
        </div>

  
      </div>
    </div>
  </section>

  <!-- ===== CTA FINAL ===== -->
  <section class="py-24 relative overflow-hidden mx-5 sm:mx-10 mb-10 rounded-[3rem] bg-dark border border-slate-800 shadow-2xl reveal">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-900/40 via-dark to-dark pointer-events-none"></div>
    <div class="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-500/20 rounded-full blur-[100px] pointer-events-none"></div>

    <div class="relative z-10 text-center px-5 max-w-4xl mx-auto">
      <h2 class="text-4xl md:text-6xl font-heading font-black text-white mb-6 leading-tight">Inicia tu próximo gran proyecto <span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-400">hoy mismo</span></h2>
      <p class="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">Únete a miles de desarrolladores que ya encontraron su equipo ideal. Empieza en segundos, es completamente gratis.</p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="#/register" data-route="/register" onclick="navigate(event, '/register')" class=" cursor-pointer px-8 py-4 bg-white text-slate-900 font-bold rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(255,255,255,0.2)]">Crear cuenta gratis</a>
        <a href="#/login" data-route="/login" onclick="navigate(event, '/login')" class=" cursor-pointer px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors border border-white/20">Iniciar sesion</a>
      </div>
    </div>
  </section>

  <!-- ===== FOOTER ===== -->
  <footer class="bg-dark text-slate-400 relative overflow-hidden pt-20 pb-10 border-t border-slate-900">
    <div class="absolute inset-0 dot-grid opacity-[0.05]"></div>
    <div class="max-w-7xl mx-auto px-5 sm:px-6 grid grid-cols-2 md:grid-cols-5 gap-10 relative z-10 mb-16">

      <div class="col-span-2">
        <div class="flex items-center space-x-0.5 mb-6">
          <span class="text-brand-500 font-black text-3xl font-mono">{</span>
          <span class="text-white font-black text-2xl tracking-tight -ml-1">onnect</span>
        </div>
        <p class="text-sm leading-relaxed text-slate-400 max-w-xs">La plataforma definitiva para conectar desarrolladores, formar equipos ágiles y construir software del futuro.</p>

        <div class="flex gap-4 mt-8">
          <a href="#" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg></a>
          <a href="#" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg></a>
          <a href="#" class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-brand-600 hover:text-white transition-all"><svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg></a>
        </div>
      </div>

      <div>
        <h4 class="font-bold text-white text-sm mb-5 uppercase tracking-wider">Producto</h4>
        <ul class="space-y-3 text-sm font-medium">
          <li><a href="#" class="hover:text-brand-400 transition-colors">Características</a></li>
          <li><a href="#" class="hover:text-brand-400 transition-colors">Precios</a></li>
          <li><a href="#" class="hover:text-brand-400 transition-colors">Integraciones</a></li>
          <li><a href="#" class="hover:text-brand-400 transition-colors">Changelog</a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold text-white text-sm mb-5 uppercase tracking-wider">Compañía</h4>
        <ul class="space-y-3 text-sm font-medium">
          <li><a href="#" class="hover:text-brand-400 transition-colors">Nosotros</a></li>
          <li><a href="#" class="hover:text-brand-400 transition-colors">Blog</a></li>
          <li><a href="#" class="hover:text-brand-400 transition-colors">Carreras</a></li>
          <li><a href="#" class="hover:text-brand-400 transition-colors">Contacto</a></li>
        </ul>
      </div>

      <div>
        <h4 class="font-bold text-white text-sm mb-5 uppercase tracking-wider">Legal</h4>
        <ul class="space-y-3 text-sm font-medium">
          <li><a href="#" class="hover:text-brand-400 transition-colors">Privacidad</a></li>
          <li><a href="#" class="hover:text-brand-400 transition-colors">Términos</a></li>
          <li><a href="#" class="hover:text-brand-400 transition-colors">Cookies</a></li>
        </ul>
      </div>
    </div>

    <div class="border-t border-slate-800 pt-8 text-center text-xs relative z-10 flex flex-col items-center">
      <div class="flex items-center text-brand-500 font-bold text-xl font-mono mb-2">
        <span>&lt;/Riwi&gt;</span>
      </div>
      <span class="text-[10px] font-bold text-brand-500/50 tracking-[0.2em] uppercase mb-4">&lt;Por Coders para Coders&gt;</span>
      <p>&copy; 2026 Connect. Todos los derechos reservados.</p>
    </div>
  </footer>
  `;
}