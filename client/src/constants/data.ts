import { Icons } from "@/components/icons";
import { NavItem, SidebarNavItem } from "@/types";

export type Transaction = {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  amount: number;
  transactionType: TransactionType;
  envelopeTitle: string;
  categoryTitle: string;
  userId: string;
  color?: string | null;
  image?: string | null;
};

export type TransactionType = "WITHDRAW" | "DEPOSIT" | "PURCHASE";

export type Envelope = {
  id: string;
  title: string;
  initialAmount: number;
  currentBalance: number;
  userId: string;
  color?: string | null;
  image?: string | null;
};

export const transactions: Transaction[] = [
  {
    id: "1",
    title: "Grocery Shopping",
    description: "Weekly grocery expenses",
    date: "2024-01-27T12:30:00Z",
    amount: 50,
    transactionType: "PURCHASE",
    envelopeTitle: "Groceries",
    categoryTitle: "Food",
    userId: "user123",
    color: "#34ebc7",
    image: "https://example.com/grocery-receipt.jpg",
  },
  {
    id: "2",
    title: "Gas Station",
    description: "Fuel refill for the car",
    date: "2024-02-05T15:45:00Z",
    amount: 30,
    transactionType: "PURCHASE",
    envelopeTitle: "Transportation",
    categoryTitle: "Auto",
    userId: "user123",
    color: "#ff9900",
    image: "https://example.com/gas-receipt.jpg",
  },
  {
    id: "3",
    title: "Electronics Store",
    description: "Purchase of a new gadget",
    date: "2024-02-15T10:00:00Z",
    amount: 200,
    transactionType: "PURCHASE",
    envelopeTitle: "Shopping",
    categoryTitle: "Electronics",
    userId: "user456",
    color: "#3366cc",
    image: "https://example.com/electronics-receipt.jpg",
  },
  {
    id: "4",
    title: "Restaurant Dinner",
    description: "Dining out with friends",
    date: "2024-03-02T19:00:00Z",
    amount: 80,
    transactionType: "PURCHASE",
    envelopeTitle: "Dining Out",
    categoryTitle: "Entertainment",
    userId: "user456",
    color: "#ff3366",
    image: "https://example.com/restaurant-receipt.jpg",
  },
  {
    id: "5",
    title: "Rent Payment",
    date: "2024-03-15T14:00:00Z",
    amount: 1200,
    transactionType: "WITHDRAW",
    envelopeTitle: "Housing",
    categoryTitle: "Rent",
    userId: "user789",
    color: "#993366",
  },
  {
    id: "6",
    title: "Online Shopping",
    description: "Order from an online store",
    date: "2024-04-01T11:30:00Z",
    amount: 60,
    transactionType: "PURCHASE",
    envelopeTitle: "Shopping",
    categoryTitle: "Online",
    userId: "user789",
    color: "#663300",
    image: "https://example.com/online-shopping-receipt.jpg",
  },
];

export const envelopes: Envelope[] = [
  {
    id: "1",
    title: "Groceries",
    initialAmount: 200,
    currentBalance: 150,
    userId: "user123",
    color: "#34ebc7",
    image: "https://example.com/groceries-icon.png",
  },
  {
    id: "2",
    title: "Transportation",
    initialAmount: 100,
    currentBalance: 80,
    userId: "user123",
    color: "#ff9900",
    image: "https://example.com/transportation-icon.png",
  },
  {
    id: "3",
    title: "Shopping",
    initialAmount: 300,
    currentBalance: 250,
    userId: "user456",
    color: "#3366cc",
    image: "https://example.com/shopping-icon.png",
  },
  {
    id: "4",
    title: "Dining Out",
    initialAmount: 150,
    currentBalance: 70,
    userId: "user456",
    color: "#ff3366",
    image: "https://example.com/dining-out-icon.png",
  },
  {
    id: "5",
    title: "Housing",
    initialAmount: 1200,
    currentBalance: 1100,
    userId: "user789",
    color: "#993366",
    image: "https://example.com/housing-icon.png",
  },
  {
    id: "6",
    title: "Entertainment",
    initialAmount: 50,
    currentBalance: 40,
    userId: "user789",
    color: "#663300",
    image: "https://example.com/entertainment-icon.png",
  },
];

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Envelopes",
    href: "/dashboard/envelopes",
    icon: "wallet",
    label: "envelope",
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: "dollarBadge",
    label: "transaction",
  },

  {
    title: "Login",
    href: "/",
    icon: "login",
    label: "login",
  },
];
