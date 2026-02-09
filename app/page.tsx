"use client";

import React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { VOTING_CENTERS } from "@/lib/centers";
import { cn } from "@/lib/utils";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    area: "",
    startTime: "",
    endTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [centerOpen, setCenterOpen] = useState(false);
  const [centerSearch, setCenterSearch] = useState("");
  const [count, setCount] = useState<number | null>(null);
  const centerDropdownRef = React.useRef<HTMLDivElement>(null);
  const centerInputRef = React.useRef<HTMLInputElement>(null);

  // Close center dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (centerDropdownRef.current && !centerDropdownRef.current.contains(e.target as Node)) {
        setCenterOpen(false);
      }
    };
    if (centerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [centerOpen]);

  // Filter centers based on search
  const filteredCenters = React.useMemo(() => {
    if (!centerSearch.trim()) return VOTING_CENTERS;
    const query = centerSearch.trim().toLowerCase();
    return VOTING_CENTERS.filter((center) =>
      center.toLowerCase().includes(query)
    );
  }, [centerSearch]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/count");
        if (res.ok) {
          const data = await res.json();
          setCount(data.count);
        }
      } catch (error) {
        console.error("Failed to fetch count:", error);
        setCount(0);
      }
    };

    fetchCount();
  }, []);

  const banglaTimeOptions = [
    { value: "06:00", label: "সকাল ৬টা" },
    { value: "07:00", label: "সকাল ৭টা" },
    { value: "08:00", label: "সকাল ৮টা" },
    { value: "09:00", label: "সকাল ৯টা" },
    { value: "10:00", label: "সকাল ১০টা" },
    { value: "11:00", label: "সকাল ১১টা" },
    { value: "12:00", label: "দুপুর ১২টা" },
    { value: "13:00", label: "দুপুর ১টা" },
    { value: "14:00", label: "দুপুর ২টা" },
    { value: "15:00", label: "বিকাল ৩টা" },
    { value: "16:00", label: "বিকাল ৪টা" },
    { value: "17:00", label: "বিকাল ৫টা" },
    { value: "18:00", label: "সন্ধ্যা ৬টা" },
    { value: "19:00", label: "সন্ধ্যা ৭টা" },
    { value: "20:00", label: "রাত ৮টা" },
    { value: "21:00", label: "রাত ৯টা" },
    { value: "22:00", label: "রাত ১০টা" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setCount((prev) => (prev !== null ? prev + 1 : 1));
        toast({
          title: "সফলভাবে জমা হয়েছে",
          description: "আপনার তথ্য সফলভাবে সংরক্ষিত হয়েছে।",
        });
        setFormData({ name: "", area: "", startTime: "", endTime: "" });
      } else {
        throw new Error("Submission failed");
      }
    } catch {
      toast({
        title: "ত্রুটি",
        description: "দয়া করে আবার চেষ্টা করুন।",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#fafcfa] overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 shadow-lg safe-top">
        {/* Top accent line */}
        <div className="h-1 bg-gradient-to-r from-red-600 via-[#00a651] to-red-600" />
        <div className="bg-[#00a651]">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2.5 sm:px-6 sm:py-3.5 safe-x">
            <div className="flex items-center gap-2 shrink-0 min-w-0">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-5 sm:h-5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h1 className="text-sm sm:text-lg md:text-xl font-bold text-white tracking-tight truncate">
                জাতীয় দায়িত্ব
              </h1>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-2.5 py-1.5 sm:px-4 sm:py-2 shrink-0">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
              </span>
              <p className="text-[11px] sm:text-sm font-semibold text-white whitespace-nowrap">
                <span className="font-black text-yellow-300 tabular-nums">
                  {count !== null ? count.toLocaleString("bn-BD") : "..."}
                </span>
                <span className="ml-1">জন নিবন্ধিত</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-b from-[#fafcfa] to-gray-50/30">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-10 lg:py-16 safe-x">
          <div className="grid gap-8 sm:gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16 items-start">

            {/* Left Column - Content */}
            <div className="space-y-5 sm:space-y-6 lg:space-y-8 lg:pt-4 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-red-50 border-2 border-red-200 px-3.5 py-1.5 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-semibold text-red-600 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse shrink-0"></span>
                কেন্দ্র রক্ষার আহ্বান
              </div>

              {/* Title */}
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-[22px] xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight">
                  আমরাই হবো{" "}
                  <span className="text-[#00a651]">কেন্দ্রের প্রহরী</span>
                </h2>
                <div className="h-1.5 w-16 sm:w-20 rounded-full bg-gradient-to-r from-[#00a651] to-[#00d668] mx-auto lg:mx-0 shadow-sm" />
              </div>

              {/* Description */}
              <p className="text-[13px] xs:text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                দীর্ঘ ১৭ বছর আওয়ামী শাসনামলের পর, হাজারো শহীদের রক্তের বিনিময়ে যেই অধিকার পেয়েছি, সেই অধিকার রক্ষার দায়িত্বও আমাদেরই।
              </p>
              <p className="text-[13px] xs:text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                আপনার উপস্থিতিই পারে সেই অধিকারের রক্ষাকবচ হয়ে যেকোনো অপশক্তি রুখে দাঁড়াতে, তাই আরো একবার নিজের শক্ত কাঁধে তুলে নিন আরো একটি গুরুদায়িত্ব- কেন্দ্র রক্ষা করতেই হবে!
              </p>

              {/* CTA Button */}
              <Button
                asChild
                className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 active:bg-red-800 px-5 py-3 sm:px-8 sm:py-3.5 text-sm sm:text-base font-semibold rounded-xl shadow-lg hover:shadow-xl active:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 touch-manipulation border-2 border-red-700"
              >
                <a
                  href={process.env.NEXT_PUBLIC_VOTING_CENTER_URL ?? "#"}
                  className="inline-flex items-center justify-center gap-2"
                >
                  <span>আপনার ভোটকেন্দ্র জানতে ক্লিক করুন</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 sm:w-[18px] sm:h-[18px]"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              </Button>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3.5 sm:gap-4 pt-2">
                <div className="rounded-xl border-2 border-green-100 bg-gradient-to-br from-green-50 via-white to-green-50/30 p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-all hover:border-green-200">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#00a651] text-white shadow-sm shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-base sm:text-2xl font-bold text-[#00a651] truncate leading-none">{count !== null ? count.toLocaleString("bn-BD") : "..."}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">নিবন্ধিত স্বেচ্ছাসেবক</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border-2 border-green-100 bg-gradient-to-br from-green-50 via-white to-green-50/30 p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-all hover:border-green-200">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#00a651] text-white shadow-sm shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-base sm:text-2xl font-bold text-[#00a651] leading-none">{VOTING_CENTERS.length.toLocaleString("bn-BD")}+</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">ভোটকেন্দ্র সংযুক্ত</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Form Card */}
            <div className="lg:sticky lg:top-20">
              <div className="rounded-2xl border-2 border-gray-200 bg-white p-5 sm:p-6 md:p-8 shadow-xl relative overflow-hidden">
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00a651] via-red-500 to-[#00a651]" />
                {/* Form Header */}
                <div className="mb-6 sm:mb-6 text-center pt-2">
                  <div className="mx-auto mb-2.5 sm:mb-3 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#00a651] shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[22px] sm:h-[22px]"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                  </div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">নিবন্ধন করুন</h2>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500">কয়েক সেকেন্ডে সম্পন্ন করুন</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-xs sm:text-sm font-semibold text-gray-700"
                    >
                      আপনার নাম
                    </label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="border-2 border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#00a651] focus:ring-2 focus:ring-[#00a651]/20 transition-all h-11 text-sm sm:text-base rounded-xl"
                      placeholder="নাম লিখুন"
                    />
                  </div>

                  {/* Center Selection */}
                  <div>
                    <label
                      className="mb-2 block text-xs sm:text-sm font-semibold text-gray-700"
                    >
                      আপনার কেন্দ্র নির্বাচন করুন
                    </label>
                    <div className="relative" ref={centerDropdownRef}>
                      {/* Trigger button */}
                      <button
                        type="button"
                        onClick={() => {
                          setCenterOpen((prev) => !prev);
                          if (!centerOpen) {
                            setTimeout(() => centerInputRef.current?.focus(), 50);
                          }
                        }}
                        className={cn(
                          "w-full flex items-center justify-between border-2 bg-gray-50/50 font-normal text-left h-auto min-h-[44px] whitespace-normal transition-all text-xs sm:text-sm rounded-xl touch-manipulation px-3.5 py-2.5",
                          centerOpen
                            ? "border-[#00a651] ring-2 ring-[#00a651]/20 bg-white"
                            : "border-gray-200 hover:bg-gray-100 hover:border-[#00a651]"
                        )}
                      >
                        <span className={`line-clamp-2 ${formData.area ? "text-gray-900" : "text-gray-400"}`}>
                          {formData.area || "কেন্দ্র খুঁজুন বা নির্বাচন করুন..."}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`ml-2 shrink-0 opacity-50 sm:w-4 sm:h-4 transition-transform duration-200 ${centerOpen ? "rotate-180" : ""}`}><path d="m6 9 6 6 6-6"/></svg>
                      </button>

                      {/* Dropdown panel */}
                      {centerOpen && (
                        <div className="absolute z-50 mt-1.5 w-full rounded-xl border-2 border-gray-200 bg-white shadow-xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
                          {/* Search input */}
                          <div className="flex items-center gap-2 border-b-2 border-gray-100 px-3 py-2.5 bg-gray-50/80">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            <input
                              ref={centerInputRef}
                              type="text"
                              value={centerSearch}
                              onChange={(e) => setCenterSearch(e.target.value)}
                              placeholder="কেন্দ্রের নাম লিখে খুঁজুন..."
                              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                              autoComplete="off"
                            />
                            {centerSearch && (
                              <button
                                type="button"
                                onClick={() => setCenterSearch("")}
                                className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                              </button>
                            )}
                          </div>

                          {/* Results count */}
                          {centerSearch.trim() && (
                            <div className="px-3 py-1.5 text-[10px] sm:text-xs text-gray-400 bg-gray-50/50 border-b border-gray-100">
                              {filteredCenters.length > 0
                                ? `${filteredCenters.length.toLocaleString("bn-BD")}টি কেন্দ্র পাওয়া গেছে`
                                : "কোনো কেন্দ্র পাওয়া যায়নি"}
                            </div>
                          )}

                          {/* Scrollable list */}
                          <div className="max-h-[40vh] sm:max-h-[250px] overflow-y-auto overscroll-contain">
                            {filteredCenters.length === 0 ? (
                              <div className="flex flex-col items-center justify-center py-8 px-4 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-50"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/></svg>
                                <p className="text-sm font-medium">কোনো কেন্দ্র পাওয়া যায়নি</p>
                                <p className="text-xs mt-0.5">অন্য নামে খুঁজে দেখুন</p>
                              </div>
                            ) : (
                              filteredCenters.map((center, index) => {
                                const isSelected = formData.area === center;
                                return (
                                  <button
                                    type="button"
                                    key={index}
                                    onClick={() => {
                                      setFormData({ ...formData, area: center });
                                      setCenterOpen(false);
                                      setCenterSearch("");
                                    }}
                                    className={cn(
                                      "w-full flex items-start gap-2.5 px-3 py-2.5 text-left text-sm leading-snug transition-colors touch-manipulation cursor-pointer",
                                      isSelected
                                        ? "bg-[#00a651]/10 text-[#00a651]"
                                        : "hover:bg-gray-50 active:bg-gray-100 text-gray-700"
                                    )}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className={`mt-0.5 shrink-0 ${isSelected ? "opacity-100 text-[#00a651]" : "opacity-0"}`}
                                    >
                                      <path d="M20 6 9 17l-5-5" />
                                    </svg>
                                    <span className={isSelected ? "font-medium" : ""}>{center}</span>
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label
                      className="mb-2 block text-xs sm:text-sm font-semibold text-gray-700"
                    >
                      আপনার অবস্থানের আনুমানিক সময়
                    </label>
                    <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2.5 sm:gap-3">
                      <div>
                        <label className="mb-1 block text-[10px] sm:text-xs text-gray-500 font-semibold">শুরু</label>
                        <Select
                          value={formData.startTime}
                          onValueChange={(value: string) =>
                            setFormData({ ...formData, startTime: value })
                          }
                        >
                          <SelectTrigger className="w-full border-2 border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#00a651] focus:ring-2 focus:ring-[#00a651]/20 transition-all h-11 text-xs sm:text-sm rounded-xl touch-manipulation">
                            <SelectValue placeholder="সময়" />
                          </SelectTrigger>
                          <SelectContent>
                            {banglaTimeOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value} className="text-xs sm:text-sm py-2.5 touch-manipulation">
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-center h-11">
                        <span className="text-gray-300 font-medium text-base sm:text-lg leading-none">—</span>
                      </div>
                      <div>
                        <label className="mb-1 block text-[10px] sm:text-xs text-gray-500 font-semibold">শেষ</label>
                        <Select
                          value={formData.endTime}
                          onValueChange={(value: string) =>
                            setFormData({ ...formData, endTime: value })
                          }
                        >
                          <SelectTrigger className="w-full border-2 border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#00a651] focus:ring-2 focus:ring-[#00a651]/20 transition-all h-11 text-xs sm:text-sm rounded-xl touch-manipulation">
                            <SelectValue placeholder="সময়" />
                          </SelectTrigger>
                          <SelectContent>
                            {banglaTimeOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value} className="text-xs sm:text-sm py-2.5 touch-manipulation">
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#00a651] text-white hover:bg-[#008f45] active:bg-[#007a3b] h-12 text-sm sm:text-base font-bold rounded-xl shadow-md hover:shadow-lg active:shadow-sm transition-all duration-200 mt-2 disabled:opacity-50 touch-manipulation"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        জমা হচ্ছে...
                      </span>
                    ) : (
                      "নিবন্ধন সম্পন্ন করুন"
                    )}
                  </Button>
                </form>

                {/* Trust Badge */}
                <div className="mt-4 sm:mt-5 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 sm:w-3.5 sm:h-3.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                  <span>আপনার তথ্য যত্নের সাথে সংরক্ষিত</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#00a651] py-5 sm:py-8 safe-bottom">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center safe-x">
          <p className="text-xs sm:text-sm text-white/90 font-medium">
            &copy; {new Date().getFullYear()} আমরাই হবো কেন্দ্রের প্রহরী
          </p>
          <p className="text-[10px] sm:text-xs text-white/60 mt-1">
            একসাথে গড়ি সুরক্ষিত বাংলাদেশ
          </p>
        </div>
      </footer>
    </div>
  );
}
