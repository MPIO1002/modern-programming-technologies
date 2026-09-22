type InfoCardProps = {
    title: string;
    value: string | number;
}

export default function InfoCard({title, value}: InfoCardProps) {
    return(
        <div className="bg-gray-50 p-6 rounded-xl flex flex-col items-center justify-center border border-gray-200 shadow-sm text-center">
            <span className="text-sm text-gray-500 mb-1">{title}</span>
            <span className="text-gray-700 font-medium">{value}</span>
        </div>
    )
}
