"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Heart, SquareCheck, Brush, BowArrow } from "lucide-react";

export default function CommunityPage() {
  return (
    <div className="flex flex-col lg:flex-row w-full gap-6 px-4 sm:px-6 lg:px-4 py-4">
      {/* Main Feed */}
      <div className="flex-1 max-w-2xl mx-auto">
        {/* Post creation card */}
        <Card className="p-4 mb-6 border-none">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <img
              src="/ava.svg"
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />

            {/* Input */}
            <Input
              placeholder="Share your collection or your new word"
              className="flex-1 !border-none shadow-none rounded-full bg-[#F9FAFB] text-sm"
            />
          </div>
        </Card>

        {/* Example user posts */}
        {[1, 2, 3].map((id) => (
          <Card key={id} className="p-4 mb-4 border-none">
            <div className="flex items-center gap-3 mb-2">
              <img
                src="/ava.svg"
                alt="Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-gray-800">User {id}</p>
                <p className="text-xs text-gray-500">2h ago</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              Just shared my IELTS Vocabulary Collection. Perfect for exam
              preparation!
            </p>
            <div className="w-full flex justify-between mt-2 items-center bg-[#EEF2FF] rounded-[16px] p-4">
              <div>
                <h1 className="font-bold text-black text-[18px]">Technology</h1>
                <p className="text-[14px] text-[#939393]">Likes: 10</p>
              </div>
              <div>
                <Button className="bg-[#3675FF] hover:bg-[#2563EB] text-white">
                  Save
                </Button>
              </div>
            </div>
            <div className=" inline-flex items-center gap-2 mt-4">
              <Heart strokeWidth={1.5} />
              <p>10</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Right Column (Friends + Challenge Room) */}
      <div className="hidden lg:flex flex-col w-80 space-y-6">
        {/* Friends list */}
        <Card className="p-4 border-none">
          <h3 className="font-bold text-[20px] text-black mb-3">Friends</h3>
          <div className="space-y-2">
            {["Alice", "Bob", "Charlie"].map((name) => (
              <div key={name} className="flex items-center gap-3">
                <img
                  src="/ava.svg"
                  alt="Avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold text-[16px] text-black">{name}</p>
                  <p className="text-[14px] text-[#939393]">2h ago</p>
                </div>
              </div>
            ))}
          </div>
          <Link href={"/community/friends"}>
            <p className="text-[14px] text-[#2563EB] mt-3 text-center">
              View all
            </p>
          </Link>
        </Card>

        {/* Challenge Room */}
        <Card className="p-4 border-none">
          <h3 className="font-bold text-[20px] text-black mb-3">
            Challenge Room
          </h3>
          <Button className="w-full h-22 flex-col bg-[#F9E6E6] hover:bg-[#f4d6d6] hover:shadow-md text-black transition-all duration-200">
            <SquareCheck color="#C30000" className="mt-4 !w-6 !h-6" />
            <p className="mb-4 font-medium text-[14px]">Definition Match</p>
          </Button>

          <Button className="w-full h-22 flex-col bg-[#F6F2FF] hover:bg-[#ebe2ff] hover:shadow-md text-black mt-4 transition-all duration-200">
            <Brush color="#6C4DAD" className="mt-4 !w-6 !h-6" />
            <p className="mb-4 font-medium text-[14px]">Fill in the Blank</p>
          </Button>

          <Button className="w-full h-22 flex-col bg-[#E6F5F1] hover:bg-[#d6eee6] hover:shadow-md text-black mt-4 transition-all duration-200">
            <BowArrow color="#00966D" className="mt-4 !w-6 !h-6" />
            <p className="mb-4 font-medium text-[14px]">Word Shooter</p>
          </Button>

          <Link href={"/community/challenge"}>
            <p className="text-[14px] text-[#2563EB] mt-4 text-center">
              Explore
            </p>
          </Link>
        </Card>
      </div>
    </div>
  );
}
