import React from "react";
import Hero from "../components/Hero/Hero.jsx";
import Navbar from "../components/Navbar/Navabr.jsx";
import Categories from "../components/Categories/Categories.jsx";
import FeaturedProducts from "../components/Features/Featuredproducts.jsx";


export default function Home() {
    return (
        <>
          <Navbar />
          <Hero />
          <Categories />
          <FeaturedProducts />
        </>
    );
}