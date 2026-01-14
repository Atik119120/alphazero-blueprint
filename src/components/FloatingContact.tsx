import { motion } from "framer-motion";
import { Mail, MessageCircle } from "lucide-react";

const FloatingContact = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed right-6 bottom-6 z-50 flex flex-col gap-3"
    >
      <motion.a
        href="https://wa.me/8801410190019"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={24} />
      </motion.a>
      <motion.a
        href="mailto:agency.alphazero@gmail.com"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Send Email"
      >
        <Mail size={24} />
      </motion.a>
    </motion.div>
  );
};

export default FloatingContact;
