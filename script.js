"use strict";

const STORAGE_KEYS = {
  transactions: "cbgrid-transactions",
  openingBalance: "cbgrid-opening-balance",
  budgets: "cbgrid-custom-budgets",
  recurringRules: "cbgrid-recurring-rules",
  theme: "cbgrid-theme"
};

const LEGACY_STORAGE_KEYS = {
  transactions: [
    "finora-transactions"
  ],

  openingBalance: [
    "finora-opening-balance"
  ],

  budgets: [
    "finora-custom-budgets",
    "finora-budgets"
  ],

  recurringRules: [
    "finora-recurring-rules"
  ],

  theme: [
    "finora-theme"
  ]
};

const categoryDetails = {
  Housing: {
    icon: "⌂",
    color: "#244f3f"
  },

  Food: {
    icon: "●",
    color: "#e0a458"
  },

  Transport: {
    icon: "→",
    color: "#5d83c5"
  },

  Education: {
    icon: "A",
    color: "#7459be"
  },

  Entertainment: {
    icon: "☆",
    color: "#d2648a"
  },

  Shopping: {
    icon: "◇",
    color: "#d2645a"
  },

  Salary: {
    icon: "€",
    color: "#2e8b66"
  },

  Other: {
    icon: "•",
    color: "#8d938e"
  }
};

function migrateLegacyStorage() {
  Object.entries(
    STORAGE_KEYS
  ).forEach(
    ([storageName, newKey]) => {
      const newValue =
        localStorage.getItem(
          newKey
        );

      if (newValue !== null) {
        return;
      }

      const legacyKeys =
        LEGACY_STORAGE_KEYS[
          storageName
        ] || [];

      for (
        const legacyKey of legacyKeys
      ) {
        const legacyValue =
          localStorage.getItem(
            legacyKey
          );

        if (legacyValue !== null) {
          localStorage.setItem(
            newKey,
            legacyValue
          );

          console.log(
            `Migrated ${legacyKey} to ${newKey}.`
          );

          break;
        }
      }
    }
  );
}

migrateLegacyStorage();

const elements = {
  transactionModal:
    document.getElementById(
      "transaction-modal"
    ),

  settingsModal:
    document.getElementById(
      "settings-modal"
    ),

  budgetModal:
    document.getElementById(
      "budget-modal"
    ),

  transactionForm:
    document.getElementById(
      "transaction-form"
    ),

  settingsForm:
    document.getElementById(
      "settings-form"
    ),

  budgetForm:
    document.getElementById(
      "budget-form"
    ),

  openTransactionButton:
    document.getElementById(
      "open-form-button"
    ),

  emptyAddButton:
    document.getElementById(
      "empty-add-button"
    ),

  openSettingsButton:
    document.getElementById(
      "open-settings-button"
    ),

  changeBalanceButton:
    document.getElementById(
      "change-balance-button"
    ),

  openBudgetButton:
    document.getElementById(
      "open-budget-button"
    ),

  closeTransactionButton:
    document.getElementById(
      "close-form-button"
    ),

  cancelTransactionButton:
    document.getElementById(
      "cancel-button"
    ),

  closeSettingsButton:
    document.getElementById(
      "close-settings-button"
    ),

  cancelSettingsButton:
    document.getElementById(
      "cancel-settings-button"
    ),

  closeBudgetButton:
    document.getElementById(
      "close-budget-button"
    ),

  cancelBudgetButton:
    document.getElementById(
      "cancel-budget-button"
    ),

  editingTransactionId:
    document.getElementById(
      "editing-transaction-id"
    ),

  transactionModalTitle:
    document.getElementById(
      "transaction-modal-title"
    ),

  saveTransactionButton:
    document.getElementById(
      "save-transaction-button"
    ),

  description:
    document.getElementById(
      "description"
    ),

  amount:
    document.getElementById(
      "amount"
    ),

  type:
    document.getElementById(
      "type"
    ),

  category:
    document.getElementById(
      "category"
    ),

  date:
    document.getElementById(
      "date"
    ),

  recurring:
    document.getElementById(
      "recurring"
    ),

  frequency:
    document.getElementById(
      "frequency"
    ),

  frequencyGroup:
    document.getElementById(
      "frequency-group"
    ),

  formError:
    document.getElementById(
      "form-error"
    ),

  openingBalance:
    document.getElementById(
      "opening-balance"
    ),

  editingBudgetId:
    document.getElementById(
      "editing-budget-id"
    ),

  budgetModalTitle:
    document.getElementById(
      "budget-modal-title"
    ),

  budgetName:
    document.getElementById(
      "budget-name"
    ),

  budgetCategory:
    document.getElementById(
      "budget-category"
    ),

  budgetLimit:
    document.getElementById(
      "budget-limit"
    ),

  budgetFormError:
    document.getElementById(
      "budget-form-error"
    ),

  saveBudgetButton:
    document.getElementById(
      "save-budget-button"
    ),

  transactionList:
    document.getElementById(
      "transaction-list"
    ),

  emptyState:
    document.getElementById(
      "empty-state"
    ),

  transactionSearch:
    document.getElementById(
      "transaction-search"
    ),

  typeFilter:
    document.getElementById(
      "transaction-filter"
    ),

  categoryFilter:
    document.getElementById(
      "category-filter"
    ),

  monthFilter:
    document.getElementById(
      "month-filter"
    ),

  clearFiltersButton:
    document.getElementById(
      "clear-filters-button"
    ),

  exportCsvButton:
    document.getElementById(
      "export-csv-button"
    ),

  balanceTotal:
    document.getElementById(
      "balance-total"
    ),

  incomeTotal:
    document.getElementById(
      "income-total"
    ),

  expenseTotal:
    document.getElementById(
      "expense-total"
    ),

  transactionCount:
    document.getElementById(
      "transaction-count"
    ),

  categoryBreakdown:
    document.getElementById(
      "category-breakdown"
    ),

  donutChart:
    document.getElementById(
      "donut-chart"
    ),

  donutTotal:
    document.getElementById(
      "donut-total"
    ),

  budgetList:
    document.getElementById(
      "budget-list"
    ),

  themeButton:
    document.getElementById(
      "theme-button"
    )
};

let transactions = loadJSON(
  STORAGE_KEYS.transactions,
  []
);

let recurringRules = loadJSON(
  STORAGE_KEYS.recurringRules,
  []
);

let budgets = loadJSON(
  STORAGE_KEYS.budgets,
  []
);

let openingBalance = Number(
  localStorage.getItem(
    STORAGE_KEYS.openingBalance
  ) || 0
);

if (!Array.isArray(transactions)) {
  transactions = [];
}

if (!Array.isArray(recurringRules)) {
  recurringRules = [];
}

if (!Array.isArray(budgets)) {
  budgets = [];
}

if (Number.isNaN(openingBalance)) {
  openingBalance = 0;
}

function loadJSON(
  key,
  fallbackValue
) {
  try {
    const savedValue =
      localStorage.getItem(key);

    return savedValue
      ? JSON.parse(savedValue)
      : fallbackValue;
  } catch (error) {
    console.error(
      `Could not load ${key}:`,
      error
    );

    return fallbackValue;
  }
}

function saveAllData() {
  localStorage.setItem(
    STORAGE_KEYS.transactions,
    JSON.stringify(
      transactions
    )
  );

  localStorage.setItem(
    STORAGE_KEYS.recurringRules,
    JSON.stringify(
      recurringRules
    )
  );

  localStorage.setItem(
    STORAGE_KEYS.budgets,
    JSON.stringify(
      budgets
    )
  );

  localStorage.setItem(
    STORAGE_KEYS.openingBalance,
    String(openingBalance)
  );
}

function createId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()}`;
}

function formatCurrency(
  amount,
  maximumFractionDigits = 2
) {
  return new Intl.NumberFormat(
    "en-DE",
    {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits
    }
  ).format(amount);
}

function formatDate(dateString) {
  const date = new Date(
    `${dateString}T12:00:00`
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return dateString;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  ).format(date);
}

function getTodayString() {
  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      now.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
}

function getCurrentMonth() {
  return getTodayString().slice(
    0,
    7
  );
}

function escapeHTML(value) {
  const div =
    document.createElement(
      "div"
    );

  div.textContent =
    String(value ?? "");

  return div.innerHTML;
}

function openModal(modal) {
  if (!modal) {
    return;
  }

  modal.classList.remove(
    "hidden"
  );

  document.body.style.overflow =
    "hidden";
}

function closeModal(modal) {
  if (!modal) {
    return;
  }

  modal.classList.add(
    "hidden"
  );

  const openModalElement =
    document.querySelector(
      ".modal-backdrop:not(.hidden)"
    );

  if (!openModalElement) {
    document.body.style.overflow =
      "";
  }
}

function resetTransactionForm() {
  elements.transactionForm.reset();

  elements.editingTransactionId.value =
    "";

  elements.transactionModalTitle.textContent =
    "Add transaction";

  elements.saveTransactionButton.textContent =
    "Save transaction";

  elements.type.value =
    "expense";

  elements.category.value =
    "Housing";

  elements.date.value =
    getTodayString();

  elements.recurring.checked =
    false;

  elements.frequency.value =
    "weekly";

  elements.frequencyGroup.classList.add(
    "hidden"
  );

  elements.formError.textContent =
    "";
}

function openNewTransactionModal() {
  resetTransactionForm();

  openModal(
    elements.transactionModal
  );

  window.setTimeout(
    () => {
      elements.description.focus();
    },
    50
  );
}

function openEditTransactionModal(
  id
) {
  const transaction =
    transactions.find(
      item => item.id === id
    );

  if (!transaction) {
    return;
  }

  resetTransactionForm();

  elements.editingTransactionId.value =
    transaction.id;

  elements.transactionModalTitle.textContent =
    "Edit transaction";

  elements.saveTransactionButton.textContent =
    "Save changes";

  elements.description.value =
    transaction.description;

  elements.amount.value =
    transaction.amount;

  elements.type.value =
    transaction.type;

  elements.category.value =
    transaction.category;

  elements.date.value =
    transaction.date;

  elements.recurring.checked =
    false;

  elements.frequencyGroup.classList.add(
    "hidden"
  );

  openModal(
    elements.transactionModal
  );

  window.setTimeout(
    () => {
      elements.description.focus();
    },
    50
  );
}

function openSettingsModal() {
  elements.openingBalance.value =
    openingBalance;

  openModal(
    elements.settingsModal
  );

  window.setTimeout(
    () => {
      elements.openingBalance.focus();
      elements.openingBalance.select();
    },
    50
  );
}

function resetBudgetForm() {
  elements.budgetForm.reset();

  elements.editingBudgetId.value =
    "";

  elements.budgetModalTitle.textContent =
    "Add budget";

  elements.saveBudgetButton.textContent =
    "Save budget";

  elements.budgetCategory.value =
    "Food";

  elements.budgetFormError.textContent =
    "";
}

function openNewBudgetModal() {
  resetBudgetForm();

  openModal(
    elements.budgetModal
  );

  window.setTimeout(
    () => {
      elements.budgetName.focus();
    },
    50
  );
}

function openEditBudgetModal(
  id
) {
  const budget =
    budgets.find(
      item => item.id === id
    );

  if (!budget) {
    return;
  }

  resetBudgetForm();

  elements.editingBudgetId.value =
    budget.id;

  elements.budgetModalTitle.textContent =
    "Edit budget";

  elements.saveBudgetButton.textContent =
    "Save changes";

  elements.budgetName.value =
    budget.name;

  elements.budgetCategory.value =
    budget.category;

  elements.budgetLimit.value =
    budget.limit;

  openModal(
    elements.budgetModal
  );

  window.setTimeout(
    () => {
      elements.budgetName.focus();
    },
    50
  );
}

function handleTransactionSubmit(
  event
) {
  event.preventDefault();

  const description =
    elements.description.value
      .trim();

  const amount =
    Number(
      elements.amount.value
    );

  const type =
    elements.type.value;

  const category =
    elements.category.value;

  const date =
    elements.date.value;

  const editingId =
    elements
      .editingTransactionId
      .value;

  if (
    !description ||
    !date ||
    Number.isNaN(amount) ||
    amount <= 0
  ) {
    elements.formError.textContent =
      "Please enter a description, valid amount, and date.";

    return;
  }

  if (
    type !== "income" &&
    type !== "expense"
  ) {
    elements.formError.textContent =
      "Please select a valid transaction type.";

    return;
  }

  if (editingId) {
    const transactionIndex =
      transactions.findIndex(
        transaction =>
          transaction.id ===
          editingId
      );

    if (
      transactionIndex !== -1
    ) {
      transactions[
        transactionIndex
      ] = {
        ...transactions[
          transactionIndex
        ],
        description,
        amount,
        type,
        category,
        date
      };
    }
  } else {
    const newTransaction = {
      id: createId(),
      description,
      amount,
      type,
      category,
      date,
      createdAt:
        Date.now(),
      generatedByRecurringRule:
        null
    };

    transactions.unshift(
      newTransaction
    );

    if (
      elements.recurring.checked
    ) {
      recurringRules.push({
        id: createId(),
        description,
        amount,
        type,
        category,
        frequency:
          elements.frequency.value,
        startDate:
          date,
        lastGeneratedDate:
          date,
        active:
          true
      });
    }
  }

  saveAllData();
  renderDashboard();

  closeModal(
    elements.transactionModal
  );

  resetTransactionForm();
}

function handleSettingsSubmit(
  event
) {
  event.preventDefault();

  const value =
    Number(
      elements.openingBalance.value
    );

  if (
    Number.isNaN(value)
  ) {
    window.alert(
      "Please enter a valid opening balance."
    );

    return;
  }

  openingBalance =
    value;

  saveAllData();
  renderSummary();

  closeModal(
    elements.settingsModal
  );
}

function handleBudgetSubmit(
  event
) {
  event.preventDefault();

  const name =
    elements.budgetName.value
      .trim();

  const category =
    elements.budgetCategory.value;

  const limit =
    Number(
      elements.budgetLimit.value
    );

  const editingId =
    elements.editingBudgetId.value;

  if (
    !name ||
    Number.isNaN(limit) ||
    limit <= 0
  ) {
    elements.budgetFormError.textContent =
      "Please enter a budget name and a valid monthly limit.";

    return;
  }

  if (editingId) {
    const budgetIndex =
      budgets.findIndex(
        budget =>
          budget.id ===
          editingId
      );

    if (
      budgetIndex !== -1
    ) {
      budgets[
        budgetIndex
      ] = {
        ...budgets[
          budgetIndex
        ],
        name,
        category,
        limit
      };
    }
  } else {
    budgets.push({
      id: createId(),
      name,
      category,
      limit,
      createdAt:
        Date.now()
    });
  }

  saveAllData();
  renderBudgets();

  closeModal(
    elements.budgetModal
  );

  resetBudgetForm();
}

function deleteTransaction(
  id
) {
  const transaction =
    transactions.find(
      item => item.id === id
    );

  if (!transaction) {
    return;
  }

  const confirmed =
    window.confirm(
      `Delete "${transaction.description}"?`
    );

  if (!confirmed) {
    return;
  }

  transactions =
    transactions.filter(
      item => item.id !== id
    );

  saveAllData();
  renderDashboard();
}

function deleteBudget(id) {
  const budget =
    budgets.find(
      item => item.id === id
    );

  if (!budget) {
    return;
  }

  const confirmed =
    window.confirm(
      `Delete the "${budget.name}" budget?`
    );

  if (!confirmed) {
    return;
  }

  budgets =
    budgets.filter(
      item => item.id !== id
    );

  saveAllData();
  renderBudgets();
}

function getFilteredTransactions() {
  const searchValue =
    elements.transactionSearch.value
      .trim()
      .toLowerCase();

  const typeValue =
    elements.typeFilter.value;

  const categoryValue =
    elements.categoryFilter.value;

  const monthValue =
    elements.monthFilter.value;

  return [...transactions]
    .filter(
      transaction => {
        const description =
          String(
            transaction.description ||
            ""
          ).toLowerCase();

        const category =
          String(
            transaction.category ||
            ""
          ).toLowerCase();

        const matchesSearch =
          description.includes(
            searchValue
          ) ||
          category.includes(
            searchValue
          );

        const matchesType =
          typeValue === "all" ||
          transaction.type ===
            typeValue;

        const matchesCategory =
          categoryValue === "all" ||
          transaction.category ===
            categoryValue;

        const matchesMonth =
          !monthValue ||
          transaction.date.startsWith(
            monthValue
          );

        return (
          matchesSearch &&
          matchesType &&
          matchesCategory &&
          matchesMonth
        );
      }
    )
    .sort(
      (a, b) => {
        const dateDifference =
          new Date(b.date) -
          new Date(a.date);

        if (
          dateDifference !== 0
        ) {
          return dateDifference;
        }

        return (
          Number(
            b.createdAt || 0
          ) -
          Number(
            a.createdAt || 0
          )
        );
      }
    );
}

function renderTransactions() {
  const filteredTransactions =
    getFilteredTransactions();

  elements.transactionList.innerHTML =
    "";

  elements.emptyState.classList.toggle(
    "hidden",
    filteredTransactions.length >
      0
  );

  filteredTransactions.forEach(
    transaction => {
      const details =
        categoryDetails[
          transaction.category
        ] ||
        categoryDetails.Other;

      const item =
        document.createElement(
          "article"
        );

      item.className =
        "transaction-item";

      const amountSign =
        transaction.type ===
        "income"
          ? "+"
          : "−";

      const amountClass =
        transaction.type ===
        "income"
          ? "amount-income"
          : "amount-expense";

      const recurringBadge =
        transaction
          .generatedByRecurringRule
          ? `
            <span class="transaction-badge">
              Recurring
            </span>
          `
          : "";

      item.innerHTML = `
        <div
          class="transaction-category-icon"
          style="
            background: ${details.color}18;
            color: ${details.color};
          "
        >
          ${details.icon}
        </div>

        <div class="transaction-copy">
          <div class="transaction-title-row">
            <h3>
              ${escapeHTML(
                transaction.description
              )}
            </h3>

            ${recurringBadge}
          </div>

          <p>
            ${escapeHTML(
              transaction.category
            )}
            ·
            ${formatDate(
              transaction.date
            )}
          </p>
        </div>

        <div
          class="
            transaction-amount
            ${amountClass}
          "
        >
          ${amountSign}${formatCurrency(
            transaction.amount
          )}
        </div>

        <div class="transaction-actions">
          <button
            class="small-action-button edit-button"
            type="button"
            data-id="${transaction.id}"
          >
            Edit
          </button>

          <button
            class="small-action-button delete-button"
            type="button"
            data-id="${transaction.id}"
          >
            Delete
          </button>
        </div>
      `;

      elements.transactionList
        .appendChild(item);
    }
  );

  document
    .querySelectorAll(
      ".edit-button"
    )
    .forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            openEditTransactionModal(
              button.dataset.id
            );
          }
        );
      }
    );

  document
    .querySelectorAll(
      ".delete-button"
    )
    .forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            deleteTransaction(
              button.dataset.id
            );
          }
        );
      }
    );
}

function renderSummary() {
  const totals =
    transactions.reduce(
      (
        result,
        transaction
      ) => {
        const amount =
          Number(
            transaction.amount
          ) || 0;

        if (
          transaction.type ===
          "income"
        ) {
          result.income +=
            amount;
        }

        if (
          transaction.type ===
          "expense"
        ) {
          result.expense +=
            amount;
        }

        return result;
      },
      {
        income: 0,
        expense: 0
      }
    );

  const balance =
    openingBalance +
    totals.income -
    totals.expense;

  elements.balanceTotal.textContent =
    formatCurrency(balance);

  elements.incomeTotal.textContent =
    formatCurrency(
      totals.income
    );

  elements.expenseTotal.textContent =
    formatCurrency(
      totals.expense
    );

  elements.transactionCount.textContent =
    transactions.length;
}

function renderCategoryBreakdown() {
  const expenses =
    transactions.filter(
      transaction =>
        transaction.type ===
        "expense"
    );

  const totalExpenses =
    expenses.reduce(
      (
        sum,
        transaction
      ) =>
        sum +
        Number(
          transaction.amount || 0
        ),
      0
    );

  const categoryTotals =
    expenses.reduce(
      (
        result,
        transaction
      ) => {
        const category =
          transaction.category ||
          "Other";

        result[category] =
          (
            result[category] || 0
          ) +
          Number(
            transaction.amount || 0
          );

        return result;
      },
      {}
    );

  const sortedCategories =
    Object.entries(
      categoryTotals
    )
      .sort(
        (
          [, amountA],
          [, amountB]
        ) =>
          amountB -
          amountA
      )
      .slice(
        0,
        8
      );

  elements.categoryBreakdown.innerHTML =
    "";

  elements.donutTotal.textContent =
    formatCurrency(
      totalExpenses,
      0
    );

  if (
    sortedCategories.length ===
    0
  ) {
    elements.categoryBreakdown.innerHTML = `
      <p class="category-empty">
        Expense categories will appear here.
      </p>
    `;

    elements.donutChart.style.background =
      "conic-gradient(#d9ddd8 0deg 360deg)";

    return;
  }

  const gradientSections =
    [];

  let currentDegree =
    0;

  sortedCategories.forEach(
    (
      [
        categoryName,
        amount
      ]
    ) => {
      const details =
        categoryDetails[
          categoryName
        ] ||
        categoryDetails.Other;

      const percentage =
        totalExpenses === 0
          ? 0
          : (
              amount /
              totalExpenses
            ) * 100;

      const sectionDegrees =
        percentage * 3.6;

      gradientSections.push(
        `${details.color} ${currentDegree}deg ${
          currentDegree +
          sectionDegrees
        }deg`
      );

      currentDegree +=
        sectionDegrees;

      const row =
        document.createElement(
          "div"
        );

      row.className =
        "category-row";

      row.innerHTML = `
        <span
          class="category-dot"
          style="
            background:
            ${details.color};
          "
        ></span>

        <span class="category-name">
          ${escapeHTML(
            categoryName
          )}
          ·
          ${percentage.toFixed(
            0
          )}%
        </span>

        <span class="category-value">
          ${formatCurrency(
            amount
          )}
        </span>
      `;

      elements.categoryBreakdown
        .appendChild(row);
    }
  );

  if (
    currentDegree < 360
  ) {
    gradientSections.push(
      `#d9ddd8 ${currentDegree}deg 360deg`
    );
  }

  elements.donutChart.style.background =
    `conic-gradient(
      ${gradientSections.join(",")}
    )`;
}

function renderBudgets() {
  const currentMonth =
    getCurrentMonth();

  const currentMonthExpenses =
    transactions.filter(
      transaction =>
        transaction.type ===
          "expense" &&
        transaction.date.startsWith(
          currentMonth
        )
    );

  const spendingByCategory =
    currentMonthExpenses.reduce(
      (
        result,
        transaction
      ) => {
        const category =
          transaction.category ||
          "Other";

        result[category] =
          (
            result[category] || 0
          ) +
          Number(
            transaction.amount || 0
          );

        return result;
      },
      {}
    );

  elements.budgetList.innerHTML =
    "";

  if (
    budgets.length === 0
  ) {
    elements.budgetList.innerHTML = `
      <div class="budget-empty-state">
        <h3>No budgets yet</h3>

        <p>
          Create your first custom monthly budget.
        </p>

        <button
          class="text-button"
          id="empty-budget-button"
          type="button"
        >
          Add budget →
        </button>
      </div>
    `;

    const emptyBudgetButton =
      document.getElementById(
        "empty-budget-button"
      );

    if (
      emptyBudgetButton
    ) {
      emptyBudgetButton.addEventListener(
        "click",
        openNewBudgetModal
      );
    }

    return;
  }

  const sortedBudgets =
    [...budgets].sort(
      (a, b) =>
        Number(
          a.createdAt || 0
        ) -
        Number(
          b.createdAt || 0
        )
    );

  sortedBudgets.forEach(
    budget => {
      const spent =
        spendingByCategory[
          budget.category
        ] || 0;

      const limit =
        Number(
          budget.limit || 0
        );

      const percentage =
        limit > 0
          ? (
              spent /
              limit
            ) * 100
          : 0;

      const visualPercentage =
        Math.min(
          Math.max(
            percentage,
            0
          ),
          100
        );

      const remaining =
        limit - spent;

      const details =
        categoryDetails[
          budget.category
        ] ||
        categoryDetails.Other;

      let statusClass =
        "";

      if (
        percentage >= 100
      ) {
        statusClass =
          "over-budget";
      } else if (
        percentage >= 80
      ) {
        statusClass =
          "near-budget";
      }

      const item =
        document.createElement(
          "article"
        );

      item.className =
        `budget-item ${statusClass}`;

      item.innerHTML = `
        <div class="budget-card-top">
          <div class="budget-name-group">
            <span
              class="budget-category-icon"
              style="
                background: ${details.color}18;
                color: ${details.color};
              "
            >
              ${details.icon}
            </span>

            <div>
              <h3>
                ${escapeHTML(
                  budget.name
                )}
              </h3>

              <p>
                ${escapeHTML(
                  budget.category
                )}
              </p>
            </div>
          </div>

          <div class="budget-actions">
            <button
              class="small-action-button budget-edit-button"
              data-id="${budget.id}"
              type="button"
            >
              Edit
            </button>

            <button
              class="small-action-button budget-delete-button"
              data-id="${budget.id}"
              type="button"
            >
              Delete
            </button>
          </div>
        </div>

        <div class="budget-values">
          <strong>
            ${formatCurrency(
              spent
            )}
          </strong>

          <span>
            of ${formatCurrency(
              limit
            )}
          </span>
        </div>

        <div class="budget-progress">
          <div
            class="budget-progress-fill"
            style="
              width:
              ${visualPercentage}%;
            "
          ></div>
        </div>

        <div class="budget-item-footer">
          <span>
            ${percentage.toFixed(
              0
            )}% used
          </span>

          <span>
            ${
              remaining >= 0
                ? `${formatCurrency(
                    remaining
                  )} remaining`
                : `${formatCurrency(
                    Math.abs(
                      remaining
                    )
                  )} over`
            }
          </span>
        </div>
      `;

      elements.budgetList
        .appendChild(item);
    }
  );

  document
    .querySelectorAll(
      ".budget-edit-button"
    )
    .forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            openEditBudgetModal(
              button.dataset.id
            );
          }
        );
      }
    );

  document
    .querySelectorAll(
      ".budget-delete-button"
    )
    .forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            deleteBudget(
              button.dataset.id
            );
          }
        );
      }
    );
}

function clearFilters() {
  elements.transactionSearch.value =
    "";

  elements.typeFilter.value =
    "all";

  elements.categoryFilter.value =
    "all";

  elements.monthFilter.value =
    "";

  renderTransactions();
}

function exportTransactionsToCSV() {
  if (
    transactions.length === 0
  ) {
    window.alert(
      "There are no transactions to export."
    );

    return;
  }

  const headers = [
    "Description",
    "Amount",
    "Type",
    "Category",
    "Date"
  ];

  const rows =
    transactions.map(
      transaction => [
        transaction.description,
        Number(
          transaction.amount
        ).toFixed(2),
        transaction.type,
        transaction.category,
        transaction.date
      ]
    );

  const csvContent =
    [headers, ...rows]
      .map(
        row =>
          row
            .map(
              value => {
                const escapedValue =
                  String(
                    value ?? ""
                  ).replace(
                    /"/g,
                    '""'
                  );

                return `"${escapedValue}"`;
              }
            )
            .join(",")
      )
      .join("\n");

  const blob =
    new Blob(
      [csvContent],
      {
        type:
          "text/csv;charset=utf-8;"
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const downloadLink =
    document.createElement(
      "a"
    );

  downloadLink.href =
    url;

  downloadLink.download =
    `cbgrid-transactions-${getTodayString()}.csv`;

  document.body.appendChild(
    downloadLink
  );

  downloadLink.click();
  downloadLink.remove();

  URL.revokeObjectURL(
    url
  );
}

function addDays(
  dateString,
  days
) {
  const date =
    new Date(
      `${dateString}T12:00:00`
    );

  date.setDate(
    date.getDate() + days
  );

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
}

function addMonth(
  dateString
) {
  const date =
    new Date(
      `${dateString}T12:00:00`
    );

  const originalDay =
    date.getDate();

  date.setDate(1);

  date.setMonth(
    date.getMonth() + 1
  );

  const lastDayOfNextMonth =
    new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

  date.setDate(
    Math.min(
      originalDay,
      lastDayOfNextMonth
    )
  );

  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() + 1
    ).padStart(
      2,
      "0"
    );

  const day =
    String(
      date.getDate()
    ).padStart(
      2,
      "0"
    );

  return `${year}-${month}-${day}`;
}

function generateRecurringTransactions() {
  const today =
    getTodayString();

  let dataChanged =
    false;

  recurringRules.forEach(
    rule => {
      if (!rule.active) {
        return;
      }

      if (
        !rule.lastGeneratedDate
      ) {
        rule.lastGeneratedDate =
          rule.startDate ||
          today;

        dataChanged =
          true;
      }

      let nextDate =
        rule.frequency ===
        "weekly"
          ? addDays(
              rule.lastGeneratedDate,
              7
            )
          : addMonth(
              rule.lastGeneratedDate
            );

      let safetyCounter =
        0;

      while (
        nextDate <= today &&
        safetyCounter < 500
      ) {
        const duplicateExists =
          transactions.some(
            transaction =>
              transaction
                .generatedByRecurringRule ===
                rule.id &&
              transaction.date ===
                nextDate
          );

        if (
          !duplicateExists
        ) {
          transactions.push({
            id: createId(),
            description:
              rule.description,
            amount:
              Number(
                rule.amount
              ),
            type:
              rule.type,
            category:
              rule.category,
            date:
              nextDate,
            createdAt:
              Date.now(),
            generatedByRecurringRule:
              rule.id
          });

          dataChanged =
            true;
        }

        rule.lastGeneratedDate =
          nextDate;

        dataChanged =
          true;

        nextDate =
          rule.frequency ===
          "weekly"
            ? addDays(
                nextDate,
                7
              )
            : addMonth(
                nextDate
              );

        safetyCounter +=
          1;
      }
    }
  );

  if (dataChanged) {
    saveAllData();
  }
}

function loadTheme() {
  const savedTheme =
    localStorage.getItem(
      STORAGE_KEYS.theme
    );

  if (
    savedTheme === "dark"
  ) {
    document.body.classList.add(
      "dark-theme"
    );

    elements.themeButton.textContent =
      "☀";

    elements.themeButton.setAttribute(
      "aria-label",
      "Switch to light mode"
    );

    return;
  }

  elements.themeButton.textContent =
    "☾";

  elements.themeButton.setAttribute(
    "aria-label",
    "Switch to dark mode"
  );
}

function toggleTheme() {
  const darkThemeEnabled =
    document.body.classList.toggle(
      "dark-theme"
    );

  localStorage.setItem(
    STORAGE_KEYS.theme,
    darkThemeEnabled
      ? "dark"
      : "light"
  );

  elements.themeButton.textContent =
    darkThemeEnabled
      ? "☀"
      : "☾";

  elements.themeButton.setAttribute(
    "aria-label",
    darkThemeEnabled
      ? "Switch to light mode"
      : "Switch to dark mode"
  );
}

function renderDashboard() {
  renderSummary();
  renderTransactions();
  renderCategoryBreakdown();
  renderBudgets();
}

function registerServiceWorker() {
  if (
    !(
      "serviceWorker" in
      navigator
    )
  ) {
    console.warn(
      "Service workers are not supported by this browser."
    );

    return;
  }

  window.addEventListener(
    "load",
    async () => {
      try {
        const registration =
          await navigator
            .serviceWorker
            .register(
              "./service-worker.js",
              {
                scope: "./"
              }
            );

        console.log(
          "CBGrid service worker registered:",
          registration.scope
        );

        registration.addEventListener(
          "updatefound",
          () => {
            const newWorker =
              registration.installing;

            if (!newWorker) {
              return;
            }

            newWorker.addEventListener(
              "statechange",
              () => {
                if (
                  newWorker.state ===
                    "installed" &&
                  navigator
                    .serviceWorker
                    .controller
                ) {
                  console.log(
                    "A new CBGrid version is available."
                  );
                }
              }
            );
          }
        );
      } catch (error) {
        console.error(
          "CBGrid service worker registration failed:",
          error
        );
      }
    }
  );
}

elements.openTransactionButton
  .addEventListener(
    "click",
    openNewTransactionModal
  );

elements.emptyAddButton
  .addEventListener(
    "click",
    openNewTransactionModal
  );

elements.openSettingsButton
  .addEventListener(
    "click",
    openSettingsModal
  );

elements.changeBalanceButton
  .addEventListener(
    "click",
    openSettingsModal
  );

elements.openBudgetButton
  .addEventListener(
    "click",
    openNewBudgetModal
  );

elements.closeTransactionButton
  .addEventListener(
    "click",
    () => {
      closeModal(
        elements.transactionModal
      );
    }
  );

elements.cancelTransactionButton
  .addEventListener(
    "click",
    () => {
      closeModal(
        elements.transactionModal
      );
    }
  );

elements.closeSettingsButton
  .addEventListener(
    "click",
    () => {
      closeModal(
        elements.settingsModal
      );
    }
  );

elements.cancelSettingsButton
  .addEventListener(
    "click",
    () => {
      closeModal(
        elements.settingsModal
      );
    }
  );

elements.closeBudgetButton
  .addEventListener(
    "click",
    () => {
      closeModal(
        elements.budgetModal
      );
    }
  );

elements.cancelBudgetButton
  .addEventListener(
    "click",
    () => {
      closeModal(
        elements.budgetModal
      );
    }
  );

elements.transactionForm
  .addEventListener(
    "submit",
    handleTransactionSubmit
  );

elements.settingsForm
  .addEventListener(
    "submit",
    handleSettingsSubmit
  );

elements.budgetForm
  .addEventListener(
    "submit",
    handleBudgetSubmit
  );

elements.recurring
  .addEventListener(
    "change",
    () => {
      elements.frequencyGroup
        .classList.toggle(
          "hidden",
          !elements.recurring
            .checked
        );
    }
  );

elements.transactionSearch
  .addEventListener(
    "input",
    renderTransactions
  );

elements.typeFilter
  .addEventListener(
    "change",
    renderTransactions
  );

elements.categoryFilter
  .addEventListener(
    "change",
    renderTransactions
  );

elements.monthFilter
  .addEventListener(
    "change",
    renderTransactions
  );

elements.clearFiltersButton
  .addEventListener(
    "click",
    clearFilters
  );

elements.exportCsvButton
  .addEventListener(
    "click",
    exportTransactionsToCSV
  );

elements.themeButton
  .addEventListener(
    "click",
    toggleTheme
  );

[
  elements.transactionModal,
  elements.settingsModal,
  elements.budgetModal
].forEach(
  modal => {
    modal.addEventListener(
      "click",
      event => {
        if (
          event.target ===
          modal
        ) {
          closeModal(
            modal
          );
        }
      }
    );
  }
);

document.addEventListener(
  "keydown",
  event => {
    if (
      event.key !==
      "Escape"
    ) {
      return;
    }

    [
      elements.transactionModal,
      elements.settingsModal,
      elements.budgetModal
    ].forEach(
      modal => {
        if (
          !modal.classList.contains(
            "hidden"
          )
        ) {
          closeModal(
            modal
          );
        }
      }
    );
  }
);

loadTheme();
generateRecurringTransactions();
resetTransactionForm();
resetBudgetForm();
renderDashboard();
registerServiceWorker();