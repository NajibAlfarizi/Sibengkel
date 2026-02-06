interface CardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  color?: string
  subtitle?: string
}

export default function Card({ title, value, icon, color = 'blue', subtitle }: CardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`text-${color}-500 text-3xl opacity-80`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
