import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "./BrandLogo";
import useBrandIntro from "./useBrandIntro";

const BrandIntro = () => {
  const show = useBrandIntro();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
            }}
          >
            <BrandLogo />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BrandIntro;