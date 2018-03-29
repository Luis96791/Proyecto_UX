
import React, {Component} from 'react'

class Product extends Component {
	handleClick = () => { this.props.onClick(this.props.product.id) }
	handleDelete = () => { this.props.onDelete(this.props.product.id) }

	render() {
		return (
			<div className="tile">
				<span className="deleteButton" onClick={this.handleDelete}>x</span>
				<h4 onClick={this.handleClick}>{this.props.product.title}</h4>
				<p onClick={this.handleClick}>{this.props.product.description}</p>
				<p onClick={this.handleClick}>votes: {this.props.product.votes}</p>
			</div>
		)
	}
}
	

export default Product