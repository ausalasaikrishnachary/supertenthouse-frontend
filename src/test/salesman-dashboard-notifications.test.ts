import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(resolve(__dirname, "../pages/salesman/dashboard.tsx"), "utf8");

describe("salesman dashboard notifications", () => {
  it("loads the authenticated salesman's notifications", () => {
    expect(source).toContain('/api/salesman/notifications');
    expect(source).toContain('Authorization: `Bearer ${localStorage.getItem(\'token\')}`');
  });

  it("shows unread notifications and supports read actions", () => {
    expect(source).toContain('Order Updates');
    expect(source).toContain('unreadCount');
    expect(source).toContain('markNotificationRead');
    expect(source).toContain('markAllNotificationsRead');
  });

  it("polls and cleans up notification refresh", () => {
    expect(source).toContain('window.setInterval(fetchNotifications, 30000)');
    expect(source).toContain('window.clearInterval(intervalId)');
    expect(source).toContain("window.removeEventListener('focus', refreshOnFocus)");
  });
});
