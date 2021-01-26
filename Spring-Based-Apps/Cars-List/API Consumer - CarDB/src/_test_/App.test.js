import React from 'react';
import ReactDOM from 'react-dom';
import App from '../App';

import renderer from 'react-test-renderer';
import AddCar from '../Components/AddCar';

it('renders without crashing', () => {
const div = document.createElement('div');
ReactDOM.render(<App />, div);
ReactDOM.unmountComponentAtNode(div);
});

// create a snopshot of our AddCar component and checks if it has changed. 
// the test passes if the component does not change : the actual snapshot of it persists
it('renders a snapshot', () => {
    const tree = renderer.create(<AddCar/>).toJSON();
    expect(tree).toMatchSnapshot();
});