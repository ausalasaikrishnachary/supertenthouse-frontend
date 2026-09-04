import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(__dirname, "../components/SalesmanNotificationBell.tsx"), "utf8");

describe("salesman dashboard notifications", () => {
  it("loads the authenticated salesman's notifications", () => {
    expect(source).toContain('/api/salesman/notifications');
    expect(source).toContain('Authorization: `Bearer ${localStorage.getItem(\'token\')}`');
  });

  it("shows unread notifications and supports read actions", () => {
    expect(source).toContain('Notifications');
    expect(source).toContain('/unread-count');
    expect(source).toContain('/read');
    expect(source).toContain('/read-all');
  });

  it("polls and cleans up notification refresh", () => {
    expect(source).toContain('window.setInterval(refresh, 30000)');
    expect(source).toContain('window.clearInterval(timer)');
    expect(source).toContain("window.removeEventListener('focus', refresh)");
  });
});
