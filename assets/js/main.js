
// Load header and footer
function loadHeaderFooter() {
	var headerContainer = document.getElementById('header-container');
	var footerContainer = document.getElementById('footer-container');

	if (headerContainer) {
		fetch('assets/includes/header.html')
			.then(function(response) { return response.text(); })
			.then(function(html) {
				headerContainer.innerHTML = html;
				setActiveNavLink();
				initNavToggle();
			})
			.catch(function(err) { console.error('Erreur chargement header:', err); });
	}

	if (footerContainer) {
		fetch('assets/includes/footer.html')
			.then(function(response) { return response.text(); })
			.then(function(html) {
				footerContainer.innerHTML = html;
				var yearEl = document.getElementById('year');
				if (yearEl) yearEl.textContent = new Date().getFullYear();
			})
			.catch(function(err) { console.error('Erreur chargement footer:', err); });
	}
}

function setActiveNavLink() {
	var currentPage = window.location.pathname.split('/').pop() || 'index.html';
	var navLinks = document.querySelectorAll('.nav-links a');
	navLinks.forEach(function(link) {
		var href = link.getAttribute('href');
		if (href === currentPage || (currentPage === '' && href === 'index.html')) {
			link.classList.add('active');
		} else {
			link.classList.remove('active');
		}
	});
}

function initNavToggle() {
	var toggle = document.querySelector('.nav-toggle');
	var links = document.querySelector('.nav-links');
	if (toggle && links) {
		toggle.addEventListener('click', function () {
			links.classList.toggle('open');
		});
	}
}

document.addEventListener('DOMContentLoaded', function () {
	loadHeaderFooter();

	// Smooth scroll for in-page anchors
	document.querySelectorAll('a[href^="#"]').forEach(function (a) {
		a.addEventListener('click', function (e) {
			var href = a.getAttribute('href');
			if (href.length > 1) {
				e.preventDefault();
				var el = document.querySelector(href);
				if (el) el.scrollIntoView({ behavior: 'smooth' });
			}
		});
	});

	// Segmented control logic on homepage
	var segmented = document.getElementById('rubrique-toggle');
	if (segmented) {
		var options = segmented.querySelectorAll('.option');
		var panels = {
			anglais: document.getElementById('view-anglais'),
			prepa: document.getElementById('view-prepa')
		};
		var ctaPrimary = document.getElementById('cta-primary');
		var ctaSecondary = document.getElementById('cta-secondary');
		var ctaAccent = document.getElementById('cta-accent');

		function setIndex(idx) {
			segmented.setAttribute('data-index', String(idx));
			options.forEach(function (opt, i) { opt.setAttribute('data-active', i === idx ? 'true' : 'false'); });
			if (idx === 0) {
				if (panels.anglais) panels.anglais.classList.add('active');
				if (panels.prepa) panels.prepa.classList.remove('active');
				if (ctaPrimary) { ctaPrimary.textContent = 'Réserver un premier cours'; ctaPrimary.href = 'contact.html#rdv'; }
				if (ctaSecondary) { ctaSecondary.style.display = 'inline-block'; ctaSecondary.textContent = 'Voir les cours'; ctaSecondary.href = 'cours.html'; }
				if (ctaAccent) { ctaAccent.style.display = 'none'; }
			} else {
				if (panels.prepa) panels.prepa.classList.add('active');
				if (panels.anglais) panels.anglais.classList.remove('active');
				if (ctaPrimary) { ctaPrimary.textContent = 'Planifier une simulation'; ctaPrimary.href = 'contact.html'; }
				if (ctaSecondary) { ctaSecondary.style.display = 'none'; }
				if (ctaAccent) { ctaAccent.style.display = 'inline-block'; ctaAccent.textContent = 'Voir les préparations'; ctaAccent.href = 'preparations.html'; }
			}
		}

		options.forEach(function (opt, idx) {
			opt.addEventListener('click', function () { setIndex(idx); });
		});

		setIndex(0);
	}

	// Contact form: save to Firestore + WhatsApp redirect
	var contactForm = document.getElementById('contact-form');
	if (contactForm) {
		contactForm.addEventListener('submit', async function (e) {
			e.preventDefault();
			var formData = new FormData(contactForm);
			var name = (formData.get('name') || '').toString().trim();
			var email = (formData.get('email') || '').toString().trim();
			var phone = (formData.get('phone') || '').toString().trim();
			var objectif = (formData.get('objectif') || '').toString().trim();
			var message = (formData.get('message') || '').toString().trim();

			
			// WhatsApp redirect
			var WHATSAPP_NUMBER = '33688820921';
			var text = [
				"Bonjour,",
				"\nNouvelle demande depuis le site :",
				name ? ("\nNom : " + name) : '',
				email ? ("\nEmail : " + email) : '',
				phone ? ("\nTéléphone : " + phone) : '',
				objectif ? ("\nObjectif : " + objectif) : '',
				message ? ("\nMessage : \n" + message) : ''
			].join('');

			var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
			window.open(url, '_blank');
		});
	}

	
});
