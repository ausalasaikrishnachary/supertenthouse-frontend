import React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import PackageFormModal from "../components/PackageFormModal";

vi.mock("axios", () => ({ default: { get: vi.fn(async (url: string) => ({
  data: url.endsWith("/products") ? [{ id: 143, product_name: "Test Tent", price: 100, is_active: 1 }] : [],
})) } }));
afterEach(cleanup);

it("imports and renders the closed modal without crashing the app", async () => {
  const view = render(<PackageFormModal isOpen={false} onClose={() => {}} onSubmit={() => {}} />);
  await act(async () => {});
  expect(view.container).toBeEmptyDOMElement();
});

it("renders the open modal and submits selected product associations", async () => {
  const submit = vi.fn();
  const view = render(<PackageFormModal isOpen onClose={() => {}} onSubmit={submit} />);
  await act(async () => {});
  fireEvent.click(screen.getByText("Test Tent"));
  fireEvent.change(screen.getByLabelText('Add a custom service'), { target: { value: 'Valet Parking' } });
  fireEvent.click(screen.getByText('Add service'));
  fireEvent.submit(view.container.querySelector("form")!);
  expect(submit).toHaveBeenCalledTimes(1);
  expect(JSON.parse(submit.mock.calls[0][0].get("product_ids"))).toEqual([143]);
  expect(JSON.parse(submit.mock.calls[0][0].get('custom_services'))).toEqual(['Valet Parking']);
});

it('reopens saved custom services and submits an empty list when removed', async () => {
  const submit = vi.fn();
  const view = render(<PackageFormModal isOpen initialData={{ id: 7, custom_services: '["Valet Parking"]' }} onClose={() => {}} onSubmit={submit} />);
  await act(async () => {});
  expect(screen.getByLabelText('Valet Parking')).toBeChecked();
  fireEvent.click(screen.getByLabelText('Remove Valet Parking'));
  fireEvent.submit(view.container.querySelector('form')!);
  expect(submit.mock.calls[0][0].get('custom_services')).toBe('[]');
});
