import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app';
jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Map: () => ({}),
}));
describe.skip('App', () => {


  it('should render successfully', () => {
    const { baseElement } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(baseElement).toBeTruthy();
  });

  it('should have a greeting as the title', () => {
    const { getByText } = render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(getByText('Welcome to Home!')).toBeTruthy();
  });
});
