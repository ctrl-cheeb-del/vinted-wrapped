"use client";

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface StatCardProps {
  index: number;
  title: string;
  Icon: LucideIcon;
  value: string | number;
  description: string;
  color: string;
  inView: boolean;
  isLastSlide?: boolean;
  fitNumber?: boolean;
}

const formatValue = (value: string | number) => {
  if (typeof value === 'number') {
    return value.toLocaleString();
  }
  return value;
};

export function StatCard({ index, title, Icon, value, description, color, inView, isLastSlide, fitNumber }: StatCardProps) {
  return (
    <motion.div
      className="w-full h-full flex items-center justify-center p-6 relative"
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-md space-y-8 text-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-12">{title}</h2>
          <Icon className={`w-20 h-20 mx-auto mb-8 ${color}`} />
          <div className="space-y-4">
            <motion.h3
              className="text-7xl font-bold"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.2 }}
              style={{ 
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                maxWidth: '100%',
                WebkitFontSmoothing: 'antialiased'
              }}
            >
              {formatValue(value)}
            </motion.h3>
            <motion.p
              className="text-xl opacity-80"
              initial={{ y: 20, opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 0.6 }}
            >
              {description}
            </motion.p>
          </div>
        </motion.div>

        {isLastSlide && (
          <motion.div 
            className="mt-16 flex justify-center items-center gap-12"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.8 }}
          >
            <Link
              href="https://resoled.it"
              target="_blank"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/resoled.png"
                alt="Resoled"
                width={48}
                height={48}
                className="object-contain"
              />
            </Link>
            
            <Link
              href="https://vinta.app"
              target="_blank"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/vinta.png"
                alt="Vinta"
                width={48}
                height={48}
                className="object-contain"
              />
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}