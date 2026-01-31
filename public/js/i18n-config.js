/**
 * i18next Configuration and Enhanced Translations
 * This configuration provides complete translations for English, Hindi, and Marathi
 * Usage: import this file before using translations
 */

const i18nConfig = {
    // Language configurations
    languages: {
        en: {
            name: 'English',
            nativeName: 'English',
            dir: 'ltr'
        },
        hi: {
            name: 'Hindi',
            nativeName: 'हिन्दी',
            dir: 'ltr'
        },
        mr: {
            name: 'Marathi',
            nativeName: 'मराठी',
            dir: 'ltr'
        }
    },
    
    // Default language
    fallbackLng: 'en',
    defaultLanguage: 'en',
    
    // Namespaces for organizing translations
    namespaces: ['common', 'login', 'navigation', 'footer', 'errors'],
    defaultNS: 'common',
    
    // Translation resources organized by language and namespace
    resources: {
        en: {
            common: {
                appTitle: 'Water Supply Management System',
                appSubtitle: 'Efficient water supply scheduling and management for Pune Municipal Corporation',
                welcome: 'Welcome',
                loading: 'Loading...',
                error: 'Error',
                success: 'Success',
                cancel: 'Cancel',
                save: 'Save',
                delete: 'Delete',
                edit: 'Edit',
                back: 'Back',
                next: 'Next',
                previous: 'Previous',
                search: 'Search',
                filter: 'Filter',
                sort: 'Sort',
                view: 'View',
                download: 'Download',
                upload: 'Upload',
                print: 'Print',
                share: 'Share',
                close: 'Close',
                menu: 'Menu'
            },
            login: {
                signin: 'Sign In',
                signup: 'Sign Up',
                signout: 'Sign Out',
                logout: 'Logout',
                email: 'Email',
                code: 'Code',
                password: 'Password',
                rememberMe: 'Remember Me',
                forgotPassword: 'Forgot Password?',
                enterCredentials: 'Enter your credentials to continue',
                selectRole: 'Select your role',
                selectMethod: 'Select method',
                invalidCredentials: 'Invalid credentials. Please try again.',
                accountLocked: 'Your account has been locked. Please contact support.',
                sessionExpired: 'Your session has expired. Please log in again.',
                demoAccess: 'Demo Access:',
                citizen: 'Citizen',
                authority: 'Authority'
            },
            navigation: {
                home: 'Home',
                about: 'About',
                introduction: 'Introduction',
                objectives: 'Objectives & Functions',
                officers: 'Officers & Staff',
                citizen: 'Citizen',
                complaint: 'Report Complaint',
                services: 'Services',
                tanks: 'Water Tanks',
                cleaning: 'Cleaning Schedules',
                pipeline: 'Pipeline System',
                maintenance: 'Maintenance',
                schedule: 'Schedule',
                contact: 'Contact',
                authority: 'Authority',
                dashboard: 'Dashboard',
                publish: 'Publish Notice',
                notices: 'Notices'
            },
            footer: {
                quickLinks: 'Quick Links',
                about: 'About',
                services: 'Services',
                support: 'Support',
                contact: 'Contact',
                privacy: 'Privacy Policy',
                terms: 'Terms of Service',
                copyright: '© 2026 Water Supply Department, Pune Municipal Corporation. All Rights Reserved.'
            },
            errors: {
                pageNotFound: 'Page Not Found',
                unauthorized: 'Unauthorized Access',
                forbidden: 'Forbidden',
                serverError: 'Server Error',
                tryAgain: 'Try Again',
                goHome: 'Go Home'
            }
        },
        hi: {
            common: {
                appTitle: 'जल आपूर्ति प्रबंधन प्रणाली',
                appSubtitle: 'पुणे महानगरपालिका के लिए कुशल जल आपूर्ति शेड्यूलिंग और प्रबंधन',
                welcome: 'स्वागत है',
                loading: 'लोड हो रहा है...',
                error: 'त्रुटि',
                success: 'सफल',
                cancel: 'रद्द करें',
                save: 'सहेजें',
                delete: 'हटाएं',
                edit: 'संपादित करें',
                back: 'वापस',
                next: 'अगला',
                previous: 'पिछला',
                search: 'खोजें',
                filter: 'फ़िल्टर करें',
                sort: 'क्रमबद्ध करें',
                view: 'देखें',
                download: 'डाउनलोड करें',
                upload: 'अपलोड करें',
                print: 'प्रिंट करें',
                share: 'साझा करें',
                close: 'बंद करें',
                menu: 'मेनू'
            },
            login: {
                signin: 'साइन इन',
                signup: 'साइन अप करें',
                signout: 'साइन आउट करें',
                logout: 'लॉग आउट',
                email: 'ईमेल',
                code: 'कोड',
                password: 'पासवर्ड',
                rememberMe: 'मुझे याद रखें',
                forgotPassword: 'पासवर्ड भूल गए?',
                enterCredentials: 'जारी रखने के लिए अपनी प्रमाण जानकारी दर्ज करें',
                selectRole: 'अपनी भूमिका चुनें',
                selectMethod: 'विधि चुनें',
                invalidCredentials: 'अमान्य प्रमाण जानकारी। कृपया दोबारा कोशिश करें।',
                accountLocked: 'आपका खाता लॉक कर दिया गया है। कृपया सहायता से संपर्क करें।',
                sessionExpired: 'आपका सत्र समाप्त हो गया है। कृपया दोबारा लॉग इन करें।',
                demoAccess: 'डेमो पहुंच:',
                citizen: 'नागरिक',
                authority: 'अधिकारी'
            },
            navigation: {
                home: 'मुख्य पृष्ठ',
                about: 'के बारे में',
                introduction: 'परिचय',
                objectives: 'उद्देश्य और कार्य',
                officers: 'अधिकारी और कर्मचारी',
                citizen: 'नागरिक',
                complaint: 'शिकायत दर्ज करें',
                services: 'सेवाएँ',
                tanks: 'पानी की टंकी',
                cleaning: 'सफाई अनुसूची',
                pipeline: 'पाइपलाइन सिस्टम',
                maintenance: 'रखरखाव',
                schedule: 'शेड्यूल',
                contact: 'संपर्क',
                authority: 'अधिकारी',
                dashboard: 'डैशबोर्ड',
                publish: 'नोटिस प्रकाशित करें',
                notices: 'सूचनाएं'
            },
            footer: {
                quickLinks: 'त्वरित लिंक',
                about: 'के बारे में',
                services: 'सेवाएँ',
                support: 'समर्थन',
                contact: 'संपर्क',
                privacy: 'गोपनीयता नीति',
                terms: 'सेवा की शर्तें',
                copyright: '© 2026 जल आपूर्ति विभाग, पुणे महानगरपालिका। सर्व अधिकार सुरक्षित।'
            },
            errors: {
                pageNotFound: 'पृष्ठ नहीं मिला',
                unauthorized: 'अनुमति नहीं है',
                forbidden: 'निषिद्ध',
                serverError: 'सर्वर त्रुटि',
                tryAgain: 'फिर से कोशिश करें',
                goHome: 'होम पर जाएं'
            }
        },
        mr: {
            common: {
                appTitle: 'जलपुरवठा व्यवस्थापन प्रणाली',
                appSubtitle: 'पुणे महानगरपालिकेसाठी कार्यक्षम जलपुरवठा अनुसूचन आणि व्यवस्थापन',
                welcome: 'स्वागत आहे',
                loading: 'लोड होत आहे...',
                error: 'त्रुटी',
                success: 'यश',
                cancel: 'रद्द करा',
                save: 'जतन करा',
                delete: 'हटवा',
                edit: 'संपादित करा',
                back: 'मागे',
                next: 'पुढील',
                previous: 'मागील',
                search: 'शोधा',
                filter: 'फिल्टर करा',
                sort: 'क्रमवारी करा',
                view: 'पहा',
                download: 'डाउनलोड करा',
                upload: 'अपलोड करा',
                print: 'प्रिंट करा',
                share: 'शेअर करा',
                close: 'बंद करा',
                menu: 'मेनू'
            },
            login: {
                signin: 'साइन इन',
                signup: 'साइन अप करा',
                signout: 'साइन आउट करा',
                logout: 'लॉग आउट',
                email: 'ईमेल',
                code: 'कोड',
                password: 'पासवर्ड',
                rememberMe: 'मला लक्षात ठेवा',
                forgotPassword: 'पासवर्ड विसरलात?',
                enterCredentials: 'सुरू करण्यासाठी तुमची माहिती भरा',
                selectRole: 'तुमची भूमिका निवडा',
                selectMethod: 'पद्धत निवडा',
                invalidCredentials: 'अमान्य माहिती. कृपया पुन्हा प्रयत्न करा.',
                accountLocked: 'तुमचे खाते लॉक करण्यात आले आहे. कृपया समर्थनाशी संपर्क साधा.',
                sessionExpired: 'तुमचे सेशन समाप्त झाले आहे. कृपया पुन्हा लॉग इन करा.',
                demoAccess: 'डेमो प्रवेश:',
                citizen: 'नागरिक',
                authority: 'अधिकारी'
            },
            navigation: {
                home: 'मुख्यपृष्ठ',
                about: 'विषयी',
                introduction: 'परिचय',
                objectives: 'उद्दिष्टे व कार्य',
                officers: 'अधिकारी व कर्मचारी',
                citizen: 'नागरिक',
                complaint: 'तक्रार नोंदवा',
                services: 'सेवा',
                tanks: 'पाण्याचे टाकी',
                cleaning: 'स्वच्छता वेळापत्रक',
                pipeline: 'पाइपलाइन प्रणाली',
                maintenance: 'देखभाल',
                schedule: 'वेळापत्रक',
                contact: 'संपर्क',
                authority: 'अधिकारी',
                dashboard: 'डॅशबोर्ड',
                publish: 'सूचना प्रसिद्ध करा',
                notices: 'सूचना'
            },
            footer: {
                quickLinks: 'त्वरित दुवे',
                about: 'विषयी',
                services: 'सेवा',
                support: 'समर्थन',
                contact: 'संपर्क',
                privacy: 'गोपनीयता धोरण',
                terms: 'सेवा अटी',
                copyright: '© 2026 जलपुरवठा विभाग, पुणे महानगरपालिका. सर्व हक्क राखीव.'
            },
            errors: {
                pageNotFound: 'पृष्ठ सापडला नाही',
                unauthorized: 'अनुमती नाही',
                forbidden: 'प्रतिबंधित',
                serverError: 'सर्व्हर त्रुटी',
                tryAgain: 'पुन्हा प्रयत्न करा',
                goHome: 'होमवर जा'
            }
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = i18nConfig;
}

// Make available globally
if (typeof window !== 'undefined') {
    window.i18nConfig = i18nConfig;
}
