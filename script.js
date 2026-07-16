"use strict";

const APP_VERSION = "1.1.1";

const MODAL_TRANSITION_MS = 240;
const STATUS_TRANSITION_MS = 220;

const modalCloseTimers =
  new WeakMap();

const STORAGE_KEYS = {
  transactions: "cbgrid-transactions",
  openingBalance: "cbgrid-opening-balance",
  budgets: "cbgrid-custom-budgets",
  recurringRules: "cbgrid-recurring-rules",
  theme: "cbgrid-theme",
  currency: "cbgrid-currency",
  categories: "cbgrid-categories"
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

const DEFAULT_CATEGORIES = [
  "Housing",
  "Food",
  "Transport",
  "Education",
  "Entertainment",
  "Shopping",
  "Salary",
  "Other"
];

const CATEGORY_STYLES = [
  {
    icon: "⌂",
    color: "#244f3f"
  },
  {
    icon: "●",
    color: "#e0a458"
  },
  {
    icon: "→",
    color: "#5d83c5"
  },
  {
    icon: "A",
    color: "#7459be"
  },
  {
    icon: "☆",
    color: "#d2648a"
  },
  {
    icon: "◇",
    color: "#d2645a"
  },
  {
    icon: "€",
    color: "#2e8b66"
  },
  {
    icon: "•",
    color: "#8d938e"
  }
];

const CURRENCY_SYMBOLS = {
  EUR: "€",
  USD: "$",
  GBP: "£",
  PHP: "₱",
  CHF: "CHF",
  JPY: "¥"
};

let deferredInstallPrompt = null;
let waitingServiceWorker = null;

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

  recurringModal:
    document.getElementById(
      "recurring-modal"
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

  recurringForm:
    document.getElementById(
      "recurring-form"
    ),

  addTransactionButton:
    document.getElementById(
      "add-transaction-button"
    ),

  emptyAddButton:
    document.getElementById(
      "empty-add"
    ),

  settingsButton:
    document.getElementById(
      "settings-button"
    ),

  changeBalanceButton:
    document.getElementById(
      "change-balance-button"
    ),

  addBudgetButton:
    document.getElementById(
      "add-budget-button"
    ),

  installButton:
    document.getElementById(
      "install-button"
    ),

  transactionClose:
    document.getElementById(
      "transaction-close"
    ),

  transactionCancel:
    document.getElementById(
      "transaction-cancel"
    ),

  settingsClose:
    document.getElementById(
      "settings-close"
    ),

  settingsCancel:
    document.getElementById(
      "settings-cancel"
    ),

  budgetClose:
    document.getElementById(
      "budget-close"
    ),

  budgetCancel:
    document.getElementById(
      "budget-cancel"
    ),

  recurringClose:
    document.getElementById(
      "recurring-close"
    ),

  recurringCancel:
    document.getElementById(
      "recurring-cancel"
    ),

  transactionId:
    document.getElementById(
      "transaction-id"
    ),

  transactionModalTitle:
    document.getElementById(
      "transaction-modal-title"
    ),

  transactionSave:
    document.getElementById(
      "transaction-save"
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

  transactionBudget:
    document.getElementById(
      "transaction-budget"
    ),

  notes:
    document.getElementById(
      "notes"
    ),

  makeRecurring:
    document.getElementById(
      "make-recurring"
    ),

  recurringOptions:
    document.getElementById(
      "recurring-options"
    ),

  frequency:
    document.getElementById(
      "frequency"
    ),

  recurringEnd:
    document.getElementById(
      "recurring-end"
    ),

  transactionError:
    document.getElementById(
      "transaction-error"
    ),

  openingBalance:
    document.getElementById(
      "opening-balance"
    ),

  currency:
    document.getElementById(
      "currency"
    ),

  settingsError:
    document.getElementById(
      "settings-error"
    ),

  newCategory:
    document.getElementById(
      "new-category"
    ),

  addCategory:
    document.getElementById(
      "add-category"
    ),

  categoryChips:
    document.getElementById(
      "category-chips"
    ),

  exportBackup:
    document.getElementById(
      "export-backup"
    ),

  importBackup:
    document.getElementById(
      "import-backup"
    ),

  backupInput:
    document.getElementById(
      "backup-input"
    ),

  resetTransactions:
    document.getElementById(
      "reset-transactions"
    ),

  resetBudgets:
    document.getElementById(
      "reset-budgets"
    ),

  resetAll:
    document.getElementById(
      "reset-all"
    ),

  budgetId:
    document.getElementById(
      "budget-id"
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

  budgetError:
    document.getElementById(
      "budget-error"
    ),

  budgetSave:
    document.getElementById(
      "budget-save"
    ),

  recurringId:
    document.getElementById(
      "recurring-id"
    ),

  recurringDescription:
    document.getElementById(
      "recurring-description"
    ),

  recurringAmount:
    document.getElementById(
      "recurring-amount"
    ),

  recurringType:
    document.getElementById(
      "recurring-type"
    ),

  recurringCategory:
    document.getElementById(
      "recurring-category"
    ),

  recurringFrequency:
    document.getElementById(
      "recurring-frequency"
    ),

  recurringBudget:
    document.getElementById(
      "recurring-budget"
    ),

  recurringNext:
    document.getElementById(
      "recurring-next"
    ),

  recurringRuleEnd:
    document.getElementById(
      "recurring-rule-end"
    ),

  recurringError:
    document.getElementById(
      "recurring-error"
    ),

  transactionList:
    document.getElementById(
      "transaction-list"
    ),

  transactionEmpty:
    document.getElementById(
      "transaction-empty"
    ),

  recurringList:
    document.getElementById(
      "recurring-list"
    ),

  search:
    document.getElementById(
      "search"
    ),

  typeFilter:
    document.getElementById(
      "type-filter"
    ),

  categoryFilter:
    document.getElementById(
      "category-filter"
    ),

  monthFilter:
    document.getElementById(
      "month-filter"
    ),

  clearFilters:
    document.getElementById(
      "clear-filters"
    ),

  exportCsv:
    document.getElementById(
      "export-csv"
    ),

  importCsv:
    document.getElementById(
      "import-csv"
    ),

  csvInput:
    document.getElementById(
      "csv-input"
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
    ),

  statusBanner:
    document.getElementById(
      "status-banner"
    ),

  statusMessage:
    document.getElementById(
      "status-message"
    ),

  statusAction:
    document.getElementById(
      "status-action"
    ),

  statusClose:
    document.getElementById(
      "status-close"
    ),

  heroCurrency:
    document.getElementById(
      "hero-currency"
    ),

  transactionPrefix:
    document.getElementById(
      "transaction-prefix"
    ),

  settingsPrefix:
    document.getElementById(
      "settings-prefix"
    ),

  budgetPrefix:
    document.getElementById(
      "budget-prefix"
    ),

  recurringPrefix:
    document.getElementById(
      "recurring-prefix"
    )
};

let transactions = ensureArray(
  loadJSON(
    STORAGE_KEYS.transactions,
    []
  )
);

let budgets = ensureArray(
  loadJSON(
    STORAGE_KEYS.budgets,
    []
  )
);

let recurringRules = ensureArray(
  loadJSON(
    STORAGE_KEYS.recurringRules,
    []
  )
);

let categories = ensureArray(
  loadJSON(
    STORAGE_KEYS.categories,
    DEFAULT_CATEGORIES
  )
);

let openingBalance = Number(
  localStorage.getItem(
    STORAGE_KEYS.openingBalance
  ) || 0
);

let selectedCurrency =
  localStorage.getItem(
    STORAGE_KEYS.currency
  ) || "EUR";

if (
  Number.isNaN(
    openingBalance
  )
) {
  openingBalance = 0;
}

if (
  !CURRENCY_SYMBOLS[
    selectedCurrency
  ]
) {
  selectedCurrency = "EUR";
}

categories =
  normalizeCategories(
    categories
  );

transactions =
  normalizeTransactions(
    transactions
  );

budgets =
  normalizeBudgets(
    budgets
  );

recurringRules =
  normalizeRecurringRules(
    recurringRules
  );

function migrateLegacyStorage() {
  Object.entries(
    STORAGE_KEYS
  ).forEach(
    (
      [
        storageName,
        newKey
      ]
    ) => {
      if (
        localStorage.getItem(
          newKey
        ) !== null
      ) {
        return;
      }

      const legacyKeys =
        LEGACY_STORAGE_KEYS[
          storageName
        ] || [];

      for (
        const legacyKey
        of legacyKeys
      ) {
        const legacyValue =
          localStorage.getItem(
            legacyKey
          );

        if (
          legacyValue !== null
        ) {
          localStorage.setItem(
            newKey,
            legacyValue
          );

          break;
        }
      }
    }
  );
}

function ensureArray(
  value
) {
  return Array.isArray(
    value
  )
    ? value
    : [];
}

function loadJSON(
  key,
  fallbackValue
) {
  try {
    const savedValue =
      localStorage.getItem(
        key
      );

    return savedValue
      ? JSON.parse(
          savedValue
        )
      : fallbackValue;
  } catch (
    error
  ) {
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
    STORAGE_KEYS.budgets,
    JSON.stringify(
      budgets
    )
  );

  localStorage.setItem(
    STORAGE_KEYS.recurringRules,
    JSON.stringify(
      recurringRules
    )
  );

  localStorage.setItem(
    STORAGE_KEYS.categories,
    JSON.stringify(
      categories
    )
  );

  localStorage.setItem(
    STORAGE_KEYS.openingBalance,
    String(
      openingBalance
    )
  );

  localStorage.setItem(
    STORAGE_KEYS.currency,
    selectedCurrency
  );
}

function normalizeCategories(
  values
) {
  const cleaned =
    values
      .map(
        value =>
          String(
            value || ""
          ).trim()
      )
      .filter(
        Boolean
      );

  return [
    ...new Set(
      [
        ...DEFAULT_CATEGORIES,
        ...cleaned
      ]
    )
  ];
}

function normalizeTransactions(
  values
) {
  return values
    .filter(
      item =>
        item &&
        typeof item ===
          "object"
    )
    .map(
      item => ({
        id:
          String(
            item.id ||
            createId()
          ),

        description:
          String(
            item.description ||
            "Transaction"
          ).slice(
            0,
            80
          ),

        amount:
          Math.abs(
            Number(
              item.amount
            ) || 0
          ),

        type:
          item.type ===
          "income"
            ? "income"
            : "expense",

        category:
          String(
            item.category ||
            "Other"
          ),

        date:
          isValidDateString(
            item.date
          )
            ? item.date
            : getTodayString(),

        budgetId:
          item.budgetId
            ? String(
                item.budgetId
              )
            : "",

        notes:
          String(
            item.notes || ""
          ).slice(
            0,
            250
          ),

        createdAt:
          Number(
            item.createdAt ||
            Date.now()
          ),

        generatedByRecurringRule:
          item.generatedByRecurringRule
            ? String(
                item.generatedByRecurringRule
              )
            : null,

        sourceId:
          item.sourceId
            ? String(
                item.sourceId
              )
            : null
      })
    )
    .filter(
      item =>
        item.amount > 0
    );
}

function normalizeBudgets(
  values
) {
  return values
    .filter(
      item =>
        item &&
        typeof item ===
          "object"
    )
    .map(
      item => ({
        id:
          String(
            item.id ||
            createId()
          ),

        name:
          String(
            item.name ||
            "Budget"
          ).slice(
            0,
            50
          ),

        category:
          String(
            item.category ||
            "Other"
          ),

        limit:
          Math.abs(
            Number(
              item.limit
            ) || 0
          ),

        createdAt:
          Number(
            item.createdAt ||
            Date.now()
          )
      })
    )
    .filter(
      item =>
        item.limit > 0
    );
}

function normalizeRecurringRules(
  values
) {
  return values
    .filter(
      item =>
        item &&
        typeof item ===
          "object"
    )
    .map(
      item => {
        const startDate =
          isValidDateString(
            item.startDate
          )
            ? item.startDate
            : getTodayString();

        const frequency =
          item.frequency ===
          "weekly"
            ? "weekly"
            : "monthly";

        let nextDate =
          item.nextDate;

        if (
          !isValidDateString(
            nextDate
          )
        ) {
          if (
            isValidDateString(
              item.lastGeneratedDate
            )
          ) {
            nextDate =
              calculateNextDate(
                item.lastGeneratedDate,
                frequency
              );
          } else {
            nextDate =
              calculateNextDate(
                startDate,
                frequency
              );
          }
        }

        return {
          id:
            String(
              item.id ||
              createId()
            ),

          description:
            String(
              item.description ||
              "Recurring transaction"
            ).slice(
              0,
              80
            ),

          amount:
            Math.abs(
              Number(
                item.amount
              ) || 0
            ),

          type:
            item.type ===
            "income"
              ? "income"
              : "expense",

          category:
            String(
              item.category ||
              "Other"
            ),

          budgetId:
            item.budgetId
              ? String(
                  item.budgetId
                )
              : "",

          frequency,

          startDate,

          nextDate,

          endDate:
            isValidDateString(
              item.endDate
            )
              ? item.endDate
              : "",

          active:
            item.active !==
            false,

          createdAt:
            Number(
              item.createdAt ||
              Date.now()
            )
        };
      }
    )
    .filter(
      item =>
        item.amount > 0
    );
}

function createId() {
  if (
    typeof crypto !==
      "undefined" &&
    typeof crypto.randomUUID ===
      "function"
  ) {
    return crypto.randomUUID();
  }

  return (
    `${Date.now()}-` +
    Math.random()
      .toString(16)
      .slice(2)
  );
}

function getCategoryDetails(
  categoryName
) {
  const index =
    Math.max(
      0,
      categories.indexOf(
        categoryName
      )
    );

  return (
    CATEGORY_STYLES[
      index %
      CATEGORY_STYLES.length
    ] ||
    CATEGORY_STYLES[
      CATEGORY_STYLES.length -
      1
    ]
  );
}

function formatCurrency(
  amount,
  maximumFractionDigits = 2
) {
  const fractionDigits =
    selectedCurrency ===
    "JPY"
      ? 0
      : maximumFractionDigits;

  try {
    return new Intl.NumberFormat(
      undefined,
      {
        style:
          "currency",

        currency:
          selectedCurrency,

        maximumFractionDigits:
          fractionDigits
      }
    ).format(
      Number(
        amount
      ) || 0
    );
  } catch (
    error
  ) {
    const symbol =
      CURRENCY_SYMBOLS[
        selectedCurrency
      ] ||
      selectedCurrency;

    return (
      `${symbol} ` +
      (
        Number(
          amount
        ) || 0
      ).toFixed(
        fractionDigits
      )
    );
  }
}

function formatDate(
  dateString
) {
  const date =
    new Date(
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
    undefined,
    {
      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric"
    }
  ).format(
    date
  );
}

function getTodayString() {
  return formatLocalDate(
    new Date()
  );
}

function getCurrentMonth() {
  return getTodayString()
    .slice(
      0,
      7
    );
}

function formatLocalDate(
  date
) {
  const year =
    date.getFullYear();

  const month =
    String(
      date.getMonth() +
      1
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

  return (
    `${year}-` +
    `${month}-` +
    `${day}`
  );
}

function isValidDateString(
  value
) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/
      .test(
        String(
          value || ""
        )
      )
  ) {
    return false;
  }

  const date =
    new Date(
      `${value}T12:00:00`
    );

  return !Number.isNaN(
    date.getTime()
  );
}

function escapeHTML(
  value
) {
  const div =
    document.createElement(
      "div"
    );

  div.textContent =
    String(
      value ?? ""
    );

  return div.innerHTML;
}

function prefersReducedMotion() {
  return window
    .matchMedia(
      "(prefers-reduced-motion: reduce)"
    )
    .matches;
}

function afterNextPaint(
  callback
) {
  window.requestAnimationFrame(
    () => {
      window.requestAnimationFrame(
        callback
      );
    }
  );
}

function openModal(
  modal
) {
  if (
    !modal
  ) {
    return;
  }

  window.clearTimeout(
    modalCloseTimers.get(
      modal
    )
  );

  modalCloseTimers.delete(
    modal
  );

  modal.classList.remove(
    "is-closing"
  );

  modal.classList.add(
    "is-opening"
  );

  modal.classList.remove(
    "hidden"
  );

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";

  if (
    prefersReducedMotion()
  ) {
    modal.classList.remove(
      "is-opening"
    );

    return;
  }

  afterNextPaint(
    () => {
      if (
        !modal.classList
          .contains(
            "is-closing"
          )
      ) {
        modal.classList.remove(
          "is-opening"
        );
      }
    }
  );
}

function finishModalClose(
  modal
) {
  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  modal.classList.add(
    "hidden"
  );

  modal.classList.remove(
    "is-opening",
    "is-closing"
  );

  modalCloseTimers.delete(
    modal
  );

  const openModalElement =
    document.querySelector(
      ".modal-backdrop:not(.hidden)"
    );

  if (
    !openModalElement
  ) {
    document.body.style.overflow =
      "";
  }
}

function closeModal(
  modal
) {
  if (
    !modal
  ) {
    return;
  }

  if (
    modal.classList
      .contains(
        "hidden"
      ) ||
    modal.classList
      .contains(
        "is-closing"
      )
  ) {
    return;
  }

  modal.classList.remove(
    "is-opening"
  );

  modal.classList.add(
    "is-closing"
  );

  if (
    prefersReducedMotion()
  ) {
    finishModalClose(
      modal
    );

    return;
  }

  const closeTimer =
    window.setTimeout(
      () => {
        finishModalClose(
          modal
        );
      },
      MODAL_TRANSITION_MS
    );

  modalCloseTimers.set(
    modal,
    closeTimer
  );
}

function finishStatusClose() {
  elements.statusBanner
    .classList.add(
      "hidden"
    );

  elements.statusBanner
    .classList.remove(
      "is-opening",
      "is-closing"
    );

  showStatus.hideTimerId =
    null;
}

function hideStatus() {
  window.clearTimeout(
    showStatus.timeoutId
  );

  if (
    elements.statusBanner
      .classList.contains(
        "hidden"
      ) ||
    elements.statusBanner
      .classList.contains(
        "is-closing"
      )
  ) {
    return;
  }

  window.clearTimeout(
    showStatus.hideTimerId
  );

  elements.statusBanner
    .classList.remove(
      "is-opening"
    );

  elements.statusBanner
    .classList.add(
      "is-closing"
    );

  if (
    prefersReducedMotion()
  ) {
    finishStatusClose();

    return;
  }

  showStatus.hideTimerId =
    window.setTimeout(
      finishStatusClose,
      STATUS_TRANSITION_MS
    );
}

function showStatus(
  message,
  options = {}
) {
  const {
    actionText = "",
    action = null,
    autoHide = true
  } = options;

  elements.statusMessage
    .textContent =
    message;

  window.clearTimeout(
    showStatus.hideTimerId
  );

  elements.statusBanner
    .classList.remove(
      "is-closing"
    );

  elements.statusBanner
    .classList.add(
      "is-opening"
    );

  elements.statusBanner
    .classList.remove(
      "hidden"
    );

  if (
    prefersReducedMotion()
  ) {
    elements.statusBanner
      .classList.remove(
        "is-opening"
      );
  } else {
    afterNextPaint(
      () => {
        if (
          !elements.statusBanner
            .classList.contains(
              "is-closing"
            )
        ) {
          elements.statusBanner
            .classList.remove(
              "is-opening"
            );
        }
      }
    );
  }

  if (
    actionText &&
    typeof action ===
      "function"
  ) {
    elements.statusAction
      .textContent =
      actionText;

    elements.statusAction
      .classList.remove(
        "hidden"
      );

    elements.statusAction
      .onclick =
      action;
  } else {
    elements.statusAction
      .classList.add(
        "hidden"
      );

    elements.statusAction
      .onclick =
      null;
  }

  window.clearTimeout(
    showStatus.timeoutId
  );

  if (
    autoHide
  ) {
    showStatus.timeoutId =
      window.setTimeout(
        hideStatus,
        4500
      );
  }
}

function debounce(
  callback,
  delay
) {
  let timeoutId =
    null;

  return (
    ...args
  ) => {
    window.clearTimeout(
      timeoutId
    );

    timeoutId =
      window.setTimeout(
        () => {
          callback(
            ...args
          );
        },
        delay
      );
  };
}

function setupSmoothWheelScrolling() {
  const finePointer =
    window.matchMedia(
      "(pointer: fine)"
    ).matches;

  if (
    prefersReducedMotion() ||
    !finePointer
  ) {
    return;
  }

  let currentY =
    window.scrollY;

  let targetY =
    currentY;

  let animationFrame =
    null;

  const syncScrollPosition =
    () => {
      currentY =
        window.scrollY;

      targetY =
        currentY;
    };

  const stopAnimation =
    () => {
      if (
        animationFrame !==
          null
      ) {
        window.cancelAnimationFrame(
          animationFrame
        );

        animationFrame =
          null;
      }

      syncScrollPosition();
    };

  const animateScroll =
    () => {
      const distance =
        targetY -
        currentY;

      currentY +=
        distance *
        0.2;

      const scrollingElement =
        document.scrollingElement ||
        document.documentElement;

      scrollingElement.scrollTop =
        currentY;

      if (
        Math.abs(
          distance
        ) < 0.5
      ) {
        scrollingElement.scrollTop =
          targetY;

        currentY =
          targetY;

        animationFrame =
          null;

        return;
      }

      animationFrame =
        window.requestAnimationFrame(
          animateScroll
        );
    };

  window.addEventListener(
    "wheel",
    event => {
      const eventTarget =
        event.target;

      const isFormControl =
        eventTarget instanceof
          Element &&
        Boolean(
          eventTarget.closest(
            "input, select, textarea, [contenteditable='true']"
          )
        );

      const isModalScroll =
        eventTarget instanceof
          Element &&
        Boolean(
          eventTarget.closest(
            ".modal-backdrop:not(.hidden)"
          )
        );

      const isHorizontalGesture =
        Math.abs(
          event.deltaX
        ) >
        Math.abs(
          event.deltaY
        );

      const isPrecisionGesture =
        event.deltaMode ===
          0 &&
        Math.abs(
          event.deltaY
        ) < 12;

      if (
        event.ctrlKey ||
        isFormControl ||
        isModalScroll ||
        isHorizontalGesture ||
        isPrecisionGesture
      ) {
        return;
      }

      let wheelDistance =
        event.deltaY;

      if (
        event.deltaMode ===
        1
      ) {
        wheelDistance *=
          40;
      } else if (
        event.deltaMode ===
        2
      ) {
        wheelDistance *=
          window.innerHeight *
          0.85;
      }

      wheelDistance =
        Math.max(
          -180,
          Math.min(
            180,
            wheelDistance
          )
        );

      const maxScroll =
        Math.max(
          0,
          document.documentElement
            .scrollHeight -
          window.innerHeight
        );

      if (
        animationFrame ===
          null
      ) {
        syncScrollPosition();
      }

      const nextTarget =
        Math.max(
          0,
          Math.min(
            maxScroll,
            targetY +
              wheelDistance
          )
        );

      if (
        nextTarget ===
        targetY
      ) {
        return;
      }

      event.preventDefault();

      targetY =
        nextTarget;

      if (
        animationFrame ===
          null
      ) {
        animationFrame =
          window.requestAnimationFrame(
            animateScroll
          );
      }
    },
    {
      passive:
        false
    }
  );

  window.addEventListener(
    "scroll",
    () => {
      if (
        animationFrame ===
          null
      ) {
        syncScrollPosition();
      }
    },
    {
      passive:
        true
    }
  );

  window.addEventListener(
    "resize",
    stopAnimation,
    {
      passive:
        true
    }
  );

  window.addEventListener(
    "pointerdown",
    stopAnimation,
    {
      passive:
        true
    }
  );

  document.addEventListener(
    "keydown",
    event => {
      const scrollKeys = [
        "ArrowDown",
        "ArrowUp",
        "End",
        "Home",
        "PageDown",
        "PageUp",
        " "
      ];

      if (
        scrollKeys.includes(
          event.key
        )
      ) {
        stopAnimation();
      }
    }
  );
}

function setupNavigationState() {
  const navLinks = [
    ...document.querySelectorAll(
      ".nav-link[href^='#']"
    )
  ];

  const sectionLinks =
    navLinks
      .map(
        link => {
          const target =
            document.querySelector(
              link.getAttribute(
                "href"
              )
            );

          return target
            ? {
                link,
                target
              }
            : null;
        }
      )
      .filter(
        Boolean
      );

  if (
    sectionLinks.length ===
    0
  ) {
    return;
  }

  let activeLink =
    navLinks.find(
      link =>
        link.classList
          .contains(
            "active"
          )
    ) ||
    navLinks[0];

  let updateFrame =
    null;

  const setActiveLink =
    link => {
      if (
        !link
      ) {
        return;
      }

      activeLink =
        link;

      navLinks.forEach(
        navLink => {
          const isActive =
            navLink ===
            link;

          navLink.classList.toggle(
            "active",
            isActive
          );

          if (
            isActive
          ) {
            navLink.setAttribute(
              "aria-current",
              "location"
            );
          } else {
            navLink.removeAttribute(
              "aria-current"
            );
          }
        }
      );
    };

  const updateActiveLink =
    () => {
      updateFrame =
        null;

      const marker =
        window.scrollY +
        Math.min(
          window.innerHeight *
            0.28,
          220
        );

      const sortedSections =
        sectionLinks
          .map(
            item => ({
              ...item,
              top:
                item.target
                  .getBoundingClientRect()
                  .top +
                window.scrollY
            })
          )
          .sort(
            (
              first,
              second
            ) =>
              first.top -
              second.top
          );

      let candidate =
        sortedSections[0];

      sortedSections.forEach(
        item => {
          if (
            item.top >
            marker
          ) {
            return;
          }

          const sameRow =
            Math.abs(
              item.top -
              candidate.top
            ) < 8;

          if (
            !sameRow ||
            item.link ===
              activeLink
          ) {
            candidate =
              item;
          }
        }
      );

      setActiveLink(
        candidate.link
      );
    };

  navLinks.forEach(
    link => {
      link.addEventListener(
        "click",
        () => {
          setActiveLink(
            link
          );
        }
      );
    }
  );

  window.addEventListener(
    "scroll",
    () => {
      if (
        updateFrame ===
          null
      ) {
        updateFrame =
          window.requestAnimationFrame(
            updateActiveLink
          );
      }
    },
    {
      passive:
        true
    }
  );

  window.addEventListener(
    "resize",
    updateActiveLink,
    {
      passive:
        true
    }
  );

  updateActiveLink();
}

function populateCategorySelects() {
  const selectElements = [
    elements.category,
    elements.budgetCategory,
    elements.recurringCategory
  ];

  selectElements.forEach(
    select => {
      const previousValue =
        select.value;

      select.innerHTML =
        "";

      categories.forEach(
        categoryName => {
          const option =
            document.createElement(
              "option"
            );

          option.value =
            categoryName;

          option.textContent =
            categoryName;

          select.appendChild(
            option
          );
        }
      );

      if (
        categories.includes(
          previousValue
        )
      ) {
        select.value =
          previousValue;
      }
    }
  );

  const filterValue =
    elements.categoryFilter
      .value;

  elements.categoryFilter
    .innerHTML =
    `
      <option value="all">
        All categories
      </option>
    `;

  categories.forEach(
    categoryName => {
      const option =
        document.createElement(
          "option"
        );

      option.value =
        categoryName;

      option.textContent =
        categoryName;

      elements.categoryFilter
        .appendChild(
          option
        );
    }
  );

  if (
    filterValue ===
      "all" ||
    categories.includes(
      filterValue
    )
  ) {
    elements.categoryFilter
      .value =
      filterValue || "all";
  }
}

function populateBudgetSelects() {
  const selectElements = [
    elements.transactionBudget,
    elements.recurringBudget
  ];

  selectElements.forEach(
    select => {
      const previousValue =
        select.value;

      select.innerHTML =
        `
          <option value="">
            No budget
          </option>
        `;

      budgets.forEach(
        budget => {
          const option =
            document.createElement(
              "option"
            );

          option.value =
            budget.id;

          option.textContent =
            budget.name;

          select.appendChild(
            option
          );
        }
      );

      if (
        budgets.some(
          budget =>
            budget.id ===
            previousValue
        )
      ) {
        select.value =
          previousValue;
      }
    }
  );
}

function updateCurrencyElements() {
  const symbol =
    CURRENCY_SYMBOLS[
      selectedCurrency
    ] ||
    selectedCurrency;

  [
    elements.heroCurrency,
    elements.transactionPrefix,
    elements.settingsPrefix,
    elements.budgetPrefix,
    elements.recurringPrefix
  ].forEach(
    element => {
      element.textContent =
        symbol;
    }
  );
}

function resetTransactionForm() {
  elements.transactionForm
    .reset();

  elements.transactionId
    .value =
    "";

  elements.transactionModalTitle
    .textContent =
    "Add transaction";

  elements.transactionSave
    .textContent =
    "Save transaction";

  elements.type.value =
    "expense";

  elements.category.value =
    categories[0] ||
    "Other";

  elements.date.value =
    getTodayString();

  elements.transactionBudget
    .value =
    "";

  elements.notes.value =
    "";

  elements.makeRecurring
    .checked =
    false;

  elements.frequency.value =
    "weekly";

  elements.recurringEnd.value =
    "";

  elements.recurringOptions
    .classList.add(
      "hidden"
    );

  elements.transactionError
    .textContent =
    "";
}

function openNewTransactionModal() {
  populateBudgetSelects();
  resetTransactionForm();

  openModal(
    elements.transactionModal
  );

  window.setTimeout(
    () => {
      elements.description
        .focus();
    },
    50
  );
}

function openEditTransactionModal(
  id
) {
  const transaction =
    transactions.find(
      item =>
        item.id === id
    );

  if (
    !transaction
  ) {
    return;
  }

  populateBudgetSelects();
  resetTransactionForm();

  elements.transactionId
    .value =
    transaction.id;

  elements.transactionModalTitle
    .textContent =
    "Edit transaction";

  elements.transactionSave
    .textContent =
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

  elements.transactionBudget.value =
    transaction.budgetId ||
    "";

  elements.notes.value =
    transaction.notes ||
    "";

  openModal(
    elements.transactionModal
  );

  window.setTimeout(
    () => {
      elements.description
        .focus();
    },
    50
  );
}

function openSettingsModal() {
  elements.openingBalance.value =
    openingBalance;

  elements.currency.value =
    selectedCurrency;

  elements.settingsError
    .textContent =
    "";

  renderCategoryChips();

  openModal(
    elements.settingsModal
  );
}

function resetBudgetForm() {
  elements.budgetForm
    .reset();

  elements.budgetId
    .value =
    "";

  elements.budgetModalTitle
    .textContent =
    "Add budget";

  elements.budgetSave
    .textContent =
    "Save budget";

  elements.budgetCategory.value =
    categories[0] ||
    "Other";

  elements.budgetError
    .textContent =
    "";
}

function openNewBudgetModal() {
  resetBudgetForm();

  openModal(
    elements.budgetModal
  );

  window.setTimeout(
    () => {
      elements.budgetName
        .focus();
    },
    50
  );
}

function openEditBudgetModal(
  id
) {
  const budget =
    budgets.find(
      item =>
        item.id === id
    );

  if (
    !budget
  ) {
    return;
  }

  resetBudgetForm();

  elements.budgetId.value =
    budget.id;

  elements.budgetModalTitle
    .textContent =
    "Edit budget";

  elements.budgetSave
    .textContent =
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
}

function openEditRecurringModal(
  id
) {
  const rule =
    recurringRules.find(
      item =>
        item.id === id
    );

  if (
    !rule
  ) {
    return;
  }

  populateBudgetSelects();

  elements.recurringForm
    .reset();

  elements.recurringId.value =
    rule.id;

  elements.recurringDescription.value =
    rule.description;

  elements.recurringAmount.value =
    rule.amount;

  elements.recurringType.value =
    rule.type;

  elements.recurringCategory.value =
    rule.category;

  elements.recurringFrequency.value =
    rule.frequency;

  elements.recurringBudget.value =
    rule.budgetId ||
    "";

  elements.recurringNext.value =
    rule.nextDate;

  elements.recurringRuleEnd.value =
    rule.endDate ||
    "";

  elements.recurringError
    .textContent =
    "";

  openModal(
    elements.recurringModal
  );
}

function handleTransactionSubmit(
  event
) {
  event.preventDefault();

  const description =
    elements.description
      .value
      .trim();

  const amount =
    Number(
      elements.amount
        .value
    );

  const type =
    elements.type.value;

  const category =
    elements.category.value;

  const date =
    elements.date.value;

  const budgetId =
    elements.transactionBudget
      .value;

  const notes =
    elements.notes
      .value
      .trim();

  const editingId =
    elements.transactionId
      .value;

  if (
    !description ||
    !date ||
    Number.isNaN(
      amount
    ) ||
    amount <= 0 ||
    amount >
      999999999
  ) {
    elements.transactionError
      .textContent =
      "Enter a description, a valid positive amount, and a date.";

    return;
  }

  if (
    type !==
      "income" &&
    type !==
      "expense"
  ) {
    elements.transactionError
      .textContent =
      "Select a valid transaction type.";

    return;
  }

  if (
    editingId
  ) {
    const index =
      transactions.findIndex(
        transaction =>
          transaction.id ===
          editingId
      );

    if (
      index !== -1
    ) {
      transactions[index] = {
        ...transactions[index],
        description,
        amount,
        type,
        category,
        date,
        budgetId,
        notes
      };
    }
  } else {
    transactions.unshift(
      {
        id:
          createId(),

        description,

        amount,

        type,

        category,

        date,

        budgetId,

        notes,

        createdAt:
          Date.now(),

        generatedByRecurringRule:
          null,

        sourceId:
          null
      }
    );

    if (
      elements.makeRecurring
        .checked
    ) {
      const endDate =
        elements.recurringEnd
          .value;

      if (
        endDate &&
        endDate < date
      ) {
        elements.transactionError
          .textContent =
          "The recurring end date cannot be before the transaction date.";

        transactions.shift();

        return;
      }

      recurringRules.push(
        {
          id:
            createId(),

          description,

          amount,

          type,

          category,

          budgetId,

          frequency:
            elements.frequency
              .value,

          startDate:
            date,

          nextDate:
            calculateNextDate(
              date,
              elements.frequency
                .value
            ),

          endDate,

          active:
            true,

          createdAt:
            Date.now()
        }
      );
    }
  }

  saveAllData();
  renderDashboard();

  closeModal(
    elements.transactionModal
  );

  resetTransactionForm();

  showStatus(
    editingId
      ? "Transaction updated."
      : "Transaction saved."
  );
}

function handleSettingsSubmit(
  event
) {
  event.preventDefault();

  const value =
    Number(
      elements.openingBalance
        .value
    );

  const currency =
    elements.currency
      .value;

  if (
    Number.isNaN(
      value
    )
  ) {
    elements.settingsError
      .textContent =
      "Enter a valid opening balance.";

    return;
  }

  if (
    !CURRENCY_SYMBOLS[
      currency
    ]
  ) {
    elements.settingsError
      .textContent =
      "Select a valid currency.";

    return;
  }

  openingBalance =
    value;

  selectedCurrency =
    currency;

  saveAllData();
  updateCurrencyElements();
  renderDashboard();

  closeModal(
    elements.settingsModal
  );

  showStatus(
    "Settings saved."
  );
}

function handleBudgetSubmit(
  event
) {
  event.preventDefault();

  const name =
    elements.budgetName
      .value
      .trim();

  const category =
    elements.budgetCategory
      .value;

  const limit =
    Number(
      elements.budgetLimit
        .value
    );

  const editingId =
    elements.budgetId
      .value;

  if (
    !name ||
    Number.isNaN(
      limit
    ) ||
    limit <= 0 ||
    limit >
      999999999
  ) {
    elements.budgetError
      .textContent =
      "Enter a budget name and a valid positive monthly limit.";

    return;
  }

  if (
    editingId
  ) {
    const index =
      budgets.findIndex(
        budget =>
          budget.id ===
          editingId
      );

    if (
      index !== -1
    ) {
      budgets[index] = {
        ...budgets[index],
        name,
        category,
        limit
      };
    }
  } else {
    budgets.push(
      {
        id:
          createId(),

        name,

        category,

        limit,

        createdAt:
          Date.now()
      }
    );
  }

  saveAllData();
  populateBudgetSelects();
  renderDashboard();

  closeModal(
    elements.budgetModal
  );

  showStatus(
    editingId
      ? "Budget updated."
      : "Budget created."
  );
}

function handleRecurringSubmit(
  event
) {
  event.preventDefault();

  const id =
    elements.recurringId
      .value;

  const index =
    recurringRules.findIndex(
      rule =>
        rule.id === id
    );

  const description =
    elements.recurringDescription
      .value
      .trim();

  const amount =
    Number(
      elements.recurringAmount
        .value
    );

  const nextDate =
    elements.recurringNext
      .value;

  const endDate =
    elements.recurringRuleEnd
      .value;

  if (
    index === -1 ||
    !description ||
    Number.isNaN(
      amount
    ) ||
    amount <= 0 ||
    amount >
      999999999 ||
    !isValidDateString(
      nextDate
    ) ||
    (
      endDate &&
      endDate < nextDate
    )
  ) {
    elements.recurringError
      .textContent =
      "Enter valid recurring details. The end date cannot be before the next date.";

    return;
  }

  recurringRules[index] = {
    ...recurringRules[index],

    description,

    amount,

    type:
      elements.recurringType
        .value,

    category:
      elements.recurringCategory
        .value,

    frequency:
      elements.recurringFrequency
        .value,

    budgetId:
      elements.recurringBudget
        .value,

    nextDate,

    endDate
  };

  saveAllData();
  renderRecurringRules();

  closeModal(
    elements.recurringModal
  );

  showStatus(
    "Recurring rule updated."
  );
}

function deleteTransaction(
  id
) {
  const transaction =
    transactions.find(
      item =>
        item.id === id
    );

  if (
    !transaction
  ) {
    return;
  }

  const confirmed =
    window.confirm(
      `Delete "${transaction.description}"?`
    );

  if (
    !confirmed
  ) {
    return;
  }

  transactions =
    transactions.filter(
      item =>
        item.id !== id
    );

  saveAllData();
  renderDashboard();

  showStatus(
    "Transaction deleted."
  );
}

function deleteBudget(
  id
) {
  const budget =
    budgets.find(
      item =>
        item.id === id
    );

  if (
    !budget
  ) {
    return;
  }

  const confirmed =
    window.confirm(
      `Delete the "${budget.name}" budget?`
    );

  if (
    !confirmed
  ) {
    return;
  }

  budgets =
    budgets.filter(
      item =>
        item.id !== id
    );

  transactions =
    transactions.map(
      transaction =>
        transaction.budgetId ===
        id
          ? {
              ...transaction,
              budgetId: ""
            }
          : transaction
    );

  recurringRules =
    recurringRules.map(
      rule =>
        rule.budgetId ===
        id
          ? {
              ...rule,
              budgetId: ""
            }
          : rule
    );

  saveAllData();
  populateBudgetSelects();
  renderDashboard();

  showStatus(
    "Budget deleted."
  );
}

function deleteRecurringRule(
  id
) {
  const rule =
    recurringRules.find(
      item =>
        item.id === id
    );

  if (
    !rule
  ) {
    return;
  }

  const confirmed =
    window.confirm(
      `Delete recurring rule "${rule.description}"?`
    );

  if (
    !confirmed
  ) {
    return;
  }

  recurringRules =
    recurringRules.filter(
      item =>
        item.id !== id
    );

  saveAllData();
  renderRecurringRules();

  showStatus(
    "Recurring rule deleted."
  );
}

function toggleRecurringRule(
  id
) {
  const rule =
    recurringRules.find(
      item =>
        item.id === id
    );

  if (
    !rule
  ) {
    return;
  }

  rule.active =
    !rule.active;

  saveAllData();
  renderRecurringRules();

  showStatus(
    rule.active
      ? "Recurring rule resumed."
      : "Recurring rule paused."
  );
}

function getFilteredTransactions() {
  const searchValue =
    elements.search
      .value
      .trim()
      .toLowerCase();

  const typeValue =
    elements.typeFilter
      .value;

  const categoryValue =
    elements.categoryFilter
      .value;

  const monthValue =
    elements.monthFilter
      .value;

  return [
    ...transactions
  ]
    .filter(
      transaction => {
        const searchable =
          [
            transaction.description,
            transaction.category,
            transaction.notes,
            getBudgetName(
              transaction.budgetId
            )
          ]
            .join(
              " "
            )
            .toLowerCase();

        const matchesSearch =
          searchable.includes(
            searchValue
          );

        const matchesType =
          typeValue ===
            "all" ||
          transaction.type ===
            typeValue;

        const matchesCategory =
          categoryValue ===
            "all" ||
          transaction.category ===
            categoryValue;

        const matchesMonth =
          !monthValue ||
          transaction.date
            .startsWith(
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
      (
        first,
        second
      ) => {
        const dateDifference =
          new Date(
            second.date
          ) -
          new Date(
            first.date
          );

        if (
          dateDifference !==
          0
        ) {
          return dateDifference;
        }

        return (
          Number(
            second.createdAt ||
            0
          ) -
          Number(
            first.createdAt ||
            0
          )
        );
      }
    );
}

function renderTransactions() {
  const filteredTransactions =
    getFilteredTransactions();

  const fragment =
    document.createDocumentFragment();

  elements.transactionEmpty
    .classList.toggle(
      "hidden",
      filteredTransactions
        .length > 0
    );

  filteredTransactions
    .forEach(
      transaction => {
        const details =
          getCategoryDetails(
            transaction.category
          );

        const item =
          document.createElement(
            "article"
          );

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

        const budgetName =
          getBudgetName(
            transaction.budgetId
          );

        const recurringBadge =
          transaction
            .generatedByRecurringRule
            ? `
                <span class="transaction-badge">
                  Recurring
                </span>
              `
            : "";

        const budgetBadge =
          budgetName
            ? `
                <span class="transaction-badge">
                  ${escapeHTML(
                    budgetName
                  )}
                </span>
              `
            : "";

        const notes =
          transaction.notes
            ? `
                <p class="transaction-note">
                  ${escapeHTML(
                    transaction.notes
                  )}
                </p>
              `
            : "";

        item.className =
          "transaction-item";

        item.dataset.transactionId =
          transaction.id;

        item.innerHTML = `
          <div
            class="transaction-category-icon"
            style="
              background:
              ${details.color}18;

              color:
              ${details.color};
            "
          >
            ${escapeHTML(
              details.icon
            )}
          </div>

          <div class="transaction-copy">
            <div class="transaction-title-row">
              <h3>
                ${escapeHTML(
                  transaction.description
                )}
              </h3>

              ${recurringBadge}
              ${budgetBadge}
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

            ${notes}
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
              class="
                small-action-button
                edit-button
              "
              type="button"
              data-id="${transaction.id}"
            >
              Edit
            </button>

            <button
              class="
                small-action-button
                delete-button
              "
              type="button"
              data-id="${transaction.id}"
            >
              Delete
            </button>
          </div>
        `;

        fragment.appendChild(
          item
        );
      }
    );

  elements.transactionList
    .replaceChildren(
      fragment
    );
}

function handleTransactionListClick(
  event
) {
  if (
    !(event.target instanceof
      Element)
  ) {
    return;
  }

  const button =
    event.target.closest(
      "button[data-id]"
    );

  if (
    !button ||
    !elements.transactionList
      .contains(
        button
      )
  ) {
    return;
  }

  if (
    button.classList
      .contains(
        "edit-button"
      )
  ) {
    openEditTransactionModal(
      button.dataset.id
    );

    return;
  }

  if (
    button.classList
      .contains(
        "delete-button"
      )
  ) {
    deleteTransaction(
      button.dataset.id
    );
  }
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

  elements.balanceTotal
    .textContent =
    formatCurrency(
      balance
    );

  elements.incomeTotal
    .textContent =
    formatCurrency(
      totals.income
    );

  elements.expenseTotal
    .textContent =
    formatCurrency(
      totals.expense
    );

  elements.transactionCount
    .textContent =
    String(
      transactions.length
    );
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
          transaction.amount ||
          0
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
            result[category] ||
            0
          ) +
          Number(
            transaction.amount ||
            0
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
          [
            ,
            firstAmount
          ],
          [
            ,
            secondAmount
          ]
        ) =>
          secondAmount -
          firstAmount
      )
      .slice(
        0,
        10
      );

  elements.categoryBreakdown
    .innerHTML =
    "";

  elements.donutTotal
    .textContent =
    formatCurrency(
      totalExpenses,
      0
    );

  if (
    sortedCategories
      .length === 0
  ) {
    elements.categoryBreakdown
      .innerHTML =
      `
        <p class="category-empty">
          Expense categories will appear here.
        </p>
      `;

    elements.donutChart
      .style
      .background =
      "conic-gradient(#d9ddd8 0deg 360deg)";

    return;
  }

  const gradientSections =
    [];

  let currentDegree =
    0;

  sortedCategories
    .forEach(
      (
        [
          categoryName,
          amount
        ]
      ) => {
        const details =
          getCategoryDetails(
            categoryName
          );

        const percentage =
          totalExpenses === 0
            ? 0
            : (
                amount /
                totalExpenses
              ) *
              100;

        const sectionDegrees =
          percentage *
          3.6;

        gradientSections.push(
          `${details.color} ` +
          `${currentDegree}deg ` +
          `${
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
          .appendChild(
            row
          );
      }
    );

  if (
    currentDegree <
    360
  ) {
    gradientSections.push(
      `#d9ddd8 ${currentDegree}deg 360deg`
    );
  }

  elements.donutChart
    .style
    .background =
    `conic-gradient(${gradientSections.join(
      ","
    )})`;
}

function renderBudgets() {
  const currentMonth =
    getCurrentMonth();

  const currentMonthExpenses =
    transactions.filter(
      transaction =>
        transaction.type ===
          "expense" &&
        transaction.date
          .startsWith(
            currentMonth
          )
    );

  elements.budgetList
    .innerHTML =
    "";

  if (
    budgets.length ===
    0
  ) {
    elements.budgetList
      .innerHTML =
      `
        <div class="budget-empty-state">
          <h3>
            No budgets yet
          </h3>

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

    document
      .getElementById(
        "empty-budget-button"
      )
      .addEventListener(
        "click",
        openNewBudgetModal
      );

    return;
  }

  budgets.forEach(
    budget => {
      const assignedTransactions =
        currentMonthExpenses
          .filter(
            transaction =>
              transaction.budgetId ===
              budget.id
          );

      const fallbackTransactions =
        currentMonthExpenses
          .filter(
            transaction =>
              !transaction.budgetId &&
              transaction.category ===
              budget.category
          );

      const spent =
        [
          ...assignedTransactions,
          ...fallbackTransactions
        ].reduce(
          (
            total,
            transaction
          ) =>
            total +
            transaction.amount,
          0
        );

      const percentage =
        budget.limit > 0
          ? (
              spent /
              budget.limit
            ) *
            100
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
        budget.limit -
        spent;

      const details =
        getCategoryDetails(
          budget.category
        );

      let statusClass =
        "";

      if (
        percentage >=
        100
      ) {
        statusClass =
          "over-budget";
      } else if (
        percentage >=
        80
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
                background:
                ${details.color}18;

                color:
                ${details.color};
              "
            >
              ${escapeHTML(
                details.icon
              )}
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
              class="
                small-action-button
                budget-edit-button
              "
              data-id="${budget.id}"
              type="button"
            >
              Edit
            </button>

            <button
              class="
                small-action-button
                budget-delete-button
              "
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
            of
            ${formatCurrency(
              budget.limit
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
        .appendChild(
          item
        );
    }
  );

  elements.budgetList
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

  elements.budgetList
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

function renderRecurringRules() {
  elements.recurringList
    .innerHTML =
    "";

  if (
    recurringRules.length ===
    0
  ) {
    elements.recurringList
      .innerHTML =
      `
        <div class="section-empty-state">
          <h3>
            No recurring transactions
          </h3>

          <p>
            Create one by enabling “Make this a recurring transaction” when adding a transaction.
          </p>
        </div>
      `;

    return;
  }

  recurringRules
    .slice()
    .sort(
      (
        first,
        second
      ) =>
        first.nextDate
          .localeCompare(
            second.nextDate
          )
    )
    .forEach(
      rule => {
        const details =
          getCategoryDetails(
            rule.category
          );

        const item =
          document.createElement(
            "article"
          );

        const statusBadge =
          rule.active
            ? `
                <span class="recurring-badge">
                  Active
                </span>
              `
            : `
                <span
                  class="
                    recurring-badge
                    paused-badge
                  "
                >
                  Paused
                </span>
              `;

        const budgetName =
          getBudgetName(
            rule.budgetId
          );

        const budgetBadge =
          budgetName
            ? `
                <span class="recurring-badge">
                  ${escapeHTML(
                    budgetName
                  )}
                </span>
              `
            : "";

        item.className =
          "recurring-item";

        item.innerHTML = `
          <div
            class="recurring-icon"
            style="
              background:
              ${details.color}18;

              color:
              ${details.color};
            "
          >
            ↻
          </div>

          <div class="recurring-copy">
            <div class="recurring-title-row">
              <h3>
                ${escapeHTML(
                  rule.description
                )}
              </h3>

              ${statusBadge}
              ${budgetBadge}
            </div>

            <p>
              ${formatCurrency(
                rule.amount
              )}
              ·
              ${escapeHTML(
                rule.frequency
              )}
              ·
              Next:
              ${formatDate(
                rule.nextDate
              )}

              ${
                rule.endDate
                  ? ` · Ends: ${formatDate(
                      rule.endDate
                    )}`
                  : ""
              }
            </p>
          </div>

          <div
            class="
              transaction-amount
              ${
                rule.type ===
                "income"
                  ? "amount-income"
                  : "amount-expense"
              }
            "
          >
            ${
              rule.type ===
              "income"
                ? "+"
                : "−"
            }${formatCurrency(
              rule.amount
            )}
          </div>

          <div class="recurring-actions">
            <button
              class="
                small-action-button
                recurring-toggle-button
              "
              data-id="${rule.id}"
              type="button"
            >
              ${
                rule.active
                  ? "Pause"
                  : "Resume"
              }
            </button>

            <button
              class="
                small-action-button
                recurring-edit-button
              "
              data-id="${rule.id}"
              type="button"
            >
              Edit
            </button>

            <button
              class="
                small-action-button
                recurring-delete-button
              "
              data-id="${rule.id}"
              type="button"
            >
              Delete
            </button>
          </div>
        `;

        elements.recurringList
          .appendChild(
            item
          );
      }
    );

  elements.recurringList
    .querySelectorAll(
      ".recurring-toggle-button"
    )
    .forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            toggleRecurringRule(
              button.dataset.id
            );
          }
        );
      }
    );

  elements.recurringList
    .querySelectorAll(
      ".recurring-edit-button"
    )
    .forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            openEditRecurringModal(
              button.dataset.id
            );
          }
        );
      }
    );

  elements.recurringList
    .querySelectorAll(
      ".recurring-delete-button"
    )
    .forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            deleteRecurringRule(
              button.dataset.id
            );
          }
        );
      }
    );
}

function getBudgetName(
  budgetId
) {
  return (
    budgets.find(
      budget =>
        budget.id ===
        budgetId
    )?.name ||
    ""
  );
}

function clearTransactionFilters() {
  elements.search.value =
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
    transactions.length ===
    0
  ) {
    window.alert(
      "There are no transactions to export."
    );

    return;
  }

  const headers = [
    "ID",
    "Description",
    "Amount",
    "Type",
    "Category",
    "Budget",
    "Date",
    "Notes"
  ];

  const rows =
    transactions.map(
      transaction => [
        transaction.id,
        transaction.description,
        transaction.amount
          .toFixed(
            2
          ),
        transaction.type,
        transaction.category,
        getBudgetName(
          transaction.budgetId
        ),
        transaction.date,
        transaction.notes
      ]
    );

  downloadTextFile(
    `cbgrid-transactions-${getTodayString()}.csv`,
    rowsToCSV(
      [
        headers,
        ...rows
      ]
    ),
    "text/csv;charset=utf-8"
  );
}

function rowsToCSV(
  rows
) {
  return rows
    .map(
      row =>
        row
          .map(
            value =>
              `"${String(
                value ?? ""
              ).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(
            ","
          )
    )
    .join(
      "\n"
    );
}

async function importTransactionsFromCSV(
  file
) {
  try {
    const text =
      await file.text();

    const rows =
      parseCSV(
        text
      );

    if (
      rows.length <
      2
    ) {
      throw new Error(
        "The CSV file does not contain transaction rows."
      );
    }

    const headers =
      rows[0].map(
        value =>
          value
            .trim()
            .toLowerCase()
      );

    const imported =
      [];

    for (
      const row
      of rows.slice(1)
    ) {
      if (
        row.every(
          value =>
            !value.trim()
        )
      ) {
        continue;
      }

      const record =
        Object.fromEntries(
          headers.map(
            (
              header,
              index
            ) => [
              header,
              row[index] ||
              ""
            ]
          )
        );

      const description =
        record.description
          ?.trim();

      const amount =
        Math.abs(
          Number(
            record.amount
          )
        );

      const date =
        record.date
          ?.trim();

      if (
        !description ||
        !amount ||
        !isValidDateString(
          date
        )
      ) {
        continue;
      }

      const sourceId =
        record.id
          ?.trim() ||
        null;

      const duplicate =
        sourceId &&
        transactions.some(
          transaction =>
            transaction.sourceId ===
              sourceId ||
            transaction.id ===
              sourceId
        );

      if (
        duplicate
      ) {
        continue;
      }

      const categoryName =
        record.category
          ?.trim() ||
        "Other";

      addCategoryIfMissing(
        categoryName
      );

      const budgetName =
        record.budget
          ?.trim();

      const budgetId =
        budgets.find(
          budget =>
            budget.name
              .toLowerCase() ===
            String(
              budgetName ||
              ""
            ).toLowerCase()
        )?.id ||
        "";

      imported.push(
        {
          id:
            createId(),

          description,

          amount,

          type:
            record.type
              ?.trim()
              .toLowerCase() ===
            "income"
              ? "income"
              : "expense",

          category:
            categoryName,

          budgetId,

          date,

          notes:
            String(
              record.notes ||
              ""
            ).slice(
              0,
              250
            ),

          createdAt:
            Date.now(),

          generatedByRecurringRule:
            null,

          sourceId
        }
      );
    }

    transactions.push(
      ...imported
    );

    transactions =
      normalizeTransactions(
        transactions
      );

    saveAllData();
    populateCategorySelects();
    renderDashboard();

    showStatus(
      `${imported.length} ` +
      `transaction${
        imported.length ===
        1
          ? ""
          : "s"
      } imported.`
    );
  } catch (
    error
  ) {
    window.alert(
      `CSV import failed: ${error.message}`
    );
  } finally {
    elements.csvInput.value =
      "";
  }
}

function parseCSV(
  text
) {
  const rows =
    [];

  let row =
    [];

  let value =
    "";

  let insideQuotes =
    false;

  for (
    let index = 0;
    index <
    text.length;
    index += 1
  ) {
    const character =
      text[index];

    const nextCharacter =
      text[index + 1];

    if (
      character ===
        '"' &&
      insideQuotes &&
      nextCharacter ===
        '"'
    ) {
      value +=
        '"';

      index +=
        1;
    } else if (
      character ===
      '"'
    ) {
      insideQuotes =
        !insideQuotes;
    } else if (
      character ===
        "," &&
      !insideQuotes
    ) {
      row.push(
        value
      );

      value =
        "";
    } else if (
      (
        character ===
          "\n" ||
        character ===
          "\r"
      ) &&
      !insideQuotes
    ) {
      if (
        character ===
          "\r" &&
        nextCharacter ===
          "\n"
      ) {
        index +=
          1;
      }

      row.push(
        value
      );

      rows.push(
        row
      );

      row =
        [];

      value =
        "";
    } else {
      value +=
        character;
    }
  }

  if (
    value.length >
      0 ||
    row.length >
      0
  ) {
    row.push(
      value
    );

    rows.push(
      row
    );
  }

  return rows;
}

function exportFullBackup() {
  const backup = {
    app:
      "CBGrid",

    version:
      APP_VERSION,

    exportedAt:
      new Date()
        .toISOString(),

    data: {
      transactions,
      openingBalance,
      budgets,
      recurringRules,

      theme:
        localStorage.getItem(
          STORAGE_KEYS.theme
        ) ||
        "light",

      currency:
        selectedCurrency,

      categories
    }
  };

  downloadTextFile(
    `cbgrid-backup-${getTodayString()}.json`,
    JSON.stringify(
      backup,
      null,
      2
    ),
    "application/json"
  );

  showStatus(
    "Full backup exported."
  );
}

async function restoreFullBackup(
  file
) {
  try {
    const text =
      await file.text();

    const backup =
      JSON.parse(
        text
      );

    if (
      backup?.app !==
        "CBGrid" ||
      !backup.data ||
      typeof backup.data !==
        "object"
    ) {
      throw new Error(
        "This does not appear to be a valid CBGrid backup."
      );
    }

    const confirmed =
      window.confirm(
        "Restore this backup? Current CBGrid data in this browser will be replaced."
      );

    if (
      !confirmed
    ) {
      return;
    }

    transactions =
      normalizeTransactions(
        ensureArray(
          backup.data
            .transactions
        )
      );

    budgets =
      normalizeBudgets(
        ensureArray(
          backup.data
            .budgets
        )
      );

    recurringRules =
      normalizeRecurringRules(
        ensureArray(
          backup.data
            .recurringRules
        )
      );

    categories =
      normalizeCategories(
        ensureArray(
          backup.data
            .categories
        )
      );

    openingBalance =
      Number(
        backup.data
          .openingBalance ||
        0
      );

    if (
      Number.isNaN(
        openingBalance
      )
    ) {
      openingBalance =
        0;
    }

    selectedCurrency =
      CURRENCY_SYMBOLS[
        backup.data
          .currency
      ]
        ? backup.data
            .currency
        : "EUR";

    const restoredTheme =
      backup.data
        .theme ===
      "dark"
        ? "dark"
        : "light";

    localStorage.setItem(
      STORAGE_KEYS.theme,
      restoredTheme
    );

    saveAllData();
    loadTheme();
    populateCategorySelects();
    populateBudgetSelects();
    updateCurrencyElements();
    renderDashboard();
    renderCategoryChips();

    closeModal(
      elements.settingsModal
    );

    showStatus(
      "Backup restored successfully."
    );
  } catch (
    error
  ) {
    window.alert(
      `Backup restore failed: ${error.message}`
    );
  } finally {
    elements.backupInput.value =
      "";
  }
}

function downloadTextFile(
  filename,
  content,
  mimeType
) {
  const blob =
    new Blob(
      [
        content
      ],
      {
        type:
          mimeType
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement(
      "a"
    );

  link.href =
    url;

  link.download =
    filename;

  document.body
    .appendChild(
      link
    );

  link.click();
  link.remove();

  URL.revokeObjectURL(
    url
  );
}

function renderCategoryChips() {
  elements.categoryChips
    .innerHTML =
    "";

  categories.forEach(
    categoryName => {
      const isDefault =
        DEFAULT_CATEGORIES
          .includes(
            categoryName
          );

      const chip =
        document.createElement(
          "span"
        );

      chip.className =
        "category-chip";

      chip.innerHTML = `
        ${escapeHTML(
          categoryName
        )}

        ${
          isDefault
            ? ""
            : `
                <button
                  type="button"
                  data-category="${escapeHTML(
                    categoryName
                  )}"
                  aria-label="Delete ${escapeHTML(
                    categoryName
                  )}"
                >
                  ×
                </button>
              `
        }
      `;

      elements.categoryChips
        .appendChild(
          chip
        );
    }
  );

  elements.categoryChips
    .querySelectorAll(
      "button[data-category]"
    )
    .forEach(
      button => {
        button.addEventListener(
          "click",
          () => {
            removeCategory(
              button.dataset
                .category
            );
          }
        );
      }
    );
}

function addCategoryIfMissing(
  categoryName
) {
  const cleanedName =
    String(
      categoryName ||
      ""
    )
      .trim()
      .slice(
        0,
        30
      );

  if (
    !cleanedName
  ) {
    return false;
  }

  const exists =
    categories.some(
      category =>
        category
          .toLowerCase() ===
        cleanedName
          .toLowerCase()
    );

  if (
    exists
  ) {
    return false;
  }

  categories.push(
    cleanedName
  );

  return true;
}

function addCustomCategory() {
  const categoryName =
    elements.newCategory
      .value
      .trim();

  if (
    !addCategoryIfMissing(
      categoryName
    )
  ) {
    elements.settingsError
      .textContent =
      "Enter a unique category name.";

    return;
  }

  elements.newCategory.value =
    "";

  elements.settingsError
    .textContent =
    "";

  saveAllData();
  populateCategorySelects();
  renderCategoryChips();

  showStatus(
    "Category added."
  );
}

function removeCategory(
  categoryName
) {
  const categoryInUse =
    transactions.some(
      transaction =>
        transaction.category ===
        categoryName
    ) ||
    budgets.some(
      budget =>
        budget.category ===
        categoryName
    ) ||
    recurringRules.some(
      rule =>
        rule.category ===
        categoryName
    );

  if (
    categoryInUse
  ) {
    window.alert(
      "This category is currently in use. Reassign those items before deleting it."
    );

    return;
  }

  const confirmed =
    window.confirm(
      `Delete category "${categoryName}"?`
    );

  if (
    !confirmed
  ) {
    return;
  }

  categories =
    categories.filter(
      category =>
        category !==
        categoryName
    );

  saveAllData();
  populateCategorySelects();
  renderCategoryChips();

  showStatus(
    "Category deleted."
  );
}

function resetTransactionsData() {
  const confirmed =
    window.confirm(
      "Delete all transactions and recurring rules from this browser?"
    );

  if (
    !confirmed
  ) {
    return;
  }

  transactions =
    [];

  recurringRules =
    [];

  saveAllData();
  renderDashboard();

  showStatus(
    "Transactions and recurring rules reset."
  );
}

function resetBudgetsData() {
  const confirmed =
    window.confirm(
      "Delete all budgets from this browser?"
    );

  if (
    !confirmed
  ) {
    return;
  }

  budgets =
    [];

  transactions =
    transactions.map(
      transaction => ({
        ...transaction,
        budgetId:
          ""
      })
    );

  recurringRules =
    recurringRules.map(
      rule => ({
        ...rule,
        budgetId:
          ""
      })
    );

  saveAllData();
  populateBudgetSelects();
  renderDashboard();

  showStatus(
    "Budgets reset."
  );
}

function resetAllData() {
  const confirmation =
    window.prompt(
      "Type RESET to permanently remove all CBGrid data from this browser."
    );

  if (
    confirmation !==
    "RESET"
  ) {
    return;
  }

  Object.values(
    STORAGE_KEYS
  ).forEach(
    key => {
      localStorage.removeItem(
        key
      );
    }
  );

  transactions =
    [];

  budgets =
    [];

  recurringRules =
    [];

  categories =
    [
      ...DEFAULT_CATEGORIES
    ];

  openingBalance =
    0;

  selectedCurrency =
    "EUR";

  saveAllData();
  loadTheme();
  populateCategorySelects();
  populateBudgetSelects();
  updateCurrencyElements();
  renderDashboard();

  closeModal(
    elements.settingsModal
  );

  showStatus(
    "All CBGrid data reset."
  );
}

function calculateNextDate(
  dateString,
  frequency
) {
  return frequency ===
    "weekly"
    ? addDays(
        dateString,
        7
      )
    : addMonth(
        dateString
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
    date.getDate() +
    days
  );

  return formatLocalDate(
    date
  );
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

  date.setDate(
    1
  );

  date.setMonth(
    date.getMonth() +
    1
  );

  const lastDay =
    new Date(
      date.getFullYear(),
      date.getMonth() +
      1,
      0
    ).getDate();

  date.setDate(
    Math.min(
      originalDay,
      lastDay
    )
  );

  return formatLocalDate(
    date
  );
}

function generateRecurringTransactions() {
  const today =
    getTodayString();

  let dataChanged =
    false;

  recurringRules.forEach(
    rule => {
      if (
        !rule.active
      ) {
        return;
      }

      let safetyCounter =
        0;

      while (
        rule.nextDate <=
          today &&
        safetyCounter <
          500 &&
        (
          !rule.endDate ||
          rule.nextDate <=
            rule.endDate
        )
      ) {
        const sourceId =
          `${rule.id}:${rule.nextDate}`;

        const duplicateExists =
          transactions.some(
            transaction =>
              transaction.sourceId ===
              sourceId
          );

        if (
          !duplicateExists
        ) {
          transactions.push(
            {
              id:
                createId(),

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

              budgetId:
                rule.budgetId ||
                "",

              notes:
                "Generated automatically by a recurring rule.",

              date:
                rule.nextDate,

              createdAt:
                Date.now(),

              generatedByRecurringRule:
                rule.id,

              sourceId
            }
          );

          dataChanged =
            true;
        }

        rule.nextDate =
          calculateNextDate(
            rule.nextDate,
            rule.frequency
          );

        safetyCounter +=
          1;

        dataChanged =
          true;
      }

      if (
        rule.endDate &&
        rule.nextDate >
          rule.endDate
      ) {
        rule.active =
          false;

        dataChanged =
          true;
      }
    }
  );

  if (
    dataChanged
  ) {
    saveAllData();
  }
}

function loadTheme() {
  const savedTheme =
    localStorage.getItem(
      STORAGE_KEYS.theme
    );

  const darkTheme =
    savedTheme ===
    "dark";

  document.body
    .classList.toggle(
      "dark-theme",
      darkTheme
    );

  elements.themeButton
    .textContent =
    darkTheme
      ? "☀"
      : "☾";

  elements.themeButton
    .setAttribute(
      "aria-label",
      darkTheme
        ? "Switch to light mode"
        : "Switch to dark mode"
    );
}

function toggleTheme() {
  const darkTheme =
    document.body
      .classList.toggle(
        "dark-theme"
      );

  localStorage.setItem(
    STORAGE_KEYS.theme,
    darkTheme
      ? "dark"
      : "light"
  );

  loadTheme();
}

function renderDashboard() {
  renderSummary();
  renderTransactions();
  renderCategoryBreakdown();
  renderBudgets();
  renderRecurringRules();
}

function registerServiceWorker() {
  if (
    !(
      "serviceWorker"
      in navigator
    )
  ) {
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
                scope:
                  "./"
              }
            );

        console.log(
          "CBGrid service worker registered:",
          registration.scope
        );

        if (
          registration.waiting
        ) {
          waitingServiceWorker =
            registration.waiting;

          showUpdateAvailable();
        }

        registration.addEventListener(
          "updatefound",
          () => {
            const newWorker =
              registration.installing;

            if (
              !newWorker
            ) {
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
                  waitingServiceWorker =
                    newWorker;

                  showUpdateAvailable();
                }
              }
            );
          }
        );
      } catch (
        error
      ) {
        console.error(
          "CBGrid service worker registration failed:",
          error
        );
      }
    }
  );

  let refreshing =
    false;

  navigator
    .serviceWorker
    .addEventListener(
      "controllerchange",
      () => {
        if (
          refreshing
        ) {
          return;
        }

        refreshing =
          true;

        window.location
          .reload();
      }
    );
}

function showUpdateAvailable() {
  showStatus(
    "A new version of CBGrid is available.",
    {
      actionText:
        "Update now",

      action:
        () => {
          waitingServiceWorker
            ?.postMessage(
              {
                type:
                  "SKIP_WAITING"
              }
            );
        },

      autoHide:
        false
    }
  );
}

function setupInstallPrompt() {
  window.addEventListener(
    "beforeinstallprompt",
    event => {
      event.preventDefault();

      deferredInstallPrompt =
        event;

      elements.installButton
        .classList.remove(
          "hidden"
        );
    }
  );

  window.addEventListener(
    "appinstalled",
    () => {
      deferredInstallPrompt =
        null;

      elements.installButton
        .classList.add(
          "hidden"
        );

      showStatus(
        "CBGrid installed successfully."
      );
    }
  );
}

async function installApp() {
  if (
    !deferredInstallPrompt
  ) {
    showStatus(
      "Use your browser menu to install CBGrid."
    );

    return;
  }

  deferredInstallPrompt
    .prompt();

  await deferredInstallPrompt
    .userChoice;

  deferredInstallPrompt =
    null;

  elements.installButton
    .classList.add(
      "hidden"
    );
}

function setupConnectivityStatus() {
  window.addEventListener(
    "offline",
    () => {
      showStatus(
        "You are offline. CBGrid is using locally saved data.",
        {
          autoHide:
            false
        }
      );
    }
  );

  window.addEventListener(
    "online",
    () => {
      showStatus(
        "You are back online."
      );
    }
  );

  if (
    !navigator.onLine
  ) {
    showStatus(
      "You are offline. CBGrid is using locally saved data.",
      {
        autoHide:
          false
      }
    );
  }
}

elements.addTransactionButton
  .addEventListener(
    "click",
    openNewTransactionModal
  );

elements.emptyAddButton
  .addEventListener(
    "click",
    openNewTransactionModal
  );

elements.settingsButton
  .addEventListener(
    "click",
    openSettingsModal
  );

elements.changeBalanceButton
  .addEventListener(
    "click",
    openSettingsModal
  );

elements.addBudgetButton
  .addEventListener(
    "click",
    openNewBudgetModal
  );

elements.installButton
  .addEventListener(
    "click",
    installApp
  );

elements.transactionClose
  .addEventListener(
    "click",
    () => {
      closeModal(
        elements.transactionModal
      );
    }
  );

elements.transactionCancel
  .addEventListener(
    "click",
    () => {
      closeModal(
        elements.transactionModal
      );
    }
  );

elements.settingsClose
  .addEventListener(
    "click",
    () => {
      closeModal(
        elements.settingsModal
      );
    }
  );

elements.settingsCancel
  .addEventListener(
    "click",
    () => {
      closeModal(
        elements.settingsModal
      );
    }
  );

elements.budgetClose
  .addEventListener(
    "click",
    () => {
      closeModal(
        elements.budgetModal
      );
    }
  );

elements.budgetCancel
  .addEventListener(
    "click",
    () => {
      closeModal(
        elements.budgetModal
      );
    }
  );

elements.recurringClose
  .addEventListener(
    "click",
    () => {
      closeModal(
        elements.recurringModal
      );
    }
  );

elements.recurringCancel
  .addEventListener(
    "click",
    () => {
      closeModal(
        elements.recurringModal
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

elements.recurringForm
  .addEventListener(
    "submit",
    handleRecurringSubmit
  );

elements.makeRecurring
  .addEventListener(
    "change",
    () => {
      elements.recurringOptions
        .classList.toggle(
          "hidden",
          !elements.makeRecurring
            .checked
        );
    }
  );

elements.transactionList
  .addEventListener(
    "click",
    handleTransactionListClick
  );

elements.search
  .addEventListener(
    "input",
    debounce(
      renderTransactions,
      120
    )
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

elements.clearFilters
  .addEventListener(
    "click",
    clearTransactionFilters
  );

elements.exportCsv
  .addEventListener(
    "click",
    exportTransactionsToCSV
  );

elements.importCsv
  .addEventListener(
    "click",
    () => {
      elements.csvInput
        .click();
    }
  );

elements.csvInput
  .addEventListener(
    "change",
    event => {
      const file =
        event.target
          .files?.[0];

      if (
        file
      ) {
        importTransactionsFromCSV(
          file
        );
      }
    }
  );

elements.themeButton
  .addEventListener(
    "click",
    toggleTheme
  );

elements.addCategory
  .addEventListener(
    "click",
    addCustomCategory
  );

elements.newCategory
  .addEventListener(
    "keydown",
    event => {
      if (
        event.key ===
        "Enter"
      ) {
        event.preventDefault();

        addCustomCategory();
      }
    }
  );

elements.exportBackup
  .addEventListener(
    "click",
    exportFullBackup
  );

elements.importBackup
  .addEventListener(
    "click",
    () => {
      elements.backupInput
        .click();
    }
  );

elements.backupInput
  .addEventListener(
    "change",
    event => {
      const file =
        event.target
          .files?.[0];

      if (
        file
      ) {
        restoreFullBackup(
          file
        );
      }
    }
  );

elements.resetTransactions
  .addEventListener(
    "click",
    resetTransactionsData
  );

elements.resetBudgets
  .addEventListener(
    "click",
    resetBudgetsData
  );

elements.resetAll
  .addEventListener(
    "click",
    resetAllData
  );

elements.statusClose
  .addEventListener(
    "click",
    hideStatus
  );

[
  elements.transactionModal,
  elements.settingsModal,
  elements.budgetModal,
  elements.recurringModal
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
      elements.budgetModal,
      elements.recurringModal
    ].forEach(
      modal => {
        if (
          !modal.classList
            .contains(
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
populateCategorySelects();
populateBudgetSelects();
updateCurrencyElements();
generateRecurringTransactions();
resetTransactionForm();
resetBudgetForm();
renderDashboard();
registerServiceWorker();
setupInstallPrompt();
setupConnectivityStatus();
setupSmoothWheelScrolling();
setupNavigationState();
