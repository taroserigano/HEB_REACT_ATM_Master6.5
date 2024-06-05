import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter as Router } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import Header from "../components/Header"; // Adjust the import path as needed

const renderWithContext = (contextValue) => {
  return render(
    <UserContext.Provider value={contextValue}>
      <Router>
        <Header />
      </Router>
    </UserContext.Provider>
  );
};

describe("Header component", () => {
  test("renders the logo", () => {
    renderWithContext({
      state: { user: null, darkMode: false },
      toggleDarkMode: jest.fn(),
    });
    const logo = screen.getByAltText("H-E-B Logo");
    expect(logo).toBeInTheDocument();
  });

  test("renders the dark mode toggle button", () => {
    renderWithContext({
      state: { user: { name: "Customer" }, darkMode: false },
      toggleDarkMode: jest.fn(),
    });
    const toggleButton = screen.getByRole("button");
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveTextContent("🌙");
  });

  test("renders the welcome message when user is present", () => {
    renderWithContext({
      state: { user: { name: "Customer" }, darkMode: false },
      toggleDarkMode: jest.fn(),
    });
    const welcomeMessage = screen.getByText("Welcome, Customer!");
    expect(welcomeMessage).toBeInTheDocument();
  });

  test("toggles dark mode on button click", () => {
    const toggleDarkMode = jest.fn();
    renderWithContext({
      state: { user: { name: "Customer" }, darkMode: false },
      toggleDarkMode,
    });
    const toggleButton = screen.getByRole("button");
    fireEvent.click(toggleButton);
    expect(toggleDarkMode).toHaveBeenCalledTimes(1);
  });

  test("button text changes based on dark mode state", () => {
    const { rerender } = renderWithContext({
      state: { user: { name: "Customer" }, darkMode: false },
      toggleDarkMode: jest.fn(),
    });
    let toggleButton = screen.getByRole("button");
    expect(toggleButton).toHaveTextContent("🌙");

    rerender(
      <UserContext.Provider
        value={{
          state: { user: { name: "Customer" }, darkMode: true },
          toggleDarkMode: jest.fn(),
        }}
      >
        <Router>
          <Header />
        </Router>
      </UserContext.Provider>
    );

    toggleButton = screen.getByRole("button");
    expect(toggleButton).toHaveTextContent("🌞");
  });
});
