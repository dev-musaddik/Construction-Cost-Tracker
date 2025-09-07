import { Button } from "./ui/button";

const Pagination = ({ pages, currentPage, onPageChange }) => {
  // Generate dynamic page numbers
  const generatePageNumbers = () => {
    const pageNumbers = [];

    // Case when total pages are less than or equal to 7
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Handle pagination logic based on current page
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, 5, "...", pages);
      } else if (currentPage >= pages - 2) {
        pageNumbers.push(
          1,
          "...",
          pages - 4,
          pages - 3,
          pages - 2,
          pages - 1,
          pages
        );
      } else {
        pageNumbers.push(
          currentPage,
          currentPage + 1,
          currentPage + 2,
          currentPage + 3,
          currentPage + 4,
          "...",
          pages
        );
      }
    }

    return pageNumbers;
  };

  return (
    <div className="mt-6  py-3 rounded-lg bg-transparent shadow-md w-full">
      {pages > 1 && (
        <div className="flex justify-center items-center flex-wrap gap-2">
          {/* Previous Button */}
          {currentPage > 1 && (
            <Button
              onClick={() => onPageChange(currentPage - 1)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-blue-100  rounded-md transition-all"
            >
              &lt; Prev
            </Button>
          )}

          {/* Dynamic Page Numbers */}
          {generatePageNumbers().map((page, index) => 
            page === "..." ? (
              <span
                key={`dots-${index}`}
                className="px-3 py-2 text-sm text-gray-500 select-none"
              >
                ...
              </span>
            ) : (
              <Button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-4 py-2 text-sm font-medium transition-all ${
                  page === currentPage
                    ? "bg-blue-200 text-blue-600 rounded-md shadow-sm"
                    : "bg-transparent text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                }`}
              >
                {page}
              </Button>
            )
          )}

          {/* Next Button */}
          {currentPage < pages && (
            <Button
              onClick={() => onPageChange(currentPage + 1)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-blue-100 rounded-md transition-all"
            >
              Next &gt;
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Pagination;
