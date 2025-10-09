import React, { useState } from "react";
import Marquee from "react-fast-marquee";

// Domain logo list
const domains = [
  {
    name: "ACM - ICPC",
    img: "https://icpc.global/regionals/abouticpc/foundationlogo.png",
  },
  {
    name: "Kaggle",
    img: "https://img.icons8.com/?size=100&id=Omk4fWoSmCHm&format=png&color=000000",
  },
  {
    name: "IOT-ML",
    img: "https://img.icons8.com/?size=100&id=Ih6zOUuHwOOs&format=png&color=000000",
  },
  {
    name: "ML-Research",
    img: "https://img.icons8.com/?size=100&id=114322&format=png&color=000000",
  },
  {
    name: "DevOps",
    img: "https://img.icons8.com/?size=100&id=13816&format=png&color=000000",
  },
  {
    name: "Flutter Development",
    img: "https://img.icons8.com/?size=100&id=7I3BjCqe9rjG&format=png&color=000000",
  },
  {
    name: "React Development",
    img: "https://img.icons8.com/?size=100&id=123603&format=png&color=000000",
  },
  {
    name: "Open Source Hackathon",
    img: "https://img.icons8.com/?size=100&id=63655&format=png&color=000000",
  },
  {
    name: "Interview Prep",
    img: "https://img.icons8.com/?size=100&id=13724&format=png&color=000000",
  },
];

const Card = ({ img, name }: { img: string; name: string }) => {
  return (
    <figure
      className=
        "relative w-64 cursor-pointer overflow-hidden rounded-xl p-4"
    >
      <div className="flex flex-col items-center">
        <img
          className="rounded-full"
          style={{
          width: 46,
          height: 46,
          objectFit: "contain",
          filter: "grayscale(100%)",
        }}
          alt=""
          src={img}
        />
        <figcaption className="font-light text-sm">{name}</figcaption>
      </div>
    </figure>
  );
};

export default function Domains() {
  return (
    <div className="relative p-5">
      <Marquee pauseOnHover className="[--duration:30s]">
        {domains.map((domain) => (
          <Card key={domain.name} {...domain} />
        ))}
      </Marquee>
    </div>
  );
}