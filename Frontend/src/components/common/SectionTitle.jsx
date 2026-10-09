const SectionTitle = ({
    title,
    description,
}) => {
    return (
        <div className="mb-5">
            <h2 className="font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {title}
            </h2>

            {description && (
                <p className="mt-1.5 text-sm leading-6 text-slate-500">
                    {description}
                </p>
            )}
        </div>
    );
};

export default SectionTitle;
