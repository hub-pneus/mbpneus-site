// ==========================================
// HEADER COM SOMBRA AO ROLAR
// ==========================================
class HeaderScroll {
  constructor() {
    this.header = document.getElementById('header');
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        this.header.classList.add('scrolled');
      } else {
        this.header.classList.remove('scrolled');
      }
    });
  }
}

// ==========================================
// MENU HAMBURGUER
// ==========================================
class MenuMobile {
  constructor() {
    this.menuToggle = document.getElementById('menuToggle');
    this.headerNav = document.getElementById('headerNav');
    this.navLinks = document.querySelectorAll('.header__nav a');
    this.init();
  }

  init() {
    this.menuToggle.addEventListener('click', () => {
      this.toggleMenu();
    });

    this.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeMenu();
      });
    });
  }

  toggleMenu() {
    this.menuToggle.classList.toggle('active');
    this.headerNav.classList.toggle('active');
  }

  closeMenu() {
    this.menuToggle.classList.remove('active');
    this.headerNav.classList.remove('active');
  }
}

// ==========================================
// HERO SLIDER
// ==========================================
class HeroSlider {
  constructor() {
    this.slides = document.querySelectorAll('.hero__slide');
    this.dots = document.querySelectorAll('.hero__dot');
    this.prevBtn = document.querySelector('.hero__arrow--prev');
    this.nextBtn = document.querySelector('.hero__arrow--next');
    this.currentIndex = 0;
    this.autoplayInterval = null;
    this.autoplayDuration = 5000;
    this.transitionDuration = 500;
    this.init();
  }

  init() {
    if (this.slides.length === 0) return;

    this.prevBtn?.addEventListener('click', () => this.goToPrevious());
    this.nextBtn?.addEventListener('click', () => this.goToNext());

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    this.startAutoplay();

    document.querySelector('.hero__slider')?.addEventListener('mouseenter', () => this.stopAutoplay());
    document.querySelector('.hero__slider')?.addEventListener('mouseleave', () => this.startAutoplay());
  }

  updateSlide() {
    this.slides.forEach((slide, index) => {
      if (index === this.currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    this.dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  goToNext() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateSlide();
    this.resetAutoplay();
  }

  goToPrevious() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateSlide();
    this.resetAutoplay();
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateSlide();
    this.resetAutoplay();
  }

  startAutoplay() {
    if (this.autoplayInterval) return;
    this.autoplayInterval = setInterval(() => {
      this.goToNext();
    }, this.autoplayDuration);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  resetAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }
}

// ==========================================
// NAVEGAÇÃO SUAVE
// ==========================================
function inicializarNavegacao() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href !== '#' && document.querySelector(href)) {
        e.preventDefault();
        const elemento = document.querySelector(href);
        const offset = elemento.offsetTop - 70;
        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ==========================================
// ACTIVE MENU STATE
// ==========================================
function inicializarActiveMenu() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__list a');

  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;

        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });
}

// ==========================================
// EXIT INTENT POP-UP
// ==========================================
class ExitIntentPopup {
  constructor() {
    this.overlay = document.getElementById('exitIntentOverlay');
    this.closeBtn = document.querySelector('.exit-intent-close');
    this.hasShown = sessionStorage.getItem('exitIntentShown');
    this.canShow = false;
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.init();
  }

  init() {
    if (this.hasShown) {
      return;
    }

    setTimeout(() => {
      this.canShow = true;
      if (this.isMobile) {
        this.startMobileTimer();
      }
    }, 5000);

    if (!this.isMobile) {
      document.addEventListener('mouseleave', () => this.handleExitIntent());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.overlay.classList.contains('visible')) {
        this.closePopup();
      }
    });

    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.closePopup();
      }
    });

    this.closeBtn.addEventListener('click', () => {
      this.closePopup();
    });
  }

  handleExitIntent() {
    if (this.canShow && !this.hasShown && this.isLeavingPage()) {
      this.showPopup();
    }
  }

  isLeavingPage() {
    const event = window.event;
    if (event && event.clientY <= 0) {
      return true;
    }
    return false;
  }

  startMobileTimer() {
    setTimeout(() => {
      if (!this.hasShown) {
        this.showPopup();
      }
    }, 30000);
  }

  showPopup() {
    this.overlay.classList.add('visible');
    sessionStorage.setItem('exitIntentShown', 'true');
    this.hasShown = true;
    document.body.style.overflow = 'hidden';
  }

  closePopup() {
    this.overlay.classList.remove('visible');
    document.body.style.overflow = 'auto';
  }
}

// ==========================================
// ANIMAÇÕES DE SEÇÕES - INTERSECTION OBSERVER
// ==========================================
function inicializarAnimacoesSecoes() {
  const sections = document.querySelectorAll('section[id]');
  let sectionIndex = 0;

  const observerOptions = {
    root: null,
    rootMargin: '-100px 0px -100px 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('visible')) {
        const index = Array.from(sections).indexOf(entry.target);
        const isOdd = (index % 2) === 0;

        entry.target.classList.add('section-animate-' + (isOdd ? 'left' : 'right'));
        entry.target.classList.add('visible');

        const cards = entry.target.querySelectorAll('.service-card, .oferta__card, .diferenciais__card');
        cards.forEach(card => {
          setTimeout(() => {
            card.classList.add('visible');
          }, 50);
        });

        const priceElements = entry.target.querySelectorAll('.oferta__price-value');
        priceElements.forEach(priceEl => {
          animarPreco(priceEl);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    sectionObserver.observe(section);
  });
}

function animarPreco(element) {
  const text = element.textContent;
  const match = text.match(/R\$\s*([\d.,]+)/);

  if (match && !element.dataset.animado) {
    element.dataset.animado = 'true';
    const valorFinal = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
    const valorInicial = 0;
    const duracao = 1000;
    const inicio = Date.now();

    const animar = () => {
      const agora = Date.now();
      const tempo = Math.min((agora - inicio) / duracao, 1);
      const valorAtual = valorInicial + (valorFinal - valorInicial) * tempo;

      element.textContent = 'R$ ' + valorAtual.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      if (tempo < 1) {
        requestAnimationFrame(animar);
      }
    };

    animar();
  }
}

// ==========================================
// SCROLL PROGRESS BAR
// ==========================================
function inicializarScrollBar() {
  const scrollBar = document.querySelector('body::after');

  window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    const style = document.createElement('style');
    style.textContent = `body::after { width: ${scrollPercent}% !important; }`;

    if (document.querySelector('style[data-scroll]')) {
      document.querySelector('style[data-scroll]').remove();
    }
    style.setAttribute('data-scroll', 'true');
    document.head.appendChild(style);
  });
}

// ==========================================
// RIPPLE EFFECT
// ==========================================
function adicionarRippleEffect() {
  const buttons = document.querySelectorAll('.btn-primary, .floating-whatsapp');

  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        animation: ripple 0.4s ease-out;
      `;

      if (!this.style.position || this.style.position === 'static') {
        this.style.position = 'relative';
      }

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 400);
    });
  });
}

// ==========================================
// CONTADOR DE NÚMEROS
// ==========================================
function inicializarContadorNumeros() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        const text = entry.target.textContent;
        const match = text.match(/R\$?\s*([\d.,]+)/);

        if (match) {
          entry.target.dataset.counted = 'true';
          const finalValue = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
          const startValue = 0;
          const duration = 1000;
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = startValue + (finalValue - startValue) * progress;

            entry.target.textContent = 'R$ ' + currentValue.toFixed(2).replace('.', ',');

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          animate();
        }
      }
    });
  });

  document.querySelectorAll('.service-card p, .pneus__price').forEach(el => {
    observer.observe(el);
  });
}


// ==========================================
// 4. ANIMAÇÃO EM CASCATA NOS CARDS
// ==========================================
class StaggerAnimation {
  constructor() {
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.staggerAnimated) {
          entry.target.dataset.staggerAnimated = 'true';
          const cards = entry.target.querySelectorAll('.service-card, .pecas__card, .diferenciais__card, .oferta__card, .pneus__logo');

          cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
              card.style.transition = 'opacity 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, index * 100);
          });
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => observer.observe(section));
  }
}

// ==========================================
// 5. TOOLTIPS NAS LOGOS DE MARCAS
// ==========================================
class BrandTooltip {
  constructor() {
    this.tooltips = {
      'Goodyear': 'Pneus nacionais a partir de R$ 239,90',
      'Pirelli': 'Alta performance e durabilidade',
      'Bridgestone': 'Conforto e segurança em qualquer terreno',
      'Michelin': 'Maior garantia de fábrica do mercado',
      'Continental': 'Tecnologia europeia de ponta',
      'Dunlop': 'Importado — Aro 13 a partir de R$ 209,90',
      'Hankook': 'Performance para o dia a dia',
      'Nexen': 'Custo-benefício imbatível',
      'Kumho': 'Durabilidade comprovada',
      'Firestone': 'Tradição e confiança'
    };
    this.init();
  }

  init() {
    const logos = document.querySelectorAll('.pneus__logo');
    logos.forEach(logo => {
      const text = logo.textContent.trim();
      const tooltip = this.tooltips[text];

      if (tooltip) {
        logo.style.position = 'relative';
        logo.addEventListener('mouseenter', (e) => this.showTooltip(e, tooltip));
        logo.addEventListener('mouseleave', (e) => this.hideTooltip(e));
      }
    });
  }

  showTooltip(e, text) {
    const tooltipEl = document.createElement('div');
    tooltipEl.className = 'brand-tooltip';
    tooltipEl.textContent = text;
    tooltipEl.style.cssText = `
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-8px);
      background: #111;
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.85rem;
      white-space: nowrap;
      z-index: 1000;
      margin-bottom: 8px;
      animation: tooltipEnter 0.2s ease;
      pointer-events: none;
    `;

    const arrow = document.createElement('div');
    arrow.style.cssText = `
      position: absolute;
      bottom: -4px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 4px solid #111;
    `;

    tooltipEl.appendChild(arrow);
    e.target.appendChild(tooltipEl);
  }

  hideTooltip(e) {
    const tooltip = e.target.querySelector('.brand-tooltip');
    if (tooltip) {
      tooltip.style.animation = 'tooltipExit 0.2s ease forwards';
      setTimeout(() => tooltip.remove(), 200);
    }
  }
}

// ==========================================
// 7. SKELETON LOADING NAS IMAGENS
// ==========================================
class SkeletonLoader {
  constructor() {
    this.init();
  }

  init() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      const skeleton = document.createElement('div');
      skeleton.className = 'skeleton-loader';
      skeleton.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%);
        background-size: 200% 100%;
        animation: shimmer 1.4s infinite;
        border-radius: inherit;
      `;

      img.parentElement.style.position = 'relative';
      img.parentElement.appendChild(skeleton);

      img.addEventListener('load', () => {
        skeleton.style.animation = 'none';
        skeleton.style.opacity = '1';
        skeleton.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
          skeleton.style.opacity = '0';
          setTimeout(() => skeleton.remove(), 300);
        }, 100);
      });
    });
  }
}

// ==========================================
// 8. WHATSAPP FLUTUANTE COM PULSO
// ==========================================
class WhatsAppPulse {
  constructor() {
    this.whatsapp = document.querySelector('.floating-whatsapp');
    this.init();
  }

  init() {
    if (!this.whatsapp) return;

    const pulse1 = document.createElement('div');
    pulse1.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
      border: 2px solid #25D366;
      border-radius: 50%;
      animation: whatsappPulse 2s infinite;
      pointer-events: none;
    `;

    const pulse2 = document.createElement('div');
    pulse2.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
      border: 2px solid #25D366;
      border-radius: 50%;
      animation: whatsappPulse 2s infinite;
      animation-delay: 0.5s;
      pointer-events: none;
    `;

    this.whatsapp.appendChild(pulse1);
    this.whatsapp.appendChild(pulse2);

    this.whatsapp.addEventListener('mouseenter', () => {
      pulse1.style.animationPlayState = 'paused';
      pulse2.style.animationPlayState = 'paused';
      this.whatsapp.style.transform = 'scale(1.1)';
    });

    this.whatsapp.addEventListener('mouseleave', () => {
      pulse1.style.animationPlayState = 'running';
      pulse2.style.animationPlayState = 'running';
      this.whatsapp.style.transform = 'scale(1)';
    });
  }
}


// ==========================================
// 10. TRANSIÇÃO ENTRE SEÇÕES COM LINHA
// ==========================================
class SectionDivider {
  constructor() {
    this.init();
  }

  init() {
    const sectionBefores = document.querySelectorAll('section::before');
    const sections = document.querySelectorAll('section');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.dividerAnimated) {
          entry.target.dataset.dividerAnimated = 'true';

          const index = Array.from(sections).indexOf(entry.target);
          if (index > 0) {
            const prevSection = sections[index - 1];
            const divider = document.createElement('div');
            divider.className = 'section-divider-line';
            divider.style.cssText = `
              position: absolute;
              top: -1px;
              left: 0;
              width: 40px;
              height: 1px;
              background: #CC0000;
              animation: dividerLine 0.8s ease forwards;
              z-index: 1;
            `;

            entry.target.style.position = 'relative';
            entry.target.appendChild(divider);

            setTimeout(() => {
              divider.style.background = '#EBEBEB';
              divider.style.width = '100%';
              divider.style.animation = 'none';
            }, 800);
          }
        }
      });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));
  }
}

// ==========================================
// LAZY LOADING OTIMIZADO DE MAPAS
// ==========================================
class LazyMapLoader {
  constructor() {
    this.mapaContainer = document.getElementById('mapaContainer');
    if (!this.mapaContainer) return;

    this.mapaIframe = document.getElementById('mapaIframe');
    this.skeleton = document.getElementById('mapSkeleton');

    this.init();
  }

  init() {
    // IntersectionObserver para carregar mapa quando visível
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadMap();
          observer.unobserve(this.mapaContainer);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(this.mapaContainer);

    // Fallback: carregar após 3 segundos mesmo que não visível
    setTimeout(() => {
      if (!this.mapaIframe.src) {
        this.loadMap();
      }
    }, 3000);
  }

  loadMap() {
    if (!this.mapaIframe.src && this.mapaIframe.dataset.src) {
      const src = this.mapaIframe.dataset.src;
      this.mapaIframe.src = src;

      // Remover skeleton quando iframe carrega
      this.mapaIframe.addEventListener('load', () => {
        this.removeSkeleton();
      }, { once: true });

      // Fallback: remover skeleton após 2 segundos
      setTimeout(() => {
        this.removeSkeleton();
      }, 2000);
    }
  }

  removeSkeleton() {
    if (this.skeleton) {
      this.skeleton.classList.add('hidden');
      setTimeout(() => {
        this.skeleton.style.display = 'none';
      }, 300);
    }

    // Mostrar iframe com fade-in
    if (this.mapaIframe) {
      this.mapaIframe.style.opacity = '1';
    }
  }
}

// ==========================================
// SOMBRAS DINÂMICAS DE TRANSIÇÃO
// ==========================================
class DynamicSectionShadows {
  constructor() {
    this.sections = document.querySelectorAll('section');
    this.isActive = false;
    this.observer = null;
    this.animationFrameId = null;

    this.init();
  }

  init() {
    // IntersectionObserver para ativar/desativar a lógica apenas para seções visíveis
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!this.isActive) {
            this.isActive = true;
            this.startShadowUpdates();
          }
        }
      });
    }, { threshold: 0, rootMargin: '100px' });

    // Observar todas as seções
    this.sections.forEach(section => this.observer.observe(section));
  }

  startShadowUpdates() {
    const updateShadows = () => {
      this.updateAllShadows();
      this.animationFrameId = requestAnimationFrame(updateShadows);
    };

    // Remover listener anterior se existir
    window.removeEventListener('scroll', this.updateAllShadows);

    // Listener com throttle via requestAnimationFrame
    this.onScroll = () => {
      if (!this.animationFrameId) {
        this.animationFrameId = requestAnimationFrame(() => {
          this.updateAllShadows();
          this.animationFrameId = null;
        });
      }
    };

    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  updateAllShadows() {
    const viewportHeight = window.innerHeight;
    const viewportCenter = viewportHeight / 2;

    this.sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;

      // Calcular intensidade baseado na distância até a linha de transição
      let topIntensity = this.calculateIntensity(sectionTop, viewportHeight);
      let bottomIntensity = this.calculateIntensity(sectionBottom, viewportHeight);

      // Aplicar opacidade às sombras
      const shadowOpacity = this.getShadowOpacity(section);

      if (section.style.setProperty) {
        // Usar CSS custom properties para máxima performance
        section.style.setProperty('--shadow-top-opacity', (topIntensity * shadowOpacity).toString());
        section.style.setProperty('--shadow-bottom-opacity', (bottomIntensity * shadowOpacity).toString());
      }

      // Alternativa: atualizar ::before e ::after diretamente
      // (nota: não é possível acessar pseudo-elementos diretamente, então usamos CSS variables)
    });

    // Atualizar as sombras via CSS
    this.applyShadowStyles();
  }

  calculateIntensity(edgePosition, viewportHeight) {
    // Distância em pixels até a linha de transição do viewport (topo)
    const distanceToTop = Math.abs(edgePosition);
    const distanceToBottom = Math.abs(edgePosition - viewportHeight);
    const closestDistance = Math.min(distanceToTop, distanceToBottom);

    // Fórmula: intensidade máxima quando na borda, diminui conforme se afasta
    // Intervalo: 100px para diminuir de 1.0 a 0.0
    const maxDistance = 100;
    const intensity = Math.max(0, 1 - (closestDistance / maxDistance));

    return intensity;
  }

  getShadowOpacity(section) {
    // Aumentar opacidade em seções escuras
    const bgColor = window.getComputedStyle(section).backgroundColor;
    const isDarkSection = section.classList.contains('diferenciais') ||
                         section.classList.contains('footer');

    // Reduzir em mobile
    const isMobile = window.innerWidth < 768;
    const mobileReduction = isMobile ? 0.7 : 1;

    return (isDarkSection ? 0.35 : 0.18) * mobileReduction;
  }

  applyShadowStyles() {
    // Criar/atualizar stylesheet dinâmico para as sombras
    let styleEl = document.getElementById('dynamic-shadows-style');

    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-shadows-style';
      document.head.appendChild(styleEl);
    }

    let css = '';
    this.sections.forEach((section, index) => {
      const topOpacity = section.style.getPropertyValue('--shadow-top-opacity') || '0';
      const bottomOpacity = section.style.getPropertyValue('--shadow-bottom-opacity') || '0';

      css += `
        section:nth-of-type(${index + 1})::before {
          opacity: ${topOpacity};
        }
        section:nth-of-type(${index + 1})::after {
          opacity: ${bottomOpacity};
        }
      `;
    });

    styleEl.textContent = css;
  }

  stopShadowUpdates() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.onScroll) {
      window.removeEventListener('scroll', this.onScroll);
    }
  }
}

// ==========================================
// CAROUSEL DE AVALIAÇÕES
// ==========================================
class ReviewsCarousel {
  constructor() {
    this.carousel = document.getElementById('avaliacoesCarousel');
    if (!this.carousel) return;

    this.track = this.carousel.querySelector('.avaliacoes__track');
    this.slides = this.carousel.querySelectorAll('.avaliacoes__slide');
    this.prevBtn = document.getElementById('carouselPrev');
    this.nextBtn = document.getElementById('carouselNext');
    this.dotsContainer = document.getElementById('carouselDots');

    this.currentIndex = 0;
    this.autoplayInterval = null;

    this.init();
  }

  init() {
    this.createDots();
    this.updateCarousel();

    this.prevBtn?.addEventListener('click', () => this.prev());
    this.nextBtn?.addEventListener('click', () => this.next());

    this.startAutoplay();

    this.carousel?.addEventListener('mouseenter', () => this.stopAutoplay());
    this.carousel?.addEventListener('mouseleave', () => this.startAutoplay());
  }

  createDots() {
    this.slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.className = `avaliacoes__dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Ir para avaliação ${index + 1}`);
      dot.addEventListener('click', () => this.goToSlide(index));
      this.dotsContainer?.appendChild(dot);
    });
  }

  updateCarousel() {
    const offset = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${offset}%)`;

    document.querySelectorAll('.avaliacoes__dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.updateCarousel();
    this.resetAutoplay();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    this.updateCarousel();
    this.resetAutoplay();
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
    this.resetAutoplay();
  }

  startAutoplay() {
    if (this.autoplayInterval) return;
    this.autoplayInterval = setInterval(() => this.next(), 6000);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  resetAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }
}

// ==========================================
// ADICIONAR KEYFRAMES E ESTILOS
// ==========================================
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  @keyframes magneticRipple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  @keyframes tooltipEnter {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(-8px);
    }
  }

  @keyframes tooltipExit {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(-8px);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(4px);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  @keyframes whatsappPulse {
    0% {
      box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7);
    }
    70% {
      box-shadow: 0 0 0 16px rgba(37, 211, 102, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(37, 211, 102, 0);
    }
  }

  @keyframes dividerLine {
    from {
      width: 40px;
    }
    to {
      width: 100%;
    }
  }
`;

document.head.appendChild(styleSheet);

// ==========================================
// GERENCIADOR DE MODAL TERMOS E PRIVACIDADE
// ==========================================
class TermsModal {
  constructor() {
    this.modal = document.getElementById('termsModal');
    this.privacyBtn = document.getElementById('privacyBtn');
    this.termsBtn = document.getElementById('termsBtn');
    this.closeBtn = document.querySelector('.terms-modal__close');
    this.overlay = document.querySelector('.terms-modal__overlay');
    this.privacyContent = document.getElementById('privacyContent');
    this.termsContent = document.getElementById('termsContent');

    this.init();
  }

  init() {
    if (!this.privacyBtn || !this.termsBtn || !this.modal) return;

    this.privacyBtn.addEventListener('click', () => this.openPrivacy());
    this.termsBtn.addEventListener('click', () => this.openTerms());
    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', () => this.close());

    // Fechar ao pressionar ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
    });
  }

  openPrivacy() {
    this.privacyContent.style.display = 'block';
    this.termsContent.style.display = 'none';
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  openTerms() {
    this.privacyContent.style.display = 'none';
    this.termsContent.style.display = 'block';
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
}

// ==========================================
// EXPANDIR OFERTAS
// ==========================================
class OfertasExpander {
  constructor() {
    this.expandBtns = document.querySelectorAll('.ofertas__expand-btn');
    this.init();
  }

  init() {
    this.expandBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.toggleExpand(btn);
      });
    });
  }

  toggleExpand(btn) {
    const targetClass = btn.getAttribute('data-target');
    const grid = document.querySelector(`.${targetClass}`);

    if (grid) {
      const isExpanded = grid.classList.contains('expanded');

      if (isExpanded) {
        grid.classList.remove('expanded');
        btn.textContent = 'Ver mais ofertas →';
      } else {
        grid.classList.add('expanded');
        btn.textContent = 'Ver menos ofertas ←';
      }
    }
  }
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  new HeaderScroll();
  new MenuMobile();
  new HeroSlider();
  new ExitIntentPopup();
  new TermsModal();
  inicializarNavegacao();
  inicializarActiveMenu();
  inicializarScrollBar();
  adicionarRippleEffect();
  inicializarContadorNumeros();
  inicializarAnimacoesSecoes();

  // Novos efeitos modernos
  new StaggerAnimation();
  new BrandTooltip();
  new SkeletonLoader();
  new WhatsAppPulse();
  new SectionDivider();
  new ReviewsCarousel();
  new DynamicSectionShadows();
  new LazyMapLoader();
  new OfertasExpander();
});
