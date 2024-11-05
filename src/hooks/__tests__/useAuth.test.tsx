import { renderHook, act } from "@testing-library/react";
import { useAuth } from "../useAuth";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("useAuth", () => {
  const mockRouter = {
    push: jest.fn().mockImplementation(() => Promise.resolve()),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockImplementation(() => mockRouter);
    localStorage.clear();
  });

  let consoleErrorSpy: jest.SpyInstance;
  
  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  it("should handle unauthenticated state", async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });

  it("should handle authenticated state", async () => {
    localStorage.setItem("isAuthenticated", "true");

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
  });

  it("should run checkAuth on mount only", async () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem");

    const { rerender } = renderHook(() => useAuth());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    getItemSpy.mockClear();

    rerender();

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(getItemSpy).not.toHaveBeenCalled();
    
    getItemSpy.mockRestore();
  });

  it("should handle router push failure", async () => {
    const routerError = new Error("Router error");
    mockRouter.push.mockRejectedValueOnce(routerError);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.loading).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Auth error:", routerError);
  });
});