"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const bgImage = "/snowman-bg.png";

const initialEmployees = [
  "L1lpeepka",
  "Laphroaig",
  "NAPOLEON",
  "Poletk30",
  "Torreodor",
  "Clerc",
  "vezhlivost",
  "Dukh_Voina",
  "BOSS_WORKOW",
  "Sugrobb22",
  "Nasralli",
  "Shelby",
  "Eva@",
  "Бес",
  "Vesna",
  "Voin",
  "Seva",
  "Шеф",
  "Гоба",
  "Дукалиус Факула",
  "Tytikas",
  "Gabaglaz_95",
  "oleg4501",
  "KladmanOtBoga777",
];

const expenseCategories = ["Логистика", "Комиссия", "Выплаты", "Прочее", "Выдан купон"];
const employeeStatuses = ["Активный", "На паузе", "Потерялся", "Проблемный", "Топ", "Новичок"];

const cities = [
  "Москва",
  "Казань",
  "Набережные Челны",
  "Ступино",
  "Подольск",
  "Ногинск",
  "Серпухов",
  "Челябинск",
  "Уфа",
  "Самара",
  "Видное",
];

const products = [
  { name: "Товар 1", costPerGram: 650, stock: 0, grams: [0.5, 1, 2, 3, 5] },
  { name: "Товар 2", costPerGram: 650, stock: 0, grams: [0.5, 1, 2, 3, 5] },
  { name: "Товар 3", costPerGram: 1200, stock: 0, grams: [0.5, 1, 2, 3, 5] },
  { name: "Товар 4", costPerGram: 1, stock: 0, grams: [0.5, 1, 2, 3, 5] },
];

const initialPrices = {
  Москва: {
    "Товар 1": { 0.5: 1600, 1: 2500, 2: 4300, 3: 5600, 5: 8500 },
    "Товар 2": { 1: 2100, 2: 3900, 3: 5200 },
    "Товар 3": { 0.5: 1800, 1: 3000, 5: 12000 },
    "Товар 4": { 0.5: 1100, 1: 1900, 2: 3400 },
  },
  Казань: {
    "Товар 1": { 0.5: 1400, 1: 2300, 2: 3900, 3: 5200, 5: 7900 },
    "Товар 2": { 1: 1900, 2: 3500, 3: 4900 },
    "Товар 3": { 0.5: 1700, 1: 2900, 5: 11500 },
    "Товар 4": { 0.5: 1000, 1: 1800, 2: 3200 },
  },
  СПБ: {
    "Товар 1": { 0.5: 1500, 1: 2400, 2: 4100, 3: 5400, 5: 8200 },
    "Товар 2": { 1: 2200, 2: 4000, 3: 5300 },
    "Товар 3": { 0.5: 1900, 1: 3100, 5: 12500 },
    "Товар 4": { 0.5: 1150, 1: 2000, 2: 3600 },
  },
  Новосибирск: {
    "Товар 1": { 0.5: 1450, 1: 2350, 2: 4000, 3: 5300, 5: 8000 },
    "Товар 2": { 1: 2000, 2: 3700, 3: 5000 },
    "Товар 4": { 0.5: 1050, 1: 1850, 2: 3300 },
  },
  Екатеринбург: {
    "Товар 1": { 0.5: 1500, 1: 2400, 2: 4100, 3: 5400, 5: 8100 },
    "Товар 3": { 0.5: 1850, 1: 3050, 5: 12100 },
    "Товар 4": { 0.5: 1100, 1: 1950, 2: 3500 },
  },
};

const statuses = ["Успешно", "Диспут", "Возврат", "Замена", "В ожидании", "Не найдено", "Товар потерян", "Брак/списание", "Утеря"];
const compensationTypes = ["Нет", "Замена товаром", "Скидка 30%", "Скидка 50%", "Ручная компенсация"];
const lossStatuses = ["Не найдено", "Товар потерян", "Брак/списание", "Утеря"];
const nav = [
  { name: "Дашборд", icon: "🎛", badge: "" },
  { name: "Продажи", icon: "🛒", badge: "" },
  { name: "Склад", icon: "📦", badge: "" },
  { name: "Сотрудники", icon: "👥", badge: "" },
  { name: "Аналитика", icon: "📈", badge: "" },
  { name: "AI Аналитик", icon: "🤖", badge: "" },
  { name: "Проблемы", icon: "⚠️", badge: "" },
  { name: "Отчёты", icon: "📄", badge: "" },
  { name: "Расходы", icon: "💸", badge: "" },
  { name: "Выплаты", icon: "💵", badge: "" },
  { name: "Заметки", icon: "📝", badge: "" },
  { name: "Настройки", icon: "⚙️", badge: "" },
];

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function money(value) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function getProduct(name) {
  return products.find((product) => product.name === name);
}

function getCost(productName, gram) {
  const product = getProduct(productName);
  return Number(product?.costPerGram || 0) * Number(gram || 0);
}

function isLoss(status) {
  return lossStatuses.includes(status);
}

export default function Home() {
  const [active, setActive] = useState("Дашборд");
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [employeeList, setEmployeeList] = useState(initialEmployees);
  const [employeeMeta, setEmployeeMeta] = useState({});
  const [activeStore, setActiveStore] = useState("White Star");
  const [storeMenuOpen, setStoreMenuOpen] = useState(false);
  const [stores, setStores] = useState(["White Star", "SnowMan"]);

  React.useEffect(() => {
    const savedUser = localStorage.getItem("wssm-current-user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.warn("Не удалось загрузить пользователя", error);
      }
    }
  }, []);

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem("wssm-users") || "[]");
    } catch {
      return [];
    }
  }

  function saveCurrentUser(user) {
    setCurrentUser(user);
    localStorage.setItem("wssm-current-user", JSON.stringify(user));
  }

  function registerUser() {
    if (!authForm.name || !authForm.email || !authForm.password) {
      alert("Заполни имя, email и пароль");
      return;
    }
    const users = getUsers();
    const exists = users.some((user) => user.email.toLowerCase() === authForm.email.toLowerCase());
    if (exists) {
      alert("Пользователь с таким email уже есть");
      return;
    }
    const newUser = {
      id: Date.now(),
      name: authForm.name,
      email: authForm.email,
      role: "Владелец",
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("wssm-users", JSON.stringify([...users, { ...newUser, password: authForm.password }]));
    saveCurrentUser(newUser);
  }

  function loginUser() {
    const users = getUsers();
    const user = users.find((item) => item.email.toLowerCase() === authForm.email.toLowerCase() && item.password === authForm.password);
    if (!user) {
      alert("Неверный email или пароль");
      return;
    }
    const { password, ...safeUser } = user;
    saveCurrentUser(safeUser);
  }

  function logoutUser() {
    setCurrentUser(null);
    localStorage.removeItem("wssm-current-user");
  }
  const [toast, setToast] = useState(null);
  const [appReady, setAppReady] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState(null);
  const [period, setPeriod] = useState("7 дней");
  const [reportFrom, setReportFrom] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10));
  const [reportTo, setReportTo] = useState(localDateKey());
  const [liveNow, setLiveNow] = useState(new Date());


  React.useEffect(() => {
    const timer = setInterval(() => {
      setLiveNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  React.useEffect(() => {
    function handleKey(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((value) => !value);
      }
      if (event.key === "Escape") {
        setCommandOpen(false);
        setSelectedSale(null);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);
  const [filters, setFilters] = useState({ search: "", city: "Все", employee: "Все", status: "Все" });

  const liveDateLabel = liveNow.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const liveTimeLabel = liveNow.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const [priceMap, setPriceMap] = useState(initialPrices);
  const [productCosts, setProductCosts] = useState(
    Object.fromEntries(products.map((product) => [product.name, product.costPerGram]))
  );
  const [productCommissions, setProductCommissions] = useState(
    Object.fromEntries(products.map((product) => [product.name, 0]))
  );

  const [expenses, setExpenses] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [notes, setNotes] = useState([]);
  const [noteForm, setNoteForm] = useState({ author: "", to: "Всем", text: "", pinned: false });
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiMessages, setAiMessages] = useState([
    { role: "assistant", text: "Привет. Я AI-аналитик WS/SM. Можешь спросить: какой город самый прибыльный, кто чаще теряет, сколько ушло на замены, какой товар самый выгодный." },
  ]);
  const [courierStock, setCourierStock] = useState([]);
  const [stockForm, setStockForm] = useState({
    city: "Москва",
    employee: employeeList[0] || "",
    product: "Товар 1",
    gram: "1",
    qty: "1",
  });

  const [expenseForm, setExpenseForm] = useState({
    date: "2026-05-21",
    category: "Реклама",
    amount: "",
    comment: "",
  });

  const [sales, setSales] = useState([]);

  const [form, setForm] = useState({
    date: "2026-05-21",
    time: "21:00",
    city: "Москва",
    employee: "Иван",
    product: "Товар 1",
    gram: "1",
    price: "2500",
    courierPayout: "0",
    status: "Успешно",
    note: "",
    compensationType: "Нет",
    compensationAmount: "0",
    replacementProduct: "Товар 1",
    replacementGram: "1",
  });

  useEffect(() => {
    const saved = localStorage.getItem("pulse-crm-state");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.sales) setSales(parsed.sales);
        if (parsed.expenses) setExpenses(parsed.expenses);
        if (parsed.payouts) setPayouts(parsed.payouts);
        if (parsed.notes) setNotes(parsed.notes);
        if (parsed.courierStock) setCourierStock(parsed.courierStock);
        if (parsed.priceMap) setPriceMap(parsed.priceMap);
        if (parsed.productCatalog) {
          products.splice(0, products.length, ...parsed.productCatalog);
        }
        if (parsed.productCosts) setProductCosts(parsed.productCosts);
        if (parsed.productCommissions) setProductCommissions(parsed.productCommissions);
        if (parsed.employeeList) setEmployeeList(parsed.employeeList);
        if (parsed.employeeMeta) setEmployeeMeta(parsed.employeeMeta);
      } catch (error) {
        console.warn("Не удалось загрузить сохранённые данные", error);
      }
    }
    setAppReady(true);
  }, []);

  useEffect(() => {
    if (!appReady) return;
    localStorage.setItem("pulse-crm-state", JSON.stringify({ sales, expenses, payouts, notes, priceMap, productCosts, productCommissions, courierStock, employeeList, employeeMeta, productCatalog: products }));
  }, [appReady, sales, expenses, payouts, notes, priceMap, productCosts, productCommissions, courierStock, employeeList, employeeMeta]);

  const selectedProduct = getProduct(form.product);
  const availableGrams = selectedProduct?.grams || [];

  function autoPrice(nextForm) {
    return priceMap[nextForm.city]?.[nextForm.product]?.[Number(nextForm.gram)] || "";
  }

  function updateForm(patch) {
    const next = { ...form, ...patch };
    const price = autoPrice(next);
    setForm({ ...next, price: price || next.price });
  }

  function addSale() {
    if (!form.city || !form.employee || !form.product || !form.gram) return;

    const newSale = {
      id: Date.now(),
      ...form,
      gram: Number(form.gram),
      price: Number(form.price || 0),
      courierPayout: Number(form.courierPayout || 0),
    };

    setSales([newSale, ...sales]);
    setToast(isLoss(newSale.status) ? "⚠️ Добавлено списание/потеря" : "✅ Продажа успешно добавлена");
    setTimeout(() => setToast(null), 2500);
  }

  function deleteSale(id) {
    const ok = window.confirm("Удалить эту операцию? Данные по прибыли и складу пересчитаются автоматически.");
    if (!ok) return;
    setSales(sales.filter((sale) => sale.id !== id));
    setToast("🗑️ Операция удалена");
    setTimeout(() => setToast(null), 2500);
  }

  function isInReportPeriod(date) {
    if (!date) return false;
    return (!reportFrom || date >= reportFrom) && (!reportTo || date <= reportTo);
  }

  function exportReport() {
    const periodSales = sales.filter((sale) => isInReportPeriod(sale.date));
    const periodExpenses = expenses.filter((expense) => isInReportPeriod(expense.date));

    const lines = [];

    lines.push("WS/SM Report");
    lines.push(`Магазин;${activeStore}`);
    lines.push(`Период;${reportFrom || "начало"};${reportTo || "сегодня"}`);
    lines.push(`Дата выгрузки;${new Date().toLocaleString("ru-RU")}`);
    lines.push("");

    lines.push("Продажи");
    lines.push("Дата;Время;Город;Сотрудник;Товар;Граммовка;Цена;Выплата;Статус;Компенсация;Заметка");

    periodSales.forEach((sale) => {
      lines.push([
        sale.date || "",
        sale.time || "",
        sale.city || "",
        sale.employee || "",
        sale.product || "",
        sale.gram || "",
        sale.price || 0,
        sale.courierPayout || 0,
        sale.status || "",
        sale.compensationType || "Нет",
        sale.note || "",
      ].join(";"));
    });

    lines.push("");
    lines.push("Расходы");
    lines.push("Дата;Категория;Сумма;Комментарий");

    periodExpenses.forEach((expense) => {
      lines.push([
        expense.date || "",
        expense.category || "",
        expense.amount || 0,
        expense.comment || "",
      ].join(";"));
    });

    const csvContent = String.fromCharCode(0xfeff) + lines.join(String.fromCharCode(10));

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `WS-SM-report-${reportFrom || "from-start"}-${reportTo || "today"}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setToast(`📄 Отчёт выгружен: ${periodSales.length} продаж`);
    setTimeout(() => setToast(null), 2500);
  }

  function resetMonthSales() {
    const salesCount = sales.filter((sale) => isInReportPeriod(sale.date)).length;
    const expensesCount = expenses.filter((expense) => isInReportPeriod(expense.date)).length;
    const ok = window.confirm(`Сбросить данные за период ${reportFrom || "начало"} — ${reportTo || "сегодня"}? Будет удалено продаж: ${salesCount}, расходов: ${expensesCount}. Перед этим лучше выгрузить отчёт.`);
    if (!ok) return;
    setSales(sales.filter((sale) => !isInReportPeriod(sale.date)));
    setExpenses(expenses.filter((expense) => !isInReportPeriod(expense.date)));
    setToast(`♻️ Период очищен: ${salesCount} продаж, ${expensesCount} расходов`);
    setTimeout(() => setToast(null), 2500);
  }

  function deleteExpense(id) {
    const ok = window.confirm("Удалить этот расход? Касса пересчитается автоматически.");
    if (!ok) return;
    setExpenses(expenses.filter((expense) => expense.id !== id));
    setToast("🗑️ Расход удалён");
    setTimeout(() => setToast(null), 2500);
  }

  function addPayout(employee, amount, type = "Выплата", comment = "") {
    const value = Number(amount || 0);
    if (!employee || value <= 0) return;
    const payout = {
      id: Date.now(),
      date: localDateKey(),
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      employee,
      amount: value,
      type,
      comment: comment || "—",
    };
    setPayouts([payout, ...payouts]);
    setExpenses([{ id: Date.now() + 1, date: payout.date, category: "Выплаты", amount: value, comment: `${type}: ${employee}${comment ? ` — ${comment}` : ""}` }, ...expenses]);
    setToast(`💵 Выплата добавлена: ${employee}`);
    setTimeout(() => setToast(null), 2500);
  }

  function deletePayout(id) {
    const ok = window.confirm("Удалить выплату из истории? Связанный расход при необходимости удали отдельно в разделе Расходы.");
    if (!ok) return;
    setPayouts(payouts.filter((payout) => payout.id !== id));
    setToast("🗑️ Выплата удалена");
    setTimeout(() => setToast(null), 2500);
  }

  function updateSaleNote(id, note) {
    setSales(sales.map((sale) => (sale.id === id ? { ...sale, note } : sale)));
  }

  function addStaffNote() {
    if (!noteForm.text.trim()) return;
    const newNote = {
      id: Date.now(),
      date: localDateKey(),
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      author: noteForm.author || currentUser?.name || "Администратор",
      to: noteForm.to || "Всем",
      text: noteForm.text.trim(),
      pinned: Boolean(noteForm.pinned),
    };
    setNotes([newNote, ...notes]);
    setNoteForm({ ...noteForm, text: "", pinned: false });
    setToast("📝 Заметка добавлена");
    setTimeout(() => setToast(null), 2500);
  }

  function deleteStaffNote(id) {
    const ok = window.confirm("Удалить заметку?");
    if (!ok) return;
    setNotes(notes.filter((note) => note.id !== id));
  }

  function toggleStaffNotePin(id) {
    setNotes(notes.map((note) => note.id === id ? { ...note, pinned: !note.pinned } : note));
  }

  React.useEffect(() => {
    function handleExport() { exportReport(); }
    function handleReset() { resetMonthSales(); }
    window.addEventListener("export-wssm-report", handleExport);
    window.addEventListener("reset-wssm-sales", handleReset);
    return () => {
      window.removeEventListener("export-wssm-report", handleExport);
      window.removeEventListener("reset-wssm-sales", handleReset);
    };
  }, [sales, expenses, activeStore, reportFrom, reportTo]);

  const data = useMemo(() => {
    const calculatedRows = sales.map((sale) => {
      const costPerGram = Number(productCosts[sale.product] || getProduct(sale.product)?.costPerGram || 0);
      const cost = costPerGram * Number(sale.gram || 0);
      const courierPayout = isLoss(sale.status) ? 0 : Number(sale.courierPayout || 0);
      const revenue = isLoss(sale.status) ? 0 : sale.price;
      const platformCommissionPercent = Number(productCommissions[sale.product] || 0);
      const platformCommission = revenue * (platformCommissionPercent / 100);

      let compensationAmount = 0;
      let replacementCost = 0;

      if (sale.compensationType === "Скидка 30%") {
        compensationAmount = Number(sale.price || 0) * 0.3;
      } else if (sale.compensationType === "Скидка 50%") {
        compensationAmount = Number(sale.price || 0) * 0.5;
      } else if (sale.compensationType === "Ручная компенсация") {
        compensationAmount = Number(sale.compensationAmount || 0);
      } else if (sale.compensationType === "Замена товаром") {
        const replacementCostPerGram = Number(productCosts[sale.replacementProduct] || getProduct(sale.replacementProduct)?.costPerGram || 0);
        replacementCost = replacementCostPerGram * Number(sale.replacementGram || 0);
      }

      const totalCompensation = compensationAmount + replacementCost;
      const profit = revenue - cost - courierPayout - platformCommission - totalCompensation;
      const employeeBalance = isLoss(sale.status) ? -cost : courierPayout;
      return { ...sale, cost, revenue, courierPayout, platformCommissionPercent, platformCommission, compensationAmount, replacementCost, totalCompensation, profit, employeeBalance };
      return { ...sale, cost, revenue, courierPayout, compensationAmount, replacementCost, totalCompensation, profit, employeeBalance };
    });

    const rows = calculatedRows.filter((row) => {
      const search = filters.search.toLowerCase();
      const searchText = `${row.city} ${row.employee} ${row.product} ${row.status}`.toLowerCase();
      const matchSearch = !search || searchText.includes(search);
      const matchCity = filters.city === "Все" || row.city === filters.city;
      const matchEmployee = filters.employee === "Все" || row.employee === filters.employee;
      const matchStatus = filters.status === "Все" || row.status === filters.status;
      return matchSearch && matchCity && matchEmployee && matchStatus;
    });

    const revenue = rows.reduce((sum, row) => sum + row.revenue, 0);
    const cost = rows.reduce((sum, row) => sum + row.cost, 0);
    const profit = rows.reduce((sum, row) => sum + row.profit, 0);
    const totalCourierPayouts = rows.reduce((sum, row) => sum + Number(row.courierPayout || 0), 0);
    const totalPlatformCommission = rows.reduce((sum, row) => sum + Number(row.platformCommission || 0), 0);
    const roi = cost > 0 ? Math.round((profit / cost) * 100) : 0;
    const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
    const netCash = profit - totalExpenses;
    const losses = rows.filter((row) => isLoss(row.status)).reduce((sum, row) => sum + row.cost, 0);
    const successCount = rows.filter((row) => row.status === "Успешно").length;
    const successRate = rows.length ? Math.round((successCount / rows.length) * 100) : 0;

    const stock = products.map((product) => {
      const added = courierStock
        .filter((item) => item.product === product.name)
        .reduce((sum, item) => sum + Number(item.gram || 0) * Number(item.qty || 0), 0);
      const sold = calculatedRows
        .filter((row) => row.product === product.name)
        .reduce((sum, row) => sum + Number(row.gram), 0);
      const replacementSold = calculatedRows
        .filter((row) => row.compensationType === "Замена товаром" && row.replacementProduct === product.name)
        .reduce((sum, row) => sum + Number(row.replacementGram || 0), 0);
      return { name: product.name, start: added, sold: sold + replacementSold, left: added - sold - replacementSold };
    });

    const stockHistory = [
      ...courierStock.map((item) => ({
        id: `in-${item.id}`,
        date: item.date || "—",
        time: item.time || "—",
        type: "Приход",
        city: item.city,
        employee: item.employee,
        product: item.product,
        gram: item.gram,
        qty: item.qty,
        total: Number(item.gram || 0) * Number(item.qty || 0),
        comment: "Добавлено на руки курьеру",
      })),
      ...calculatedRows.map((row) => ({
        id: `sale-${row.id}`,
        date: row.date,
        time: row.time || "—",
        type: isLoss(row.status) ? "Потеря/списание" : "Продажа",
        city: row.city,
        employee: row.employee,
        product: row.product,
        gram: row.gram,
        qty: 1,
        total: Number(row.gram || 0),
        comment: row.status,
      })),
      ...calculatedRows
        .filter((row) => row.compensationType === "Замена товаром")
        .map((row) => ({
          id: `replace-${row.id}`,
          date: row.date,
          time: row.time || "—",
          type: "Замена",
          city: row.city,
          employee: row.employee,
          product: row.replacementProduct,
          gram: row.replacementGram,
          qty: 1,
          total: Number(row.replacementGram || 0),
          comment: `Замена по операции #${row.id}`,
        })),
    ].sort((a, b) => String(`${b.date} ${b.time}`).localeCompare(String(`${a.date} ${a.time}`)));

    const kpi = employeeList
      .map((employee) => {
        const own = rows.filter((row) => row.employee === employee);
        const ok = own.filter((row) => row.status === "Успешно").length;
        const bad = own.filter((row) => isLoss(row.status)).length;
        const disputes = own.filter((row) => row.status === "Диспут").length;
        const balance = own.reduce((sum, row) => sum + row.employeeBalance, 0);
        const paid = payouts.filter((payout) => payout.employee === employee).reduce((sum, payout) => sum + Number(payout.amount || 0), 0);
        const lastPayout = payouts.filter((payout) => payout.employee === employee).sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.time).localeCompare(String(a.time)))[0];
        const payoutDue = balance - paid;
        const rate = own.length ? Math.round((ok / own.length) * 100) : 0;
        const rating = rate + Math.round(balance / 1000) - bad * 15 - disputes * 5;
        return { employee, total: own.length, ok, bad, disputes, balance, paid, payoutDue, lastPayoutDate: lastPayout?.date || "—", rate, rating };
      })
      .sort((a, b) => b.payoutDue - a.payoutDue || b.rating - a.rating);

    const cityStats = cities
      .map((city) => {
        const own = rows.filter((row) => row.city === city);
        return {
          city,
          orders: own.length,
          revenue: own.reduce((sum, row) => sum + row.revenue, 0),
          profit: own.reduce((sum, row) => sum + row.profit, 0),
        };
      })
      .sort((a, b) => b.revenue - a.revenue);

    const productStats = products.map((product) => {
      const own = rows.filter((row) => row.product === product.name);
      return {
        product: product.name,
        grams: own.reduce((sum, row) => sum + Number(row.gram), 0),
        orders: own.length,
        revenue: own.reduce((sum, row) => sum + row.revenue, 0),
        profit: own.reduce((sum, row) => sum + row.profit, 0),
      };
    });

    const statusStats = statuses
      .map((status) => ({
        name: status,
        value: rows.filter((row) => row.status === status).length,
      }))
      .filter((item) => item.value > 0);

    const problemRows = rows.filter((row) =>
      isLoss(row.status) ||
      row.status === "Диспут" ||
      row.status === "Возврат" ||
      row.status === "Замена" ||
      (row.compensationType && row.compensationType !== "Нет")
    );

    const problemLosses = problemRows.reduce((sum, row) => sum + Math.max(0, Number(row.cost || 0)) + Math.max(0, Number(row.totalCompensation || 0)), 0);
    const replacementLosses = rows.reduce((sum, row) => sum + Number(row.replacementCost || 0), 0);
    const compensationLosses = rows.reduce((sum, row) => sum + Number(row.totalCompensation || 0), 0);

    const problemEmployees = employeeList
      .map((employee) => {
        const own = problemRows.filter((row) => row.employee === employee);
        return {
          employee,
          count: own.length,
          loss: own.reduce((sum, row) => sum + Number(row.totalCompensation || 0) + (isLoss(row.status) ? Number(row.cost || 0) : 0), 0),
        };
      })
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count || b.loss - a.loss);

    const problemCities = cities
      .map((city) => {
        const own = rows.filter((row) => row.city === city);
        const problems = own.filter((row) => problemRows.some((problem) => problem.id === row.id));
        return {
          city,
          total: own.length,
          problems: problems.length,
          rate: own.length ? Math.round((problems.length / own.length) * 100) : 0,
          loss: problems.reduce((sum, row) => sum + Number(row.totalCompensation || 0) + (isLoss(row.status) ? Number(row.cost || 0) : 0), 0),
        };
      })
      .filter((item) => item.total > 0)
      .sort((a, b) => b.rate - a.rate || b.loss - a.loss);

    const todayKey = localDateKey();
    const todayRows = rows.filter((row) => row.date === todayKey);
    const todayRevenue = todayRows.reduce((sum, row) => sum + Number(row.revenue || 0), 0);
    const todaySalesCount = todayRows.length;

    const metricSeries = {
      revenue: [12, 18, 14, 20, 17, 26, Math.max(8, Math.round(revenue / 1000))],
      sales: [3, 5, 4, 6, 5, 7, Math.max(1, rows.length)],
      success: [40, 55, 48, 62, 70, 76, Math.max(1, successRate)],
      losses: [2, 4, 3, 5, 4, 6, Math.max(1, problemRows.length || losses / 1000)],
      average: [8, 10, 9, 12, 14, 13, Math.max(1, Math.round((rows.length ? revenue / rows.length : 0) / 1000))],
      cash: [6, 8, 7, 9, 12, 10, Math.max(1, Math.round(Math.abs(netCash) / 1000))],
    };

    const dayStats = ["2026-05-18", "2026-05-19", "2026-05-20", "2026-05-21"].map((day) => {
      const own = rows.filter((row) => row.date === day);
      return {
        day: day.slice(5),
        revenue: own.reduce((sum, row) => sum + row.revenue, 0),
        profit: own.reduce((sum, row) => sum + row.profit, 0),
        orders: own.length,
      };
    });

    return { rows, revenue, cost, profit, totalCourierPayouts, totalPlatformCommission, roi, totalExpenses, netCash, losses, successRate, todayRevenue, todaySalesCount, metricSeries, stock, stockHistory, kpi, cityStats, productStats, statusStats, problemRows, problemLosses, replacementLosses, compensationLosses, problemEmployees, problemCities, dayStats, expenses, payouts, courierStock };
  }, [sales, filters, expenses, payouts, courierStock, employeeList, productCosts, productCommissions]);

  if (!currentUser) {
    return (
      <AuthScreen
        authMode={authMode}
        setAuthMode={setAuthMode}
        authForm={authForm}
        setAuthForm={setAuthForm}
        loginUser={loginUser}
        registerUser={registerUser}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#030712] text-white font-sans overflow-hidden">
      <style>{`
        @keyframes floatGlow { 0%,100% { transform: translateY(0) scale(1); opacity:.65 } 50% { transform: translateY(-18px) scale(1.06); opacity:1 } }
        @keyframes shimmer { 0% { transform: translateX(-120%) } 100% { transform: translateX(120%) } }
        @keyframes slowPan { 0% { transform: scale(1.03) translateX(0) } 50% { transform: scale(1.08) translateX(-18px) } 100% { transform: scale(1.03) translateX(0) } }
        .premium-card { position: relative; overflow: hidden; }
        .premium-card:before { content:""; position:absolute; inset:0; border-radius:24px; padding:1px; background:linear-gradient(135deg, rgba(59,130,246,.65), rgba(255,255,255,.08), rgba(14,165,233,.22)); -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0); -webkit-mask-composite:xor; mask-composite:exclude; pointer-events:none; }
        .premium-card:after { content:""; position:absolute; top:0; left:-60%; width:42%; height:100%; background:linear-gradient(90deg, transparent, rgba(255,255,255,.08), transparent); transform:skewX(-18deg); animation: shimmer 7s infinite; pointer-events:none; }
        .soft-scroll::-webkit-scrollbar { width: 10px; }
        .soft-scroll::-webkit-scrollbar-thumb { background: rgba(59,130,246,.35); border-radius: 999px; }
      `}</style>
      <div className="fixed inset-0 bg-cover bg-center opacity-70" style={{ backgroundImage: `url(${bgImage})`, animation: "slowPan 28s ease-in-out infinite" }} />
      <div className="fixed inset-0 bg-gradient-to-r from-[#030712]/95 via-[#030712]/45 to-[#030712]/75" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_58%_22%,rgba(37,99,235,0.08),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(14,165,233,0.14),transparent_28%)]" />
      <div className="fixed left-[18%] top-[18%] w-72 h-72 rounded-full bg-blue-500/15 blur-3xl" style={{ animation: "floatGlow 8s ease-in-out infinite" }} />
      <div className="fixed right-[10%] bottom-[12%] w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" style={{ animation: "floatGlow 11s ease-in-out infinite" }} />
      <div className="fixed inset-0 opacity-[0.12] bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden lg:flex w-72 bg-black/45 backdrop-blur-2xl border-r border-blue-400/15 p-5 flex-col gap-6 shadow-2xl shadow-blue-950/30">
          <div className="relative">
            <button
              onClick={() => setStoreMenuOpen((value) => !value)}
              className="w-full flex items-center gap-3 rounded-3xl p-2 hover:bg-white/5 transition text-left"
            >
              <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-400/40 grid place-items-center shadow-lg shadow-blue-500/20">〽</div>
              <div className="flex-1">
                <div className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-blue-200 to-cyan-400 bg-clip-text text-transparent">WS/SM</div>
                <div className="text-xs text-slate-400">{activeStore}</div>
              </div>
              <div className="text-slate-400 text-sm">⌄</div>
            </button>

            {storeMenuOpen && (
              <div className="absolute left-0 right-0 top-[64px] z-50 rounded-3xl bg-black/90 backdrop-blur-2xl border border-blue-400/20 shadow-2xl shadow-blue-600/20 p-2">
                {stores.map((store) => (
                  <button
                    key={store}
                    onClick={() => {
                      setActiveStore(store);
                      setStoreMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 text-left transition ${activeStore === store ? "bg-blue-600/25 text-white" : "text-slate-300 hover:bg-white/10"}`}
                  >
                    <span>{store}</span>
                    {activeStore === store && <span className="text-blue-300">●</span>}
                  </button>
                ))}

                <button
                  onClick={() => {
                    const name = window.prompt("Название нового магазина");
                    if (!name) return;
                    const clean = name.trim();
                    if (!clean || stores.includes(clean)) return;
                    setStores([...stores, clean]);
                    setActiveStore(clean);
                    setStoreMenuOpen(false);
                  }}
                  className="w-full rounded-2xl px-4 py-3 text-left text-emerald-300 hover:bg-emerald-500/10 transition border border-emerald-500/10 mt-1"
                >
                  + Новый магазин
                </button>
              </div>
            )}
          </div>

          <nav className="space-y-2">
            {nav.map((item) => (
              <button
                key={item.name}
                onClick={() => setActive(item.name)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition border ${active === item.name ? "bg-blue-600/25 text-white border-blue-400/50 shadow-lg shadow-blue-600/20" : "text-slate-300 border-transparent hover:bg-white/5 hover:text-white"}`}
              >
                <span className="flex items-center gap-3"><span>{item.icon}</span>{item.name}</span>
                {item.badge && <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">{item.badge}</span>}
              </button>
            ))}
          </nav>

          <button onClick={logoutUser} title="Выйти из аккаунта" className="mt-auto flex items-center justify-between rounded-3xl bg-black/30 border border-white/10 p-4 hover:bg-white/5 hover:border-blue-400/30 transition text-left">
            <div>
              <div className="font-bold truncate">{currentUser?.name || "Администратор"}</div>
              <div className="text-xs text-slate-400">Главный доступ · нажми для выхода</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-400/30" />
          </button>
        </aside>

        <section className="flex-1 p-3 sm:p-4 md:p-8 pb-28 lg:pb-8 space-y-5 md:space-y-6 overflow-y-auto max-h-screen soft-scroll">
          {toast && <Toast text={toast} />}
          {commandOpen && <CommandPalette setActive={setActive} setCommandOpen={setCommandOpen} />}
          {selectedSale && <SaleModal sale={selectedSale} onClose={() => setSelectedSale(null)} />}

          <header className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 md:gap-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-2">
                <div className="inline-flex items-center gap-2 text-emerald-300 text-sm rounded-full bg-emerald-500/10 border border-emerald-400/20 px-3 py-1">● Online</div>
                <div className="inline-flex items-center gap-2 text-slate-300 text-sm rounded-full bg-black/30 border border-white/10 px-3 py-1">{liveDateLabel} · {liveTimeLabel}</div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight drop-shadow-[0_0_24px_rgba(59,130,246,.35)]">Привет, Администратор 👑</h1>
              <p className="text-slate-300 mt-2">Магазин: <span className="text-blue-200 font-bold">{activeStore}</span> · вот что происходит в системе сегодня</p>
            </div>
            <div className="flex gap-2 md:gap-3 items-center flex-wrap">
              <div className="w-[calc(50%-4px)] sm:w-auto"><Input type="date" value={reportFrom} onChange={(event) => setReportFrom(event.target.value)} /></div>
              <div className="w-[calc(50%-4px)] sm:w-auto"><Input type="date" value={reportTo} onChange={(event) => setReportTo(event.target.value)} /></div>
              <button onClick={exportReport} className="rounded-2xl bg-black/45 backdrop-blur-xl border border-emerald-400/20 px-3 md:px-4 py-3 text-xs md:text-sm hover:bg-emerald-600/20 transition">📄 <span className="hidden sm:inline">Отчёт</span></button>
              <button onClick={resetMonthSales} className="rounded-2xl bg-black/45 backdrop-blur-xl border border-red-400/20 px-3 md:px-4 py-3 text-xs md:text-sm hover:bg-red-600/20 transition">♻️ <span className="hidden sm:inline">Сброс</span></button>
              <button onClick={() => setCommandOpen(true)} className="rounded-2xl bg-black/45 backdrop-blur-xl border border-blue-400/20 px-3 md:px-4 py-3 text-xs md:text-sm hover:bg-blue-600/20 transition">⌘K</button>
              <button className="rounded-2xl bg-black/45 backdrop-blur-xl border border-blue-400/20 px-4 py-3 text-sm hover:bg-blue-600/20 transition relative">🔔 <span className="absolute -top-2 -right-2 text-xs bg-red-500 px-2 py-0.5 rounded-full animate-pulse">5</span></button>
            </div>
            </header>

          <FilterBar filters={filters} setFilters={setFilters} employeeList={employeeList} />

          {active === "Дашборд" && <Dashboard data={data} period={period} setPeriod={setPeriod} setSelectedSale={setSelectedSale} deleteSale={deleteSale} updateSaleNote={updateSaleNote} />}
          {active === "Продажи" && <Sales data={data} form={form} setForm={setForm} updateForm={updateForm} addSale={addSale} availableGrams={availableGrams} setSelectedSale={setSelectedSale} employeeList={employeeList} deleteSale={deleteSale} updateSaleNote={updateSaleNote} />}
          {active === "Склад" && <Inventory data={data} stockForm={stockForm} setStockForm={setStockForm} courierStock={courierStock} setCourierStock={setCourierStock} employeeList={employeeList} />}
          {active === "Сотрудники" && <Team data={data} employeeList={employeeList} setEmployeeList={setEmployeeList} employeeMeta={employeeMeta} setEmployeeMeta={setEmployeeMeta} />}
          {active === "Аналитика" && <Analytics data={data} />}
          {active === "AI Аналитик" && <AiAnalyst data={data} aiQuestion={aiQuestion} setAiQuestion={setAiQuestion} aiMessages={aiMessages} setAiMessages={setAiMessages} />}
          {active === "Проблемы" && <Problems data={data} setSelectedSale={setSelectedSale} deleteSale={deleteSale} updateSaleNote={updateSaleNote} />}
          {active === "Отчёты" && <Reports data={data} setSelectedSale={setSelectedSale} deleteSale={deleteSale} updateSaleNote={updateSaleNote} />}
          {active === "Расходы" && <Expenses data={data} expenseForm={expenseForm} setExpenseForm={setExpenseForm} setExpenses={setExpenses} expenses={expenses} deleteExpense={deleteExpense} />}
          {active === "Выплаты" && <Payouts data={data} addPayout={addPayout} deletePayout={deletePayout} />}
          {active === "Заметки" && <StaffNotes notes={notes} noteForm={noteForm} setNoteForm={setNoteForm} addStaffNote={addStaffNote} deleteStaffNote={deleteStaffNote} toggleStaffNotePin={toggleStaffNotePin} employeeList={employeeList} currentUser={currentUser} />}
          {active === "Настройки" && <Settings priceMap={priceMap} setPriceMap={setPriceMap} productCosts={productCosts} setProductCosts={setProductCosts} productCommissions={productCommissions} setProductCommissions={setProductCommissions} employeeList={employeeList} />}
        </section>
      </div>
    </main>
  );
}

function AuthScreen({ authMode, setAuthMode, authForm, setAuthForm, loginUser, registerUser }) {
  const isRegister = authMode === "register";
  return (
    <main className="min-h-screen bg-[#030712] text-white font-sans overflow-hidden grid place-items-center p-4 relative">
      <div className="fixed inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${bgImage})` }} />
      <div className="fixed inset-0 bg-gradient-to-br from-[#030712]/95 via-[#030712]/70 to-[#030712]/95" />
      <div className="fixed left-[20%] top-[20%] w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="relative z-10 w-full max-w-md rounded-[32px] bg-black/50 backdrop-blur-2xl border border-blue-400/20 shadow-2xl shadow-blue-700/20 p-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 rounded-3xl bg-blue-600/20 border border-blue-400/40 grid place-items-center shadow-lg shadow-blue-500/20 text-3xl">〽</div>
          <h1 className="text-4xl font-black mt-4 bg-gradient-to-r from-white via-blue-200 to-cyan-400 bg-clip-text text-transparent">WS/SM</h1>
          <p className="text-slate-400 text-sm mt-1">White Star × SnowMan</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-5 rounded-2xl bg-white/5 p-1 border border-white/10">
          <button onClick={() => setAuthMode("login")} className={`rounded-xl py-3 text-sm transition ${!isRegister ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}>Вход</button>
          <button onClick={() => setAuthMode("register")} className={`rounded-xl py-3 text-sm transition ${isRegister ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}>Регистрация</button>
        </div>

        <div className="space-y-3">
          {isRegister && (
            <Field label="Имя" hint="владелец аккаунта">
              <Input value={authForm.name} onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })} placeholder="Например: Admin" />
            </Field>
          )}
          <Field label="Email" hint="для входа">
            <Input value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} placeholder="email@example.com" />
          </Field>
          <Field label="Пароль" hint="минимум 4 символа">
            <Input type="password" value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} placeholder="••••••••" />
          </Field>
        </div>

        <button onClick={isRegister ? registerUser : loginUser} className="mt-5 w-full rounded-2xl bg-blue-600 hover:bg-blue-500 transition px-6 py-4 font-bold shadow-lg shadow-blue-600/25">
          {isRegister ? "Создать аккаунт" : "Войти"}
        </button>

        <p className="text-xs text-slate-500 text-center mt-4">Демо-режим: аккаунт хранится локально в браузере. Для аренды подключим облачную базу и безопасную авторизацию.</p>
      </div>
    </main>
  );
}

function FilterBar({ filters, setFilters, employeeList }) {
  return (
    <Panel title="Поиск и фильтры">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Field label="Поиск" hint="город, товар, сотрудник, заметка">
          <Input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Поиск" />
        </Field>
        <Field label="Город" hint="фильтр по городу">
          <Select value={filters.city} onChange={(event) => setFilters({ ...filters, city: event.target.value })} options={["Все", ...cities]} />
        </Field>
        <Field label="Сотрудник" hint="фильтр по курьеру">
          <Select value={filters.employee} onChange={(event) => setFilters({ ...filters, employee: event.target.value })} options={["Все", ...employeeList]} />
        </Field>
        <Field label="Статус" hint="итог операции">
          <Select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })} options={["Все", ...statuses]} />
        </Field>
      </div>
    </Panel>
  );
}

function Dashboard({ data, period, setPeriod, setSelectedSale, deleteSale, updateSaleNote }) {
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
        <Metric title="Оборот" value={money(data.revenue)} sub={`Сегодня: ${money(data.todayRevenue)}`} color="blue" icon="💎" series={data.metricSeries.revenue} />
        <Metric title="Продаж" value={data.rows.length} sub={`Сегодня: ${data.todaySalesCount}`} color="cyan" icon="🛍" series={data.metricSeries.sales} />
        <Metric title="Успешные" value={data.rows.filter((row) => row.status === "Успешно").length} sub={`${data.successRate}% успешности`} color="green" icon="✅" series={data.metricSeries.success} />
        <Metric title="Потери" value={money(data.losses)} sub={`Проблем: ${data.problemRows.length}`} color="red" icon="🚨" series={data.metricSeries.losses} />
        <Metric title="Средний чек" value={money(data.rows.length ? data.revenue / data.rows.length : 0)} sub={`Сред. прибыль: ${money(data.rows.length ? data.profit / data.rows.length : 0)}`} color="purple" icon="💳" series={data.metricSeries.average} />
        <Metric title="Чистая касса" value={money(data.netCash)} sub={`Расходы: ${money(data.totalExpenses)}`} color="orange" icon="🏦" series={data.metricSeries.cash} />
        <Metric title="Комиссия площадки" value={money(data.totalPlatformCommission)} sub="автоматически по товарам" color="red" icon="🏛️" series={data.metricSeries.losses} />
        <Metric title="Выплаты курьерам" value={money(data.totalCourierPayouts)} sub="начислено по операциям" color="cyan" icon="💵" series={data.metricSeries.sales} />
        <Metric title="ROI" value={`${data.roi}%`} sub="прибыль / себестоимость" color={data.roi >= 0 ? "green" : "red"} icon="📈" series={data.metricSeries.success} />
      </section>

      <section className="grid grid-cols-1 2xl:grid-cols-[1.45fr_.8fr] gap-6 items-stretch">
        <Panel title="Динамика оборота и прибыли">
          <div className="flex justify-between items-center -mt-2 mb-3">
            <div className="text-sm text-slate-400">Главный график · revenue control</div>
            <select value={period} onChange={(event) => setPeriod(event.target.value)} className="rounded-xl bg-black/50 border border-white/10 px-3 py-2 text-sm outline-none">
              <option>7 дней</option>
              <option>30 дней</option>
              <option>Месяц</option>
            </select>
          </div>
          <RevenueAreaChart data={data.dayStats} big />
        </Panel>

        <div className="space-y-6">
          <Panel title="Топ городов по обороту"><CityBarChart items={data.cityStats} compact /></Panel>
          <Panel title="Статусы операций"><StatusDonut items={data.statusStats} /></Panel>
        </div>
      </section>

      <section className="grid grid-cols-1 2xl:grid-cols-[1.25fr_.75fr] gap-6">
        <OperationsTable rows={data.rows.slice(0, 6)} compact setSelectedSale={setSelectedSale} deleteSale={deleteSale} updateSaleNote={updateSaleNote} />
        <Panel title="KPI сотрудников"><TeamList kpi={data.kpi.slice(0, 5)} /></Panel>
      </section>

      <section className="grid grid-cols-1 2xl:grid-cols-[1fr_.75fr] gap-6">
        <Panel title="Товары по прибыли"><ProductProfitChart items={data.productStats} /></Panel>
        <RightPanel data={data} />
      </section>

      <section className="grid grid-cols-1 2xl:grid-cols-[1fr_1fr] gap-6">
        <Panel title="Heatmap городов"><CityHeatmap items={data.cityStats} /></Panel>
        <Panel title="Топ сотрудников"><TopEmployees items={data.kpi.slice(0, 6)} /></Panel>
      </section>

      <section className="grid grid-cols-1 2xl:grid-cols-[1.15fr_.85fr] gap-6">
        <Panel title="График прибыли"><ProfitLineChart data={data.dayStats} /></Panel>
        <Panel title="Динамика недели"><WeekDynamics data={data.dayStats} /></Panel>
      </section>
    </div>
  );
}

function Sales({ data, form, updateForm, setForm, addSale, availableGrams, setSelectedSale, employeeList, deleteSale, updateSaleNote }) {
  return (
    <div className="space-y-6">
      <Panel title="Быстрый ввод операции">
        <div className="grid grid-cols-1 md:grid-cols-4 xl:grid-cols-5 gap-3">
          <Field label="Дата" hint="День операции">
            <Input type="date" value={form.date} onChange={(event) => setForm({ ...form, date: event.target.value })} />
          </Field>
          <Field label="Время" hint="Когда была операция">
            <Input type="time" value={form.time} onChange={(event) => setForm({ ...form, time: event.target.value })} />
          </Field>
          <Field label="Город" hint="Где была продажа">
            <Select value={form.city} onChange={(event) => updateForm({ city: event.target.value })} options={cities} />
          </Field>
          <Field label="Сотрудник" hint="Кто отвечает">
            <Select value={form.employee} onChange={(event) => setForm({ ...form, employee: event.target.value })} options={employeeList} />
          </Field>
          <Field label="Товар" hint="Что продано">
            <Select value={form.product} onChange={(event) => { const product = getProduct(event.target.value); updateForm({ product: event.target.value, gram: String(product?.grams?.[0] || 1) }); }} options={products.map((product) => product.name)} />
          </Field>
          <Field label="Граммовка" hint="Сколько списать со склада">
            <Select value={form.gram} onChange={(event) => updateForm({ gram: event.target.value })} options={availableGrams.map(String)} />
          </Field>
          <Field label="Цена продажи" hint="Подтягивается автоматически">
            <Input value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="Цена продажи" />
          </Field>
          <Field label="Выплата курьеру" hint="Вычитается из прибыли">
            <Input value={form.courierPayout} onChange={(event) => setForm({ ...form, courierPayout: event.target.value })} placeholder="Выплата курьеру" />
          </Field>
          <Field label="Статус" hint="Итог операции">
            <Select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} options={statuses} />
          </Field>
          <Field label="Заметка" hint="Комментарий к операции">
            <Input value={form.note} onChange={(event) => setForm({ ...form, note: event.target.value })} placeholder="Например: скидка, замена, долг..." />
          </Field>
          <Field label="Компенсация" hint="Скидка или замена">
            <Select value={form.compensationType} onChange={(event) => setForm({ ...form, compensationType: event.target.value })} options={compensationTypes} />
          </Field>
          {form.compensationType === "Ручная компенсация" && (
            <Field label="Сумма компенсации" hint="Вычитается из прибыли">
              <Input value={form.compensationAmount} onChange={(event) => setForm({ ...form, compensationAmount: event.target.value })} placeholder="0" />
            </Field>
          )}
          {form.compensationType === "Замена товаром" && (
            <>
              <Field label="Товар замены" hint="Что выдали">
                <Select value={form.replacementProduct} onChange={(event) => { const product = getProduct(event.target.value); setForm({ ...form, replacementProduct: event.target.value, replacementGram: String(product?.grams?.[0] || 1) }); }} options={products.map((product) => product.name)} />
              </Field>
              <Field label="Фасовка замены" hint="Списывается со склада">
                <Select value={form.replacementGram} onChange={(event) => setForm({ ...form, replacementGram: event.target.value })} options={(getProduct(form.replacementProduct)?.grams || []).map(String)} />
              </Field>
            </>
          )}
        </div>
        <button onClick={addSale} className="mt-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition px-6 py-3 font-bold shadow-lg shadow-blue-600/25">Добавить операцию</button>
        <p className="text-slate-400 text-sm mt-3">Цена подтягивается по городу, товару и граммовке. Прибыль считается так: цена продажи − себестоимость − выплата курьеру.</p>
      </Panel>
      <OperationsTable rows={data.rows} setSelectedSale={setSelectedSale} deleteSale={deleteSale} updateSaleNote={updateSaleNote} />
    </div>
  );
}

function Inventory({ data, stockForm, setStockForm, courierStock, setCourierStock, employeeList }) {
  const selectedProduct = getProduct(stockForm.product);
  const grams = selectedProduct?.grams || [];

  function addCourierStock() {
    if (!stockForm.city || !stockForm.employee || !stockForm.product || !stockForm.gram || !stockForm.qty) return;
    const newItem = {
      id: Date.now(),
      date: localDateKey(),
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }),
      type: "Приход",
      city: stockForm.city,
      employee: stockForm.employee,
      product: stockForm.product,
      gram: Number(stockForm.gram),
      qty: Number(stockForm.qty),
    };
    setCourierStock([newItem, ...courierStock]);
    setStockForm({ ...stockForm, qty: "1" });
  }

  function removeCourierStock(id) {
    setCourierStock(courierStock.filter((item) => item.id !== id));
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
        {data.stock.map((item) => (
          <Panel key={item.name} title={item.name}>
            <div className="flex justify-between items-end">
              <div>
                <div className="text-slate-400 text-sm">Остаток</div>
                <div className={item.left < 10 ? "text-4xl font-black text-red-400" : "text-4xl font-black text-emerald-400"}>{item.left} г</div>
              </div>
              <div className="text-right text-sm text-slate-400">Списано<br /><span className="text-white font-bold">{item.sold} г</span></div>
            </div>
            <Progress value={item.start ? (item.left / item.start) * 100 : 0} color={item.left < 10 ? "red" : "blue"} />
            {item.left < 10 && <div className="mt-4 rounded-2xl bg-red-500/10 border border-red-500/20 p-3 text-red-300 text-sm">⚠️ Остаток низкий</div>}
          </Panel>
        ))}
      </section>

      <Panel title="Добавить товар на руках у курьера">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <Select value={stockForm.city} onChange={(event) => setStockForm({ ...stockForm, city: event.target.value })} options={cities} />
          <Select value={stockForm.employee} onChange={(event) => setStockForm({ ...stockForm, employee: event.target.value })} options={employeeList} />
          <Select value={stockForm.product} onChange={(event) => { const product = getProduct(event.target.value); setStockForm({ ...stockForm, product: event.target.value, gram: String(product?.grams?.[0] || 1) }); }} options={products.map((product) => product.name)} />
          <Select value={stockForm.gram} onChange={(event) => setStockForm({ ...stockForm, gram: event.target.value })} options={grams.map(String)} />
          <Input value={stockForm.qty} onChange={(event) => setStockForm({ ...stockForm, qty: event.target.value })} placeholder="Кол-во" />
        </div>
        <button onClick={addCourierStock} className="mt-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition px-6 py-3 font-bold shadow-lg shadow-blue-600/25">+ Добавить на руки</button>
        <p className="text-slate-400 text-sm mt-3">Например: Москва · L1lpeepka · Товар 1 · 1г · 10 шт. В общий склад добавится 10г.</p>
      </Panel>

      <Panel title="Товар на руках у курьеров">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-white/10">
                <th className="text-left py-3">Город</th>
                <th>Сотрудник</th>
                <th>Товар</th>
                <th>Фасовка</th>
                <th>Кол-во</th>
                <th>Всего г</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {courierStock.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="py-3">{item.city}</td>
                  <td className="text-center">{item.employee}</td>
                  <td className="text-center">{item.product}</td>
                  <td className="text-center">{item.gram} г</td>
                  <td className="text-center">{item.qty}</td>
                  <td className="text-center text-emerald-300 font-bold">{Number(item.gram) * Number(item.qty)} г</td>
                  <td className="text-right"><button onClick={() => removeCourierStock(item.id)} className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-1 hover:bg-red-500/20">Удалить</button></td>
                </tr>
              ))}
              {!courierStock.length && (
                <tr><td colSpan={7} className="py-6 text-center text-slate-400">Пока нет товара на руках</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title="История склада">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead>
              <tr className="text-slate-400 border-b border-white/10">
                <th className="text-left py-3">Дата</th>
                <th>Тип</th>
                <th>Город</th>
                <th>Сотрудник</th>
                <th>Товар</th>
                <th>Фасовка</th>
                <th>Кол-во</th>
                <th>Всего</th>
                <th>Комментарий</th>
              </tr>
            </thead>
            <tbody>
              {data.stockHistory.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="py-3 text-left">{item.date} {item.time}</td>
                  <td className="text-center">
                    <span className={
                      item.type === "Приход"
                        ? "rounded-full px-3 py-1 text-xs border bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
                        : item.type === "Замена"
                          ? "rounded-full px-3 py-1 text-xs border bg-purple-500/10 text-purple-300 border-purple-500/20"
                          : item.type === "Потеря/списание"
                            ? "rounded-full px-3 py-1 text-xs border bg-red-500/10 text-red-300 border-red-500/20"
                            : "rounded-full px-3 py-1 text-xs border bg-blue-500/10 text-blue-300 border-blue-500/20"
                    }>{item.type}</span>
                  </td>
                  <td className="text-center">{item.city}</td>
                  <td className="text-center">{item.employee}</td>
                  <td className="text-center">{item.product}</td>
                  <td className="text-center">{item.gram} г</td>
                  <td className="text-center">{item.qty}</td>
                  <td className={item.type === "Приход" ? "text-center text-emerald-300 font-bold" : "text-center text-red-300 font-bold"}>{item.type === "Приход" ? "+" : "-"}{item.total} г</td>
                  <td className="text-center text-slate-400">{item.comment}</td>
                </tr>
              ))}
              {!data.stockHistory.length && <tr><td colSpan={9} className="py-6 text-center text-slate-400">История склада пока пустая</td></tr>}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function Team({ data, employeeList, setEmployeeList, employeeMeta, setEmployeeMeta }) {
  const [newEmployee, setNewEmployee] = useState("");

  function addEmployee() {
    const name = newEmployee.trim();
    if (!name || employeeList.includes(name)) return;
    setEmployeeList([...employeeList, name]);
    setEmployeeMeta({ ...employeeMeta, [name]: { status: "Активный", note: "" } });
    setNewEmployee("");
  }

  function removeEmployee(name) {
    setEmployeeList(employeeList.filter((employee) => employee !== name));
    const nextMeta = { ...employeeMeta };
    delete nextMeta[name];
    setEmployeeMeta(nextMeta);
  }

  function updateEmployeeMeta(name, patch) {
    setEmployeeMeta({
      ...employeeMeta,
      [name]: {
        status: employeeMeta[name]?.status || "Активный",
        note: employeeMeta[name]?.note || "",
        ...patch,
      },
    });
  }

  function statusClass(status) {
    if (status === "Топ") return "text-emerald-300 border-emerald-500/20 bg-emerald-500/10";
    if (status === "Активный") return "text-blue-300 border-blue-500/20 bg-blue-500/10";
    if (status === "На паузе") return "text-yellow-300 border-yellow-500/20 bg-yellow-500/10";
    if (status === "Потерялся") return "text-red-300 border-red-500/20 bg-red-500/10";
    if (status === "Проблемный") return "text-orange-300 border-orange-500/20 bg-orange-500/10";
    return "text-slate-300 border-white/10 bg-white/5";
  }

  return (
    <div className="space-y-6">
      <Panel title="Добавить сотрудника">
        <div className="flex gap-3">
          <Input value={newEmployee} onChange={(event) => setNewEmployee(event.target.value)} placeholder="Имя / ник сотрудника" />
          <button onClick={addEmployee} className="rounded-2xl bg-blue-600 hover:bg-blue-500 transition px-6 font-bold">+</button>
        </div>
      </Panel>

      <Panel title="Список сотрудников и заметки">
        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
          {employeeList.map((employee) => {
            const meta = employeeMeta[employee] || { status: "Активный", note: "" };
            return (
              <div key={employee} className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold">{employee}</div>
                    <div className={`inline-flex mt-2 rounded-full border px-3 py-1 text-xs ${statusClass(meta.status)}`}>{meta.status}</div>
                  </div>
                  <button onClick={() => removeEmployee(employee)} className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-2 hover:bg-red-500/20">Удалить</button>
                </div>

                <Select
                  value={meta.status}
                  onChange={(event) => updateEmployeeMeta(employee, { status: event.target.value })}
                  options={employeeStatuses}
                />

                <textarea
                  value={meta.note}
                  onChange={(event) => updateEmployeeMeta(employee, { note: event.target.value })}
                  placeholder="Заметка: как работает, проблемы, комментарии..."
                  className="w-full min-h-[90px] rounded-2xl bg-black/35 border border-white/10 px-4 py-3 text-white outline-none focus:border-blue-400 backdrop-blur-xl resize-none"
                />
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel title="KPI и рейтинг сотрудников"><TeamList kpi={data.kpi} /></Panel>
    </div>
  );
}

function Analytics({ data }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Panel title="По городам"><StatsCards items={data.cityStats} main="city" /></Panel>
      <Panel title="По товарам"><ProductList items={data.productStats} /></Panel>
    </div>
  );
}

function Problems({ data, setSelectedSale, deleteSale, updateSaleNote }) {
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <Metric title="Проблемных операций" value={data.problemRows.length} sub="диспуты, потери, компенсации" color="red" icon="⚠️" />
        <Metric title="Потери" value={money(data.problemLosses)} sub="себестоимость + компенсации" color="red" icon="🧯" />
        <Metric title="Компенсации" value={money(data.compensationLosses)} sub="скидки и замены" color="orange" icon="🎁" />
        <Metric title="Замены товаром" value={money(data.replacementLosses)} sub="по себестоимости" color="purple" icon="🔁" />
        <Metric title="Успешность" value={`${data.successRate}%`} sub="процент успешных" color="green" icon="✅" />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Panel title="Кто чаще попадает в проблемы">
          <div className="space-y-3">
            {data.problemEmployees.map((item, index) => (
              <div key={item.employee} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="font-black">#{index + 1} {item.employee}</div>
                    <div className="text-sm text-slate-400">Проблемных операций: {item.count}</div>
                  </div>
                  <div className="text-red-300 font-black">{money(item.loss)}</div>
                </div>
                <Progress value={Math.min(100, item.count * 20)} color="red" />
              </div>
            ))}
            {!data.problemEmployees.length && <div className="text-slate-400">Проблем пока нет</div>}
          </div>
        </Panel>

        <Panel title="Проблемные города">
          <div className="space-y-3">
            {data.problemCities.map((item) => (
              <div key={item.city} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                <div className="flex justify-between gap-3">
                  <div>
                    <div className="font-black">{item.city}</div>
                    <div className="text-sm text-slate-400">{item.problems} проблем из {item.total} операций</div>
                  </div>
                  <div className={item.rate > 30 ? "text-red-300 font-black" : item.rate > 10 ? "text-yellow-300 font-black" : "text-emerald-300 font-black"}>{item.rate}%</div>
                </div>
                <Progress value={item.rate} color={item.rate > 30 ? "red" : item.rate > 10 ? "yellow" : "green"} />
                <div className="text-xs text-slate-500 mt-2">Потери/компенсации: {money(item.loss)}</div>
              </div>
            ))}
            {!data.problemCities.length && <div className="text-slate-400">Города без проблем</div>}
          </div>
        </Panel>
      </section>

      <OperationsTable rows={data.problemRows} setSelectedSale={setSelectedSale} deleteSale={deleteSale} updateSaleNote={updateSaleNote} />
    </div>
  );
}

function AiAnalyst({ data, aiQuestion, setAiQuestion, aiMessages, setAiMessages }) {
  function answerQuestion(question) {
    const q = question.toLowerCase();
    const bestCity = [...data.cityStats].sort((a, b) => b.profit - a.profit)[0];
    const bestProduct = [...data.productStats].sort((a, b) => b.profit - a.profit)[0];
    const worstEmployee = [...data.problemEmployees].sort((a, b) => b.count - a.count || b.loss - a.loss)[0];
    const bestEmployee = [...data.kpi].sort((a, b) => b.rating - a.rating)[0];

    if (q.includes("город") && (q.includes("приб") || q.includes("лучш") || q.includes("выгод"))) {
      return bestCity
        ? `Самый прибыльный город сейчас: ${bestCity.city}. Прибыль: ${money(bestCity.profit)}, оборот: ${money(bestCity.revenue)}, операций: ${bestCity.orders}.`
        : "Пока нет данных по городам.";
    }

    if (q.includes("товар") && (q.includes("выгод") || q.includes("приб") || q.includes("лучш"))) {
      return bestProduct
        ? `Самый выгодный товар: ${bestProduct.product}. Прибыль: ${money(bestProduct.profit)}, оборот: ${money(bestProduct.revenue)}, объём: ${bestProduct.grams} г.`
        : "Пока нет данных по товарам.";
    }

    if (q.includes("теря") || q.includes("потер") || q.includes("проблем")) {
      return worstEmployee
        ? `Больше всего проблем у сотрудника ${worstEmployee.employee}: ${worstEmployee.count} проблемных операций, потери/компенсации: ${money(worstEmployee.loss)}.`
        : "Проблемных операций пока нет.";
    }

    if (q.includes("замен")) {
      return `На замены товаром ушло: ${money(data.replacementLosses)}. Общие компенсации: ${money(data.compensationLosses)}.`;
    }

    if (q.includes("касс") || q.includes("баланс") || q.includes("день")) {
      return `Чистая касса сейчас: ${money(data.netCash)}. Оборот: ${money(data.revenue)}, прибыль до расходов: ${money(data.profit)}, расходы: ${money(data.totalExpenses)}.`;
    }

    if (q.includes("сотруд") || q.includes("курьер") || q.includes("лучш")) {
      return bestEmployee
        ? `Лучший сотрудник по рейтингу: ${bestEmployee.employee}. Успешность: ${bestEmployee.rate}%, баланс: ${money(bestEmployee.balance)}, операций: ${bestEmployee.total}.`
        : "Пока нет данных по сотрудникам.";
    }

    return `Краткая сводка: оборот ${money(data.revenue)}, прибыль ${money(data.profit)}, чистая касса ${money(data.netCash)}, успешность ${data.successRate}%, проблемных операций ${data.problemRows.length}.`;
  }

  function askAi() {
    const question = aiQuestion.trim();
    if (!question) return;
    const answer = answerQuestion(question);
    setAiMessages([...aiMessages, { role: "user", text: question }, { role: "assistant", text: answer }]);
    setAiQuestion("");
  }

  const quickQuestions = [
    "Какой город самый прибыльный?",
    "Кто чаще теряет?",
    "Сколько ушло на замены?",
    "Какой товар самый выгодный?",
    "Сколько сейчас чистая касса?",
    "Кто лучший сотрудник?",
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
      <Panel title="AI Аналитик WS/SM">
        <div className="h-[520px] overflow-y-auto soft-scroll space-y-3 pr-2 mb-4">
          {aiMessages.map((message, index) => (
            <div key={index} className={`rounded-3xl p-4 border ${message.role === "user" ? "bg-blue-600/15 border-blue-400/20 ml-12" : "bg-white/5 border-white/10 mr-12"}`}>
              <div className="text-xs text-slate-500 mb-1">{message.role === "user" ? "Ты" : "AI Аналитик"}</div>
              <div className="text-slate-100 leading-relaxed">{message.text}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <Input value={aiQuestion} onChange={(event) => setAiQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") askAi(); }} placeholder="Спроси про прибыль, потери, товары, города..." />
          <button onClick={askAi} className="rounded-2xl bg-blue-600 hover:bg-blue-500 transition px-6 py-3 font-bold whitespace-nowrap">Спросить</button>
        </div>
      </Panel>

      <Panel title="Быстрые вопросы">
        <div className="space-y-2">
          {quickQuestions.map((question) => (
            <button key={question} onClick={() => { const answer = answerQuestion(question); setAiMessages([...aiMessages, { role: "user", text: question }, { role: "assistant", text: answer }]); }} className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-3 text-left hover:bg-blue-600/15 hover:border-blue-400/30 transition">
              {question}
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-2xl bg-black/25 border border-white/10 p-4 text-sm text-slate-400">
          Сейчас это локальный аналитик по данным CRM. Позже можно подключить настоящий AI API, чтобы он понимал любые вопросы свободным текстом.
        </div>
      </Panel>
    </div>
  );
}

function Reports({ data, setSelectedSale, deleteSale, updateSaleNote }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
      <Metric title="Оборот" value={money(data.revenue)} sub="текущий период" color="blue" icon="📊" />
      <Metric title="Чистая прибыль" value={money(data.profit)} sub="после себестоимости" color="green" icon="💰" />
      <Metric title="Расходы" value={money(data.totalExpenses)} sub="учтены в кассе" color="orange" icon="💸" />
      <Metric title="Касса" value={money(data.netCash)} sub="прибыль минус расходы" color={data.netCash >= 0 ? "green" : "red"} icon="🏦" />
      <Panel title="Закрытие периода">
        <p className="text-slate-400 text-sm mb-4">Сначала выбери период в верхней панели, выгрузи отчёт, потом можно очистить продажи и расходы только за выбранные даты.</p>
        <div className="flex flex-col md:flex-row gap-3">
          <button onClick={() => window.dispatchEvent(new Event("export-wssm-report"))} className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 transition px-6 py-3 font-bold">📄 Выгрузить отчёт</button>
          <button onClick={() => window.dispatchEvent(new Event("reset-wssm-sales"))} className="rounded-2xl bg-red-600 hover:bg-red-500 transition px-6 py-3 font-bold">♻️ Сбросить продажи</button>
        </div>
      </Panel>
      <div className="xl:col-span-4"><OperationsTable rows={data.rows} setSelectedSale={setSelectedSale} deleteSale={deleteSale} updateSaleNote={updateSaleNote} /></div>
    </div>
  );
}

function Expenses({ data, expenseForm, setExpenseForm, setExpenses, expenses, deleteExpense }) {
  function addExpense() {
    if (!expenseForm.amount || Number(expenseForm.amount) <= 0) return;
    const newExpense = {
      id: Date.now(),
      date: expenseForm.date,
      category: expenseForm.category,
      amount: Number(expenseForm.amount),
      comment: expenseForm.comment || "—",
    };
    setExpenses([newExpense, ...expenses]);
    setExpenseForm({ ...expenseForm, amount: "", comment: "" });
  }

  const byCategory = expenseCategories.map((category) => {
    const total = expenses.filter((expense) => expense.category === category).reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
    return { category, total };
  }).filter((item) => item.total > 0);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Metric title="Всего расходов" value={money(data.totalExpenses)} sub="за выбранный период" color="orange" icon="💸" />
        <Metric title="Прибыль до расходов" value={money(data.profit)} sub="после себестоимости" color="green" icon="💰" />
        <Metric title="Чистая касса" value={money(data.netCash)} sub="итог с расходами" color={data.netCash >= 0 ? "green" : "red"} icon="🏦" />
      </section>

      <Panel title="Добавить расход">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input type="date" value={expenseForm.date} onChange={(event) => setExpenseForm({ ...expenseForm, date: event.target.value })} />
          <Select value={expenseForm.category} onChange={(event) => setExpenseForm({ ...expenseForm, category: event.target.value })} options={expenseCategories} />
          <Input value={expenseForm.amount} onChange={(event) => setExpenseForm({ ...expenseForm, amount: event.target.value })} placeholder="Сумма" />
          <Input value={expenseForm.comment} onChange={(event) => setExpenseForm({ ...expenseForm, comment: event.target.value })} placeholder="Комментарий" />
        </div>
        <button onClick={addExpense} className="mt-4 rounded-2xl bg-orange-600 hover:bg-orange-500 transition px-6 py-3 font-bold shadow-lg shadow-orange-600/25">Добавить расход</button>
      </Panel>

      <section className="grid grid-cols-1 xl:grid-cols-[.8fr_1.2fr] gap-6">
        <Panel title="Расходы по категориям">
          <div className="space-y-3">
            {byCategory.map((item) => (
              <div key={item.category} className="rounded-2xl bg-white/5 border border-white/10 p-4 flex justify-between">
                <span>{item.category}</span>
                <span className="text-orange-300 font-bold">{money(item.total)}</span>
              </div>
            ))}
            {!byCategory.length && <div className="text-slate-400">Расходов пока нет</div>}
          </div>
        </Panel>

        <Panel title="История расходов">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="text-slate-400 border-b border-white/10">
                  <th className="text-left py-3">Дата</th>
                  <th>Категория</th>
                  <th>Сумма</th>
                  <th>Комментарий</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="py-3">{expense.date}</td>
                    <td className="text-center">{expense.category}</td>
                    <td className="text-center text-orange-300 font-bold">{money(expense.amount)}</td>
                    <td className="text-center text-slate-300">{expense.comment}</td>
                    <td className="text-right">
                      <button
                        onClick={() => deleteExpense?.(expense.id)}
                        className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-1 hover:bg-red-500/20 transition"
                      >
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </section>
    </div>
  );
}

function Payouts({ data, addPayout, deletePayout }) {
  const [amounts, setAmounts] = useState({});
  const [payoutTypes, setPayoutTypes] = useState({});
  const [payoutComments, setPayoutComments] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(data.kpi[0]?.employee || "");

  const totalAccrued = data.kpi.reduce((sum, item) => sum + Number(item.balance || 0), 0);
  const totalPaid = data.kpi.reduce((sum, item) => sum + Number(item.paid || 0), 0);
  const totalDue = data.kpi.reduce((sum, item) => sum + Number(item.payoutDue || 0), 0);

  const selected = data.kpi.find((item) => item.employee === selectedEmployee) || data.kpi[0];
  const employeeRows = data.rows.filter((row) => row.employee === selected?.employee);
  const employeePayouts = data.payouts.filter((payout) => payout.employee === selected?.employee);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Metric title="Начислено" value={money(totalAccrued)} sub="по всем сотрудникам" color="blue" icon="📊" />
        <Metric title="Выплачено" value={money(totalPaid)} sub="по истории выплат" color="green" icon="💵" />
        <Metric title="К выплате" value={money(totalDue)} sub="актуальный общий баланс" color="orange" icon="🏦" />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
        <Panel title="Курьеры">
          <div className="space-y-2 max-h-[680px] overflow-y-auto soft-scroll pr-1">
            {data.kpi.map((item) => (
              <button
                key={item.employee}
                onClick={() => setSelectedEmployee(item.employee)}
                className={`w-full rounded-2xl border p-4 text-left transition ${selected?.employee === item.employee ? "bg-blue-600/20 border-blue-400/40" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-black truncate">{item.employee}</div>
                  <div className={item.payoutDue > 0 ? "text-emerald-300 font-black" : item.payoutDue < 0 ? "text-red-300 font-black" : "text-slate-400 font-black"}>{money(item.payoutDue)}</div>
                </div>
                <div className="text-xs text-slate-500 mt-1">Начислено: {money(item.balance)} · Выплачено: {money(item.paid)}</div>
              </button>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel title={`Баланс сотрудника: ${selected?.employee || "—"}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
              <InfoCell label="Начислено" value={money(selected?.balance || 0)} />
              <InfoCell label="Выплачено" value={money(selected?.paid || 0)} />
              <InfoCell label="К выплате" value={money(selected?.payoutDue || 0)} />
              <InfoCell label="Последняя выплата" value={selected?.lastPayoutDate || "—"} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_1.3fr_auto] gap-2">
              <Field label="Сумма" hint="сколько выплатить">
                <Input value={amounts[selected?.employee] || ""} onChange={(event) => setAmounts({ ...amounts, [selected?.employee]: event.target.value })} placeholder="Сумма выплаты" />
              </Field>
              <Field label="Тип" hint="за что">
                <Select value={payoutTypes[selected?.employee] || "Выплата"} onChange={(event) => setPayoutTypes({ ...payoutTypes, [selected?.employee]: event.target.value })} options={["Выплата", "Бонус", "Компенсация", "Аванс", "Корректировка"]} />
              </Field>
              <Field label="Комментарий" hint="пояснение">
                <Input value={payoutComments[selected?.employee] || ""} onChange={(event) => setPayoutComments({ ...payoutComments, [selected?.employee]: event.target.value })} placeholder="Например: за неделю / бонус / корректировка" />
              </Field>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    const employee = selected?.employee;
                    if (!employee) return;
                    addPayout(employee, amounts[employee] || selected?.payoutDue, payoutTypes[employee] || "Выплата", payoutComments[employee] || "");
                    setAmounts({ ...amounts, [employee]: "" });
                    setPayoutComments({ ...payoutComments, [employee]: "" });
                  }}
                  className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 transition px-6 py-3 font-bold whitespace-nowrap w-full"
                >
                  Выплатить
                </button>
              </div>
            </div>
            <p className="text-slate-500 text-xs mt-3">Если сумма пустая, система выплатит весь текущий баланс сотрудника. Комментарий попадёт в историю выплат и расходы.</p>
          </Panel>

          <Panel title="Расшифровка начислений и удержаний">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-white/10">
                    <th className="text-left py-3">Дата</th>
                    <th>Статус</th>
                    <th>Товар</th>
                    <th>Цена</th>
                    <th>Выплата</th>
                    <th>Удержание</th>
                    <th>Итог</th>
                    <th>Заметка</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeRows.map((row) => {
                    const hold = row.employeeBalance < 0 ? Math.abs(row.employeeBalance) : 0;
                    const payout = row.employeeBalance > 0 ? row.employeeBalance : 0;
                    return (
                      <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="py-3 text-left">{row.date} {row.time}</td>
                        <td className="text-center"><StatusBadge status={row.status} /></td>
                        <td className="text-center">{row.product} · {row.gram} г</td>
                        <td className="text-center">{money(row.price)}</td>
                        <td className="text-center text-emerald-300">{payout ? money(payout) : "—"}</td>
                        <td className="text-center text-red-300">{hold ? money(hold) : "—"}</td>
                        <td className={row.employeeBalance >= 0 ? "text-center text-emerald-300 font-bold" : "text-center text-red-300 font-bold"}>{money(row.employeeBalance || 0)}</td>
                        <td className="text-center text-slate-400">{row.note || row.compensationType || "—"}</td>
                      </tr>
                    );
                  })}
                  {!employeeRows.length && <tr><td colSpan={8} className="py-6 text-center text-slate-400">У сотрудника пока нет операций</td></tr>}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="История выплат выбранного сотрудника">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-sm">
                <thead>
                  <tr className="text-slate-400 border-b border-white/10">
                    <th className="text-left py-3">Дата</th>
                    <th>Время</th>
                    <th>Сумма</th>
                    <th>Тип</th>
                    <th>Комментарий</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {employeePayouts.map((payout) => (
                    <tr key={payout.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-3">{payout.date}</td>
                      <td className="text-center">{payout.time}</td>
                      <td className="text-center text-emerald-300 font-bold">{money(payout.amount)}</td>
                      <td className="text-center text-blue-300">{payout.type || "Выплата"}</td>
                      <td className="text-center text-slate-400">{payout.comment || "—"}</td>
                      <td className="text-right"><button onClick={() => deletePayout?.(payout.id)} className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-1 hover:bg-red-500/20 transition">Удалить</button></td>
                    </tr>
                  ))}
                  {!employeePayouts.length && <tr><td colSpan={6} className="py-6 text-center text-slate-400">Выплат этому сотруднику пока нет</td></tr>}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}

function StaffNotes({ notes, noteForm, setNoteForm, addStaffNote, deleteStaffNote, toggleStaffNotePin, employeeList, currentUser }) {
  const sortedNotes = [...notes].sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.id - a.id);

  return (
    <div className="space-y-6">
      <Panel title="Добавить заметку">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_2fr_auto] gap-3">
          <Field label="Автор" hint="кто пишет">
            <Select
              value={noteForm.author || currentUser?.name || "Администратор"}
              onChange={(event) => setNoteForm({ ...noteForm, author: event.target.value })}
              options={[currentUser?.name || "Администратор", ...employeeList]}
            />
          </Field>
          <Field label="Кому" hint="адресат">
            <Select
              value={noteForm.to}
              onChange={(event) => setNoteForm({ ...noteForm, to: event.target.value })}
              options={["Всем", ...employeeList]}
            />
          </Field>
          <Field label="Текст" hint="сообщение / напоминание">
            <Input
              value={noteForm.text}
              onChange={(event) => setNoteForm({ ...noteForm, text: event.target.value })}
              placeholder=""
            />
          </Field>
          <div className="flex items-end gap-2">
            <button
              onClick={() => setNoteForm({ ...noteForm, pinned: !noteForm.pinned })}
              className={`rounded-2xl border px-4 py-3 font-bold ${noteForm.pinned ? "bg-yellow-500/20 border-yellow-400/30 text-yellow-200" : "bg-white/5 border-white/10 text-slate-300"}`}
            >
              📌
            </button>
            <button onClick={addStaffNote} className="rounded-2xl bg-blue-600 hover:bg-blue-500 transition px-6 py-3 font-bold whitespace-nowrap">
              Добавить
            </button>
          </div>
        </div>
      </Panel>

      <Panel title="Доска заметок">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedNotes.map((note) => (
            <div key={note.id} className={`rounded-3xl border p-5 bg-white/5 ${note.pinned ? "border-yellow-400/40 shadow-lg shadow-yellow-500/10" : "border-white/10"}`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="font-black">{note.author}</div>
                  <div className="text-xs text-slate-500">{note.date} · {note.time}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleStaffNotePin(note.id)} className="rounded-xl bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 text-yellow-200">📌</button>
                  <button onClick={() => deleteStaffNote(note.id)} className="rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-1 text-red-300">Удалить</button>
                </div>
              </div>
              <div className="text-xs text-blue-300 mb-3">Кому: {note.to}</div>
              <div className="text-slate-200 leading-relaxed whitespace-pre-wrap">{note.text}</div>
            </div>
          ))}
          {!sortedNotes.length && <div className="text-slate-400">Заметок пока нет</div>}
        </div>
      </Panel>
    </div>
  );
}

function Settings({ priceMap, setPriceMap, productCosts, setProductCosts, productCommissions, setProductCommissions, employeeList }) {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [newCity, setNewCity] = useState("");
  const [newGram, setNewGram] = useState("");
  const [newProduct, setNewProduct] = useState("");

  function addCity() {
    const city = newCity.trim();
    if (!city || cities.includes(city)) return;
    cities.push(city);
    setSelectedCity(city);
    setNewCity("");
    setPriceMap((current) => ({ ...current, [city]: {} }));
  }

  function addGram() {
    const gram = Number(String(newGram).replace(",", "."));
    if (!gram || gram <= 0) return;

    products.forEach((product) => {
      if (!product.grams.includes(gram)) {
        product.grams.push(gram);
        product.grams.sort((a, b) => a - b);
      }
    });

    setNewGram("");
    setPriceMap((current) => ({ ...current }));
  }

  function addProduct() {
    const name = newProduct.trim();
    if (!name || products.some((product) => product.name === name)) return;
    const grams = Array.from(new Set(products.flatMap((product) => product.grams))).sort((a, b) => a - b);
    products.push({ name, costPerGram: 0, stock: 0, grams: grams.length ? grams : [0.5, 1, 2, 3, 5] });
    setProductCosts({ ...productCosts, [name]: 0 });
    setProductCommissions({ ...productCommissions, [name]: 0 });
    setNewProduct("");
  }

  function renameProduct(index, newName) {
    const oldName = products[index]?.name;
    if (oldName === undefined) return;

    products[index].name = newName;

    if (oldName && oldName !== newName) {
      const nextCosts = { ...productCosts, [newName]: productCosts[oldName] || 0 };
      delete nextCosts[oldName];
      setProductCosts(nextCosts);

      const nextCommissions = { ...productCommissions, [newName]: productCommissions[oldName] || 0 };
      delete nextCommissions[oldName];
      setProductCommissions(nextCommissions);

      setPriceMap((current) => {
        const next = { ...current };
        Object.keys(next).forEach((city) => {
          if (next[city]?.[oldName]) {
            next[city] = { ...next[city], [newName]: next[city][oldName] };
            delete next[city][oldName];
          }
        });
        return next;
      });
    } else {
      setProductCosts({ ...productCosts });
    }
  }

  function updatePrice(city, product, gram, value) {
    setPriceMap((current) => ({
      ...current,
      [city]: {
        ...(current[city] || {}),
        [product]: {
          ...(current[city]?.[product] || {}),
          [gram]: Number(value || 0),
        },
      },
    }));
  }

  return (
    <div className="space-y-6">
      <Panel title="Настройки справочников">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <DirectoryStat title="Сотрудников" value={employeeList.length} icon="👥" />
          <DirectoryStat title="Городов" value={cities.length} icon="🏙️" />
          <DirectoryStat title="Товаров" value={products.length} icon="📦" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 text-sm">
          <DirectoryBox title="Сотрудники" items={employeeList} />
          <DirectoryBox title="Города" items={cities} />
          <DirectoryBox title="Товары" items={products.map((product) => `${product.name} · ${product.grams.join(" / ")} г`)} />
        </div>
      </Panel>

      <Panel title="Себестоимость и товары">
        <p className="text-slate-400 text-sm mb-4">Добавляй товары, меняй названия и указывай себестоимость за 1г/ед. Она будет автоматически вычитаться из прибыли каждой продажи.</p>

        <div className="rounded-3xl bg-white/5 border border-white/10 p-4 mb-4">
          <div className="text-sm font-bold mb-3">Добавить новый товар</div>
          <div className="flex gap-2">
            <Input value={newProduct} onChange={(event) => setNewProduct(event.target.value)} placeholder="Название товара" />
            <button onClick={addProduct} className="rounded-2xl bg-blue-600 hover:bg-blue-500 transition px-5 font-bold">+</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {products.map((product, index) => (
            <div key={index} className="rounded-2xl bg-white/5 border border-white/10 p-4 space-y-3">
              <div>
                <div className="text-xs text-slate-500 mb-1">Название товара</div>
                <Input
                  value={product.name}
                  onChange={(event) => renameProduct(index, event.target.value)}
                  placeholder={`Товар ${index + 1}`}
                />
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Себестоимость за 1г/ед.</div>
                <Input
                  value={productCosts[product.name] || ""}
                  onChange={(event) => setProductCosts({ ...productCosts, [product.name]: Number(event.target.value || 0) })}
                  placeholder="Себестоимость за 1г"
                />
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Комиссия площадки, %</div>
                <Input
                  value={productCommissions[product.name] || ""}
                  onChange={(event) => setProductCommissions({ ...productCommissions, [product.name]: Number(event.target.value || 0) })}
                  placeholder="Например: 5"
                />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Цены по городам">
        <p className="text-slate-400 text-sm mb-5">
          Выбери город слева, потом настрой цены по товарам и граммовкам справа. В продажах цена будет подтягиваться автоматически, но её можно изменить вручную.
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mb-5">
          <div className="rounded-3xl bg-white/5 border border-white/10 p-4">
            <div className="text-sm font-bold mb-3">Добавить город</div>
            <div className="flex gap-2">
              <Input value={newCity} onChange={(event) => setNewCity(event.target.value)} placeholder="Например: Москва" />
              <button onClick={addCity} className="rounded-2xl bg-blue-600 hover:bg-blue-500 transition px-5 font-bold">+</button>
            </div>
          </div>

          <div className="rounded-3xl bg-white/5 border border-white/10 p-4">
            <div className="text-sm font-bold mb-3">Добавить фасовку ко всем товарам</div>
            <div className="flex gap-2">
              <Input value={newGram} onChange={(event) => setNewGram(event.target.value)} placeholder="Например: 10" />
              <button onClick={addGram} className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 transition px-5 font-bold">+</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-5">
          <div className="rounded-3xl bg-black/25 border border-white/10 p-3 space-y-2 max-h-[620px] overflow-y-auto soft-scroll">
            {cities.map((city) => {
              const filledCount = products.reduce((count, product) => {
                return count + product.grams.filter((gram) => Number(priceMap[city]?.[product.name]?.[gram] || 0) > 0).length;
              }, 0);

              return (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`w-full rounded-2xl px-4 py-3 text-left transition border ${selectedCity === city ? "bg-blue-600/25 border-blue-400/40 text-white shadow-lg shadow-blue-600/10" : "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10"}`}
                >
                  <div className="flex justify-between items-center gap-3">
                    <span className="font-bold">{city}</span>
                    <span className="text-xs rounded-full bg-black/30 border border-white/10 px-2 py-1">{filledCount}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">заполненных цен</div>
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 rounded-3xl bg-blue-600/10 border border-blue-400/20 p-4">
              <div>
                <div className="text-slate-400 text-sm">Выбранный город</div>
                <div className="text-2xl font-black">{selectedCity}</div>
              </div>
              <div className="text-sm text-slate-300">
                Товары: {products.length} · Граммовки: {Array.from(new Set(products.flatMap((product) => product.grams))).sort((a, b) => a - b).join(" / ")}
              </div>
            </div>

            <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
              {products.map((product) => {
                const filled = product.grams.filter((gram) => Number(priceMap[selectedCity]?.[product.name]?.[gram] || 0) > 0).length;
                return (
                  <div key={product.name} className="rounded-3xl bg-white/5 border border-white/10 p-5 hover:border-blue-400/30 transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-xl font-black">{product.name}</div>
                        <div className="text-xs text-slate-500 mt-1">Доступные фасовки: {product.grams.join(" / ")} г</div>
                      </div>
                      <div className="rounded-full bg-black/30 border border-white/10 px-3 py-1 text-xs text-slate-300">
                        {filled}/{product.grams.length}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.grams.map((gram) => (
                        <label key={gram} className="rounded-2xl bg-black/25 border border-white/10 p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-300 font-bold">{gram} г</span>
                            <span className="text-xs text-slate-500">цена</span>
                          </div>
                          <input
                            value={priceMap[selectedCity]?.[product.name]?.[gram] || ""}
                            onChange={(event) => updatePrice(selectedCity, product.name, gram, event.target.value)}
                            className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-white outline-none focus:border-blue-400"
                            placeholder="0 ₽"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}

function RightPanel({ data }) {
  const low = data.stock.filter((item) => item.left < 20);
  return (
    <aside className="space-y-4">
      <Panel title="Быстрые действия">
        <div className="grid grid-cols-2 gap-3">
          <QuickAction icon="➕" text="Продажа" />
          <QuickAction icon="📦" text="Склад" />
          <QuickAction icon="📊" text="Отчёт" />
          <QuickAction icon="🔔" text="Алерты" />
        </div>
      </Panel>

      <Panel title="Остатки на складе">
        <div className="space-y-3">
          {data.stock.map((item) => (
            <div key={item.name} className="flex justify-between text-sm">
              <span>{item.name}</span>
              <span className={item.left < 10 ? "text-red-400" : item.left < 25 ? "text-yellow-400" : "text-emerald-400"}>{item.left} г</span>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full rounded-2xl bg-white/5 border border-white/10 py-3 text-sm hover:bg-white/10 transition">Перейти на склад</button>
      </Panel>

      <Panel title="Live уведомления">
        <div className="space-y-3">
          <Notice tone="red" title="Критично низкий остаток" text={low[0] ? `${low[0].name}: осталось ${low[0].left} г` : "Пока всё стабильно"} />
          <Notice tone="yellow" title="Контроль статусов" text="Проверь диспуты и потери за день" />
          <Notice tone="blue" title="Новая операция" text={`Последняя: ${data.rows[0]?.city || "—"}, ${data.rows[0]?.product || "—"}`} />
          <Notice tone="green" title="План выполнен" text="Лучший сотрудник: Иван" />
        </div>
      </Panel>
    </aside>
  );
}

function QuickAction({ icon, text }) {
  return <button className="rounded-2xl bg-white/5 border border-white/10 p-4 text-left hover:bg-blue-600/20 hover:border-blue-400/30 transition hover:-translate-y-1 group"><div className="text-2xl group-hover:scale-110 transition">{icon}</div><div className="text-sm mt-2 text-slate-200">{text}</div></button>;
}

function Metric({ title, value, sub, color, icon, series }) {
  const colors = {
    blue: "from-blue-600/30 border-blue-400/30",
    cyan: "from-cyan-600/30 border-cyan-400/30",
    green: "from-emerald-600/30 border-emerald-400/30",
    red: "from-red-600/30 border-red-400/30",
    purple: "from-purple-600/30 border-purple-400/30",
    orange: "from-orange-600/30 border-orange-400/30",
  };

  const points = series && series.length ? series : [1, 2, 1, 3, 2, 4, 3];
  const max = Math.max(...points, 1);

  return (
    <div className={`rounded-3xl bg-gradient-to-br ${colors[color] || colors.blue} bg-black/40 border p-5 shadow-xl backdrop-blur-xl overflow-hidden relative`}>
      <div className="absolute right-4 top-4 w-12 h-12 rounded-2xl bg-blue-500/20 grid place-items-center text-xl">{icon}</div>
      <div className="text-slate-300 text-sm">{title}</div>
      <div className="text-3xl font-black mt-5">{value}</div>
      <div className={String(sub).includes("Проблем") || String(value).startsWith("-") ? "text-red-300 text-xs mt-2" : "text-emerald-300 text-xs mt-2"}>{sub}</div>
      <div className="mt-5 flex items-end gap-1 h-8">
        {points.map((point, index) => (
          <div
            key={index}
            className="flex-1 rounded-t bg-blue-500/70"
            style={{ height: `${Math.max(12, (Number(point) / max) * 100)}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function CommandPalette({ setActive, setCommandOpen }) {
  const commands = [
    { title: "Открыть дашборд", tab: "Дашборд", icon: "🎛" },
    { title: "Добавить продажу", tab: "Продажи", icon: "🛒" },
    { title: "Проверить склад", tab: "Склад", icon: "📦" },
    { title: "KPI сотрудников", tab: "Сотрудники", icon: "👥" },
    { title: "Аналитика", tab: "Аналитика", icon: "📈" },
  ];
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md grid place-items-start pt-24 px-4" onClick={() => setCommandOpen(false)}>
      <div className="w-full max-w-2xl mx-auto rounded-3xl bg-black/85 border border-blue-400/20 shadow-2xl shadow-blue-700/20 p-4" onClick={(event) => event.stopPropagation()}>
        <div className="text-sm text-slate-400 mb-3">Command Palette · Ctrl + K</div>
        <input autoFocus placeholder="Что открыть?" className="w-full rounded-2xl bg-white/5 border border-white/10 px-4 py-4 outline-none text-white mb-4" />
        <div className="space-y-2">
          {commands.map((command) => (
            <button key={command.title} onClick={() => { setActive(command.tab); setCommandOpen(false); }} className="w-full flex items-center gap-3 rounded-2xl px-4 py-3 hover:bg-blue-600/20 transition text-left">
              <span>{command.icon}</span><span>{command.title}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SaleModal({ sale, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md grid place-items-center p-4" onClick={onClose}>
      <div className="w-full max-w-xl rounded-3xl bg-black/85 border border-blue-400/20 shadow-2xl shadow-blue-700/20 p-6" onClick={(event) => event.stopPropagation()}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="text-slate-400 text-sm">Операция #{sale.id}</div>
            <h2 className="text-3xl font-black mt-1">{sale.product} · {sale.gram} г</h2>
          </div>
          <button onClick={onClose} className="rounded-xl bg-white/10 px-3 py-2 hover:bg-white/20">✕</button>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <InfoCell label="Город" value={sale.city} />
          <InfoCell label="Сотрудник" value={sale.employee} />
          <InfoCell label="Дата" value={`${sale.date} ${sale.time || ""}`} />
          <InfoCell label="Статус" value={sale.status} />
          <InfoCell label="Заметка" value={sale.note || "—"} />
          <InfoCell label="Компенсация" value={sale.compensationType && sale.compensationType !== "Нет" ? `${sale.compensationType}: ${money(sale.totalCompensation || 0)}` : "—"} />
          <InfoCell label="Цена" value={money(sale.price)} />
          <InfoCell label="Себестоимость" value={money(sale.cost || 0)} />
          <InfoCell label="Выплата курьеру" value={money(sale.courierPayout || 0)} />
          <InfoCell label="Комиссия площадки" value={money(sale.platformCommission || 0)} />
          <InfoCell label="Прибыль" value={money(sale.profit)} />
        </div>
      </div>
    </div>
  );
}

function InfoCell({ label, value }) {
  return <div className="rounded-2xl bg-white/5 border border-white/10 p-4"><div className="text-slate-500 text-xs">{label}</div><div className="font-bold mt-1">{value}</div></div>;
}

function Panel({ title, children }) {
  return (
    <section className="premium-card rounded-3xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-blue-950/25 p-5">
      <h2 className="text-xl font-black mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-sm font-bold text-slate-200">{label}</span>
        <span className="text-[11px] text-slate-500">{hint}</span>
      </div>
      {children}
    </label>
  );
}

function Input(props) {
  return <input {...props} className="w-full rounded-2xl bg-black/35 border border-white/10 px-4 py-3 text-white outline-none focus:border-blue-400 backdrop-blur-xl" />;
}

function Select({ options, ...props }) {
  return (
    <select {...props} className="w-full rounded-2xl bg-black/50 border border-white/10 px-4 py-3 text-white outline-none focus:border-blue-400 backdrop-blur-xl">
      {options.map((option) => <option className="bg-[#0b0f17]" key={option} value={option}>{option}</option>)}
    </select>
  );
}

function StatusBadge({ status }) {
  const className = status === "Успешно"
    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
    : status === "Диспут" || status === "Возврат"
      ? "bg-yellow-500/10 text-yellow-300 border-yellow-500/30"
      : "bg-red-500/10 text-red-300 border-red-500/30";
  return <span className={`inline-flex px-3 py-1 rounded-full text-xs border ${className}`}>{status}</span>;
}

function TeamList({ kpi }) {
  return (
    <div className="space-y-3">
      {kpi.map((person, index) => (
        <div key={person.employee} className="rounded-2xl bg-white/5 border border-white/10 p-4">
          <div className="flex justify-between gap-3">
            <div>
              <div className="font-black">#{index + 1} {person.employee}</div>
              <div className="text-sm text-slate-400">{person.total} операций · {person.ok} успешных · {person.bad} потерь</div>
            </div>
            <div className={person.balance >= 0 ? "text-emerald-400 font-black" : "text-red-400 font-black"}>{money(person.balance)}</div>
          </div>
          <Progress value={person.rate} color="green" />
          <div className="text-xs text-slate-500 mt-2">Успешность: {person.rate}% · Рейтинг: {person.rating}</div>
        </div>
      ))}
    </div>
  );
}

function StatsBars({ items }) {
  const max = Math.max(...items.map((item) => item.revenue), 1);
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.city} className="grid grid-cols-[120px_1fr_100px] gap-3 items-center text-sm">
          <span>{item.city}</span>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(item.revenue / max) * 100}%` }} />
          </div>
          <span className="text-right text-slate-300">{money(item.revenue)}</span>
        </div>
      ))}
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-3 shadow-2xl">
      {label && <div className="text-slate-300 text-sm mb-2">{label}</div>}
      {payload.map((item) => (
        <div key={item.dataKey || item.name} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
          <span className="text-slate-400">{item.name || item.dataKey}:</span>
          <span className="font-bold text-white">{typeof item.value === "number" ? money(item.value) : item.value}</span>
        </div>
      ))}
    </div>
  );
}

function RevenueAreaChart({ data }) {
  return (
    <div className="h-80 rounded-2xl bg-black/20 border border-white/10 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 18, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.45} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,.07)" vertical={false} />
          <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}к`} />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="revenue" name="Оборот" stroke="#3b82f6" strokeWidth={4} fill="url(#revenueGradient)" dot={{ r: 4, fill: "#60a5fa" }} activeDot={{ r: 7 }} />
          <Area type="monotone" dataKey="profit" name="Прибыль" stroke="#22c55e" strokeWidth={4} fill="url(#profitGradient)" dot={{ r: 4, fill: "#4ade80" }} activeDot={{ r: 7 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function CityBarChart({ items }) {
  return (
    <div className="h-80 rounded-2xl bg-black/20 border border-white/10 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={items} margin={{ top: 20, right: 18, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,.07)" vertical={false} />
          <XAxis dataKey="city" stroke="#94a3b8" tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}к`} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="revenue" name="Оборот" radius={[12, 12, 0, 0]} fill="#2563eb" />
          <Bar dataKey="profit" name="Прибыль" radius={[12, 12, 0, 0]} fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ProductProfitChart({ items }) {
  return (
    <div className="h-72 rounded-2xl bg-black/20 border border-white/10 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={items} layout="vertical" margin={{ top: 10, right: 18, left: 20, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,.07)" horizontal={false} />
          <XAxis type="number" stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}к`} />
          <YAxis dataKey="product" type="category" stroke="#94a3b8" tickLine={false} axisLine={false} width={80} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="profit" name="Прибыль" radius={[0, 12, 12, 0]} fill="#8b5cf6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ProfitLineChart({ data }) {
  return (
    <div className="h-80 rounded-2xl bg-black/20 border border-white/10 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 18, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="profitOnlyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,.07)" vertical={false} />
          <XAxis dataKey="day" stroke="#94a3b8" tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}к`} />
          <Tooltip content={<ChartTooltip />} />
          <Area type="monotone" dataKey="profit" name="Прибыль" stroke="#22c55e" strokeWidth={4} fill="url(#profitOnlyGradient)" dot={{ r: 4, fill: "#4ade80" }} activeDot={{ r: 7 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function CityHeatmap({ items }) {
  const max = Math.max(...items.map((item) => item.revenue), 1);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {items.map((item) => {
        const intensity = Math.max(8, Math.round((item.revenue / max) * 100));
        return (
          <div key={item.city} className="rounded-3xl border border-white/10 p-4 bg-white/5 hover:border-blue-400/30 transition relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/20" style={{ opacity: intensity / 180 }} />
            <div className="relative z-10">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="font-black">{item.city}</div>
                  <div className="text-xs text-slate-500 mt-1">{item.orders} операций</div>
                </div>
                <div className="text-xs rounded-full bg-black/30 border border-white/10 px-2 py-1 text-blue-200">{intensity}%</div>
              </div>
              <div className="text-2xl font-black mt-4">{money(item.revenue)}</div>
              <div className="text-sm text-emerald-300 mt-1">прибыль: {money(item.profit)}</div>
              <Progress value={intensity} color={intensity > 70 ? "green" : intensity > 35 ? "blue" : "yellow"} />
            </div>
          </div>
        );
      })}
      {!items.length && <div className="text-slate-400">Пока нет данных по городам</div>}
    </div>
  );
}

function TopEmployees({ items }) {
  const max = Math.max(...items.map((item) => Math.abs(item.payoutDue || item.balance || 0)), 1);
  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const value = Math.abs(item.payoutDue || item.balance || 0);
        return (
          <div key={item.employee} className="rounded-3xl bg-white/5 border border-white/10 p-4 hover:border-blue-400/30 transition">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-400/30 grid place-items-center font-black">#{index + 1}</div>
                <div>
                  <div className="font-black">{item.employee}</div>
                  <div className="text-xs text-slate-500">Успешность {item.rate}% · операций {item.total}</div>
                </div>
              </div>
              <div className={item.payoutDue >= 0 ? "text-emerald-300 font-black" : "text-red-300 font-black"}>{money(item.payoutDue || 0)}</div>
            </div>
            <Progress value={(value / max) * 100} color={item.payoutDue >= 0 ? "green" : "red"} />
          </div>
        );
      })}
      {!items.length && <div className="text-slate-400">Пока нет сотрудников с операциями</div>}
    </div>
  );
}

function WeekDynamics({ data }) {
  const totalRevenue = data.reduce((sum, item) => sum + Number(item.revenue || 0), 0);
  const totalProfit = data.reduce((sum, item) => sum + Number(item.profit || 0), 0);
  const bestDay = [...data].sort((a, b) => Number(b.profit || 0) - Number(a.profit || 0))[0];
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <InfoCell label="Оборот недели" value={money(totalRevenue)} />
        <InfoCell label="Прибыль недели" value={money(totalProfit)} />
        <InfoCell label="Лучший день" value={bestDay ? bestDay.day : "—"} />
        <InfoCell label="Прибыль дня" value={bestDay ? money(bestDay.profit) : money(0)} />
      </div>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.day} className="grid grid-cols-[60px_1fr_100px] gap-3 items-center text-sm">
            <div className="text-slate-400">{item.day}</div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, Math.max(4, Number(item.profit || 0) / Math.max(totalProfit, 1) * 100 * 3))}%` }} />
            </div>
            <div className="text-right font-bold">{money(item.profit || 0)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusDonut({ items }) {
  const colors = ["#22c55e", "#f59e0b", "#38bdf8", "#ef4444", "#a855f7", "#64748b"];
  const total = items.reduce((sum, item) => sum + item.value, 0);
  return (
    <div className="h-72 rounded-2xl bg-black/20 border border-white/10 p-3 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<ChartTooltip />} />
          <Pie data={items} dataKey="value" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={4} stroke="rgba(255,255,255,.08)">
            {items.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 grid place-items-center pointer-events-none">
        <div className="text-center">
          <div className="text-3xl font-black">{total}</div>
          <div className="text-xs text-slate-400">операций</div>
        </div>
      </div>
    </div>
  );
}

function StatsCards({ items, main }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item[main]} className="rounded-2xl bg-white/5 border border-white/10 p-4 grid grid-cols-4 gap-2 text-center">
          <div className="font-black text-left">{item[main]}</div>
          <div><div className="text-slate-500 text-xs">Заказы</div><div>{item.orders}</div></div>
          <div><div className="text-slate-500 text-xs">Оборот</div><div>{money(item.revenue)}</div></div>
          <div><div className="text-slate-500 text-xs">Прибыль</div><div className={item.profit >= 0 ? "text-emerald-400" : "text-red-400"}>{money(item.profit)}</div></div>
        </div>
      ))}
    </div>
  );
}

function ProductList({ items }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.product} className="rounded-2xl bg-white/5 border border-white/10 p-4 grid grid-cols-5 gap-2 text-center">
          <div className="font-black text-left">{item.product}</div>
          <div><div className="text-slate-500 text-xs">Заказы</div><div>{item.orders}</div></div>
          <div><div className="text-slate-500 text-xs">Вес</div><div>{item.grams} г</div></div>
          <div><div className="text-slate-500 text-xs">Оборот</div><div>{money(item.revenue)}</div></div>
          <div><div className="text-slate-500 text-xs">Прибыль</div><div className={item.profit >= 0 ? "text-emerald-400" : "text-red-400"}>{money(item.profit)}</div></div>
        </div>
      ))}
    </div>
  );
}

function MiniChart({ data }) {
  const max = Math.max(...data.map((day) => day.revenue), 1);
  return (
    <div className="h-72 flex items-end gap-4 p-4 bg-black/20 rounded-2xl border border-white/10">
      {data.map((day) => (
        <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full flex items-end justify-center gap-1 h-52">
            <div className="w-7 rounded-t-xl bg-blue-500 shadow-lg shadow-blue-500/20" style={{ height: `${Math.max(5, (day.revenue / max) * 100)}%` }} />
            <div className="w-7 rounded-t-xl bg-emerald-500 shadow-lg shadow-emerald-500/20" style={{ height: `${Math.max(5, (Math.max(day.profit, 0) / max) * 100)}%` }} />
          </div>
          <div className="text-xs text-slate-400">{day.day}</div>
        </div>
      ))}
    </div>
  );
}

function LineGlowChart({ data }) {
  const width = 760;
  const height = 260;
  const pad = 32;
  const max = Math.max(...data.map((item) => item.revenue), 1);
  const points = data.map((item, index) => {
    const x = pad + (index * (width - pad * 2)) / Math.max(data.length - 1, 1);
    const y = height - pad - (item.revenue / max) * (height - pad * 2);
    return { ...item, x, y };
  });
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${d} L ${width - pad} ${height - pad} L ${pad} ${height - pad} Z`;

  return (
    <div className="h-72 bg-black/20 rounded-2xl border border-white/10 p-4 overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        <defs>
          <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {[0, 1, 2, 3].map((line) => <line key={line} x1={pad} x2={width - pad} y1={pad + line * 55} y2={pad + line * 55} stroke="rgba(255,255,255,.08)" />)}
        <path d={area} fill="url(#lineFill)" />
        <path d={d} fill="none" stroke="#1d7cff" strokeWidth="5" filter="url(#glow)" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p) => <circle key={p.day} cx={p.x} cy={p.y} r="6" fill="#60a5fa" stroke="#fff" strokeOpacity=".7" />)}
        {points.map((p) => <text key={`${p.day}-text`} x={p.x} y={height - 8} textAnchor="middle" fill="#94a3b8" fontSize="14">{p.day}</text>)}
      </svg>
    </div>
  );
}

function OperationsTable({ rows, compact, setSelectedSale, deleteSale, updateSaleNote }) {
  return (
    <Panel title="Последние продажи">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-white/10">
              <th className="text-left py-3">Время</th>
              <th>Город</th>
              <th>Товар</th>
              <th>Граммовка</th>
              <th>Сотрудник</th>
              <th>Цена</th>
              <th>Себест.</th>
              <th>Выплата</th>
              <th>Комиссия</th>
              <th>Статус</th>
              <th>Заметка</th>
              <th>Компенсация</th>
              <th>Прибыль</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} onClick={() => setSelectedSale?.(row)} className="border-b border-white/5 hover:bg-white/5 transition cursor-pointer">
                <td className="py-3">{row.time || "—"}</td>
                <td className="text-center">{row.city}</td>
                <td className="text-center">{row.product}</td>
                <td className="text-center">{row.gram} г</td>
                <td className="text-center">{row.employee}</td>
                <td className="text-center">{money(row.price)}</td>
                <td className="text-center text-orange-300">{money(row.cost || 0)}</td>
                <td className="text-center text-blue-300">{money(row.courierPayout || 0)}</td>
                <td className="text-center text-red-300">{money(row.platformCommission || 0)}</td>
                <td className="text-center"><StatusBadge status={row.status} /></td>
                <td className="text-center">
                  <input
                    value={row.note || ""}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => updateSaleNote?.(row.id, event.target.value)}
                    placeholder="—"
                    className="w-44 rounded-xl bg-black/35 border border-white/10 px-3 py-2 text-slate-200 outline-none focus:border-blue-400"
                  />
                </td>
                <td className="text-center text-orange-300">{row.compensationType && row.compensationType !== "Нет" ? `${row.compensationType}: ${money(row.totalCompensation || 0)}` : "—"}</td>
                <td className={row.profit >= 0 ? "text-center text-emerald-400" : "text-center text-red-400"}>{money(row.profit)}</td>
                <td className="text-right">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      deleteSale?.(row.id);
                    }}
                    className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-1 hover:bg-red-500/20 transition"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {compact && <button className="mt-4 w-full rounded-2xl bg-white/5 border border-white/10 py-3 text-sm">Смотреть все продажи</button>}
    </Panel>
  );
}

function Progress({ value, color }) {
  const className = color === "red" ? "bg-red-500" : color === "green" ? "bg-emerald-500" : color === "yellow" ? "bg-yellow-500" : "bg-blue-500";
  return (
    <div className="h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
      <div className={`h-full ${className}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function Spark() {
  return (
    <div className="mt-4 flex items-end gap-1 opacity-80">
      {[20, 28, 18, 30, 24, 42, 35, 50, 39, 55].map((height, index) => (
        <span key={index} className="w-5 bg-blue-500/60 rounded-t transition-all duration-500 hover:bg-cyan-300" style={{ height: height / 2 }} />
      ))}
    </div>
  );
}

function Notice({ tone, title, text }) {
  const classes = {
    red: "text-red-300 border-red-500/20 bg-red-500/10",
    yellow: "text-yellow-300 border-yellow-500/20 bg-yellow-500/10",
    blue: "text-blue-300 border-blue-500/20 bg-blue-500/10",
    green: "text-emerald-300 border-emerald-500/20 bg-emerald-500/10",
  };

  return (
    <div className={`rounded-2xl border p-3 ${classes[tone]}`}>
      <div className="font-bold text-sm">{title}</div>
      <div className="text-xs text-slate-300 mt-1">{text}</div>
    </div>
  );
}

function Toast({ text }) {
  return (
    <div className="fixed top-5 right-5 z-50 rounded-2xl bg-black/70 backdrop-blur-2xl border border-white/10 px-5 py-4 shadow-2xl animate-pulse">
      {text}
    </div>
  );
}

function InfoBox({ title, items }) {
  return <DirectoryBox title={title} items={items} />;
}

function DirectoryStat({ title, value, icon }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-4 flex items-center justify-between">
      <div>
        <div className="text-slate-400 text-xs">{title}</div>
        <div className="text-3xl font-black mt-1">{value}</div>
      </div>
      <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-400/30 grid place-items-center text-2xl">{icon}</div>
    </div>
  );
}

function DirectoryBox({ title, items }) {
  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-bold">{title}</div>
        <div className="text-xs rounded-full bg-black/30 border border-white/10 px-2 py-1 text-slate-400">{items.length}</div>
      </div>
      <div className="max-h-64 overflow-y-auto soft-scroll pr-1 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-black/35 border border-white/10 px-3 py-2 text-xs text-slate-300 hover:border-blue-400/30 transition">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
