"use client";
import { User } from "@/components/User/User";

export default function UserPage(props) {
    const { id, name, superhero } = props.params;
    return <User roomId={id} name={name} superHeroImage={superhero} />;
}