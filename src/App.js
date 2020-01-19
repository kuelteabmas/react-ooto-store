import React from "react"
import PropTypes from 'prop-types'


import Header from "./components/Header";
import Inventory from "./components/Inventory";
import Order from "./components/Order";
import sampleFishes from "./sample-fishes"
import Fish from './components/Fish'
import base from './base'

class App extends React.Component {
  state = {
    fishes: {},
    order: {}
  };

  static propTypes = {
    match: PropTypes.object
  }

  componentDidMount() {
    const storeId = this.props.match.params.storeId;

    // First reisntate our localstorage once page refreshes
    const localStorageRef = localStorage.getItem(storeId);
    if (localStorageRef) {
      this.setState({
        order: JSON.parse(localStorageRef) // parse to change String back to Object
      })
    }


    this.ref = base.syncState(`${storeId}/fishes`, {
      context: this,
      state: 'fishes'
    });
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }
  componentDidUpdate() {
    const storeId = this.props.match.params.storeId;
    const order = this.state.order;
    localStorage.setItem(
      storeId,
      JSON.stringify(order) // JSON.stringfy is used here to change jsonObject to String
    );
  }

  addFish = (fish) => {
    // take a copy of the existing state
    const fishes = { ...this.state.fishes }

    // Add our new state of fishes
    fishes[`fish${Date.now()}`] = fish;

    // set the new fishes object to state
    this.setState({
      fishes: fishes
    })
    console.log("adding fis h yo")
  };

  updateFish = (key, updatedFish) => {
    // fst, take a copy of the current state
    const fishes = { ...this.state.fishes };

    // then, update the state
    fishes[key] = updatedFish;

    // finally, set to state
    this.setState({
      fishes: fishes
    })
  }

deleteFish = key => {
  // first, take a copy of state
  const fishes = { ...this.state.fishes};

  // then, update the state
  fishes[key] = null;

  // finally, set to state
  this.setState({
    fishes: fishes
  })
}

  addToOrder = (key) => {
    // take a copy of the existing state
    const order = { ...this.state.order }

    // Either add 1 to order or update the amount in order
    order[key] = order[key] + 1 || 1;

    // update state
    this.setState({ order: order })

  }

  loadSampleFishes = () => {
    this.setState({
      fishes: sampleFishes
    });
  }



  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Daily" />
          <ul className="fishes">
            {Object.keys(this.state.fishes).map(key =>
              <Fish
                key={key}
                index={key}
                details={this.state.fishes[key]}
                addToOrder={this.addToOrder}
              />

            )}
          </ul>

        </div>
        <Order
          fishes={this.state.fishes}
          order={this.state.order}
        />
        <Inventory 
          addFish={this.addFish}
          updateFish={this.updateFish}
          deleteFish={this.deleteFish}
          loadSampleFishes={this.loadSampleFishes}
          fishes={this.state.fishes}
          storeId={this.props.match.params.storeId}

        />

      </div>
    );
  }
}

export default App;
