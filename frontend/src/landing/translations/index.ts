import { LanguageCode, LanguageOption } from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', nativeName: 'English', englishName: 'English', scriptBadge: 'En' },
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi', scriptBadge: 'Hindi' },
  { code: 'mr', nativeName: 'मराठी', englishName: 'Marathi', scriptBadge: 'Marathi' },
  { code: 'gu', nativeName: 'ગુજરાતી', englishName: 'Gujarati', scriptBadge: 'Gujarati' },
  { code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali', scriptBadge: 'Bengali' },
  { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil', scriptBadge: 'Tamil' },
  { code: 'te', nativeName: 'తెలుగు', englishName: 'Telugu', scriptBadge: 'Telugu' },
];

export interface TranslationDictionary {
  // Nav
  navHowItWorks: string;
  navCitizenVoice: string;
  navInsights: string;
  navPolicymakers: string;
  navAbout: string;
  navGetStarted: string;
  navSubtag: string;

  // Hero
  heroEyebrow: string;
  heroTitle1: string;
  heroTitle2: string;
  heroTitle3: string;
  heroSubtitle1: string;
  heroSubtitle2: string;
  heroCtaShare: string;
  heroCtaHowItWorks: string;
  heroStatLanguages: string;
  heroStatLanguagesSub: string;
  heroStatInsights: string;
  heroStatInsightsSub: string;
  heroStatPrioritization: string;
  heroStatPrioritizationSub: string;

  // Flow Banner
  flowCitizenVoice: string;
  flowAiSynthesis: string;
  flowDemandHotspots: string;
  flowDpiAction: string;

  // Hero interactive
  nluEngineLive: string;
  nluEngineSub: string;
  topDetectedNeed: string;
  criticalPriority: string;
  drinkingWaterPipeline: string;
  privacyNotice: string;
  nationalStandard: string;

  // How it works
  pipelineEyebrow: string;
  pipelineHeading: string;
  pipelineSubheading: string;
  step1Title: string;
  step1Desc: string;
  step1Footer: string;
  step2Title: string;
  step2Desc: string;
  step2Footer: string;
  step3Title: string;
  step3Desc: string;
  step3Footer: string;
  step4Title: string;
  step4Desc: string;
  step4Footer: string;

  // Real-time map & data
  mapEyebrow: string;
  mapHeading: string;
  mapSubheading: string;
  allDemands: string;
  roads: string;
  water: string;
  healthcare: string;
  education: string;
  transport: string;
  digital: string;
  developmentDemand: string;
  panIndiaBreakdown: string;
  highDemandDetected: string;
  highDemandDesc: string;
  verifiedAadhaar: string;
  viewDataSchema: string;

  // Policymakers
  decisionEyebrow: string;
  decisionHeading: string;
  decisionDesc: string;
  decisionBullet1Title: string;
  decisionBullet1Desc: string;
  decisionBullet2Title: string;
  decisionBullet2Desc: string;
  decisionBullet3Title: string;
  decisionBullet3Desc: string;
  governanceWhitepaper: string;
  exploreIntelligence: string;

  // Multilingual section
  inclusionEyebrow: string;
  multilingualHeading1: string;
  multilingualHeading2: string;
  multilingualSubheading: string;
  voiceDemoTitle: string;
  bhashiniCompatible: string;
  tapToRecord: string;
  tapToSpeak: string;
  listeningPrompt: string;

  // Scale & reach
  scaleEyebrow: string;
  scaleHeading: string;
  scaleSubheading: string;
  stat1Number: string;
  stat1Label: string;
  stat1Desc: string;
  stat2Number: string;
  stat2Label: string;
  stat2Desc: string;
  stat3Number: string;
  stat3Label: string;
  stat3Desc: string;

  // Final CTA
  ctaEyebrow: string;
  ctaHeading: string;
  ctaSubheading: string;
  ctaPrimaryBtn: string;
  ctaSecondaryBtn: string;
  ctaTrust1: string;
  ctaTrust2: string;
  ctaTrust3: string;

  // Modal
  modalTitle: string;
  modalSub: string;
  modalTabVoice: string;
  modalTabText: string;
  modalTabMessage: string;
  modalCategoryLabel: string;
  modalLocationLabel: string;
  modalLocationPlaceholder: string;
  modalNeedLabel: string;
  modalNeedPlaceholder: string;
  modalSubmitBtn: string;
  modalSuccessMsg: string;
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    navHowItWorks: 'How It Works',
    navCitizenVoice: 'Citizen Voice',
    navInsights: 'Insights',
    navPolicymakers: 'For Policymakers',
    navAbout: 'About',
    navGetStarted: 'Get Started',
    navSubtag: 'AI • Citizens • Governance',

    heroEyebrow: 'AI For Digital Public Infrastructure',
    heroTitle1: 'Your Voice.',
    heroTitle2: 'Better Decisions.',
    heroTitle3: 'A Smarter India.',
    heroSubtitle1: 'JanSetu AI turns citizen voices into actionable development insights for a better-connected India.',
    heroSubtitle2: 'Speak, type or message in your language. Our AI understands citizen needs, identifies development hotspots and helps governments prioritize what matters most.',
    heroCtaShare: 'Share Your Need',
    heroCtaHowItWorks: 'See How It Works',
    heroStatLanguages: '22+ Indian',
    heroStatLanguagesSub: 'Languages',
    heroStatInsights: 'Citizen-Powered',
    heroStatInsightsSub: 'Insights',
    heroStatPrioritization: 'AI-Driven',
    heroStatPrioritizationSub: 'Prioritization',

    flowCitizenVoice: 'Citizen Voice',
    flowAiSynthesis: 'AI Synthesis',
    flowDemandHotspots: 'Demand Hotspots',
    flowDpiAction: 'DPI Action',

    nluEngineLive: 'JanSetu Multilingual NLU Engine',
    nluEngineSub: 'Aggregating 42,890 citizen requests across 18 states',
    topDetectedNeed: 'Top Detected Need',
    criticalPriority: 'Critical Priority',
    drinkingWaterPipeline: 'Drinking Water Pipeline Extension',
    privacyNotice: 'Privacy-Preserving & Open Public API',
    nationalStandard: 'National Data Governance Standard',

    pipelineEyebrow: 'The Intelligence Pipeline',
    pipelineHeading: 'From Citizen Voice to Action',
    pipelineSubheading: 'Every request becomes meaningful insight.',
    step1Title: 'Speak in Your Language',
    step1Desc: 'Submit your needs through voice, text or messaging apps in your preferred language.',
    step1Footer: 'Voice, SMS & WhatsApp',
    step2Title: 'AI Understands',
    step2Desc: 'Multilingual AI converts diverse citizen feedback into structured development needs.',
    step2Footer: '22 Languages + Dialects',
    step3Title: 'Find Demand Hotspots',
    step3Desc: 'Combine citizen feedback with demographic, infrastructure and investment data.',
    step3Footer: 'Geospatial Clustering',
    step4Title: 'Prioritize Development',
    step4Desc: 'Give policymakers evidence-based insights for planning and resource allocation.',
    step4Footer: 'Impact-Weighted ROI',

    mapEyebrow: 'Real-Time Public Data',
    mapHeading: 'See What India Needs',
    mapSubheading: 'Live synthesis of geo-tagged community priorities cross-referenced with public investment plans.',
    allDemands: 'All Demands',
    roads: 'Roads',
    water: 'Water',
    healthcare: 'Healthcare',
    education: 'Education',
    transport: 'Transport',
    digital: 'Digital',
    developmentDemand: 'Development Demand',
    panIndiaBreakdown: 'Pan-India Breakdown',
    highDemandDetected: 'High-demand regions detected by AI',
    highDemandDesc: 'AI detected high convergence of water-related grievances in 37 adjacent gram panchayats, triggering automatic notification to district planning committees.',
    verifiedAadhaar: 'Verified through Aadhaar & DigiLocker API',
    viewDataSchema: 'View Data Schema →',

    decisionEyebrow: 'Decision-Support Architecture',
    decisionHeading: 'From Thousands of Requests to Clear Priorities',
    decisionDesc: 'Elected representatives, District Magistrates, and urban planners no longer need to sift through unorganized paper petitions or isolated complaints.',
    decisionBullet1Title: 'Demographic & Vulnerability Overlay',
    decisionBullet1Desc: 'Cross-analyzed with census poverty indices to protect underserved clusters.',
    decisionBullet2Title: 'Capital Expenditure (CapEx) Alignment',
    decisionBullet2Desc: 'Maps citizen priorities directly to state and central scheme budget line items.',
    decisionBullet3Title: 'Tamper-Proof Audit Trail',
    decisionBullet3Desc: 'Every priority scoring factor is explainable and verifiable by public auditors.',
    governanceWhitepaper: 'Read the Governance Whitepaper',
    exploreIntelligence: 'Explore Intelligence',

    inclusionEyebrow: 'Inclusion By Design',
    multilingualHeading1: 'India Speaks Many Languages.',
    multilingualHeading2: 'JanSetu AI Listens.',
    multilingualSubheading: "Designed for India's linguistic diversity.",
    voiceDemoTitle: 'Interactive Voice Demo',
    bhashiniCompatible: 'Bhashini AI Compatible',
    tapToRecord: 'Tap to record your local issue in any dialect',
    tapToSpeak: 'Tap to Speak',
    listeningPrompt: '“Listening... Try saying: ‘Hamare gaon me primary health centre chahiye’”',

    scaleEyebrow: 'Scale & Reach',
    scaleHeading: 'Technology That Connects Citizens and Governance',
    scaleSubheading: 'Built on open DPI principles, ensuring zero barriers to civic participation.',
    stat1Number: '22+',
    stat1Label: 'Languages',
    stat1Desc: "Native speech and script processing across India's Eighth Schedule languages.",
    stat2Number: '1 Platform',
    stat2Label: 'Citizen Development Intelligence',
    stat2Desc: 'Unifying village, ward, district, and state-level infrastructure requests.',
    stat3Number: '∞',
    stat3Label: 'Voices That Can Be Heard',
    stat3Desc: 'Accessible through any smartphone, feature phone (IVR), or local kiosk.',

    ctaEyebrow: 'Citizen First Public Architecture',
    ctaHeading: 'Your Voice Can Shape Your City.',
    ctaSubheading: 'Share what your community needs. Let AI help turn collective voices into actionable development intelligence.',
    ctaPrimaryBtn: 'Share Your Need',
    ctaSecondaryBtn: 'Explore the Platform',
    ctaTrust1: 'No app download required',
    ctaTrust2: 'Works via WhatsApp & Toll-Free',
    ctaTrust3: 'Free & Open Source',

    modalTitle: 'Share Your Community Need',
    modalSub: 'Submit in any language. AI processes and groups with nearby requests.',
    modalTabVoice: '🎤 Voice Input',
    modalTabText: '⌨ Text Form',
    modalTabMessage: '💬 WhatsApp / SMS',
    modalCategoryLabel: 'Development Category',
    modalLocationLabel: 'Location (State / District / Block)',
    modalLocationPlaceholder: 'e.g. Bundi, Tonk, Rajasthan (304001)',
    modalNeedLabel: 'Describe the Need or Grievance',
    modalNeedPlaceholder: 'Describe the road, water, school, or health issue in your community...',
    modalSubmitBtn: 'Submit to JanSetu AI Network →',
    modalSuccessMsg: 'Your voice has been added to the community intelligence.',
  },

  hi: {
    navHowItWorks: 'यह कैसे काम करता है',
    navCitizenVoice: 'नागरिक आवाज़',
    navInsights: 'विश्लेषण',
    navPolicymakers: 'नीति निर्माताओं के लिए',
    navAbout: 'परिचय',
    navGetStarted: 'शुरुआत करें',
    navSubtag: 'एआई • नागरिक • सुशासन',

    heroEyebrow: 'डिजिटल पब्लिक इंफ्रास्ट्रक्चर हेतु एआई',
    heroTitle1: 'आपकी आवाज़।',
    heroTitle2: 'बेहतर निर्णय।',
    heroTitle3: 'एक सशक्त भारत।',
    heroSubtitle1: 'जनसेतु एआई नागरिकों की आवाज़ को बेहतर भारत के लिए कार्रवाई योग्य विकास प्राथमिकताओं में बदलता है।',
    heroSubtitle2: 'अपनी मातृभाषा में बोलें, लिखें या संदेश भेजें। हमारा एआई ज़रूरतों को समझकर हॉटस्पॉट चिन्हित करता है और शासन को सही प्राथमिकताओं में मदद करता है।',
    heroCtaShare: 'अपनी ज़रूरत साझा करें',
    heroCtaHowItWorks: 'कार्यप्रणाली देखें',
    heroStatLanguages: '22+ भारतीय',
    heroStatLanguagesSub: 'भाषाएँ',
    heroStatInsights: 'नागरिक-संचालित',
    heroStatInsightsSub: 'विश्लेषण',
    heroStatPrioritization: 'एआई-आधारित',
    heroStatPrioritizationSub: 'प्राथमिकता',

    flowCitizenVoice: 'नागरिक आवाज़',
    flowAiSynthesis: 'एआई विश्लेषण',
    flowDemandHotspots: 'मांग हॉटस्पॉट',
    flowDpiAction: 'डीपीआई कार्रवाई',

    nluEngineLive: 'जनसेतु बहुभाषी एनएलयू इंजन',
    nluEngineSub: '18 राज्यों में 42,890 नागरिक अनुरोधों का वास्तविक समय में एकत्रीकरण',
    topDetectedNeed: 'सर्वोच्च चिन्हित आवश्यकता',
    criticalPriority: 'गंभीर प्राथमिकता',
    drinkingWaterPipeline: 'पेयजल पाइपलाइन विस्तार परियोजना',
    privacyNotice: 'गोपनीयता-संरक्षित एवं खुला सार्वजनिक एपीआई',
    nationalStandard: 'राष्ट्रीय डेटा गवर्नेंस मानक',

    pipelineEyebrow: 'इंटेलीजेंस पाइपलाइन',
    pipelineHeading: 'नागरिक आवाज़ से ठोस कार्रवाई तक',
    pipelineSubheading: 'हर अनुरोध बनता है एक सार्थक विकास अंतर्दृष्टि।',
    step1Title: 'अपनी भाषा में बोलें',
    step1Desc: 'वॉइस, टेक्स्ट या मैसेजिंग ऐप्स के माध्यम से अपनी पसंदीदा भाषा में ज़रूरत दर्ज करें।',
    step1Footer: 'वॉइस, एसएमएस एवं व्हाट्सएप',
    step2Title: 'एआई समझता है',
    step2Desc: 'बहुभाषी एआई विविध प्रतिक्रियाओं को संरचित विकास ज़रूरतों में बदलता है।',
    step2Footer: '22 भाषाएँ + बोलियाँ',
    step3Title: 'मांग हॉटस्पॉट खोजें',
    step3Desc: 'नागरिक फीडबैक को जनसांख्यिकी, बुनियादी ढांचे और निवेश डेटा के साथ जोड़ें।',
    step3Footer: 'जियोस्पेशियल क्लस्टरिंग',
    step4Title: 'विकास को प्राथमिकता दें',
    step4Desc: 'योजना और संसाधन आवंटन के लिए नीति निर्माताओं को साक्ष्य-आधारित अंतर्दृष्टि प्रदान करें।',
    step4Footer: 'प्रभाव-भारित आरओआई',

    mapEyebrow: 'रीयल-टाइम सार्वजनिक डेटा',
    mapHeading: 'देखें भारत को क्या चाहिए',
    mapSubheading: 'सार्वजनिक निवेश योजनाओं के साथ क्रॉस-रेफरेंस किए गए जियो-टैग्ड सामुदायिक प्राथमिकताओं का लाइव संश्लेषण।',
    allDemands: 'सभी मांगें',
    roads: 'सड़कें',
    water: 'पेयजल',
    healthcare: 'स्वास्थ्य सेवा',
    education: 'शिक्षा',
    transport: 'परिवहन',
    digital: 'डिजिटल',
    developmentDemand: 'विकास मांग',
    panIndiaBreakdown: 'अखिल भारतीय विवरण',
    highDemandDetected: 'एआई द्वारा चिन्हित उच्च मांग क्षेत्र',
    highDemandDesc: 'एआई ने 37 निकटवर्ती ग्राम पंचायतों में पेयजल की गंभीर समस्या पाई, जिससे जिला योजना समितियों को स्वतः अलर्ट भेजा गया।',
    verifiedAadhaar: 'आधार और डिजिलॉकर एपीआई द्वारा सत्यापित',
    viewDataSchema: 'डेटा स्कीमा देखें →',

    decisionEyebrow: 'निर्णय-समर्थन वास्तुकला',
    decisionHeading: 'हज़ारों आवेदनों से स्पष्ट प्राथमिकताओं तक',
    decisionDesc: 'जनप्रतिनिधियों और जिला अधिकारियों को अब अव्यवस्थित कागजी याचिकाओं को टटोलने की आवश्यकता नहीं है।',
    decisionBullet1Title: 'जनसांख्यिकी और संवेदनशीलता ओवरले',
    decisionBullet1Desc: 'वंचित बस्तियों की सुरक्षा के लिए जनगणना गरीबी सूचकांकों के साथ क्रॉस-विश्लेषण।',
    decisionBullet2Title: 'पूंजीगत व्यय (CapEx) समन्वय',
    decisionBullet2Desc: 'नागरिक प्राथमिकताओं को सीधे राज्य और केंद्रीय योजनाओं के बजट से जोड़ता है।',
    decisionBullet3Title: 'छेड़छाड़-मुक्त ऑडिट ट्रेल',
    decisionBullet3Desc: 'प्रत्येक प्राथमिकता स्कोर सार्वजनिक लेखा परीक्षकों द्वारा सत्यापन योग्य और पारदर्शी है।',
    governanceWhitepaper: 'गवर्नेंस श्वेतपत्र पढ़ें',
    exploreIntelligence: 'विश्लेषण देखें',

    inclusionEyebrow: 'समावेशन से सशक्तिकरण',
    multilingualHeading1: 'भारत कई भाषाएं बोलता है।',
    multilingualHeading2: 'जनसेतु एआई सुनता है।',
    multilingualSubheading: 'भारत की भाषाई विविधता के लिए विशेष रूप से डिज़ाइन किया गया।',
    voiceDemoTitle: 'इंटरैक्टिव वॉइस डेमो',
    bhashiniCompatible: 'भाषिणी एआई संगत',
    tapToRecord: 'किसी भी बोली में अपनी समस्या रिकॉर्ड करने हेतु टैप करें',
    tapToSpeak: 'बोलने के लिए टैप करें',
    listeningPrompt: '“सुन रहा हूँ... बोलें: ‘हमारे गाँव में प्राथमिक स्वास्थ्य केंद्र चाहिए’”',

    scaleEyebrow: 'पैमाना एवं पहुंच',
    scaleHeading: 'प्रौद्योगिकी जो नागरिकों और शासन को जोड़ती है',
    scaleSubheading: 'नागरिक भागीदारी के लिए खुली डीपीआई नींव पर निर्मित।',
    stat1Number: '22+',
    stat1Label: 'भाषाएँ',
    stat1Desc: 'भारत की आठवीं अनुसूची की भाषाओं में मूल वाणी और लिपि प्रसंस्करण।',
    stat2Number: '1 मंच',
    stat2Label: 'नागरिक विकास आसूचना',
    stat2Desc: 'ग्राम, वार्ड, जिला और राज्य स्तरीय बुनियादी ढांचा मांगों का एकीकरण।',
    stat3Number: '∞',
    stat3Label: 'आवाज़ें जो सुनी जा सकती हैं',
    stat3Desc: 'स्मार्टफोन, सामान्य फोन (IVR), या स्थानीय कियोस्क के माध्यम से सुलभ।',

    ctaEyebrow: 'नागरिक-प्रथम सार्वजनिक वास्तुकला',
    ctaHeading: 'आपकी आवाज़ आपके शहर को संवार सकती है।',
    ctaSubheading: 'साझा करें कि आपके समुदाय को क्या चाहिए। एआई को सामूहिक आवाज़ों को विकास में बदलने दें।',
    ctaPrimaryBtn: 'अपनी ज़रूरत साझा करें',
    ctaSecondaryBtn: 'मंच का अन्वेषण करें',
    ctaTrust1: 'ऐप डाउनलोड की आवश्यकता नहीं',
    ctaTrust2: 'व्हाट्सएप एवं टोल-फ्री पर उपलब्ध',
    ctaTrust3: 'निःशुल्क एवं ओपन सोर्स',

    modalTitle: 'अपने समुदाय की ज़रूरत साझा करें',
    modalSub: 'किसी भी भाषा में दर्ज करें। एआई इसे आसपास की ज़रूरतों के साथ संगठित करता है।',
    modalTabVoice: '🎤 वॉइस इनपुट',
    modalTabText: '⌨ टेक्स्ट फॉर्म',
    modalTabMessage: '💬 व्हाट्सएप / एसएमएस',
    modalCategoryLabel: 'विकास श्रेणी',
    modalLocationLabel: 'स्थान (राज्य / ज़िला / ब्लॉक)',
    modalLocationPlaceholder: 'उदा. बूंदी, टोंक, राजस्थान (304001)',
    modalNeedLabel: 'आवश्यकता या शिकायत का विवरण दें',
    modalNeedPlaceholder: 'सड़क, पानी, स्कूल या अस्पताल संबंधी समस्या अपने शब्दों में लिखें...',
    modalSubmitBtn: 'जनसेतु एआई नेटवर्क में जमा करें →',
    modalSuccessMsg: 'आपकी आवाज़ सामुदायिक आसूचना में शामिल कर ली गई है।',
  },

  mr: {
    navHowItWorks: 'हे कसे कार्य करते',
    navCitizenVoice: 'नागरिक आवाज',
    navInsights: 'माहिती व विश्लेषण',
    navPolicymakers: 'धोरणकर्त्यांसाठी',
    navAbout: 'माहिती',
    navGetStarted: 'सुरुवात करा',
    navSubtag: 'एआय • नागरिक • प्रशासन',

    heroEyebrow: 'डिजिटल पब्लिक इन्फ्रास्ट्रक्चरसाठी एआय',
    heroTitle1: 'तुमचा आवाज.',
    heroTitle2: 'उत्तम निर्णय.',
    heroTitle3: 'एक प्रगत भारत.',
    heroSubtitle1: 'जनसेतू एआय नागरिकांच्या आवाजाला कृतीयोग्य विकास प्राधान्यांमध्ये रूपांतरित करते.',
    heroSubtitle2: 'तुमच्या भाषेत बोला, लिहा किंवा संदेश पाठवा. आमचे एआय गरजा समजून घेते आणि सरकारला प्राधान्यक्रम ठरवण्यात मदत करते.',
    heroCtaShare: 'तुमची गरज सांगा',
    heroCtaHowItWorks: 'कसे कार्य करते ते पहा',
    heroStatLanguages: '२२+ भारतीय',
    heroStatLanguagesSub: 'भाषा',
    heroStatInsights: 'नागरिक-चालित',
    heroStatInsightsSub: 'विश्लेषण',
    heroStatPrioritization: 'एआय-आधारित',
    heroStatPrioritizationSub: 'प्राधान्यक्रम',

    flowCitizenVoice: 'नागरिक आवाज',
    flowAiSynthesis: 'एआय विश्लेषण',
    flowDemandHotspots: 'मागणी हॉटस्पॉट',
    flowDpiAction: 'डीपीआय कृती',

    nluEngineLive: 'जनसेतू बहुभाषिक एनएलयू इंजिन',
    nluEngineSub: '१८ राज्यांमध्ये ४२,८९० नागरिक मागण्यांचे थेट एकत्रीकरण',
    topDetectedNeed: 'प्रमुख गरज',
    criticalPriority: 'अति-महत्त्वाचे प्राधान्य',
    drinkingWaterPipeline: 'पिण्याच्या पाण्याची पाईपलाईन विस्तार',
    privacyNotice: 'गोपनीयता रक्षण व खुला एपीआय',
    nationalStandard: 'राष्ट्रीय डेटा गव्हर्नन्स मानक',

    pipelineEyebrow: 'इंटेलीजन्स पाईपलाईन',
    pipelineHeading: 'नागरिक आवाजापासून ठोस कृतीपर्यंत',
    pipelineSubheading: 'प्रत्येक विनंती बनते एक अर्थपूर्ण अंतर्दृष्टी.',
    step1Title: 'आपल्या भाषेत बोला',
    step1Desc: 'व्हॉइस, मजकूर किंवा व्हॉट्सॲपद्वारे आपल्या पसंतीच्या भाषेत गरज नोंदवा.',
    step1Footer: 'व्हॉइस, एसएमएस आणि व्हॉट्सॲप',
    step2Title: 'एआय समजून घेते',
    step2Desc: 'विविध प्रतिक्रियांना संरचित विकास गरजांमध्ये रूपांतरित करते.',
    step2Footer: '२२ भाषा आणि बोलीभाषा',
    step3Title: 'मागणी केंद्र शोधा',
    step3Desc: 'नागरिकांच्या अभिप्रायाला पायाभूत सुविधा आणि निधी डेटाशी जोडा.',
    step3Footer: 'भौगोलिक क्लस्टरिंग',
    step4Title: 'विकासाला प्राधान्य द्या',
    step4Desc: 'धोरणकर्त्यांना अचूक नियोजनासाठी पुरावे-आधारित माहिती द्या.',
    step4Footer: 'प्रभाव-आधारित आरओआय',

    mapEyebrow: 'रिअल-टाइम सार्वजनिक डेटा',
    mapHeading: 'भारताला काय हवे आहे ते पहा',
    mapSubheading: 'सार्वजनिक गुंतवणूक योजनांशी जोडलेल्या स्थानिक प्राधान्यांचे थेट विश्लेषण.',
    allDemands: 'सर्व मागण्या',
    roads: 'रस्ते',
    water: 'पाणीपुरवठा',
    healthcare: 'आरोग्य',
    education: 'शिक्षण',
    transport: 'वाहतूक',
    digital: 'डिजिटल',
    developmentDemand: 'विकास मागणी',
    panIndiaBreakdown: 'अखिल भारतीय प्रमाण',
    highDemandDetected: 'एआयद्वारे ओळखलेले उच्च मागणी क्षेत्र',
    highDemandDesc: '३७ ग्रामपंचायतींमध्ये पाणीटंचाईची तीव्र मागणी एआयने शोधून जिल्हा नियोजन समितीला त्वरित सूचना दिली.',
    verifiedAadhaar: 'आधार आणि डिजिलॉकरद्वारे सत्यापित',
    viewDataSchema: 'डेटा स्कीमा पहा →',

    decisionEyebrow: 'निर्णय-सहाय्य वास्तुकला',
    decisionHeading: 'हजारो अर्जांमधून स्पष्ट प्राधान्यक्रमाकडे',
    decisionDesc: 'लोकप्रतिनिधींना आणि जिल्हाधिकाऱ्यांना कागदी अर्जांमधून शोध घेण्याची गरज उरणार नाही.',
    decisionBullet1Title: 'लोकसंख्या व असुरक्षितता आच्छादन',
    decisionBullet1Desc: 'गरजू घटकांच्या संरक्षणासाठी दारिद्र्य निर्देशांकांशी थेट तुलना.',
    decisionBullet2Title: 'भांडवली खर्च (CapEx) जुळवणी',
    decisionBullet2Desc: 'नागरिकांच्या गरजा थेट सरकारी योजनांच्या अर्थसंकल्पाशी जोडल्या जातात.',
    decisionBullet3Title: 'पारदर्शक ऑडिट नोंद',
    decisionBullet3Desc: 'प्रत्येक प्राधान्यक्रम निकष लेखापरीक्षकांद्वारे तपासण्यायोग्य.',
    governanceWhitepaper: 'प्रशासन श्वेतपत्रिका वाचा',
    exploreIntelligence: 'माहिती पहा',

    inclusionEyebrow: 'सर्वसमावेशक रचना',
    multilingualHeading1: 'भारत अनेक भाषा बोलतो.',
    multilingualHeading2: 'जनसेतू एआय ऐकतो.',
    multilingualSubheading: 'भारताच्या समृद्ध भाषिक विविधतेसाठी विशेष निर्मिती.',
    voiceDemoTitle: 'व्हॉइस डेमो',
    bhashiniCompatible: 'भाषिणी एआय सुसंगत',
    tapToRecord: 'कोणत्याही बोलीत आपली समस्या सांगण्यासाठी टॅप करा',
    tapToSpeak: 'बोलण्यासाठी टॅप करा',
    listeningPrompt: '“ऐकत आहे... बोला: ‘आमच्या गावात प्राथमिक आरोग्य केंद्र हवे आहे’”',

    scaleEyebrow: 'व्याप्ती आणि प्रभाव',
    scaleHeading: 'नागरिक आणि प्रशासनाला जोडणारे तंत्रज्ञान',
    scaleSubheading: 'मुक्त डिजिटल सार्वजनिक पायाभूत सुविधा तत्त्वांवर आधारित.',
    stat1Number: '२२+',
    stat1Label: 'भाषा',
    stat1Desc: '८व्या अनुसूचीतील सर्व भाषांमध्ये नैसर्गिक वाणी आणि लिपी प्रक्रिया.',
    stat2Number: '१ व्यासपीठ',
    stat2Label: 'नागरिक विकास बुद्धिमत्ता',
    stat2Desc: 'गाव, प्रभाग, जिल्हा आणि राज्य स्तरावरील पायाभूत मागण्यांचे एकत्रीकरण.',
    stat3Number: '∞',
    stat3Label: 'ऐकता येणारे आवाज',
    stat3Desc: 'कोणत्याही स्मार्टफोन, साधा फोन (IVR) किंवा स्थानिक केंद्रातून वापरण्यायोग्य.',

    ctaEyebrow: 'नागरिक-प्रथम सार्वजनिक वास्तुकला',
    ctaHeading: 'तुमचा आवाज तुमच्या गावाला आकार देऊ शकतो.',
    ctaSubheading: 'तुमच्या परिसराची गरज मांडा. एआयच्या मदतीने विकासाला गती द्या.',
    ctaPrimaryBtn: 'तुमची गरज नोंदवा',
    ctaSecondaryBtn: 'प्लॅटफॉर्म पहा',
    ctaTrust1: 'कोणतेही ॲप डाऊनलोड नको',
    ctaTrust2: 'व्हॉट्सॲप आणि टोल-फ्री वर उपलब्ध',
    ctaTrust3: 'मोफत व ओपन सोर्स',

    modalTitle: 'परिसराची समस्या किंवा गरज नोंदवा',
    modalSub: 'कोणत्याही भाषेत सांगा. एआय नजीकच्या मागण्यांसोबत समन्वय साधेल.',
    modalTabVoice: '🎤 आवाज नोंदवा',
    modalTabText: '⌨ मजकूर फॉर्म',
    modalTabMessage: '💬 व्हॉट्सॲप / एसएमएस',
    modalCategoryLabel: 'विकास वर्गवारी',
    modalLocationLabel: 'स्थान (राज्य / जिल्हा / गाव)',
    modalLocationPlaceholder: 'उदा. सातारा, फलटण, महाराष्ट्र (४१५५२३)',
    modalNeedLabel: 'समस्या किंवा गरज स्पष्ट करा',
    modalNeedPlaceholder: 'रस्ते, पाणी, शाळा किंवा आरोग्यविषयक अडचण आपल्या शब्दांत मांडा...',
    modalSubmitBtn: 'जनसेतू एआय नेटवर्कवर पाठवा →',
    modalSuccessMsg: 'तुमचा आवाज समुदाय बुद्धिमत्तेमध्ये समाविष्ट झाला आहे.',
  },

  gu: {
    navHowItWorks: 'કેવી રીતે કાર્ય કરે છે',
    navCitizenVoice: 'નાગરિક અવાજ',
    navInsights: 'વિશ્લેષણ',
    navPolicymakers: 'નીતિ ઘડવૈયાઓ માટે',
    navAbout: 'વિશે',
    navGetStarted: 'શરૂ કરો',
    navSubtag: 'એઆઈ • નાગરિક • સુશાસન',

    heroEyebrow: 'ડિજિટલ પબ્લિક ઇન્ફ્રાસ્ટ્રક્ચર માટે એઆઈ',
    heroTitle1: 'તમારો અવાજ.',
    heroTitle2: 'શ્રેષ્ઠ નિર્ણયો.',
    heroTitle3: 'એક સક્ષમ ભારત.',
    heroSubtitle1: 'જનસેતુ એઆઈ નાગરિકોના અવાજને નક્કર વિકાસ પ્રાથમિકતાઓમાં ફેરવે છે.',
    heroSubtitle2: 'તમારી ભાષામાં બોલો, લખો કે મેસેજ કરો. અમારું એઆઈ લોકોની જરૂરિયાતો સમજીને સરકારને પ્રાથમિકતા નક્કી કરવામાં મદદ કરે છે.',
    heroCtaShare: 'તમારી જરૂરિયાત જણાવો',
    heroCtaHowItWorks: 'પ્રક્રિયા જુઓ',
    heroStatLanguages: '૨૨+ ભારતીય',
    heroStatLanguagesSub: 'ભાષાઓ',
    heroStatInsights: 'નાગરિક-સંચાલિત',
    heroStatInsightsSub: 'વિશ્લેષણ',
    heroStatPrioritization: 'એઆઈ-આધારિત',
    heroStatPrioritizationSub: 'પ્રાથમિકતા',

    flowCitizenVoice: 'નાગરિક અવાજ',
    flowAiSynthesis: 'એઆઈ વિશ્લેષણ',
    flowDemandHotspots: 'માગ હોટસ્પોટ્સ',
    flowDpiAction: 'ડીપીઆઈ પગલાં',

    nluEngineLive: 'જનસેતુ બહુભાષી એનએલયુ એન્જિન',
    nluEngineSub: '૧૮ રાજ્યોમાં ૪૨,૮૯૦ નાગરિક વિનંતીઓનું સીધું એકત્રીકરણ',
    topDetectedNeed: 'સૌથી વધુ નોંધાયેલ જરૂરિયાત',
    criticalPriority: 'તાત્કાલિક પ્રાથમિકતા',
    drinkingWaterPipeline: 'પીવાના પાણીની પાઈપલાઈન વિસ્તરણ',
    privacyNotice: 'ગોપનીયતા સુરક્ષિત અને ઓપન પબ્લિક એપીઆઈ',
    nationalStandard: 'રાષ્ટ્રીય ડેટા ગવર્નન્સ ધોરણ',

    pipelineEyebrow: 'ઇન્ટેલિજન્સ પાઇપલાઇન',
    pipelineHeading: 'નાગરિક અવાજથી નક્કર કાર્યવાહી સુધી',
    pipelineSubheading: 'દરેક વિનંતી બને છે એક સાર્થક વિકાસ સૂચક.',
    step1Title: 'તમારી ભાષામાં બોલો',
    step1Desc: 'અવાજ, ટેક્સ્ટ અથવા મેસેજિંગ દ્વારા તમારી માતૃભાષામાં જરૂરિયાત નોંધાવો.',
    step1Footer: 'વોઇસ, એસએમએસ અને વ્હોટ્સએપ',
    step2Title: 'એઆઈ સમજે છે',
    step2Desc: 'બહુભાષી એઆઈ લોકોના અભિપ્રાયને સંગઠિત વિકાસ યોજનાઓમાં ફેરવે છે.',
    step2Footer: '૨૨ ભાષાઓ અને બોલીઓ',
    step3Title: 'માગ કેન્દ્રો શોધો',
    step3Desc: 'નાગરિક ફીડબેકને વસ્તી અને ઈન્ફ્રાસ્ટ્રક્ચર ડેટા સાથે સાંકળો.',
    step3Footer: 'જિયોસ્પેશિયલ ક્લસ્ટરિંગ',
    step4Title: 'વિકાસને પ્રાથમિકતા આપો',
    step4Desc: 'નીતિ ઘડવૈયાઓને યોગ્ય આયોજન માટે સચોટ માહિતી આપો.',
    step4Footer: 'ઇમ્પેક્ટ-વેઇટેડ આરઓઆઈ',

    mapEyebrow: 'રીઅલ-ટાઇમ જાહેર ડેટા',
    mapHeading: 'જુઓ ભારતને શું જોઈએ છે',
    mapSubheading: 'સરકારી બજેટ અને નાગરિક જરૂરિયાતોનું લાઈવ જીઓ-ટેગ્ડ સંકલન.',
    allDemands: 'બધી માગો',
    roads: 'રસ્તાઓ',
    water: 'પીવાનું પાણી',
    healthcare: 'આરોગ્ય',
    education: 'શિક્ષણ',
    transport: 'પરિવહન',
    digital: 'ડિજિટલ',
    developmentDemand: 'વિકાસ માગ',
    panIndiaBreakdown: 'સમગ્ર ભારત વિગતો',
    highDemandDetected: 'એઆઈ દ્વારા શોધાયેલ ઉચ્ચ માગ ધરાવતો વિસ્તાર',
    highDemandDesc: '૩૭ પંચાયતોમાં પાણીની તીવ્ર સમસ્યા શોધીને જિલ્લા આયોજન સમિતિને સ્વચાલિત ચેતવણી મોકલી.',
    verifiedAadhaar: 'આધાર અને ડિજીલોકર દ્વારા પ્રમાણિત',
    viewDataSchema: 'ડેટા સ્કીમા જુઓ →',

    decisionEyebrow: 'નિર્ણય-સહાય આર્કિટેક્ચર',
    decisionHeading: 'હજારો અરજીઓમાંથી સ્પષ્ટ પ્રાથમિકતાઓ',
    decisionDesc: 'જનપ્રતિનિધિઓને અસંગઠિત કાગળિયાં ફેંદવાની જરૂર રહેશે નહીં.',
    decisionBullet1Title: 'વસ્તી વિષયક સંવેદનશીલતા',
    decisionBullet1Desc: 'વંચિત વિસ્તારોને પ્રાથમિકતા આપવા ગરીબી સૂચકાંકો સાથે સરખામણી.',
    decisionBullet2Title: 'મૂડી ખર્ચ (CapEx) જોડાણ',
    decisionBullet2Desc: 'નાગરિક જરૂરિયાતોને સીધા સરકારી બજેટ હેડ સાથે જોડે છે.',
    decisionBullet3Title: 'પારદર્શક ઓડિટ ટ્રેલ',
    decisionBullet3Desc: 'દરેક સ્કોર ઓડિટર્સ દ્વારા ચકાસી શકાય તેવો ખુલ્લો છે.',
    governanceWhitepaper: 'ગવર્નન્સ વ્હાઇટપેપર વાંચો',
    exploreIntelligence: 'વિશ્લેષણ જુઓ',

    inclusionEyebrow: 'સમાવેશક ડિઝાઇન',
    multilingualHeading1: 'ભારત ઘણી ભાષાઓ બોલે છે.',
    multilingualHeading2: 'જનસેતુ એઆઈ સાંભળે છે.',
    multilingualSubheading: 'ભારતની ભાષાકીય વિવિધતા માટે ખાસ ડિઝાઇન કરાયેલ.',
    voiceDemoTitle: 'ઇન્ટરેક્ટિવ વોઇસ ડેમો',
    bhashiniCompatible: 'ભાષિણી એઆઈ સુસંગત',
    tapToRecord: 'કોઈપણ બોલીમાં તમારી સમસ્યા જણાવવા ટેપ કરો',
    tapToSpeak: 'બોલવા માટે ટેપ કરો',
    listeningPrompt: '“સાંભળી રહ્યું છે... બોલો: ‘અમારા ગામમાં પ્રાથમિક આરોગ્ય કેન્દ્ર જોઈએ છે’”',

    scaleEyebrow: 'વ્યાપ અને પહોંચ',
    scaleHeading: 'નાગરિકો અને શાસનને જોડતી ટેકનોલોજી',
    scaleSubheading: 'ઓપન ડીપીઆઈ સિદ્ધાંતો પર આધારિત.',
    stat1Number: '૨૨+',
    stat1Label: 'ભાષાઓ',
    stat1Desc: 'ભારતના બંધારણની ૮મી અનુસૂચિની ભાષાઓમાં મૂળ વાચા પ્રક્રિયા.',
    stat2Number: '૧ પ્લેટફોર્મ',
    stat2Label: 'નાગરિક વિકાસ ઇન્ટેલિજન્સ',
    stat2Desc: 'ગામ, વોર્ડ, જિલ્લા અને રાજ્ય સ્તરની જરૂરિયાતોનું એકીકરણ.',
    stat3Number: '∞',
    stat3Label: 'સાંભળી શકાય તેવા અવાજ',
    stat3Desc: 'સ્માર્ટફોન, સાદા ફોન (IVR) અથવા સ્થાનિક કેન્દ્રો દ્વારા ઉપલબ્ધ.',

    ctaEyebrow: 'નાગરિક-પ્રથમ જાહેર આર્કિટેક્ચર',
    ctaHeading: 'તમારો અવાજ તમારા શહેરને બદલી શકે છે.',
    ctaSubheading: 'તમારા વિસ્તારની જરૂરિયાત રજૂ કરો. સામૂહિક અવાજને વિકાસમાં ફેરવો.',
    ctaPrimaryBtn: 'તમારી જરૂરિયાત નોંધાવો',
    ctaSecondaryBtn: 'પ્લેટફોર્મ જુઓ',
    ctaTrust1: 'કોઈ એપ ડાઉનલોડની જરૂર નથી',
    ctaTrust2: 'વ્હોટ્સએપ અને ટોલ-ફ્રી પર ઉપલબ્ધ',
    ctaTrust3: 'મફત અને ઓપન સોર્સ',

    modalTitle: 'સમુદાયની જરૂરિયાત રજૂ કરો',
    modalSub: 'કોઈપણ ભાષામાં જણાવો. એઆઈ નજીકના વિસ્તારોની જરૂરિયાત સાથે જોડી દેશે.',
    modalTabVoice: '🎤 વોઇસ ઇનપુટ',
    modalTabText: '⌨ ટેક્સ્ટ ફોર્મ',
    modalTabMessage: '💬 વ્હોટ્સએપ / એસએમએસ',
    modalCategoryLabel: 'વિકાસ શ્રેણી',
    modalLocationLabel: 'સ્થાન (રાજ્ય / જિલ્લો / ગામ)',
    modalLocationPlaceholder: 'દા.ત. જૂનાગઢ, કેશોદ, ગુજરાત (૩૬૨૨૨૦)',
    modalNeedLabel: 'જરૂરિયાત અથવા ફરિયાદનું વર્ણન કરો',
    modalNeedPlaceholder: 'રસ્તા, પાણી, શાળા કે આરોગ્ય વિષયક સમસ્યા તમારા પોતાના શબ્દોમાં લખો...',
    modalSubmitBtn: 'જનસેતુ એઆઈ નેટવર્ક પર સબમિટ કરો →',
    modalSuccessMsg: 'તમારો અવાજ સામૂહિક વિશ્લેષણમાં જોડાઈ ગયો છે.',
  },

  bn: {
    navHowItWorks: 'কীভাবে কাজ করে',
    navCitizenVoice: 'নাগরিক কণ্ঠস্বর',
    navInsights: 'অন্তর্দৃষ্টি',
    navPolicymakers: 'নীতি নির্ধারকদের জন্য',
    navAbout: 'সম্পর্কে',
    navGetStarted: 'শুরু করুন',
    navSubtag: 'এআই • নাগরিক • সুশাসন',

    heroEyebrow: 'ডিজিটাল পাবলিক ইনফ্রাস্ট্রাকচারের জন্য এআই',
    heroTitle1: 'আপনার কণ্ঠস্বর।',
    heroTitle2: 'উন্নত সিদ্ধান্ত।',
    heroTitle3: 'এক দূরদর্শী ভারত।',
    heroSubtitle1: 'জনসেতু এআই নাগরিকদের কণ্ঠস্বরকে কার্যকর উন্নয়নমূলক পদক্ষেপে রূপান্তরিত করে।',
    heroSubtitle2: 'আপনার নিজের ভাষায় বলুন, লিখুন বা বার্তা পাঠান। আমাদের এআই সমস্যা বুঝে সরকারের কাছে সঠিক অগ্রাধিকার তুলে ধরে।',
    heroCtaShare: 'আপনার প্রয়োজন জানান',
    heroCtaHowItWorks: 'কীভাবে কাজ করে দেখুন',
    heroStatLanguages: '২২+ ভারতীয়',
    heroStatLanguagesSub: 'ভাষা',
    heroStatInsights: 'নাগরিক-চালিত',
    heroStatInsightsSub: 'অন্তর্দৃষ্টি',
    heroStatPrioritization: 'এআই-ভিত্তিক',
    heroStatPrioritizationSub: 'অগ্রাধিকার',

    flowCitizenVoice: 'নাগরিক কণ্ঠস্বর',
    flowAiSynthesis: 'এআই বিশ্লেষণ',
    flowDemandHotspots: 'চাহিদা হটস্পট',
    flowDpiAction: 'ডিপিআই পদক্ষেপ',

    nluEngineLive: 'জনসেতু বহুভাষিক এনএলইউ ইঞ্জিন',
    nluEngineSub: '১৮টি রাজ্যে ৪২,৮৯০টি নাগরিক চাহিদার লাইভ একত্রীকরণ',
    topDetectedNeed: 'শীর্ষ চিহ্নিত প্রয়োজন',
    criticalPriority: 'জরুরি অগ্রাধিকার',
    drinkingWaterPipeline: 'বিশুদ্ধ পানীয় জল পাইপলাইন প্রকল্প',
    privacyNotice: 'গোপনীয়তা সংরক্ষিত ও উন্মুক্ত পাবলিক এপিআই',
    nationalStandard: 'জাতীয় তথ্য শাসন মানদণ্ড',

    pipelineEyebrow: 'ইন্টেলিজেন্স পাইপলাইন',
    pipelineHeading: 'জনগণের কণ্ঠস্বর থেকে বাস্তব পদক্ষেপ',
    pipelineSubheading: 'প্রতিটি নাগরিক অনুরোধ একটি অর্থপূর্ণ উন্নয়নে রূপ নেয়।',
    step1Title: 'আপনার ভাষায় বলুন',
    step1Desc: 'ভয়েস, মেসেজ বা টেক্সটের মাধ্যমে নিজের পছন্দের ভাষায় প্রয়োজন জানান।',
    step1Footer: 'ভয়েস, এসএমএস ও হোয়াটসঅ্যাপ',
    step2Title: 'এআই বোঝে',
    step2Desc: 'বহুভাষিক এআই নাগরিকদের বিচিত্র বার্তাকে সুবিন্যস্ত চাহিদায় রূপান্তর করে।',
    step2Footer: '২২টি ভাষা ও উপভাষা',
    step3Title: 'চাহিদা কেন্দ্র খুঁজুন',
    step3Desc: 'নাগরিক প্রতিক্রিয়ার সাথে জনসংখ্যাতাত্ত্বিক ও বাজেট তথ্য একত্রিত করুন।',
    step3Footer: 'ভৌগোলিক ক্লাস্টারিং',
    step4Title: 'উন্নয়ন অগ্রাধিকার দিন',
    step4Desc: 'নীতি নির্ধারকদের প্রমাণ-ভিত্তিক পরিকল্পনার সুযোগ করে দিন।',
    step4Footer: 'প্রভাব-ভিত্তিক আরওআই',

    mapEyebrow: 'রিয়েল-টাইম পাবলিক ডেটা',
    mapHeading: 'দেখুন ভারতের কী প্রয়োজন',
    mapSubheading: 'সরকারি উন্নয়ন পরিকল্পনার সাথে সংযুক্ত স্থানীয় চাহিদার সরাসরি মানচিত্র।',
    allDemands: 'সকল চাহিদা',
    roads: 'সড়ক',
    water: 'পানীয় জল',
    healthcare: 'স্বাস্থ্যসেবা',
    education: 'শিক্ষা',
    transport: 'পরিবহন',
    digital: 'ডিজিটাল',
    developmentDemand: 'উন্নয়ন চাহিদা',
    panIndiaBreakdown: 'সর্বভারতীয় হিসাব',
    highDemandDetected: 'এআই দ্বারা চিহ্নিত চরম চাহিদা অঞ্চল',
    highDemandDesc: 'এআই ৩৭টি সংলগ্ন গ্রাম পঞ্চায়েতে জলকষ্টের তীব্র সংকট শনাক্ত করে সংশ্লিষ্ট জেলা কমিটিকে স্বয়ংক্রিয় বার্তা পাঠিয়েছে।',
    verifiedAadhaar: 'আধার এবং ডিজিলকার দ্বারা যাচাইকৃত',
    viewDataSchema: 'ডেটা স্কিমা দেখুন →',

    decisionEyebrow: 'সিদ্ধান্ত-সহায়ক স্থাপত্য',
    decisionHeading: 'হাজারো আবেদন থেকে সুস্পষ্ট অগ্রাধিকার',
    decisionDesc: 'জনপ্রতিনিধি ও জেলাশাসকদের আর এলোমেলো কাগজের দরখাস্ত ঘাঁটতে হবে না।',
    decisionBullet1Title: 'জনসংখ্যা ও অনগ্রসরতা ম্যাপিং',
    decisionBullet1Desc: 'প্রান্তিক মানুষের সুরক্ষায় জনগণনা দারিদ্র্য সূচকের সাথে বিশ্লেষণ।',
    decisionBullet2Title: 'মূলধনী ব্যয় (CapEx) সামঞ্জস্য',
    decisionBullet2Desc: 'জনগণের চাহিদাকে সরাসরি কেন্দ্রীয় ও রাজ্য বাজেটের সাথে সংযুক্ত করে।',
    decisionBullet3Title: 'অপরিবর্তনীয় অডিট ট্রেইল',
    decisionBullet3Desc: 'প্রতিটি অগ্রাধিকার স্কোর নিরীক্ষকদের দ্বারা যাচাইযোগ্য ও স্বচ্ছ।',
    governanceWhitepaper: 'প্রশাসনীয় শ্বেতপত্র পড়ুন',
    exploreIntelligence: 'তথ্য দেখুন',

    inclusionEyebrow: 'অন্তর্ভুক্তিমূলক পরিকল্পনা',
    multilingualHeading1: 'ভারত বহু ভাষায় কথা বলে।',
    multilingualHeading2: 'জনসেতু এআই মন দিয়ে শোনে।',
    multilingualSubheading: 'ভারতের সমৃদ্ধ ভাষাগত বৈচিত্র্যের জন্য তৈরি।',
    voiceDemoTitle: 'ইন্টারেক্টিভ ভয়েস ডেমো',
    bhashiniCompatible: 'ভাষিণী এআই সমর্থিত',
    tapToRecord: 'যেকোনো উপভাষায় নিজের সমস্যা বলতে ট্যাপ করুন',
    tapToSpeak: 'বলতে ট্যাপ করুন',
    listeningPrompt: '“শুনছি... বলুন: ‘আমাদের গ্রামে একটি প্রাথমিক স্বাস্থ্য কেন্দ্র প্রয়োজন’”',

    scaleEyebrow: 'পরিধি ও বিস্তৃতি',
    scaleHeading: 'নাগরিক ও শাসন ব্যবস্থার মেলবন্ধন প্রযুক্তি',
    scaleSubheading: 'উন্মুক্ত ডিপিআই নীতির উপর প্রতিষ্ঠিত।',
    stat1Number: '২২+',
    stat1Label: 'ভাষা',
    stat1Desc: 'সংবিধানের অষ্টম তফসিলভুক্ত সকল ভারতীয় ভাষার জন্য সাবলীল সমর্থন।',
    stat2Number: '১ প্ল্যাটফর্ম',
    stat2Label: 'নাগরিক উন্নয়ন বুদ্ধিমত্তা',
    stat2Desc: 'গ্রাম, ওয়ার্ড, জেলা ও রাজ্য স্তরের সার্বিক অবকাঠামো চাহিদার মিলনস্থল।',
    stat3Number: '∞',
    stat3Label: 'শ্রবণযোগ্য কণ্ঠস্বর',
    stat3Desc: 'যেকোনো স্মার্টফোন, সাধারণ ফিচার ফোন বা স্থানীয় কিয়স্ক থেকে ব্যবহারযোগ্য।',

    ctaEyebrow: 'নাগরিক-প্রথম পাবলিক আর্কিটেকচার',
    ctaHeading: 'আপনার কণ্ঠস্বর আপনার অঞ্চলকে রূপ দিতে পারে।',
    ctaSubheading: 'আপনার এলাকার চাহিদা তুলে ধরুন। সম্মিলিত কণ্ঠস্বরকে উন্নয়নমূলক শক্তিতে রূপ দিন।',
    ctaPrimaryBtn: 'আপনার প্রয়োজন জানান',
    ctaSecondaryBtn: 'প্ল্যাটফর্ম অন্বেষণ করুন',
    ctaTrust1: 'অ্যাপ ডাউনলোডের প্রয়োজন নেই',
    ctaTrust2: 'হোয়াটসঅ্যাপ ও টোল-ফ্রি নম্বরে উপলব্ধ',
    ctaTrust3: 'সম্পূর্ণ বিনামূল্যে ও উন্মুক্ত মাধ্যম',

    modalTitle: 'আপনার এলাকার প্রয়োজন বা অভিযোগ জানান',
    modalSub: 'যেকোনো ভাষায় বলুন। এআই সংলগ্ন এলাকার চাহিদার সাথে সমন্বয় করবে।',
    modalTabVoice: '🎤 ভয়েস ইনপুট',
    modalTabText: '⌨ টেক্সট ফর্ম',
    modalTabMessage: '💬 হোয়াটসঅ্যাপ / এসএমএস',
    modalCategoryLabel: 'উন্নয়ন বিভাগ',
    modalLocationLabel: 'স্থান (রাজ্য / জেলা / ব্লক)',
    modalLocationPlaceholder: 'যেমন: বাঁকুড়া, পুরুলিয়া, পশ্চিমবঙ্গ (৭২২১৪০)',
    modalNeedLabel: 'প্রয়োজন বা সমস্যার বিবরণ দিন',
    modalNeedPlaceholder: 'রাস্তা, পানীয় জল, স্কুল বা স্বাস্থ্য সংক্রান্ত সমস্যা নিজের ভাষায় লিখুন...',
    modalSubmitBtn: 'জনসেতু এআই নেটওয়ার্কে জমা দিন →',
    modalSuccessMsg: 'আপনার কণ্ঠস্বর নাগরিক বুদ্ধিমত্তার মানচিত্রে যুক্ত হয়েছে।',
  },

  ta: {
    navHowItWorks: 'செயல்படும் விதம்',
    navCitizenVoice: 'மக்கள் குரல்',
    navInsights: 'நுண்ணறிவு',
    navPolicymakers: 'கொள்கை வகுப்பாளர்களுக்கு',
    navAbout: 'பற்றி',
    navGetStarted: 'தொடங்குங்கள்',
    navSubtag: 'ஏஐ • மக்கள் • நல்லாட்சி',

    heroEyebrow: 'டிஜிட்டல் பொது உள்கட்டமைப்புக்கான ஏஐ',
    heroTitle1: 'உங்கள் குரல்.',
    heroTitle2: 'சிறந்த முடிவுகள்.',
    heroTitle3: 'வளமான இந்தியா.',
    heroSubtitle1: 'ஜன்சேது ஏஐ மக்களின் குரல்களை நடைமுறைக்கு உகந்த வளர்ச்சித் திட்டங்களாக மாற்றுகிறது.',
    heroSubtitle2: 'உங்கள் தாய்மொழியில் பேசுங்கள், எழுதுங்கள் அல்லது குறுஞ்செய்தி அனுப்புங்கள். மக்களின் தேவைகளை உணர்ந்து அரசிற்கு முன்னுரிமைகளை வழிகாட்டுகிறது.',
    heroCtaShare: 'உங்கள் தேவையைப் பகிரவும்',
    heroCtaHowItWorks: 'எவ்வாறு செயல்படுகிறது எனப் பார்க்க',
    heroStatLanguages: '22+ இந்திய',
    heroStatLanguagesSub: 'மொழிகள்',
    heroStatInsights: 'மக்கள்-வழிகாட்டும்',
    heroStatInsightsSub: 'நுண்ணறிவு',
    heroStatPrioritization: 'ஏஐ-சார்ந்த',
    heroStatPrioritizationSub: 'முன்னுரிமை',

    flowCitizenVoice: 'மக்கள் குரல்',
    flowAiSynthesis: 'ஏஐ பகுப்பாய்வு',
    flowDemandHotspots: 'தேவை மையங்கள்',
    flowDpiAction: 'டிபிஐ நடவடிக்கை',

    nluEngineLive: 'ஜன்சேது பன்மொழி என்எல்யூ எஞ்சின்',
    nluEngineSub: '18 மாநிலங்களில் 42,890 மக்களின் தேவைகளை நேரடியாக ஒருங்கிணைக்கிறது',
    topDetectedNeed: 'முக்கிய தேவை',
    criticalPriority: 'அதிமுக்கிய முன்னுரிமை',
    drinkingWaterPipeline: 'குடிநீர் குழாய் விரிவாக்கத் திட்டம்',
    privacyNotice: 'தனியுரிமை பாதுகாப்பு & திறந்த பொது ஏபிஐ',
    nationalStandard: 'தேசிய தரவு ஆளுமை தரம்',

    pipelineEyebrow: 'நுண்ணறிவுப் பாதை',
    pipelineHeading: 'மக்கள் குரல் முதல் செயல்வடிவம் வரை',
    pipelineSubheading: 'ஒவ்வொரு வேண்டுகோளும் ஒரு பயனுள்ள வளர்ச்சித் திட்டமாக மாறுகிறது.',
    step1Title: 'உங்கள் மொழியில் பேசுங்கள்',
    step1Desc: 'குரல், எழுத்து அல்லது வாட்ஸ்அப் வழியாக உங்கள் விருப்பமான மொழியில் பதிவு செய்யுங்கள்.',
    step1Footer: 'குரல், எஸ்எம்எஸ் & வாட்ஸ்அப்',
    step2Title: 'ஏஐ புரிந்துகொள்கிறது',
    step2Desc: 'பன்மொழி ஏஐ மக்களின் குரல்களை முறையான வளர்ச்சித் தேவைகளாக மாற்றுகிறது.',
    step2Footer: '22 மொழிகள் + வட்டார வழக்குகள்',
    step3Title: 'தேவை மையங்களைக் கண்டறிதல்',
    step3Desc: 'மக்களின் கருத்துகளை மக்கள் தொகை மற்றும் உள்கட்டமைப்பு தரவுகளுடன் இணைத்தல்.',
    step3Footer: 'புவிசார் பகுப்பாய்வு',
    step4Title: 'வளர்ச்சி முன்னுரிமை',
    step4Desc: 'அதிகாரிகளுக்கு திட்டமிடலுக்கான ஆதாரப்பூர்வமான வழிகாட்டல்களை வழங்குகிறது.',
    step4Footer: 'தாக்க-மதிப்பீடு',

    mapEyebrow: 'நிகழ்நேர பொதுத் தரவு',
    mapHeading: 'இந்தியாவுக்கு என்ன தேவை என்பதைப் பாருங்கள்',
    mapSubheading: 'அரசு திட்டங்களுடன் இணைக்கப்பட்ட உள்ளூர் மக்களின் தேவைகளின் நேரலை வரைபடம்.',
    allDemands: 'அனைத்து தேவைகள்',
    roads: 'சாலைகள்',
    water: 'குடிநீர்',
    healthcare: 'மருத்துவம்',
    education: 'கல்வி',
    transport: 'போக்குவரத்து',
    digital: 'டிஜிட்டல்',
    developmentDemand: 'வளர்ச்சித் தேவை',
    panIndiaBreakdown: 'அகில இந்திய விவரம்',
    highDemandDetected: 'ஏஐ கண்டறிந்த அவசரத் தேவைப் பகுதி',
    highDemandDesc: '37 கிராம பஞ்சாயத்துகளில் குடிநீர் பற்றாக்குறையைக் கண்டறிந்து மாவட்டக் குழுவுக்கு உடனடி எச்சரிக்கை அனுப்பப்பட்டுள்ளது.',
    verifiedAadhaar: 'ஆதார் & டிஜிலாக்கர் மூலம் சரிபார்க்கப்பட்டது',
    viewDataSchema: 'தரவு வடிவம் காண்க →',

    decisionEyebrow: 'முடிவெடுக்கும் கட்டமைப்பு',
    decisionHeading: 'ஆயிரக்கணக்கான மனுக்களிலிருந்து தெளிவான முன்னுரிமைகள்',
    decisionDesc: 'அரசு அதிகாரிகளும் மக்கள் பிரதிநிதிகளும் காகித மனுக்களைத் தேட வேண்டிய அவசியமில்லை.',
    decisionBullet1Title: 'மக்கள்தொகை மற்றும் நலிந்தோர் வரைபடம்',
    decisionBullet1Desc: 'விளிம்புநிலை மக்களைப் பாதுகாக்க வறுமைக் குறியீடுகளுடன் ஒப்பீடு.',
    decisionBullet2Title: 'மூலதனச் செலவு (CapEx) ஒருங்கிணைப்பு',
    decisionBullet2Desc: 'மக்களின் தேவைகளை நேரடியாக அரசு நிதி ஒதுக்கீட்டுடன் இணைக்கிறது.',
    decisionBullet3Title: 'வெளிப்படையான தணிக்கை ஆவணம்',
    decisionBullet3Desc: 'ஒவ்வொரு முன்னுரிமைப் புள்ளியும் தணிக்கையாளர்களால் சரிபார்க்கக்கூடியது.',
    governanceWhitepaper: 'வெள்ளை அறிக்கை வாசிக்க',
    exploreIntelligence: 'தரவுகளைப் பார்க்க',

    inclusionEyebrow: 'அனைவரையும் உள்ளடக்கிய வடிவமைப்பு',
    multilingualHeading1: 'இந்தியா பல மொழிகளில் பேசுகிறது.',
    multilingualHeading2: 'ஜன்சேது ஏஐ கேட்கிறது.',
    multilingualSubheading: 'இந்தியாவின் மொழி பன்முகத்தன்மைக்காக உருவாக்கப்பட்டது.',
    voiceDemoTitle: 'நேரடி குரல் செயல்முறை',
    bhashiniCompatible: 'பாஷிணி ஏஐ இணக்கமானது',
    tapToRecord: 'உங்கள் ஊரின் தேவையைப் பேச தட்டவும்',
    tapToSpeak: 'பேச தட்டவும்',
    listeningPrompt: '“கேட்கிறது... சொல்லுங்கள்: ‘எங்கள் ஊருக்கு ஆரம்ப சுகாதார நிலையம் வேண்டும்’”',

    scaleEyebrow: 'பரப்பளவு மற்றும் எல்லை',
    scaleHeading: 'மக்களையும் அரசையும் இணைக்கும் தொழில்நுட்பம்',
    scaleSubheading: 'திறந்த பொது உள்கட்டமைப்பு கொள்கைகளின் அடிப்படையில் உருவானது.',
    stat1Number: '22+',
    stat1Label: 'மொழிகள்',
    stat1Desc: 'எட்டாவது அட்டவணை இந்திய மொழிகளில் தடையற்ற குரல் மற்றும் உரை செயலாக்கம்.',
    stat2Number: '1 தளம்',
    stat2Label: 'மக்கள் வளர்ச்சி நுண்ணறிவு',
    stat2Desc: 'கிராமம், வார்டு, மாவட்டம் மற்றும் மாநில அளவிலான தேவைகளின் சங்கமம்.',
    stat3Number: '∞',
    stat3Label: 'கேட்கப்படும் குரல்கள்',
    stat3Desc: 'ஸ்மார்ட்போன், சாதாரண கைபேசி (IVR) மூலம் எவரும் எளிதில் பயன்படுத்தலாம்.',

    ctaEyebrow: 'மக்கள்-முதன்மை கட்டமைப்பு',
    ctaHeading: 'உங்கள் குரல் உங்கள் ஊரை மாற்றும்.',
    ctaSubheading: 'உங்கள் சமூகத்தின் தேவையைப் பதிவு செய்யுங்கள். ஏஐ அதை வளர்ச்சிக்கான ஆற்றலாக மாற்றும்.',
    ctaPrimaryBtn: 'உங்கள் தேவையைப் பகிரவும்',
    ctaSecondaryBtn: 'தளத்தைக் காண',
    ctaTrust1: 'செயலி தரவிறக்கம் தேவையில்லை',
    ctaTrust2: 'வாட்ஸ்அப் மற்றும் கட்டணமில்லா தொலைபேசியில் இயங்கும்',
    ctaTrust3: 'இலவச & திறந்த மூல மென்பொருள்',

    modalTitle: 'உங்கள் ஊரின் தேவையை பதிவு செய்யுங்கள்',
    modalSub: 'எந்த மொழியிலும் பகிருங்கள். ஏஐ அதை அருகிலுள்ள தேவைகளுடன் ஒருங்கிணைக்கும்.',
    modalTabVoice: '🎤 குரல் பதிவு',
    modalTabText: '⌨ உரை படிவம்',
    modalTabMessage: '💬 வாட்ஸ்அப் / எஸ்எம்எஸ்',
    modalCategoryLabel: 'வளர்ச்சிப் பிரிவு',
    modalLocationLabel: 'இடம் (மாநிலம் / மாவட்டம் / கிராமம்)',
    modalLocationPlaceholder: 'எ.கா: மதுரை, திருமங்கலம், தமிழ்நாடு (625706)',
    modalNeedLabel: 'தேவை அல்லது குறையை விளக்கவும்',
    modalNeedPlaceholder: 'சாலை, குடிநீர், பள்ளி அல்லது சுகாதாரம் தொடர்பான தேவையை உங்கள் வார்த்தைகளில் விளக்குங்கள்...',
    modalSubmitBtn: 'ஜன்சேது ஏஐ நெட்வொர்க்கில் சமர்ப்பிக்கவும் →',
    modalSuccessMsg: 'உங்கள் குரல் மக்கள் நுண்ணறிவுத் தளத்தில் வெற்றிகரமாக இணைக்கப்பட்டது.',
  },

  te: {
    navHowItWorks: 'ఎలా పనిచేస్తుంది',
    navCitizenVoice: 'ప్రజా వాణి',
    navInsights: 'విశ్లేషణలు',
    navPolicymakers: 'విధాన నిర్ణేతలకు',
    navAbout: 'గురించి',
    navGetStarted: 'ప్రారంభించండి',
    navSubtag: 'ఏఐ • పౌరులు • సుపరిపాలన',

    heroEyebrow: 'డిజిటల్ పబ్లిక్ ఇన్‌ఫ్రాస్ట్రక్చర్ కోసం ఏఐ',
    heroTitle1: 'మీ గొంతు.',
    heroTitle2: 'మెరుగైన నిర్ణయాలు.',
    heroTitle3: 'ఒక స్మార్ట్ భారత్.',
    heroSubtitle1: 'జనసేతు ఏఐ ప్రజల గొంతును సమగ్ర అభివృద్ధి ప్రాధాన్యతలుగా మారుస్తుంది.',
    heroSubtitle2: 'మీ సొంత భాషలో మాట్లాడండి, రాయండి లేదా సందేశం పంపండి. ప్రజల అవసరాలను ఏఐ విశ్లేషించి ప్రభుత్వానికి దిశానిర్దేశం చేస్తుంది.',
    heroCtaShare: 'మీ అవసరాన్ని పంచుకోండి',
    heroCtaHowItWorks: 'ఎలా పనిచేస్తుందో చూడండి',
    heroStatLanguages: '22+ భారతీయ',
    heroStatLanguagesSub: 'భాషలు',
    heroStatInsights: 'ప్రజల-నడిపించే',
    heroStatInsightsSub: 'విశ్లేషణ',
    heroStatPrioritization: 'ఏఐ-ఆధారిత',
    heroStatPrioritizationSub: 'ప్రాధాన్యత',

    flowCitizenVoice: 'ప్రజా వాణి',
    flowAiSynthesis: 'ఏఐ విశ్లేషణ',
    flowDemandHotspots: 'డిమాండ్ హాట్‌స్పాట్లు',
    flowDpiAction: 'డీపీఐ కార్యాచరణ',

    nluEngineLive: 'జనసేతు బహుభాషా ఎన్ఎల్‌యూ ఇంజిన్',
    nluEngineSub: '18 రాష్ట్రాల్లో 42,890 ప్రజల విన్నపాల ప్రత్యక్ష సమీకరణ',
    topDetectedNeed: 'ప్రధాన అవసరం',
    criticalPriority: 'అత్యవసర ప్రాధాన్యత',
    drinkingWaterPipeline: 'తాగునీటి పైప్‌లైన్ విస్తరణ ప్రాజెక్టు',
    privacyNotice: 'గోప్యత సంరక్షణ & పబ్లిక్ ఓపెన్ ఏపీఐ',
    nationalStandard: 'జాతీయ డేటా పాలనా ప్రమాణాలు',

    pipelineEyebrow: 'ఇంటెలిజెన్స్ పైప్‌లైన్',
    pipelineHeading: 'ప్రజా గొంతు నుండి కార్యాచరణ వరకు',
    pipelineSubheading: 'ప్రతి విన్నపం ఒక అర్థవంతమైన అభివృద్ధి సూచికగా మారుతుంది.',
    step1Title: 'మీ భాషలో మాట్లాడండి',
    step1Desc: 'వాయిస్, టెక్స్ట్ లేదా వాట్సాప్ ద్వారా మీకు నచ్చిన భాషలో సమస్యను తెలపండి.',
    step1Footer: 'వాయిస్, ఎస్ఎంఎస్ & వాట్సాప్',
    step2Title: 'ఏఐ గ్రహిస్తుంది',
    step2Desc: 'విభిన్న ప్రజల మాటలను క్రమబద్ధమైన అభివృద్ధి అవసరాలుగా ఏఐ మారుస్తుంది.',
    step2Footer: '22 భాషలు + యాసలు',
    step3Title: 'డిమాండ్ కేంద్రాల గుర్తింపు',
    step3Desc: 'ప్రజల ఫీడ్‌బ్యాక్‌ను జనాభా మరియు ప్రభుత్వ నిధుల డేటాతో జోడిస్తుంది.',
    step3Footer: 'జియోస్పేషియల్ క్లస్టరింగ్',
    step4Title: 'అభివృద్ధి ప్రాధాన్యతలు',
    step4Desc: 'ప్రభుత్వ అధికారులకు సమర్థవంతమైన ప్రణాళిక కోసం సాక్ష్యాధారాలను అందిస్తుంది.',
    step4Footer: 'ప్రభావ-ఆధారిత ఆర్‌ఓఐ',

    mapEyebrow: 'రియల్-టైమ్ పబ్లిక్ డేటా',
    mapHeading: 'భారతదేశానికి ఏం కావాలో చూడండి',
    mapSubheading: 'ప్రభుత్వ బడ్జెట్ మరియు ప్రజల స్థానిక ప్రాధాన్యతల ప్రత్యక్ష మ్యాపింగ్.',
    allDemands: 'అన్ని అవసరాలు',
    roads: 'రోడ్లు',
    water: 'తాగునీరు',
    healthcare: 'వైద్యం',
    education: 'విద్య',
    transport: 'రవాణా',
    digital: 'డిజిటల్',
    developmentDemand: 'అభివృద్ధి డిమాండ్',
    panIndiaBreakdown: 'అఖిల భారత వివరణ',
    highDemandDetected: 'ఏఐ గుర్తించిన అత్యవసర ప్రాంతం',
    highDemandDesc: '37 గ్రామ పంచాయతీలలో తీవ్ర తాగునీటి ఎద్దడిని ఏఐ గుర్తించి జిల్లా ప్రణాళికా కమిటీకి వెంటనే అలర్ట్ పంపింది.',
    verifiedAadhaar: 'ఆధార్ & డిజిలాకర్ ద్వారా ధృవీకరించబడింది',
    viewDataSchema: 'డేటా స్కీమా చూడండి →',

    decisionEyebrow: 'నిర్ణయ-సహాయ నిర్మాణం',
    decisionHeading: 'వేలాది దరఖాస్తుల నుండి స్పష్టమైన ప్రాధాన్యతలకు',
    decisionDesc: 'ప్రజాప్రతినిధులు, కలెక్టర్లు కాగితాల కుప్పలను వెతకాల్సిన అవసరం లేదు.',
    decisionBullet1Title: 'జనాభా మరియు బలహీన వర్గాల మ్యాపింగ్',
    decisionBullet1Desc: 'పేదరిక సూచికలతో పోల్చి వెనుకబడిన ప్రాంతాలకు న్యాయం చేకూరుస్తుంది.',
    decisionBullet2Title: 'మూలధన వ్యయం (CapEx) సమన్వయం',
    decisionBullet2Desc: 'ప్రజల ప్రాధాన్యతలను నేరుగా ప్రభుత్వ బడ్జెట్ పథకాలతో అనుసంధానిస్తుంది.',
    decisionBullet3Title: 'పారదర్శక ఆడిట్ రికార్డు',
    decisionBullet3Desc: 'ప్రతి ప్రాధాన్యతా స్కోరు పరిశీలించదగినది మరియు జవాబుదారీతనంతో కూడినది.',
    governanceWhitepaper: 'పరిపాలన శ్వేతపత్రం చదవండి',
    exploreIntelligence: 'డేటాను చూడండి',

    inclusionEyebrow: 'సమగ్ర రూపకల్పన',
    multilingualHeading1: 'భారతదేశం ఎన్నో భాషలు మాట్లాడుతుంది.',
    multilingualHeading2: 'జనసేతు ఏఐ వింటుంది.',
    multilingualSubheading: 'భారతదేశ భాషా వైవిధ్యం కోసం ప్రత్యేకంగా రూపొందించబడింది.',
    voiceDemoTitle: 'ఇంటరాక్టివ్ వాయిస్ డెమో',
    bhashiniCompatible: 'భాషిణి ఏఐ అనుకూలమైనది',
    tapToRecord: 'ఏ మాండలికంలోనైనా సమస్య చెప్పడానికి ట్యాప్ చేయండి',
    tapToSpeak: 'మాట్లాడటానికి ట్యాప్ చేయండి',
    listeningPrompt: '“వింటోంది... చెప్పండి: ‘మా ఊరికి ప్రాథమిక ఆరోగ్య కేంద్రం కావాలి’”',

    scaleEyebrow: 'పరిధి మరియు విస్తృతి',
    scaleHeading: 'ప్రజలను మరియు పాలనను కలిపే సాంకేతికత',
    scaleSubheading: 'ఓపెన్ డిజిటల్ పబ్లిక్ ఇన్‌ఫ్రాస్ట్రక్చర్ సూత్రాలపై నిర్మించబడింది.',
    stat1Number: '22+',
    stat1Label: 'భాషలు',
    stat1Desc: 'రాజ్యాంగంలోని 8వ షెడ్యూల్ భాషల్లో స్వచ్ఛమైన వాయిస్ మరియు స్క్రిప్ట్ ప్రాసెసింగ్.',
    stat2Number: '1 వేదిక',
    stat2Label: 'ప్రజా అభివృద్ధి విజ్ఞానం',
    stat2Desc: 'గ్రామ, వార్డు, జిల్లా మరియు రాష్ట్ర స్థాయి మౌలిక అవసరాల ఏకీకరణ.',
    stat3Number: '∞',
    stat3Label: 'వినబడే గొంతులు',
    stat3Desc: 'స్మార్ట్‌ఫోన్, సాధారణ ఫోన్ (IVR) ద్వారా ఎవరైనా సులభంగా ఉపయోగించవచ్చు.',

    ctaEyebrow: 'పౌర-ప్రథమ నిర్మాణం',
    ctaHeading: 'మీ గొంతు మీ ఊరి భవిష్యత్తును తీర్చిదిద్దగలదు.',
    ctaSubheading: 'మీ సమాజానికి ఏం కావాలో పంచుకోండి. సమిష్టి స్వరాన్ని అభివృద్ధిగా మార్చండి.',
    ctaPrimaryBtn: 'మీ అవసరాన్ని పంచుకోండి',
    ctaSecondaryBtn: 'వేదికను అన్వేషించండి',
    ctaTrust1: 'యాప్ డౌన్‌లోడ్ అవసరం లేదు',
    ctaTrust2: 'వాట్సాప్ & టోల్-ఫ్రీలో అందుబాటులో ఉంది',
    ctaTrust3: 'ఉచిత & ఓపెన్ సోర్స్',

    modalTitle: 'మీ ప్రాంత సమస్య లేదా అవసరాన్ని పంచుకోండి',
    modalSub: 'ఏ భాషలోనైనా తెలియజేయండి. ఏఐ సమీప అవసరాలతో సమన్వయం చేస్తుంది.',
    modalTabVoice: '🎤 వాయిస్ ఇన్‌పుట్',
    modalTabText: '⌨ టెక్స్ట్ ఫారమ్',
    modalTabMessage: '💬 వాట్సాప్ / ఎస్ఎంఎస్',
    modalCategoryLabel: 'అభివృద్ధి విభాగం',
    modalLocationLabel: 'ప్రాంతం (రాష్ట్రం / జిల్లా / మండలం)',
    modalLocationPlaceholder: 'ఉదా: వరంగల్, వర్ధన్నపేట, తెలంగాణ (506313)',
    modalNeedLabel: 'సమస్య లేదా అవసరాన్ని వివరించండి',
    modalNeedPlaceholder: 'రోడ్డు, తాగునీరు, పాఠశాల లేదా వైద్య సమస్యను మీ మాటల్లో రాయండి...',
    modalSubmitBtn: 'జనసేతు ఏఐ నెట్‌వర్క్‌కు సమర్పించండి →',
    modalSuccessMsg: 'మీ గొంతు ప్రజా విశ్లేషణ వేదికలో విజయవంతంగా చేర్చబడింది.',
  },
};
