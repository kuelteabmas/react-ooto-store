import React from "react"
import { formatPrice } from '../helpers'
import PropTypes from 'prop-types'

class Order extends React.Component {

  static propTypes = {
    fishes: PropTypes.object,
    order: PropTypes.object,
    removeFromOrder: PropTypes.func,
  }

  renderOrder = key => {
    const fish = this.props.fishes[key];
    const count = this.props.order[key];
    const isAvailable = fish && fish.status === 'available'

    if (!isAvailable) {
      return <li key={key}>
        Sorry, {fish ? fish.name : 'fish'} is no longer available.

      </li>
    }

    return <li key={key}>
      {count} lbs {fish.name}
      &nbsp;
      {formatPrice(count * fish.price)}
    </li>
  };

  render() {
    const orderIds = Object.keys(this.props.order);
    const total = orderIds.reduce((prevTotal, key) => {
      const fish = this.props.fishes[key];
      const count = this.props.order[key];

      const isAvailable = fish && fish.status === 'available'
      if (isAvailable) {
        return prevTotal + (count * fish.price);
      }
      return prevTotal;
    }, 0);  // 0 is the starting value since reduce() requires one. 
    //In this case, our starting value is 0
    return (
      <div className="order-wrap">
        <h3>Order</h3>
        <ul>
          {orderIds.map(this.renderOrder)}
        </ul>

        <div className="total underline">
          Total: <strong>{formatPrice(total)}</strong>
        </div>
      </div>
    );
  }
}

export default Order;
