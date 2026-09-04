import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(__dirname, "../pages/salesman/orders.tsx"), "utf8");

describe("salesman order access", () => {
  it("renders the current status as a badge", () => {
    expect(source).toContain("{renderStatusBadge(order)}");
  });

  it("does not expose order status mutation controls or requests", () => {
    expect(source).not.toContain("updateOrderStatus");
    expect(source).not.toContain("renderStatusActions");
    expect(source).not.toContain("status-payment");
    expect(source).not.toContain("axios.put");
  });

  it("does not expose order deletion", () => {
    expect(source).not.toContain("deleteOrder");
    expect(source).not.toContain("axios.delete");
    expect(source).not.toContain("Delete Order");
  });
});
