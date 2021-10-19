import { render } from '@testing-library/react';
import Airlines from './airlines';
jest.mock('mapbox-gl/dist/mapbox-gl', () => ({
  Map: () => ({}),
}));
describe.skip('Airlines', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Airlines />);
    expect(baseElement).toBeTruthy();
  });
});
