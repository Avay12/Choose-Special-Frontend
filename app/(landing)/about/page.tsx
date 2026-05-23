"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { HandHeart, BadgeCheck, PackageCheck, Truck } from "lucide-react";

const VALUES = [
  {
    icon: HandHeart,
    title: "Made with Love",
    description:
      "Every card is designed with care and attention to the smallest details.",
  },
  {
    icon: BadgeCheck,
    title: "Premium Quality",
    description:
      "We use the finest sustainably sourced paper and printing techniques.",
  },
  {
    icon: PackageCheck,
    title: "Safe Delivery",
    description:
      "Your cards are packed securely to ensure they arrive in perfect condition.",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description:
      "Orders are processed and shipped within 24 hours of placement.",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center gap-16 mb-24 md:mb-32">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:w-1/2"
        >
          <p className="text-[#e26b58] font-bold tracking-widest text-sm uppercase mb-4">
            OUR STORY
          </p>
          <h1 className="font-heading text-5xl md:text-6xl font-bold mb-8 leading-tight">
            Sharing joy, one <br /> card at a time.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            Choose Special started with a simple belief: that a physical card
            carries a weight of emotion that digital messages simply cannot
            match. What began as a small studio in 2018 has grown into a
            destination for beautifully crafted stationery.
          </p>
          <div className="flex gap-12">
            <div>
              <p className="text-3xl font-bold mb-1">150k+</p>
              <p className="text-sm text-muted-foreground uppercase font-semibold">
                Cards Sent
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">98%</p>
              <p className="text-sm text-muted-foreground uppercase font-semibold">
                Happy Customers
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="lg:w-1/2 relative"
        >
          <div className="aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
            <Image
              src="/images/products/birthday.png"
              alt="Design Studio"
              fill
              className="object-cover"
            />
          </div>
          {/* Decorative element */}
          <div className="absolute -top-8 -right-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10" />
        </motion.div>
      </div>

      {/* Values Section */}
      <div className="bg-muted/50 rounded-[4rem] px-8 py-20 md:p-24 mb-32">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-heading text-4xl font-bold mb-6 text-foreground">
            Our Core Values
          </h2>
          <p className="text-muted-foreground">
            The principles that guide everything we do, from design to delivery.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {VALUES.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
                <value.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-xl mb-3">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className="font-heading text-4xl font-bold mb-8">
          Ready to find the perfect card?
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/occasions"
            className="bg-primary text-white font-bold px-10 py-5 rounded-full shadow-lg shadow-primary/20 hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
          >
            Browse All Cards
          </Link>
          <Link
            href="/login"
            className="bg-white border text-foreground font-bold px-10 py-5 rounded-full hover:bg-muted/50 transition-all"
          >
            Join Our Community
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
