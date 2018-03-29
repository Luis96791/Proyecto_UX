import React, { Component } from 'react'
import axios from 'axios'
import Product from './Product.js'
import ProductForm from './ProductForm.js'
import update from 'immutability-helper'

class ProductsContainer extends Component {
  constructor(props) {
  	super(props)
  	this.state = {
  		products: [],
      editingProductId: null,
      notification: ''
  	}
  }

  componentDidMount() {
  	axios.get('http://localhost:3001/api/v1/products.json')
  	.then(response => {
  		this.setState({products: response.data})
  	})
  	.catch(error => console.log(error))
  }

  addNewProduct = () => {
   axios.post('http://localhost:3001/api/v1/products', {product: {title: '', description: '', votes: ''}})
    .then(response => {
      const products = update(this.state.products, { $splice: [[0, 0, response.data]]})
      this.setState({products: products, editingProductId: response.data.id})
    })
    .catch(error => console.log(error)) 
  }

  updateProduct = (product) => {
    const productIndex = this.state.products.findIndex(x => x.id === product.id)
    const products = update(this.state.products, {[productIndex]: { $set: product }})
    this.setState({products: products, notification: 'All changes saved'})
  }

  deleteProduct = (id) => {
    axios.delete(`http://localhost:3001/api/v1/products/${id}`)
    .then(response => {
      const productIndex = this.state.products.findIndex(x => x.id === id)
      const products = update(this.state.products, { $splice: [[productIndex, 1]]})
      this.setState({products: products})
    })
    .catch(error => console.log(error)) 
  }

  resetNotification = () => {this.setState({notification: ''})}

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
          <span className="notification">
            {this.state.notification}
          </span>
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
        })}
      </div>
    );
  }
}

export default ProductsContainer