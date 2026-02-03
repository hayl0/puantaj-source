"use client";

import { useSidebar } from "@/components/providers/SidebarProvider";
import PremiumSidebar from "./Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MobileSidebar() {
  const { isOpen, close } = useSidebar();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden"
          />
          
          {/* Sidebar Container */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.5, right: 0 }}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.x < -100 || velocity.x < -500) {
                close();
              }
            }}
            className="fixed inset-y-0 left-0 w-72 z-50 lg:hidden shadow-2xl h-full"
          >
            <div className="relative h-full">
              <PremiumSidebar />
              <Button
                variant="ghost"
                size="icon"
                onClick={close}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground md:hidden"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
