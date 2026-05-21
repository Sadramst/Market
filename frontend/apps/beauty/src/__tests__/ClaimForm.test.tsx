import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { ClaimForm } from "@/app/claim/[slug]/ClaimForm";

describe("ClaimForm component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders step 1 initially", () => {
    render(<ClaimForm slug="test-business" businessName="Test Business" />);

    expect(screen.getByText("Step 1: Your Details")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your full name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("04XX XXX XXX")).toBeInTheDocument();
  });

  it("continue button is disabled when fields are empty", () => {
    render(<ClaimForm slug="test-business" businessName="Test Business" />);

    const continueBtn = screen.getByRole("button", { name: /Continue/i });
    expect(continueBtn).toBeDisabled();
  });

  it("continue button enables when all step 1 fields filled", () => {
    render(<ClaimForm slug="test-business" businessName="Test Business" />);

    fireEvent.change(screen.getByPlaceholderText("Your full name"), { target: { value: "John Smith" } });
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "john@test.com" } });
    fireEvent.change(screen.getByPlaceholderText("04XX XXX XXX"), { target: { value: "0412 345 678" } });

    const continueBtn = screen.getByRole("button", { name: /Continue/i });
    expect(continueBtn).not.toBeDisabled();
  });

  it("navigates to step 2 on continue click", () => {
    render(<ClaimForm slug="test-business" businessName="Test Business" />);

    fireEvent.change(screen.getByPlaceholderText("Your full name"), { target: { value: "John Smith" } });
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "john@test.com" } });
    fireEvent.change(screen.getByPlaceholderText("04XX XXX XXX"), { target: { value: "0412 345 678" } });
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

    expect(screen.getByText("Step 2: Verify Ownership")).toBeInTheDocument();
    expect(screen.getByText("Your Role *")).toBeInTheDocument();
  });

  it("back button returns to step 1", () => {
    render(<ClaimForm slug="test-business" businessName="Test Business" />);

    // Fill step 1
    fireEvent.change(screen.getByPlaceholderText("Your full name"), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "j@t.com" } });
    fireEvent.change(screen.getByPlaceholderText("04XX XXX XXX"), { target: { value: "0400000000" } });
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

    // Click back
    fireEvent.click(screen.getByRole("button", { name: /Back/i }));
    expect(screen.getByText("Step 1: Your Details")).toBeInTheDocument();
  });

  it("submit button disabled without role selected", () => {
    render(<ClaimForm slug="test-business" businessName="Test Business" />);

    fireEvent.change(screen.getByPlaceholderText("Your full name"), { target: { value: "John" } });
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "j@t.com" } });
    fireEvent.change(screen.getByPlaceholderText("04XX XXX XXX"), { target: { value: "0400000000" } });
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

    const submitBtn = screen.getByRole("button", { name: /Submit Claim/i });
    expect(submitBtn).toBeDisabled();
  });

  it("submits claim successfully", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: async () => ({ success: true, message: "submitted" }),
    });
    global.fetch = mockFetch;

    render(<ClaimForm slug="test-business" businessName="Test Business" />);

    // Step 1
    fireEvent.change(screen.getByPlaceholderText("Your full name"), { target: { value: "Jane Owner" } });
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "jane@biz.com" } });
    fireEvent.change(screen.getByPlaceholderText("04XX XXX XXX"), { target: { value: "0412 000 111" } });
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

    // Step 2
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "owner" } });
    fireEvent.click(screen.getByRole("button", { name: /Submit Claim/i }));

    await waitFor(() => {
      expect(screen.getByText("Claim Request Submitted")).toBeInTheDocument();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining("/providers/test-business/claim"),
      expect.objectContaining({ method: "POST" })
    );
  });

  it("shows error message on API failure", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      json: async () => ({ success: false, message: "Already claimed" }),
    });
    global.fetch = mockFetch;

    render(<ClaimForm slug="test-business" businessName="Test Business" />);

    fireEvent.change(screen.getByPlaceholderText("Your full name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
    fireEvent.change(screen.getByPlaceholderText("04XX XXX XXX"), { target: { value: "0400000000" } });
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "manager" } });
    fireEvent.click(screen.getByRole("button", { name: /Submit Claim/i }));

    await waitFor(() => {
      expect(screen.getByText("Already claimed")).toBeInTheDocument();
    });
  });

  it("shows network error on fetch exception", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network fail"));

    render(<ClaimForm slug="test-business" businessName="Test Business" />);

    fireEvent.change(screen.getByPlaceholderText("Your full name"), { target: { value: "Test" } });
    fireEvent.change(screen.getByPlaceholderText("you@example.com"), { target: { value: "t@t.com" } });
    fireEvent.change(screen.getByPlaceholderText("04XX XXX XXX"), { target: { value: "0400000000" } });
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "owner" } });
    fireEvent.click(screen.getByRole("button", { name: /Submit Claim/i }));

    await waitFor(() => {
      expect(screen.getByText("Network error. Please try again.")).toBeInTheDocument();
    });
  });
});
