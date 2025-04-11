export function Pagination({ currentPage, totalPages, onPageClick, onNextPage, onPreviousPage }) {
  /**
   * Pagination Component
   *
   * @param {number} currentPage - The current active page number.
   * @param {number} totalPages - The total number of pages available.
   * @param {function} onPageClick - Callback function to handle clicking on a specific page number.
   * @param {function} onNextPage - Callback function to handle clicking the "Next" button.
   * @param {function} onPreviousPage - Callback function to handle clicking the "Previous" button.
   */

  // Calculate the range of page numbers to display
  const visiblePages = 5; // Limit the number of visible page numbers
  const startPage = Math.max(2, currentPage - Math.floor(visiblePages / 2)); // Start from the second page
  const endPage = Math.min(totalPages - 1, startPage + visiblePages - 1); // End before the last page

  const pageNumbers = [];
  if (startPage > 2) pageNumbers.push("...");
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  if (endPage < totalPages - 1) pageNumbers.push("...");

  return (
    <div
      className="pagination-controls flex justify-center items-center mt-6"
      role="navigation"
      aria-label="Pagination"
    >
      <button
        onClick={onPreviousPage}
        disabled={currentPage === 1}
        aria-label="Previous page" // Added for screen readers
        className={`btn btn-primary px-4 py-2 mx-2 disabled:opacity-0 ${
          currentPage === 1 ? "" : "hover:bg-uog-color-grey-dark-bg hover:text-white"
        }`}
      >
        <i class="fa-sharp-duotone fa-solid fa-chevrons-left"></i>
      </button>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageClick(1)}
          className={`px-3 py-1 rounded ${
            currentPage === 1
              ? "bg-uog-color-yellow text-black"
              : "bg-uog-color-grey-light-bg text-uog-color-grey-dark-bg hover:bg-uog-color-grey-dark-bg hover:text-white"
          }`}
        >
          1
        </button>
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageClick(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-uog-color-yellow text-black"
                  : "bg-uog-color-grey-light-bg text-uog-color-grey-dark-bg hover:bg-uog-color-grey-dark-bg hover:text-white"
              }`}
              aria-current={currentPage === page ? "page" : undefined} // Add aria-current for active page
            >
              {page}
            </button>
          )
        )}
        {totalPages > 1 && (
          <button
            onClick={() => onPageClick(totalPages)}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? "bg-uog-color-yellow text-black"
                : "bg-uog-color-grey-light-bg text-uog-color-grey-dark-bg hover:bg-uog-color-grey-dark-bg hover:text-white"
            }`}
          >
            {totalPages}
          </button>
        )}
      </div>
      <button
        onClick={onNextPage}
        disabled={currentPage === totalPages}
        aria-label="Next page" // Added for screen readers
        className={`btn btn-primary px-4 py-2 mx-2 disabled:opacity-0 ${
          currentPage === totalPages ? "" : "hover:bg-uog-color-grey-dark-bg hover:text-white"
        }`}
      >
        <i class="fa-sharp-duotone fa-solid fa-chevrons-right"></i>
      </button>
    </div>
  );
}
