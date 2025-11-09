interface NetworkCardProps {
  title: string;
  icon: string;
  value: string;
  description: string;
}

export default function NetworkCard({
  title,
  icon,
  value,
  description,
}: NetworkCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {title}
          </h3>
        </div>
      </div>
      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2 break-words">
        {value}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
}

