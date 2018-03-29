
import React, { Component } from 'react'
import axios from 'axios'

class ProductForm extends Component {
	constructor(props) {
		super(props)
		this.state = {
			title: this.props.product.title,
			description: this.props.product.description,
			votes: this.props.product.votes
		}
	}

	handleInput = (e) => {
		this.props.resetNotification()
		this.setState({[e.target.name]: e.target.value})
	}

	handleBlur = () => {
		const product = { title: this.state.title, description: this.state.description, votes: this.state.votes }
		axios.put(
			`http://localhost:3001/api/v1/products/${this.props.product.id}`,
			{product: product}
		)
		.then(response => {
			console.log(response)
			this.props.updateProduct(response.data)
		})
		.catch(error => console.log(error))
	}

	render() {
		return (
			<div className="tile">
				<form onBlur={this.handleBlur}>
					<input className='input' type="text" name="title" placeholder='Product Name' 
						value={this.state.title} onChange={this.handleInput}
						ref={this.props.titleRef} />
					<textarea className='input' type="text" name="description" placeholder='Enter Description' 
						value={this.state.description} onChange={this.handleInput}></textarea>
					<input className='input' type="text" name="votes" placeholder='votes' 
						value={this.state.votes} onChange={this.handleInput} />
				</form>
			</div>
		)
	}
}

export default ProductForm