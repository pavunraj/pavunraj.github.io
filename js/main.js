/**
 * SideApps Model Portfolio - Core JavaScript
 * Handles Vertical Screenshot Slicing, Interactive Phone Mockups,
 * 3D Parallax Tilt, Interactive AI Assistant, and Lightbox inspection.
 */

document.addEventListener('DOMContentLoaded', () => {
  initVerticalSlices();
  initDevice3DTilt();
  initChatAssistant();
  initLightbox();
  initResumeModal();
  initEmailCopy();
  initSmoothScroll();
});

/* ==========================================================================
   1. Vertical Slices Architecture for App Screenshots
   ========================================================================== */
function initVerticalSlices() {
  const wrappers = document.querySelectorAll('.visual-slice-wrapper');

  wrappers.forEach((wrapper) => {
    const track = wrapper.querySelector('.slice-track');
    const slices = wrapper.querySelectorAll('.vertical-slice-item');
    const dots = wrapper.querySelectorAll('.slice-nav-dot');
    const thumbs = wrapper.querySelectorAll('.slice-thumb');
    const upBtn = wrapper.querySelector('.slice-btn-up');
    const downBtn = wrapper.querySelector('.slice-btn-down');
    const phoneScreen = wrapper.querySelector('.iphone-screen');

    if (!track || slices.length === 0) return;

    let currentIndex = 0;
    const totalSlices = slices.length;

    function goToSlice(index) {
      if (index < 0) index = totalSlices - 1;
      if (index >= totalSlices) index = 0;

      currentIndex = index;
      const translateY = -currentIndex * 100;
      track.style.transform = `translateY(${translateY}%)`;

      // Update dots
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });

      // Update thumbnails
      thumbs.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === currentIndex);
      });
    }

    // Next / Prev button triggers
    if (upBtn) {
      upBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlice(currentIndex - 1);
      });
    }

    if (downBtn) {
      downBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlice(currentIndex + 1);
      });
    }

    // Dot indicators
    dots.forEach((dot, i) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlice(i);
      });
    });

    // Thumbnail strip clicks
    thumbs.forEach((thumb, i) => {
      thumb.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlice(i);
      });
    });

    // Click inside phone to advance to next vertical slice
    if (phoneScreen) {
      phoneScreen.addEventListener('click', (e) => {
        // If clicking a nav dot, let dot handler process
        if (e.target.closest('.slice-nav-overlay')) return;
        goToSlice(currentIndex + 1);
      });

      // Vertical wheel scrolling inside phone
      phoneScreen.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > 20) {
          e.preventDefault();
          if (e.deltaY > 0) {
            goToSlice(currentIndex + 1);
          } else {
            goToSlice(currentIndex - 1);
          }
        }
      }, { passive: false });

      // Touch / Swipe gestures on mobile
      let touchStartY = 0;
      phoneScreen.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
      }, { passive: true });

      phoneScreen.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diffY = touchStartY - touchEndY;
        if (Math.abs(diffY) > 40) {
          if (diffY > 0) {
            goToSlice(currentIndex + 1); // Swiped up
          } else {
            goToSlice(currentIndex - 1); // Swiped down
          }
        }
      }, { passive: true });
    }
  });
}

/* ==========================================================================
   2. 3D Parallax Tilt Effect on iPhone Mockup
   ========================================================================== */
function initDevice3DTilt() {
  // Only apply on non-touch desktop screens
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const frames = document.querySelectorAll('.iphone-frame');

    frames.forEach(frame => {
      frame.addEventListener('mousemove', (e) => {
        const rect = frame.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -12; // tilt angle
        const rotateY = ((x - centerX) / centerX) * 12;

        frame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      frame.addEventListener('mouseleave', () => {
        frame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }
}

/* ==========================================================================
   3. Interactive iOS Developer Assistant ("Chat with Kevin / Assistant")
   ========================================================================== */
function initChatAssistant() {
  const chatWindow = document.getElementById('chat-window');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chips = document.querySelectorAll('.prompt-chip');

  if (!chatWindow || !chatInput || !chatSendBtn) return;

  const responses = {
    washloft: "WashLoft is an 'Uber for laundry' on-demand service. I built the mobile app solo using Swift, Firebase, and Stripe, handling pickup booking, wash preferences, and driver routing. It serves hundreds of orders every month across Greater Boston.",
    capitalone: "At Capital One, I was Technical Lead for the Small Business Banking mobile team. I increased parity with web/consumer apps by over 70% in year one, served 10,000+ daily active users, and scaled unit test coverage beyond 90%.",
    chewy: "For Chewy PracticeHub, I served as Lead Mobile Engineer. I designed the core mobile architecture and established the team that delivered the self-service veterinary medication approval system in under 10 months, slashing customer service overhead by 99%.",
    stack: "My core expertise includes Swift, SwiftUI, UIKit, Combine, async/await concurrency, CoreData/Realm, Modular SPM Architecture, CI/CD with Fastlane, REST & GraphQL APIs, Stripe payments, and WebSockets.",
    architecture: "I champion clean, modular architectures using MVVM-C (Model-View-ViewModel-Coordinator), unidirectional data flow, protocol-oriented programming, and isolated Swift Packages (SPM) for scalable maintenance.",
    contact: "You can reach out directly via email at contact@sideapps.dev or pavunrajtech@gmail.com, or connect with me on LinkedIn and GitHub!",
    resume: "You can view my complete, 2-page Mobile Application Developer CV right here!<br><button class='chat-inline-btn' onclick='window.openResumeModal &amp;&amp; window.openResumeModal()'>📄 View Pavunraj's CV</button>",
    default: "Thank you for asking! I'm a veteran iOS Engineer specializing in enterprise-scale Swift applications, intuitive UI/UX, and robust mobile architecture. Feel free to explore my featured apps above, view my resume, or select one of the quick questions!"
  };

  function addMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'chat-avatar';
    avatarDiv.textContent = sender === 'bot' ? 'AI' : 'You';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'chat-bubble';
    if (sender === 'bot') {
      bubbleDiv.innerHTML = text;
    } else {
      bubbleDiv.textContent = text;
    }

    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(bubbleDiv);

    chatWindow.appendChild(msgDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  function handleUserQuery(query) {
    if (!query || query.trim() === '') return;
    const cleanQuery = query.trim();

    addMessage('user', cleanQuery);
    chatInput.value = '';

    // Show typing state
    setTimeout(() => {
      const lower = cleanQuery.toLowerCase();
      let reply = responses.default;

      if (lower.includes('washloft') || lower.includes('laundry')) {
        reply = responses.washloft;
      } else if (lower.includes('capital one') || lower.includes('banking') || lower.includes('capone')) {
        reply = responses.capitalone;
      } else if (lower.includes('chewy') || lower.includes('practicehub') || lower.includes('pet')) {
        reply = responses.chewy;
      } else if (lower.includes('resume') || lower.includes('cv') || lower.includes('experience') || lower.includes('background') || lower.includes('profile')) {
        reply = responses.resume;
      } else if (lower.includes('stack') || lower.includes('technolog') || lower.includes('swift') || lower.includes('tools')) {
        reply = responses.stack;
      } else if (lower.includes('architecture') || lower.includes('mvvm') || lower.includes('pattern')) {
        reply = responses.architecture;
      } else if (lower.includes('contact') || lower.includes('hire') || lower.includes('email') || lower.includes('reach')) {
        reply = responses.contact;
      }

      addMessage('bot', reply);
    }, 450);
  }

  chatSendBtn.addEventListener('click', () => {
    handleUserQuery(chatInput.value);
  });

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUserQuery(chatInput.value);
    }
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.getAttribute('data-query') || chip.textContent.trim();
      handleUserQuery(text);
    });
  });
}

/* ==========================================================================
   4. Lightbox Full-Screen Screenshot Inspection
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const closeBtn = document.getElementById('lightbox-close');

  if (!modal || !modalImg) return;

  // Clicking on any slice item in phone mockup can open zoom
  document.querySelectorAll('.vertical-slice-item img').forEach(img => {
    img.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      openLightbox(img.src);
    });
  });

  document.querySelectorAll('.zoom-trigger-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentSlice = btn.closest('.visual-slice-wrapper');
      const activeImg = parentSlice ? parentSlice.querySelector('.vertical-slice-item img') : null;
      if (activeImg) {
        openLightbox(activeImg.src);
      }
    });
  });

  function openLightbox(src) {
    modalImg.src = src;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   5. Email Copy to Clipboard & Toast
   ========================================================================== */
function initEmailCopy() {
  const copyPills = document.querySelectorAll('.copy-email-btn');
  const toast = document.getElementById('toast-notice');

  copyPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const email = pill.getAttribute('data-email') || 'contact@sideapps.dev';
      navigator.clipboard.writeText(email).then(() => {
        showToast(`Copied ${email} to clipboard!`);
      }).catch(() => {
        showToast(`Email: ${email}`);
      });
    });
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
}

/* ==========================================================================
   6. Smooth Anchor Scrolling & Ambient Cursor Glow
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#resume') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* ==========================================================================
   7. Dynamic Screen-Fitting Resume / CV Modal
   ========================================================================== */
function initResumeModal() {
  const modal = document.getElementById('resume-modal');
  const backdrop = document.getElementById('resume-backdrop');
  const closeBtn = document.getElementById('resume-close-btn');
  const viewport = document.getElementById('resume-viewport');
  const canvasContainer = document.getElementById('resume-canvas-container');
  const loader = document.getElementById('resume-loader');
  const iframeFallback = document.getElementById('resume-iframe-fallback');
  const pageIndicator = document.getElementById('resume-page-indicator');
  const zoomLevel = document.getElementById('resume-zoom-level');
  const fitWidthBtn = document.getElementById('resume-fit-width');
  const fitPageBtn = document.getElementById('resume-fit-page');
  const zoomInBtn = document.getElementById('resume-zoom-in');
  const zoomOutBtn = document.getElementById('resume-zoom-out');

  if (!modal || !viewport || !canvasContainer) return;

  const pdfUrl = 'assets/Pavunraj_Palanisamy_Resume.pdf';
  let pdfDoc = null;
  let totalPages = 0;
  let unscaledPageWidth = 612;
  let unscaledPageHeight = 792;
  let fitMode = 'fit-width'; // 'fit-width' | 'fit-page' | 'manual'
  let currentScale = 1.0;
  let isPdfLoaded = false;
  let isRendering = false;
  let renderQueue = false;

  // Configure PDF.js worker
  if (window.pdfjsLib) {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'js/vendor/pdf.worker.min.js';
  }

  function openResume() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modal.focus();

    if (!isPdfLoaded) {
      loadPdfDocument();
    } else {
      recalculateFitAndRender();
    }
  }

  function closeResume() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Expose globally for inline buttons or triggers
  window.openResumeModal = openResume;
  window.closeResumeModal = closeResume;

  // Bind all triggers (buttons, anchors)
  document.querySelectorAll('#btn-resume, .open-resume-trigger, a[href="#resume"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openResume();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeResume);
  if (backdrop) backdrop.addEventListener('click', closeResume);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeResume();
    }
  });

  // Calculate dynamic scale based on container dimensions
  function calculateScale() {
    if (!viewport) return 1.0;

    // Viewport inner dimensions subtracting margins/padding
    const paddingX = window.innerWidth <= 768 ? 16 : 48;
    const paddingY = window.innerWidth <= 768 ? 24 : 56;

    const availableWidth = Math.max(260, viewport.clientWidth - paddingX);
    const availableHeight = Math.max(300, viewport.clientHeight - paddingY);

    if (fitMode === 'fit-width') {
      const scale = availableWidth / unscaledPageWidth;
      return Math.min(Math.max(scale, 0.4), 2.2);
    } else if (fitMode === 'fit-page') {
      const scale = Math.min(
        availableWidth / unscaledPageWidth,
        availableHeight / unscaledPageHeight
      );
      return Math.min(Math.max(scale, 0.35), 2.0);
    }
    return currentScale;
  }

  function updateZoomLabel() {
    if (zoomLevel) {
      zoomLevel.textContent = Math.round(currentScale * 100) + '%';
    }
  }

  function updateModeButtons() {
    if (fitWidthBtn) fitWidthBtn.classList.toggle('active', fitMode === 'fit-width');
    if (fitPageBtn) fitPageBtn.classList.toggle('active', fitMode === 'fit-page');
  }

  // Load PDF with PDF.js, with fallback to embedded iframe
  async function loadPdfDocument() {
    if (!window.pdfjsLib) {
      useFallbackViewer();
      return;
    }

    try {
      if (loader) loader.classList.remove('hidden');
      const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
      pdfDoc = await loadingTask.promise;
      totalPages = pdfDoc.numPages;
      isPdfLoaded = true;

      // Read dimensions from page 1 to set natural aspect ratio
      const firstPage = await pdfDoc.getPage(1);
      const initialViewport = firstPage.getViewport({ scale: 1.0 });
      unscaledPageWidth = initialViewport.width;
      unscaledPageHeight = initialViewport.height;

      recalculateFitAndRender();
    } catch (err) {
      console.warn('PDF.js failed to load PDF, falling back to embedded viewer:', err);
      useFallbackViewer();
    }
  }

  function useFallbackViewer() {
    if (loader) loader.classList.add('hidden');
    if (canvasContainer) canvasContainer.style.display = 'none';
    if (iframeFallback) {
      iframeFallback.style.display = 'block';
    }
    if (pageIndicator) pageIndicator.textContent = 'Pavunraj CV';
  }

  function recalculateFitAndRender() {
    if (!pdfDoc) return;
    if (fitMode !== 'manual') {
      currentScale = calculateScale();
    }
    updateZoomLabel();
    updateModeButtons();
    renderAllPages();
  }

  // Render all pages onto canvases
  async function renderAllPages() {
    if (!pdfDoc) return;
    if (isRendering) {
      renderQueue = true;
      return;
    }
    isRendering = true;

    try {
      canvasContainer.innerHTML = '';
      const dpr = window.devicePixelRatio || 1;

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const pageViewport = page.getViewport({ scale: currentScale });

        const pageWrapper = document.createElement('div');
        pageWrapper.className = 'resume-page-wrapper';
        pageWrapper.setAttribute('data-page-number', pageNum);

        const canvas = document.createElement('canvas');
        canvas.className = 'resume-page-canvas';
        const ctx = canvas.getContext('2d', { alpha: false });

        // Physical pixels (for crisp rendering on Retina / HiDPI screens)
        canvas.width = Math.floor(pageViewport.width * dpr);
        canvas.height = Math.floor(pageViewport.height * dpr);

        // CSS display pixels (fit the layout)
        canvas.style.width = Math.floor(pageViewport.width) + 'px';
        canvas.style.height = Math.floor(pageViewport.height) + 'px';

        const transform = dpr !== 1 ? [dpr, 0, 0, dpr, 0, 0] : null;

        pageWrapper.appendChild(canvas);
        canvasContainer.appendChild(pageWrapper);

        const renderContext = {
          canvasContext: ctx,
          transform: transform,
          viewport: pageViewport
        };

        await page.render(renderContext).promise;
      }

      setupIntersectionObserver();
      if (loader) loader.classList.add('hidden');
    } catch (e) {
      console.error('Error rendering PDF pages:', e);
    } finally {
      isRendering = false;
      if (renderQueue) {
        renderQueue = false;
        renderAllPages();
      }
    }
  }

  // Detect which page is currently in view and update page counter
  let pageObserver = null;
  function setupIntersectionObserver() {
    if (pageObserver) pageObserver.disconnect();

    const pageWrappers = canvasContainer.querySelectorAll('.resume-page-wrapper');
    if (!pageWrappers.length) return;

    pageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const num = entry.target.getAttribute('data-page-number');
          if (pageIndicator && num) {
            pageIndicator.textContent = `Page ${num} / ${totalPages}`;
          }
        }
      });
    }, {
      root: viewport,
      threshold: 0.5
    });

    pageWrappers.forEach(pw => pageObserver.observe(pw));
  }

  // Toolbar button handlers
  if (fitWidthBtn) {
    fitWidthBtn.addEventListener('click', () => {
      fitMode = 'fit-width';
      recalculateFitAndRender();
    });
  }

  if (fitPageBtn) {
    fitPageBtn.addEventListener('click', () => {
      fitMode = 'fit-page';
      recalculateFitAndRender();
    });
  }

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
      fitMode = 'manual';
      currentScale = Math.min(2.5, currentScale + 0.15);
      updateZoomLabel();
      updateModeButtons();
      renderAllPages();
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
      fitMode = 'manual';
      currentScale = Math.max(0.35, currentScale - 0.15);
      updateZoomLabel();
      updateModeButtons();
      renderAllPages();
    });
  }

  // Dynamic window resizing with debounce
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    if (!modal.classList.contains('active')) return;
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (fitMode === 'fit-width' || fitMode === 'fit-page') {
        recalculateFitAndRender();
      }
    }, 120);
  });
}
