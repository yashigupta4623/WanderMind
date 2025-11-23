import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Hero from "./Hero";
import { BrowserRouter } from "react-router-dom";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock lottie-react to avoid canvas errors
vi.mock("lottie-react", () => ({
    default: () => <div data-testid="lottie-mock">Lottie Animation</div>,
}));

describe("Hero Component", () => {
    it("renders the main heading", () => {
        render(
            <BrowserRouter>
                <Hero />
            </BrowserRouter>
        );
        // Use getByRole for robust heading detection
        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading).toBeInTheDocument();

        // Check for key phrases within the heading
        expect(heading).toHaveTextContent(/Uncover the/i);
        expect(heading).toHaveTextContent(/AI/i);
        expect(heading).toHaveTextContent(/Travel/i);
        expect(heading).toHaveTextContent(/Plan/i);
    });

    it("navigates to create-trip when 'Start Planning Now' is clicked", () => {
        render(
            <BrowserRouter>
                <Hero />
            </BrowserRouter>
        );
        const startButton = screen.getByText(/Start Planning Now/i);
        fireEvent.click(startButton);
        expect(mockNavigate).toHaveBeenCalledWith("/create-trip");
    });
});
