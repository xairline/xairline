import { render } from '@testing-library/react';
import Home from './home';
jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Map: () => ({})
  }));
describe.skip('Home', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Home />);
    expect(baseElement).toBeTruthy();
  });
});
