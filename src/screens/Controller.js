import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
class Controller extends Component {
    constructor() {
        super();
        this.baseUrl = "http://localhost:8080/api";
    }
    render() {
        return (
            <div>
              <Router>
  
            </Router>
    
            </div>
        ); 
    }
}
export default Controller;