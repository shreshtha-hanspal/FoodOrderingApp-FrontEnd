// //Sample HomePage 

// import React, {Component} from 'react';
// //import './Home.css';
// import Header from '../../common/header/Header';

// class Home extends Component{
//     render(){
//         return(
//             <div>
//                 <Header showSearchBox={true} baseUrl={this.props.baseUrl}/>
//             </div>
//         )    
//     }
// }

// export default Home;

import React, { Component } from 'react';
import Header from '../../common/header/Header';
//import { Route, Link } from 'react-router-dom';
import * as Utils from "../../common/Utils/Utils";
// import * as Constants from "../../common/Constants";
import RestaurantCard from '../card/RestaurantCard.js';
import Grid from '@material-ui/core/Grid';
import { withStyles } from "@material-ui/core/styles";
import './Home.css';


const styles = {
    resCard: { width: "90%", cursor: "pointer" }
};

class Home extends Component {

    constructor() {
        super();
        this.state = {
            imageData: [],
            data: []
        }
    }

    componentDidMount() {
        this.getAllImageData();
    }

    // Get all restuarants data
    getAllImageData = () => {
        const requestUrl = this.props.baseUrl + "restaurant";
        const that = this;
        Utils.makeApiCall(
            requestUrl,
            null,
            null,
            'GET',
            null,
            responseText => {
                that.setState(
                    {
                        imageData: JSON.parse(responseText).restaurants
                    }
                );
            },
            () => { }
        );
    };

    //Logout action from drop down menu on profile icon
    loginredirect = () => {
        sessionStorage.clear();
        this.props.history.push({
            pathname: "/"
        });
        window.location.reload();
    }

    // Restaurant search by name
    searchHandler = (event) => {
        let that = this;
        let dataRestaurants = null;
        let xhrRestaurants = new XMLHttpRequest();
        xhrRestaurants.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                if (!JSON.parse(this.responseText).restaurants) {
                    that.setState({
                        imageData: null,
                    })
                } else {
                    that.setState({
                        imageData: JSON.parse(this.responseText).restaurants,
                    })
                }
            }
        })
        //console.log(this.props.baseUrl)
        if (event.target.value === '') {
            xhrRestaurants.open('GET', `${this.props.baseUrl}restaurant`);
        } else {
           //console.log(`${this.props.baseUrl}restaurant/name/${event.target.value}`);
            xhrRestaurants.open('GET', `${this.props.baseUrl}restaurant/name/${event.target.value}`);
        }
        xhrRestaurants.send(dataRestaurants);
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Header logoutHandler={this.loginredirect} baseUrl={this.props.baseUrl} searchHandler={this.searchHandler} showSearchBox={true} history={this.props.history} />
                <div className="mainContainer">
                    {
                        this.state.imageData === null ? <span style={{ fontSize: "20px" }}>No restaurant with the given name</span>
                            : (
                                (this.state.imageData || []).map((resItem, index) =>
                                    <div key={"div" + index} className="restaurantCard">
                                        <Grid className="gridCard" key={index}>
                                            <RestaurantCard
                                                resId={resItem.id}
                                                resURL={resItem.photo_URL}
                                                resName={resItem.restaurant_name}
                                                resFoodCategories={resItem.categories}
                                                resCustRating={resItem.customer_rating}
                                                resNumberCustRated={resItem.number_customers_rated}
                                                avgPrice={resItem.average_price}
                                                classes={classes}
                                                index={index}
                                            />
                                        </Grid>
                                    </div>
                                )
                            )
                    }
                </div>

            </div>
        )
    }
}

export default withStyles(styles)(Home);