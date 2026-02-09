console.log('Proposal App Initialized');

document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation Highlighting ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        threshold: 0.3 // Trigger when 30% of section is visible
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Update Nav Link
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.dataset.target === id) {
                        link.classList.add('active');
                    }
                });

                // Trigger Animations in this section
                entry.target.classList.add('in-view');
                animateProgressBars(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // --- Progress Bar Animation ---
    function animateProgressBars(section) {
        const progressBars = section.querySelectorAll('.fill');
        progressBars.forEach(bar => {
            // Force reflow to restart animation if needed, or just let CSS transitions handle it
            // We set width to 0 in CSS then to actual width here? 
            // Currently styles are inline, so we can animate them by momentarily setting width 0

            // Actually, better approach: The inline styles set the target width. 
            // We can set initial width to 0 via a class, then remove it.
            // But since inline styles override classes, let's do a simple hack:
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 100);
        });
    }

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navItems = document.querySelector('.nav-items');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            // For now, toggle a class to show/hide. 
            // Since we set display:none in CSS for mobile, we need a CSS class to override it or use inline styles.
            // Let's toggle a class 'show-mobile-menu' on nav-items
            if (navItems.style.display === 'flex') {
                navItems.style.display = 'none';
            } else {
                navItems.style.display = 'flex';
                navItems.style.flexDirection = 'column';
                navItems.style.position = 'absolute';
                navItems.style.top = '70px';
                navItems.style.left = '0';
                navItems.style.width = '100%';
                navItems.style.background = 'rgba(10,10,10,0.95)';
                navItems.style.padding = '20px';
                navItems.style.borderBottom = '1px solid white';
            }
        });
    }

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (window.innerWidth <= 768 && navItems.style.display === 'flex') {
                    navItems.style.display = 'none';
                }
            }
        });
    });

    // --- Order Modal Logic ---
    const modal = document.getElementById('orderModal');
    const openBtn = document.getElementById('openOrderModal');
    const closeBtn = document.querySelector('.close-modal');
    const orderForm = document.getElementById('orderForm');

    if (modal && openBtn && closeBtn) {
        // Open Modal
        openBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });

        // Close Modal
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Form Submit -> WhatsApp
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('orderName').value;
            const company = document.getElementById('orderCompany').value || '-';
            const phone = document.getElementById('orderPhone').value;
            const notes = document.getElementById('orderNotes').value || '-';

            // Get selected units
            const selectedUnits = Array.from(document.querySelectorAll('.unit-checkbox:checked'))
                .map(cb => cb.value)
                .join(', ');

            // Construct Message
            const message = `*طلب عرض سعر جديد*%0A%0A` +
                `👤 *الاسم:* ${name}%0A` +
                `🏢 *الجهة:* ${company}%0A` +
                `📱 *الجوال:* ${phone}%0A` +
                `📦 *الوحدات المطلوبة:* ${selectedUnits || 'غير محدد'}%0A` +
                `📝 *ملاحظات:* ${notes}`;

            // Redirect to WhatsApp
            const whatsappUrl = `https://wa.me/966599343529?text=${message}`;
            window.open(whatsappUrl, '_blank');

            // Close modal after brief delay
            setTimeout(() => {
                modal.style.display = 'none';
                orderForm.reset();
            }, 1000);
        });
    }

});
