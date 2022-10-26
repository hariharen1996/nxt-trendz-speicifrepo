/* eslint-disable react/no-unknown-property */
// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import SimilarProductItem from '../SimilarProductItem/index'
import Header from '../Header/index'
import './index.css'

const constantTypes = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {data: [], qty: 1, apiStatus: constantTypes.initial}

  componentDidMount() {
    this.getProductsDetails()
  }

  getProductsDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: constantTypes.loading})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = {
        singleProducts: {
          id: data.id,
          imageUrl: data.image_url,
          title: data.title,
          brand: data.brand,
          totalReviews: data.total_reviews,
          rating: data.rating,
          availability: data.availability,
          price: data.price,
          description: data.description,
        },
        similarProducts: data.similar_products.map(item => ({
          id: item.id,
          imageUrl: item.image_url,
          title: item.title,
          style: item.style,
          price: item.price,
          description: item.description,
          brand: item.brand,
          totalReviews: item.total_reviews,
          rating: item.rating,
          availability: item.availability,
        })),
      }
      this.setState({data: updatedData, apiStatus: constantTypes.success})
    } else if (response.status === 404) {
      this.setState({apiStatus: constantTypes.failure})
    }
  }

  decrementQty = () => {
    const {qty} = this.state
    if (qty > 1) {
      this.setState(prevState => ({
        qty: prevState.qty - 1,
      }))
    }
  }

  incrementQty = () => {
    this.setState(prevState => ({
      qty: prevState.qty + 1,
    }))
  }

  renderLoading = () => (
    <div testid="loader" className="loading-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Product Not Found</h1>
      <Link to="/products" className="btn-container">
        <button className="shop-btn" type="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderSuccess = () => {
    const {data, qty} = this.state
    const {singleProducts, similarProducts} = data
    const {
      title,
      imageUrl,
      brand,
      availability,
      rating,
      totalReviews,
      price,
      description,
    } = singleProducts
    return (
      <div className="single-products-container">
        <div className="single-products-card">
          <div className="single-image-container">
            <img src={imageUrl} className="single-img" alt="product" />
          </div>
          <div className="single-content">
            <h1 className="single-prod-heading">{title}</h1>
            <p className="single-prod-price">Rs {price}/-</p>
            <div className="ratings-reviews">
              <div className="ratings-container">
                <p className="ratings-text">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png "
                  alt="star"
                  className="star"
                />
              </div>
              <p className="review-text">{totalReviews} Reviews</p>
            </div>
            <p className="single-description">{description}</p>
            <div className="para-container">
              <p className="single-avail">Available: </p>
              <p className="status">{availability}</p>
            </div>
            <div className="para-container">
              <p className="single-brand">Brand:</p>
              <p className="status">{brand}</p>
            </div>
            <hr className="line" />
            <div className="qty-container">
              <button
                type="button"
                testid="minus"
                className="click-btn"
                onClick={this.decrementQty}
              >
                <BsDashSquare className="qty-icon" />
              </button>

              <p className="qty-number">{qty}</p>
              <button
                type="button"
                testid="plus"
                className="click-btn"
                onClick={this.incrementQty}
              >
                <BsPlusSquare className="qty-icon" />
              </button>
            </div>
            <div className="cart-btn">
              <button className="add-cart-btn" type="button">
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
        <h1 className="similar-products-heading">Similar Products</h1>
        <ul className="similar-products-container">
          {similarProducts.map(item => (
            <SimilarProductItem item={item} key={item.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case constantTypes.success:
        return this.renderSuccess()
      case constantTypes.failure:
        return this.renderFailure()
      case constantTypes.loading:
        return this.renderLoading()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="bg-container">{this.renderDetails()}</div>
      </>
    )
  }
}

export default ProductItemDetails
