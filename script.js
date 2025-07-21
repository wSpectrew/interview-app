const allQuestions = [
  // 30 Seconds Section
  { text: "What is the total tuition fee for your course? Can you provide a breakdown for the full duration?", readTime: 12, answerTime: 20 },
  { text: "How many campuses does the university have? Which campus will you be studying at?", readTime: 11, answerTime: 20 },
  { text: "What is the address of the campus you will be attending?", readTime: 10, answerTime: 22 },
  { text: "Where do you plan to live while studying? Have you already booked your accommodation?", readTime: 13, answerTime: 20 },
  { text: "Do you have any dependents accompanying you?", readTime: 10, answerTime: 10 },
  { text: "Have you previously applied for a UK visa?", readTime: 10, answerTime: 10 },
  { text: "Have you ever had a visa refusal from the UK or any other country?", readTime: 11, answerTime: 12 },

  // 1 Minute Section
  { text: "Did you consider any other courses before choosing this one? Which courses were they?", readTime: 12, answerTime: 50 },
  { text: "Can you list some of the modules you’ll be studying in this course? Which module attracted you the most and why?", readTime: 14, answerTime: 48 },
  { text: "What facilities does your chosen university offer to students?", readTime: 11, answerTime: 45 },
  { text: "What do you know about the local area surrounding the university? Are there any popular tourist spots nearby?", readTime: 13, answerTime: 50 },
  { text: "Why didn’t you choose to study this course in your home country?", readTime: 12, answerTime: 45 },
  { text: "Are you aware of the UKVI guidelines on working rights for international students? Do you plan to work part-time while studying?", readTime: 15, answerTime: 50 },
  { text: "Where do you plan to live and how much will it cost per month? Have you confirmed your accommodation?", readTime: 13, answerTime: 50 },
  { text: "How will you commute between your accommodation and the university campus?", readTime: 10, answerTime: 30 },
  { text: "If you're unable to get university accommodation, what alternative arrangements will you make?", readTime: 11, answerTime: 30 },
  { text: "What is your most recent academic qualification and when did you complete it?", readTime: 10, answerTime: 40 },
  { text: "What did you learn during your previous studies that you think will help you in this course?", readTime: 11, answerTime: 45 },
  { text: "What are your long-term career plans? Which companies would you like to work for, and what is your expected salary after graduation?", readTime: 14, answerTime: 50 },
  { text: "Does this course align with your future career goals? How?", readTime: 12, answerTime: 40 },
  { text: "Do you plan to pursue further education in the UK after completing this course? If yes, what and why?", readTime: 13, answerTime: 45 },
  { text: "What have you been doing since completing your last academic qualification?", readTime: 11, answerTime: 30 },
  { text: "What are your current job responsibilities? What is your monthly salary?", readTime: 12, answerTime: 40 },
  { text: "If you are already working, why do you want to return to full-time study now?", readTime: 13, answerTime: 45 },

  // 1.5 Minute Section
  { text: "Why did you choose to study this specific course? Which aspects of the course stood out to you?", readTime: 14, answerTime: 70 },
  { text: "Are you familiar with the course structure and the assessment methods?", readTime: 11, answerTime: 50 },
  { text: "Why did you choose this particular university? Did you research or apply to any other institutions?", readTime: 12, answerTime: 65 },
  { text: "Why do you want to study in the UK? Did you consider other countries like Canada, Australia, or Ireland? Why not those?", readTime: 14, answerTime: 65 },
  { text: "How much do you expect your living expenses to be per month (food, travel, phone, socializing, etc.)?", readTime: 12, answerTime: 50 },
  { text: "How do you plan to fund your tuition fees and living costs? Can you give details of the financial arrangements?", readTime: 15, answerTime: 60 },
  { text: "Who is sponsoring your education? What is their relationship to you? What is their occupation or business?", readTime: 14, answerTime: 60 },
  { text: "If a UK company offers you a job after graduation with a competitive salary, would you consider staying in the UK? Why or why not?", readTime: 13, answerTime: 60 },

  // Personalized Bonus Questions
  { text: "What steps have you taken to prepare yourself for life in the UK (cultural differences, weather, food, etc.)?", readTime: 13, answerTime: 50 },
  { text: "How do you plan to manage your time between studies, part-time work, and other responsibilities?", readTime: 11, answerTime: 45 },
  { text: "How does your chosen course relate to the industry back home in Bangladesh?", readTime: 12, answerTime: 50 },
  { text: "What are the key differences between education in the UK and your home country, and how will this benefit you?", readTime: 14, answerTime: 55 },
  { text: "How will this qualification help you scale your family’s business or start your own?", readTime: 12, answerTime: 50 },
  { text: "Tell me about any challenges you might face in the UK and how you plan to overcome them.", readTime: 13, answerTime: 55 },
  { text: "How did you choose this university over others offering the same course? What factors influenced your decision?", readTime: 14, answerTime: 55 },
  { text: "If your visa gets delayed or rejected, what will be your next step?", readTime: 11, answerTime: 40 }
];


// Shuffle and select 6 random questions
const shuffled = allQuestions.sort(() => 0.5 - Math.random());
const questions = shuffled.slice(0, 6);

let currentQuestion = 0;
let mediaRecorder, recordedChunks = [], stream;

const preview = document.getElementById('preview');
const questionBox = document.getElementById('questionBox');
const startBtn = document.getElementById('startBtn');
const retryBtn = document.getElementById('retryBtn');
const downloadLink = document.getElementById('downloadLink');
const countdownEl = document.getElementById('countdown');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

startBtn.onclick = async () => {
  startBtn.style.display = 'none';
  retryBtn.style.display = 'none';
  downloadLink.style.display = 'none';

  stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  preview.srcObject = stream;

  mediaRecorder = new MediaRecorder(stream);
  recordedChunks = [];
  mediaRecorder.ondataavailable = e => recordedChunks.push(e.data);
  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.style.display = 'inline';
    retryBtn.style.display = 'inline';
  };
  mediaRecorder.start();

  askQuestion();
};

function askQuestion() {
  if (currentQuestion >= questions.length) {
    stopInterview();
    return;
  }

  const q = questions[currentQuestion];
  questionBox.textContent = q.text;
  startCountdown(q.readTime, "⏳ Time to read and prepare...", () => {
    startCountdown(q.answerTime, "🎙️ Answer time...", () => {
      currentQuestion++;
      questionBox.textContent = '';
      startCountdown(5, "Next question in...", askQuestion);
    });
  });
}

function startCountdown(duration, label, callback) {
  let timeLeft = duration;
  countdownEl.textContent = timeLeft;
  progressText.textContent = label;
  progressFill.style.width = '100%';

  const interval = setInterval(() => {
    timeLeft--;
    countdownEl.textContent = timeLeft;
    progressFill.style.width = `${(timeLeft / duration) * 100}%`;
    if (timeLeft <= 0) {
      clearInterval(interval);
      callback();
    }
  }, 1000);
}

function stopInterview() {
  questionBox.textContent = "✅ Interview complete!";
  mediaRecorder.stop();
  stream.getTracks().forEach(track => track.stop());
}

retryBtn.onclick = () => location.reload();
