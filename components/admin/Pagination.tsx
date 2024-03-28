"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

interface Props {
  totalPage: number | undefined;
  pageParams: number;
  handleRouter: (page: number) => void;
}

const Pagination: React.FC<Props> = ({
  totalPage,
  pageParams,
  handleRouter,
}) => {
  if (!totalPage) {
    return null;
  }

  const pageNow: number = pageParams;

  const paginationNumber = () => {
    let pagination: number[] = [];

    for (let i = 0; i < totalPage; i++) {
      pagination.push(i + 1);
    }

    return pagination.map((page) => {
      const before = pageNow - 2;
      const after = pageNow + 2;

      if (page < before) {
        return null;
      } else if (page > after) {
        return null;
      } else {
        return (
          <button
            className={`pagination ${
              page === pageNow ? "pagination-disable" : "pagination-enable"
            }`}
            onClick={() => {
              handleRouter(page);
            }}
            type="button"
            disabled={page === pageNow ? true : false}
            key={page}
          >
            {page}
          </button>
        );
      }
    });
  };

  return totalPage > 1 ? (
    <div className="w-full flex justify-center mt-3 gap-1">
      <button
        className={`pagination ${
          pageNow === 1 ? "pagination-disable" : "pagination-enable"
        }`}
        onClick={() => {
          const newPage = pageNow - 1;
          handleRouter(newPage);
        }}
        type="button"
        disabled={pageNow === 1 ? true : false}
      >
        <ChevronLeft />
      </button>

      {paginationNumber()}

      <button
        className={`pagination ${
          pageNow === totalPage ? "pagination-disable" : "pagination-enable"
        }`}
        onClick={() => {
          const newPage = pageNow + 1;
          handleRouter(newPage);
        }}
        type="button"
        disabled={pageNow === totalPage ? true : false}
      >
        <ChevronRight className="text-3xl" />
      </button>
    </div>
  ) : null;
};

export default Pagination;
