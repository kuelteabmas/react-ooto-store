import React from "react";

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

  componentDidMount() {
    const storeId = this.props.match.params.storeId;
    this.ref = base.syncState(`${storeId}/fishes`, {
    context: this,
    state: 'fishes'
  });
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
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
    })
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
        <Inventory addFish={this.addFish} loadSampleFishes={this.loadSampleFishes} />

      </div>
    );
  }
}

export default App;
