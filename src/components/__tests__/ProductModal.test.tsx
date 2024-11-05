import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductModal } from "../ProductModal";

describe("ProductModal", () => {
  const mockProduct = {
    id: 1,
    title: "Test Product",
    description: "Test Description",
    price: 99.99,
    brand: "Test Brand",
    category: "Test Category",
    thumbnail: "test.jpg",
    images: ["test.jpg"],
  };

  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSave: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render empty form for new product", () => {
    render(<ProductModal {...defaultProps} />);

    expect(screen.getByText("New Product")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter product title")).toHaveValue("");
  });

  it("should render filled form for existing product", () => {
    render(<ProductModal {...defaultProps} product={mockProduct} />);

    expect(screen.getByText("Edit Product")).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockProduct.title)).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(mockProduct.description)
    ).toBeInTheDocument();
  });

  it("should format price correctly", async () => {
    render(<ProductModal {...defaultProps} />);

    const priceInput = screen.getByPlaceholderText("$ 0.00");
    await userEvent.type(priceInput, "1234");

    expect(priceInput).toHaveValue("$ 12.34");
  });

  it("should call onSave with correct data on form submit", async () => {
    render(<ProductModal {...defaultProps} />);

    await userEvent.type(
      screen.getByPlaceholderText("Enter product title"),
      "New Product"
    );
    await userEvent.type(
      screen.getByPlaceholderText("Product description"),
      "Description"
    );
    await userEvent.type(screen.getByPlaceholderText("$ 0.00"), "1234");
    await userEvent.type(
      screen.getByPlaceholderText("Enter brand name"),
      "Brand"
    );
    await userEvent.type(
      screen.getByPlaceholderText("Enter product category"),
      "Category"
    );

    await userEvent.click(screen.getByText("Save"));

    expect(defaultProps.onSave).toHaveBeenCalledWith({
      title: "New Product",
      description: "Description",
      price: 12.34,
      brand: "Brand",
      category: "Category",
    });
  });

  it("should call onClose when cancel button is clicked", async () => {
    render(<ProductModal {...defaultProps} />);

    await userEvent.click(screen.getByText("Cancel"));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });
});
