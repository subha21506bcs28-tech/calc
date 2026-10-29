
document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display");
  const expression = document.getElementById("expression");
  const buttons = document.querySelector(".buttons");

  let currentInput = "";
  let justCalculated = false;

  function updateDisplay() {
    display.textContent = currentInput || "0";
  }

  function append(value) {
    if (justCalculated) {
      if ("+-*/".includes(value)) {
        justCalculated = false;
      } else {
        currentInput = "";
        justCalculated = false;
      }
    }

    if (value === ".") {
      const currentNumber = currentInput
        .split(/[+\-*/()]/)
        .pop();

      if (currentNumber.includes(".")) return;

      if (currentNumber === "") {
        currentInput += "0";
      }
    }

    const lastChar = currentInput.slice(-1);

    if (
      "+-*/".includes(value) &&
      "+-*/".includes(lastChar)
    ) {
      currentInput = currentInput.slice(0, -1);
    }

    currentInput += value;
    expression.textContent = "";
    updateDisplay();
  }

  function clearAll() {
    currentInput = "";
    justCalculated = false;
    expression.textContent = "";
    updateDisplay();
  }

  function deleteLast() {
    currentInput = currentInput.slice(0, -1);
    justCalculated = false;
    expression.textContent = "";
    updateDisplay();
  }

  function calculate() {
    if (!currentInput.trim()) return;

    try {
      const safeExpression = currentInput;

      // Allow calculator characters only.
      if (!/^[0-9+\-*/().\s]+$/.test(safeExpression)) {
        throw new Error("Invalid expression");
      }

      // Prevent incomplete expressions.
      if (/[+\-*/.(]$/.test(safeExpression)) {
        throw new Error("Incomplete expression");
      }

      // Evaluate the mathematical expression.
      const result = Function(
        '"use strict"; return (' + safeExpression + ')'
      )();

      // Check for division by zero.
      if (
        typeof result === "number" &&
        !Number.isFinite(result) &&
        safeExpression.includes("/")
      ) {
        display.textContent = "Oopsie! ♡";
        expression.textContent = "Zero Div Error 🌸";

        currentInput = "";
        justCalculated = false;
        return;
      }

      // Handle other invalid results.
      if (
        typeof result !== "number" ||
        !Number.isFinite(result)
      ) {
        throw new Error("Invalid result");
      }

      // Show the normal calculation result.
      expression.textContent = safeExpression + " =";

      currentInput = String(
        Number.parseFloat(result.toPrecision(12))
      );

      justCalculated = true;
      updateDisplay();

    } catch (error) {
      display.textContent = "Oopsie! ♡";
      expression.textContent = "Something went wrong 🌷";

      currentInput = "";
      justCalculated = false;
    }
  }

  // Handle calculator button clicks.
  buttons.addEventListener("click", (event) => {
    const button = event.target.closest("button");

    if (!button) return;

    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === "clear") {
      clearAll();
    } else if (action === "delete") {
      deleteLast();
    } else if (action === "calculate") {
      calculate();
    } else if (value !== undefined) {
      append(value);
    }
  });

  // Support keyboard input.
  document.addEventListener("keydown", (event) => {
    if (/^[0-9.]$/.test(event.key)) {
      append(event.key);
    } else if (
      ["+", "-", "*", "/", "(", ")"].includes(event.key)
    ) {
      append(event.key);
    } else if (
      event.key === "Enter" ||
      event.key === "="
    ) {
      event.preventDefault();
      calculate();
    } else if (event.key === "Backspace") {
      deleteLast();
    } else if (event.key === "Escape") {
      clearAll();
    }
  });

  // Initialize the calculator display.
  updateDisplay();
});
