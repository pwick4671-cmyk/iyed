const languages = {
    "ar": "العربية",
    "en": "الإنجليزية",
    "fr": "الفرنسية",
    "es": "الإسبانية",
    "de": "الألمانية",
    "tr": "التركية",
    "it": "الإيطالية",
    "ru": "الروسية",
    "ja": "اليابانية",
    "zh": "الصينية (المبسطة)",
    "ko": "الكورية",
    "hi": "الهندية",
    "th": "التايلاندية", 
    "vi": "الفيتنامية",
    "id": "الإندونيسية",
    "ms": "الماليزية",
    "bn": "البنغالية",
    "pa": "البنجابية",
    "mr": "الماراثية",
    "ta": "التاميلية",
    "te": "التيلوغوية",
    "pt": "البرتغالية",
    "nl": "الهولندية",
    "pl": "البولندية",
    "sv": "السويدية",
    "no": "النرويجية",
    "da": "الدنماركية",
    "fi": "الفنلندية",
    "el": "اليونانية",
    "cs": "التشيكية",
    "hu": "المجرية",
    "ro": "الرومانية",
    "uk": "الأوكرانية",
    "bg": "البلغارية",
    "hr": "الكرواتية",
    "sk": "السلوفاكية",
    "fa": "الفارسية",
    "ur": "الأوردو",
    "he": "العبرية",
    "az": "الأذربيجانية",
    "ka": "الجورجية",
    "uz": "الأوزبكية",
    "kk": "الكازاخستانية",
    "hy": "الأرمنية",
    "sw": "السواحيلية", 
    "am": "الأمهرية",
    "af": "الأفريكانية",
    "sq": "الألبانية",
    "et": "الأستونية",
    "lv": "اللاتفية",
    "lt": "الليتوانية"
};

const sourceSelect = document.getElementById('sourceLang');
const targetSelect = document.getElementById('targetLang');
const historyList = document.getElementById('historyList');
const mainCard = document.getElementById('mainCard');
const swapBtn = document.getElementById('swapBtn');

function init() {
    Object.entries(languages).forEach(([code, name]) => {
        sourceSelect.add(new Option(name, code));
        targetSelect.add(new Option(name, code));
    });
    targetSelect.value = "en";
}

async function translate() {
    const text = document.getElementById('inputText').value.trim();
    if (!text) return;

    const from = sourceSelect.value;
    const to = targetSelect.value;
    const output = document.getElementById('outputText');

    output.value = "جاري المعالجة...";
    
    try {
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
        const data = await res.json();
        
        if (from === 'auto' && data.responseData.detectedSourceLanguage) {
            console.log("اللغة المكتشفة: " + data.responseData.detectedSourceLanguage);
        }

        const result = data.responseData.translatedText;
        output.value = result;
        addToHistory(text, result);
    } catch (err) {
        output.value = "خطأ في الشبكة.";
    }
}

function addToHistory(q, r) {
    const item = document.createElement('div');
    item.className = "history-item p-4 rounded-xl cursor-pointer";
    item.innerHTML = `
        <p class="text-xs text-purple-400 font-bold mb-1 italic">SOURCE</p>
        <p class="text-sm truncate mb-2">${q}</p>
        <p class="text-xs text-slate-500 font-bold mb-1 italic">RESULT</p>
        <p class="text-sm text-purple-200">${r}</p>
    `;
    item.onclick = () => {
        document.getElementById('inputText').value = q;
        document.getElementById('outputText').value = r;
    };
    historyList.prepend(item);
}

swapBtn.onclick = () => {
    mainCard.classList.add('swap-anim');
    setTimeout(() => mainCard.classList.remove('swap-anim'), 600);

    if (sourceSelect.value !== 'auto') {
        const temp = sourceSelect.value;
        sourceSelect.value = targetSelect.value;
        targetSelect.value = temp;
    }
};

let typingTimer;
const aiStatus = document.getElementById('aiStatus');
const statusText = document.getElementById('statusText');
const loaderCircle = document.getElementById('loaderCircle');

inputText.addEventListener('input', () => {

    clearTimeout(typingTimer);
    
    typingTimer = setTimeout(async () => {
        const text = inputText.value.trim();
        
        if (text.length > 2) {
            try {
                const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.substring(0, 50))}&langpair=auto|en`);
                const data = await res.json();
                
                if (data.responseData.detectedSourceLanguage) {
                    const detectedCode = data.responseData.detectedSourceLanguage;
                    const langName = languages[detectedCode] || detectedCode;
                    
                    
                    if (sourceSelect.value === 'auto') {

                    }
                }
            } catch (err) {
                aiStatus.classList.add('opacity-0');
            }
        } else {
            aiStatus.classList.add('opacity-0');
        }
    }, 1000); 
});

document.getElementById('translateBtn').onclick = translate;
window.onload = init;