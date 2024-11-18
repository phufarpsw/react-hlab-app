import React from "react";
import { render, screen } from "@testing-library/react";
import UserProfile from "../src/UserProfile";
import fetchMock from "jest-fetch-mock";
import "@testing-library/jest-dom";

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

test("displays loading state initially", () => {
  render(<UserProfile userId="1" />);
  expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
});

test("displays error message if fetching user fails", async () => {
  fetch.mockRejectOnce(new Error("Failed to fetch user data"));

  render(<UserProfile userId="1" />);
  const errorMessage = await screen.findByText(
    /Error: Failed to fetch user data/i
  );
  expect(errorMessage).toBeInTheDocument();
});

test("displays user data when fetch is successful", async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ name: "John Doe", email: "john@example.com" }),
  });

  render(<UserProfile userId="1" />);
  const name = await screen.findByText("John Doe");
  const email = await screen.findByText("Email: john@example.com");

  expect(name).toBeInTheDocument();
  expect(email).toBeInTheDocument();
});
