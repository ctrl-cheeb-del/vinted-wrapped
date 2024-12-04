"use client";

import { motion } from 'framer-motion';

interface BackgroundProps {
  color: string;
}

export function Background({ color }: BackgroundProps) {
  return (
    <div className={`absolute inset-0 ${color}`} />
  );
}