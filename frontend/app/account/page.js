"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

//TODO: make name available on page when logged in
//TODO: just make this page more alive and atractive

function Account() {
  const [input, setInput] = useState("");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchBalance = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("You are not logged in");
      setIsLoggedIn(false);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3002/me/accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch balance: ${response.statusText}`);
      }

      const data = await response.json();
      setBalance(data.saldo); // Se till att du använder rätt nyckel som matchar backend-svaret
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleTransfer = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("User is not logged in or token is missing");
      return;
    }
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3002/me/accounts/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            amount: parseInt(input, 10),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to transfer money: ${response.statusText}`);
      }

      await fetchBalance();
    } catch (error) {
      console.error("Error transferring money:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="px-8 pt-8 flex justify-center flex-col">
      {!isLoggedIn ? (
        <div className="">
          <p className="flex justify-center text-2xl text-center">
            Du behöver logga in för att få åtkomst till kontouppgifter.
          </p>
          <div className="flex justify-center">
            <Link href={"/login"}>
              <p className="m-0 p-2">Sign in</p>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div>
            <p className="text-xl">Current balance: {balance}</p>
          </div>
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-28"
          ></input>
          <button className="w-28 cursor-pointer" onClick={handleTransfer}>
            Transfer money
          </button>
          {loading && <p>Loading...</p>}
        </>
      )}
    </main>
  );
}

export default Account;
