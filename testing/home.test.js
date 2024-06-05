import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Home from "../components/Home";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockLogout = jest.fn();
const mockDeposit = jest.fn();
const mockWithdraw = jest.fn();
const mockSetDailyLimit = jest.fn();
const mockResetDailyLimit = jest.fn();

const renderHome = (userContextValue) => {
  return render(
    <UserContext.Provider value={userContextValue}>
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    </UserContext.Provider>
  );
};

describe("Home Component", () => {
  let userContextValue;

  beforeEach(() => {
    userContextValue = {
      state: {
        user: { name: "Test User" },
        balance: 1000,
        dailyLimit: 500,
        darkMode: false,
      },
      deposit: mockDeposit,
      withdraw: mockWithdraw,
      setDailyLimit: mockSetDailyLimit,
      resetDailyLimit: mockResetDailyLimit,
      logout: mockLogout,
    };
  });

  test("redirects to login if user is not authenticated", () => {
    userContextValue.state.user = null;
    renderHome(userContextValue);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test('displays current balance when "Show Balance" button is clicked', () => {
    renderHome(userContextValue);
    const showBalanceButton = screen.getByText(/show balance/i);
    fireEvent.click(showBalanceButton);
    expect(screen.getByText(/current balance: \$1000/i)).toBeInTheDocument();
  });

  test("handles deposit correctly", async () => {
    renderHome(userContextValue);
    const amountInput = screen.getByRole("textbox");
    fireEvent.change(amountInput, { target: { value: "200" } });
    const depositButton = screen.getByText(/deposit/i);
    fireEvent.click(depositButton);

    await waitFor(() => {
      expect(mockDeposit).toHaveBeenCalledWith(200);
    });
  });

  test("handles withdraw correctly", async () => {
    renderHome(userContextValue);
    const amountInput = screen.getByRole("textbox");
    fireEvent.change(amountInput, { target: { value: "100" } });
    const withdrawButton = screen.getByText(/withdraw/i);
    fireEvent.click(withdrawButton);

    await waitFor(() => {
      expect(mockWithdraw).toHaveBeenCalledWith(100);
    });
  });

  test("handles logout correctly", () => {
    renderHome(userContextValue);
    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("handles setting daily limit correctly", async () => {
    renderHome(userContextValue);
    const limitInput = screen.getByPlaceholderText(/set new daily limit/i);
    fireEvent.change(limitInput, { target: { value: "600" } });
    const setLimitButton = screen.getByText(/change daily limit/i);
    fireEvent.click(setLimitButton);

    await waitFor(() => {
      expect(mockSetDailyLimit).toHaveBeenCalledWith(600);
    });
  });

  test("handles resetting daily limit correctly", () => {
    renderHome(userContextValue);
    const resetLimitButton = screen.getByText(/reset daily limit/i);
    fireEvent.click(resetLimitButton);
    expect(mockResetDailyLimit).toHaveBeenCalled();
  });
});
