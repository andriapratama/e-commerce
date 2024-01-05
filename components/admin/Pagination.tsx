"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  totalPage: number;
  setIsLoadingContent: Dispatch<SetStateAction<boolean>>;
}

const Pagination: React.FC<Props> = ({ totalPage, setIsLoadingContent }) => {
  const router = useRouter();

  const pathName = usePathname();

  const searchParams = useSearchParams();

  const pageParams = searchParams.get("page");

  const categoryParams = searchParams.get("category");

  const subCategoryParams = searchParams.get("subCategory");

  const pageNow: number = parseInt(pageParams ? pageParams : "1");

  const handleRouter = (page: number) => {
    if (categoryParams && subCategoryParams) {
      router.push(
        `${pathName}?category=${categoryParams}&subCategory=${subCategoryParams}&page=${page}`
      );
    } else if (categoryParams) {
      router.push(`${pathName}?category=${categoryParams}&page=${page}`);
    } else {
      router.push(`${pathName}?page=${page}`);
    }
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
            className={`pagination ${
              page === pageNow ? "pagination-disable" : "pagination-enable"
            }`}
            onClick={() => {
              handleRouter(page);
              setIsLoadingContent(true);
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
          setIsLoadingContent(true);
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
          setIsLoadingContent(true);
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
