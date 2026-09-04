import React, { useState } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import CustomPackageServices, { readCustomServices } from '../components/CustomPackageServices';
afterEach(cleanup);
function Form() { const [value, setValue] = useState<string[]>([]); return <CustomPackageServices value={value} onChange={setValue} />; }
it('adds custom services and removes them without submitting the parent form', () => {
  render(<Form />);
  fireEvent.change(screen.getByLabelText('Add a custom service'), { target: { value: ' Valet Parking ' } });
  fireEvent.click(screen.getByText('Add service'));
  expect(screen.getByLabelText('Valet Parking')).toBeChecked();
  fireEvent.click(screen.getByLabelText('Remove Valet Parking'));
  expect(screen.queryByText('Valet Parking')).not.toBeInTheDocument();
});
it('rejects blank and predefined duplicate names', () => {
  render(<Form />); fireEvent.click(screen.getByText('Add service'));
  expect(screen.getByRole('alert')).toHaveTextContent('Enter a service');
  fireEvent.change(screen.getByLabelText('Add a custom service'), { target: { value: 'CATERING' } });
  fireEvent.click(screen.getByText('Add service'));
  expect(screen.getByRole('alert')).toHaveTextContent('already exists');
});
it('loads saved lists and handles legacy packages', () => {
  expect(readCustomServices('["Valet, Parking","Kids & Games"]')).toEqual(['Valet, Parking', 'Kids & Games']);
  expect(readCustomServices(null)).toEqual([]);
});
