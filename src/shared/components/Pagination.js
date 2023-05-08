import React, { useEffect, useState } from 'react';

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';

/**
 * Helper method for creating a range of numbers
 * range(1, 5) => [1, 2, 3, 4, 5]
 */
const range = (from, to, step = 1) => {
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
}

const Pagination = ({totalRecords = null, pageLimit = 30, pageNeighbours = 0, onPageChanged}) => {
    const [currentPage, setCurrentPage] =  useState(1);
    pageNeighbours = typeof pageNeighbours === 'number'
      ? Math.max(0, Math.min(pageNeighbours, 2))
      : 0;
    let allPages = Math.ceil(totalRecords / pageLimit);
    pageLimit = typeof pageLimit === 'number' ? pageLimit : 30;
    totalRecords = typeof totalRecords === 'number' ? totalRecords : 0;
    const fetchPageNumbers = () => {
        const totalPages = allPages;
        const current = currentPage;
        const neighbours = pageNeighbours;

        /**
         * totalNumbers: the total page numbers to show on the control
         * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
         */
        const totalNumbers = (neighbours * 2) + 1;
        const totalBlocks = totalNumbers + 2;

        if (totalPages > totalBlocks) {
        const startPage = Math.max(2, current - neighbours);
        const endPage = Math.min(totalPages - 1, current + neighbours);
        let pages = range(startPage, endPage);

        /**
         * hasLeftSpill: has hidden pages to the left
         * hasRightSpill: has hidden pages to the right
         * spillOffset: number of hidden pages either to the left or to the right
         */
        const hasLeftSpill = startPage > 2;
        const hasRightSpill = (totalPages - endPage) > 1;
        const spillOffset = totalNumbers - (pages.length + 1);

        switch (true) {
            // handle: < (1) {5 6} [7] {8 9} (10)
            case (hasLeftSpill && !hasRightSpill): {
                const extraPages = range(startPage - spillOffset, startPage - 1);
                pages = [LEFT_PAGE, ...extraPages, ...pages];
                break;
            }

            // handle: (1) {2 3} [4] {5 6} (10) >
            case (!hasLeftSpill && hasRightSpill): {
                const extraPages = range(endPage + 1, endPage + spillOffset);
                pages = [...pages, ...extraPages, RIGHT_PAGE];
                break;
            }

            // handle:  < (1) {4 5} [6] {7 8} (10) >
            case (hasLeftSpill && hasRightSpill):
            default: {
                const left = [];
                const right = [];
                pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
                break;
            }
        }

        return [1, ...pages, totalPages];
        }

        return range(1, totalPages);
    }

    const gotoPage = page => {
        // const { onPageChanged = f => f } = this.props;
        const currentPage = Math.max(0, Math.min(page, allPages));
        setCurrentPage(currentPage);
        // this.setState({ currentPage }, () => onPageChanged(paginationData));
    }

    useEffect(() => {
        const paginationData = {
            currentPage,
            allPages,
            pageLimit,
            totalRecords
        };
        onPageChanged(paginationData);
    }, [currentPage]);

    const handleClick = page => evt => {
        evt.preventDefault();
        gotoPage(page);
    }

    const handleMoveLeft = evt => {
        evt.preventDefault();
        gotoPage(currentPage - (pageNeighbours * 2) - 1);
    }

    const handleMoveRight = evt => {
        evt.preventDefault();
        gotoPage(currentPage + (pageNeighbours * 2) + 1);
    }

    const pages = fetchPageNumbers();
    return (
        <>
        <nav aria-label="Pagination" className="flex items-center">
        <button className="bg-primary px-4 py-2 text-white focus:outline-none rounded-sm" onClick={() => gotoPage(currentPage - 1)} disabled={currentPage <= 1}>Previous</button>
          <ul className="pagination flex">
            { pages.map((page, index) => {

              if (page === LEFT_PAGE) return (
                <li key={index} className="page-item bg-primary px-4 py-2 border border-primary mx-4 text-white focus:outline-none rounded-sm">
                  <a className="page-link py-3 px-5" href="#" aria-label="Previous" onClick={handleMoveLeft}>
                    <span aria-hidden="true">&hellip;</span>
                    <span className="sr-only">Previous</span>
                  </a>
                </li>
              );

              if (page === RIGHT_PAGE) return (
                <li key={index} className="page-item bg-primary px-4 py-2 border border-primary mx-4 text-white focus:outline-none rounded-sm">
                  <a className="page-link py-3 px-5" href="#" aria-label="Next" onClick={handleMoveRight}>
                    <span aria-hidden="true">&hellip;</span>
                    <span className="sr-only">Next</span>
                  </a>
                </li>
              );

              return (
                <li key={index} className={`page-item ${ currentPage === page ? 'bg-white text-primary' : 'bg-primary text-white'} text-center w-12 py-2 border border-primary rounded-sm mx-4 focus:outline-none`}>
                  <a className="page-link py-3" href="#" onClick={handleClick(page) }>{ page }</a>
                </li>
              );

            }) }

          </ul>
        <button className="bg-primary px-4 py-2 text-white focus:outline-none rounded-sm" onClick={() => gotoPage(currentPage + 1)} disabled={currentPage == allPages}>Next</button>
        </nav>
      </>
    )
}

export default Pagination;
