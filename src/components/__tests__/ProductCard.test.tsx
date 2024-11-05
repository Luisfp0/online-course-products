import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductCard } from "../ProductCard";
import type { Product } from "@/types/product";

jest.mock("next/image", () => ({
  __esModule: true,
  default: function MockImage({
    src,
    alt,
    className,
    onError,
    priority,
    width,
    height,
    sizes,
    style,
    ...props
  }: any) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={onError}
        width={width}
        height={height}
        {...props}
      />
    );
  },
}));

describe("ProductCard", () => {
  const mockProduct: Product = {
    id: 1,
    title: "Test Product",
    description: "Test Description",
    price: 99.99,
    brand: "Test Brand",
    category: "Test Category",
    thumbnail: "https://test.com/image.jpg",
    images: ["https://test.com/image.jpg"],
  };

  it("should render product information correctly", () => {
    render(
      <ProductCard
        product={mockProduct}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.brand)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
  });

  it("should call onEdit when edit button is clicked", async () => {
    const handleEdit = jest.fn();

    render(
      <ProductCard
        product={mockProduct}
        onEdit={handleEdit}
        onDelete={() => {}}
      />
    );

    await userEvent.click(screen.getByText(/edit/i));
    expect(handleEdit).toHaveBeenCalledWith(mockProduct);
  });

  it("should call onDelete when delete button is clicked", async () => {
    const handleDelete = jest.fn();

    render(
      <ProductCard
        product={mockProduct}
        onEdit={() => {}}
        onDelete={handleDelete}
      />
    );

    await userEvent.click(screen.getByText(/delete/i));
    expect(handleDelete).toHaveBeenCalledWith(mockProduct.id);
  });
});
