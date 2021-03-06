import React, {lazy, Suspense} from 'react' 
import { useParams, useHistory, Link, Route, Switch } from "react-router-dom"
import {nonInitialEffect} from "src/reactTools"

import {
  Button,
  Menu,
  Spin,
  Input,
  Modal,
  TopProgressBar, Container
} from "components/UI"

import {connect, useDispatch} from "react-redux"

import { logout } from "actions/authAction"

import "./Dashboard.scss" 

const AddressBook = lazy(()=> import("./AddressBook/AddressBook"))
const Orders = lazy(()=> import("./Orders/Orders"))
const OrderDetails = lazy(()=> import("./OrderDetails/OrderDetails"))
const AccountInfo = lazy(()=> import("./accountInfo/AccountInfo"))
const CustomerDashboard = lazy(()=> import("./CustomerDashboard"))
const CreateSellerAccount = lazy(()=>import("../SellerHub/createSellerAccount/CreateSellerAccount"))

const {SubMenu} = Menu

const Dashboard = (props) => { 
  let params = useParams() 
  let history = useHistory() 
  const dispatch = useDispatch()
  const { authState } = props
  let [collapseIds, setCollapseIds] = React.useState(["1", "2"])
  
  
  const sidebarData =  [
    {
      id: 0,
      name: "Dashboard",
      logo: "",
      to: `/customer/${authState._id ? authState.username : "guest"}`
    },
    {
      menu_section_name: "Manage My Account",
      name: "My Account",
      id: 1,
      logo: "fa fa-user",
      sub_menu: [
        {name: "Account Information", to: `/customer/${authState._id ? authState.username : "guest"}/account-info`},
        {name: "Address Book", to: `/customer/${authState._id ? authState.username : "guest"}/address-book`},
        {name: "Payment Option", to: "/dashboard/brands"},
        {name: "Vouchers", to: "/dashboard/brands"},
      ]
    },
    {
      menu_section_name: "Orders",
      name: "Orders",
      id: 2,
      logo: "fa fa-user",
      sub_menu: [
        {name: "My Orders", to: `/customer/${authState._id ? authState.username : "guest"}/my-orders`},
        {name: "My Returns", to: "/dashboard/brands"},
        {name: "My Cancellations", to: "/dashboard/brands"},
      ]
    },
    {
      name: "My Reviews",
      to: "",
      id: 33,
      logo: "fa fa-star"
    },{
      name: "My Wishlist & Followed Stores",
      to: "",
      id: 33,
      logo: "fa fa-star"
    },
    {
      name: "Setting",
      to: "",
      id: 3,
      logo: ""
    },
    {
      name: "Policies",
      to: "",
      id: 4,
      logo: ""
    },
    {
      name: "Help",
      to: "",
      id: 5,
      logo: ""
    },
    {
      name: "Sign Out",
      to: "",
      id: 6,
      logo: ""
    }
    // {
    //   menu_section_name: "My Reviews",
    //   items: [
    //     "My Reviews"
    //   ]
    // },
    // {
    //   menu_section_name: "My Wishlist & Followed Stores",
    //   items: []
    // }
  ]
  
  
  nonInitialEffect(()=>{
    if(!authState._id){
      history.push("/auth/login?redirect=dashboard")
    } 
  }, [authState && authState._id])
  
  
  function renderCustomerDashboardRoutes(){
    return (
        <Suspense fallback={<TopProgressBar/>}>
          <Switch>
          
            <Route exact={true} path="/customer/:name" 
              render={props=> <CustomerDashboard
              {...props} 
                username={authState.username} 
              _id={authState._id} 
              /> } />    
            
            
            <Route exact={true} path="/customer/:name/address-book" 
              render={props=> <AddressBook {...props} _id={authState._id} /> } />    
            
            <Route exact={true} path="/customer/:name/create-seller-account" 
              render={props=> <CreateSellerAccount 
                {...props} 
                _id={authState._id} 
              /> } />    
            
           
            <Route exact={true} path="/customer/:name/my-orders" 
              render={props=> <Orders {...props} _id={authState._id} /> } />  
              
            <Route exact={true} path="/customer/:name/my-orders/details/:orderId" 
              render={props=> <OrderDetails {...props}  _id={authState._id} /> } />    
            
            <Route 
              exact={true} 
              path="/customer/:name/account-info" 
              component={AccountInfo}
            />    
          </Switch>
        </Suspense>
      )
    
  }
  
  
  function renderSidebarMenu(){
    function toggleCollapseSubMenu(id){
      if(collapseIds.indexOf(id) !== -1){
        setCollapseIds([])
      } else{
        setCollapseIds([id])
      }
    }
    return (
      <div className="sidebar">
         { sidebarData.map(data=>(
            <div>
              {/*<label style={{fontSize: 13, marginLeft: "10px", color: "pink"}} htmlFor="">{data.menu_section_name}</label>*/}
              <Menu selectedKeys={collapseIds}>
                { data.sub_menu ? (
                  <Menu.SubMenu onClick={toggleCollapseSubMenu}
                    key={data.id.toString()}
                    title={<h1><i className={data.logo}/><span>{data.name}</span></h1>}
                  >
                    {data.sub_menu && data.sub_menu.map(s=>(
                      <Menu.Item key={s.name}><Link to={s.to}>{s.name}</Link></Menu.Item>
                    ))}
  
                  </Menu.SubMenu>
              
                ) : (
                  <Menu.Item icon={data.logo} key={data.id.toString()}>{data.name}</Menu.Item>
                  ) }
              </Menu>
            </div>
         )) }
      </div>
    )
  }

  return (
    <Container maxWidth={1688}>
        <div className="row r">
          <div className="sidebar">
        
            {/*<Menu*/}
            {/*      onClick={handleClick}*/}
            {/*      selectedKeys={["mail"]}*/}
            {/*      defaultOpenKeys={collapseIds}*/}
            {/*    >*/}
            
            {/*    <Menu.Item key="34" icon="far fa-home">*/}
            {/*     <Link to={`/customer/${authState._id ? authState.username : "guest"}`}>*/}
            {/*        Dashboard*/}
            {/*      </Link>*/}
            {/*    </Menu.Item>*/}
            {/*    <Menu.Item key="34" icon="fa fa-heart">*/}
            {/*     <Link to={`/customer/${authState._id ? authState.username : "guest"}/my-orders`}>*/}
            {/*        My Orders*/}
            {/*      </Link>*/}
            {/*    </Menu.Item>*/}
            {/*    <Menu.Item key="34" icon="fa fa-heart">My Returns</Menu.Item>*/}
            {/*    <Menu.Item key="334" icon="fa fa-heart">My Cancellations</Menu.Item>*/}
            {/*    <Menu.Item key="324" icon="fa fa-heart">My Wishlist & Followed Stores*/}
            {/*    </Menu.Item>*/}
            {/*  */}
            {/*    <Menu.Item key="324" icon="fa fa-heart">Vouchers</Menu.Item>*/}
            {/*    <Menu.Item key="324" icon="fa fa-star">My Reviews</Menu.Item>*/}
            {/*    <Menu.Item key="324" icon="fa fa-map-marker-alt">*/}
            {/*      <Link to={`/customer/${authState._id ? authState.username : "guest"}/address-book`}>Address Book*/}
            {/*      </Link>*/}
            {/*    </Menu.Item>*/}
            {/*    <Menu.Item key="324" icon="fa fa-trash">My Payment Options</Menu.Item>*/}
            {/*    <Menu.Item key="324" icon="fa fa-user">*/}
            {/*      <Link to={`/customer/${authState._id ? authState.username : "guest"}/account-info`}>*/}
            {/*        Account Information*/}
            {/*      </Link>*/}
            {/*    </Menu.Item>*/}
            {/*    <Menu.Item key="324" icon="fa fa-heart">Setting</Menu.Item>*/}
            {/*    <Menu.Item key="324" icon="fa fa-terms">Policies</Menu.Item>*/}
            {/*    <Menu.Item key="324" icon="fa fa-info-circle">Help</Menu.Item>*/}
            {/*    */}
            {/*    <Menu.Item key="324" onClick={logout} icon="fa fa-sign-out">Sign Out</Menu.Item>*/}
            {/*    */}
            {/*  </Menu>*/}
            {renderSidebarMenu()}
            
            <br/>
            
            
          </div>
          <div className="content">
            {renderCustomerDashboardRoutes()}
          </div>
        </div>
      </Container>
    )
}

function mapStateToProps(state){
  return {
    authState: state.authState
  }
}



export default connect(mapStateToProps, {logout})(Dashboard)
