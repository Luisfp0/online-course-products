import { render } from "@testing-library/react";
import { Loader } from "../Loader";
import { ProductCardSkeleton } from "../ProductCardSkeleton";

describe("Loader", () => {
  it("should render loader component", () => {
    const { container } = render(<Loader />);
    expect(container.firstChild).toHaveClass("fixed inset-0");
  });
});

describe("ProductCardSkeleton", () => {
  it("should render skeleton component", () => {
    const { container } = render(<ProductCardSkeleton />);
    expect(container.firstChild).toHaveClass("animate-pulse");
  });
});
