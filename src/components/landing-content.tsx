// Testimonials section of the landing page
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const testimonials = [
    {
        name: "Sarah",
        avatar: "S",
        title: "Blogger and Content Marketer",
        description: "As a content creator, I often struggled with writer's block, but this tool gave me instant inspiration and generated high-quality content in seconds. It's a game-changer for my productivity!"
    },
    {
        name: "Mark",
        avatar: "M",
        title: "Small Business Owner",
        description: "I run a small business and needed catchy product descriptions. This AI not only crafted compelling content but also adapted its tone to match my brand perfectly. My sales have increased since implementing these engaging descriptions!"
    },
    {
        name: "Emily",
        avatar: "E",
        title: "Social Media Influencer",
        description: "I was skeptical about using an AI generator for my social media posts, but I'm glad I gave it a try. This tool helped me consistently post fresh and engaging content, keeping my audience hooked. It's like having an AI-driven social media guru by my side, boosting my online presence!"
    },
    {
        name: "Alex",
        avatar: "A",
        title: "University Student",
        description: "As a student, writing essays and research papers used to be daunting tasks. Thanks to this AI generator, I no longer fear those late-night writing sessions. The AI's insightful suggestions and coherent structure made my academic writing shine, earning me higher grades and reducing my stress levels!"
    },
];

export const LandingContent = () => {
    return (
        <div className="px-10 pb-20">
            <h2 className="text-center text-4xl text-white font-extrabold mb-10">
                Testimonials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {testimonials.map((item) => (
                <Card key={item.description} className="bg-[#192339] border-none text-white">
                    {/* header */}
                    <CardHeader>
                        {/* name and title */}
                        <CardTitle className="flex items-center gap-x-2">
                            <div>
                                <p className="text-lg">{item.name}</p>
                                <p className="text-zinc-400 text-sm">{item.title}</p>
                            </div>
                        </CardTitle>
                        {/* content */}
                        <CardContent className="pt-4 px-0">
                            {item.description}
                        </CardContent>
                    </CardHeader>
                </Card>
            ))}
            </div>
        </div>
    )
};