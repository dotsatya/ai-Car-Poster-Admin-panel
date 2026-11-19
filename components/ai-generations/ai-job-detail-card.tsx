"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { AiGenerationJob } from "@/lib/demoAiGenerations"

interface AiJobDetailCardProps {
  job: AiGenerationJob
}

export function AiJobDetailCard({ job }: AiJobDetailCardProps) {
  // State badge style
  const getStateBadge = (state: AiGenerationJob["state"]) => {
    switch (state) {
      case "Completed":
        return "bg-emerald-950/70 text-emerald-400 border-emerald-800/40"
      case "Processing":
        return "bg-amber-950/70 text-amber-400 border-amber-800/40"
      case "Failed":
        return "bg-[#2a0e11] text-rose-400 border-rose-900/40"
      case "Queued":
        return "bg-zinc-800/70 text-zinc-300 border-zinc-700/40"
    }
  }

  // Type badge style
  const getTypeBadge = (type: AiGenerationJob["type"]) => {
    switch (type) {
      case "Combined":
        return "bg-blue-950/80 text-blue-400 border-blue-800/40"
      case "Individual":
      default:
        return "bg-zinc-800/70 text-zinc-300 border-zinc-700/40"
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Back to AI generations link */}
      <div>
        <Link
          href="/dashboard/ai-generations"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to AI generations</span>
        </Link>
      </div>

      {/* Main Job Card */}
      <div className="rounded-md border border-border/80 bg-card p-6 sm:p-7 text-card-foreground shadow-sm space-y-6">
        {/* Top Header Row: Job #G-8830 and Type / State badges */}
        <div className="flex items-center justify-between pb-1">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Job {job.id}
          </h1>

          <div className="flex items-center gap-2">
            <span
              className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border ${getTypeBadge(
                job.type
              )}`}
            >
              {job.type}
            </span>

            <span
              className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-md border ${getStateBadge(
                job.state
              )}`}
            >
              {job.state}
            </span>
          </div>
        </div>

        {/* 3-Column Metadata Row: Customer, Template, Custom text */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-1">
          <div>
            <span className="text-xs text-muted-foreground block mb-1">
              Customer
            </span>
            <span className="text-sm font-semibold text-foreground">
              {job.customer}
            </span>
          </div>

          <div>
            <span className="text-xs text-muted-foreground block mb-1">
              Template
            </span>
            <span className="text-sm font-semibold text-foreground">
              {job.template || job.templates}
            </span>
          </div>

          <div>
            <span className="text-xs text-muted-foreground block mb-1">
              Custom text
            </span>
            <span className="text-sm font-semibold text-foreground">
              {job.customText || "Not used"}
            </span>
          </div>
        </div>

        {/* Attempt Row */}
        <div>
          <span className="text-xs text-muted-foreground block mb-1">
            Attempt
          </span>
          <span className="text-sm font-semibold text-foreground">
            {job.attempt || "1 of 3 allowed"}
          </span>
        </div>

        {/* 2-Column Asset Preview Cards: Uploaded car photo & Output */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          {/* Uploaded car photo */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Uploaded car photo
            </h3>
            <div className="relative rounded-md border border-border/60 bg-[#141618] h-48 sm:h-52 flex flex-col items-center justify-center p-4 text-center overflow-hidden">
              {job.carPhotoInfo.image ? (
                <>
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={job.carPhotoInfo.image}
                      alt={job.carPhotoInfo.fileName}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-background/85 backdrop-blur-sm border border-border/50 py-1 px-2 rounded text-[11px] text-muted-foreground font-mono truncate">
                    {job.carPhotoInfo.fileName} · {job.carPhotoInfo.dimensions}
                  </div>
                </>
              ) : (
                <span className="text-xs text-muted-foreground font-medium font-mono">
                  {job.carPhotoInfo.fileName} · {job.carPhotoInfo.dimensions}
                </span>
              )}
            </div>
          </div>

          {/* Output */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Output
            </h3>
            {job.state === "Failed" || !job.outputInfo?.image ? (
              <div className="rounded-md border border-rose-950/60 bg-[#250d0f] h-48 sm:h-52 flex items-center justify-center p-4 text-center">
                <span className="text-xs font-medium text-rose-400">
                  No output created
                </span>
              </div>
            ) : (
              <div className="relative rounded-md border border-border/60 bg-[#141618] h-48 sm:h-52 flex flex-col items-center justify-center p-4 text-center overflow-hidden group">
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={job.outputInfo.image}
                    alt="Generated Poster Output"
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                {job.outputInfo.dimensions && (
                  <div className="absolute bottom-2 left-2 right-2 bg-background/85 backdrop-blur-sm border border-border/50 py-1 px-2 rounded text-[11px] text-muted-foreground font-mono truncate">
                    Generated poster · {job.outputInfo.dimensions}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Error Section (if applicable) */}
        {job.error && (
          <div className="space-y-1 pt-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-1">
              Error
            </h3>
            <p className="text-xs sm:text-sm text-rose-400 font-normal leading-relaxed">
              {job.error}
            </p>
          </div>
        )}

        {/* Bottom 2-Column Section: Timeline & Customer usage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-3">
          {/* Timeline */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Timeline
            </h3>
            <div className="space-y-1.5 text-xs sm:text-sm font-semibold text-foreground">
              {job.timeline.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span>{item.time}</span>
                  <span className="text-muted-foreground font-normal">·</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer usage */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Customer usage
            </h3>
            <div className="space-y-1 text-xs sm:text-sm font-semibold text-foreground">
              <p>
                Individual: {job.customerUsage.individualUsed} of{" "}
                {job.customerUsage.individualTotal} used
              </p>
              <p>
                Combined: {job.customerUsage.combinedUsed} of{" "}
                {job.customerUsage.combinedTotal} used
              </p>
            </div>
            <div className="pt-2">
              <Link
                href={
                  job.customerId
                    ? `/dashboard/customers/${job.customerId}`
                    : `/dashboard/customers`
                }
                className="inline-flex items-center gap-1 text-xs sm:text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                <span>Open customer</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
