import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "../page";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(() => ({
    loading: false,
    isAuthenticated: false,
  })),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage({
    src,
    alt,
    className,
    priority,
    width,
    height,
  }: any) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
      />
    );
  },
}));

describe("LoginPage", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockImplementation(() => mockRouter);
    (useAuth as jest.Mock).mockImplementation(() => ({
      loading: false,
      isAuthenticated: false,
    }));
  });

  it("should render login form", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/username:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("should show validation errors when form is submitted empty", async () => {
    render(<LoginPage />);

    const submitButton = screen.getByRole("button", { name: /login/i });
    await userEvent.click(submitButton);

    expect(screen.getByText(/username is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it("should show error message for invalid credentials", async () => {
    render(<LoginPage />);

    const usernameInput = screen.getByLabelText(/username:/i);
    const passwordInput = screen.getByLabelText(/password:/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(usernameInput, "wronguser");
    await userEvent.type(passwordInput, "wrongpass");
    await userEvent.click(submitButton);

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it("should login successfully with correct credentials", async () => {
    render(<LoginPage />);

    const usernameInput = screen.getByLabelText(/username:/i);
    const passwordInput = screen.getByLabelText(/password:/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    await userEvent.type(usernameInput, "admin");
    await userEvent.type(passwordInput, "password");
    await userEvent.click(submitButton);

    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
    expect(localStorage.getItem("isAuthenticated")).toBe("true");
  });

  it("should clear validation errors when typing", async () => {
    render(<LoginPage />);

    const usernameInput = screen.getByLabelText(/username:/i);
    const passwordInput = screen.getByLabelText(/password:/i);
    const submitButton = screen.getByRole("button", { name: /login/i });

    await userEvent.click(submitButton);
    expect(screen.getByText(/username is required/i)).toBeInTheDocument();

    await userEvent.type(usernameInput, "a");
    expect(screen.queryByText(/username is required/i)).not.toBeInTheDocument();
  });

  it("should redirect to dashboard if already authenticated", () => {
    (useAuth as jest.Mock).mockImplementation(() => ({
      loading: false,
      isAuthenticated: true,
    }));

    render(<LoginPage />);
    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
  });

  it("should show loading state during authentication", () => {
    (useAuth as jest.Mock).mockImplementation(() => ({
      loading: true,
      isAuthenticated: false,
    }));

    render(<LoginPage />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });
});
