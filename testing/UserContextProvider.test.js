import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { UserContext, UserContextProvider } from "../context/UserContext"; // Adjust the import path as needed

describe("UserContextProvider", () => {
  afterEach(() => {
    localStorage.clear();
  });

  test("initial state is set correctly", () => {
    render(
      <UserContextProvider>
        <UserContext.Consumer>
          {({ state }) => (
            <div>
              <span>User: {state.user ? state.user.name : "null"}</span>
              <span>Balance: {state.balance}</span>
              <span>Daily Limit: {state.dailyLimit}</span>
              <span>Total Withdrawn: {state.totalWithdrawn}</span>
              <span>Dark Mode: {state.darkMode ? "On" : "Off"}</span>
            </div>
          )}
        </UserContext.Consumer>
      </UserContextProvider>
    );

    expect(screen.getByText(/User: null/i)).toBeInTheDocument();
    expect(screen.getByText(/Balance: 2000/i)).toBeInTheDocument();
    expect(screen.getByText(/Daily Limit: 500/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Withdrawn: 0/i)).toBeInTheDocument();
    expect(screen.getByText(/Dark Mode: Off/i)).toBeInTheDocument();
  });

  test("login action works and updates localStorage", () => {
    render(
      <UserContextProvider>
        <UserContext.Consumer>
          {({ state, login }) => (
            <div>
              <span>User: {state.user ? state.user.name : "null"}</span>
              <button onClick={() => login({ name: "John Doe" })}>Login</button>
            </div>
          )}
        </UserContext.Consumer>
      </UserContextProvider>
    );

    act(() => {
      screen.getByText(/Login/i).click();
    });

    expect(screen.getByText(/User: John Doe/i)).toBeInTheDocument();
    expect(localStorage.getItem("user")).toBe(
      JSON.stringify({ name: "John Doe" })
    );
  });

  test("logout action works and updates localStorage", () => {
    render(
      <UserContextProvider>
        <UserContext.Consumer>
          {({ state, login, logout }) => (
            <div>
              <span>User: {state.user ? state.user.name : "null"}</span>
              <button onClick={() => login({ name: "John Doe" })}>Login</button>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </UserContext.Consumer>
      </UserContextProvider>
    );

    act(() => {
      screen.getByText(/Login/i).click();
    });

    expect(screen.getByText(/User: John Doe/i)).toBeInTheDocument();

    act(() => {
      screen.getByText(/Logout/i).click();
    });

    expect(screen.getByText(/User: null/i)).toBeInTheDocument();
    expect(localStorage.getItem("user")).toBeNull();
  });

  test("deposit action works", () => {
    render(
      <UserContextProvider>
        <UserContext.Consumer>
          {({ state, deposit }) => (
            <div>
              <span>Balance: {state.balance}</span>
              <button onClick={() => deposit(1000)}>Deposit</button>
            </div>
          )}
        </UserContext.Consumer>
      </UserContextProvider>
    );

    act(() => {
      screen.getByText(/Deposit/i).click();
    });

    expect(screen.getByText(/Balance: 3000/i)).toBeInTheDocument();
  });

  test("withdraw action works", () => {
    render(
      <UserContextProvider>
        <UserContext.Consumer>
          {({ state, withdraw }) => (
            <div>
              <span>Balance: {state.balance}</span>
              <span>Total Withdrawn: {state.totalWithdrawn}</span>
              <button onClick={() => withdraw(500)}>Withdraw</button>
            </div>
          )}
        </UserContext.Consumer>
      </UserContextProvider>
    );

    act(() => {
      screen.getByText(/Withdraw/i).click();
    });

    expect(screen.getByText(/Balance: 1500/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Withdrawn: 500/i)).toBeInTheDocument();
  });

  test("setDailyLimit action works", () => {
    render(
      <UserContextProvider>
        <UserContext.Consumer>
          {({ state, setDailyLimit }) => (
            <div>
              <span>Daily Limit: {state.dailyLimit}</span>
              <button onClick={() => setDailyLimit(1000)}>
                Set Daily Limit
              </button>
            </div>
          )}
        </UserContext.Consumer>
      </UserContextProvider>
    );

    act(() => {
      screen.getByText(/Set Daily Limit/i).click();
    });

    expect(screen.getByText(/Daily Limit: 1000/i)).toBeInTheDocument();
  });

  test("resetDailyLimit action works", () => {
    render(
      <UserContextProvider>
        <UserContext.Consumer>
          {({ state, resetDailyLimit }) => (
            <div>
              <span>Daily Limit: {state.dailyLimit}</span>
              <button onClick={resetDailyLimit}>Reset Daily Limit</button>
            </div>
          )}
        </UserContext.Consumer>
      </UserContextProvider>
    );

    act(() => {
      screen.getByText(/Reset Daily Limit/i).click();
    });

    expect(screen.getByText(/Daily Limit: 500/i)).toBeInTheDocument();
  });

  test("toggleDarkMode action works and updates localStorage", () => {
    render(
      <UserContextProvider>
        <UserContext.Consumer>
          {({ state, toggleDarkMode }) => (
            <div>
              <span>Dark Mode: {state.darkMode ? "On" : "Off"}</span>
              <button onClick={toggleDarkMode}>Toggle Dark Mode</button>
            </div>
          )}
        </UserContext.Consumer>
      </UserContextProvider>
    );

    act(() => {
      screen.getByText(/Toggle Dark Mode/i).click();
    });

    expect(screen.getByText(/Dark Mode: On/i)).toBeInTheDocument();
    expect(localStorage.getItem("darkMode")).toBe("true");
  });
});
