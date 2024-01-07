"use client";
import { User } from "@/components/User/User";

export default function UserPage(props) {
    const { name, superhero } = props.params;
    return <User name={name} superHeroImage={superhero} />;
}