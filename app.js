const $ = (s) => document.querySelector(s);

const chat = $("#chat");
const input = $("#messageInput");
const historyEl = $("#history");

let chats = JSON.parse(
  localStorage.getItem("nova_chats") || "[]"
);

let current = {
  id: Date.now(),
  title: "محادثة جديدة",
  messages: []
};

let saveChats =
  localStorage.getItem("nova_save") !== "false";


function persist() {
  if (saveChats) {
    localStorage.setItem(
      "nova_chats",
      JSON.stringify(chats)
    );
  }
}


function renderHistory(filter = "") {

  historyEl.innerHTML = "";

  chats
    .filter((c) => c.title.includes(filter))
    .slice()
    .reverse()
    .forEach((c) => {

      const button = document.createElement("button");

      button.textContent = "💬 " + c.title;

      button.onclick = () => loadChat(c.id);

      historyEl.appendChild(button);
    });
}


function saveCurrent() {

  if (!current.messages.length) return;

  const index =
    chats.findIndex((c) => c.id === current.id);

  if (index >= 0) {
    chats[index] = current;
  } else {
    chats.push(current);
  }

  persist();
  renderHistory();
}


function loadChat(id) {

  const found = chats.find(
    (c) => c.id === id
  );

  if (!found) return;

  current =
    JSON.parse(JSON.stringify(found));

  chat.innerHTML = "";

  current.messages.forEach((message) => {
    addMessage(
      message.role,
      message.text,
      false
    );
  });

  $("#sidebar").classList.remove("open");
}


function newChat() {

  saveCurrent();

  current = {
    id: Date.now(),
    title: "محادثة جديدة",
    messages: []
  };

  chat.innerHTML = `
    <div class="welcome" id="welcome">

      <div class="hero-logo">✦</div>

      <h1>كيفاش نعاونك اليوم؟</h1>

      <p>
        اكتب سؤالك أو استعمل الميكروفون للتحدث مع Nova.
      </p>

      <div class="suggestions">

        <button data-prompt="اعطيني فكرة Web App جديدة">
          💡 فكرة مشروع
        </button>

        <button data-prompt="ساعدني نكتب خطة لمشروع">
          📝 خطة مشروع
        </button>

        <button data-prompt="فسرلي كيفاش يخدم الذكاء الاصطناعي">
          🤖 شرح AI
        </button>

        <button data-prompt="اكتبلي مثال HTML بسيط">
          💻 كود
        </button>

      </div>

    </div>
  `;

  bindSuggestions();
}


function addMessage(
  role,
  text,
  store = true
) {

  const welcome =
    $("#welcome");

  if (welcome) {
    welcome.remove();
  }

  const row =
    document.createElement("div");

  row.className =
    "msg " + role;

  const bubble =
    document.createElement("div");

  bubble.className = "bubble";

  bubble.textContent = text;

  row.appendChild(bubble);

  chat.appendChild(row);

  chat.scrollTop =
    chat.scrollHeight;

  if (store) {

    current.messages.push({
      role: role,
      text: text
    });

    if (
      role === "user" &&
      current.messages.length === 1
    ) {
      current.title =
        text.substring(0, 32);
    }

    saveCurrent();
  }
}


function mockAnswer(text) {

  const t =
    text.toLowerCase();

  if (
    t.includes("web app") ||
    t.includes("مشروع")
  ) {

    return `
أكيد! 🔥

تنجم تعمل Nova Hub:
• AI Chat
• Voice
• حفظ المحادثات
• أدوات AI
• Dashboard
• Memory

الواجهة الحالية تخدم Frontend فقط.
باش نخليو الـAI حقيقي، نربطو Backend بالـAI API.
`;
  }

  if (
    t.includes("html") ||
    t.includes("كود")
  ) {

    return `
تنجم تبدأ بـ HTML + CSS + JavaScript.

بعدها نزيدو:
Backend
Database
Authentication
AI API

والـAPI Key يبقى مخفي في Backend.
`;
  }

  if (t.includes("ai")) {

    return `
الذكاء الاصطناعي يستقبل السؤال،
يعالجه بواسطة نموذج AI،
وبعد يرجع الإجابة.

في Nova الحقيقية:
Frontend → Backend → AI API
`;
  }

  return `
فهمتك 👍

هذه نسخة Frontend تجريبية من Nova.

الإجابة الحالية Demo.
للحصول على إجابات AI حقيقية،
نحتاج Backend + AI API.
`;
}


function send(text) {

  text =
    (text || input.value).trim();

  if (!text) return;

  input.value = "";

  resizeInput();

  addMessage(
    "user",
    text
  );

  setTimeout(() => {

    const answer =
      mockAnswer(text);

    addMessage(
      "assistant",
      answer
    );

    speak(answer);

  }, 500);
}


function resizeInput() {

  input.style.height =
    "auto";

  input.style.height =
    Math.min(
      input.scrollHeight,
      140
    ) + "px";
}


$("#sendBtn").onclick =
  () => send();


input.addEventListener(
  "input",
  resizeInput
);


input.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      send();
    }

  }
);


$("#newChat").onclick =
  newChat;


$("#clearBtn").onclick =
  () => {

    if (
      confirm(
        "تمسح المحادثة الحالية؟"
      )
    ) {
      newChat();
    }

  };


$("#searchInput").oninput =
  (event) => {

    renderHistory(
      event.target.value
    );

  };


$("#menuBtn").onclick =
  () => {

    $("#sidebar")
      .classList
      .toggle("open");

  };


$("#themeBtn").onclick =
  () => {

    document.body
      .classList
      .toggle("light");

    localStorage.setItem(
      "nova_theme",
      document.body.classList.contains(
        "light"
      )
        ? "light"
        : "dark"
    );

  };


if (
  localStorage.getItem(
    "nova_theme"
  ) === "light"
) {

  document.body.classList.add(
    "light"
  );

}


$("#settingsBtn").onclick =
  () => {

    $("#settingsModal")
      .classList
      .remove("hidden");

  };


$("#closeSettings").onclick =
  () => {

    $("#settingsModal")
      .classList
      .add("hidden");

  };


$("#saveSettings").onclick =
  () => {

    saveChats =
      $("#saveChats").checked;

    localStorage.setItem(
      "nova_save",
      saveChats
    );

    $("#settingsModal")
      .classList
      .add("hidden");

  };


let recognition = null;
let listening = false;

const voiceBtn =
  $("#voiceBtn");


if (
  "SpeechRecognition" in window ||
  "webkitSpeechRecognition" in window
) {

  const Speech =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  recognition =
    new Speech();

  recognition.lang =
    "ar-TN";

  recognition.interimResults =
    false;

  recognition.onstart =
    () => {

      listening = true;

      voiceBtn
        .classList
        .add("active");

    };


  recognition.onend =
    () => {

      listening = false;

      voiceBtn
        .classList
        .remove("active");

    };


  recognition.onresult =
    (event) => {

      const text =
        event.results[0][0]
          .transcript;

      input.value = text;

      resizeInput();

      send(text);

    };


  voiceBtn.onclick =
    () => {

      if (listening) {
        recognition.stop();
      } else {
        recognition.start();
      }

    };

} else {

  voiceBtn.onclick =
    () => {

      alert(
        "المتصفح لا يدعم التعرف على الصوت. جرّب Chrome."
      );

    };

}


function speak(text) {

  if (
    !("speechSynthesis" in window)
  ) {
    return;
  }

  speechSynthesis.cancel();

  const speech =
    new SpeechSynthesisUtterance(
      text
    );

  speech.lang =
    "ar-TN";

  speech.rate =
    0.95;

  speechSynthesis.speak(
    speech
  );
}


$("#fileInput").onchange =
  (event) => {

    const file =
      event.target.files[0];

    if (file) {

      $("#filePreview")
        .textContent =
        "📎 " +
        file.name +
        " — الرفع تجريبي حاليًا؛ تحليل الملف يحتاج Backend.";

    }

  };


function bindSuggestions() {

  document
    .querySelectorAll(
      "[data-prompt]"
    )
    .forEach((button) => {

      button.onclick =
        () => send(
          button.dataset.prompt
        );

    });

}


bindSuggestions();

renderHistory();
