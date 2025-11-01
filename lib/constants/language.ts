export const translations = {
  en: {
    title: "District Insights",
    byDistrict: "Search by District",
    byLocation: "Search with My Location",
    placeholder: "Enter district name...",
    listening: "Listening...",
    listenSummary: "🎧 Listen Summary",
  },
  hi: {
    title: "ज़िला इनसाइट्स",
    byDistrict: "ज़िले द्वारा खोजें",
    byLocation: "मेरे स्थान से खोजें",
    placeholder: "ज़िले का नाम दर्ज करें...",
    listening: "सुन रहे हैं...",
    listenSummary: "🎧 सारांश सुनें",
  },
  as: {
    title: "জিলা ইনসাইটছ",
    byDistrict: "জিলা অনুসৰি অনুসন্ধান কৰক",
    byLocation: "মোৰ অৱস্থানৰ সৈতে অনুসন্ধান কৰক",
    placeholder: "জিলাৰ নাম লিখক...",
    listening: "শুনিছে...",
    listenSummary: "🎧 সারসংক্ষেপ শুনক",
  },
};





export type Lang = "en" | "hi" | "as";

export const ui = {
  en: {
    title: "District Insights",
    byDistrict: "Search by District",
    byLocation: "Search with My Location",
    placeholder: "Enter district name...",
       useLocation: "Use My Location",
    listenSummary: "🎧 Listen Summary",
    fetchingLocation: "Fetching location...",
    noDistrict: "No district selected",
    viewInsights: "View Insights",
  },
  hi: {
    title: "ज़िला इनसाइट्स",
    byDistrict: "ज़िले द्वारा खोजें",
    byLocation: "मेरे स्थान से खोजें",
     useLocation: "मेरा स्थान उपयोग करें",
    placeholder: "ज़िले का नाम दर्ज करें...",
    listenSummary: "🎧 सारांश सुनें",
    fetchingLocation: "स्थान प्राप्त किया जा रहा है...",
    noDistrict: "कोई जिला चयनित नहीं है",
    viewInsights: "इन्साइट्स देखें",
  },
  as: {
    title: "জিলা ইনসাইটছ",
    byDistrict: "জিলা অনুসৰি অনুসন্ধান কৰক",
    byLocation: "মোৰ অৱস্থানৰ সৈতে অনুসন্ধান কৰক",
    placeholder: "জিলাৰ নাম লিখক...",
       useLocation: "মোৰ অৱস্থান ব্যৱহাৰ কৰক",
    listenSummary: "🎧 সারসংক্ষেপ শুনক",
    fetchingLocation: "অৱস্থান বিচাৰি আছে...",
    noDistrict: "কোনো জিলা নিৰ্বাচিত নহয়",
    viewInsights: "ইনচাইটচ চাওক",
  },
};

// metric labels and voice-friendly phrases
export const metrics = {
  en: {
    employmentRate: "Employment Rate",
    fundsAllocated: "Funds Allocated (Cr)",
    fundsUtilized: "Funds Utilized (Cr)",
    households: "Households Engaged",
    workers: "Workers",
    persondaysGenerated: "Person-days Generated",
    avgDaysPerHH: "Avg Days per HH",
    womenParticipation: "Women Participation",
    scParticipation: "SC Participation",
    stParticipation: "ST Participation",
  },
  hi: {
    employmentRate: "रोजगार दर",
    fundsAllocated: "आवंटित निधि (करोड़)",
    fundsUtilized: "उपयोगित निधि (करोड़)",
    households: "रुचि परिवार",
    workers: "श्रमिक",
    persondaysGenerated: "व्यक्ति-दिवस",
    avgDaysPerHH: "प्रति परिवार औसत दिन",
    womenParticipation: "महिला भागीदारी",
    scParticipation: "अनु. जाति भागीदारी",
    stParticipation: "अनु. जनजाति भागीदारी",
  },
  as: {
    employmentRate: "নিযুক্তিৰ হাৰ",
    fundsAllocated: "অলকৃত তহবিল (কোটি)",
    fundsUtilized: "ব্যৱহৃত তহবিল (কোটি)",
    households: "সংলগ্ন পৰিয়াল",
    workers: "কর্মী",
    persondaysGenerated: "জন-দিন সৃষ্টি",
    avgDaysPerHH: "প্রতি ঘৰৰ গড় দিন",
    womenParticipation: "মহিলা অংশগ্ৰহণ",
    scParticipation: "SC অংশগ্ৰহণ",
    stParticipation: "ST অংশগ্ৰহণ",
  },
};

export const voiceTemplates = {
  en: (d: any) =>
    `${d.name} district in ${d.state}. In ${d.year}, the approved labour budget was ₹${d.approvedLabourBudget?.toLocaleString() ?? 0}. 
    ₹${d.totalExpenditure?.toLocaleString() ?? 0} crore was spent. 
    ${d.totalHouseholdsWorked?.toLocaleString() ?? 0} households and ${d.totalIndividualsWorked?.toLocaleString() ?? 0} individuals worked, 
    generating ${d.womenPersondays?.toLocaleString() ?? 0} women persondays, 
    ${d.scPersondays?.toLocaleString() ?? 0} SC, and ${d.stPersondays?.toLocaleString() ?? 0} ST persondays. 
    Average days of employment were ${d.averageDaysEmployment ?? 0}.`,

  hi: (d: any) =>
    `${d.state} के ${d.name} जिले में, ${d.year} में ₹${d.approvedLabourBudget?.toLocaleString() ?? 0} का श्रम बजट स्वीकृत हुआ। 
    ₹${d.totalExpenditure?.toLocaleString() ?? 0} करोड़ खर्च हुए। 
    ${d.totalHouseholdsWorked?.toLocaleString() ?? 0} परिवारों और ${d.totalIndividualsWorked?.toLocaleString() ?? 0} व्यक्तियों ने कार्य किया। 
    महिला व्यक्ति-दिवस ${d.womenPersondays?.toLocaleString() ?? 0}, अनुसूचित जाति ${d.scPersondays?.toLocaleString() ?? 0}, 
    अनुसूचित जनजाति ${d.stPersondays?.toLocaleString() ?? 0}। औसतन ${d.averageDaysEmployment ?? 0} दिन का रोजगार मिला।`,

  as: (d: any) =>
    `${d.state} ৰাজ্যৰ ${d.name} জিলাত, ${d.year} চনত ₹${d.approvedLabourBudget?.toLocaleString() ?? 0} টকা অনুমোদিত হৈছিল। 
    ₹${d.totalExpenditure?.toLocaleString() ?? 0} কোটি খৰচ হৈছিল। 
    ${d.totalHouseholdsWorked?.toLocaleString() ?? 0} ঘৰে আৰু ${d.totalIndividualsWorked?.toLocaleString() ?? 0} ব্যক্তিয়ে কাম কৰিছিল। 
    মহিলাৰ ${d.womenPersondays?.toLocaleString() ?? 0} জন-দিন, SC ${d.scPersondays?.toLocaleString() ?? 0}, ST ${d.stPersondays?.toLocaleString() ?? 0}। 
    গড়ে প্ৰতি ঘৰক ${d.averageDaysEmployment ?? 0} দিন কাম দিয়া হৈছিল।`,
};





export const voiceTemplatesCompare: Record<Lang, (d: any) => string> = {
  en: (d) =>
    `${d.name} district in ${d.state}. In ${d.year || "the current year"}, 
the approved labour budget was ₹${d.approvedLabourBudget?.toLocaleString() ?? 0}. 
A total of ₹${d.totalExpenditure?.toLocaleString() ?? 0} crore was spent. 
${d.totalHouseholdsWorked?.toLocaleString() ?? 0} households and ${d.totalIndividualsWorked?.toLocaleString() ?? 0} individuals worked, 
generating ${d.womenPersondays?.toLocaleString() ?? 0} women persondays, 
${d.scPersondays?.toLocaleString() ?? 0} SC persondays, and ${d.stPersondays?.toLocaleString() ?? 0} ST persondays. 
The average wage rate was ₹${d.averageWageRate ?? 0}, 
and the average days of employment were ${d.averageDaysEmployment ?? 0}.`,

  hi: (d) =>
    `${d.state} के ${d.name} जिले में, ${d.year || "वर्तमान वर्ष"} में ₹${d.approvedLabourBudget?.toLocaleString() ?? 0} का श्रम बजट स्वीकृत हुआ। 
कुल ₹${d.totalExpenditure?.toLocaleString() ?? 0} करोड़ खर्च हुए। 
${d.totalHouseholdsWorked?.toLocaleString() ?? 0} परिवारों और ${d.totalIndividualsWorked?.toLocaleString() ?? 0} व्यक्तियों ने कार्य किया, 
जिससे ${d.womenPersondays?.toLocaleString() ?? 0} महिला व्यक्ति-दिवस, 
${d.scPersondays?.toLocaleString() ?? 0} अनुसूचित जाति, 
और ${d.stPersondays?.toLocaleString() ?? 0} अनुसूचित जनजाति व्यक्ति-दिवस बने। 
औसत मजदूरी ₹${d.averageWageRate ?? 0} रही और औसतन ${d.averageDaysEmployment ?? 0} दिन का रोजगार मिला।`,

  as: (d) =>
    `${d.state} ৰাজ্যৰ ${d.name} জিলাত, ${d.year || "বৰ্তমান বছৰত"} ₹${d.approvedLabourBudget?.toLocaleString() ?? 0} টকা অনুমোদিত হৈছিল। 
মুঠ ₹${d.totalExpenditure?.toLocaleString() ?? 0} কোটি খৰচ হৈছিল। 
${d.totalHouseholdsWorked?.toLocaleString() ?? 0} ঘৰে আৰু ${d.totalIndividualsWorked?.toLocaleString() ?? 0} ব্যক্তিয়ে কাম কৰিছিল। 
মহিলাৰ ${d.womenPersondays?.toLocaleString() ?? 0} জন-দিন, SC ${d.scPersondays?.toLocaleString() ?? 0}, ST ${d.stPersondays?.toLocaleString() ?? 0} জন-দিন হৈছিল। 
গড়ে প্ৰতি ঘৰক ₹${d.averageWageRate ?? 0} টকা মজুৰি আৰু ${d.averageDaysEmployment ?? 0} দিন কাম দিয়া হৈছিল।`,
};


export const languageInstall: Record<
  Lang,
  {
    title: string;
    subtitle: string;
    tip: string;
    installBtn: string;
    installing: string;
    alreadyInstalled: string;
    uninstallInfoTitle: string;
    uninstallInfo: string;
    backHome: string;
  }
> = {
  en: {
    title: "Install the App",
    subtitle: "Access Mitra offline anytime, anywhere.",
    tip: "Tap install to add Mitra to your home screen.",
    installBtn: "Install App",
    installing: "Installing...",
    alreadyInstalled: "App already installed!",
    uninstallInfoTitle: "How to uninstall",
    uninstallInfo: "To remove the app, go to your device settings and uninstall Mitra.",
    backHome: "Back to Home",
  },
  hi: {
    title: "ऐप इंस्टॉल करें",
    subtitle: "कहीं भी, कभी भी ऑफलाइन पहुँच।",
    tip: "मित्र को अपने होम स्क्रीन पर जोड़ने के लिए इंस्टॉल करें।",
    installBtn: "ऐप इंस्टॉल करें",
    installing: "इंस्टॉल हो रहा है...",
    alreadyInstalled: "ऐप पहले से इंस्टॉल है!",
    uninstallInfoTitle: "अनइंस्टॉल कैसे करें",
    uninstallInfo: "ऐप हटाने के लिए अपने डिवाइस की सेटिंग्स में जाएं।",
    backHome: "होम पर वापस जाएं",
  },
  as: {
    title: "এপ ইনষ্টল কৰক",
    subtitle: "যিকোনো ঠাইৰ পৰা অফলাইনত ব্যৱহাৰ কৰক।",
    tip: "আপোনাৰ হোম স্ক্ৰীনত মিত্ৰ যোগ কৰিবলৈ ইনষ্টল কৰক।",
    installBtn: "এপ ইনষ্টল কৰক",
    installing: "ইনষ্টল হৈ আছে...",
    alreadyInstalled: "এপ ইতিমধ্যে ইনষ্টল হৈছে!",
    uninstallInfoTitle: "আনইনষ্টল কেনেকৈ কৰিব",
    uninstallInfo: "এপ আঁতৰাবলৈ আপোনাৰ ডিভাইচৰ ছেটিংছত যাওক।",
    backHome: "ঘৰলৈ ফিৰি যাওক",
  },
};

export const languageFooter = {
  en: {
    home: "Home",
    insights: "Insights",
    compare: "Compare",
    install: "Install",
    about: "Mitra",
    copyright: "© 2025 Mitra. All rights reserved.",
  },
  hi: {
    home: "होम",
    insights: "जानकारी",
    compare: "तुलना",
    install: "इंस्टॉल",
    about: "मित्र",
    copyright: "© 2025 मित्र. सर्वाधिकार सुरक्षित।",
  },
  as: {
    home: "হোম",
    insights: "অভিজ্ঞতা",
    compare: "তুলনা",
    install: "ইনষ্টল",
    about: "মিত্ৰ",
    copyright: "© ২০২৫ মিত্ৰ. সকলো অধিকাৰ সংৰক্ষিত।",
  },
};
