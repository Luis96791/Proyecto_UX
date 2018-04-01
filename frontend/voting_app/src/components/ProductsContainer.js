import React, { Component } from 'react'
import axios from 'axios'
import Product from './Product.js'
import ProductForm from './ProductForm.js'
import Notification from './Notification'
import update from 'immutability-helper'

class ProductsContainer extends Component {
  constructor(props) {
  	super(props)
  	this.state = {
  		products: [],
      editingProductId: null,
      editingProductVote: null,
      notification: '',
      transitionIn: false
  	}
  }

  componentDidMount() {
    axios.get('https://apricot-crumble-18950.herokuapp.com/api/v1/products.json')
  	//axios.get('http://localhost:3001/api/v1/products.json')
  	.then(response => {
  		this.setState({products: response.data})
  	})
  	.catch(error => console.log(error))
  }

  addNewProduct = () => {
   axios.post('https://apricot-crumble-18950.herokuapp.com/api/v1/products', {product: {title: '', description: '', votes: ''}})
   //axios.post('http://localhost:3001/api/v1/products', {product: {title: '', description: '', votes: ''}})
    .then(response => {
      const products = update(this.state.products, { $splice: [[0, 0, response.data]]})
      this.setState({products: products, editingProductId: response.data.id})
    })
    .catch(error => console.log(error)) 
  }

  updateProduct = (product) => {
    const productIndex = this.state.products.findIndex(x => x.id === product.id)
    const products = update(this.state.products, {[productIndex]: { $set: product }})
    this.setState({products: products, notification: 'All changes saved', transitionIn: true})
  }

  voteProduct = (product) => {
    const productIndex = this.state.products.findIndex(x => x.id === product.id)
    const products = update(this.state.products, {[productIndex]: { $set: product.votes+1 }})
    this.setState({products: products, notification: 'All changes saved', transitionIn: true})
  }

  deleteProduct = (id) => {
    axios.delete(`https://apricot-crumble-18950.herokuapp.com/api/v1/products/${id}`)
    //axios.delete(`http://localhost:3001/api/v1/products/${id}`)
    .then(response => {
      const productIndex = this.state.products.findIndex(x => x.id === id)
      const products = update(this.state.products, { $splice: [[productIndex, 1]]})
      this.setState({products: products})
    })
    .catch(error => console.log(error)) 
  }

  resetNotification = () => {this.setState({notification: '', transitionIn: false})}

  enableVotes = (id) => {
    this.setState({editingProductVote: id}, () => {this.title.focus()})
  }

  enableEditing = (id) => {
    this.setState({editingProductId: id}, () => {this.title.focus()})
  }

  render() {
    return (
      <div>
        <div>
          <button className="newProductButton" onClick={this.addNewProduct}>
            New Product
          </button>
          <Notification in={this.state.transitionIn} notification= {this.state.notification} />
        </div>
        {this.state.products.map((product) => {

          if(this.state.editingProductId === product.id) {
            return (<ProductForm product={product} key={product.id} updateProduct={this.updateProduct}
                  titleRef={ input => this.title = input }
                  resetNotification={this.resetNotification} />)
          } else {
            return (<Product product={product} key={product.id} onClick={this.enableEditing} 
                  onDelete={this.deleteProduct} />)
          }

          if(this.state.editingProductVote === product.id) {
            return (<ProductForm product={product} key={product.id} voteProduct={this.voteProduct}
                  titleRef={ input => this.title = input }
                  resetNotification={this.resetNotification} />)
          } else {
            return (<Product product={product} key={product.id} onClick={this.enableVotes} />)
          }

        })}
      </div>
    );
  }
}

export default ProductsContainer