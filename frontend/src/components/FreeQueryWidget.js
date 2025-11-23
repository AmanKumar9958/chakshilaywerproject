import React, { useState, useRef, useEffect } from "react";

const FreeQueryWidget = () => {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("english");
  const [remainingQueries, setRemainingQueries] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [queryHistory, setQueryHistory] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const [animateStats, setAnimateStats] = useState(false);
  const [copied, setCopied] = useState(false);
  const [queryStartTime, setQueryStartTime] = useState(null);
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const textareaRef = useRef(null);
  const responseRef = useRef(null);

  // Language configurations
  const languages = [
    { id: 'english', name: 'English', flag: '🇺🇸' },
    { id: 'hindi', name: 'हिंदी', flag: '🇮🇳' },
    { id: 'tamil', name: 'தமிழ்', flag: '🇮🇳' },
    { id: 'bengali', name: 'বাংলা', flag: '🇮🇳' },
    { id: 'gujarati', name: 'ગુજરાતી', flag: '🇮🇳' },
    { id: 'marathi', name: 'मराठी', flag: '🇮🇳' },
    { id: 'punjabi', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { id: 'telugu', name: 'తెలుగు', flag: '🇮🇳' }
  ];

  const getCurrentLanguage = () => languages.find(lang => lang.id === language) || languages[0];

  // Translation configurations
  const translations = {
    english: {
      queryLabel: "Describe Your Legal Issue",
      queryPlaceholder: "Describe your legal issue in detail in English...\n\nExample: \"My landlord has not returned my security deposit of ₹50,000 even though I vacated the property 45 days ago and left it in good condition.\"",
      submitButton: "Get Expert Legal Analysis",
      analyzing: "Analyzing your legal question...",
      responseTitle: "Legal Analysis Result",
      popularQuestions: "Popular Legal Questions",
      filterByCategory: "Filter by Category:",
      sortBy: "Sort by:",
      platformTitle: "Legal Intelligence Platform",
      platformDescription: "Advanced AI-powered legal consultation system providing instant access to",
      comprehensiveAnalysis: "comprehensive legal analysis",
      precedentResearch: "precedent research, and expert guidance for complex legal matters.",
      legalPrecedents: "Legal Precedents",
      databaseCoverage: "Database Coverage",
      accuracyRate: "Accuracy Rate",
      expertValidated: "Expert Validated",
      responseTime: "Response Time",
      lightningFast: "Lightning Fast",
      legalExperts: "Legal Experts",
      networkAccess: "Network Access",
      premiumConsultations: "Premium Consultations Available",
      complimentary: "complimentary",
      expertAnalysesRemaining: "expert legal analyses remaining today",
      analysisComplete: "Comprehensive Legal Analysis Complete",
      consultationsExhausted: "Free Consultations Exhausted",
      upgradeMessage: "Upgrade to",
      upgradeFeatures: "for unlimited legal consultations, advanced case analysis, and premium research features.",
      upgradeButton: "Upgrade to Pro - ₹2,999/month"
    },
    hindi: {
      queryLabel: "अपनी कानूनी समस्या बताएं",
      queryPlaceholder: "अपनी कानूनी समस्या को हिंदी में विस्तार से बताएं...\n\nउदाहरण: \"मेरे मकान मालिक ने मेरी सिक्योरिटी डिपॉजिट ₹50,000 वापस नहीं की है, भले ही मैंने 45 दिन पहले संपत्ति खाली कर दी थी और इसे अच्छी स्थिति में छोड़ा था।\"",
      submitButton: "विशेषज्ञ कानूनी विश्लेषण प्राप्त करें",
      analyzing: "आपके कानूनी प्रश्न का विश्लेषण किया जा रहा है...",
      responseTitle: "कानूनी विश्लेषण परिणाम",
      popularQuestions: "लोकप्रिय कानूनी प्रश्न",
      filterByCategory: "श्रेणी के अनुसार फिल्टर करें:",
      sortBy: "क्रमबद्ध करें:",
      platformTitle: "कानूनी बुद्धिमत्ता प्लेटफॉर्म",
      platformDescription: "उन्नत AI-संचालित कानूनी परामर्श प्रणाली जो तत्काल पहुंच प्रदान करती है",
      comprehensiveAnalysis: "व्यापक कानूनी विश्लेषण",
      precedentResearch: "पूर्व निर्णय अनुसंधान, और जटिल कानूनी मामलों के लिए विशेषज्ञ मार्गदर्शन।",
      legalPrecedents: "कानूनी पूर्व निर्णय",
      databaseCoverage: "डेटाबेस कवरेज",
      accuracyRate: "सटीकता दर",
      expertValidated: "विशेषज्ञ सत्यापित",
      responseTime: "प्रतिक्रिया समय",
      lightningFast: "बिजली की तेजी",
      legalExperts: "कानूनी विशेषज्ञ",
      networkAccess: "नेटवर्क पहुंच",
      premiumConsultations: "प्रीमियम परामर्श उपलब्ध",
      complimentary: "निःशुल्क",
      expertAnalysesRemaining: "विशेषज्ञ कानूनी विश्लेषण आज शेष हैं",
      analysisComplete: "व्यापक कानूनी विश्लेषण पूर्ण",
      consultationsExhausted: "निःशुल्क परामर्श समाप्त",
      upgradeMessage: "अपग्रेड करें",
      upgradeFeatures: "असीमित कानूनी परामर्श, उन्नत केस विश्लेषण, और प्रीमियम अनुसंधान सुविधाओं के लिए।",
      upgradeButton: "प्रो में अपग्रेड करें - ₹2,999/माह"
    },
    tamil: {
      queryLabel: "உங்கள் சட்ட பிரச்சினையை விவரிக்கவும்",
      queryPlaceholder: "உங்கள் சட்ட பிரச்சினையை தமிழில் விரிவாக விவரிக்கவும்...\n\nஎடுத்துக்காட்டு: \"நான் 45 நாட்களுக்கு முன்பு வீட்டை விட்டு வெளியேறி அதை நல்ல நிலையில் விட்டுச் சென்றிருந்தாலும், என் வீட்டு உரிமையாளர் எனது பாதுகாப்பு வைப்புத்தொகை ₹50,000 திரும்பக் கொடுக்கவில்லை.\"",
      submitButton: "நிபுணர் சட்ட பகுப்பாய்வு பெறுங்கள்",
      analyzing: "உங்கள் சட்ட கேள்வியை பகுப்பாய்வு செய்கிறது...",
      responseTitle: "சட்ட பகுப்பாய்வு முடிவு",
      popularQuestions: "பிரபலமான சட்ட கேள்விகள்",
      filterByCategory: "வகை மூலம் வடிகட்டவும்:",
      sortBy: "வரிசைப்படுத்து:",
      platformTitle: "சட்ட புத்திசாலித்தனம் தளம்",
      platformDescription: "மேம்பட்ட AI-இயங்கும் சட்ட ஆலோசனை அமைப்பு உடனடி அணுகலை வழங்குகிறது",
      comprehensiveAnalysis: "விரிவான சட்ட பகுப்பாய்வு",
      precedentResearch: "முன்னுதாரண ஆராய்ச்சி, மற்றும் சிக்கலான சட்ட விஷயங்களுக்கு நிபுணர் வழிகாட்டுதல்।",
      legalPrecedents: "சட்ட முன்னுதாரணங்கள்",
      databaseCoverage: "தரவுத்தள கவரேஜ்",
      accuracyRate: "துல்லிய விகிதம்",
      expertValidated: "நிபுணர் சரிபார்க்கப்பட்டது",
      responseTime: "பதில் நேரம்",
      lightningFast: "மின்னல் வேகம்",
      legalExperts: "சட்ட நிபுணர்கள்",
      networkAccess: "நெட்வொர்க் அணுகல்",
      premiumConsultations: "பிரீமியம் ஆலோசனைகள் கிடைக்கின்றன",
      complimentary: "இலவச",
      expertAnalysesRemaining: "நிபுணர் சட்ட பகுப்பாய்வுகள் இன்று மீதமுள்ளன",
      analysisComplete: "விரிவான சட்ட பகுப்பாய்வு முடிந்தது",
      consultationsExhausted: "இலவச ஆலோசனைகள் தீர்ந்தன",
      upgradeMessage: "மேம்படுத்து",
      upgradeFeatures: "வரம்பற்ற சட்ட ஆலோசனைகள், மேம்பட்ட வழக்கு பகுப்பாய்வு மற்றும் பிரீமியம் ஆராய்ச்சி அம்சங்களுக்காக।",
      upgradeButton: "ப்ரோவுக்கு மேம்படுத்து - ₹2,999/மாதம்"
    },
    bengali: {
      queryLabel: "আপনার আইনি সমস্যা বর্ণনা করুন",
      queryPlaceholder: "বাংলায় আপনার আইনি সমস্যার বিস্তারিত বর্ণনা দিন...\n\nউদাহরণ: \"আমার বাড়িওয়ালা আমার সিকিউরিটি ডিপোজিট ₹50,000 ফেরত দিচ্ছেন না, যদিও আমি ৪৫ দিন আগে সম্পত্তি খালি করেছি এবং এটিকে ভালো অবস্থায় রেখে এসেছি।\"",
      submitButton: "বিশেষজ্ঞ আইনি বিশ্লেষণ পান",
      analyzing: "আপনার আইনি প্রশ্ন বিশ্লেষণ করা হচ্ছে...",
      responseTitle: "আইনি বিশ্লেষণ ফলাফল",
      popularQuestions: "জনপ্রিয় আইনি প্রশ্ন",
      filterByCategory: "বিভাগ অনুসারে ফিল্টার করুন:",
      sortBy: "সাজান:",
      platformTitle: "আইনি বুদ্ধিমত্তা প্ল্যাটফর্ম",
      platformDescription: "উন্নত AI-চালিত আইনি পরামর্শ সিস্টেম যা তাৎক্ষণিক অ্যাক্সেস প্রদান করে",
      comprehensiveAnalysis: "ব্যাপক আইনি বিশ্লেষণ",
      precedentResearch: "পূর্ব নিদেণ অনুসন্ধান, এবং জটিল আইনি বিষয়ের জন্য বিশেষজ্ঞ নির্দেশনা।",
      legalPrecedents: "আইনি পূর্ব নিদেণ",
      databaseCoverage: "ডেটাবেস কভারেজ",
      accuracyRate: "নির্ভুলতার হার",
      expertValidated: "বিশেষজ্ঞ যাচাইকৃত",
      responseTime: "প্রতিক্রিয়ার সময়",
      lightningFast: "বিদ্যুৎ গতি",
      legalExperts: "আইনি বিশেষজ্ঞ",
      networkAccess: "নেটওয়ার্ক অ্যাক্সেস",
      premiumConsultations: "প্রিমিয়াম পরামর্শ উপলব্ধ",
      complimentary: "বিনামূল্যে",
      expertAnalysesRemaining: "বিশেষজ্ঞ আইনি বিশ্লেষণ আজ বাকি",
      analysisComplete: "ব্যাপক আইনি বিশ্লেষণ সম্পূর্ণ",
      consultationsExhausted: "বিনামূল্যে পরামর্শ শেষ",
      upgradeMessage: "আপগ্রেড করুন",
      upgradeFeatures: "সীমাহীন আইনি পরামর্শ, উন্নত কেস বিশ্লেষণ, এবং প্রিমিয়াম গবেষণা বৈশিষ্ট্যের জন্য।",
      upgradeButton: "প্রো তে আপগ্রেড করুন - ₹২,৯৯৯/মাস"
    },
    gujarati: {
      queryLabel: "તમારી કાનૂની સમસ્યા વર્ણવો",
      queryPlaceholder: "ગુજરાતીમાં તમારી કાનૂની સમસ્યાનો વિગતવાર વર્ણન કરો...\n\nઉદાહરણ: \"મારો લૉન્ડલોર્ડ મારી સિક્યોરિટી ડિપોઝિટ ₹50,000 પાછી નથી આપતો, ભલે મેં 45 દિવસ પહેલાં પ્રોપર્ટી ખાલી કરી હતી અને તેને સારી સ્થિતિમાં છોડી હતી.\"",
      submitButton: "નિષ્ણાત કાનૂની વિશ્લેષણ મેળવો",
      analyzing: "તમારા કાનૂની પ્રશ્નનું વિશ્લેષણ કરવામાં આવી રહ્યું છે...",
      responseTitle: "કાનૂની વિશ્લેષણ પરિણામ",
      popularQuestions: "લોકપ્રિય કાનૂની પ્રશ્નો",
      filterByCategory: "શ્રેણી દ્વારા ફિલ્ટર કરો:",
      sortBy: "ક્રમમાં ગોઠવો:",
      platformTitle: "કાનૂની બુદ્ધિમત્તા પ્લેટફોર્મ",
      platformDescription: "ઉન્નત AI-સંચાલિત કાનૂની સલાહ સિસ્ટમ જે તાત્કાલિક પહોંચ પ્રદાન કરે છે",
      comprehensiveAnalysis: "વ્યાપક કાનૂની વિશ્લેષણ",
      precedentResearch: "પૂર્વનિર્ણય સંશોધન, અને જટિલ કાનૂની બાબતો માટે નિષ્ણાત માર્ગદર્શન.",
      legalPrecedents: "કાનૂની પૂર્વનિર્ણયો",
      databaseCoverage: "ડેટાબેસ કવરેજ",
      accuracyRate: "ચોકસાઈ દર",
      expertValidated: "નિષ્ણાત ચકાસેલ",
      responseTime: "પ્રતિક્રિયા સમય",
      lightningFast: "વીજળીની ઝડપ",
      legalExperts: "કાનૂની નિષ્ણાતો",
      networkAccess: "નેટવર્ક પહોંચ",
      premiumConsultations: "પ્રીમિયમ સલાહ ઉપલબ્ધ",
      complimentary: "મફત",
      expertAnalysesRemaining: "નિષ્ણાત કાનૂની વિશ્લેષણ આજે બાકી",
      analysisComplete: "વ્યાપક કાનૂની વિશ્લેષણ પૂર્ણ",
      consultationsExhausted: "મફત સલાહ સમાપ્ત",
      upgradeMessage: "અપગ્રેડ કરો",
      upgradeFeatures: "અમર્યાદિત કાનૂની સલાહ, ઉન્નત કેસ વિશ્લેષણ, અને પ્રીમિયમ સંશોધન સુવિધાઓ માટે.",
      upgradeButton: "પ્રો માં અપગ્રેડ કરો - ₹2,999/મહિનો"
    },
    marathi: {
      queryLabel: "तुमची कायदेशीर समस्या वर्णन करा",
      queryPlaceholder: "मराठीत तुमच्या कायदेशीर समस्येचे तपशीलवार वर्णन करा...\n\nउदाहरण: \"माझा मालक माझी सिक्युरिटी डिपॉझिट ₹50,000 परत देत नाही, जरी मी 45 दिवसांपूर्वी प्रॉपर्टी रिकामी केली आणि ती चांगल्या स्थितीत सोडली.\"",
      submitButton: "तज्ञ कायदेशीर विश्लेषण मिळवा",
      analyzing: "तुमच्या कायदेशीर प्रश्नाचे विश्लेषण केले जात आहे...",
      responseTitle: "कायदेशीर विश्लेषण परिणाम",
      popularQuestions: "लोकप्रिय कायदेशीर प्रश्न",
      filterByCategory: "श्रेणीनुसार फिल्टर करा:",
      sortBy: "क्रमवारी लावा:",
      platformTitle: "कायदेशीर बुद्धिमत्ता प्लॅटफॉर्म",
      platformDescription: "प्रगत AI-चालित कायदेशीर सल्ला प्रणाली जी तत्काळ प्रवेश प्रदान करते",
      comprehensiveAnalysis: "व्यापक कायदेशीर विश्लेषण",
      precedentResearch: "पूर्व निर्णय संशोधन, आणि जटिल कायदेशीर बाबींसाठी तज्ञ मार्गदर्शन.",
      legalPrecedents: "कायदेशीर पूर्व निर्णय",
      databaseCoverage: "डेटाबेस कव्हरेज",
      accuracyRate: "अचूकता दर",
      expertValidated: "तज्ञ सत्यापित",
      responseTime: "प्रतिक्रिया वेळ",
      lightningFast: "विजेसारखा वेग",
      legalExperts: "कायदेशीर तज्ञ",
      networkAccess: "नेटवर्क प्रवेश",
      premiumConsultations: "प्रीमियम सल्ला उपलब्ध",
      complimentary: "मोफत",
      expertAnalysesRemaining: "तज्ञ कायदेशीर विश्लेषण आज उरले",
      analysisComplete: "व्यापक कायदेशीर विश्लेषण पूर्ण",
      consultationsExhausted: "मोफत सल्ला संपला",
      upgradeMessage: "अपग्रेड करा",
      upgradeFeatures: "अमर्यादित कायदेशीर सल्ला, प्रगत केस विश्लेषण, आणि प्रीमियम संशोधन वैशिष्ट्यांसाठी.",
      upgradeButton: "प्रो मध्ये अपग्रेड करा - ₹२,९९९/महिना"
    },
    punjabi: {
      queryLabel: "ਆਪਣੀ ਕਾਨੂੰਨੀ ਸਮੱਸਿਆ ਦਾ ਵਰਣਨ ਕਰੋ",
      queryPlaceholder: "ਪੰਜਾਬੀ ਵਿੱਚ ਆਪਣੀ ਕਾਨੂੰਨੀ ਸਮੱਸਿਆ ਦਾ ਵਿਸਤ੍ਰਿਤ ਵਰਣਨ ਕਰੋ...\n\nਉਦਾਹਰਨ: \"ਮੇਰਾ ਮਕਾਨ ਮਾਲਕ ਮੇਰੀ ਸੁਰੱਖਿਆ ਡਿਪਾਜ਼ਿਟ ₹50,000 ਵਾਪਸ ਨਹੀਂ ਕਰ ਰਿਹਾ ਹੈ, ਭਾਵੇਂ ਕਿ ਮੈਂ 45 ਦਿਨ ਪਹਿਲਾਂ ਸੰਪਤੀ ਖਾਲੀ ਕਰ ਦਿੱਤੀ ਸੀ ਅਤੇ ਇਸਨੂੰ ਚੰਗੀ ਸਥਿਤੀ ਵਿੱਚ ਛੱਡ ਦਿੱਤਾ ਸੀ।\"",
      submitButton: "ਮਾਹਿਰ ਕਾਨੂੰਨੀ ਵਿਸ਼ਲੇਸ਼ਣ ਪ੍ਰਾਪਤ ਕਰੋ",
      analyzing: "ਤੁਹਾਡੇ ਕਾਨੂੰਨੀ ਸਵਾਲ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
      responseTitle: "ਕਾਨੂੰਨੀ ਵਿਸ਼ਲੇਸ਼ਣ ਨਤੀਜਾ",
      popularQuestions: "ਲੋਕਪ੍ਰਿਯ ਕਾਨੂੰਨੀ ਪ੍ਰਸ਼ਨ",
      filterByCategory: "ਸ਼੍ਰੇਣੀ ਦੇ ਅਨੁਸਾਰ ਫਿਲਟਰ ਕਰੋ:",
      sortBy: "ਕ੍ਰਮਬੱਧ ਕਰੋ:",
      platformTitle: "ਕਾਨੂੰਨੀ ਬੁੱਧੀ ਪਲੇਟਫਾਰਮ",
      platformDescription: "ਉੱਨਤ AI-ਸੰਚਾਲਿਤ ਕਾਨੂੰਨੀ ਸਲਾਹ ਪ੍ਰਣਾਲੀ ਜੋ ਤੁਰੰਤ ਪਹੁੰਚ ਪ੍ਰਦਾਨ ਕਰਦੀ ਹੈ",
      comprehensiveAnalysis: "ਵਿਆਪਕ ਕਾਨੂੰਨੀ ਵਿਸ਼ਲੇਸ਼ਣ",
      precedentResearch: "ਪੂਰਵ ਨਿਰਣੇ ਖੋਜ, ਅਤੇ ਗੁੰਝਲਦਾਰ ਕਾਨੂੰਨੀ ਮਾਮਲਿਆਂ ਲਈ ਮਾਹਿਰ ਮਾਰਗਦਰਸ਼ਨ।",
      legalPrecedents: "ਕਾਨੂੰਨੀ ਪੂਰਵ ਨਿਰਣੇ",
      databaseCoverage: "ਡਾਟਾਬੇਸ ਕਵਰੇਜ",
      accuracyRate: "ਸਟੀਕਤਾ ਦਰ",
      expertValidated: "ਮਾਹਿਰ ਸਤਿਆਪਿਤ",
      responseTime: "ਜਵਾਬ ਸਮਾਂ",
      lightningFast: "ਬਿਜਲੀ ਦੀ ਤੇਜ਼ੀ",
      legalExperts: "ਕਾਨੂੰਨੀ ਮਾਹਿਰ",
      networkAccess: "ਨੈਟਵਰਕ ਪਹੁੰਚ",
      premiumConsultations: "ਪ੍ਰੀਮਿਅਮ ਸਲਾਹ ਉਪਲਬਧ",
      complimentary: "ਮੁਫਤ",
      expertAnalysesRemaining: "ਮਾਹਿਰ ਕਾਨੂੰਨੀ ਵਿਸ਼ਲੇਸ਼ਣ ਅੱਜ ਬਾਕੀ",
      analysisComplete: "ਵਿਆਪਕ ਕਾਨੂੰਨੀ ਵਿਸ਼ਲੇਸ਼ਣ ਪੂਰਾ",
      consultationsExhausted: "ਮੁਫਤ ਸਲਾਹ ਖਤਮ",
      upgradeMessage: "ਅਪਗ੍ਰੇਡ ਕਰੋ",
      upgradeFeatures: "ਅਸੀਮਿਤ ਕਾਨੂੰਨੀ ਸਲਾਹ, ਉੱਨਤ ਕੇਸ ਵਿਸ਼ਲੇਸ਼ਣ, ਅਤੇ ਪ੍ਰੀਮਿਅਮ ਖੋਜ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਲਈ।",
      upgradeButton: "ਪ੍ਰੋ ਵਿੱਚ ਅਪਗ੍ਰੇਡ ਕਰੋ - ₹੨,੯੯੯/ਮਹੀਨਾ"
    },
    telugu: {
      queryLabel: "మీ చట్టపరమైన సమస్యను వివరించండి",
      queryPlaceholder: "తెలుగులో మీ చట్టపరమైన సమస్యను వివరంగా వివరించండి...\n\nఉదాహరణ: \"నేను 45 రోజుల క్రితం ఆస్తిని ఖాళీ చేసి, దానిని మంచి స్థితిలో వదిలి వచ్చినప్పటికీ, నా ఇల్లు యజమాని నా సెక్యూరిటీ డిపాజిట్ ₹50,000 తిరిగి ఇవ్వడం లేదు.\"",
      submitButton: "నిపుణుల చట్టపరమైన విశ్లేషణ పొందండి",
      analyzing: "మీ చట్టపరమైన ప్రశ్న విశ్లేషణ చేయబడుతోంది...",
      responseTitle: "చట్టపరమైన విశ్లేషణ ఫలితం",
      popularQuestions: "జనాదరణ పొందిన చట్టపరమైన ప్రశ్నలు",
      filterByCategory: "వర్గం ప్రకారం ఫిల్టర్ చేయండి:",
      sortBy: "క్రమబద్ధీకరించు:",
      platformTitle: "చట్ట బుద్ధి వేదిక",
      platformDescription: "అధునాతన AI-నడిచే చట్ట సలహా వ్యవస్థ తక్షణ ప్రవేశాన్ని అందిస్తుంది",
      comprehensiveAnalysis: "సమగ్ర చట్ట విశ్లేషణ",
      precedentResearch: "పూర్వ నిర్ణయ పరిశోధన, మరియు సంక్లిష్ట చట్ట విషయాలకు నిపుణుల మార్గదర్శనం.",
      legalPrecedents: "చట్ట పూర్వ నిర్ణయాలు",
      databaseCoverage: "డేటాబేస్ కవరేజ్",
      accuracyRate: "ఖచ్చితత్వ రేటు",
      expertValidated: "నిపుణుల ధృవీకరణ",
      responseTime: "ప్రతిస్పందన సమయం",
      lightningFast: "మెరుపు వేగం",
      legalExperts: "చట్ట నిపుణులు",
      networkAccess: "నెట్‌వర్క్ యాక్సెస్",
      premiumConsultations: "ప్రీమియం సలహాలు అందుబాటులో",
      complimentary: "ఉచిత",
      expertAnalysesRemaining: "నిపుణుల చట్ట విశ్లేషణలు ఈరోజు మిగిలినవి",
      analysisComplete: "సమగ్ర చట్ట విశ్లేషణ పూర్తయింది",
      consultationsExhausted: "ఉచిత సలహాలు అయిపోయాయి",
      upgradeMessage: "అప్‌గ్రేడ్ చేయండి",
      upgradeFeatures: "అపరిమిత చట్ట సలహాలు, అధునాతన కేస్ విశ్లేషణ, మరియు ప్రీమియం పరిశోధన లక్షణాల కోసం.",
      upgradeButton: "ప్రో కు అప్‌గ్రేడ్ చేయండి - ₹2,999/నెల"
    }
  };

  const getCurrentTranslations = () => translations[language] || translations.english;
  const t = getCurrentTranslations();

  // Modern color scheme
  const colors = {
    primary: '#2563eb',
    primaryLight: '#3b82f6',
    primaryDark: '#1d4ed8',
    secondary: '#f59e0b',
    background: '#f8fafc',
    card: '#ffffff',
    text: '#1e293b',
    textLight: '#64748b',
    border: '#e2e8f0',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  };

  // Enhanced quick question templates with multi-language support
  const getQuickQuestions = () => {
    const templates = {
      english: [
        {
          text: "My landlord is not returning my security deposit after I moved out",
          category: "Property",
          difficulty: "Beginner",
          estimatedTime: "2-3 min",
          popularity: 95,
          label: "Property Rights",
          tags: ["Tenant Rights", "Deposit", "Landlord Dispute"]
        },
        {
          text: "How to file a complaint against a noisy neighbor?",
          category: "Civil",
          difficulty: "Intermediate", 
          estimatedTime: "3-4 min",
          popularity: 87,
          label: "Civil Dispute",
          tags: ["Noise Pollution", "Neighbor Dispute", "Civil Complaint"]
        },
        {
          text: "What are my rights if a product I bought online is defective?",
          category: "Consumer",
          difficulty: "Beginner",
          estimatedTime: "2-3 min",
          popularity: 92,
          label: "Consumer Rights",
          tags: ["Online Shopping", "Defective Product", "Consumer Rights"]
        },
        {
          text: "Check Circle Rate/Guideline Value of a Property for registration",
          category: "Property",
          difficulty: "Advanced",
          estimatedTime: "4-5 min",
          popularity: 78,
          label: "Property Valuation",
          tags: ["Property Valuation", "Registration", "Circle Rate"]
        },
        {
          text: "My employer is not paying overtime wages as per law",
          category: "Employment",
          difficulty: "Intermediate",
          estimatedTime: "3-4 min",
          popularity: 85,
          label: "Employment Rights",
          tags: ["Overtime Pay", "Employment Rights", "Labor Law"]
        },
        {
          text: "Car accident insurance claim is being rejected unfairly",
          category: "Insurance",
          difficulty: "Advanced",
          estimatedTime: "5-6 min",
          popularity: 73,
          label: "Insurance Claims",
          tags: ["Insurance Claim", "Car Accident", "Insurance Dispute"]
        }
      ],
      hindi: [
        {
          text: "मेरे मकान मालिक ने घर छोड़ने के बाद सिक्योरिटी डिपॉजिट वापस नहीं किया है",
          category: "Property",
          difficulty: "Beginner",
          estimatedTime: "2-3 min",
          popularity: 95,
          label: "संपत्ति अधिकार",
          tags: ["किरायेदार अधिकार", "जमा राशि", "मकान मालिक विवाद"]
        },
        {
          text: "शोर मचाने वाले पड़ोसी के खिलाफ शिकायत कैसे दर्ज करें?",
          category: "Civil",
          difficulty: "Intermediate",
          estimatedTime: "3-4 min",
          popularity: 87,
          label: "नागरिक विवाद",
          tags: ["ध्वनि प्रदूषण", "पड़ोसी विवाद", "नागरिक शिकायत"]
        },
        {
          text: "ऑनलाइन खरीदे गए दोषपूर्ण उत्पाद के लिए मेरे क्या अधिकार हैं?",
          category: "Consumer",
          difficulty: "Beginner",
          estimatedTime: "2-3 min",
          popularity: 92,
          label: "उपभोक्ता अधिकार",
          tags: ["ऑनलाइन शॉपिंग", "दोषपूर्ण उत्पाद", "उपभोक्ता अधिकार"]
        }
      ],
      tamil: [
        {
          text: "நான் வீட்டை விட்டு வெளியேறிய பிறகு வீட்டு உரிமையாளர் பாதுகாப்பு வைப்புத்தொகையை திருப்பித் தரவில்லை",
          category: "Property",
          difficulty: "Beginner",
          estimatedTime: "2-3 min",
          popularity: 95,
          label: "சொத்து உரிமைகள்",
          tags: ["குத்தகைதாரர் உரிமைகள்", "வைப்புத்தொகை", "வீட்டு உரிமையாளர் சர்ச்சை"]
        },
        {
          text: "சத்தம் போடும் அண்டை வீட்டாருக்கு எதிராக புகார் எப்படி பதிவு செய்வது?",
          category: "Civil",
          difficulty: "Intermediate",
          estimatedTime: "3-4 min",
          popularity: 87,
          label: "சிவில் தகராறு",
          tags: ["ஒலி மாசுபாடு", "அண்டை வீட்டு சர்ச்சை", "சிவில் புகார்"]
        }
      ],
      bengali: [
        {
          text: "আমার বাড়িওয়ালা বাড়ি ছেড়ে যাওয়ার পর নিরাপত্তা জামানত ফেরত দেননি",
          category: "Property",
          difficulty: "Beginner",
          estimatedTime: "2-3 min",
          popularity: 95,
          label: "সম্পত্তির অধিকার",
          tags: ["ভাড়াটিয়ার অধিকার", "জামানত", "বাড়িওয়ালার বিরোধ"]
        }
      ],
      gujarati: [
        {
          text: "મેં ઘર છોડ્યા પછી મારો લૉન્ડલોર્ડ સિક્યોરિટી ડિપોઝિટ પાછો નથી આપતો",
          category: "Property",
          difficulty: "Beginner",
          estimatedTime: "2-3 min",
          popularity: 95,
          label: "પ્રોપર્ટી રાઈટ્સ",
          tags: ["ટેનન્ટ રાઈટ્સ", "ડિપોઝિટ", "લૉન્ડલોર્ડ ડિસ્પ્યુટ"]
        }
      ],
      marathi: [
        {
          text: "मी घर सोडल्यानंतर माझा मालक सिक्युरिटी डिपॉझिट परत देत नाही",
          category: "Property",
          difficulty: "Beginner",
          estimatedTime: "2-3 min",
          popularity: 95,
          label: "मालमत्ता हक्क",
          tags: ["भाडेकरू हक्क", "ठेव", "मालक वाद"]
        }
      ],
      punjabi: [
        {
          text: "ਮੈਂ ਘਰ ਛੱਡਣ ਤੋਂ ਬਾਅਦ ਮੇਰਾ ਮਕਾਨ ਮਾਲਕ ਸੁਰੱਖਿਆ ਡਿਪਾਜ਼ਿਟ ਵਾਪਸ ਨਹੀਂ ਕਰ ਰਿਹਾ ਹੈ",
          category: "Property",
          difficulty: "Beginner",
          estimatedTime: "2-3 min",
          popularity: 95,
          label: "ਸੰਪਤੀ ਅਧਿਕਾਰ",
          tags: ["ਕਿਰਾਏਦਾਰ ਅਧਿਕਾਰ", "ਡਿਪਾਜ਼ਿਟ", "ਮਕਾਨ ਮਾਲਕ ਵਿਵਾਦ"]
        }
      ],
      telugu: [
        {
          text: "నేను ఇల్లు ఖాళీ చేసిన తర్వాత నా ఇల్లు యజమాని సెక్యూరిటీ డిపాజిట్ తిరిగి ఇవ్వడం లేదు",
          category: "Property",
          difficulty: "Beginner",
          estimatedTime: "2-3 min",
          popularity: 95,
          label: "ఆస్తి హక్కులు",
          tags: ["టెనెంట్ హక్కులు", "డిపాజిట్", "ల్యాండ్లార్డ్ వివాదం"]
        }
      ]
    };
    
    return templates[language] || templates.english;
  };

  const quickQuestions = getQuickQuestions();

  // Enhanced categories for filtering
  const categories = [
    { id: "all", name: "All Categories", label: "All Categories", count: quickQuestions.length, icon: "📚" },
    { id: "Property", name: "Property Law", label: "Property Law", count: quickQuestions.filter(q => q.category === "Property").length, icon: "🏠" },
    { id: "Civil", name: "Civil Law", label: "Civil Law", count: quickQuestions.filter(q => q.category === "Civil").length, icon: "⚖️" },
    { id: "Consumer", name: "Consumer Rights", label: "Consumer Rights", count: quickQuestions.filter(q => q.category === "Consumer").length, icon: "🛍️" },
    { id: "Employment", name: "Employment", label: "Employment", count: quickQuestions.filter(q => q.category === "Employment").length, icon: "💼" },
    { id: "Insurance", name: "Insurance", label: "Insurance", count: quickQuestions.filter(q => q.category === "Insurance").length, icon: "🛡️" }
  ];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [query]);

  // Animate stats on component mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimateStats(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Animate confidence counter
  useEffect(() => {
    if (response && response.confidence > 0) {
      let current = 0;
      const increment = response.confidence / 30;
      const timer = setInterval(() => {
        current += increment;
        if (current >= response.confidence) {
          setConfidence(response.confidence);
          clearInterval(timer);
        } else {
          setConfidence(Math.floor(current));
        }
      }, 50);
      return () => clearInterval(timer);
    }
  }, [response]);

  // Filtered questions based on category
  const filteredQuestions = selectedCategory === "all" 
    ? quickQuestions 
    : quickQuestions.filter(q => q.category === selectedCategory);

  // Sort questions
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    switch (sortBy) {
      case "popularity":
        return b.popularity - a.popularity;
      case "difficulty":
        const difficultyOrder = { "Beginner": 1, "Intermediate": 2, "Advanced": 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case "time":
        return a.estimatedTime.localeCompare(b.estimatedTime);
      default:
        return b.popularity - a.popularity;
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || remainingQueries <= 0) return;

    setIsLoading(true);
    setQueryStartTime(Date.now());
    setConfidence(0);
    
    const newQuery = {
      id: Date.now(),
      text: query.trim(),
      timestamp: new Date().toISOString(),
      category: "Unknown",
      language: language
    };
    setQueryHistory(prev => [newQuery, ...prev.slice(0, 9)]);
    
    // Generate language-specific response based on query content
    const getResponseInLanguage = () => {
      const queryLower = query.toLowerCase();
      
      // Analyze query content to determine legal area and provide specific advice
      let responseData = generateSpecificResponse(queryLower, language);
      
      return responseData;
    };

    // Function to generate specific legal response based on query content
    const generateSpecificResponse = (queryText, lang) => {
      // Legal area detection
      const isPropertyIssue = /landlord|tenant|rent|deposit|security|property|lease|eviction|housing/i.test(queryText);
      const isConsumerIssue = /product|defective|online|shopping|warranty|refund|consumer|seller|delivery/i.test(queryText);
      const isEmploymentIssue = /employer|employee|salary|wage|overtime|job|work|termination|harassment/i.test(queryText);
      const isInsuranceIssue = /insurance|claim|policy|accident|medical|coverage|premium/i.test(queryText);
      const isNeighborIssue = /neighbor|noise|disturbance|nuisance|boundary|parking/i.test(queryText);
      const isContractIssue = /contract|agreement|breach|terms|violation|deal|promise/i.test(queryText);

      const responses = {
        english: {
          property: {
            text: `Based on your property-related legal query: "${query}"\n\n**Legal Analysis:**\nThis appears to be a landlord-tenant dispute under the Transfer of Property Act, 1882 and relevant state Rent Control Acts. Security deposit disputes are common and have specific legal remedies.\n\n**Your Rights:**\n1. **Security Deposit Return**: Landlords must return deposits within 2 months of lease termination unless there are legitimate deductions for damages\n2. **Written Notice**: You have the right to demand written explanation for any deductions\n3. **Legal Recourse**: File complaint in Rent Control Tribunal or Consumer Court for amounts up to ₹1 crore\n\n**Immediate Actions:**\n1. Send a legal notice demanding deposit return within 15 days\n2. Document property condition at the time of vacating\n3. Collect all rent receipts and lease agreement\n4. File complaint in appropriate forum if demand is ignored\n\n**Relevant Laws:**\nTransfer of Property Act 1882, State Rent Control Acts, Consumer Protection Act 2019\n\n**Expected Timeline:** 3-6 months for resolution through legal channels.`,
            sections: [
              "Transfer of Property Act, 1882 - Landlord-Tenant Rights",
              "Consumer Protection Act, 2019 - Security Deposit Recovery",
              "State Rent Control Act - Tenancy Disputes",
              "Civil Procedure Code, 1908 - Legal Notice Procedure"
            ]
          },
          consumer: {
            text: `Based on your consumer rights query: "${query}"\n\n**Legal Analysis:**\nThis falls under the Consumer Protection Act, 2019. Online purchases have specific protections and you have strong legal rights for defective products.\n\n**Your Consumer Rights:**\n1. **Right to Replacement**: Get identical product replacement within warranty period\n2. **Right to Refund**: Full refund if replacement is not possible\n3. **Right to Compensation**: Additional compensation for mental agony and harassment\n4. **Right to Return**: 7-day return policy for most online purchases\n\n**Immediate Actions:**\n1. Contact seller's customer service first with complaint\n2. Document defects with photos/videos\n3. File complaint on National Consumer Helpline (1915)\n4. File case in Consumer Commission if resolution fails\n\n**Legal Remedies:**\n- District Consumer Commission (up to ₹1 crore)\n- State Consumer Commission (₹1 crore to ₹10 crore)\n- National Consumer Commission (above ₹10 crore)\n\n**Expected Resolution:** 30-90 days through consumer forums.`,
            sections: [
              "Consumer Protection Act, 2019 - Product Defects",
              "E-Commerce Rules, 2020 - Online Shopping Rights",
              "Indian Contract Act, 1872 - Sale of Goods",
              "Information Technology Act, 2000 - Digital Transactions"
            ]
          },
          employment: {
            text: `Based on your employment-related query: "${query}"\n\n**Legal Analysis:**\nThis involves employment law violations under the Labour Code, 2020 and various employment protection acts. Overtime payment is a statutory right.\n\n**Your Employment Rights:**\n1. **Overtime Payment**: 2x regular hourly rate for work beyond 8 hours/day or 48 hours/week\n2. **Written Demand**: Right to demand salary/overtime in writing\n3. **Labour Court Relief**: File complaint in Labour Court for unpaid wages\n4. **No Retaliation**: Protection against termination for claiming legal rights\n\n**Immediate Actions:**\n1. Calculate exact overtime hours and amount due\n2. Send written demand to HR/employer with calculation\n3. File complaint with Labour Inspector if ignored\n4. Approach Labour Court for recovery of dues\n\n**Supporting Documents:**\n- Attendance records, salary slips, appointment letter, work hour logs\n\n**Legal Timeline:** 2-4 months for Labour Court proceedings.`,
            sections: [
              "Labour Code on Wages, 2020 - Overtime Payment",
              "Industrial Disputes Act, 1947 - Employee Rights",
              "Payment of Wages Act, 1936 - Salary Recovery",
              "Factories Act, 1948 - Working Hours Regulation"
            ]
          },
          neighbor: {
            text: `Based on your neighbor dispute query: "${query}"\n\n**Legal Analysis:**\nNoise pollution and neighbor disputes fall under Environment Protection Act, 1986 and local municipal laws. You have right to peaceful enjoyment of property.\n\n**Your Rights:**\n1. **Right to Peace**: Fundamental right to peaceful environment in your home\n2. **Noise Limits**: Residential areas have 55dB day/45dB night limits\n3. **Police Complaint**: Right to file complaint for nuisance under IPC Section 268\n4. **Civil Remedy**: Sue for damages and injunction\n\n**Immediate Actions:**\n1. Document noise timings and decibel levels (use phone apps)\n2. Approach neighbor for amicable settlement first\n3. File written complaint with local police station\n4. Contact Pollution Control Board for noise measurement\n5. File civil suit for permanent injunction if needed\n\n**Expected Resolution:** 1-3 months for police intervention, 6-12 months for civil suit.`,
            sections: [
              "Environment Protection Act, 1986 - Noise Pollution",
              "Indian Penal Code, Section 268 - Public Nuisance",
              "Motor Vehicles Act, 1988 - Vehicle Noise Limits",
              "Municipal Corporation Acts - Local Noise Regulations"
            ]
          },
          general: {
            text: `Based on your legal query: "${query}"\n\n**Legal Analysis:**\nOur AI has analyzed your specific situation and identified relevant legal provisions under Indian law. Each legal matter requires careful examination of facts and applicable laws.\n\n**Key Legal Considerations:**\n1. **Factual Analysis**: Understanding all relevant facts and circumstances\n2. **Legal Framework**: Identifying applicable laws and regulations\n3. **Procedural Requirements**: Following correct legal procedures and timelines\n4. **Evidence Collection**: Gathering supporting documents and proof\n\n**Recommended Actions:**\n1. Document all relevant facts and evidence\n2. Identify the appropriate legal forum for your case\n3. Consider alternative dispute resolution methods\n4. Consult with a qualified lawyer for detailed advice\n\n**Important Note:**\nThis analysis provides general guidance. For specific legal advice tailored to your situation, please consult a qualified legal professional.`,
            sections: [
              "Indian Constitution - Fundamental Rights",
              "Civil Procedure Code, 1908 - Legal Procedures",
              "Indian Evidence Act, 1872 - Proof Requirements",
              "Limitation Act, 1963 - Time Limits for Legal Action"
            ]
          }
        },
        hindi: {
          text: `आपके व्यापक कानूनी प्रश्न "${query}" के आधार पर, हमारे उन्नत AI कानूनी सिस्टम ने कई कानूनी डेटाबेस और पूर्व निर्णयों का उपयोग करके गहन विश्लेषण किया है।\n\n**कानूनी विश्लेषण:**\nआपकी स्थिति में भारतीय कानून के तहत कई महत्वपूर्ण कानूनी विचार शामिल हैं। हमारे AI ने हजारों समान मामलों का विश्लेषण किया है और आपको सटीक मार्गदर्शन प्रदान करने के लिए वर्तमान कानूनी विधियों का क्रॉस-रेफरेंस किया है।\n\n**मुख्य कानूनी प्रावधान:**\nप्रासंगिक कानूनी ढांचे में विभिन्न अधिनियमों और नियमों के तहत विशिष्ट प्रावधान शामिल हैं। हमारा विश्लेषण प्रक्रियात्मक आवश्यकताओं, वैधानिक सीमाओं, उपलब्ध उपचारों और वर्तमान न्यायशास्त्र के आधार पर संभावित परिणामों पर विचार करता है।\n\n**अनुशंसित कार्य:**\n1. सभी प्रासंगिक साक्ष्य और संचार का दस्तावेजीकरण करें\n2. कार्रवाई करने की वैधानिक समय सीमा पर विचार करें\n3. वर्तमान कानून के तहत उपलब्ध कानूनी उपचारों का मूल्यांकन करें\n4. आपकी विशिष्ट परिस्थितियों के लिए योग्य कानूनी पेशेवर से सलाह लें\n\n**महत्वपूर्ण नोट:**\nयह विश्लेषण सामान्य कानूनी सिद्धांतों पर आधारित है और आपकी विशिष्ट परिस्थितियों के लिए पेशेवर कानूनी परामर्श का स्थान नहीं ले सकता।`,
          sections: [
            "भारतीय दंड संहिता, धारा 420 - धोखाधड़ी",
            "उपभोक्ता संरक्षण अधिनियम, 2019 - उपभोक्ता अधिकार",
            "संपत्ति स्थानांतरण अधिनियम, 1882 - संपत्ति अधिकार",
            "सिविल प्रक्रिया संहिता, 1908 - कानूनी प्रक्रियाएं",
            "भारतीय अनुबंध अधिनियम, 1872 - समझौता प्रवर्तन"
          ]
        },
        tamil: {
          text: `உங்கள் விரிவான சட்ட கேள்வி "${query}" அடிப்படையில், எங்கள் மேம்பட்ட AI சட்ட அமைப்பு பல சட்ட தரவுத்தளங்கள் மற்றும் முன்னுதாரணங்களைப் பயன்படுத்தி ஆழமான பகுப்பாய்வு நடத்தியுள்ளது.\n\n**சட்ட பகுப்பாய்வு:**\nஉங்கள் நிலைமையில் இந்திய சட்டத்தின் கீழ் பல முக்கியமான சட்ட கருத்துக்கள் உள்ளன. எங்கள் AI ஆயிரக்கணக்கான ஒத்த வழக்குகளை பகுப்பாய்வு செய்து, உங்களுக்கு துல்லியமான வழிகாட்டுதலை வழங்க தற்போதைய சட்ட விதிகளை குறுக்கு-குறிப்பிட்டுள்ளது.\n\n**முக்கிய சட்ட ஏற்பாடுகள்:**\nதொடர்புடைய சட்ட கட்டமைப்பில் பல்வேறு சட்டங்கள் மற்றும் விதிமுறைகளின் கீழ் குறிப்பிட்ட ஏற்பாடுகள் அடங்கும். எங்கள் பகுப்பாய்வு நடைமுறை தேவைகள், சட்டரீதியான வரம்புகள், கிடைக்கக்கூடிய தீர்வுகள் மற்றும் தற்போதைய நீதிசாஸ்திரத்தின் அடிப்படையில் சாத்தியமான விளைவுகளை கருதுகிறது.\n\n**பரிந்துரைக்கப்பட்ட நடவடிக்கைகள்:**\n1. அனைத்து தொடர்புடைய ஆதாரங்கள் மற்றும் தகவல்தொடர்புகளை ஆவணப்படுத்துங்கள்\n2. நடவடிக்கை எடுப்பதற்கான சட்டரீதியான கால வரம்புகளை கருத்தில் கொள்ளுங்கள்\n3. தற்போதைய சட்டத்தின் கீழ் கிடைக்கக்கூடிய சட்ட தீர்வுகளை மதிப்பீடு செய்யுங்கள்\n4. உங்கள் குறிப்பிட்ட சூழ்நிலைகளுக்கு தகுதியான சட்ட நிபுணரிடம் ஆலோசனை பெறுங்கள்\n\n**முக்கியமான குறிப்பு:**\nஇந்த பகுப்பாய்வு பொதுவான சட்ட கொள்கைகளை அடிப்படையாகக் கொண்டது மற்றும் உங்கள் குறிப்பிட்ட சூழ்நிலைகளுக்கு தொழில்முறை சட்ட ஆலோசனையை மாற்ற முடியாது.`,
          sections: [
            "இந்திய தண்டனை சட்டம், பிரிவு 420 - ஏமாற்றுதல்",
            "நுகர்வோர் பாதுகாப்பு சட்டம், 2019 - நுகர்வோர் உரிமைகள்",
            "சொத்து மாற்றம் சட்டம், 1882 - சொத்து உரிமைகள்",
            "சிவில் நடைமுறை சட்டம், 1908 - சட்ட நடைமுறைகள்",
            "இந்திய ஒப்பந்த சட்டம், 1872 - ஒப்பந்த அமலாக்கம்"
          ]
        },
        bengali: {
          text: `আপনার ব্যাপক আইনি প্রশ্ন "${query}" এর ভিত্তিতে, আমাদের উন্নত AI আইনি সিস্টেম একাধিক আইনি ডেটাবেস এবং নজির ব্যবহার করে গভীর বিশ্লেষণ পরিচালনা করেছে।\n\n**আইনি বিশ্লেষণ:**\nআপনার পরিস্থিতিতে ভারতীয় আইনের অধীনে বেশ কয়েকটি গুরুত্বপূর্ণ আইনি বিবেচনা জড়িত। আমাদের AI হাজার হাজার অনুরূপ মামলা বিশ্লেষণ করেছে এবং আপনাকে সঠিক নির্দেশনা প্রদানের জন্য বর্তমান আইনি নিয়মকানুন ক্রস-রেফারেন্স করেছে।\n\n**মূল আইনি বিধান:**\nপ্রাসঙ্গিক আইনি কাঠামোতে বিভিন্ন আইন ও নিয়মের অধীনে নির্দিষ্ট বিধান রয়েছে। আমাদের বিশ্লেষণ প্রক্রিয়াগত প্রয়োজনীয়তা, সংবিধিবদ্ধ সীমাবদ্ধতা, উপলব্ধ প্রতিকার এবং বর্তমান আইনশাস্ত্রের ভিত্তিতে সম্ভাব্য ফলাফল বিবেচনা করে।\n\n**প্রস্তাবিত পদক্ষেপ:**\n1. সমস্ত প্রাসঙ্গিক প্রমাণ এবং যোগাযোগের নথিভুক্ত করুন\n2. পদক্ষেপ নেওয়ার জন্য সংবিধিবদ্ধ সময়সীমা বিবেচনা করুন\n3. বর্তমান আইনের অধীনে উপলব্ধ আইনি প্রতিকারের মূল্যায়ন করুন\n4. আপনার নির্দিষ্ট পরিস্থিতির জন্য যোগ্য আইনি পেশাদারের সাথে পরামর্শ করুন\n\n**গুরুত্বপূর্ণ নোট:**\nএই বিশ্লেষণ সাধারণ আইনি নীতির ভিত্তিতে এবং আপনার নির্দিষ্ট পরিস্থিতির জন্য পেশাদার আইনি পরামর্শের বিকল্প হতে পারে না।`,
          sections: [
            "ভারতীয় দণ্ডবিধি, ধারা 420 - প্রতারণা",
            "ভোক্তা সুরক্ষা আইন, 2019 - ভোক্তা অধিকার",
            "সম্পত্তি স্থানান্তর আইন, 1882 - সম্পত্তি অধিকার",
            "দেওয়ানি কার্যবিধি, 1908 - আইনি পদ্ধতি",
            "ভারতীয় চুক্তি আইন, 1872 - চুক্তি বলবৎকরণ"
          ]
        },
        gujarati: {
          text: `તમારા વ્યાપક કાનૂની પ્રશ્ન "${query}" ના આધારે, અમારી ઉન્નત AI કાનૂની સિસ્ટમે બહુવિધ કાનૂની ડેટાબેસ અને પૂર્વ નિર્ણયોનો ઉપયોગ કરીને ગહન વિશ્લેષણ કર્યું છે।\n\n**કાનૂની વિશ્લેષણ:**\nતમારી પરિસ્થિતિમાં ભારતીય કાનૂન હેઠળ કેટલાક મહત્વપૂર્ણ કાનૂની વિચારણાઓ સામેલ છે. અમારા AI એ હજારો સમાન કેસોનું વિશ્લેષણ કર્યું છે અને તમને સચોટ માર્ગદર્શન આપવા માટે વર્તમાન કાનૂની કાયદાઓનો ક્રોસ-રેફરન્સ કર્યો છે।\n\n**મુખ્ય કાનૂની જોગવાઈઓ:**\nસંબંધિત કાનૂની માળખામાં વિવિધ અધિનિયમો અને નિયમો હેઠળ વિશિષ્ટ જોગવાઈઓ સામેલ છે. અમારું વિશ્લેષણ પ્રક્રિયાગત આવશ્યકતાઓ, કાનૂની મર્યાદાઓ, ઉપલબ્ધ ઉપાયો અને વર્તમાન ન્યાયશાસ્ત્રના આધારે સંભવિત પરિણામોને ધ્યાનમાં લે છે।\n\n**સૂચવેલ પગલાં:**\n1. તમામ સંબંધિત પુરાવા અને સંદેશાવ્યવહારનું દસ્તાવેજીકરણ કરો\n2. પગલાં લેવા માટેની કાનૂની સમય મર્યાદાને ધ્યાનમાં લો\n3. વર્તમાન કાનૂન હેઠળ ઉપલબ્ધ કાનૂની ઉપાયોનું મૂલ્યાંકન કરો\n4. તમારી વિશિષ્ટ પરિસ્થિતિઓ માટે લાયક કાનૂની વ્યાવસાયિક સાથે સલાહ લો\n\n**મહત્વપૂર્ણ નોંધ:**\nઆ વિશ્લેષણ સામાન્ય કાનૂની સિદ્ધાંતોના આધારે છે અને તમારી વિશિષ્ટ પરિસ્થિતિઓ માટે વ્યાવસાયિક કાનૂની સલાહનું સ્થાન લઈ શકતું નથી।`,
          sections: [
            "ભારતીય દંડ સંહિતા, કલમ 420 - છેતરપિંડી",
            "ગ્રાહક સુરક્ષા અધિનિયમ, 2019 - ગ્રાહક અધિકારો",
            "મિલકત ટ્રાન્સફર એક્ટ, 1882 - મિલકત અધિકારો",
            "સિવિલ પ્રોસિજર કોડ, 1908 - કાનૂની પ્રક્રિયાઓ",
            "ભારતીય કરાર અધિનિયમ, 1872 - કરાર અમલીકરણ"
          ]
        },
        marathi: {
          text: `तुमच्या व्यापक कायदेशीर प्रश्न "${query}" च्या आधारावर, आमच्या प्रगत AI कायदेशीर प्रणालीने अनेक कायदेशीर डेटाबेस आणि पूर्वनिर्णयांचा वापर करून सखोल विश्लेषण केले आहे।\n\n**कायदेशीर विश्लेषण:**\nतुमच्या परिस्थितीत भारतीय कायद्यांतर्गत अनेक महत्त्वाचे कायदेशीर विचार समाविष्ट आहेत. आमच्या AI ने हजारो समान प्रकरणांचे विश्लेषण केले आहे आणि तुम्हाला अचूक मार्गदर्शन देण्यासाठी सध्याच्या कायदेशीर नियमांचा क्रॉस-रेफरन्स केला आहे।\n\n**मुख्य कायदेशीर तरतुदी:**\nसंबंधित कायदेशीर चौकटीत विविध कायदे आणि नियमांअंतर्गत विशिष्ट तरतुदींचा समावेश आहे. आमचे विश्लेषण प्रक्रियात्मक आवश्यकता, वैधानिक मर्यादा, उपलब्ध उपाय आणि सध्याच्या न्यायशास्त्राच्या आधारावर संभाव्य परिणामांचा विचार करते।\n\n**शिफारस केलेली कार्ये:**\n1. सर्व संबंधित पुरावे आणि संप्रेषणाचे दस्तऐवजीकरण करा\n2. कारवाई करण्यासाठी वैधानिक वेळ मर्यादांचा विचार करा\n3. सध्याच्या कायद्यांतर्गत उपलब्ध कायदेशीर उपायांचे मूल्यांकन करा\n4. तुमच्या विशिष्ट परिस्थितींसाठी पात्र कायदेशीर व्यावसायिकाशी सल्लामसलत करा\n\n**महत्त्वाची नोंद:**\nहे विश्लेषण सामान्य कायदेशीर तत्त्वांवर आधारित आहे आणि तुमच्या विशिष्ट परिस्थितींसाठी व्यावसायिक कायदेशीर सल्ल्याची जागा घेऊ शकत नाही।`,
          sections: [
            "भारतीय दंड संहिता, कलम 420 - फसवणूक",
            "ग्राहक संरक्षण कायदा, 2019 - ग्राहक हक्क",
            "मालमत्ता हस्तांतरण कायदा, 1882 - मालमत्ता हक्क",
            "नागरी प्रक्रिया संहिता, 1908 - कायदेशीर प्रक्रिया",
            "भारतीय करार कायदा, 1872 - करार अंमलबजावणी"
          ]
        },
        punjabi: {
          text: `ਤੁਹਾਡੇ ਵਿਆਪਕ ਕਾਨੂੰਨੀ ਸਵਾਲ "${query}" ਦੇ ਆਧਾਰ 'ਤੇ, ਸਾਡੇ ਉਨਤ AI ਕਾਨੂੰਨੀ ਸਿਸਟਮ ਨੇ ਕਈ ਕਾਨੂੰਨੀ ਡੇਟਾਬੇਸ ਅਤੇ ਪੁਰਾਣੇ ਫੈਸਲਿਆਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਡੂੰਘਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤਾ ਹੈ।\n\n**ਕਾਨੂੰਨੀ ਵਿਸ਼ਲੇਸ਼ਣ:**\nਤੁਹਾਡੀ ਸਥਿਤੀ ਵਿੱਚ ਭਾਰਤੀ ਕਾਨੂੰਨ ਦੇ ਅਧੀਨ ਕਈ ਮਹੱਤਵਪੂਰਨ ਕਾਨੂੰਨੀ ਵਿਚਾਰ ਸ਼ਾਮਲ ਹਨ। ਸਾਡੇ AI ਨੇ ਹਜ਼ਾਰਾਂ ਸਮਾਨ ਕੇਸਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤਾ ਹੈ ਅਤੇ ਤੁਹਾਨੂੰ ਸਹੀ ਮਾਰਗਦਰਸ਼ਨ ਦੇਣ ਲਈ ਮੌਜੂਦਾ ਕਾਨੂੰਨੀ ਨਿਯਮਾਂ ਦਾ ਕ੍ਰਾਸ-ਰਿਫਰੈਂਸ ਕੀਤਾ ਹੈ।\n\n**ਮੁੱਖ ਕਾਨੂੰਨੀ ਵਿਵਸਥਾਵਾਂ:**\nਸੰਬੰਧਿਤ ਕਾਨੂੰਨੀ ਢਾਂਚੇ ਵਿੱਚ ਵੱਖ-ਵੱਖ ਐਕਟਾਂ ਅਤੇ ਨਿਯਮਾਂ ਦੇ ਅਧੀਨ ਖਾਸ ਵਿਵਸਥਾਵਾਂ ਸ਼ਾਮਲ ਹਨ। ਸਾਡਾ ਵਿਸ਼ਲੇਸ਼ਣ ਪ੍ਰਕਿਰਿਆਤਮਕ ਲੋੜਾਂ, ਕਾਨੂੰਨੀ ਸੀਮਾਵਾਂ, ਉਪਲਬਧ ਉਪਾਅ ਅਤੇ ਮੌਜੂਦਾ ਨਿਆਂਸ਼ਾਸਤਰ ਦੇ ਆਧਾਰ 'ਤੇ ਸੰਭਾਵਿਤ ਨਤੀਜਿਆਂ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖਦਾ ਹੈ।\n\n**ਸਿਫਾਰਸ਼ ਕੀਤੇ ਕਦਮ:**\n1. ਸਾਰੇ ਸੰਬੰਧਿਤ ਸਬੂਤ ਅਤੇ ਸੰਚਾਰ ਦਾ ਦਸਤਾਵੇਜ਼ੀਕਰਣ ਕਰੋ\n2. ਕਾਰਵਾਈ ਕਰਨ ਲਈ ਕਾਨੂੰਨੀ ਸਮਾਂ ਸੀਮਾ ਦਾ ਵਿਚਾਰ ਕਰੋ\n3. ਮੌਜੂਦਾ ਕਾਨੂੰਨ ਦੇ ਅਧੀਨ ਉਪਲਬਧ ਕਾਨੂੰਨੀ ਉਪਾਵਾਂ ਦਾ ਮੁਲਾਂਕਣ ਕਰੋ\n4. ਆਪਣੀਆਂ ਖਾਸ ਸਥਿਤੀਆਂ ਲਈ ਯੋਗ ਕਾਨੂੰਨੀ ਪੇਸ਼ੇਵਰ ਨਾਲ ਸਲਾਹ ਕਰੋ\n\n**ਮਹੱਤਵਪੂਰਨ ਨੋਟ:**\nਇਹ ਵਿਸ਼ਲੇਸ਼ਣ ਆਮ ਕਾਨੂੰਨੀ ਸਿਧਾਂਤਾਂ 'ਤੇ ਆਧਾਰਿਤ ਹੈ ਅਤੇ ਤੁਹਾਡੀਆਂ ਖਾਸ ਸਥਿਤੀਆਂ ਲਈ ਪੇਸ਼ੇਵਰ ਕਾਨੂੰਨੀ ਸਲਾਹ ਦੀ ਥਾਂ ਨਹੀਂ ਲੈ ਸਕਦਾ।`,
          sections: [
            "ਭਾਰਤੀ ਦੰਡ ਸੰਹਿਤਾ, ਧਾਰਾ 420 - ਧੋਖਾਧੜੀ",
            "ਉਪਭੋਗਤਾ ਸੁਰੱਖਿਆ ਐਕਟ, 2019 - ਉਪਭੋਗਤਾ ਅਧਿਕਾਰ",
            "ਸੰਪਤੀ ਟ੍ਰਾਂਸਫਰ ਐਕਟ, 1882 - ਸੰਪਤੀ ਅਧਿਕਾਰ",
            "ਸਿਵਲ ਪ੍ਰੋਸੀਜਰ ਕੋਡ, 1908 - ਕਾਨੂੰਨੀ ਪ੍ਰਕਿਰਿਆਵਾਂ",
            "ਭਾਰਤੀ ਇਕਰਾਰਨਾਮਾ ਐਕਟ, 1872 - ਇਕਰਾਰਨਾਮਾ ਲਾਗੂਕਰਨ"
          ]
        },
        telugu: {
          text: `మీ వ్యాప్త చట్టపరమైన ప్రశ్న "${query}" ఆధారంగా, మా అధునాతన AI చట్ట వ్యవస్థ అనేక చట్టపరమైన డేటాబేస్‌లు మరియు పూర్వనిర్ణయాలను ఉపయోగించి లోతైన విశ్లేషణను నిర్వహించింది.\n\n**చట్టపరమైన విశ్లేషణ:**\nమీ పరిస్థితిలో భారతీయ చట్టం కింద అనేక ముఖ్యమైన చట్టపరమైన పరిగణనలు ఉన్నాయి. మా AI వేలాది సమాన కేసులను విశ్లేషించింది మరియు మీకు ఖచ్చితమైన మార్గదర్శకత్వం అందించడానికి ప్రస్తుత చట్టపరమైన శాసనాలను క్రాస్-రిఫరెన్స్ చేసింది.\n\n**ముఖ్య చట్టపరమైన నిబంధనలు:**\nసంబంధిత చట్టపరమైన ఫ్రేమ్‌వర్క్‌లో వివిధ చట్టాలు మరియు నిబంధనల కింద నిర్దిష్ట నిబంధనలు ఉన్నాయి. మా విశ్లేషణ ప్రక్రియాత్మక అవసరాలు, చట్టబద్ధమైన పరిమితులు, అందుబాటులో ఉన్న పరిష్కారాలు మరియు ప్రస్తుత న్యాయశాస్త్రం ఆధారంగా సంభావ్య ఫలితాలను పరిగణిస్తుంది.\n\n**సిఫారసు చేయబడిన చర్యలు:**\n1. అన్ని సంబంధిత సాక్ష్యాలు మరియు కమ్యూనికేషన్‌లను డాక్యుమెంట్ చేయండి\n2. చర్య తీసుకోవడానికి చట్టబద్ధమైన సమయ పరిమితులను పరిగణించండి\n3. ప్రస్తుత చట్టం కింద అందుబాటులో ఉన్న చట్టపరమైన పరిష్కారాలను అంచనా వేయండి\n4. మీ నిర్దిష్ట పరిస్థితుల కోసం అర్హత కలిగిన న్యాయ నిపుణుడిని సంప్రదించండి\n\n**ముఖ్యమైన గమనిక:**\nఈ విశ్లేషణ సాధారణ చట్టపరమైన సూత్రాలపై ఆధారపడింది మరియు మీ నిర్దిష్ట పరిస్థితుల కోసం వృత్తిపరమైన చట్టపరమైన సలహా స్థానాన్ని తీసుకోలేదు.`,
          sections: [
            "భారతీయ దండ సంహిత, సెక్షన్ 420 - మోసం",
            "వినియోగదారుల రక్షణ చట్టం, 2019 - వినియోగదారుల హక్కులు",
            "ఆస్తి బదిలీ చట్టం, 1882 - ఆస్తి హక్కులు",
            "సివిల్ ప్రొసీజర్ కోడ్, 1908 - చట్టపరమైన విధానాలు",
            "భారతీయ ఒప్పంద చట్టం, 1872 - ఒప్పంద అమలు"
          ]
        }
      };

      // Determine response category based on query content
      let category = 'general';
      if (isPropertyIssue) category = 'property';
      else if (isConsumerIssue) category = 'consumer';
      else if (isEmploymentIssue) category = 'employment';
      else if (isNeighborIssue) category = 'neighbor';
      
      // Get language-specific response
      const langResponses = responses[lang] || responses.english;
      
      // Check if the language has category-based responses (like English) or direct response (like other languages)
      if (langResponses[category]) {
        return langResponses[category];
      } else if (langResponses.text) {
        // For languages with direct text/sections structure
        return langResponses;
      } else {
        // Fallback to English general response
        return responses.english.general;
      }
    };
    
    setTimeout(() => {
      setIsLoading(false);
      const queryTime = ((Date.now() - queryStartTime) / 1000).toFixed(1);
      const languageResponse = getResponseInLanguage();
      
      setResponse({
        text: languageResponse.text,
        relevantSections: languageResponse.sections,
        confidence: Math.floor(Math.random() * 8) + 92,
        category: "Multi-jurisdictional",
        complexity: "Intermediate",
        processingTime: queryTime,
        aiAgentsConsulted: Math.floor(Math.random() * 3) + 3,
        casesSimilar: Math.floor(Math.random() * 500) + 100,
        lastUpdated: "Based on laws current as of " + new Date().toLocaleDateString(),
        language: getCurrentLanguage().name
      });
      setRemainingQueries(prev => prev - 1);
      setQuery("");
      setIsExpanded(true);
      setShowResultModal(true);
    }, 2800);
  };

  const handleQuickQuestion = (question) => {
    setQuery(question.text);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const downloadResponse = () => {
    if (response) {
      const element = document.createElement("a");
      const file = new Blob([response.text], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `legal-analysis-${Date.now()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const shareResponse = async () => {
    if (response && navigator.share) {
      try {
        await navigator.share({
          title: 'Legal Analysis from Chakshi',
          text: response.text.substring(0, 200) + '...',
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  const clearQuery = () => setQuery("");
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(response.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Property': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Civil': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Consumer': return 'bg-green-100 text-green-800 border-green-200';
      case 'Employment': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Insurance': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section 
      className="relative py-24 overflow-hidden"
      style={{ 
        backgroundColor: '#f5f5ef',
        backgroundImage: 'url("https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Enhanced background with legal-themed elements */}
      <div className="absolute inset-0">
        {/* Background overlay for readability */}
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(245, 245, 239, 0.85)' }}></div>
        
        {/* Light Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10"></div>
        
        {/* Animated Background Elements */}
        <div 
          className="absolute top-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-30"
          style={{
            background: `linear-gradient(135deg, rgba(182, 157, 116, 0.2), rgba(182, 157, 116, 0.1))`
          }}
        ></div>
        <div 
          className="absolute bottom-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: `linear-gradient(135deg, rgba(182, 157, 116, 0.15), rgba(182, 157, 116, 0.08))`
          }}
        ></div>
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M30 30m-20 0a20 20 0 1 1 40 0a20 20 0 1 1 -40 0'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-0 pb-10 -mt-24">{/* Pulled section further upward */}
        
  {/* Modern Professional Header */}
  <div className="text-center mb-8">
          {/* Main Branding */}
          <div className="mb-12">
            <div className="mb-8">
            </div>
            
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-semibold mb-2 text-[#1f2839]">Ask Queries</h2>
              <p 
                className="text-xl md:text-2xl leading-relaxed font-medium mb-8 text-gray-700"
              >
                {t.platformDescription}
                <span className="font-bold text-[#1f2839]"> {t.comprehensiveAnalysis}</span>, 
                {t.precedentResearch}
              </p>
            </div>
          </div>

          {/* Enterprise Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { value: '2.5M+', label: t.legalPrecedents || 'Legal Precedents', sublabel: t.databaseCoverage || 'Database Coverage', color: '#b69d74' },
              { value: '98.7%', label: t.accuracyRate || 'Accuracy Rate', sublabel: t.expertValidated || 'Expert Validated', color: '#10b981' },
              { value: '<25s', label: t.responseTime || 'Response Time', sublabel: t.lightningFast || 'Lightning Fast', color: '#6366f1' },
              { value: '1,200+', label: t.legalExperts || 'Legal Experts', sublabel: t.networkAccess || 'Network Access', color: '#f59e0b' }
            ].map((metric, index) => (
              <div 
                key={index}
                className={`backdrop-blur-sm border rounded-2xl p-8 shadow-lg transform transition-all duration-500 hover:shadow-xl hover:scale-105 ${
                  animateStats ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ 
                  transitionDelay: `${index * 150}ms`,
                  background: 'rgba(255, 255, 255, 0.80)',
                  borderColor: 'rgba(182, 157, 116, 0.3)',
                  boxShadow: '0 8px 25px rgba(31, 40, 57, 0.12)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.90)';
                  e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.80)';
                  e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.3)';
                }}
              >
                <div className="text-4xl font-black mb-3" style={{ color: metric.color }}>
                  {metric.value}
                </div>
                <div className="text-base font-bold text-[#1f2839] mb-1">
                  {metric.label}
                </div>
                <div className="text-sm font-medium text-gray-600">
                  {metric.sublabel}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modern Query Balance Card */}
        <div 
          className="backdrop-blur-sm border rounded-3xl shadow-xl p-10 mb-16"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            borderColor: 'rgba(182, 157, 116, 0.3)',
            boxShadow: '0 15px 35px rgba(31, 40, 57, 0.15)'
          }}
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #b69d74 0%, #d4c4a8 100%)',
                  boxShadow: '0 10px 30px rgba(182, 157, 116, 0.3)'
                }}
              >
                <div className="w-8 h-8 rounded-full border-3 border-white flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#1f2839] mb-2">
                  {t.premiumConsultations || 'Premium Consultations Available'}
                </h2>
                <p className="text-lg text-gray-700">
                  <span className="font-bold text-[#b69d74]">{remainingQueries} {t.complimentary || 'complimentary'}</span> {t.expertAnalysesRemaining || 'expert legal analyses remaining today'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              {/* Progress Circle */}
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    fill="none" stroke="rgba(31, 40, 57, 0.2)" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    fill="none" 
                    stroke="#b69d74" 
                    strokeWidth="4" 
                    strokeDasharray={`${(remainingQueries / 5) * 100}, 100`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-[#1f2839]">{remainingQueries}</span>
                  <span className="text-sm font-bold text-gray-600">REMAINING</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm font-bold text-gray-600 mb-2">UPGRADE FOR</div>
                <div className="text-xl font-black text-[#b69d74]">UNLIMITED ACCESS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Query Interface */}
        <div 
          className="backdrop-blur-sm border rounded-3xl shadow-xl p-12 mb-16"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            borderColor: 'rgba(182, 157, 116, 0.3)',
            boxShadow: '0 15px 35px rgba(31, 40, 57, 0.15)'
          }}
        >
          
          {/* Language Selection */}
          <div className="flex justify-center mb-12">
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-[#b69d74] to-[#d4c4a8] text-[#1f2839] rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => setShowLanguagePopup(!showLanguagePopup)}
              >
                <span className="text-2xl">{getCurrentLanguage().flag}</span>
                <span>{getCurrentLanguage().name}</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Language Dropdown */}
              {showLanguagePopup && (
                <div 
                  className="absolute top-full left-0 mt-2 w-80 rounded-2xl shadow-2xl border z-50 overflow-hidden backdrop-blur-sm"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderColor: 'rgba(182, 157, 116, 0.3)'
                  }}
                >
                  <div className="p-2 max-h-96 overflow-y-auto">
                    {languages.map((lang) => (
                      <button
                        key={lang.id}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                          language === lang.id
                            ? 'bg-[#b69d74] text-white border border-[#d4c4a8]' 
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => {
                          setLanguage(lang.id);
                          setShowLanguagePopup(false);
                        }}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="font-medium flex-1 text-left">{lang.name}</span>
                        {language === lang.id && (
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
              <label className="text-base font-bold text-[#1f2839]">{t.filterByCategory}</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border backdrop-blur-sm text-[#1f2839] rounded-xl font-medium focus:ring-2 focus:ring-[#b69d74] focus:border-transparent"
                style={{
                  background: 'rgba(255, 255, 255, 0.90)',
                  borderColor: 'rgba(182, 157, 116, 0.3)'
                }}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id} className="bg-white text-[#1f2839]">
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="text-base font-bold text-[#1f2839]">{t.sortBy}</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border backdrop-blur-sm text-[#1f2839] rounded-xl font-medium focus:ring-2 focus:ring-[#b69d74] focus:border-transparent"
                style={{
                  background: 'rgba(255, 255, 255, 0.90)',
                  borderColor: 'rgba(182, 157, 116, 0.3)'
                }}
              >
                <option value="relevance" className="bg-white text-[#1f2839]">Most Relevant</option>
                <option value="popularity" className="bg-white text-[#1f2839]">Most Popular</option>
                <option value="difficulty" className="bg-white text-[#1f2839]">By Difficulty</option>
                <option value="time" className="bg-white text-[#1f2839]">By Time</option>
              </select>
            </div>
          </div>

          {/* Query Form */}
          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <label 
                htmlFor="query" 
                className="block text-xl font-bold text-[#1f2839] mb-6"
              >
                {t.queryLabel}
              </label>
              <div className="relative">
                <textarea
                  id="query"
                  ref={textareaRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.queryPlaceholder}
                  rows="8"
                  maxLength="1000"
                  disabled={remainingQueries <= 0}
                  className="w-full px-8 py-6 border-2 backdrop-blur-sm text-[#1f2839] placeholder-gray-500 rounded-2xl text-lg focus:ring-4 focus:ring-[#b69d74]/20 focus:border-[#b69d74] transition-all duration-300 resize-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.85)',
                    borderColor: 'rgba(182, 157, 116, 0.3)',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600">
                    {query.length}/1000
                  </span>
                  {query && (
                    <button
                      type="button"
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors"
                      style={{
                        background: 'rgba(182, 157, 116, 0.2)'
                      }}
                      onClick={() => setQuery('')}
                    >
                      <span className="text-gray-700">×</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Questions */}
            <div>
              <h3 className="text-xl font-bold text-[#1f2839] mb-8">
                {t.popularQuestions}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedQuestions.map((question, index) => (
                  <button
                    key={index}
                    type="button"
                    className="text-left p-6 border-2 backdrop-blur-sm rounded-2xl hover:border-[#b69d74] hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                    style={{
                      background: 'rgba(255, 255, 255, 0.70)',
                      borderColor: 'rgba(182, 157, 116, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)';
                      e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.70)';
                      e.currentTarget.style.borderColor = 'rgba(182, 157, 116, 0.3)';
                    }}
                    onClick={() => handleQuickQuestion(question)}
                    disabled={remainingQueries <= 0}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-xs px-3 py-1 rounded-full font-bold text-[#b69d74] border"
                        style={{
                          background: 'rgba(182, 157, 116, 0.2)',
                          borderColor: 'rgba(182, 157, 116, 0.4)'
                        }}
                      >
                        {question.category}
                      </span>
                      <span className="text-xs px-2 py-1 rounded font-medium text-gray-600"
                        style={{
                          background: 'rgba(182, 157, 116, 0.1)'
                        }}
                      >
                        {question.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-sm font-medium text-gray-700 mb-4 leading-relaxed group-hover:text-[#1f2839]">
                      {question.text}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{question.estimatedTime}</span>
                      <span>{question.popularity}% relevance</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="space-y-6">
              <div className="text-center">
                <div 
                  className="inline-flex items-center gap-3 px-6 py-3 backdrop-blur-sm rounded-xl border"
                  style={{
                    background: 'rgba(182, 157, 116, 0.2)',
                    borderColor: 'rgba(182, 157, 116, 0.4)'
                  }}
                >
                  <svg className="w-5 h-5 text-[#b69d74]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-bold text-[#1f2839]">AI-Powered Legal Analysis</span>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button
                  type="submit"
                  className={`px-8 py-4 rounded-xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    isLoading ? 'animate-pulse' : 'hover:shadow-xl'
                  }`}
                  style={{
                    background: isLoading || !query.trim() || remainingQueries <= 0
                      ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
                      : 'linear-gradient(135deg, #b69d74 0%, #d4c4a8 100%)',
                    color: isLoading || !query.trim() || remainingQueries <= 0 ? '#ffffff' : '#1f2839',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                  }}
                  disabled={!query.trim() || remainingQueries <= 0 || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t.analyzing}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <span>{t.submitButton}</span>
                      <span className="text-sm px-3 py-1 bg-white/20 rounded-full font-semibold">
                        {remainingQueries} left
                      </span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Modern Professional Legal Analysis Modal */}
        {showResultModal && response && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowResultModal(false)}
          >
            <div 
              className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-gray-50 p-8 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-gray-900 mb-2">
                        {t.responseTitle}
                      </h3>
                      <p className="text-lg font-medium text-gray-600">{t.analysisComplete || 'Comprehensive Legal Analysis Complete'}</p>
                    </div>
                  </div>
                  
                  <button 
                    className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200"
                    onClick={() => setShowResultModal(false)}
                  >
                    <span className="text-2xl text-gray-600">×</span>
                  </button>
                </div>
              </div>
              
              {/* Modal Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Analysis Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                  <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                    <div className="text-3xl font-black text-gray-900 mb-2">{response.processingTime}s</div>
                    <div className="text-sm font-bold text-gray-600 uppercase tracking-wide">Processing</div>
                    <div className="text-xs text-gray-500 mt-1">Lightning Speed</div>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-6 text-center border border-green-200">
                    <div className="text-3xl font-black text-green-700 mb-2">{confidence}%</div>
                    <div className="text-sm font-bold text-green-600 uppercase tracking-wide">Confidence</div>
                    <div className="text-xs text-green-500 mt-1">Expert Level</div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-6 text-center border border-blue-200">
                    <div className="text-3xl font-black text-blue-700 mb-2">{response.casesSimilar}+</div>
                    <div className="text-sm font-bold text-blue-600 uppercase tracking-wide">Cases</div>
                    <div className="text-xs text-blue-500 mt-1">Similar Found</div>
                  </div>
                  
                  <div className="bg-amber-50 rounded-xl p-6 text-center border border-amber-200">
                    <div className="text-2xl font-black text-amber-700 mb-2">{response.complexity}</div>
                    <div className="text-sm font-bold text-amber-600 uppercase tracking-wide">Complexity</div>
                    <div className="text-xs text-amber-500 mt-1">Analysis Level</div>
                  </div>
                </div>

                {/* Analysis Content */}
                <div className="bg-gray-50 rounded-2xl p-8 mb-8 border border-gray-200">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-900 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 000 2H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2h-1V5a1 1 0 100-2V3a2 2 0 00-2-2H6a2 2 0 00-2 2v2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Legal Analysis Report
                  </h4>
                  
                  <div className="prose max-w-none">
                    {response.text && response.text.split('\n').map((paragraph, i) => (
                      paragraph.trim() && (
                        <p key={i} className="mb-4 leading-relaxed text-gray-800">
                          {paragraph.replace(/\*\*/g, '')}
                        </p>
                      )
                    ))}
                  </div>
                </div>

                {/* Legal Provisions */}
                <div className="mb-10">
                  <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">
                    Relevant Legal Provisions
                  </h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {response.relevantSections.map((section, index) => (
                      <div 
                        key={index} 
                        className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <span className="text-sm font-medium text-gray-800 leading-relaxed">{section}</span>
                            <div className="text-xs text-gray-500 mt-2">Indian Legal Framework</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center mb-8">
                  <button 
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                      copied 
                        ? 'bg-green-100 text-green-800 border border-green-300' 
                        : 'bg-white text-gray-800 border border-gray-300 hover:shadow-md'
                    }`}
                    onClick={copyResponse}
                  >
                    {copied ? '✓ Copied!' : 'Copy Analysis'}
                  </button>
                  
                  <button 
                    className="px-6 py-3 rounded-xl bg-white text-gray-800 border border-gray-300 font-semibold hover:shadow-md transition-all duration-300 hover:scale-105"
                    onClick={downloadResponse}
                  >
                    Download PDF
                  </button>
                  
                  {navigator.share && (
                    <button 
                      className="px-6 py-3 rounded-xl bg-white text-gray-800 border border-gray-300 font-semibold hover:shadow-md transition-all duration-300 hover:scale-105"
                      onClick={shareResponse}
                    >
                      Share Analysis
                    </button>
                  )}
                  
                  <button 
                    className="px-8 py-3 rounded-xl bg-gray-900 text-white font-bold hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg"
                    onClick={() => {
                      setResponse(null);
                      setShowResultModal(false);
                    }}
                  >
                    New Query
                  </button>
                </div>
                
                {/* Disclaimer */}
                <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-bold text-gray-700">Legal Disclaimer</p>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">
                    This is AI-generated legal information for guidance only. Please consult a qualified legal professional for advice specific to your situation.
                  </p>
                  <p className="text-xs font-semibold text-gray-700">Powered by Chakshi Legal AI Platform</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modern Upgrade Prompt */}
        {remainingQueries <= 0 && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl p-12 text-center mb-16">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            
            <h3 className="text-3xl font-black text-white mb-4">
              {t.consultationsExhausted || 'Free Consultations Exhausted'}
            </h3>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-10">
              {t.upgradeMessage || 'Upgrade to'} <span className="font-bold text-[#b69d74]">Chakshi Pro</span> {t.upgradeFeatures || 'for unlimited legal consultations, advanced case analysis, and premium research features.'}
            </p>
            
            <button className="bg-gradient-to-r from-[#b69d74] to-[#d4c4a8] text-[#1f2839] px-10 py-4 rounded-2xl font-bold text-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-lg mb-8">
              {t.upgradeButton || 'Upgrade to Pro - ₹2,999/month'}
            </button>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {['Unlimited Queries', 'Advanced Analysis', 'Priority Support', 'Document Templates'].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modern Query History */}
        {queryHistory.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl p-10 mb-16">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 000 2H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2h-1V5a1 1 0 100-2V3a2 2 0 00-2-2H6a2 2 0 00-2 2v2z" clipRule="evenodd" />
              </svg>
              Recent Query History
            </h3>
            
            <div className="space-y-4">
              {queryHistory.slice(0, 3).map((historyItem) => (
                <div 
                  key={historyItem.id} 
                  className="flex items-center gap-4 p-6 border border-white/20 bg-white/5 backdrop-blur-sm rounded-2xl hover:bg-white/10 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#b69d74]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium text-white truncate">{historyItem.text}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(historyItem.timestamp).toLocaleDateString()} • {historyItem.language} • {historyItem.category}
                    </p>
                  </div>
                  
                  <button 
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium text-gray-300 hover:text-white transition-all duration-200 hover:scale-105"
                    onClick={() => setQuery(historyItem.text)}
                  >
                    Reuse
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main content container closing div */}
      </div>

      {/* Language Popup Overlay */}
      {showLanguagePopup && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
          onClick={() => setShowLanguagePopup(false)}
        >
          <div 
            className="bg-white rounded-3xl p-8 max-w-md w-full max-h-96 overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Select Language
            </h3>
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  className={`flex items-center gap-3 w-full p-4 rounded-2xl transition-all duration-200 ${
                    language === lang.id
                      ? 'bg-blue-50 text-blue-700 border-2 border-blue-200' 
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                  onClick={() => {
                    setLanguage(lang.id);
                    setShowLanguagePopup(false);
                  }}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="font-medium flex-1 text-left">{lang.name}</span>
                  {language === lang.id && (
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FreeQueryWidget;