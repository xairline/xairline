import { render } from '@testing-library/react';
import FlyNow from './fly-now';
jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Map: () => ({}),
}));
describe.skip('FlyNow', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FlyNow />);
    expect(baseElement).toBeTruthy();
  });
});
