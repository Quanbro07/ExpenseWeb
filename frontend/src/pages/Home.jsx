import { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import './App.css';
import Profile from './Profile'
import logo from './—Pngtree—e-wallet cartoon icon_4462733.png'

function HeadBanner() {
    return (
        <>
            <h1 className="headBanner">Ví xịn-Xài mịn</h1>
        </>
    )
}

function Sticky() {
    return (
        <div className="stickyAll">
            <img className="logo" src={logo} alt="Logo" />
            <div className="stickyDown">
                <StickyTag className="down" serviceName="Service" />
                <StickyTag className="down" serviceName="History" />
                <StickyTag className="down" serviceName="News" />
                <StickyTag className="down" serviceName="About" />
            </div>
            <form>
                <input type="text" placeholder="Need some help ?" className="searchBox" />
            </form>
            <button className="signin">Sign in</button>
            <button className="signup">Sign up</button>
        </div>
    )
}

function StickyTag({ serviceName }) {
    return (<>
        <button className="stickybutton">{serviceName}▼</button>
    </>)
}

function BigBanner() {
    return (
        <>
            <Carousel autoPlay infiniteLoop showThumbs={false}>
                <div>
                    <h1 className="bigBanner"> Cool wallet</h1>
                </div>
                <div>
                    <h1 className="bigBanner"> Your money-Our choice </h1>
                </div>
                <div>
                    <h1 className="bigBanner"> You pay-We love</h1>
                </div>
            </Carousel>
        </>
    )
}

export default function App() {
    return (
        <>
            <HeadBanner />
            <Sticky />
            <BigBanner />

        </>
    )
}
