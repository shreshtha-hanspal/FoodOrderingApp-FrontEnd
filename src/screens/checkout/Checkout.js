import React, {Component} from 'react';
import './Checkout.css';
// import 'bootstrap/dist/css/bootstrap.css';
import {withStyles} from '@material-ui/core/styles';
import Header from '../../common/header/Header';
import Grid from '@material-ui/core/Grid';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({

    stepperButton: {
        marginTop: theme.spacing(2),
        marginRight: theme.spacing(2),
    },
    mainContainer: {
        marginBottom: theme.spacing(2) * 2,
    },
    summaryCard: {
        paddingRight: theme.spacing(2) * 2,
    },
    resetContainer: {
        padding: theme.spacing(2) * 3,
    },
    tabRoot: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    existingAddressTab: {
        float: 'left',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    gridList: {
        flexWrap: 'nowrap',
        transform: 'translateZ(0)',
        overflowY: 'hidden',
    },
    existingAddressGridListTile: {
        marginBottom: '50px',
        cursor: 'pointer',
    },
    existingAddressGridListTile2: {
        padding: '25px',
    },
    existingAddressCircle: {
        float: 'right',
        marginRight: '10px',
    },
    newAddressStateSelect: {
        width: '194px',
    },
    radioRoot: {
        display: 'flex',
    },
    radioFormControl: {
        margin: theme.spacing(2) * 3,
    },
    radioGroup: {
        margin: `${theme.spacing(2)}px 0`,
    },
    summaryCardDivider: {
        marginTop: '5px',
    },
    paddingLeft2per: {
        paddingLeft: theme.spacing(2)
    },
    padding2PerRight:{
        paddingRight: theme.spacing(0)
    },
    placeOrderButton: {
        marginTop: '20px',
        marginRight: '20px',
    },
    greyColor: {
        color: 'grey',
    },
});

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 50 * 4 + 8,
            width: 300,
        },
    },
};

function getSteps() {
    return ['Delivery', 'Payment'];
};

function TabContainer(props) {
    return (
        <Typography component='div' style={{padding: 8 * 3}}>
            {props.children}
        </Typography>
    )
};

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

class Checkout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customerCart: {},
            activeStep: 0,
            tabValue: 0,
            selectedExistingAddress: null,
            flatBuildingNoRequired: 'display-none',
            flatBuildingNo: '',
            localityRequired: 'display-none',
            locality: '',
            cityRequired: 'display-none',
            city: '',
            stateRequired: 'display-none',
            newAddressState: '',
            pincodeRequired: 'display-none',
            pincodeRequiredMsg: 'required',
            pincode: '',
            customerExistingAddresses: [],
            states: [],
            paymentModes: [],
            radioValue: '',
            selectedPaymentMode: null,
            openPlaceOrderMsg: false,
            orderId: '',
            placeOrderMsg: '',
            couponName: "",
            couponNameRequired: "dispNone",
            couponNameHelpText: "dispNone",
        }
    };

    preState = {
        activeStep: 0,
    };

    UNSAFE_componentWillMount() {
        if(sessionStorage.getItem('access-token') !== null && this.props.location.checkoutCart !== undefined){
        this.setState({
            customerCart: this.props.location.checkoutCart
        });
        let self = this;

        //customer addresses requests
        let dataCustomerAddress = null;
        let xhrCustomerAddress = new XMLHttpRequest();
        xhrCustomerAddress.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                self.setState({
                    customerExistingAddresses: JSON.parse(this.responseText).addresses
                });
            }
        });
        xhrCustomerAddress.open('GET', `${this.props.baseUrl}/address/customer`);
        xhrCustomerAddress.setRequestHeader('authorization', 'Bearer ' + sessionStorage.getItem('access-token'));
        xhrCustomerAddress.send(dataCustomerAddress);

        //states requests
        let dataStates = null;
        let xhrStates = new XMLHttpRequest();
        xhrStates.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                self.setState({states: JSON.parse(this.responseText).states});
            }
        });
        xhrStates.open('GET', `${this.props.baseUrl}/states`);
        xhrStates.send(dataStates);


        // payment modes request
        let dataPaymentModes = null;
        let xhrPaymentModes = new XMLHttpRequest();
        xhrPaymentModes.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                self.setState({
                    paymentModes: JSON.parse(this.responseText).paymentMethods
                });
            }
        });
        xhrPaymentModes.open('GET', `${this.props.baseUrl}/payment`);
        xhrPaymentModes.send(dataPaymentModes);
    }else{
        this.props.history.push("/");
    }
    };


    componentWillUnmount() {

    }

    componentDidMount() {

    }

    //Change the handler for Next click
    stepperNextHandler = () => {
        let self = this;

        if (this.state.activeStep === 0 && this.state.selectedExistingAddress === null) {
            return;
        }
        if (this.state.activeStep === 1 && this.state.selectedPaymentMode === null) {
            return;
        }

        self.setState(preState => ({
            activeStep: preState.activeStep + 1,
        }));
    };

    //Change the handler for Back click
    stepperBackHandler = () => {
        this.setState(preState => ({
            activeStep: preState.activeStep - 1,
        }));
    };

    //Steps reset
    stepperResetHandler = () => {
        this.setState({
            activeStep: 0,
        });
    };

    //Tabs change
    tabChangeHandler = (event, value) => {
        this.setState({tabValue: value});
    };

    existingAddressOnClickHandler = (addressId) => {
        this.setState({
            [this.state.selectedExistingAddress]: 'unselect-address',
            selectedExistingAddress: addressId,
            [addressId]: 'select-address',
        });
    };

    //Flat change handler
    flatBuildingNoChangeHandler = event => {
        this.setState({flatBuildingNo: event.target.value});
    };

    //Localoty change handler
    localityChangeHandler = event => {
        this.setState({locality: event.target.value});
    };

    //City change handler
    cityChangeHandler = event => {
        this.setState({city: event.target.value});
    };

    //State change handler
    stateChangeHandler = event => {
        this.setState({newAddressState: event.target.value});
    };

    //Pincode change handler
    pincodeChangeHandler = event => {
        this.setState({pincode: event.target.value});
    };

    //On click of save function
    saveAddressOnClickHandler = () => {
        let self = this;

        let flatBuildingNoReq = false;
        if (this.state.flatBuildingNo === '') {
            self.setState({flatBuildingNoRequired: 'display-block'});
            flatBuildingNoReq = true;
        } else {
            self.setState({flatBuildingNoRequired: 'display-none'});
        }

        let localityReq = false;
        if (this.state.locality === '') {
            self.setState({localityRequired: 'display-block'});
            localityReq = true;
        } else {
            self.setState({localityRequired: 'display-none'});
        }

        let cityReq = false;
        if (this.state.city === '') {
            self.setState({cityRequired: 'display-block'});
            cityReq = true;
        } else {
            self.setState({cityRequired: 'display-none'});
        }

        let stateReq = false;
        if (this.state.newAddressState === '') {
            self.setState({stateRequired: 'display-block'});
            stateReq = true;
        } else {
            self.setState({stateRequired: 'display-none'});
        }

        let pincodeReq = false;
        if (this.state.pincode === '') {
            self.setState({
                pincodeRequired: 'display-block',
                pincodeRequiredMsg: 'required'
            });
            pincodeReq = true;
        } else {
            self.setState({pincodeRequired: 'display-none'});
        }

        let validatePincode = new RegExp('^[1-9][0-9]{5}$');
        if (pincodeReq === false && validatePincode.test(this.state.pincode) === false) {
            self.setState({
                pincodeRequired: 'display-block',
                pincodeRequiredMsg: 'Pincode must contain only numbers and must be 6 digits long'
            });
            return;
        }

        if (flatBuildingNoReq || localityReq || cityReq || stateReq || pincodeReq) {
            return;
        }

        let stateUUID = '';
        for (let state of this.state.states) {
            if (state.state_name === this.state.newAddressState) {
                stateUUID = state.id;
            }
        }


        let dataNewAddress = {
            'city': this.state.city,
            'flat_building_name': this.state.flatBuildingNo,
            'locality': this.state.locality,
            'pincode': this.state.pincode,
            'state_uuid': stateUUID
        }
        let xhrNewAddress = new XMLHttpRequest();
        xhrNewAddress.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                let dataCustomerAddress = null;
                let xhrCustomerAddress = new XMLHttpRequest();
                xhrCustomerAddress.addEventListener('readystatechange', function () {
                    if (this.readyState === 4) {
                        self.setState({
                            customerExistingAddresses: JSON.parse(this.responseText).addresses,
                        });
                    }
                });
                xhrCustomerAddress.open('GET', `${self.props.baseUrl}/address/customer`);
                xhrCustomerAddress.setRequestHeader('authorization', 'Bearer ' + sessionStorage.getItem('access-token'));
                xhrCustomerAddress.send(dataCustomerAddress);
                window.alert('New address added!');
            }
        });
        xhrNewAddress.open('POST', `${self.props.baseUrl}/address`);
        xhrNewAddress.setRequestHeader('authorization', 'Bearer ' + sessionStorage.getItem('access-token'));
        xhrNewAddress.setRequestHeader('Content-Type', 'application/json');
        xhrNewAddress.send(JSON.stringify(dataNewAddress));
    };

    //Radio button changed
    radioChangeHandler = event => {
        this.setState({radioValue: event.target.value});
    };

    //Radio button handler
    radioClickHandler = (paymentId) => {
        this.setState({selectedPaymentMode: paymentId});
    };

    //On click of order button
    placeOrderOnClickHandler = () => {

        let self = this;

        let itemQuantities = this.state.customerCart.cartItems.map(
            function (i) {
                return {
                    'item_id': i.item.id,
                    'price': i.item.price * i.quantity,
                    'quantity': i.quantity
                }
            }
        );

        let dataPlaceOrder = {
            'address_id': this.state.selectedExistingAddress,
            'bill': this.state.customerCart.totalPrice,
            'coupon_id': '2ddf6284-ecd0-11e8-8eb2-f2801f1b9fd1',
            'discount': 0,
            'item_quantities': itemQuantities,
            'payment_id': this.state.selectedPaymentMode,
            'restaurant_id': this.state.customerCart.restaurantDetails.id
        }
        let xhrPlaceOrder = new XMLHttpRequest();
        xhrPlaceOrder.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                let responseText = JSON.parse(this.responseText);
                if (responseText.status === 'ORDER SUCCESSFULLY PLACED') {
                    self.setState({
                        openPlaceOrderMsg: true,
                        orderId: responseText.id,
                        placeOrderMsg: `Order placed successfully! Your order ID is ${responseText.id}.`
                    });
                } else {
                    self.setState({
                        openPlaceOrderMsg: true,
                        orderId: '',
                        placeOrderMsg: 'Unable to place your order! Please try again!'
                    });
                }
            }
        })
        xhrPlaceOrder.open('POST', `${this.props.baseUrl}/order`);
        xhrPlaceOrder.setRequestHeader('authorization', 'Bearer ' + sessionStorage.getItem('access-token'));
        xhrPlaceOrder.setRequestHeader('Content-Type', 'application/json');
        xhrPlaceOrder.send(JSON.stringify(dataPlaceOrder));
    };

    //Close and place order
    placeOrderMsgOnCloseHandler = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({openPlaceOrderMsg: false});
    };

    //Nagigate to Profile Page
    clickProfileHandler = () => {
        this.props.history.push("/profile");
    }

    render() {
        const {classes} = this.props;
        const steps = getSteps();
        const {activeStep} = this.state;
        const {tabValue} = this.state;

        return sessionStorage.getItem('access-token') !== null && this.props.location.checkoutCart !== undefined ? (
            <div>
                <Header clickProfile={this.clickProfileHandler} />
                <Grid container={true}>
                    <Grid item={true} xs={8}>
                        <div>
                            <Stepper activeStep={activeStep} orientation='vertical'>
                                {steps.map((label, index) => (
                                    <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                        <StepContent>
                                            {index === 0 ?
                                                <div className={classes.tabRoot}>
                                                    <AppBar position='static'>
                                                        <Tabs value={tabValue} onChange={this.tabChangeHandler}>
                                                            <Tab label='EXISTING ADDRESS'/>
                                                            <Tab label='NEW ADDRESS'/>
                                                        </Tabs>
                                                    </AppBar>


                                                    {tabValue === 0 &&
                                                    <TabContainer className={classes.existingAddressTab}>
                                                        {this.state.customerExistingAddresses.length === 0 ?
                                                            <Typography variant='h6' color='textSecondary'>
                                                                There are no saved addresses! You can save an address
                                                                using the 'New Address' tab or using your 'Profile' menu
                                                                option.
                                                            </Typography>
                                                            :
                                                            <GridList
                                                                className={classes.gridList}
                                                                cols={3}
                                                                cellHeight='auto'>
                                                                {this.state.customerExistingAddresses.map(address => (
                                                                    <GridListTile
                                                                        key={'address' + address.id}
                                                                        id={this.state[address.id] || 'unselect-address'}
                                                                        onClick={() => this.existingAddressOnClickHandler(address.id)}
                                                                        className={classes.existingAddressGridListTile}
                                                                        classes={{tile: classes.existingAddressGridListTile2}}>

                                                                        <Typography variant='subtitle1'>
                                                                            {address.flat_building_name}
                                                                        </Typography>

                                                                        <Typography variant='subtitle1'>
                                                                            {address.locality}
                                                                        </Typography>

                                                                        <Typography variant='subtitle1'>
                                                                            {address.city}
                                                                        </Typography>

                                                                        <Typography variant='subtitle1'>
                                                                            {address.state.state_name}
                                                                        </Typography>

                                                                        <Typography variant='subtitle1'>
                                                                            {address.pincode}
                                                                        </Typography>

                                                                        <div
                                                                            style={{color: this.state[address.id] === 'select-address' ? 'green' : 'grey'}}>
                                                                            <CheckCircleIcon
                                                                                className={classes.existingAddressCircle}/>
                                                                        </div>


                                                                    </GridListTile>
                                                                ))}
                                                            </GridList>
                                                        }
                                                    </TabContainer>
                                                    }


                                                    {tabValue === 1 &&
                                                    <TabContainer>
                                                        <FormControl required>
                                                            <InputLabel htmlFor='flatBuildingNo'>Flat / Building
                                                                No.</InputLabel>
                                                            <Input
                                                                id='flatBuildingNo'
                                                                type='text'
                                                                flatbuildingno={this.state.flatBuildingNo}
                                                                value={this.state.flatBuildingNo}
                                                                onChange={this.flatBuildingNoChangeHandler}
                                                            />
                                                            <FormHelperText
                                                                className={this.state.flatBuildingNoRequired}
                                                                error={true}>
                                                                <span>required</span>
                                                            </FormHelperText>
                                                        </FormControl>
                                                        <br/><br/>

                                                        <FormControl required>
                                                            <InputLabel htmlFor='locality'>Locality</InputLabel>
                                                            <Input
                                                                id='locality'
                                                                type='text'
                                                                locality={this.state.locality}
                                                                value={this.state.locality}
                                                                onChange={this.localityChangeHandler}/>
                                                            <FormHelperText className={this.state.localityRequired}
                                                                            error={true}>
                                                                <span>required</span>
                                                            </FormHelperText>
                                                        </FormControl>
                                                        <br/><br/>

                                                        <FormControl required>
                                                            <InputLabel htmlFor='city'>City</InputLabel>
                                                            <Input
                                                                id='city'
                                                                type='text'
                                                                city={this.state.city}
                                                                value={this.state.city}
                                                                onChange={this.cityChangeHandler}/>
                                                            <FormHelperText className={this.state.cityRequired}
                                                                            error={true}>
                                                                <span>required</span>
                                                            </FormHelperText>
                                                        </FormControl>
                                                        <br/><br/>

                                                        <FormControl required className={classes.newAddressFormControl}>
                                                            <InputLabel htmlFor='newAddressstate'>State</InputLabel>
                                                            <Select
                                                                id='newAddressstate'
                                                                newaddressstate={this.state.newAddressState}
                                                                value={this.state.newAddressState}
                                                                onChange={this.stateChangeHandler}
                                                                className={classes.newAddressStateSelect}
                                                                MenuProps={MenuProps}>
                                                                {this.state.states.map(state => (
                                                                    <MenuItem key={'state' + state.id}
                                                                              value={state.state_name}>
                                                                        {state.state_name}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                            <FormHelperText className={this.state.stateRequired}
                                                                            error={true}>
                                                                <span>required</span>
                                                            </FormHelperText>
                                                        </FormControl>
                                                        <br/><br/>

                                                        <FormControl required>
                                                            <InputLabel htmlFor='pincode'>Pincode</InputLabel>
                                                            <Input
                                                                id='pincode'
                                                                type='text'
                                                                pincode={this.state.pincode}
                                                                value={this.state.pincode}
                                                                onChange={this.pincodeChangeHandler}/>
                                                            <FormHelperText className={this.state.pincodeRequired}
                                                                            error={true}>
                                                                <span>{this.state.pincodeRequiredMsg}</span>
                                                            </FormHelperText>
                                                        </FormControl>
                                                        <br/><br/>

                                                        <Button
                                                            variant='contained'
                                                            color='secondary'
                                                            onClick={this.saveAddressOnClickHandler}>
                                                            Save Address
                                                        </Button>
                                                    </TabContainer>
                                                    }
                                                </div>
                                                : ''
                                            }

                                            {index === 1 ?
                                                <div className={classes.radioRoot}>
                                                    <FormControl component='fieldset'
                                                                 className={classes.radioFormControl}>
                                                        <FormLabel component='legend'>Select Mode of Payment</FormLabel>
                                                        <RadioGroup
                                                            aria-label='paymentModes'
                                                            name='paymentModes'
                                                            className={classes.radioGroup}
                                                            value={this.state.radioValue}
                                                            onChange={this.radioChangeHandler}
                                                        >
                                                            {this.state.paymentModes.map(paymentMode => (
                                                                <FormControlLabel
                                                                    key={'paymentMode' + paymentMode.id}
                                                                    value={paymentMode.payment_name.toLowerCase()}
                                                                    control={<Radio/>}
                                                                    label={paymentMode.payment_name}
                                                                    onClick={() => this.radioClickHandler(paymentMode.id)}
                                                                />
                                                            ))}
                                                        </RadioGroup>
                                                    </FormControl>
                                                </div>
                                                : ''
                                            }


                                            <div className={classes.mainContainer}>
                                                <div>
                                                    <Button
                                                        disabled={activeStep === 0}
                                                        onClick={this.stepperBackHandler}
                                                        className={classes.stepperButton}
                                                    >
                                                        Back
                                                    </Button>
                                                    <Button
                                                        variant='contained'
                                                        color='primary'
                                                        onClick={this.stepperNextHandler}
                                                        className={classes.stepperButton}
                                                    >
                                                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </StepContent>
                                    </Step>
                                ))}
                            </Stepper>
                            {activeStep === steps.length && (
                                <Paper square elevation={0} className={classes.resetContainer}>
                                    <Typography variant='h6'>
                                        View the summary &#38; place your order now!
                                    </Typography>
                                    <Button onClick={this.stepperResetHandler} className={classes.stepperButton}>
                                        CHANGE
                                    </Button>
                                </Paper>
                            )}
                        </div>
                    </Grid>


                    <Grid item={true} xs className={classes.summaryCard}>
                        <Card id='summary-card'>
                            <CardContent>
                                <div className='container'>
                                    <Typography variant='h5'>
                                        Summary
                                    </Typography>
                                    <br/>
                                    <Typography variant='h6' color='textSecondary' gutterBottom>
                                        {this.state.customerCart.restaurantDetails.restaurant_name}
                                    </Typography>
                                    {this.state.customerCart.cartItems.map(item => (
                                        <div key={'item' + item.item.id + item.item.item_name}
                                             className='row w-100 no-gutters'>
                                            <div className='p-1 col-0'
                                                 style={{color: item.item.item_type === 'NON_VEG' ? 'red' : 'green'}}>
                                                <i className='fa fa-stop-circle-o'></i>
                                            </div>
                                            <div
                                                className='p-1 col-6 capital grey-color align-item-md-left'>{item.item.item_name}</div>
                                            <div
                                                className='p-1 col-1 grey-color align-item-md-left'>{item.quantity}</div>
                                            <div className='p-1 col-3 grey-color align-item-md-left'>
                                                <i className='fa fa-inr'></i>{item.item.price * item.quantity}.00
                                            </div>
                                        </div>
                                    ))}

                                    <Divider className={classes.summaryCardDivider}/>
                                    <div className='row w-100 no-gutters'>
                                        <div className='p-1 col-6'>Net Amount</div>
                                        <div className='p-1 col-1'></div>
                                        <div className='p-1 col-1'></div>
                                        <div className='p-1 col-4'>
                                            <i className='fa fa-inr grey-color align-items-end'></i>
                                            {this.state.customerCart.totalPrice}.00
                                        </div>
                                    </div>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        className={classes.placeOrderButton}
                                        fullWidth={true}
                                        onClick={this.placeOrderOnClickHandler}>
                                        Place Order
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.openPlaceOrderMsg}
                    autoHideDuration={5000}
                    onClose={this.placeOrderMsgOnCloseHandler}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    message={<span id='message-id'>{this.state.placeOrderMsg}</span>}
                    action={[
                        <IconButton
                            key='close'
                            aria-label='Close'
                            color='inherit'
                            onClick={this.placeOrderMsgOnCloseHandler}
                        >
                            <CloseIcon/>
                        </IconButton>,
                    ]}
                />
            </div>
        ) : "";
    }
}

Checkout.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(Checkout);