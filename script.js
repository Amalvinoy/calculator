const result = document.getElementById("result");
const keys = document.querySelector(".keys");

function append(value) {
  result.value += value;
}

function clearAll() {
  result.value = "";
}

function backspace() {
  result.value = result.value.slice(0, -1);
}

function calculate() {
  try {
    result.value = eval(result.value) || "";
  } catch {
    result.value = "Error";
  }
}

// Handle button clicks
keys.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const value = btn.dataset.value;
  const action = btn.dataset.action;

  if (value !== undefined) {
    append(value);
  } else if (action === "clear") {
    clearAll();
  } else if (action === "backspace") {
    backspace();
  } else if (action === "equals") {
    calculate();
  }
});
