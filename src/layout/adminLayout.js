import React from "react";
import Sidebar from "../common/Sidebar/admin-sidebar";
import '../../src/assets/css/app.css'

const adminLayout = (ChildComponent) => {
    class AdminLayout extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                pageLoaded: false,
                saveLeadClickEvent: "",
                isActive: true,
                isOpen: true,
            };
        }

        toggleSidebar = () => {
            this.setState(prevState => ({
                isActive: !prevState.isActive,
                isOpen: !prevState.isOpen
            }));
        };

        // toggle = () => {
        //     this.setState((prevState) => ({
        //       isOpen: !prevState.isOpen
        //     }));
        //   };

        componentDidMount() {
            setTimeout(() => {
                this.setState(() => ({
                    pageLoaded: false
                }))
            }, 1000);
        }

        renderHtml() {
            return <div className="d-flex" id="wrapper" >
                {/* <!-- Sidebar--> */}
                <Sidebar isActive={this.state.isActive} toggleSidebar={this.toggleSidebar} />
                {/* <!-- Page content wrapper--> */}
                <div className={this.state.isActive ? 'main' : "main close "} id="page-content-wrapper">
                    <nav className="navbar-header-admin">
                    </nav>
                    {/* <!-- Page content--> */}
                    <div className="container-fluid">
                        <ChildComponent isActive={this.state.isActive} />
                    </div>
                </div>
            </div>
        }

        addLeadModalFooterContent() {
            return <>
                <div style={{ width: "100%" }}>
                    <button onClick={(e) => this.setState(() => ({ saveLeadClickEvent: (Math.random() + 1).toString(36).substring(7) }))} className="btn btn-default low-height-btn">Add Lead</button>
                </div>
            </>;
        }

        handleParentData = (e) => {
            console.log(e);
        }

        render() {
            return <>
                {this.renderHtml()}
            </>
        }
    }

    return AdminLayout;
}

export default adminLayout;