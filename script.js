const questions = [
  { text: "What motivates you in your work?", readTime: 15, answerTime: 20 },
  { text: "Describe a challenge you faced recently.", readTime: 10, answerTime: 25 },
  { text: "Where do you see yourself in 5 years?", readTime: 15, answerTime: 20 }
];

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
