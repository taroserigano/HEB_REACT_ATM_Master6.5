import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Login from "../components/Login";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const renderLogin = (state = { darkMode: false }) => {
  const login = jest.fn();
  return render(
    <UserContext.Provider value={{ state, login }}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </UserContext.Provider>
  );
};

describe("Login Component", () => {
  test("renders without crashing", () => {
    renderLogin();
    expect(screen.getByText(/H-E-B ATM/i)).toBeInTheDocument();
  });

  test("displays correct initial UI", () => {
    renderLogin();
    expect(screen.getByText(/Enter your PIN/i)).toBeInTheDocument();
    expect(screen.getByText(/it's 7777/i)).toBeInTheDocument();
    expect(screen.getByText(/1/)).toBeInTheDocument();
    expect(screen.getByText(/2/)).toBeInTheDocument();
    expect(screen.getByText(/3/)).toBeInTheDocument();
  });

  test("handles PIN input correctly", () => {
    renderLogin();
    const button1 = screen.getByText("1");
    const input = screen.getByRole("textbox");

    fireEvent.click(button1);
    fireEvent.click(button1);
    fireEvent.click(button1);
    fireEvent.click(button1);
    fireEvent.click(button1); // Should not add a fifth digit

    expect(input).toHaveValue("1111");
  });

  test("clears PIN input", () => {
    renderLogin();
    const button1 = screen.getByText("1");
    const clearButton = screen.getByText("Clear");
    const input = screen.getByRole("textbox");

    fireEvent.click(button1);
    fireEvent.click(button1);
    fireEvent.click(clearButton);

    expect(input).toHaveValue("");
  });

  test("handles login with correct PIN", () => {
    renderLogin();
    const button7 = screen.getByText("7");
    const enterButton = screen.getByText("Enter");

    fireEvent.click(button7);
    fireEvent.click(button7);
    fireEvent.click(button7);
    fireEvent.click(button7);
    fireEvent.click(enterButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("alerts on invalid PIN", () => {
    window.alert = jest.fn();
    renderLogin();
    const button1 = screen.getByText("1");
    const enterButton = screen.getByText("Enter");

    fireEvent.click(button1);
    fireEvent.click(button1);
    fireEvent.click(button1);
    fireEvent.click(button1);
    fireEvent.click(enterButton);

    expect(window.alert).toHaveBeenCalledWith("Invalid PIN");
  });
});
