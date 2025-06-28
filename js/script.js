let currentQuestionIndex = 0;
let totalQuestions = 0;
let score = 0;
let allowAnswer = true;
let wrongAnswers = []; // ✅ ভুল উত্তর ট্র্যাক করার জন্য

// ✅ অডিও লোড
const correctSound = new Audio("audio/correct.mp3");
const wrongSound = new Audio("audio/wrong.mp3");

// ✅ এলোমেলো করার ফাংশন
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let allQuestions = Array.from(document.querySelectorAll(".question-box"));

  // ✅ প্রশ্ন এলোমেলো করো
  shuffleArray(allQuestions);

  const container = allQuestions[0].parentNode;
  allQuestions.forEach(q => container.appendChild(q)); // DOM-এ আবার সাজাও

  totalQuestions = allQuestions.length;
  showQuestion(currentQuestionIndex, allQuestions);

  document.addEventListener("keydown", (e) => {
    if (!allowAnswer) {
      if (e.key === "Enter") showNextQuestion(allQuestions);
      return;
    }

    if (["1", "2", "3", "4"].includes(e.key)) {
      const options = allQuestions[currentQuestionIndex].querySelectorAll(".option");
      const index = parseInt(e.key) - 1;
      if (options[index]) options[index].click();
    }
  });
});

function showQuestion(index, allQuestions) {
  allQuestions.forEach((q, i) => q.style.display = i === index ? "block" : "none");

  const question = allQuestions[index];
  const options = Array.from(question.querySelectorAll(".option"));
  const answerDiv = question.querySelector(".answer");
  const explanationDiv = question.querySelector(".explanation");

  // ✅ অপশন এলোমেলো করো
  shuffleArray(options);
  const optionContainer = options[0].parentNode;
  options.forEach(opt => optionContainer.appendChild(opt)); // DOM-এ সাজাও

  answerDiv.style.display = "none";
  explanationDiv.style.display = "none";

  allowAnswer = true;

  options.forEach(btn => {
    btn.onclick = () => {
      if (!allowAnswer) return;

      const userText = btn.textContent.trim();
      const correctText = answerDiv.textContent.replace("✅ সঠিক উত্তর:", "").trim();

      if (userText === correctText) {
        btn.classList.add("correct");
        correctSound.play();
        score++;
      } else {
        btn.classList.add("incorrect");
        wrongSound.play();
        options.forEach(opt => {
          if (opt.textContent.trim() === correctText) opt.classList.add("correct");
        });

        // ✅ ভুল উত্তর ট্র্যাক করো
        wrongAnswers.push({
          question: question.querySelector("h3").innerText,
          yourAnswer: userText,
          correctAnswer: correctText,
          explanation: explanationDiv.innerHTML
        });
      }

      answerDiv.style.display = "block";
      explanationDiv.style.display = "block";
      allowAnswer = false;

      if (!question.querySelector(".next-btn")) {
        const nextBtn = document.createElement("button");
        nextBtn.className = "next-btn";
        nextBtn.innerText = "পরবর্তী প্রশ্ন (Enter)";
        nextBtn.onclick = () => showNextQuestion(allQuestions);
        question.appendChild(nextBtn);
      }
    };
  });
}

function showNextQuestion(allQuestions) {
  if (currentQuestionIndex < totalQuestions - 1) {
    currentQuestionIndex++;
    showQuestion(currentQuestionIndex, allQuestions);
  } else {
    showResult();
  }
}

function showResult() {
  let reviewHTML = "";
  if (wrongAnswers.length > 0) {
    reviewHTML = `
      <div class="review">
        <h2>🔁 ভুল উত্তর পর্যালোচনা</h2>
        ${wrongAnswers.map((item, i) => `
          <div class="review-item">
            <h4>প্রশ্ন ${i + 1}: ${item.question}</h4>
            <p>❌ আপনার উত্তর: <span class="wrong">${item.yourAnswer}</span></p>
            <p>✅ সঠিক উত্তর: <span class="correct">${item.correctAnswer}</span></p>
            <div class="explanation">${item.explanation}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  document.body.innerHTML = `
    <header>🎉 কুইজ শেষ</header>
    <div class="intro">
      ✅ আপনার স্কোর: ${score} / ${totalQuestions} <br><br>
      📘 ধন্যবাদ অনুশীলনের জন্য!
    </div>
    ${reviewHTML}
    <footer><a href="index.html">🏠 হোমে ফিরুন</a></footer>
  `;
}
