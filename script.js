// This section connects JavaScript with HTML elements.
// It selects the form, student information fields,
// subject container, and add subject button so they can be controlled using JavaScript.
const form = document.getElementById("grade-form");
const studentName = document.getElementById("student-name");
const studentId = document.getElementById("student-id");
const subjectsContainer = document.getElementById("subjects-container");
const addSubjectBtn = document.getElementById("add-subject-btn");
// This section selects the result and control elements from HTML.
// It connects JavaScript with the report card, grade display, progress bar,
// buttons, theme controls, and subject report table.
// The storage keys are used to save and load student data and theme settings using Local Storage.
const resultCard = document.getElementById("result-card");
const resultName = document.getElementById("result-name");
const resultId = document.getElementById("result-id");
const statTotal = document.getElementById("stat-total");
const statTotalUnit = document.getElementById("stat-total-unit");
const statAverage = document.getElementById("stat-average");
const statPercentage = document.getElementById("stat-percentage");
const statCredits = document.getElementById("stat-credits");
const statGpa = document.getElementById("stat-gpa");
const progressFill = document.getElementById("progress-fill");
const progressCaption = document.getElementById("progress-caption");
const gradeStamp = document.getElementById("grade-stamp");
const gradeLetter = document.getElementById("grade-letter");
const statusPill = document.getElementById("status-pill");
const performanceMsg = document.getElementById("performance-msg");
const errorList = document.getElementById("error-list");
const resetBtn = document.getElementById("reset-btn");
const copyBtn = document.getElementById("copy-btn");
const printBtn = document.getElementById("print-btn");
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const themeLabel = document.getElementById("theme-label");
const confettiLayer = document.getElementById("confetti-layer");
const subjectTableBody = document.getElementById("subject-table-body");
const STORAGE_KEY = "gradeCalculator.lastStudent";
const THEME_KEY = "gradeCalculator.theme";
// This function saves the student's information and subject results in Local Storage.
// It stores the student name, ID, subject names, and marks so the data can be recovered
// even after refreshing or reopening the page.
function saveStudentToLocalStorage() {
  const student = {
    name: studentName.value.trim(),
    id: studentId.value.trim(),
    subjects: getSubjectEntries().map((entry) => ({
      name: entry.name,
      credit: entry.credit,
      marks: entry.marks,
    })),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(student));
}
// This function automatically saves changes when the user edits an input field.
// It also removes any error style from the input and updates the saved student data in Local Storage.
function wireFieldAutoSave(input) {
  input.addEventListener("input", () => {
    input.classList.remove("input-error");
    saveStudentToLocalStorage();
  });
}
// This function collects all subject information entered by the user.
// It gets each subject name and mark from the subject rows and returns them as an array
// so they can be used for calculation, saving data, and generating the report card.
function getSubjectEntries() {
  return Array.from(subjectsContainer.querySelectorAll(".subject-row")).map((row, index) => {
    const nameInput = row.querySelector(".subject-name-input");
    const creditInput = row.querySelector(".credit-input");
    const markInput = row.querySelector(".mark-input");
    return {
      name: nameInput ? nameInput.value.trim() : `Subject ${index + 1}`,
      credit: creditInput ? creditInput.value.trim() : "",
      marks: markInput ? markInput.value.trim() : "",
      nameInput,
      creditInput,
      markInput,
    };
  });
}
// This function safely adds event listeners to HTML elements.
// It checks if the element exists before adding the event.
// If an element is missing, it shows a warning instead of stopping the whole program.
function safeOn(element, eventName, handler, label) {
  if (!element) {
    console.warn(
      `[Grade Calculator] Could not attach "${eventName}" listener — element "${label}" was not found in the HTML.`
    );
    return;
  }
  element.addEventListener(eventName, handler);
}
// This function checks if the student name and subject marks are valid.
// It makes sure the name is entered and all marks are between 0 and 100.
// If there are mistakes, it returns error messages.
function validateInputs(name, subjectEntries) {
  const errors = [];

  if (!name.trim()) {
    errors.push("Student Name is required.");
  }

  subjectEntries.forEach((entry, index) => {
    const creditValue = Number(entry.credit);
    const markValue = Number(entry.marks);

    if (entry.credit.trim() === "" || isNaN(creditValue) || creditValue <= 0) {
      errors.push(`Subject ${index + 1} credit hour must be a number greater than 0.`);
    }

    if (entry.marks.trim() === "" || isNaN(markValue) || markValue < 0 || markValue > 100) {
      errors.push(`Subject ${index + 1} marks must be a number between 0 and 100.`);
    }
  });

  return errors;
}
// This function displays error messages to the user.
// It shows the errors if there are any mistakes, and hides the error list when there are no errors.
function showErrors(errors) {
  errorList.innerHTML = "";
  if (errors.length === 0) {
    errorList.hidden = true;
    return;
  }
  errors.forEach((message) => {
    const li = document.createElement("li");
    li.textContent = message;
    errorList.appendChild(li);
  });
  errorList.hidden = false;
}
// This function highlights incorrect mark inputs.
// It checks if the marks are empty or outside the range of 0 to 100,
// then adds an error style to the invalid input fields.
function highlightInvalidInputs(subjectEntries) {
  subjectEntries.forEach((entry, index) => {
    const creditInput = entry.creditInput;
    const markInput = entry.markInput;
    const creditValue = Number(entry.credit);
    const markValue = Number(entry.marks);

    const creditInvalid = entry.credit.trim() === "" || isNaN(creditValue) || creditValue <= 0;
    const markInvalid = entry.marks.trim() === "" || isNaN(markValue) || markValue < 0 || markValue > 100;

    if (creditInput) creditInput.classList.toggle("input-error", creditInvalid);
    if (markInput) markInput.classList.toggle("input-error", markInvalid);
  });
}

// calculate result
function calculateResults(marks) {
  const total = marks.reduce((sum, mark) => sum + mark, 0);
  const average = total / marks.length;
  const percentage = (total / (marks.length * 100)) * 100;
  return { total, average, percentage };
}
//get grade
function getGrade(percentage) {
  if (percentage >= 90) return "A+";
  if (percentage >= 85) return "A";
  if (percentage >= 80) return "A-";
  if (percentage >= 75) return "B+";
  if (percentage >= 70) return "B";
  if (percentage >= 65) return "B-";
  if (percentage >= 60) return "C+";
  if (percentage >= 50) return "C";
  return "F";
}
//get gpa
function getGpa(percentage) {
  if (percentage >= 90) return 4.0;
  if (percentage >= 85) return 4.0;
  if (percentage >= 80) return 3.75;
  if (percentage >= 75) return 3.5;
  if (percentage >= 70) return 3.0;
  if (percentage >= 65) return 2.75;
  if (percentage >= 60) return 2.5;
  if (percentage >= 50) return 2.0;
  return 0.0;
}
//get status
function getStatus(percentage) {
  return percentage >= 50 ? "Pass" : "Fail";
}
//performancemessage
function getPerformanceMessage(grade) {
  switch (grade) {
    case "A+": return "Excellent! 🌟";
    case "A": return "Great Job! 🎉";
    case "B+": return "Good Work! 👍";
    case "B": return "Good But Keep Improving. 💪";
    case "B-": return "Study Harder. 📖";
    case "C+": return "Keep Going! 📘";
    case "C": return "You're Getting There! 📗";
    case "F": return "Better Luck Next Time. 🍀";
    default: return "Give it your best next time!";
  }
}
// This function converts grade symbols like A+ into a format that can be used as a CSS class name.
function gradeToClassSuffix(grade) {
  return grade.replace(/\+/g, "plus");
}
// This function gets all mark input fields from the subject section.
function getMarkInputs() {
  return Array.from(subjectsContainer.querySelectorAll(".mark-input"));
}
// This function updates subject row numbers and IDs after adding or removing subjects.
function updateSubjectRows() {
  Array.from(subjectsContainer.querySelectorAll(".subject-row")).forEach((row, index) => {
    const rowNumber = index + 1;
    const nameInput = row.querySelector(".subject-name-input");
    const creditInput = row.querySelector(".credit-input");
    const markInput = row.querySelector(".mark-input");
    const labels = row.querySelectorAll("label");

    if (nameInput) {
      nameInput.id = `subject-name-${rowNumber}`;
      if (labels[0]) labels[0].htmlFor = nameInput.id;
    }

    if (creditInput) {
      creditInput.id = `subject-credit-${rowNumber}`;
      if (labels[1]) labels[1].htmlFor = creditInput.id;
    }

    if (markInput) {
      markInput.id = `subject${rowNumber}`;
      if (labels[2]) labels[2].htmlFor = markInput.id;
    }
  });
}
// This function creates a new subject input row dynamically.
// It adds fields for subject name and marks, and also provides a remove button for extra subjects.
function createSubjectField(subject = { name: "", credit: "", marks: "" }) {
  const row = document.createElement("div");
  row.className = "subject-row";

  const inputIndex = getSubjectEntries().length + 1;

  const nameField = document.createElement("div");
  nameField.className = "field";
  const nameLabel = document.createElement("label");
  nameLabel.htmlFor = `subject-name-${inputIndex}`;
  nameLabel.textContent = "Subject Name";
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = `subject-name-${inputIndex}`;
  nameInput.className = "subject-name-input";
  nameInput.placeholder = "e.g. Mathematics";
  nameInput.autocomplete = "off";
  nameInput.value = subject.name || "";
  wireFieldAutoSave(nameInput);
  nameField.appendChild(nameLabel);
  nameField.appendChild(nameInput);

  const creditField = document.createElement("div");
  creditField.className = "field";
  const creditLabel = document.createElement("label");
  creditLabel.htmlFor = `subject-credit-${inputIndex}`;
  creditLabel.textContent = "Credit Hour (Cr Hr)";
  const creditInput = document.createElement("input");
  creditInput.type = "number";
  creditInput.id = `subject-credit-${inputIndex}`;
  creditInput.className = "credit-input";
  creditInput.min = "1";
  creditInput.step = "1";
  creditInput.placeholder = "e.g. 3";
  creditInput.value = subject.credit || "";
  creditInput.addEventListener("input", () => creditInput.classList.remove("input-error"));
  wireFieldAutoSave(creditInput);
  creditField.appendChild(creditLabel);
  creditField.appendChild(creditInput);

  const markField = document.createElement("div");
  markField.className = "field";
  const markLabel = document.createElement("label");
  markLabel.htmlFor = `subject${inputIndex}`;
  markLabel.textContent = "Marks";
  const markInput = document.createElement("input");
  markInput.type = "number";
  markInput.id = `subject${inputIndex}`;
  markInput.className = "mark-input";
  markInput.min = "0";
  markInput.max = "100";
  markInput.placeholder = "0-100";
  markInput.value = subject.marks || "";
  markInput.addEventListener("input", () => markInput.classList.remove("input-error"));
  wireFieldAutoSave(markInput);
  markField.appendChild(markLabel);
  markField.appendChild(markInput);

  row.appendChild(nameField);
  row.appendChild(creditField);
  row.appendChild(markField);

  if (inputIndex > 1) {
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "btn btn-ghost remove-subject-btn";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", (event) => {
      event.preventDefault();
      row.remove();
      updateSubjectRows();
      saveStudentToLocalStorage();
    });
    row.appendChild(removeButton);
  }

  return row;
}
//reset subject fields
function resetSubjectFields() {
  subjectsContainer.innerHTML = "";
  subjectsContainer.appendChild(createSubjectField());
}
// This function loads saved subjects into the subject input fields.
// It creates subject rows from saved data or creates an empty subject field if no data exists.
function populateSubjectFields(subjects) {
  subjectsContainer.innerHTML = "";

  if (Array.isArray(subjects) && subjects.length > 0) {
    subjects.forEach((subject) => subjectsContainer.appendChild(createSubjectField(subject)));
  } else {
    subjectsContainer.appendChild(createSubjectField());
  }
}
// This function creates the subject report table.
// It displays each subject name, marks, and grade on the report card.
function renderSubjectReport(subjects) {
  if (!subjectTableBody) return;
  subjectTableBody.innerHTML = "";

  subjects.forEach((subject, index) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    const creditCell = document.createElement("td");
    const marksCell = document.createElement("td");
    const gradeCell = document.createElement("td");
    const creditValue = Number(subject.credit) || 0;
    const markValue = Number(subject.marks) || 0;
    nameCell.textContent = subject.name || `Subject ${index + 1}`;
    creditCell.textContent = creditValue;
    marksCell.textContent = markValue;
    gradeCell.textContent = getGrade(markValue);
    row.appendChild(nameCell);
    row.appendChild(creditCell);
    row.appendChild(marksCell);
    row.appendChild(gradeCell);
    subjectTableBody.appendChild(row);
  });
}
// This function creates a confetti animation when a student gets a high grade.
// It adds celebration effects to make the result page more attractive.
function launchConfetti() {
  const emojis = ["🎉", "⭐", "🎊", "✨", "🏆"];
  const pieceCount = 30;
  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.textContent = emojis[i % emojis.length];
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.animationDuration = `${2 + Math.random() * 1.5}s`;
    piece.style.animationDelay = `${Math.random() * 0.4}s`;
    piece.style.fontSize = `${1 + Math.random()}rem`;
    confettiLayer.appendChild(piece);
    piece.addEventListener("animationend", () => piece.remove());
  }
}
// This is the main function that calculates the student's result.
// It validates inputs, calculates total marks, average, percentage, grade, GPA,
// updates the report card, progress bar, and displays the final result.
function calculateResult() {
  const subjectEntries = getSubjectEntries();
  const errors = validateInputs(studentName.value, subjectEntries);
  showErrors(errors);
  highlightInvalidInputs(subjectEntries);

  if (errors.length > 0) {
    resultCard.hidden = true;
    return;
  }

  const marks = subjectEntries.map((entry) => Number(entry.marks));
  const { total, average, percentage } = calculateResults(marks);
  const studentGrade = getGrade(percentage);

  const weightedSum = subjectEntries.reduce((sum, entry) => {
    const credit = Number(entry.credit);
    return sum + getGpa(Number(entry.marks)) * credit;
  }, 0);
  const totalCredits = subjectEntries.reduce((sum, entry) => sum + Number(entry.credit), 0);
  const studentGpa = totalCredits > 0 ? weightedSum / totalCredits : 0;
  const resultStatus = getStatus(percentage);
  const performance = getPerformanceMessage(studentGrade);

  saveStudentToLocalStorage();
  renderSubjectReport(subjectEntries);

  resultName.textContent = studentName.value.trim();
  resultId.textContent = studentId.value.trim() ? `ID: ${studentId.value.trim()}` : "";
  statTotal.textContent = total;
  // Dynamic total unit: "/ 500" for 5 subjects, "/ 600" for 6, "/ 700" for 7, etc.
  statTotalUnit.textContent = `/ ${getMarkInputs().length * 100}`;
  statAverage.textContent = average.toFixed(1);
  statPercentage.textContent = `${percentage.toFixed(1)}%`;
  statCredits.textContent = totalCredits;
  statGpa.textContent = studentGpa.toFixed(2);
  progressFill.style.width = `${percentage}%`;
  progressCaption.textContent = `${percentage.toFixed(1)}% of total marks (${total} / ${getMarkInputs().length * 100})`;
  progressFill.style.background = resultStatus === "Pass"
    ? "linear-gradient(90deg, var(--azure), var(--emerald))"
    : "linear-gradient(90deg, var(--burnt), var(--crimson))";

  gradeStamp.className = "stamp";
  gradeStamp.classList.add(`grade-${gradeToClassSuffix(studentGrade)}`, "stamp-in");
  gradeLetter.textContent = studentGrade;
  statusPill.textContent = resultStatus;
  statusPill.className = `status-pill ${resultStatus.toLowerCase()}`;
  performanceMsg.textContent = performance;
  resultCard.hidden = false;
  resultCard.scrollIntoView({ behavior: "smooth", block: "nearest" });

  if (studentGrade === "A+") launchConfetti();
}

// Reset all thing

function resetForm(){
    form.reset();
    errorList.innerHTML = "";
    errorList.hidden = true;
    getMarkInputs().forEach((input) => input.classList.remove("input-error"));
    resultCard.hidden = true;
    progressFill.style.width = "0%";
    progressCaption.textContent = "0% of total marks";
    statTotalUnit.textContent = "/ 500";
    statCredits.textContent = "0";
    statGpa.textContent = "0.00";
    localStorage.removeItem(STORAGE_KEY);
    resetSubjectFields();
    if (subjectTableBody) subjectTableBody.innerHTML = "";
}
// This function changes the website theme between dark mode and light mode.
// It updates the page style, button icon, theme label, and saves the selected theme.
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document.body.classList.toggle("dark", theme === "dark");
  themeIcon.textContent = theme === "dark" ? "🌞" : "🌙";
  themeLabel.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
  localStorage.setItem(THEME_KEY, theme);
}
// Copy the latest report card summary to the clipboard.
async function copyResultSummary() {
  const subjectEntries = getSubjectEntries();
  const student = studentName.value.trim() || "Unknown Student";
  const id = studentId.value.trim() || "No ID";
  const marks = subjectEntries.map((entry) => Number(entry.marks) || 0);
  const total = marks.reduce((sum, mark) => sum + mark, 0);
  const average = marks.length > 0 ? total / marks.length : 0;
  const percentage = marks.length > 0 ? (total / (marks.length * 100)) * 100 : 0;
  const grade = getGrade(percentage);
  const status = getStatus(percentage);

  const lines = [
    `Student: ${student}`,
    `ID: ${id}`,
    `Total: ${total}`,
    `Average: ${average.toFixed(1)}`,
    `Percentage: ${percentage.toFixed(1)}%`,
    `Grade: ${grade}`,
    `Status: ${status}`,
    "",
    "Subjects:",
  ];

  subjectEntries.forEach((entry, index) => {
    const credit = Number(entry.credit) || 0;
    const mark = Number(entry.marks) || 0;
    lines.push(
      `- ${entry.name || `Subject ${index + 1}`}: ${mark} marks (${credit} Cr Hr), Grade ${getGrade(mark)}`
    );
  });

  const text = lines.join("\n");

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const tempArea = document.createElement("textarea");
      tempArea.value = text;
      document.body.appendChild(tempArea);
      tempArea.select();
      document.execCommand("copy");
      tempArea.remove();
    }

    const originalLabel = copyBtn ? copyBtn.innerHTML : "";
    if (copyBtn) {
      copyBtn.innerHTML = '<span aria-hidden="true">✅</span> Copied!';
      copyBtn.disabled = true;
    }

    window.setTimeout(() => {
      if (copyBtn) {
        copyBtn.innerHTML = originalLabel;
        copyBtn.disabled = false;
      }
    }, 1500);
  } catch (error) {
    console.warn("Could not copy summary:", error);
    if (copyBtn) {
      copyBtn.innerHTML = '<span aria-hidden="true">⚠️</span> Copy Failed';
      window.setTimeout(() => {
        copyBtn.innerHTML = '<span aria-hidden="true">📋</span> Copy Summary';
      }, 1500);
    }
  }
}

// to Print
function printResult(){

    window.print();

}
// Dark Mode

function toggleTheme(){
    const currentTheme = localStorage.getItem(THEME_KEY) || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
}



// local  storage

function loadFromLocalStorage() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
        const student = JSON.parse(raw);
        studentName.value = student.name || "";
        studentId.value = student.id || "";
        populateSubjectFields(student.subjects || []);

        const hasSubjects = Array.isArray(student.subjects) && student.subjects.length > 0;
        const hasName = typeof student.name === "string" && student.name.trim() !== "";
        if (hasName && hasSubjects) {
            calculateResult();
        }
    } catch (error) {
        console.warn("Could not load saved student data:", error);
    }
}
// This section connects buttons and form actions with their functions.
// It handles submitting the form, resetting data, printing the result,
// and switching between dark mode and light mode.

safeOn(form, "submit", function (event) {
  event.preventDefault();
  calculateResult();
}, "grade-form");

safeOn(resetBtn, "click", resetForm, "reset-btn");
safeOn(copyBtn, "click", copyResultSummary, "copy-btn");
safeOn(printBtn, "click", printResult, "print-btn");
safeOn(themeToggleBtn, "click", toggleTheme, "theme-toggle");

// This section handles the Add Subject button.
// It prevents form submission, creates a new subject field,
// adds it to the page, and saves the updated data.
if (addSubjectBtn) addSubjectBtn.type = "button";
safeOn(addSubjectBtn, "click", (event) => {
  event.preventDefault();
  subjectsContainer.appendChild(createSubjectField());
  saveStudentToLocalStorage();
}, "add-subject-btn");
// This function initializes the application when the page loads.
// It loads the saved theme settings and student data from Local Storage.
function initApp() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(savedTheme);
  loadFromLocalStorage();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}