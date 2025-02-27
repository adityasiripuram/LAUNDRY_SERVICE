// import React from 'react';
// import {Link} from "react-router-dom"
// import "./navbar.css";

// const Navbar = (props) => {
//     return (
//         <><header >
//             <h4>LAUNDRY</h4>
//             <nav>
//                 <ul>
//                     <li>Home</li>
//                     <li>Pricing</li>
//                     <li>Career</li>
//                         <button onClick={props.change}><Link to={props.path} className="Link" >{props.navVariable}</Link></button>
//                 </ul>

//             </nav>
//         </header>
//     </>);
// };
// export default Navbar;

import React from 'react';
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = (props) => {
    const isLoggedIn = localStorage.getItem('token'); // Check if user is logged in

    return (
        <header>
            <h4>LAUNDRY</h4>
            <nav>
                <ul>
                    <li>Home</li>
                    <li>Pricing</li>
                    <li>Career</li>
                    {isLoggedIn ? (
                        <>
                            <li>
                                <button onClick={props.onLogout}>Logout</button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <button onClick={props.change}>
                                <Link to={props.path} className="Link">
                                    {props.navVariable}
                                </Link>
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;