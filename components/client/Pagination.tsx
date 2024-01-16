"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface Props {
  totalPage: number;
}

const Pagination: React.FC<Props> = ({ totalPage }) => {
  const router = useRouter();

  const pathName = usePathname();

  const searchParams = useSearchParams();

  const pageParams = searchParams.get("page");

  const categoryParams = searchParams.get("category");

  const subCategoryParams = searchParams.get("subCategory");

  const statusParams = searchParams.get("status");

  const pageNow: number = parseInt(pageParams ? pageParams : "1");

  const handleRouter = (page: number) => {
    if (categoryParams && subCategoryParams) {
      router.push(
        `${pathName}?category=${categoryParams}&subCategory=${subCategoryParams}&page=${page}`
      );
    } else if (categoryParams) {
      router.push(`${pathName}?category=${categoryParams}&page=${page}`);
    } else if (statusParams) {
      router.push(`${pathName}?status=${statusParams}&page=${page}`);
    } else {
      router.push(`${pathName}?page=${page}`);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

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
            className={`pagination border ${
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
        className={`pagination border ${
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
        className={`pagination border ${
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
