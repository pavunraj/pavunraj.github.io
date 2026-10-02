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
    contact: "You can reach out directly via email at contact@sideapps.dev or pavunraj.ios@gmail.com, or connect with me on LinkedIn and GitHub!",
    default: "Thank you for asking! I'm a veteran iOS Engineer specializing in enterprise-scale Swift applications, intuitive UI/UX, and robust mobile architecture. Feel free to explore my featured apps above or select one of the quick questions!"
  };

  function addMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg ${sender}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'chat-avatar';
    avatarDiv.textContent = sender === 'bot' ? 'AI' : 'You';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'chat-bubble';
    bubbleDiv.textContent = text;

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
      if (targetId === '#') return;
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
