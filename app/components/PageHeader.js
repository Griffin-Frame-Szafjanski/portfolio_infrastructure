export default function PageHeader({ title, description }) {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {title}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
}
