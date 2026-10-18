import {
  IconBarbell,
  IconRun,
  IconBike,
  IconYoga,
  IconApple,
  IconDroplet,
  IconMoon,
  IconHeartbeat,
  IconBook,
  IconTarget,
  type Icon,
} from '@tabler/icons-react'

/** Icons a habit can use. A habit stores just the `id`, so ids must stay stable. */
export const HABIT_ICONS: { id: string; label: string; Icon: Icon }[] = [
  // Fitness
  { id: 'barbell', label: 'Strength', Icon: IconBarbell },
  { id: 'run', label: 'Running', Icon: IconRun },
  { id: 'bike', label: 'Cycling', Icon: IconBike },
  { id: 'yoga', label: 'Stretching', Icon: IconYoga },
  // Health
  { id: 'apple', label: 'Nutrition', Icon: IconApple },
  { id: 'droplet', label: 'Water', Icon: IconDroplet },
  { id: 'moon', label: 'Sleep', Icon: IconMoon },
  { id: 'heartbeat', label: 'Health', Icon: IconHeartbeat },
  // Productivity
  { id: 'book', label: 'Reading', Icon: IconBook },
  { id: 'target', label: 'Focus', Icon: IconTarget },
]
