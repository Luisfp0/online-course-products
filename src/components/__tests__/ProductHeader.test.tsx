import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductHeader } from "../ProductHeader";

describe("ProductHeader", () => {
  const mockProps = {
    onSearch: jest.fn(),
    onSort: jest.fn(),
    searchTerm: "",
    onNewProduct: jest.fn(),
    handleLogout: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render search input", () => {
    render(<ProductHeader {...mockProps} />);

    expect(
      screen.getByPlaceholderText("Search by title or brand...")
    ).toBeInTheDocument();
  });

  it("should call onSearch with input value on every change", async () => {
    render(<ProductHeader {...mockProps} />);

    const searchInput = screen.getByPlaceholderText(
      "Search by title or brand..."
    );
    await userEvent.type(searchInput, "test");

    expect(mockProps.onSearch).toHaveBeenCalledTimes(4);
    expect(mockProps.onSearch.mock.calls).toEqual([["t"], ["e"], ["s"], ["t"]]);
  });

  it("should call onSort when changing sort option", async () => {
    render(<ProductHeader {...mockProps} />);

    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "title");

    expect(mockProps.onSort).toHaveBeenCalledWith("title");
  });

  it("should call onNewProduct when clicking new product button", async () => {
    render(<ProductHeader {...mockProps} />);

    await userEvent.click(screen.getByText("New Product"));
    expect(mockProps.onNewProduct).toHaveBeenCalled();
  });
});
