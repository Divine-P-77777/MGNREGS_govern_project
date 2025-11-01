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
    listenSummary: "🎧 Listen Summary",
    fetchingLocation: "Fetching location...",
    noDistrict: "No district selected",
    viewInsights: "View Insights",
  },
  hi: {
    title: "ज़िला इनसाइट्स",
    byDistrict: "ज़िले द्वारा खोजें",
    byLocation: "मेरे स्थान से खोजें",
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

// voice templates (short)
export const voiceTemplates = {
  en: (d: any) =>
    `${d.name} district in ${d.state}. In ${d.year}, ${d.employmentRate}% employment rate. ₹${d.fundsUtilized} crore utilized out of ₹${d.fundsAllocated} crore. ${d.persondaysGenerated.toLocaleString()} person-days generated for ${d.workers.toLocaleString()} workers. Women participation ${d.womenParticipation} percent. SC ${d.scParticipation} percent. ST ${d.stParticipation} percent. Average days per household ${d.avgDaysPerHH}.`,
  hi: (d: any) =>
    `${d.state} के ${d.name} जिले में, ${d.year} में रोजगार दर ${d.employmentRate} प्रतिशत थी। ₹${d.fundsUtilized} करोड़ का उपयोग हुआ, कुल आवंटन ₹${d.fundsAllocated} करोड़ था। ${d.persondaysGenerated.toLocaleString()} व्यक्ति-दिवस पैदा हुए और ${d.workers.toLocaleString()} श्रमिक शामिल थे। महिला भागीदारी ${d.womenParticipation} प्रतिशत, अनुसूचित जाति ${d.scParticipation} प्रतिशत, अनुसूचित जनजाति ${d.stParticipation} प्रतिशत। प्रति परिवार औसत दिन ${d.avgDaysPerHH}।`,
  as: (d: any) =>
    `${d.state} ৰাজ্যৰ ${d.name} জিলাত, ${d.year} চনত নিযোগৰ হাৰ ${d.employmentRate} শতাংশ আছিল। ₹${d.fundsUtilized} কোটি ব্যৱহৃত, মুঠ অলকৃত ₹${d.fundsAllocated} কোটি আছিল। ${d.persondaysGenerated.toLocaleString()} জন-দিন সৃষ্টি কৰি ${d.workers.toLocaleString()} কৰ্মী জড়িত আছিল। মহিলা অংশগ্ৰহণ ${d.womenParticipation} শতাংশ, SC ${d.scParticipation} শতাংশ, ST ${d.stParticipation} শতাংশ। গড়ে প্ৰতি ঘৰক ${d.avgDaysPerHH} দিন।`,
};