import React, {Component} from 'react';
import './Details.css';
import Header from '../../common/header/Header.js';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import 'font-awesome/css/font-awesome.min.css';
import Divider from '@material-ui/core/Divider';
import Add from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import 'font-awesome/css/font-awesome.min.css';
// import '@fortawesome/fontawesome-free-solid';
// import '@fortawesome/fontawesome-svg-core';
// // import '@fortawesome/fontawesome-free-regular';

import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';


const styles = theme => ({
    root: {
        flexGrow: 1,
        paddingLeft: theme.spacing(2)*2
    },
    paper: {
        padding: theme.spacing(0),
        textAlign: "left",
        border: "none",
        boxShadow: "none",
        backgroundColor: "#e8e9eb"
    },
    cardContent:{
        paddingLeft:theme.spacing(2)*3
    }
});

class Details extends Component{
    constructor(props){
        super(props);
        this.state ={
            restaurant_name: null,
            photo_URL: null,
            locality: null,
            categories: [],
            restaurant_id:this.props.match.params.restaurantId,
            average_price: null,
            number_customers_rated: null,
            customer_rating: null,
            cartItemsList: [],
            cartTotalPrice: 0,
        }
    }

    componentDidMount() {
        const {
            history: {
                location: {
                    pathname,
                } = {},
            } = {},
        } = this.props;
        let id = pathname.split('/')[2];
        this.getRestaurantDetails(id);
        console.log(id);
    };

    //Takes restaurant ID as parameter and stores details of a restaurant fetched-based-on-ID
    getRestaurantDetails = (id) => {
        let res_url = `${this.props.baseUrl}/restaurant/${id}`;
        console.log(res_url)
        return fetch(res_url, {
            method: 'GET',
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
        }).then((res) => {
            this.setState({
                restaurant_name: res.restaurant_name,
                photo_URL: res.photo_URL,
                customer_rating: res.customer_rating,
                average_price: res.average_price,
                number_customers_rated: res.number_customers_rated,
                locality: res.address.locality,
                categories: res.categories,
                cartItems: 0,
                restaurant_id: id,
            });
        }).catch((error) => {
            console.log('error getting data', error);
        });
    };

    //Handle message bar
    messageBarHandler = (message) => {
        this.setState({
            messagebarOpen: !this.state.messagebarOpen,
            messagebarMessage: message,
        });
    }

    //checkout handler- Handles logic on click of checkout Button
    checkoutHandler = () => {
        if (this.state.cartItems === 0) {
            this.messageBarHandler("Please add an item to your cart!");
        } else if (!sessionStorage.getItem("access-token")) {
            this.messageBarHandler("Please login first!");
        } else {
            let checkoutCart = {
                restaurantDetails: {
                    'average_price': this.state.average_price,
                    'categories': this.state.categories,
                    'customer_rating': this.state.customer_rating,
                    'id': this.state.restaurant_id,
                    'number_customers_rated': this.state.number_customers_rated,
                    'photo_URL': this.state.photo_URL,
                    'restaurant_name': this.state.restaurant_name,
                },
                cartItems: this.state.cartItemsList,
                totalPrice: this.state.cartTotalPrice
            };
            sessionStorage.setItem('customer-cart',checkoutCart);
            this.props.history.push({
                pathname: "/checkout",
                checkoutCart: checkoutCart
            })
        }
    }

    //Add an item to My cart
    addItemHandler = (item) => {
        this.messageBarHandler("Item added to cart!");
        let cartItemsList = this.state.cartItemsList;
        var cartItem;
        let cartItems = cartItemsList.map((el) => el.item);
        let index = cartItems.indexOf(item);
        if (index === -1) {
            cartItem = {
                item: item,
                quantity: 1,
            }
            cartItemsList.push(cartItem);
        } else {
            cartItemsList[index].quantity += 1;
            cartItem = cartItemsList[index]
        }

        this.setState({
            cartItems: this.state.cartItems + 1,
            cartItemsList: cartItemsList,
            cartTotalPrice: this.state.cartTotalPrice + cartItem.item.price,
        });
    }

    //Increase item count in cart
    increaseItemInCartHandler = (cartItem) => {
        this.messageBarHandler("Item quantity increased by 1!");
        let cartItemsList = this.state.cartItemsList;
        let index = cartItemsList.indexOf(cartItem);
        cartItemsList[index].quantity += 1;
        this.setState({
            cartItems: this.state.cartItems + 1,
            cartItemsList: cartItemsList,
            cartTotalPrice: this.state.cartTotalPrice + cartItem.item.price,
        });
    }

    //Decrease item count from cart
    decreaseItemInCartHandler = (cartItem) => {
        let cartItemsList = this.state.cartItemsList;
        let index = cartItemsList.indexOf(cartItem);
        cartItemsList[index].quantity -= 1;
        if (cartItemsList[index].quantity === 0) {
            cartItemsList.splice(index, 1);
            this.messageBarHandler("Item removed from cart!");
        } else {
            this.messageBarHandler("Item quantity decreased by 1!");
        }
        this.setState({
            cartItems: this.state.cartItems - 1,
            cartItemsList: cartItemsList,
            cartTotalPrice: this.state.cartTotalPrice - cartItem.item.price,
        })
    }

    render() {
        //const {classes} = this.props;
        return(
            <div>
                {/* Header section */}
                <Header showSearchBox={false} clickProfileIcon={this.onProfileIconClick} baseUrl={this.props.baseUrl}/>
                {/* Restaurant details section */}
                <div className="restaurant-section grey-color-bg">
                    <Grid container direction="row" spacing={0}>
                        <Grid item xs={2}>
                                <div className="">
                                    <div>
                                        <img src={this.state.photo_URL} alt='restaurant' width="240px" height="220px"/>
                                    </div>
                                </div>
                        </Grid>
                        <Grid item xs={10}  className="left-section">
                            
                                <div className="">
                                    <Grid container direction="row" spacing={0}>
                                        <Grid item xs={12}> 
                                                <div>
                                                    <Typography variant="h4"> {this.state.restaurant_name} </Typography>
                                                    <Typography variant="h6" > {this.state.locality} </Typography>
                                                    <Typography variant="body1"> {this.state.categories
                                                    && Array.isArray(this.state.categories)
                                                    && this.state.categories.length > 0
                                                    && this.state.categories.map((el) => el.category_name).join(", ")} </Typography>
                                                </div>
                                        </Grid>
                                    </Grid>
                                    <div>
                                        <Grid container direction="row" spacing={0}>
                                                <Grid item xs={6}>
                                                        <div>
                                                            <i className="fa fa-star"
                                                            aria-hidden="true"> {this.state.customer_rating} </i>
                                                            <br/>
                                                            <Typography variant="caption" className="grey-color-font">
                                                                AVERAGE RATING BY <br/>
                                                                <span
                                                                    className="font-weight-bold"> {this.state.number_customers_rated} </span> CUSTOMERS
                                                            </Typography>
                                                        </div> 
                                                </Grid>
                                                <Grid item xs={6}>     
                                                        <div>
                                                            <i className="fa fa-inr "
                                                            aria-hidden="true"> {this.state.average_price} </i>
                                                            <br/>
                                                            <Typography variant="caption" className="grey-color-font">
                                                                AVERAGE COST FOR <br/> TWO PEOPLE
                                                            </Typography>
                                                        </div>
                                                </Grid>
                                        </Grid>
                                    </div>
                                </div>
                        </Grid>        
                    </Grid>
                </div>
                {/* Details of items based on category in a restaurant */}
                <div className="category-cart-container">
                    <div className="menu-cart-section">
                        <div className='menu'>
                            <div style={{padding: '3%'}}>
                                {this.state.categories.map(categoryItem =>
                                    <div key={categoryItem.id}>
                                        <CategoryItem item={categoryItem} this={this}/>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* checkout cart code */}
                    <div className="space-for-cart">
                    </div>
                    <div className="cart">
                        <div className="padding-5percent">
                            <Card className="card" >
                                <CardContent className={styles.cardContent}>
                                    <div>
                                        <div style={{float: "left", width: "10%"}}><Badge
                                            badgeContent={this.state.cartItems === null ? 0 : this.state.cartItems}
                                            color="primary"><ShoppingCartIcon/></Badge></div>
                                        <div style={{float: "right", width: "90%"}}>
                                            <Typography variant="h5" gutterBottom style={{fontWeight: 'bold'}}>
                                                My Cart
                                            </Typography></div>
                                    </div>
                                    {this.state.cartItemsList.map(cartItem =>
                                        <div key={cartItem.item.id}>
                                            <CartItem item={cartItem} this={this}/>
                                        </div>
                                    )}
                                    <div style={{display: "inline-block", width: "90%", paddingTop: "3%", paddingLeft: "2%"}}>
                                        <div style={{float: "left"}}>
                                            <Typography variant="body1" gutterBottom style={{fontWeight: 'bold'}}>
                                                TOTAL AMOUNT </Typography></div>
                                        <div style={{float: "right", width: ""}}>
                                            <i className="fa fa-inr" aria-hidden="true"> </i> {this.state.cartTotalPrice.toFixed(2)}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardActions>
                                    <div style={{paddingLeft: "8%",paddingRight: "8%",width:"100%"}}>
                                        <Button variant="contained" color="primary"
                                                onClick={this.checkoutHandler} style={{width:"100%"}}> CHECKOUT </Button>
                                    </div>
                                </CardActions>
                            </Card>
                        </div>
                    </div>
                </div>
                    {/* snack bar component to display messages to user */}
                    <Snackbar anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                    }}
                          open={this.state.messagebarOpen}
                          onClose={(e) => this.messageBarHandler("")}
                          autoHideDuration={2000}
                          ContentProps={{
                              'aria-describedby': 'message-id',
                          }}
                          message={<span id="message-id">{this.state.messagebarMessage}</span>}
                          action={[
                              <IconButton
                                  key="close"
                                  aria-label="Close"
                                  color="inherit"
                                  onClick={(e) => this.messageBarHandler("")}
                              >
                                  <CloseIcon/>
                              </IconButton>,
                          ]}
                />
            </div>
        )
    }
}

//Display the cart items with changed values
function CartItem(props) {
    const cartItem = props.item;
    const color = props.item
    && props.item.item.item_type && props.item.item.item_type.toString()
    && props.item.item.item_type.toLowerCase() === "non_veg" ? "red" : "green";
    return (
        <div style={{display: "flex", flexDirection: "row", width: "100%", padding: "1%"}}>
            <div style={{width: "10%", display: "flex", alignItems: "center", color: color}}>
                <i className="fa fa-stop-circle-o" aria-hidden="true"></i></div>
            <div style={{width: "40%", display: "flex", alignItems: "center", textTransform: "capitalize"}}><span
                style={{color: "grey"}}> {cartItem.item.item_name} </span></div>
            <div style={{width: "5%", display: "flex", alignItems: "center"}}>
                <i onClick={(e) => props.this.decreaseItemInCartHandler(cartItem)} className="cartButton fa fa-minus"
                   aria-hidden="true"></i>
            </div>
            <div style={{width: "5%", display: "flex", alignItems: "center"}}> {cartItem.quantity} </div>
            <div style={{width: "16%", display: "flex", alignItems: "center"}}>
                <i onClick={(e) => props.this.increaseItemInCartHandler(cartItem)} className="cartButton fa fa-plus"
                   aria-hidden="true"></i>
            </div>
            <div style={{display: "flex", alignItems: "center"}}><i className="fa fa-inr" aria-hidden="true"><span
                style={{color: "grey"}}> {cartItem.item.price.toFixed(2)} </span></i></div>
        </div>
    )
}

//Cart items calculation
function CategoryItem(props) {
    return (
        <div style={{padding: "3%"}}>
            <Typography variant="caption" gutterBottom style={{
                fontWeight: "bold",
                textTransform: "uppercase"
            }}> {props.item.category_name} </Typography>
            <Divider/>
            {props
            && props.item
            && props.item.item_list
            && Array.isArray(props.item.item_list)
            && props.item.item_list.length > 0
            && props.item.item_list.map(menuItem =>
                <div key={menuItem.id}>
                    <MenuItem item={menuItem} this={props.this}/>
                </div>
            )}
        </div>
    )
};

//Menu items of restaurant displayer
function MenuItem(props) {
    const color = props.item.item_type
    && props.item.item_type.toString()
    && props.item.item_type.toLowerCase() === "non_veg" ? "red" : "green";
    return (
        <div style={{display: "flex", flexDirection: "row", width: "100%", paddingLeft: "1%"}}>
            <div style={{width: "5%", display: "flex", alignItems: "center", color: color}}><i
                className="fa fa-circle"></i></div>
            <div style={{
                width: "65%",
                display: "flex",
                alignItems: "center",
                textTransform: "capitalize"
            }}> {props.item.item_name} </div>
            <div style={{width: "20%", display: "flex", alignItems: "center"}}>
                <i className="fa fa-inr" aria-hidden="true"> {props.item.price.toFixed(2)} </i>
            </div>
            <div style={{width: "10%", display: "flex", alignItems: "center"}}>
                <IconButton onClick={(e) => props.this.addItemHandler(props.item)}>
                    <Add style={{height: "100%"}}/></IconButton>
            </div>
        </div>
    )
};

export default Details;