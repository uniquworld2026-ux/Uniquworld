import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/shared/utils/cn'

/**
 * Scroll / mount reveal — respects prefers-reduced-motion.
 */
export function Reveal({ children, className, delay = 0, once = true, y = 28, ...props }) {
  const reduce = useReducedMotion()

  if (reduce) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-8% 0px' }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
