import React from "react"
import AddFishForm from "./AddFishForm"
import EditFishForm from "./EditFishForm"
import PropTypes from 'prop-types'
import Login from './Login'
import firebase from 'firebase'
import base, { firebaseApp } from '../base'

class Inventory extends React.Component {

  static propTypes = {
    fishes: PropTypes.object,
    updateFish: PropTypes.func,
    deleteFish: PropTypes.func,
    loadSampleFishes: PropTypes.func
  }

  state = {
    uid: null,
    owner: null
  }

  // If page is refreshed, recheck if owner is logged
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
          this.authHandler({
            user: user
          })
        }
      })
  }

  authHandler = async authData => {
    // Look up current store in the firebase db
    const store = await base.fetch(this.props.storeId, { context: this })
    console.log(store)

    // Claim it if there is no owner 
    if (!store.owner) {
      // save it as our own
      await base.post(`${this.props.storeId}/owner`, {
        data: authData.user.uid
      })
    }

    // Set the state of the inventory component to reflect the current user
    this.setState({
      uid: authData.user.uid,
      owner: store.owner || authData.user.uid
    })
  }

  // Run the auth from firebase, bring a pop up to sign in, then bring back the data into freibase and manage store
  authenticate = provider => {
    const authProvider = new firebase.auth[`${provider}AuthProvider`]()
    firebaseApp
      .auth()
      .signInWithPopup(authProvider)
      .then(this.authHandler)
  }

  logout = async () => {
    // Sign out 
    await firebase.auth().signOut()

    // Reset state
    this.setState({
      uid: null
    })
  }


  render() {
    // log Out Button
    const logOut = <button onClick={this.logout}>Log Out</button>

    // Check if owner is logged in
    if (!this.state.uid) {
      return <Login authenticate={this.authenticate} />
    }

    // Check if user is not the owner of the store
    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>You are not the owner!</p>
          {logOut}
        </div>

      )
    }

    // If user is the owner, render inventory
    return (
      <div className="inventory">
        <h2>Inventory</h2>
        {logOut}
        <AddFishForm addFish={this.props.addFish} />

        {Object.keys(this.props.fishes).map(key =>
          <EditFishForm
            key={key}
            index={key}
            fish={this.props.fishes[key]}
            updateFish={this.props.updateFish}
            deleteFish={this.props.deleteFish}
          />)}
        <button onClick={this.props.loadSampleFishes}>Load Sample Fishes</button>
      </div>
    )
  }
}

export default Inventory;
