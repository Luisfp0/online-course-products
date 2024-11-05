import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pagination } from "../Pagination";

describe("Pagination", () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    onPageChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render correct number of pages", () => {
    render(<Pagination {...defaultProps} />);

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });

  it("should highlight current page", () => {
    render(<Pagination {...defaultProps} currentPage={3} />);

    const currentPageButton = screen.getByText("3");
    expect(currentPageButton).toHaveClass("bg-violet-600");
  });

  it("should disable previous button on first page", () => {
    render(<Pagination {...defaultProps} currentPage={1} />);

    const previousButton = screen.getByText("Previous");
    expect(previousButton).toBeDisabled();
  });

  it("should disable next button on last page", () => {
    render(<Pagination {...defaultProps} currentPage={5} />);

    const nextButton = screen.getByText("Next");
    expect(nextButton).toBeDisabled();
  });

  it("should call onPageChange when clicking page number", async () => {
    render(<Pagination {...defaultProps} />);

    await userEvent.click(screen.getByText("3"));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(3);
  });

  it("should call onPageChange when clicking next/previous", async () => {
    render(<Pagination {...defaultProps} currentPage={3} />);

    await userEvent.click(screen.getByText("Next"));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(4);

    await userEvent.click(screen.getByText("Previous"));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });
});
