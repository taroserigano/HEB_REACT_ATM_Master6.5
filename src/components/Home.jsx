import React, {
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { state, deposit, withdraw, setDailyLimit, resetDailyLimit, logout } =
    useContext(UserContext);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [newDailyLimit, setNewDailyLimit] = useState("");
  const [showBalance, setShowBalance] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    // redirect to login if not authenticated
    if (!state.user) {
      navigate("/login");
    }
  }, [state.user, navigate]);

  const handleLogout = async () => {
    try {
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred during logout. Please try again.");
    }
  };

  const handleButtonClick = (value) => {
    setAmount((prevAmount) =>
      // make sure it's no more than 8 digits 
      prevAmount.length < 8 ? prevAmount + value : prevAmount
    );
    ref.current.focus();
  };

  const handleAmountChange = (event) => {
    const { value } = event.target;
      // make sure it's no more than 8 digits 
    if (!isNaN(value) && value.length <= 8) {
      setAmount(value);
    }
  };

  const handleDeposit = useCallback(async () => {
    try {
      const depositAmount = parseFloat(amount);
      if (isNaN(depositAmount) || depositAmount <= 0) {
        setError("Please enter a valid amount.");
        return;
      }
      setLoading(true);
      deposit(depositAmount);
      setAmount("");
      setError("");
      setLoading(false);
      ref.current.focus();
    } catch (error) {
      console.error("Error during deposit:", error);
      alert("An error occurred during deposit. Please try again.");
      setLoading(false);
    }
  }, [amount, deposit]);

  const handleWithdraw = useCallback(async () => {
    try {
      const withdrawAmount = parseFloat(amount);
      if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        setError("Please enter a valid amount.");
        return;
      }
      setLoading(true);
      withdraw(withdrawAmount);
      setAmount("");
      setError("");
      setLoading(false);
      ref.current.focus();
    } catch (error) {
      console.error("Error during withdrawal:", error);
      alert("An error occurred during withdrawal. Please try again.");
      setLoading(false);
    }
  }, [amount, withdraw]);

  const handleClear = () => {
    setAmount("");
    ref.current.focus();
  };

  const handleSetDailyLimit = useCallback(async () => {
    try {
      const limit = parseFloat(newDailyLimit);
      if (isNaN(limit) || limit <= 0) {
        setError("Please enter a valid limit.");
        return;
      }
      setDailyLimit(limit);
      setNewDailyLimit("");
      setError("");
    } catch (error) {
      console.error("Error setting daily limit:", error);
      alert(
        "An error occurred while setting the daily limit. Please try again."
      );
    }
  }, [newDailyLimit, setDailyLimit]);

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${
        state.darkMode ? "bg-gray-900" : "bg-gray-200"
      }`}
    >
      <div className="bg-gray-800 shadow-md rounded-lg p-8 text-red-600 w-full max-w-md">
        <h1 className="text-3xl font-black mb-6 text-center">H-E-B ATM</h1>
        {loading ? (
          <p className="text-lg font-semibold text-center text-gray-900 dark:text-gray-100">
            Processing...
          </p>
        ) : (
          <>
            <div className="flex items-center justify-center mb-4 gap-4">
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {showBalance ? "Hide Balance" : "Show Balance"}
              </button>
              <p className="text-lg font-semibold text-center text-white dark:text-gray-100 mr-4">
                {showBalance ? `Current Balance: $${state.balance}` : ""}
              </p>
            </div>
            <div className="mb-4 text-center">
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                ref={ref}
                className="w-full py-2 px-3 text-gray-700 dark:text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center bg-gray-200 dark:bg-gray-700"
              />
            </div>
            {error && (
              <p className="text-red-500 font-semibold text-center">{error}</p>
            )}

            <div className="grid grid-cols-3 gap-4 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "Clear", 0, "Enter"].map(
                (value, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (value === "Clear") {
                        handleClear();
                      } else if (value === "Enter") {
                        handleDeposit();
                      } else {
                        handleButtonClick(value);
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    {value}
                  </button>
                )
              )}
            </div>

            <div className="flex justify-between gap-2 mb-4">
              <button
                onClick={handleDeposit}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2"
              >
                Deposit
              </button>
              <button
                onClick={handleWithdraw}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2"
              >
                Withdraw
              </button>
            </div>

            <p className="text-lg font-semibold text-center text-white dark:text-gray-100">
              Daily Limit: ${state.dailyLimit}
            </p>
            <div className="flex flex-col gap-2 mt-4">
              <input
                type="number"
                placeholder="Set new daily limit"
                value={newDailyLimit}
                onChange={(e) => setNewDailyLimit(e.target.value)}
                className="w-full py-2 px-3 text-gray-900 dark:text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-center bg-gray-200 dark:bg-gray-700"
              />
              <button
                onClick={handleSetDailyLimit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Change Daily Limit
              </button>
              <button
                onClick={resetDailyLimit}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Reset Daily Limit
              </button>
            </div>

            <div className="mt-8">
              <button
                onClick={handleLogout}
                className="bg-purple-500 hover:bg-purple-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
