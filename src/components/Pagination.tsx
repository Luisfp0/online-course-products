interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const getVisiblePages = () => {
    const firstPage = 1;
    const lastPage = totalPages;

    let startPage = Math.max(currentPage - 1, firstPage);
    let endPage = Math.min(currentPage + 1, lastPage);

    const screenWidth = typeof window !== "undefined" ? window.innerWidth : 0;
    const maxVisiblePages = screenWidth < 640 ? 3 : screenWidth < 768 ? 5 : 7;

    while (
      endPage - startPage + 1 < maxVisiblePages &&
      (startPage > firstPage || endPage < lastPage)
    ) {
      if (startPage > firstPage) {
        startPage--;
      }
      if (endPage < lastPage && endPage - startPage + 1 < maxVisiblePages) {
        endPage++;
      }
    }

    const pages = [];

    if (startPage > firstPage) {
      pages.push(firstPage);
      if (startPage > firstPage + 1) {
        pages.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < lastPage) {
      if (endPage < lastPage - 1) {
        pages.push("...");
      }
      pages.push(lastPage);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 mt-8 px-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 sm:px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700 font-medium text-sm sm:text-base min-w-[80px] sm:min-w-[100px]"
      >
        Previous
      </button>

      <div className="flex flex-wrap gap-1 sm:gap-2">
        {visiblePages.map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500"
            >
              ...
            </span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => typeof page === "number" && onPageChange(page)}
              className={`
                w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-medium transition-colors text-sm sm:text-base
                ${
                  currentPage === page
                    ? "bg-violet-600 text-white"
                    : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              {page}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 sm:px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700 font-medium text-sm sm:text-base min-w-[80px] sm:min-w-[100px]"
      >
        Next
      </button>
    </div>
  );
}
