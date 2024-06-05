import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import {
  TransactionsContext,
  TransactionsContextProvider,
} from "../context/TransactionsContext"; // Adjust the import path as needed

describe("TransactionsContextProvider", () => {
  afterEach(() => {
    localStorage.clear();
  });

  test("initial state is set correctly", () => {
    render(
      <TransactionsContextProvider>
        <TransactionsContext.Consumer>
          {({ state }) => (
            <div>
              <span>Balance: {state.balance}</span>
              <span>Daily Limit: {state.dailyLimit}</span>
            </div>
          )}
        </TransactionsContext.Consumer>
      </TransactionsContextProvider>
    );

    expect(screen.getByText(/Balance: 2000/i)).toBeInTheDocument();
    expect(screen.getByText(/Daily Limit: 500/i)).toBeInTheDocument();
  });

  test("setBalance action works and updates localStorage", () => {
    render(
      <TransactionsContextProvider>
        <TransactionsContext.Consumer>
          {({ state, setBalance }) => (
            <div>
              <span>Balance: {state.balance}</span>
              <button onClick={() => setBalance(3000)}>Set Balance</button>
            </div>
          )}
        </TransactionsContext.Consumer>
      </TransactionsContextProvider>
    );

    act(() => {
      screen.getByText(/Set Balance/i).click();
    });

    expect(screen.getByText(/Balance: 3000/i)).toBeInTheDocument();
    expect(localStorage.getItem("balance")).toBe("3000");
  });

  test("deposit action works and updates localStorage", () => {
    render(
      <TransactionsContextProvider>
        <TransactionsContext.Consumer>
          {({ state, deposit }) => (
            <div>
              <span>Balance: {state.balance}</span>
              <button onClick={() => deposit(1000)}>Deposit</button>
            </div>
          )}
        </TransactionsContext.Consumer>
      </TransactionsContextProvider>
    );

    act(() => {
      screen.getByText(/Deposit/i).click();
    });

    expect(screen.getByText(/Balance: 3000/i)).toBeInTheDocument();
    expect(localStorage.getItem("balance")).toBe("3000");
  });

  test("withdraw action works and updates localStorage", () => {
    render(
      <TransactionsContextProvider>
        <TransactionsContext.Consumer>
          {({ state, withdraw }) => (
            <div>
              <span>Balance: {state.balance}</span>
              <button onClick={() => withdraw(500)}>Withdraw</button>
            </div>
          )}
        </TransactionsContext.Consumer>
      </TransactionsContextProvider>
    );

    act(() => {
      screen.getByText(/Withdraw/i).click();
    });

    expect(screen.getByText(/Balance: 1500/i)).toBeInTheDocument();
    expect(localStorage.getItem("balance")).toBe("1500");
  });

  test("setDailyLimit action works and updates localStorage", () => {
    render(
      <TransactionsContextProvider>
        <TransactionsContext.Consumer>
          {({ state, setDailyLimit }) => (
            <div>
              <span>Daily Limit: {state.dailyLimit}</span>
              <button onClick={() => setDailyLimit(1000)}>
                Set Daily Limit
              </button>
            </div>
          )}
        </TransactionsContext.Consumer>
      </TransactionsContextProvider>
    );

    act(() => {
      screen.getByText(/Set Daily Limit/i).click();
    });

    expect(screen.getByText(/Daily Limit: 1000/i)).toBeInTheDocument();
    expect(localStorage.getItem("dailyLimit")).toBe("1000");
  });

  test("resetDailyLimit action works", () => {
    render(
      <TransactionsContextProvider>
        <TransactionsContext.Consumer>
          {({ state, resetDailyLimit }) => (
            <div>
              <span>Daily Limit: {state.dailyLimit}</span>
              <button onClick={resetDailyLimit}>Reset Daily Limit</button>
            </div>
          )}
        </TransactionsContext.Consumer>
      </TransactionsContextProvider>
    );

    act(() => {
      screen.getByText(/Reset Daily Limit/i).click();
    });

    expect(screen.getByText(/Daily Limit: 500/i)).toBeInTheDocument();
  });
});
