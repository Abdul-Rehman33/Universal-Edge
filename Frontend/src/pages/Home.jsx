import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero/Hero.jsx";
import Navbar from "../components/Navbar/Navbar.jsx";
import Categories from "../components/Categories/Categories.jsx";
import FeaturedProducts from "../components/Features/Featuredproducts.jsx";
import Contact from "../components/Contact/contact.jsx";
import Footer from "../components/Footer/Footer.jsx";


export default function Home() {
    const location = useLocation();

    useEffect(() => {
        if (location.hash) {
            // Remove the '#' to get the ID
            const id = location.hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
                // Add a small delay to ensure DOM is fully rendered before scrolling
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [location]);

    return (
        <>

                <Navbar />
                <Hero />
                <Categories />
                <FeaturedProducts />
                <Contact />
                <Footer />
        </>
    );
}