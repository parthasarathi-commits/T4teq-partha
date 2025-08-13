window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

var swiper = new Swiper('.swiper', {
    loop: true,
    speed: 1200,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    on: {
        init: function () {
            let firstSlide = document.querySelector('.swiper-slide-active');
            gsap.set(firstSlide, { scale: 1, opacity: 1 }); // set immediately to avoid flicker
            animateText(firstSlide.querySelector('.slide-content'), true); // show instantly
        },
        slideChangeTransitionStart: function () {
            let activeSlide = document.querySelector('.swiper-slide-active');
            gsap.fromTo(activeSlide,
                { scale: 1.2, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" }
            );

            // Show text automatically after slide change for 2s
            animateText(activeSlide.querySelector('.slide-content'), false);
        }
    }
});

function animateText(el, instant) {
    if (!el) return;
    gsap.killTweensOf(el);
    gsap.fromTo(el,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: instant ? 0.5 : 0.8, ease: "power2.out" }
    );
    // Hide after 2s if not hover
    gsap.to(el, { opacity: 0, y: 30, delay: 2, duration: 0.8, ease: "power2.in" });
}

// Keep text visible on hover
document.querySelectorAll('.swiper-slide').forEach(slide => {
    const text = slide.querySelector('.slide-content');
    if (!text) return;
    slide.addEventListener('mouseenter', () => {
        gsap.killTweensOf(text);
        gsap.to(text, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
    });
    slide.addEventListener('mouseleave', () => {
        gsap.to(text, { opacity: 0, y: 30, duration: 0.4, ease: "power2.in" });
    });
});

const sidenav = document.querySelector(".side-navbar");

function showSidenav() {
    sidenav.classList.add("active");
}
function closeSidenav() {
    sidenav.classList.remove("active");
}

const aboutSection = document.querySelector('.about-content');
function revealAbout() {
    const sectionTop = aboutSection.getBoundingClientRect().top;
    const triggerPoint = window.innerHeight * 0.85;
    if (sectionTop < triggerPoint) {
        aboutSection.classList.add('show');
        aboutSection.classList.remove('hidden');
    }
}
window.addEventListener('scroll', revealAbout);
window.addEventListener('load', revealAbout);

document.addEventListener("scroll", function () {
    document.querySelectorAll(".service-box").forEach((box) => {
        const boxTop = box.getBoundingClientRect().top;
        if (boxTop < window.innerHeight - 100) {
            box.classList.add("show");
        }
    });
});

const filterButtons = document.querySelectorAll('.filter-menu button');
const items = document.querySelectorAll('.gallery-item');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        items.forEach(item => {
            if (filter === 'all' || item.classList.contains(filter)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});



const testimonials = [
    {
        title: "Camera Man !",
        text: `"This is a sample testimonial. Replace this with your own amazing client feedback!"`,
        img: "c:\Users\parthasarathi N\Downloads\Screenshot_10-8-2025_155229_www.instagram.com.jpeg"
    },
    {
        title: "Editor Boy !",
        text: `"Working with this team was an absolute pleasure. They exceeded all expectations!"`,
        img: "c:\Users\parthasarathi N\Downloads\Screenshot_11-8-2025_195939_www.instagram.com.jpeg"
    },
    {
        title: "Designer Boy !",
        text: `"Every step of the process was smooth and professional. Highly recommended!"`,
        img: "c:\Users\parthasarathi N\Downloads\Screenshot_11-8-2025_20017_www.instagram.com.jpeg"
    }
];

let currentIndex = 0;
let autoplayInterval;

function showSlide(index) {
    const title = document.getElementById('testimonial-title');
    const text = document.getElementById('testimonial-text');
    const thumbs = document.querySelectorAll('.thumbnails img');

    title.style.opacity = 0;
    text.style.opacity = 0;

    setTimeout(() => {
        title.textContent = testimonials[index].title;
        text.textContent = testimonials[index].text;

        thumbs.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });

        title.style.opacity = 1;
        text.style.opacity = 1;
    }, 200);

    currentIndex = index;
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % testimonials.length;
    showSlide(currentIndex);
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
    showSlide(currentIndex);
}

function goToSlide(index) {
    showSlide(index);
}

function startAutoplay() {
    autoplayInterval = setInterval(nextSlide, 3000);
}

function stopAutoplay() {
    clearInterval(autoplayInterval);
}

document.querySelector('.testimonial-section').addEventListener('mouseenter', stopAutoplay);
document.querySelector('.testimonial-section').addEventListener('mouseleave', startAutoplay);

startAutoplay();


const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

const overlay = $('#overlay');
const pkgImg = $('#pkgImg');
const pkgName = $('#pkgName');
const pkgPrice = $('#pkgPrice');
const fName = $('#fName');
const fEmail = $('#fEmail');
const fPhone = $('#fPhone');
const fPackage = $('#fPackage');
const fDate = $('#fDate');
const toastSuccess = $('#toastSuccess');
const toastError = $('#toastError');

let activePackage = null;

/* open booking popup */
function openBooking(btn) {
    const card = btn.closest('.card');
    if (!card) return console.warn('card not found');
    const name = card.dataset.name || '';
    const price = card.dataset.price || '';
    const img = card.dataset.img || '';

    activePackage = { name, price, img };

    // fill modal
    pkgImg.style.backgroundImage = `url('${img}')`;
    pkgName.textContent = name;
    pkgPrice.textContent = price;
    fPackage.value = name;

    // reset & show
    [fName, fEmail, fPhone, fDate].forEach(i => { i.value = ''; i.classList.remove('invalid'); });
    hideToast();
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden', 'false');

    // focus first field
    setTimeout(() => fName.focus(), 160);
}

/* close */
function closeBooking() {
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden', 'true');
}

/* details */
function viewDetails(btn) {
    const card = btn.closest('.card');
    const name = card.dataset.name;
    const price = card.dataset.price;
    alert(`${name} — ${price}\n\n${card.querySelector('.desc').innerText}`);
}

/* toast helpers */
function hideToast() { [toastSuccess, toastError].forEach(t => { t.classList.remove('show'); t.style.display = 'block'; }); }
function showToast(el, msg) {
    el.textContent = msg;
    el.style.display = 'block';
    setTimeout(() => el.classList.add('show'), 10);
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.style.display = 'block', 220); }, 2600);
}

/* validation helpers */
function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function validatePhone(phone) { return /^\d{10}$/.test(phone.replace(/\D/g, '')); }
function isDateValid(dateStr) {
    if (!dateStr) return false;
    const picked = new Date(dateStr);
    const today = new Date();
    picked.setHours(0, 0, 0, 0); today.setHours(0, 0, 0, 0);
    return picked >= today;
}

/* submit */
function submitBooking() {
    // clear previous
    [fName, fEmail, fPhone, fDate, fPackage].forEach(i => i.classList.remove('invalid'));

    const name = fName.value.trim();
    const email = fEmail.value.trim();
    const phone = fPhone.value.trim();
    const pkg = fPackage.value.trim();
    const date = fDate.value;

    let ok = true;
    if (!name) { ok = false; fName.classList.add('invalid'); }
    if (!validateEmail(email)) { ok = false; fEmail.classList.add('invalid'); }
    if (!validatePhone(phone)) { ok = false; fPhone.classList.add('invalid'); }
    if (!pkg) { ok = false; fPackage.classList.add('invalid'); }
    if (!isDateValid(date)) { ok = false; fDate.classList.add('invalid'); }

    if (!ok) {
        showToast(toastError, 'Fill all fields correctly');
        return;
    }

    // build booking object (demo)
    const booking = {
        name, email, phone, package: pkg, date,
        packagePrice: activePackage ? activePackage.price : '',
        packageImg: activePackage ? activePackage.img : ''
    };
    console.log('NEW BOOKING (demo):', booking);

    // success behavior
    showToast(toastSuccess, 'Booking confirmed! 🎉');

    // auto-close modal after short delay
    setTimeout(() => closeBooking(), 900);

    // clear inputs (nice to have)
    [fName, fEmail, fPhone, fDate].forEach(i => i.value = '');
}

/* close on overlay click outside modal */
overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeBooking();
});

/* close with Escape */
window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeBooking(); });

/* enhance UX: remove invalid class on input */
$$('.fields input, .fields select').forEach(el => {
    el.addEventListener('input', () => el.classList.remove('invalid'));
});

/* small accessibility: trap focus inside modal when open (simple) */
document.addEventListener('focus', function (ev) {
    if (!overlay.classList.contains('show')) return;
    if (!overlay.contains(ev.target)) {
        ev.stopPropagation();
        fName.focus();
    }
}, true);