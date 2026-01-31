(function () {
	// Full translations dictionary (keys mapped to target language strings)
	const translations = {
		en: {
			"nav.home":"Home","nav.about":"About","nav.about.intro":"Introduction","nav.about.objectives":"Objectives & Functions",
			"nav.about.officers":"Officers & Staff","nav.citizen":"Citizen","nav.citizen.complaint":"Report Complaint",
			"nav.services":"Services","nav.services.tanks":"Water Tanks","nav.services.tanks.schedule":"Cleaning Schedules",
			"nav.services.pipeline":"Pipeline System","nav.services.maintenance":"Maintenance","nav.schedule":"Schedule",
			"nav.contact":"Contact","nav.authority":"Authority","nav.publish":"Publish Notice","nav.dashboard":"Dashboard",
			"auth.login":"Login","auth.logout":"Logout","role.authority":"Authority","role.citizen":"Citizen",
			"login.signin":"Sign In","login.subtitle":"Enter your credentials to continue","login.role":"Role *",
			"login.role.select":"Select your role","login.method":"Method *","login.method.select":"Select method",
			"login.method.email":"Email","login.method.code":"Code","login.identifier":"Email / Code *","login.submit":"Sign In",
			"footer.quick":"Quick Links","footer.about":"About","footer.services":"Services","footer.support":"Support",
			"footer.copy":"© 2026 Water Supply Department, Pune Municipal Corporation. All Rights Reserved."
		},
		mr: {
			"nav.home":"मुख्यपृष्ठ","nav.about":"विषयी","nav.about.intro":"परिचय","nav.about.objectives":"उद्दिष्टे व कार्य",
			"nav.about.officers":"अधिकारी व कर्मचारी","nav.citizen":"नागरिक","nav.citizen.complaint":"तक्रार नोंदवा",
			"nav.services":"सेवा","nav.services.tanks":"पाण्याचे टाकी","nav.services.tanks.schedule":"स्वच्छता वेळापत्रक",
			"nav.services.pipeline":"पाइपलाइन प्रणाली","nav.services.maintenance":"देखभाल","nav.schedule":"वेळापत्रक",
			"nav.contact":"संपर्क","nav.authority":"अधिकारी","nav.publish":"सूचना प्रसिद्ध करा","nav.dashboard":"डॅशबोर्ड",
			"auth.login":"प्रवेश","auth.logout":"बाहेर पडा","role.authority":"अधिकारी","role.citizen":"नागरिक",
			"login.signin":"साइन इन","login.subtitle":"सुरू करण्यासाठी तुमची माहिती भरा","login.role":"भूमिका *",
			"login.role.select":"तुमची भूमिका निवडा","login.method":"पद्धत *","login.method.select":"पद्धत निवडा",
			"login.method.email":"ईमेल","login.method.code":"कोड","login.identifier":"ईमेल / कोड *","login.submit":"साइन इन",
			"footer.quick":"त्वरित दुवे","footer.about":"विषयी","footer.services":"सेवा","footer.support":"समर्थन",
			"footer.copy":"© 2026 जलपुरवठा विभाग, पुणे महानगरपालिका. सर्व हक्क राखीव."
		},
		hi: {
			"nav.home":"मुख्य पृष्ठ","nav.about":"के बारे में","nav.about.intro":"परिचय","nav.about.objectives":"उद्देश्य और कार्य",
			"nav.about.officers":"अधिकारी और कर्मचारी","nav.citizen":"नागरिक","nav.citizen.complaint":"शिकायत दर्ज करें",
			"nav.services":"सेवाएँ","nav.services.tanks":"पानी की टंकी","nav.services.tanks.schedule":"सफाई अनुसूची",
			"nav.services.pipeline":"पाइपलाइन सिस्टम","nav.services.maintenance":"रखरखाव","nav.schedule":"शेड्यूल",
			"nav.contact":"संपर्क","nav.authority":"अधिकारी","nav.publish":"नोटिस प्रकाशित करें","nav.dashboard":"डैशबोर्ड",
			"auth.login":"लॉगिन","auth.logout":"लॉग आउट","role.authority":"अधिकारी","role.citizen":"नागरिक",
			"login.signin":"साइन इन","login.subtitle":"जारी रखने के लिए अपनी प्रमाण जानकारी दर्ज करें","login.role":"भूमिका *",
			"login.role.select":"अपनी भूमिका चुनें","login.method":"विधि *","login.method.select":"विधि चुनें",
			"login.method.email":"ईमेल","login.method.code":"कोड","login.identifier":"ईमेल / कोड *","login.submit":"साइन इन",
			"footer.quick":"त्वरित लिंक","footer.about":"के बारे में","footer.services":"सेवाएँ","footer.support":"समर्थन",
			"footer.copy":"© 2026 जल आपूर्ति विभाग, पुणे महानगरपालिका। सर्व अधिकार सुरक्षित।"
		}
	};

	// Digit maps: convert western digits to Devanagari (for mr/hi)
	const digitMaps = {
		mr: { '0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९' },
		hi: { '0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९' }
	};

	// Build English lookup map: enText -> key, used to replace arbitrary text nodes
	const enTextMap = {};
	Object.keys(translations.en).forEach(k => {
		const txt = translations.en[k];
		if (typeof txt === 'string' && txt.trim().length) {
			enTextMap[txt.trim()] = k;
		}
	});
	// Sort english phrases by length desc to replace longer phrases first
	const enPhrasesSorted = Object.keys(enTextMap).sort((a,b)=>b.length-a.length);

	// Utility: convert digits in a string for target language
	function convertDigits(str, lang) {
		if (!digitMaps[lang]) return str;
		return str.replace(/\d/g, d => digitMaps[lang][d] || d);
	}

	// Apply data-i18n translations directly
	function applyDataI18n(lang) {
		const dict = translations[lang] || translations.en;
		document.querySelectorAll('[data-i18n]').forEach(el => {
			const key = el.getAttribute('data-i18n');
			if (!key) return;
			const val = dict[key];
			if (val === undefined) return;
			// Attributes handling
			if (el.tagName === 'INPUT' && el.placeholder) {
				el.placeholder = convertDigits(String(val), lang);
			} else if (el.tagName === 'OPTION') {
				el.textContent = convertDigits(String(val), lang);
			} else {
				el.textContent = convertDigits(String(val), lang);
			}
		});
	}

	// Translate poplular attributes: placeholder, value for buttons/inputs, option texts
	function translateAttributes(lang) {
		const dict = translations[lang] || translations.en;
		// placeholders
		document.querySelectorAll('input[placeholder]').forEach(inp => {
			const ph = inp.getAttribute('placeholder') || '';
			// if placeholder exactly matches an en translation, replace
			const key = enTextMap[ph.trim()];
			if (key && translations[lang][key]) inp.placeholder = convertDigits(translations[lang][key], lang);
		});
		// buttons values/text
		document.querySelectorAll('button').forEach(btn => {
			const txt = btn.textContent.trim();
			const key = enTextMap[txt];
			if (key && translations[lang][key]) btn.textContent = convertDigits(translations[lang][key], lang);
		});
		// options without data-i18n
		document.querySelectorAll('select option').forEach(opt => {
			const txt = opt.textContent.trim();
			const key = enTextMap[txt];
			if (key && translations[lang][key]) opt.textContent = convertDigits(translations[lang][key], lang);
		});
	}

	// Translate plain text nodes (fallback): replace English phrases found in page with translations
	function translateTextNodes(lang) {
		const dict = translations[lang] || translations.en;
		const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
			acceptNode: function(node) {
				// ignore empty/whitespace nodes
				if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
				// skip nodes inside script/style/noscript
				let p = node.parentElement;
				while (p) {
					const tag = p.tagName && p.tagName.toLowerCase();
					if (['script','style','noscript','textarea','code','pre'].includes(tag)) return NodeFilter.FILTER_REJECT;
					// skip elements with explicit data-i18n to avoid double handling
					if (p.hasAttribute && p.hasAttribute('data-i18n')) return NodeFilter.FILTER_REJECT;
					p = p.parentElement;
				}
				return NodeFilter.FILTER_ACCEPT;
			}
		}, false);

		const nodes = [];
		while(walker.nextNode()) nodes.push(walker.currentNode);

		// For each text node, perform phrase replacements
		nodes.forEach(textNode => {
			let s = textNode.nodeValue;
			let changed = false;
			// For performance, operate on lower-case copy for matching but preserve original case where possible
			// Replace known English phrases from longest to shortest
			enPhrasesSorted.forEach(enPhrase => {
				// match case-insensitive occurrences
				const re = new RegExp('\\b' + escapeRegExp(enPhrase) + '\\b','gi');
				if (re.test(s)) {
					const key = enTextMap[enPhrase];
					const replacement = (translations[lang] && translations[lang][key]) ? translations[lang][key] : translations.en[key] || enPhrase;
					s = s.replace(re, replacement);
					changed = true;
				}
			});
			// convert digits if necessary
			const sConverted = convertDigits(s, lang);
			if (changed || sConverted !== s) {
				textNode.nodeValue = sConverted;
			}
		});
	}

	// Helper to escape regex special chars
	function escapeRegExp(string) {
		return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
	}

	// Main apply translations routine
	function applyTranslations(lang) {
		if (!translations[lang]) lang = 'en';
		// 1) data-i18n (explicit)
		applyDataI18n(lang);
		// 2) attributes (placeholders, option texts, buttons)
		translateAttributes(lang);
		// 3) fallback: scan text nodes and replace known English phrases
		translateTextNodes(lang);
	}

	// Small visual flash for selector
	function flashElement(el) {
		if (!el) return;
		el.classList.remove('lang-flash');
		void el.offsetWidth;
		el.classList.add('lang-flash');
		setTimeout(()=>el.classList.remove('lang-flash'), 1000);
	}

	// Set language and sync selectors
	function setLanguage(lang, sourceEl) {
		if (!translations[lang]) lang = 'en';
		localStorage.setItem('site_lang', lang);
		applyTranslations(lang);
		// sync selectors
		document.querySelectorAll('.lang-select-compact, .lang-select-large, #langSelect, #langSelectForm').forEach(s => {
			if (s) s.value = lang;
		});
		flashElement(sourceEl || document.querySelector('.lang-select-compact') || document.querySelector('.lang-select-large'));
	}

	// Initialize i18n: bind selectors and apply saved language
	function initI18n() {
		const saved = localStorage.getItem('site_lang') || 'en';
		// If DOM not ready, wait
		applyTranslations(saved);

		// Bind selectors (supports both navbar and login selectors)
		document.querySelectorAll('.lang-select-compact, .lang-select-large, #langSelect, #langSelectForm').forEach(s => {
			if (!s) return;
			s.value = saved;
			s.addEventListener('change', function(e){
				setLanguage(e.target.value, e.target);
			});
			// clicking also reapply
			s.addEventListener('click', () => flashElement(s));
		});
	}

	// Run on DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initI18n);
	} else {
		initI18n();
	}

	// Expose for debug
	window._i18n = { setLanguage, applyTranslations, translations };
})();
