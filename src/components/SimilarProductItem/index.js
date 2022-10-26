// Write your code here
import {Component} from 'react'
import './index.css'

class SimilarProductItem extends Component {
  render() {
    const {item} = this.props
    const {imageUrl, title, price, brand, rating} = item
    return (
      <li className="similar-product-lists">
        <img
          src={imageUrl}
          className="similar-prod-image"
          alt={`similar product ${title}`}
        />
        <h1 className="similar-heading">{title}</h1>
        <p className="similar-text">by {brand}</p>
        <div className="category">
          <p className="similar-price">{price}</p>
          <div className="similar-ratings">
            <p className="similar-sub-rating">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              className="similar-stars"
              alt="star"
            />
          </div>
        </div>
      </li>
    )
  }
}

export default SimilarProductItem
