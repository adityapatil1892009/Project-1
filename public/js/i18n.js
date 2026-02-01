(function () {
	// Minimal translation dictionary (flat keys). Add keys as needed.
	const translations = {
		en: {
			"app.title":"Water Supply Management",
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
			"footer.copy":"© 2026 Water Supply Department, Pune Municipal Corporation. All Rights Reserved.",
			"water_supply_schedules":"Water Supply Schedules","schedule_description":"View the daily water supply schedule for your area",
			"monday":"Monday","tuesday":"Tuesday","wednesday":"Wednesday","thursday":"Thursday","friday":"Friday","saturday":"Saturday","sunday":"Sunday",
			"time":"Time","duration":"Duration","no_schedule":"No schedule information available",
			"status_completed":"Active","status_live":"Live Now","status_upcoming":"Upcoming","status_interrupted":"Interrupted",
			"admin.panel":"Admin Panel","dashboard.title":"Dashboard","users.title":"User Management","schedule.title":"Schedule Editor","settings.title":"Settings",
			"settings.translation":"Translation Settings","settings.enable_languages":"Enable Languages","lang.en":"English","lang.hi":"Hindi","lang.mr":"Marathi",
			"save.settings":"Save Settings","cancel":"Cancel","publish.notice":"Publish Notice","notice.title":"Notice Title *","notice.date":"Date (optional)","notice.content":"Notice Content *",
			"btn.publish":"✓ Publish Notice","btn.save":"💾 Save Changes","btn.reset":"Reset","btn.adduser":"➕ Add New User","btn.logout":"🚪 Logout"
		},
		hi: {
			"app.title":"जल आपूर्ति प्रबंधन",
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
			"footer.copy":"© 2026 जल आपूर्ति विभाग, पुणे महानगरपालिका। सर्व अधिकार सुरक्षित।",
			"water_supply_schedules":"जल आपूर्ति शेड्यूल","schedule_description":"अपने क्षेत्र के लिए दैनिक जल आपूर्ति शेड्यूल देखें",
			"monday":"सोमवार","tuesday":"मंगलवार","wednesday":"बुधवार","thursday":"गुरुवार","friday":"शुक्रवार","saturday":"शनिवार","sunday":"रविवार",
			"time":"समय","duration":"अवधि","no_schedule":"कोई शेड्यूल जानकारी उपलब्ध नहीं",
			"status_completed":"सक्रिय","status_live":"अभी लाइव","status_upcoming":"आने वाला","status_interrupted":"बाधित",
			"admin.panel":"एडमिन पैनल","dashboard.title":"डैशबोर्ड","users.title":"उपयोगकर्ता प्रबंधन","schedule.title":"शेड्यूल संपादक","settings.title":"सेटिंग्स",
			"settings.translation":"अनुवाद सेटिंग्स","settings.enable_languages":"भाषाएँ सक्षम करें","lang.en":"English","lang.hi":"हिन्दी","lang.mr":"मराठी",
			"save.settings":"सेटिंग्स सहेजें","cancel":"रद्द करें","publish.notice":"नोटिस प्रकाशित करें","notice.title":"नोटिस शीर्षक *","notice.date":"तारीख (ऐच्छिक)","notice.content":"नोटिस सामग्री *",
			"btn.publish":"✓ नोटिस प्रकाशित करें","btn.save":"💾 परिवर्तन सहेजें","btn.reset":"रीसेट","btn.adduser":"➕ नया उपयोगकर्ता जोड़ें","btn.logout":"🚪 लॉग आउट"
		},
		mr: {
			"app.title":"जलपुरवठा व्यवस्थापन प्रणाली",
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
			"footer.copy":"© 2026 जलपुरवठा विभाग, पुणे महानगरपालिका. सर्व हक्क राखीव.",
			"water_supply_schedules":"जल पुरवठा वेळापत्रक","schedule_description":"आपल्या क्षेत्रासाठी दैनिक जल पुरवठा वेळापत्रक पहा",
			"monday":"सोमवार","tuesday":"मंगळवार","wednesday":"बुधवार","thursday":"गुरुवार","friday":"शुक्रवार","saturday":"शनिवार","sunday":"रविवार",
			"time":"वेळ","duration":"कालावधी","no_schedule":"कोणतीही वेळापत्रक माहिती उपलब्ध नाही",
			"status_completed":"सक्रिय","status_live":"अभिनव","status_upcoming":"आसन्न","status_interrupted":"व्यस्त",
			"admin.panel":"अ‍ॅडमिन पॅनेल","dashboard.title":"डॅशबोर्ड","users.title":"वापरकर्ता व्यवस्थापन","schedule.title":"वेळापत्रक संपादक","settings.title":"सेटिंग्स",
			"settings.translation":"अनुवाद सेटिंग्ज","settings.enable_languages":"भाषा सक्षम करा","lang.en":"English","lang.hi":"हिन्दी","lang.mr":"मराठी",
			"save.settings":"सेटिंग्ज जतन करा","cancel":"रद्द करा","publish.notice":"सूचना प्रसिद्ध करा","notice.title":"सूचना शीर्षक *","notice.date":"तारीख (ऐच्छिक)","notice.content":"सूचना सामग्री *",
			"btn.publish":"✓ सूचना प्रसिद्ध करा","btn.save":"💾 बदल जतन करा","btn.reset":"रीसेट","btn.adduser":"➕ नवीन वापरकर्ता जोडा","btn.logout":"🚪 लॉग आउट"
		}
	};

	// Digit maps for hi/mr
	const digitMaps = {
		hi: { '0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९' },
		mr: { '0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९' }
	};

	// Build en->key map for fallback replacement
	const enTextMap = {};
	Object.keys(translations.en).forEach(k => {
		const txt = translations.en[k];
		if (typeof txt === 'string' && txt.trim().length) enTextMap[txt.trim()] = k;
	});
	const enPhrasesSorted = Object.keys(enTextMap).sort((a,b)=>b.length-a.length);

	function escapeRegExp(string) { return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); }
	function convertDigits(str, lang) {
		if (!digitMaps[lang]) return str;
		return String(str).replace(/\d/g, d => digitMaps[lang][d] || d);
	}

	function applyDataI18n(lang) {
		const dict = translations[lang] || translations.en;
		document.querySelectorAll('[data-i18n]').forEach(el => {
			const key = el.getAttribute('data-i18n');
			if (!key) return;
			const val = dict[key];
			if (val === undefined) return;
			if ((el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && el.placeholder) {
				el.placeholder = convertDigits(String(val), lang);
			} else {
				el.textContent = convertDigits(String(val), lang);
			}
		});
	}

	function translateAttributes(lang) {
		const dict = translations[lang] || translations.en;
		document.querySelectorAll('input[placeholder]').forEach(inp => {
			const ph = inp.getAttribute('placeholder') || '';
			const key = enTextMap[ph.trim()];
			if (key && dict[key]) inp.placeholder = convertDigits(dict[key], lang);
		});
		document.querySelectorAll('button, a, label').forEach(el => {
			const txt = el.textContent.trim();
			const key = enTextMap[txt];
			if (key && dict[key]) el.textContent = convertDigits(dict[key], lang);
		});
		document.querySelectorAll('select option').forEach(opt => {
			const txt = opt.textContent.trim();
			const key = enTextMap[txt];
			if (key && dict[key]) opt.textContent = convertDigits(dict[key], lang);
		});
	}

	function translateTextNodes(lang) {
		const dict = translations[lang] || translations.en;
		const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
			acceptNode: function(node) {
				if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
				let p = node.parentElement;
				while (p) {
					const tag = p.tagName && p.tagName.toLowerCase();
					if (['script','style','noscript','textarea','code','pre'].includes(tag)) return NodeFilter.FILTER_REJECT;
					if (p.hasAttribute && p.hasAttribute('data-i18n')) return NodeFilter.FILTER_REJECT;
					p = p.parentElement;
				}
				return NodeFilter.FILTER_ACCEPT;
			}
		}, false);

		const nodes = [];
		while(walker.nextNode()) nodes.push(walker.currentNode);

		nodes.forEach(textNode => {
			let s = textNode.nodeValue;
			let changed = false;
			enPhrasesSorted.forEach(enPhrase => {
				const re = new RegExp('\\b' + escapeRegExp(enPhrase) + '\\b','gi');
				if (re.test(s)) {
					const key = enTextMap[enPhrase];
					const replacement = (translations[lang] && translations[lang][key]) ? translations[lang][key] : translations.en[key] || enPhrase;
					s = s.replace(re, replacement);
					changed = true;
				}
			});
			const converted = convertDigits(s, lang);
			if (changed || converted !== s) textNode.nodeValue = converted;
		});
	}

	function applyTranslations(lang) {
		if (!translations[lang]) lang = 'en';
		applyDataI18n(lang);
		translateAttributes(lang);
		translateTextNodes(lang);
		// set dir attribute for RTL support if needed (all currently ltr)
		document.documentElement.setAttribute('lang', lang);
	}

	function flashElement(el) {
		if (!el) return;
		el.classList.remove('lang-flash');
		void el.offsetWidth;
		el.classList.add('lang-flash');
		setTimeout(()=>el.classList.remove('lang-flash'), 900);
	}

	function setLanguage(lang, sourceEl) {
		if (!translations[lang]) lang = 'en';
		localStorage.setItem('site_lang', lang);
		applyTranslations(lang);
		document.querySelectorAll('.lang-select-compact, .lang-select-large, #langSelect, #langSelectForm').forEach(s => {
			if (s) s.value = lang;
		});
		flashElement(sourceEl || document.querySelector('.lang-select-compact'));
		window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
	}

	function initI18n() {
		const saved = localStorage.getItem('site_lang') || 'en';
		applyTranslations(saved);
		document.querySelectorAll('.lang-select-compact, .lang-select-large, #langSelect, #langSelectForm').forEach(s => {
			if (!s) return;
			s.value = saved;
			s.addEventListener('change', function(e){ setLanguage(e.target.value, e.target); });
			s.addEventListener('click', () => flashElement(s));
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initI18n);
	} else {
		initI18n();
	}

	// Expose API
	window._i18n = { setLanguage, applyTranslations, translations, initI18n };
	if (typeof module !== 'undefined' && module.exports) module.exports = window._i18n;
})();
