import { describe, expect, it } from "vitest";
import { getPagination, parsePageParam } from "./pagination";

describe("pagination helpers", () => {
  it("defaults invalid page params to page 1", () => {
    expect(parsePageParam(undefined)).toBe(1);
    expect(parsePageParam(null)).toBe(1);
    expect(parsePageParam("0")).toBe(1);
    expect(parsePageParam("-2")).toBe(1);
    expect(parsePageParam("abc")).toBe(1);
  });

  it("parses positive integer page params", () => {
    expect(parsePageParam(3)).toBe(3);
    expect(parsePageParam("4")).toBe(4);
  });

  it("builds pagination metadata with clamped pages", () => {
    expect(
      getPagination({
        page: "9",
        pageSize: 21,
        totalCount: 50,
      }),
    ).toEqual({
      page: 3,
      pageSize: 21,
      totalCount: 50,
      totalPages: 3,
      skip: 42,
      take: 21,
    });
  });

  it("returns page 1 with zero pages when there are no results", () => {
    expect(
      getPagination({
        page: "2",
        pageSize: 21,
        totalCount: 0,
      }),
    ).toEqual({
      page: 1,
      pageSize: 21,
      totalCount: 0,
      totalPages: 0,
      skip: 0,
      take: 21,
    });
  });
});
