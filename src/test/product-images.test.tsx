import React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProductFormModal from "../components/ProductFormModal";

vi.mock("axios", () => ({ default: { get: vi.fn().mockResolvedValue({ data: [] }) } }));
beforeEach(() => { URL.createObjectURL = vi.fn(() => "blob:test"); });
afterEach(async () => { await act(async () => {}); cleanup(); });

async function setup(initialData?: Record<string, unknown>) {
  const submit = vi.fn();
  const view = render(<ProductFormModal isOpen onClose={() => {}} onSubmit={submit} initialData={initialData} />);
  await act(async () => {});
  const upload = (files: File[]) => fireEvent.change(screen.getByLabelText("Upload product images"), { target: { files } });
  const save = () => { fireEvent.submit(view.container.querySelector("form")!); return submit.mock.calls[0][0] as FormData; };
  return { upload, save, view, submit };
}

describe("product image uploads", () => {
  it("uploads and previews images without any colour", async () => {
    const { upload, save } = await setup();
    upload([new File(["image"], "general.png", { type: "image/png" })]);
    expect(screen.getByAltText("Product image 1")).toBeInTheDocument();
    const data = save();
    expect((data.get("images") as File).name).toBe("general.png");
    expect(data.has("colors")).toBe(false);
  });

  it("removes the correct saved image while keeping new uploads and colour associations", async () => {
    const { upload, save } = await setup({ images: ["uploads/products/old.png", "uploads/products/red.png"], colors: ["#FF0000"], color_images: { "#FF0000": ["uploads/products/red.png"] } });
    upload([new File(["image"], "new.png", { type: "image/png" })]);
    fireEvent.click(screen.getByLabelText("Remove product image 1"));
    const data = save();
    expect(data.getAll("existing_images")).toEqual(["uploads/products/red.png"]);
    expect((data.get("images") as File).name).toBe("new.png");
    expect(JSON.parse(data.get("color_images") as string)).toEqual({ "#FF0000": ["uploads/products/red.png"] });
  });

  it("preserves colour-specific uploads alongside general images", async () => {
    const { upload, save, view } = await setup({ colors: ["#FF0000"], images: [] });
    upload([new File(["image"], "general.png", { type: "image/png" })]);
    const select = Array.from(view.container.querySelectorAll("select")).find(item => Array.from(item.options).some(option => option.value === "#FF0000"))!;
    fireEvent.change(select, { target: { value: "#FF0000" } });
    upload([new File(["image"], "red.png", { type: "image/png" })]);
    const data = save();
    expect(data.getAll("images")).toHaveLength(2);
    expect(JSON.parse(data.get("color_images") as string)).toEqual({ "#FF0000": ["red.png"] });
  });

  it("rejects non-images and batches over the upload limit", async () => {
    const { upload, save } = await setup();
    upload([new File(["text"], "bad.txt", { type: "text/plain" })]);
    expect(screen.getByRole("alert")).toHaveTextContent("5MB");
    upload(Array.from({ length: 11 }, (_, i) => new File(["image"], `${i}.png`, { type: "image/png" })));
    expect(screen.getByRole("alert")).toHaveTextContent("10");
    expect(save().getAll("images")).toHaveLength(0);
  });

  it("removes a new upload without deleting a saved image", async () => {
    const { upload, save } = await setup({ images: ["uploads/products/old.png"] });
    upload([new File(["image"], "new.png", { type: "image/png" })]);
    fireEvent.click(screen.getByLabelText("Remove product image 2"));
    const data = save();
    expect(data.getAll("existing_images")).toEqual(["uploads/products/old.png"]);
    expect(data.getAll("images")).toEqual([]);
  });

  it("rejects oversized images", async () => {
    const { upload, save } = await setup();
    const file = new File(["image"], "large.png", { type: "image/png" });
    Object.defineProperty(file, "size", { value: 5 * 1024 * 1024 + 1 });
    upload([file]);
    expect(screen.getByRole("alert")).toHaveTextContent("5MB");
    expect(save().getAll("images")).toEqual([]);
  });

  it("reopens a saved colourless product and retains its image paths", async () => {
    const { view, submit } = await setup();
    await act(async () => {
      view.rerender(<ProductFormModal isOpen onClose={() => {}} onSubmit={submit} initialData={{ images: ["uploads/products/saved.png"], colors: [] }} />);
    });
    expect(screen.getByAltText("Product image 1")).toHaveAttribute("src", expect.stringContaining("uploads/products/saved.png"));
    fireEvent.submit(view.container.querySelector("form")!);
    const data = submit.mock.calls[0][0] as FormData;
    expect(data.getAll("existing_images")).toEqual(["uploads/products/saved.png"]);
    expect(data.getAll("images")).toEqual([]);
  });

  it("clears unsaved uploads when opening a different product", async () => {
    const { upload, view, submit } = await setup({ images: [], colors: ["#FF0000"] });
    upload([new File(["image"], "unsaved.png", { type: "image/png" })]);
    await act(async () => {
      view.rerender(<ProductFormModal isOpen onClose={() => {}} onSubmit={submit} initialData={{ images: [], colors: [] }} />);
    });
    expect(screen.queryByAltText("Product image 1")).not.toBeInTheDocument();
    fireEvent.submit(view.container.querySelector("form")!);
    const data = submit.mock.calls[0][0] as FormData;
    expect(data.getAll("images")).toEqual([]);
    expect(data.has("color_images")).toBe(false);
  });
});
